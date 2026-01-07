import { useEffect, useState, FormEvent, ChangeEvent, MouseEvent } from "react";
import MainLayout from "../layout/MainLayout";
import { fetchProviders, updateProvider, deleteProvider } from "../api/providers.api";
import { Provider, UpdateProviderDTO } from "../interfaces";
import styles from "./Providers.module.css";

interface ProviderForm {
  specialization: string;
  experienceYears: string;
  consultationFee: string;
}

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [form, setForm] = useState<ProviderForm>({
    specialization: "",
    experienceYears: "",
    consultationFee: "",
  });

  const loadProviders = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await fetchProviders();
      if (!signal?.aborted) setProviders(data);
    } catch {
      if (!signal?.aborted) setError("Failed to load providers");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadProviders(controller.signal);
    return () => controller.abort();
  }, []);

  const handleAddDetails = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedProviderId) {
      setError("Please select a provider");
      return;
    }

    try {
      const updateData: UpdateProviderDTO = {
        specialization: form.specialization,
        experienceYears: Number(form.experienceYears),
        consultationFee: Number(form.consultationFee),
      };
      await updateProvider(selectedProviderId, updateData);
      setSelectedProviderId("");
      setForm({ specialization: "", experienceYears: "", consultationFee: "" });
      loadProviders();
    } catch (err: any) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  const toggleStatus = async (p: Provider) => {
    try {
      await updateProvider(p._id, { isActive: !p.isActive });
      loadProviders();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteProvider(id);
    loadProviders();
  };

  return (
    <MainLayout>
      <h2 className={styles.pageTitle}>Manage Providers</h2>

      {/* ADD DETAILS FORM */}
      <form
        onSubmit={handleAddDetails}
        className={styles.formContainer}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>Provider</label>
          <select
            className={styles.select}
            value={selectedProviderId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => 
              setSelectedProviderId(e.target.value)
            }
          >
            <option value="">Select Provider</option>
            {providers.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Specialization</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Cardiologist"
            value={form.specialization}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, specialization: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Experience (Years)</label>
          <input
            type="number"
            className={styles.input}
            placeholder="e.g. 10"
            value={form.experienceYears}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, experienceYears: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Consultation Fee</label>
          <input
            type="number"
            className={styles.input}
            placeholder="e.g. 500"
            value={form.consultationFee}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, consultationFee: e.target.value })
            }
          />
        </div>

        <div className={styles.fullWidthOnMd}>
          <div className={styles.submitRight}>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              Add / Update Details
            </button>
          </div>
        </div>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading providers...</p>}

      {/* PROVIDERS TABLE */}
      {!loading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Experience Years</th>
                <th>Consultation Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {providers.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.specialization || "-"}</td>
                  <td>{p.experienceYears || "-"}</td>
                  <td>{p.consultationFee || "-"}</td>
                  <td>
                    <button
                      className={`${styles.statusBtn} ${
                        p.isActive ? styles.statusActive : styles.statusInactive
                      }`}
                      onClick={() => toggleStatus(p)}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    No providers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}
