import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";

function ProtectedRoutes() {
  const { token } = useAuth();
  //   const navigate = useNavigate();

  if (!token) return <Navigate to={"/login"} replace></Navigate>;

  return <Outlet />;
}

export default ProtectedRoutes;
