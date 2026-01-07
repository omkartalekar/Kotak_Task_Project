const mongoose = require("mongoose");
const Slot = require("../models/TimeSlotSchema");
const Appointment = require("../models/BookingSchema");
const { isValidObjectId } = require("../utils/inputValidator");
const { getCurrentTimeInTimezone } = require("../utils/timezone");

//book appointment
exports.bookAppointment = async (req, res, next) => {
  try {
    const { slotId, timezone = 'UTC', notes } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: "slotId is required" });
    }

    // Validate ObjectId
    if (!isValidObjectId(slotId)) {
      return res.status(400).json({ message: "Invalid slotId format" });
    }

    // User already booked this slot
    const existing = await Appointment.findOne({
      userId: req.user.id,
      slotId,
      status: "BOOKED"
    });

    if (existing) {
      return res.status(409).json({
        message: "You have already booked this slot"
      });
    }

    // Atomically book slot (prevents concurrent booking)
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: "AVAILABLE" },
      { status: "BOOKED" },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({
        message: "Slot already booked by another user or not available"
      });
    }

    // Check if slot is in the future
    if (slot.startTime <= new Date()) {
      // Rollback slot status
      await Slot.findByIdAndUpdate(slotId, { status: "AVAILABLE" });
      return res.status(400).json({ message: "Cannot book past slots" });
    }

    //  Create appointment
    const appointment = await Appointment.create({
      userId: req.user.id,
      providerId: slot.providerId,
      slotId: slot._id,
      status: "BOOKED",
      timezone,
      notes
    });

    res.status(201).json({ 
      message: "Appointment booked successfully",
      appointment 
    });
  } catch (err) {
    next(err);
  }
};

//cancel appointment
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user owns this appointment
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to cancel this appointment" });
    }

    // Check if already cancelled
    if (appointment.status === "CANCELLED") {
      return res.status(400).json({ message: "Appointment already cancelled" });
    }

    const slot = await Slot.findById(appointment.slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Last-minute cancellation check (30 minutes before)
    const diff = slot.startTime.getTime() - Date.now();
    if (diff < 30 * 60 * 1000) {
      return res.status(400).json({ 
        message: "Cannot cancel within 30 minutes of appointment time",
        minutesRemaining: Math.floor(diff / 60000)
      });
    }

    appointment.status = "CANCELLED";
    appointment.cancellationReason = cancellationReason || "User cancelled";
    appointment.cancelledAt = new Date();
    await appointment.save();

    slot.status = "AVAILABLE";
    slot.appointmentId = null;
    await slot.save();

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (err) {
    next(err);
  }
};

//reschedule appointment
exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const { newSlotId } = req.body;

    if (!newSlotId) {
      return res.status(400).json({ message: "newSlotId is required" });
    }

    if (!isValidObjectId(newSlotId) || !isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.id // only owner can reschedule
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "CANCELLED") {
      return res.status(400).json({ message: "Cannot reschedule cancelled appointment" });
    }

    // Validate old slot still exists
    const oldSlot = await Slot.findById(appointment.slotId);
    if (!oldSlot) {
      return res.status(404).json({ message: "Original slot not found" });
    }

    // Lock new slot atomically
    const newSlot = await Slot.findOneAndUpdate(
      { _id: newSlotId, status: "AVAILABLE" },
      { status: "BOOKED" },
      { new: true }
    );

    if (!newSlot) {
      return res.status(409).json({ message: "New slot unavailable or already booked" });
    }

    // Check if new slot is in the future
    if (newSlot.startTime <= new Date()) {
      await Slot.findByIdAndUpdate(newSlotId, { status: "AVAILABLE" });
      return res.status(400).json({ message: "Cannot reschedule to past slots" });
    }

    try {
      // Release old slot
      await Slot.findByIdAndUpdate(appointment.slotId, {
        status: "AVAILABLE",
        appointmentId: null
      });

      appointment.slotId = newSlot._id;
      appointment.status = "RESCHEDULED";
      await appointment.save();

      res.json({ 
        message: "Appointment rescheduled successfully", 
        appointment,
        newSlot: {
          startTime: newSlot.startTime,
          endTime: newSlot.endTime
        }
      });
    } catch (err) {
      // Rollback new slot if appointment update fails
      await Slot.findByIdAndUpdate(newSlotId, { status: "AVAILABLE" });
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

//get apointment details
exports.getHistory = async (req, res) => {
  const history = await Appointment.find({ userId: req.user.id })
    .sort({ createdAt: -1 });
  res.json(history);
};
