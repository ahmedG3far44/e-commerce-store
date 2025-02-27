import useAuth from "../context/auth/AuthContext";
import Button from "./Button";
import ShoppingCart from "./ShoppingCart";
import useCart from "../context/cart/CartContext";
import Logo from "./Logo";
import User from "./User";

function Header() {
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();

  return (
    <header className="bg-white m-auto w-full md:w-full flex justify-between items-center sticky left-0 top-0  border-b border-b-zinc-100 ">
      <div className="w-3/4 m-auto flex justify-between items-center gap-8 ">
        <Logo />

        <div>
          {isAuthenticated ? (
            <div className="w-full flex justify-around items-center gap-8">
              <ShoppingCart itemsCartNumber={cartItems.length} />

              <User />
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
