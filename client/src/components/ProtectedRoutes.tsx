import Container from "./Container";
import Header from "./landing/Header";
import useAuth from "../context/auth/AuthContext";

import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={"/login"} replace></Navigate>;
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
}

export default ProtectedRoutes;
