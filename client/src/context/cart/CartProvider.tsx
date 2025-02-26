import { useState } from "react";
import { CartContext } from "./CartContext";
import { FC, PropsWithChildren } from "react";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const addItemToCart = async ({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }) => {
    console.log(productId, quantity);
    setCartItems(["hello"]);
    setTotalAmount(0);
  };

  const updateItemInCart = async ({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }) => {
    console.log(productId, quantity);
  };
  const deleteOneItemFromCart = async ({
    productId,
  }: {
    productId: string;
  }) => {
    console.log(productId);
  };
  const clearAllItemsFromCart = async () => {
    console.log("clear all items");
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
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
