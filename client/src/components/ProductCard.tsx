import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IProduct } from "../utils/types";
import { HiShoppingCart } from "react-icons/hi";
import { handlePrice } from "../utils/handlers";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

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
    <div className="relative w-[250px] h-[250px]  rounded-md overflow-hidden flex items-center justify-center bg-white border border-zinc-300 group p-2">
      <img
        src={
          images[active] ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
        }
        alt="Product"
        loading="lazy"
        className="w-full h-full object-cover rounded-md "
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
            aria-label="Previous image"
          >
            <BiLeftArrowAlt size={10} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
            aria-label="Next image"
          >
            <BiRightArrowAlt size={10} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === active ? "bg-blue-500 w-6" : "bg-gray-500"
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
  const { _id, title, images, price, stock } = product;
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
    <article className="p-4 rounded-lg  overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full gap-4">
      <div className="relative overflow-hidden bg-zinc-50">
        <ImageSlider images={images} />
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
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-t border-zinc-100">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">
              ${handlePrice(price)}
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
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 font-medium text-sm flex items-center gap-2 transition-colors shadow-sm active:scale-95 cursor-pointer"
              aria-label={`Add ${title} to cart`}
            >
              <HiShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
        <Link
          to={`/product/${product._id}`}
          className="font-bold text-zinc-900 text-base mb-2 line-clamp-2 min-h-fit hover:underline hover:text-blue-500 duration-300 cursor-pointer"
        >
          {title}
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
