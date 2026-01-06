import { Navigate, Outlet } from "react-router-dom";
import { STORAGE_KEYS } from "@pokemon-mf/shared";

export function ProtectedRoute() {
  const isAuthed = Boolean(localStorage.getItem(STORAGE_KEYS.auth));
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}
