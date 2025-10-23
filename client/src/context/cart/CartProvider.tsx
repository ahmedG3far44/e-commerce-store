/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  AddAndUpdateItemsToCartParamsType,
  ClearCartParamsType,
  DeleteItemCartParamsType,
} from "../../utils/types";
import { FC, PropsWithChildren } from "react";
import { IProductItem } from "../../utils/types";
import { CartContext } from "./CartContext";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItems, setCartItems] = useState<IProductItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total cart items dynamically using useMemo
  const totalCartItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getUserCart = async ({ token }: ClearCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized: No valid token provided");
      }

      setPending(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to fetch cart. Please try again."
        );
      }

      const cart = await response.json();

      if (!cart || !Array.isArray(cart.items)) {
        throw new Error("Invalid cart data received");
      }

      setCartItems(cart.items);
      setTotalAmount(cart.totalAmount || 0);

      return cart.items;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to load cart";
      console.error("getUserCart error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setPending(false);
    }
  };

  const addItemToCart = async ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized: No valid token provided");
      }

      if (!productId) {
        throw new Error("Product ID is required");
      }

      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      setPending(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to add product to cart"
        );
      }

      const cart = await response.json();

      setCartItems(cart.items);
      setTotalAmount(cart.totalAmount || 0);

      toast.success("Product added to cart successfully");
      return cart;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to add product to cart";
      console.error("addItemToCart error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setPending(false);
    }
  };

  const updateItemInCart = async ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized: No valid token provided");
      }

      if (!productId) {
        throw new Error("Product ID is required");
      }

      if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }

      setPending(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update product quantity"
        );
      }

      const cart = await response.json();

      setCartItems(cart.items);
      setTotalAmount(cart.totalAmount || 0);

      toast.success("Product quantity updated successfully");
      return cart;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to update product";
      console.error("updateItemInCart error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setPending(false);
    }
  };

  const deleteOneItemFromCart = async ({
    productId,
    token,
  }: DeleteItemCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized: No valid token provided");
      }

      if (!productId) {
        throw new Error("Product ID is required");
      }

      setPending(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to remove product from cart"
        );
      }

      const cart = await response.json();

      setCartItems(cart.items);
      setTotalAmount(cart.totalAmount || 0);

      toast.success("Product removed from cart");
      return cart;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to remove product";
      console.error("deleteOneItemFromCart error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setPending(false);
    }
  };

  const clearAllItemsFromCart = async ({ token }: ClearCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized: No valid token provided");
      }

      setPending(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to clear cart"
        );
      }

      const cart = await response.json();

      setCartItems([]);
      setTotalAmount(0);

      toast.success("Cart cleared successfully");
      return cart;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to clear cart";
      console.error("clearAllItemsFromCart error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setPending(false);
    }
  };

  const createOrder = async ({
    token,
    address,
  }: {
    token: string;
    address: string;
  }) => {
    try {
      if (!token) {
        throw new Error("Unauthorized: No valid token provided");
      }

      if (!address || address.trim() === "") {
        throw new Error("Delivery address is required");
      }

      if (cartItems.length === 0) {
        throw new Error("Your cart is empty");
      }

      setPending(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to create order"
        );
      }

      const order = await response.json();

      setCartItems([]);
      setTotalAmount(0);

      toast.success("Order placed successfully! 🎉");
      return order;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create order";
      console.error("createOrder error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setPending(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        getUserCart,
        addItemToCart,
        updateItemInCart,
        deleteOneItemFromCart,
        clearAllItemsFromCart,
        createOrder,
        totalCartItems,
        error,
        pending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;