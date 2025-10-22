import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../context/auth/AuthContext";
import useCart from "../../context/cart/CartContext";
import User from "../User";
import Button from "../Button";
import Logo from "../Logo";
import { useCategory } from "../../context/category/CategoryContext";
import Navigation from "../Navigation";

function Header() {
  const navigate = useNavigate();
  const { categories } = useCategory();
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [isScrolled, setScroll] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY >= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <header
        className={`${
          isScrolled ? "shadow-lg bg-white/95 backdrop-blur-md" : "bg-white"
        } sticky top-0 z-50 border-b border-gray-200 transition-all duration-300`}
      >
        <div className="container mx-auto px-4">
          {/* Main Header */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-8 flex-1">
              <Logo />

              {/* Desktop Navigation */}
              <Navigation categories={categories} />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Icon - Desktop */}
              <button
                onClick={() => setSearchOpen(!isSearchOpen)}
                className="hidden md:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Cart Icon */}
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/cart")}
                  className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
                  aria-label="Shopping cart"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Auth Section - Desktop */}
              <div className="hidden md:flex items-center">
                {isAuthenticated ? (
                  <User />
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      to="/login"
                      className="text-sm px-4 py-2"
                    >
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      to="/signup"
                      className="text-sm px-4 py-2"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar - Expandable Desktop */}
          {isSearchOpen && (
            <div className="hidden md:block pb-4 animate-slideDown">
              <form
                onSubmit={handleSearch}
                className="relative max-w-2xl mx-auto"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  autoFocus
                />
                <svg
                  className="absolute left-4 top-3.5 text-gray-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.name
                    .toLocaleLowerCase()
                    .split(" ")
                    .join("-")
                    .trim()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    navigate("/cart");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Shopping Cart
                  </span>
                  {cartItemCount > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="p-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div onClick={() => setMobileMenuOpen(false)}>
                <User />
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  to="/signup"
                  className="w-full justify-center"
                  funOnClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
                <Button
                  variant="secondary"
                  to="/login"
                  className="w-full justify-center"
                  funOnClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default Header;
