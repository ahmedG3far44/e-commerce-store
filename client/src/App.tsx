import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CartPage from "./pages/cart";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import NotFoundPage from "./pages/error";
import ProfilePage from "./pages/profile";
import Dashboard from "./pages/dashboard";
import OrdersHistory from "./pages/orders";
import CheckoutPage from "./pages/checkout";
import AddAddress from "./pages/add-address";
import CategoryPage from "./pages/categories";
import SuccessOrder from "./pages/success-order";
import Insights from "./components/admin/Insights";
import AdminRoutes from "./components/AdminRoutes";
import ProductDetails from "./pages/product-details";
import AuthProvider from "./context/auth/AuthProvider";
import CartProvider from "./context/cart/CartProvider";
import AdminUsers from "./components/admin/AdminUsers";
import AdminOrders from "./components/admin/AdminOrders";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminProducts from "./components/admin/AdminProducts";
import AdminCategory from "./components/admin/AdminCategory";
import CategoryProvider from "./context/category/CategoryProvider";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoryProvider>
          <Toaster position="bottom-center" reverseOrder={false} />
          <BrowserRouter>
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route
                path="/category/:categoryName"
                element={<CategoryPage />}
              />
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
                  <Route path="categories" element={<AdminCategory />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route
                    path="all-orders"
                    element={<AdminOrders OrderStatus="all" />}
                  />
                  <Route
                    path="delivered-orders"
                    element={<AdminOrders OrderStatus="delivered" />}
                  />
                  <Route path="insights" element={<Insights />} />
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
        </CategoryProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
