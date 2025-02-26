import useAuth from "../context/auth/AuthContext";
import Button from "./Button";
import ShoppingCart from "./ShoppingCart";
import useCart from "../context/cart/CartContext";
import Logo from "./Logo";
import { Navigate, useNavigate } from "react-router-dom";

function Header() {
  const { username, logOut } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handelLogout = () => {
    logOut();
    navigate("/");
    // return <Navigate to="/"></Navigate>;
  };
  return (
    <header className="bg-white m-auto w-full md:w-full flex justify-between items-center sticky left-0 top-0  border-b border-b-zinc-100 ">
      <div className="w-3/4 m-auto flex justify-between items-center gap-8 ">
        <Logo />

        <div>
          {username ? (
            <div className="flex justify-center items-center gap-4">
              <ShoppingCart itemsCartNumber={cartItems.length} />
              <h3>{username}</h3>
              <button
                className="px-4 py-2 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-800 duration-150"
                onClick={handelLogout}
              >
                Logout
              </button>
            </div>
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
