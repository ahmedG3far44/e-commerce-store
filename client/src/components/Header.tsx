import useAuth from "../context/auth/AuthContext";
import Button from "./Button";

import Logo from "./Logo";
import User from "./User";

function Header() {
  const { isAuthenticated } = useAuth();
  // const { cartItems } = useCart();

  return (
    <header className="bg-white m-auto w-full md:w-full flex justify-between items-center sticky left-0 top-0  border-b border-b-zinc-100 ">
      <div className="w-3/4 max-sm:w-full m-auto flex justify-between items-center gap-8 ">
        <Logo />

        <div className="w-full">
          {isAuthenticated ? (
            <User />
          ) : (
            <div className="flex justify-center items-center gap-4">
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
