import { Link } from "react-router-dom";
import { getUser } from "../utils/auth";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const user = getUser();

  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>Smart Booking</h1>

      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Dashboard
        </Link>

        {/* USER */}
        {user?.role === "USER" && (
          <Link to="/appointments" className={styles.navLink}>
            Appointments
          </Link>
        )}

        {/* PROVIDER */}
        {user?.role === "PROVIDER" && (
          <Link to="/provider-slots" className={styles.navLink}>
            My Slots
          </Link>
        )}

        {/* ADMIN */}
        {user?.role === "ADMIN" && (
          <>
            <Link to="/appointments" className={styles.navLink}>
              Appointments
            </Link>
            <Link to="/users" className={styles.navLink}>
              User Management
            </Link>
            <Link to="/providers" className={styles.navLink}>
              Provider Management
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
