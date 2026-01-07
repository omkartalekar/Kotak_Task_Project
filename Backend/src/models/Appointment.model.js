const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  providerId: mongoose.Schema.Types.ObjectId,
  slotId: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ["BOOKED", "CANCELLED", "RESCHEDULED", "COMPLETED", "NO_SHOW"],
    default: "BOOKED"
  },
  timezone: { type: String, default: 'UTC' },
  cancellationReason: { type: String },
  cancelledAt: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
