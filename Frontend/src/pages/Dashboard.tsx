import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import api from "../api/axios";
import { getUser } from "../utils/auth";
import styles from "./Users.module.css";
import common from "./common.module.css";

interface Stats {
  appointmentsBooked: number;
  totalSlots: number;
  availableSlots: number;
  users: number;
  providers: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className={common.statCard}>
      <p className={common.statTitle}>{title}</p>
      <p className={common.statValue}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const user = getUser();

  const [stats, setStats] = useState<Stats>({
    appointmentsBooked: 0,
    totalSlots: 0,
    availableSlots: 0,
    users: 0,
    providers: 0
  });

  useEffect(() => {
    // USER: show only appointments
    if (user?.role === "USER") {
      api.get("/appointments/history").then(res => {
        setStats(prev => ({
          ...prev,
          appointmentsBooked: res.data.length
        }));
      });
    }

    // PROVIDER: show slots info
    if (user?.role === "PROVIDER") {
      api.get("/slots/my").then(res => {
        const slots = res.data;
        const total = slots.length;
        const available = slots.filter((s: any) => s.status === "AVAILABLE").length;
        const booked = total - available;

        setStats(prev => ({
          ...prev,
          totalSlots: total,
          availableSlots: available,
          appointmentsBooked: booked
        }));
      });
    }

    // ADMIN: show all stats
    if (user?.role === "ADMIN") {
      Promise.all([
        api.get("/slots/all"),
        api.get("/users"),
        api.get("/providers")
      ]).then(([slotsRes, usersRes, providersRes]) => {
        const slots = slotsRes.data;
        const total = slots.length;
        const available = slots.filter((s: any) => s.status === "AVAILABLE").length;
        const booked = total - available;

        setStats({
          totalSlots: total,
          availableSlots: available,
          appointmentsBooked: booked,
          users: usersRes.data.length,
          providers: providersRes.data.length
        });
      });
    }
  }, [user?.role]);

  return (
    <MainLayout>
      <h2 className={styles.pageTitle}>Dashboard</h2>

      <div className={`${common.grid} ${common.grid3}`}>

        {/* USER */}
        {user?.role === "USER" && (
          <>
            <StatCard title="Appointments Booked" value={stats.appointmentsBooked} />
            <StatCard title="Status" value="Active" />
          </>
        )}

        {/* PROVIDER */}
        {user?.role === "PROVIDER" && (
          <>
            <StatCard title="Total Slots" value={stats.totalSlots} />
            <StatCard title="Available Slots" value={stats.availableSlots} />
            <StatCard title="Appointments Booked" value={stats.appointmentsBooked} />
          </>
        )}

        {/* ADMIN */}
        {user?.role === "ADMIN" && (
          <>
            <StatCard title="Total Appointments Booked" value={stats.appointmentsBooked} />
            <StatCard title="Total Slots" value={stats.totalSlots} />
            <StatCard title="Available Slots" value={stats.availableSlots} />
            <StatCard title="Total Users" value={stats.users} />
            <StatCard title="Providers" value={stats.providers} />
          </>
        )}

      </div>
    </MainLayout>
  );
}
