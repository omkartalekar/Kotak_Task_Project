import { useState, FormEvent, ChangeEvent } from "react";
import { register } from "../api/authApi";
import styles from "./Register.module.css";
import { RegisterDTO } from "../interfaces";

export default function Register() {
  const [form, setForm] = useState<RegisterDTO>({ 
    email: "", 
    password: "", 
    role: "USER" 
  });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register(form);
    alert("Registered successfully");
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <h2 className={styles.title}>Register</h2>

      <input 
        className={styles.input}
        placeholder="Email" 
        onChange={(e: ChangeEvent<HTMLInputElement>) => 
          setForm({ ...form, email: e.target.value })
        } 
      />
      <input 
        type="password" 
        className={styles.input}
        placeholder="Password"
        onChange={(e: ChangeEvent<HTMLInputElement>) => 
          setForm({ ...form, password: e.target.value })
        } 
      />

      <select 
        className={styles.select}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
          setForm({ ...form, role: e.target.value as "USER" | "PROVIDER" | "ADMIN" })
        }
      >
        <option value="USER">User</option>
        <option value="PROVIDER">Provider</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button className={styles.button}>Register</button>
    </form>
  );
}
