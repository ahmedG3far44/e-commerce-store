import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import ProfilePage from "./pages/profile";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import NotFoundPage from "./pages/error";
import AuthProvider from "./context/auth/AuthProvider";
import CartProvider from "./context/cart/CartProvider";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminRoutes from "./components/AdminRoutes";
import Dashboard from "./pages/dashboard";
import OrdersHistory from "./pages/orders";
import SuccessOrder from "./pages/success-order";
import { Toaster } from "react-hot-toast";
import ProductDetails from "./pages/product-details";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" reverseOrder={false} />
          <BrowserRouter>
            <Routes>
              <Route index path="/" element={<HomePage />} />
              <Route path="/:id" element={<ProductDetails />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders-history" element={<OrdersHistory />} />
                <Route path="/success" element={<SuccessOrder />} />
              </Route>

              <Route element={<AdminRoutes />}>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route
                    path="products"
                    element={<h1>Dashboard/Products </h1>}
                  />
                  <Route path="orders" element={<h1>Dashboard/Orders</h1>} />
                  <Route path="users" element={<h1>Dashboard/Users</h1>} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
