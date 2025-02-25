import { createContext, useContext } from "react";

interface ParamsType {
  productId: string;
  quantity: number;
}
interface ParamsDeleteType {
  productId: string;
}
interface CartContextType {
  cartItems: string[];
  totalAmount: number;
  addItemToCart: ({ productId, quantity }: ParamsType) => void;
  updateItemInCart: ({ productId, quantity }: ParamsType) => void;
  deleteOneItemFromCart: ({ productId }: ParamsDeleteType) => void;
  clearAllItemsFromCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  addItemToCart: () => {},
  updateItemInCart: () => {},
  deleteOneItemFromCart: () => {},
  clearAllItemsFromCart: () => {},
});

const useCart = () => useContext(CartContext);

export default useCart;
