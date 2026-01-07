import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import MainLayout from "../layout/MainLayout";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/users.api";
import { User, CreateUserDTO } from "../interfaces";
import styles from "./Users.module.css";

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: "USER" | "PROVIDER" | "ADMIN";
  age: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<UserForm>({ 
    name: "", 
    email: "", 
    password: "", 
    role: "USER", 
    age: "" 
  });
  const [editId, setEditId] = useState<string | null>(null);

  const loadUsers = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      if (!signal?.aborted) setUsers(data);
    } catch {
      if (!signal?.aborted) setError("Failed to load users");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadUsers(controller.signal);
    return () => controller.abort();
  }, []);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || (!editId && !form.password)) {
      setError("Name, email, and password (for new user) are required");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Invalid email format");
      return;
    }

    try {
      if (editId) {
        await updateUser(editId, {
          name: form.name,
          email: form.email,
          role: form.role,
          age: form.age ? Number(form.age) : undefined
        });
        setEditId(null);
      } else {
        const userData: CreateUserDTO = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          age: form.age ? Number(form.age) : undefined
        };
        await createUser(userData);
      }

      setForm({ name: "", email: "", password: "", role: "USER", age: "" });
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age?.toString() || "",
      password: "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteUser(id);
    loadUsers();
  };

  return (
    <MainLayout>
      <h2 className={styles.pageTitle}>User Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">Name *</label>
          <input 
            id="name" 
            className={styles.input} 
            value={form.name} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              setForm({...form, name: e.target.value})
            } 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Email *</label>
          <input 
            id="email" 
            type="email" 
            className={styles.input} 
            value={form.email} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              setForm({...form, email: e.target.value})
            } 
          />
        </div>

        {!editId && (
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password *</label>
            <input 
              id="password" 
              type="password" 
              className={styles.input} 
              value={form.password} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setForm({...form, password: e.target.value})
              } 
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="role">Role</label>
          <select 
            id="role" 
            className={styles.select} 
            value={form.role} 
            onChange={(e: ChangeEvent<HTMLSelectElement>) => 
              setForm({...form, role: e.target.value as "USER" | "PROVIDER" | "ADMIN"})
            }
          >
            <option value="USER">USER</option>
            <option value="PROVIDER">PROVIDER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="age">Age</label>
          <input 
            id="age" 
            type="number" 
            className={styles.input} 
            value={form.age} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              setForm({...form, age: e.target.value})
            } 
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitBtn}>
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading users...</p>}

      {/* TABLE */}
      {!loading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Age</th>
                <th>Email</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>{u.age || "-"}</td>
                  <td>{u.email}</td>
                  <td className={styles.dateText}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.editBtn} 
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No users found
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
