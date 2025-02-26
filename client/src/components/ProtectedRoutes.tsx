import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";
import Header from "./Header";
import Container from "./Container";

function ProtectedRoutes() {
  const { token } = useAuth();

  if (!token) return <Navigate to={"/login"} replace></Navigate>;

  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
}

export default ProtectedRoutes;
