import { useEffect, useState } from "react";
import useAuth from "../context/auth/AuthContext";
import Button from "./Button";

import Logo from "./Logo";
import User from "./User";

function Header() {
  const { isAuthenticated } = useAuth();
  // const { cartItems } = useCart();
  const [isScrolled, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY >= 200 ? true : false);
    });
  }, []);

  return (
    <header
      className={`${
        isScrolled && " border-b-zinc-200 border-b"
      } bg-white m-auto w-full  flex justify-between items-center sticky left-0 top-0  z-[9999] `}
    >
      <div className="w-3/4 max-sm:w-full m-auto flex justify-between items-center gap-8 ">
        <Logo status="header" />

        <div className="w-full ml-auto">
          {isAuthenticated ? (
            <User />
          ) : (
            <div className="ml-auto w-full flex justify-center items-center gap-4">
              <Button variant="primary" to="/login">
                Login
              </Button>
              <Button variant="secondary" to="/signup">
                Create Account
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
