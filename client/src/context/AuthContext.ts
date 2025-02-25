import { createContext, useContext } from "react";

export interface AuthContextType {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
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
  isAuthenticated: false,
  logUser: () => {},
  logOut: () => {},
});

const useAuth = () => useContext(AuthContext);

export default useAuth;
