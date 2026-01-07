import { logout } from "../utils/auth";
import { Link } from "react-router-dom";
import styles from "./Topbar.module.css";

export default function Topbar() {
  return (
    <header className={styles.header}>
      <div />
      <div className={styles.userSection}>
        <img
          src="https://i.pravatar.cc/40"
          className={styles.avatar}
          alt="profile"
        />
        <Link to="/profile" className={styles.profileLink}>Profile</Link>
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      </div>
    </header>
  );
}
