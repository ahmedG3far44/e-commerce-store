import { FC, PropsWithChildren, useState } from "react";
import { AuthContext, LoginParams } from "./AuthContext";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(
    window.localStorage.getItem("username")
  );
  const [token, setToken] = useState<string | null>(
    window.localStorage.getItem("token")
  );
  const [isAuthenticated, setAuthenticated] = useState<string | null>(
    window.localStorage.getItem("isAuthenticated")
  );

  const logUser = ({ username, token }: LoginParams) => {
    setUsername(username);
    setToken(token);
    setAuthenticated("true");
    localStorage.setItem("username", username || "");
    localStorage.setItem("token", token || "");
    localStorage.setItem("isAuthenticated", isAuthenticated || "");
  };

  const logOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    setUsername("");
    setToken("");
    setAuthenticated("");
  };

  return (
    <AuthContext.Provider
      value={{ username, token, isAuthenticated, logUser, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
