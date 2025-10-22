import { useState } from "react";
import noValidImage from "../../public/placeholder.png";
import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";
import handelDates from "../utils/handelDates";

interface ItemCart {
  productId: string;
  title: string;
  description: string;
  categoryName: string | null;
  image: string;
  quantity: number;
  stock: number;
  price: number;
  updatedAt: Date;
  checkoutState?: boolean;
}
function ItemCart({
  productId,
  title,
  categoryName,
  description,
  image,
  quantity,
  price,
  updatedAt,
  checkoutState,
}: ItemCart) {
  const { token } = useAuth();
  const { updateItemInCart, deleteOneItemFromCart } = useCart();
  const [newQuantity, setNewQuantity] = useState(quantity);
  const date = new Date(updatedAt);

  if (!token) return;

  const handelUpdateQuantity = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateItemInCart({ productId, quantity: newQuantity, token });

      // if it success show toast message
    } else {
      setNewQuantity(1);
    }
  };
  return (
    <div className="w-full  flex flex-col justify-start items-start border border-zinc-200 rounded-md   p-4  bg-zinc-100">
      <div className="w-full flex justify-between items-center">
        <div className="w-20 h-20 rounded-2xl overflow-hidden mr-8 border border-zinc-200">
          <img
            className="w-full h-full object-cover"
            src={image ? image : noValidImage}
            alt={title + " " + description}
          />
        </div>

        <div className="w-[30%] flex flex-col justify-start items-start gap-2">
          <h2 className="text-xl font-bold">{title}</h2>
          {checkoutState && (
            <p className="text-sm line-clamp-3 text-gray-600">{description}</p>
          )}
          <span className="text-sm text-zinc-500 ">{handelDates(date)}</span>
        </div>

        <span className="text-md font-semibold text-blue-500">
          {categoryName}
        </span>

        <div className="flex items-center gap-4">
          <span>${price}</span>X<span>{newQuantity}</span>
        </div>
        {checkoutState && (
          <div className="flex justify-center items-center gap-4 ">
            <button
              className="p-2 w-10 h-10 bg-blue-500 hover:bg-blue-800 cursor-pointer rounded-md text-white text-2xl flex justify-center items-center"
              onClick={() => {
                setNewQuantity((prev) => (prev += 1));
                handelUpdateQuantity(newQuantity);
              }}
            >
              +
            </button>
            {newQuantity <= 1 ? (
              <button
                disabled
                className="p-2 w-10 h-10 bg-blue-500 hover:bg-blue-800 cursor-not-allowed disabled:bg-gray-400 rounded-md text-white text-2xl flex justify-center items-center"
              >
                -
              </button>
            ) : (
              <button
                className="p-2 w-10 h-10 bg-blue-500 hover:bg-blue-800 cursor-pointer rounded-md text-white text-2xl flex justify-center items-center"
                onClick={() => {
                  setNewQuantity((prev) => (prev -= 1));
                  handelUpdateQuantity(newQuantity);
                }}
              >
                -
              </button>
            )}
          </div>
        )}
        <span>
          {(price * newQuantity).toFixed(2)}{" "}
          <span className="text-[10px] text-zinc-600">EGP</span>
        </span>
      </div>
      {checkoutState && (
        <button
          onClick={() => {
            deleteOneItemFromCart({ token, productId });
          }}
          className="underline  cursor-pointer rounded-md text-rose-500 hover:text-rose-600"
        >
          Remove Item
        </button>
      )}
    </div>
  );
}

export default ItemCart;
