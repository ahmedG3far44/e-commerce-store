import { createContext, useContext } from "react";

export interface AddAndUpdateItemsToCartParamsType {
  productId: string;
  quantity: number;
  token: string;
}
export interface DeleteItemCartParamsType {
  productId: string;
  token: string;
}
export interface ClearCartParamsType {
  token: string;
}
interface CartContextType {
  cartItems: string[];
  totalAmount: number;
  addItemToCart: ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => void;
  updateItemInCart: ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => void;
  deleteOneItemFromCart: ({
    productId,
    token,
  }: DeleteItemCartParamsType) => void;
  clearAllItemsFromCart: ({ token }: ClearCartParamsType) => void;
  getUserCart: ({ token }: ClearCartParamsType) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  addItemToCart: () => {},
  updateItemInCart: () => {},
  deleteOneItemFromCart: () => {},
  clearAllItemsFromCart: () => {},
  getUserCart: () => {},
});

const useCart = () => useContext(CartContext);

export default useCart;
