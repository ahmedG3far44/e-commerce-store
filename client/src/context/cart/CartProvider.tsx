import { useState } from "react";
import {
  AddAndUpdateItemsToCartParamsType,
  CartContext,
  ClearCartParamsType,
  DeleteItemCartParamsType,
} from "./CartContext";
import { FC, PropsWithChildren } from "react";
import { IProductItem } from "../../utils/types";

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

      console.log(cart);

      if (!cart) {
        throw new Error(
          "can't get user items cart. please check your connections!!"
        );
      }

      const cartItems = cart.items;

      console.log(cartItems);

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
        throw new Error(
          "adding product to cart failed. please check your connection!!"
        );
      }
      const cart = await response.json();

      // set new items array
      // set new total amount price
      setCartItems([...cart.items]);
      setTotalAmount(cart.totalAmount);
      return cart;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const updateItemInCart = async ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => {
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

    return cart;
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

      return cart;
    } catch (err) {
      console.error(err);
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
      console.log(cart);

      setCartItems([]);
      setTotalAmount(0);
      return cart;
    } catch (err) {
      console.error(err);
      return err;
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
