import { useState, FormEvent, ChangeEvent } from "react";
import api from "../api/axios";
import styles from "./Login.module.css";
import { AuthResponse, JWTPayload } from "../interfaces";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post<AuthResponse>("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      // decode JWT payload
      const payload: JWTPayload = JSON.parse(atob(res.data.token.split(".")[1]));
      localStorage.setItem("user", JSON.stringify(payload));

      window.location.href = "/";
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={submit}
        className={styles.form}
      >
        <h2 className={styles.title}>Login</h2>

        <input
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        <button className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}
