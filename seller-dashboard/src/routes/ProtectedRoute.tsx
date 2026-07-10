import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function ProtectedRoute({ role }: { role?: "admin" | "merchant" }) {
  const { isAuthenticated, isAdmin, isMerchant } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  if (role === "merchant" && !isMerchant && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
