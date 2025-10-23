import { useState } from "react";
import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../utils/types";

// Mock ImageSlider for demo
function ImageSlider({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="w-full h-full relative group">
      <img
        src={
          images[active] ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
        }
        alt="Product"
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === active ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  _id,
  title,
  description,
  categoryName,
  images,
  price,
  stock,
}: IProduct) {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { addItemToCart } = useCart();
  const isAdmin = user?.isAdmin;
  const handleAddToCart = () => {
    if (user && token) {
      addItemToCart({ productId: _id, quantity: 1, token });
    } else {
      navigate("/login");
    }
  };

  const isOutOfStock = stock === 0;

  return (
    <article className="group bg-white rounded-xl flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border border-zinc-300 h-full max-h-[400px] max-w-[400px] ">
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden bg-zinc-100">
        <ImageSlider images={images as string[]} />

        {/* Category Badge */}
        {categoryName && (
          <Badge text={categoryName} className="absolute right-3 top-3" />
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Container - Flexbox for proper spacing */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <a
          href={`/product/${_id}`}
          className="font-bold text-base sm:text-lg text-zinc-900 hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-1"
          title={title}
        >
          {title}
        </a>
        <p
          className="text-zinc-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow"
          title={description ?? ""}
        >
          {description ?? ""}
        </p>

        {/* Footer - Price and Action (pushed to bottom) */}
        <div className="mt-auto pt-3 border-t border-zinc-100">
          {isAdmin ? (
            // Admin View
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900">
                  {price?.toFixed(2)}
                  <span className="text-sm text-zinc-500 font-normal ml-1">
                    EGP
                  </span>
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  stock > 10
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : stock > 0
                    ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {stock} in stock
              </span>
            </div>
          ) : (
            // Customer View
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900">
                  ${price?.toFixed(2)}
                </span>
              </div>

              {!isOutOfStock && (
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2.5 hover:bg-blue-600 active:scale-95 transition-all duration-200 font-medium text-sm whitespace-nowrap shadow-sm hover:shadow-md"
                  aria-label={`Add ${title} to cart`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Add</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Badge Component
function Badge({
  text,
  className = "",
}: {
  className?: string;
  text: string | null;
}) {
  if (!text) return null;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg backdrop-blur-sm ${className}`}
    >
      {text}
    </span>
  );
}

export default ProductCard;
