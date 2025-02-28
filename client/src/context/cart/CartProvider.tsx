/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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

  const getUserCart = async ({ token }: ClearCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized User, not valid token!!");
      }
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "can't get user items cart. please check your connections!!"
        );
      }

      const cart = await response.json();

      if (!cart) {
        throw new Error(
          "can't get user items cart. please check your connections!!"
        );
      }

      const cartItems = cart.items;

      setCartItems([...cart.items]);
      setTotalAmount(cart.totalAmount);

      return cartItems;
    } catch (err) {
      console.error(err);
      return err;
    }
  };
  const addItemToCart = async ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => {
    try {
      if (!token) return;

      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        console.log(response);
        throw new Error("This product is already added before!!");
      }
      const cart = await response.json();

      setCartItems([...cart.items]);
      setTotalAmount(cart.totalAmount);

      toast.success("A new product was added!!");
      return cart;
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message);
      return err;
    }
  };

  const updateItemInCart = async ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized action, your token is not valid!!");
      }

      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error(
          "updating product in cart failed. please check your connection!!"
        );
      }
      const cart = await response.json();

      setCartItems([...cart.items]);
      setTotalAmount(cart.totalAmount);

      toast.success(`quantity of product ${productId} updated success!!`);

      return cart;
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message);
      return err;
    }
  };
  const deleteOneItemFromCart = async ({
    productId,
    token,
  }: DeleteItemCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized action, your token is not valid!!");
      }

      const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("deleting product from cart failed!!");
      }

      const cart = await response.json();

      setCartItems([...cart.items]);
      setTotalAmount(cart.totalAmount);
      toast.success(`product ${productId} was deleted!!`);
      return cart;
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message);
      return err;
    }
  };
  const clearAllItemsFromCart = async ({ token }: ClearCartParamsType) => {
    try {
      if (!token) {
        throw new Error("Unauthorized action, your token is not valid!!");
      }

      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("clear all product from cart failed!!");
      }

      const cart = await response.json();

      setCartItems([]);
      setTotalAmount(0);

      toast.success(`cart was cleared!!`);
      return cart;
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message);
      return err;
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
        throw new Error("Unauthorized action, your token is not valid!!");
      }

      const response = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });
      if (!response.ok) {
        throw new Error("can't create order, please check your connection!!");
      }
      const order = await response.json();

      setCartItems([]);
      setTotalAmount(0);

      toast.success(`congrats your order is confirmed success!!`);
      return order;
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message);
      return err?.message;
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
