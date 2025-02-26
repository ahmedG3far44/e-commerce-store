import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";

function AdminRoutes() {
  const { username } = useAuth();
  const isAdmin = true;
  if (!username || !isAdmin) return <Navigate to={"/login"}></Navigate>;
  return <Outlet />;
}

export default AdminRoutes;
