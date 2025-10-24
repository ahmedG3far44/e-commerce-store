import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../utils/types";
import { HiShoppingCart } from "react-icons/hi";
import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";

function ImageSlider({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  const nextImage = () => {
    setActive((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full  rounded-2xl flex items-center justify-center m-auto bg-zinc-200 group">
      <img
        src={
          images[active] ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
        }
        alt="Product"
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            aria-label="Previous image"
          >
            <svg
              className="w-5 h-5 text-zinc-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            aria-label="Next image"
          >
            <svg
              className="w-5 h-5 text-zinc-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === active ? "bg-white w-6" : "bg-white/60"
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProductCard(product: IProduct) {
  const { _id, title, categoryName, images, price, stock } = product;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;

  const { isAuthenticated, user, token } = useAuth();
  const { addItemToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!token) {
      navigate("/login");
    } else {
      addItemToCart({ productId: _id, quantity: 1, token });
    }
  };

  return (
    <article className="bg-white rounded-lg border border-zinc-300 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative w-full aspect-square overflow-hidden bg-zinc-50">
        <ImageSlider images={images} />
        {categoryName && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {categoryName}
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            Only {stock} left
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between gap-3 pt-3 border-t border-zinc-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">
              $
              {product.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {!isOutOfStock && (
              <span className="text-xs text-zinc-500">
                {stock > 10 ? "In Stock" : `${stock} left`}
              </span>
            )}
          </div>

          {!isOutOfStock && isAuthenticated && !user?.isAdmin && (
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 font-medium text-sm flex items-center gap-2 transition-colors shadow-sm active:scale-95"
              aria-label={`Add ${title} to cart`}
            >
              <HiShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
        <h3 className="font-bold text-zinc-900 text-base mb-2 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>
      </div>
    </article>
  );
}

export default ProductCard;
