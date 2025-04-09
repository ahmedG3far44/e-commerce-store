import { useEffect, useState } from "react";
import useAuth from "../../context/auth/AuthContext";
import { categories } from "../../utils/handlers";
import User from "../User";
import Button from "../Button";
import Logo from "../Logo";
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
        isScrolled && "border-b-zinc-200 border-b"
      } bg-white shadow-sm sticky top-0 z-[999] `}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="m-auto flex items-center justify-around">
          <div className="flex items-center space-x-4">
            <Logo />
            <nav className="hidden md:flex space-x-6">
              {categories.map((category) => {
                return (
                  <a
                    key={category.id}
                    href={category.path}
                    className="text-gray-800 hover:text-blue-600 transition"
                  >
                    {category.categoryName}
                  </a>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {/* <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            </div> */}
            <div>
              {isAuthenticated ? (
                <User />
              ) : (
                <div className="ml-auto w-full flex justify-center items-center gap-4">
                  <Button className={"flex-1"} variant="primary" to="/login">
                    Login
                  </Button>
                  <Button className={"flex-1"} variant="secondary" to="/signup">
                    Signup
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

// return (
//   <header
//     className={`${

//     } bg-white m-auto w-full  flex justify-between items-center sticky left-0 top-0  z-[9999] `}
//   >
//     <div className="w-3/4 max-sm:w-full m-auto flex justify-between items-center gap-8 ">
//       <Logo status="header" />

//     </div>
//   </header>
// );
