import { useNavigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";
import ProductImage from "./ProductImage";

export interface ProductInfoProps {
  productId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  stock: number;
  price: number;
  createdAt: string;
}
function ProductInfo({
  productId,
  title,
  description,
  category,
  images,
  stock,
  price,
  createdAt,
}: ProductInfoProps) {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const { cartItems, addItemToCart } = useCart();

  const handelAddToCart = async () => {
    if (!isAuthenticated || !token) {
      navigate("/login");
    } else {
      await addItemToCart({ productId, token, quantity: 1 });
    }
  };
  const handelBuyNow = async () => {
    if (!isAuthenticated || !token) {
      navigate("/login");
    } else {
      const product = cartItems.find(
        (product) => product.productId === productId
      );
      if (!product) {
        await addItemToCart({ productId, token, quantity: 1 });
        navigate("/cart");
      } else {
        navigate("/cart");
      }
    }
  };
  return (
    <div className="w-full flex justify-between gap-8 items-start mt-10">
      <div className="flex-1 h-[400px] grid grid-cols-2 gap-2  object-cover">
        <ProductImage images={images} />
      </div>
      <div className="flex-1 h-[400px]  flex flex-col justify-between items-start gap-8">
        <h2 className="text-3xl text-gray-700 font-bold">{title}</h2>
        <h4>{category}</h4>
        <div className="flex flex-col justify-start items-start">
          <span>{price} EGP</span>
          <span>{stock}</span>
        </div>
        <div className="my-8 text-gray-700">
          <p>{description}</p>
        </div>
        <div>
          <span className="text-sm">
            last updates: <span className="text-gray-500">{createdAt}</span>
          </span>
        </div>
        <div className="w-full flex justify-center h-auto  items-end gap-4">
          <button
            onClick={handelAddToCart}
            className="px-4 py-2 cursor-pointer rounded-md text-blue-500 border hover:bg-blue-500 hover:text-white duration-150 border-blue-500 w-full"
          >
            Add To Cart
          </button>
          <button
            onClick={handelBuyNow}
            className="px-4 py-2 cursor-pointer rounded-md text-white bg-blue-500 w-full hover:bg-blue-700"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
