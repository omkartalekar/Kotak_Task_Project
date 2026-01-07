import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import Providers from "./pages/Providers";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import ProviderSlots from "./pages/ProviderSlots";
import MainLayout from "./layout/MainLayout";
import AppointmentsPage from "./pages/Appointments";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/providers"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Providers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/provider-slots" 
          element={
            <ProtectedRoute roles={["PROVIDER", "ADMIN"]}>
              <MainLayout>
                <ProviderSlots />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute roles={["USER"]}>
              <MainLayout>
                <AppointmentsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
