import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<"USER" | "PROVIDER" | "ADMIN">;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const token = getToken();
  const user = getUser();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
