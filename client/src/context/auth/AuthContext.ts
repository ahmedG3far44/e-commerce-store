import { createContext, useContext } from "react";
import { User } from "../../utils/types";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  logUser: ({ user, token }: { user: User; token: string }) => void;
  logOut: () => void;
}

export interface LoginParams {
  user: User | null;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: {
    firstName: "",
    lastName: "",
    email: "",
    isAdmin: false,
  },
  token: "",
  isAuthenticated: false,
  logUser: () => {},
  logOut: () => {},
});

const useAuth = () => useContext(AuthContext);

export default useAuth;
