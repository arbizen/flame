import useAuth from "../hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
  const auth = useAuth();
  return <>{auth ? <Outlet /> : <Navigate to="/login" />}</>;
}
