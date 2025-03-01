import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";

function AdminRoutes() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.isAdmin;
  if (!isAuthenticated || !isAdmin) return <Navigate to={"/login"}></Navigate>;
  return <Outlet />;
}

export default AdminRoutes;
