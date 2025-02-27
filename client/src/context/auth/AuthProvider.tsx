import { FC, PropsWithChildren, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../../utils/types";


const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(window.localStorage.getItem("user")!)
  );
  const [token, setToken] = useState<string | null>(
    window.localStorage.getItem("token")
  );
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    JSON.parse(window.localStorage.getItem("isAuthenticated")!)
  );

  const logUser = ({ user, token }: { user: User; token: string }) => {
    setToken(token);
    setUser({ ...user });
    setAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token || "");
    localStorage.setItem("isAuthenticated", "true");
  };

  const logOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    setUser(null);
    setToken("");
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, user, logUser, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
