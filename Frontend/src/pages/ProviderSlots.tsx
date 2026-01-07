import { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import api from "../api/axios";
import { Slot } from "../interfaces";
import styles from "./ProviderSlots.module.css";

/* ================= SLOT ROW ================= */
interface SlotRowProps {
  slot: Slot;
  refresh: () => Promise<void>;
}

function SlotRow({ slot, refresh }: SlotRowProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [start, setStart] = useState<string>(slot.startTime.slice(0, 16));
  const [end, setEnd] = useState<string>(slot.endTime.slice(0, 16));

  const save = async () => {
    if (new Date(start) >= new Date(end)) {
      alert("End time must be after start time");
      return;
    }

    await api.put(`/slots/${slot._id}`, {
      startTime: start,
      endTime: end,
    });

    setEditing(false);
    refresh();
  };

  return (
    <tr>
      <td>
        {editing ? (
          <input
            type="datetime-local"
            value={start}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStart(e.target.value)}
            className={styles.editInput}
          />
        ) : (
          new Date(slot.startTime).toLocaleString()
        )}
      </td>

      <td>
        {editing ? (
          <input
            type="datetime-local"
            value={end}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEnd(e.target.value)}
            className={styles.editInput}
          />
        ) : (
          new Date(slot.endTime).toLocaleString()
        )}
      </td>

      <td className={styles.centerAlign}>
        <span
          className={`${styles.statusBadge}
          ${slot.status === "AVAILABLE" ? styles.statusAvailable : ""}
          ${slot.status === "BLOCKED" ? styles.statusBlocked : ""}
          ${slot.status === "BOOKED" ? styles.statusBooked : ""}
        `}
        >
          {slot.status}
        </span>
      </td>

      <td className={styles.actionCell}>
        {slot.status !== "BOOKED" && (
          <>
            {editing ? (
              <button
                onClick={save}
                className={styles.saveBtn}
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className={styles.editBtn}
              >
                Edit
              </button>
            )}

            <button
              onClick={() =>
                api.put(`/slots/${slot._id}/toggle`).then(refresh)
              }
              className={styles.blockBtn}
            >
              {slot.status === "BLOCKED" ? "Unblock" : "Block"}
            </button>

            <button
              onClick={() =>
                api.delete(`/slots/${slot._id}`).then(refresh)
              }
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

/* ================= PROVIDER SLOTS ================= */
interface SlotForm {
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export default function ProviderSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [form, setForm] = useState<SlotForm>({
    date: "",
    startTime: "",
    endTime: "",
    duration: 30,
  });

  const fetchSlots = async () => {
    const res = await api.get<Slot[]>("/slots/my");
    setSlots(res.data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const calculateSlots = (): number => {
    const { startTime, endTime, duration } = form;
    if (!startTime || !endTime || duration <= 0) return 0;

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (start >= end) return 0;

    return Math.floor((end.getTime() - start.getTime()) / (duration * 60000));
  };

  const submit = async () => {
    const { date, startTime, endTime, duration } = form;

    if (!date || !startTime || !endTime) {
      alert("All fields are required");
      return;
    }

    if (calculateSlots() <= 0) {
      alert("Invalid slot configuration");
      return;
    }

    await api.post("/slots", {
      startTime: `${date}T${startTime}`,
      endTime: `${date}T${endTime}`,
      duration,
    });

    alert("Slots created successfully");
    fetchSlots();
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Manage Slots</h2>

      {/* ================= CREATE SLOTS ROW ================= */}
      <div className={styles.formContainer}>
        <div className={styles.formGrid}>

          <div className={styles.formGroup}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              className={styles.input}
              onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Start Time</label>
            <input
              type="time"
              className={styles.input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, startTime: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>End Time</label>
            <input
              type="time"
              className={styles.input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, endTime: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Duration (min)</label>
            <input
              type="number"
              min="5"
              step="5"
              value={form.duration}
              className={styles.input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
            />
          </div>

          <div className={styles.slotInfo}>
            Slots:{" "}
            <span className="count">{calculateSlots()}</span>
          </div>

          <button
            onClick={submit}
            className={styles.createBtn}
          >
            Create Slots
          </button>
        </div>
      </div>

      {/* ================= SLOTS TABLE ================= */}
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th className="centerAlign">Status</th>
            <th className="centerAlign">Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {slots.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.emptyState}>
                No slots found
              </td>
            </tr>
          ) : (
            slots.map((s) => (
              <SlotRow key={s._id} slot={s} refresh={fetchSlots} />
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
