import { useNavigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";
import ProductImage from "./ProductImage";
import { IProduct } from "../utils/types";
import { handlePrice } from "../utils/handlers";

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
  _id,
  title,
  description,
  categoryName,
  images,
  stock,
  price,
  createdAt,
}: IProduct) {
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const { cartItems, addItemToCart } = useCart();

  const handelAddToCart = async () => {
    if (!isAuthenticated || !token) {
      navigate("/login");
    } else {
      await addItemToCart({ productId: _id, token, quantity: 1 });
    }
  };
  const handelBuyNow = async () => {
    if (!isAuthenticated || !token) {
      navigate("/login");
    } else {
      const product = cartItems.find((product) => product.productId === _id);
      if (!product) {
        await addItemToCart({ productId: _id, token, quantity: 1 });
        navigate("/cart");
      } else {
        navigate("/cart");
      }
    }
  };
  return (
    <div className="flex justify-between gap-10 items-center mt-10">
      <div className="flex-1 overflow-hidden">
        <ProductImage images={images} />
      </div>

      <div className="flex-1   flex flex-col justify-start items-start gap-2 p-4 ">
        <h2 className="text-4xl text-blue-500 font-black">{title}</h2>
        <div className="my-8 text-gray-700">
          <p>{description}</p>
        </div>
        <h4 className="text-blue-500 py-1 px-4 rounded-4xl my-4 border bg-blue-50 border-blue-500">
          {categoryName}
        </h4>
        <div className="flex flex-col justify-start items-start">
          <span className="text-2xl text-blue-500 font-bold">
            {handlePrice(price)}
          </span>
          <span className="text-sm my-4 text-zinc-500">
            {stock} item in stock
          </span>
        </div>
        <div>
          <span className="text-sm">
            last updates:{" "}
            <span className="text-gray-500">
              {createdAt && new Date(createdAt).toString()}
            </span>
          </span>
        </div>
        {isAuthenticated && !user?.isAdmin && (
          <div className="w-full flex justify-center  items-end gap-4 mt-auto">
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
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
