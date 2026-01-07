import { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import api from "../api/axios";
import { Slot, Provider, Appointment } from "../interfaces";
import styles from "./Appointments.module.css";

export default function AppointmentsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  // Reschedule states
  const [showReschedule, setShowReschedule] = useState<boolean>(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);
  const [rescheduleProviderId, setRescheduleProviderId] = useState<string>("");
  const [rescheduleSlots, setRescheduleSlots] = useState<Slot[]>([]);
  const [newSlotId, setNewSlotId] = useState<string>("");

  /* ---------------- PROVIDERS ---------------- */
  useEffect(() => {
    api.get<Provider[]>("/providers/withslots")
      .then(res => setProviders(res.data))
      .catch(() => setMessage("Failed to load providers"));
  }, []);

  /* ---------------- SLOTS (BOOKING) ---------------- */
  // Fetch slots for selected provider
  useEffect(() => {
    if (!selectedProvider) return;

    setLoadingSlots(true);
    setSelectedSlot("");

    api.get<Slot[]>(`/slots/provider/${selectedProvider}`)
      .then(res => setSlots(res.data))
      .catch(() => setMessage("Failed to load slots"))
      .finally(() => setLoadingSlots(false));
  }, [selectedProvider]);

  /* ---------------- APPOINTMENTS ---------------- */
  const fetchAppointments = async () => {
    try {
      const res = await api.get<Appointment[]>("/appointments/history");
      setAppointments(res.data);
    } catch {
      alert("Failed to load appointments");
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ---------------- BOOK ---------------- */
  const bookAppointment = async () => {
    if (!selectedSlot) return;

    try {
      await api.post("/appointments", { slotId: selectedSlot });
      setMessage("✅ Appointment booked successfully");
      fetchAppointments();

      const res = await api.get<Slot[]>(`/slots/${selectedProvider}`);
      setSlots(res.data);
      setSelectedSlot("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Slot already booked");
    }
  };

  /* ---------------- CANCEL ---------------- */
  const cancelAppointment = async (id: string) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await api.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (err: any) {
      alert(err.response?.data?.message || "Cancellation failed");
    }
  };

  /* ---------------- RESCHEDULE ---------------- */
  const openReschedule = (appointment: Appointment) => {
    setRescheduleAppointmentId(appointment._id);
    setRescheduleProviderId(appointment.providerId);
    setNewSlotId("");
    setShowReschedule(true);
  };

  useEffect(() => {
    if (!rescheduleProviderId) return;

    api.get<Slot[]>(`/slots/${rescheduleProviderId}`)
      .then(res => setRescheduleSlots(res.data))
      .catch(() => alert("Failed to load slots"));
  }, [rescheduleProviderId]);

  const confirmReschedule = async () => {
    if (!newSlotId) return;

    try {
      await api.put(
        `/appointments/${rescheduleAppointmentId}/reschedule`,
        { newSlotId }
      );

      setShowReschedule(false);
      fetchAppointments();
    } catch (err: any) {
      alert(err.response?.data?.message || "Reschedule failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className={styles.pageContainer}>

      {/* ================= BOOK APPOINTMENT ================= */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Book Appointment</h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Provider</label>
            <select
              value={selectedProvider}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                setSelectedProvider(e.target.value)
              }
              className={styles.select}
            >
              <option value="">-- Select Provider --</option>
              {providers.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Slots</label>
            <select
              value={selectedSlot}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                setSelectedSlot(e.target.value)
              }
              disabled={!selectedProvider || loadingSlots}
              className={styles.select}
            >
              <option value="">
                {loadingSlots ? "Loading..." : "-- Select Slot --"}
              </option>

              {slots.length === 0 && !loadingSlots && (
                <option disabled>No slots available</option>
              )}

              {slots.map(slot => (
                <option key={slot._id} value={slot._id}>
                  {slot.time}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={bookAppointment}
            disabled={!selectedSlot}
            className={styles.bookBtn}
          >
            Book
          </button>
        </div>

        {message && (
          <p className={styles.message}>{message}</p>
        )}
      </div>

      {/* ================= APPOINTMENTS TABLE ================= */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>My Appointments</h2>

        {loadingAppointments ? (
          <p className={styles.loading}>Loading...</p>
        ) : appointments.length === 0 ? (
          <p className={styles.noData}>No appointments</p>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Status</th>
                <th>Created</th>
                <th className="centerAlign">Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {appointments.map(a => (
                <tr key={a._id}>
                  <td className={styles.statusCell}>{a.status}</td>
                  <td className={styles.dateText}>
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td className={`${styles.centerAlign} ${styles.actionCell}`}>
                    {a.status === "BOOKED" && (
                      <>
                        <button
                          onClick={() => openReschedule(a)}
                          className={styles.rescheduleBtn}
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => cancelAppointment(a._id)}
                          className={styles.cancelBtn}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= RESCHEDULE MODAL ================= */}
      {showReschedule && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Reschedule Appointment</h3>

            <select
              value={newSlotId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                setNewSlotId(e.target.value)
              }
              className={styles.modalSelect}
            >
              <option value="">-- Select New Slot --</option>
              {rescheduleSlots.map(slot => (
                <option key={slot._id} value={slot._id}>
                  {new Date(slot.startTime).toLocaleString()}
                </option>
              ))}
            </select>

            <div className={styles.modalActions}>
              <button
                onClick={() => setShowReschedule(false)}
                className={styles.modalCancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                className={styles.modalConfirmBtn}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
