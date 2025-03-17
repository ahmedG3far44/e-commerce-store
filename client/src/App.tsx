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
import AdminOrders from "./components/admin/AdminOrders";
import AdminProducts from "./components/admin/AdminProducts";
import AdminUsers from "./components/admin/AdminUsers";
import AddAddress from "./pages/add-address";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="bottom-center" reverseOrder={false} />
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
                <Route path="/add-address" element={<AddAddress />} />
                <Route path="/orders-history" element={<OrdersHistory />} />
                <Route path="/success" element={<SuccessOrder />} />
              </Route>

              <Route element={<AdminRoutes />}>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route
                    path="orders"
                    element={<AdminOrders OrderStatus="orders" />}
                  />
                  <Route
                    path="pending-orders"
                    element={<AdminOrders OrderStatus="pending" />}
                  />
                  <Route
                    path="shipped-orders"
                    element={<AdminOrders OrderStatus="shipped" />}
                  />
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
