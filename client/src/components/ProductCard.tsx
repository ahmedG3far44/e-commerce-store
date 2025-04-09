import { TbShoppingCartPlus } from "react-icons/tb";
import useCart from "../context/cart/CartContext";
import useAuth from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../utils/types";
import ImageSlider from "./ImageSlider";

function ProductCard({
  _id,
  title,
  description,
  category,
  images,
  price,
  stock,
}: IProduct) {
  const { addItemToCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const handleAddToCart = () => {
    if (isAuthenticated && token) {
      addItemToCart({ productId: _id, quantity: 1, token });
    } else {
      navigate("/login");
    }
  };
  return (
    <div
      className="bg-white rounded-lg flex flex-col gap-2 items-center overflow-hidden shadow-md hover:shadow-lg transition border border-zinc-200 p-4"
    >
      <div className="w-full relative">
        <ImageSlider images={images} />
        <Badge className={"absolute right-4 top-0"} text={category} />
      </div>
      <div className="w-full p-4 mt-auto">
        <h3 className="font-bold text-lg mb-1">{title}</h3>

        <p className="text-gray-600 text-sm my-4 line-clamp-3">{description}</p>
        {stock !== 0 ? (
          <div className="w-full flex justify-between items-center mt-4">
            <span className="font-bold text-lg">
              ${price?.toFixed(2) || "0.00"}
            </span>
            <button
              onClick={handleAddToCart}
              className="w-[30%] flex items-center justify-center bg-blue-50 border text-blue-500 border-blue-500 rounded-2xl  py-2 px-4 hover:bg-blue-700 transition cursor-pointer hover:text-white"
            >
              <span>
                <TbShoppingCartPlus size={20} />
              </span>
            </button>
          </div>
        ) : (
          <div className="w-full p-2 flex justify-start items-center text-red-500 text-sm">
            <span>sold out</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Badge({
  text,
  className,
}: {
  className?: string;
  text: string | null;
}) {
  return (
    <span
      className={`${className} p-1 rounded-2xl px-2 text-sm bg-blue-100 text-blue-500 shadow-md border border-blue-100 my-4`}
    >
      {text}
    </span>
  );
}
export default ProductCard;
