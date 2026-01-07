import MainLayout from "../layout/MainLayout";
import styles from "./Profile.module.css";
import { JWTPayload } from "../interfaces";

export default function Profile() {
  const user: JWTPayload | null = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <MainLayout>
      <h2 className={styles.pageTitle}>Profile</h2>
      <div className={styles.card}>
        <p><b>ID:</b> {user?.id}</p>
        <p><b>Role:</b> {user?.role}</p>
      </div>
    </MainLayout>
  );
}
