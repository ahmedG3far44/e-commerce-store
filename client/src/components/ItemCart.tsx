import { useState } from "react";
import noValidImage from "../../public/placeholder.png";
import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";
import handelDates from "../utils/handelDates";
import { BiLoader } from "react-icons/bi";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { handlePrice } from "../utils/handlers";

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
  stock,
  price,
  updatedAt,
  checkoutState,
}: ItemCart) {
  const { token } = useAuth();
  const { updateItemInCart, deleteOneItemFromCart, pending } = useCart();
  const [newQuantity, setNewQuantity] = useState(quantity);
  const [isDeleting, setIsDeleting] = useState(false);

  const date = new Date(updatedAt);

  if (!token) return null;

  // Fixed: Use functional setState to get current value
  const handleIncrement = () => {
    setNewQuantity((prev) => {
      const updated = prev + 1;
      if (updated <= stock) {
        updateItemInCart({ productId, quantity: updated, token });
        return updated;
      }
      return prev;
    });
  };

  const handleDecrement = () => {
    setNewQuantity((prev) => {
      const updated = prev - 1;
      if (updated > 0) {
        updateItemInCart({ productId, quantity: updated, token });
        return updated;
      }
      return prev;
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOneItemFromCart({ token, productId });
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const totalPrice = (price * newQuantity).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const unitPrice = price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const isOutOfStock = newQuantity > stock;
  const isAtMaxStock = newQuantity >= stock;
  const isAtMinQuantity = newQuantity <= 1;

  return (
    <div
      className={`w-full flex flex-col border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow ${
        isOutOfStock ? "border-red-300 bg-red-50" : "border-zinc-200"
      }`}
    >
      <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-zinc-200 bg-white">
          <img
            className="w-full h-full object-cover"
            src={image || noValidImage}
            alt={`${title} - ${description}`}
            onError={(e) => {
              e.currentTarget.src = noValidImage;
            }}
          />
        </div>

        <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 min-w-0 overflow-hidden">
          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <h2
              className="text-base sm:text-lg font-semibold text-zinc-900 line-clamp-2 break-words"
              title={title}
            >
              {title}
            </h2>

            {checkoutState && description && (
              <p
                className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1 break-words"
                title={description}
              >
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {categoryName && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {categoryName}
                </span>
              )}
              <span className="text-xs text-zinc-500">{handelDates(date)}</span>
            </div>

            <div className="flex sm:hidden items-baseline gap-2 mt-2">
              <span className="text-sm text-zinc-600">
                {handlePrice(unitPrice)} × {newQuantity}
              </span>
              <span className="text-base font-semibold text-zinc-900">
                = {handlePrice(totalPrice)}
              </span>
            </div>

            {isOutOfStock && (
              <div className="mt-2 text-xs text-red-600 font-medium">
                Only {stock} items available
              </div>
            )}
          </div>
          {checkoutState && (
            <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 bg-zinc-50 rounded-lg p-1 border border-zinc-200">
                <button
                  onClick={handleDecrement}
                  disabled={pending || isAtMinQuantity}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors flex-shrink-0 cursor-pointer"
                  aria-label="Decrease quantity"
                  title="Decrease quantity"
                >
                  {pending ? (
                    <BiLoader size={14} className="animate-spin" />
                  ) : (
                    <FiMinus size={14} />
                  )}
                </button>

                <span className="w-10 text-center text-sm font-semibold text-zinc-900 flex-shrink-0">
                  {newQuantity}
                </span>

                <button
                  onClick={handleIncrement}
                  disabled={pending || isAtMaxStock}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors flex-shrink-0 cursor-pointer"
                  aria-label="Increase quantity"
                  title={
                    isAtMaxStock
                      ? `Maximum stock: ${stock}`
                      : "Increase quantity"
                  }
                >
                  {pending ? (
                    <BiLoader size={14} className="animate-spin" />
                  ) : (
                    <FiPlus size={14} />
                  )}
                </button>
              </div>

              {stock > 0 && newQuantity < stock && (
                <span className="text-xs text-zinc-500 whitespace-nowrap">
                  {stock - newQuantity} left
                </span>
              )}
            </div>
          )}
          <div className="hidden sm:flex flex-col items-end flex-shrink-0 w-[100px]">
            <div className="text-xs text-zinc-500 mb-1 whitespace-nowrap">
              {unitPrice} × {newQuantity}
            </div>
            <div className="text-base sm:text-lg font-semibold text-zinc-900 whitespace-nowrap">
              {handlePrice(totalPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quantity Controls */}
      {checkoutState && (
        <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-zinc-200">
          <div className="flex items-center gap-2 bg-zinc-50 rounded-lg p-1 border border-zinc-200">
            <button
              onClick={handleDecrement}
              disabled={pending || isAtMinQuantity}
              className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-zinc-300 text-zinc-700 active:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              {pending ? (
                <BiLoader size={16} className="animate-spin" />
              ) : (
                <FiMinus size={16} />
              )}
            </button>

            <span className="w-12 text-center text-base font-semibold text-zinc-900">
              {newQuantity}
            </span>

            <button
              onClick={handleIncrement}
              disabled={pending || isAtMaxStock}
              className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-zinc-300 text-zinc-700 active:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              {pending ? (
                <BiLoader size={16} className="animate-spin" />
              ) : (
                <FiPlus size={16} />
              )}
            </button>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting || pending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Remove item from cart"
          >
            {isDeleting ? (
              <>
                <BiLoader size={16} className="animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <FiTrash2 size={16} />
                <span>Remove</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Desktop Remove Button */}
      {checkoutState && (
        <button
          onClick={handleDelete}
          disabled={isDeleting || pending}
          className="hidden sm:flex items-center gap-1.5 mt-3 pt-3 border-t border-zinc-200 text-sm font-medium text-red-600 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Remove item from cart"
        >
          {isDeleting ? (
            <>
              <BiLoader size={14} className="animate-spin" />
              <span>Removing item...</span>
            </>
          ) : (
            <>
              <FiTrash2 size={14} />
              <span>Remove from cart</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default ItemCart;
