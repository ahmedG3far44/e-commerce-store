import { createContext, useContext } from "react";

export interface AuthContextType {
  username: string | null;
  token: string | null;
  isAuthenticated: string | null;
  logUser: (params: LoginParams) => void;
  logOut: () => void;
}

export interface LoginParams {
  username: string | null;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  username: "",
  token: "",
  isAuthenticated: "",
  logUser: () => {},
  logOut: () => {},
});

const useAuth = () => useContext(AuthContext);

export default useAuth;
