import noValidImage from "../../public/no-image.jpg";
import { TbShoppingCartPlus } from "react-icons/tb";
import useCart from "../context/cart/CartContext";
import useAuth from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export interface ProductCartProps {
  productId: string;
  title: string;
  description?: string;
  category?: string;
  images: string[];
  price: number;
  stock: number;
}
function ProductCart({
  productId,
  title,
  description,
  category,
  images,
  price,
  stock,
}: ProductCartProps) {
  const { addItemToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="w-full h-[400px] md:w-1/2 lg:w-[350px] p-4 rounded-md border border-gray-200 flex flex-col justify-start items-start gap-2">
      <div className="w-full h-full overflow-hidden rounded-md">
        <img
          className="w-full h-full object-cover"
          src={images[0] ? images[0] : noValidImage}
          alt="img"
        />
      </div>

      <div className="flex-1 mt-auto w-full min-h-1/2 flex flex-col justify-start items-start gap-2">
        <h1 className="text-xl font-bold text-zinc-800">{title}</h1>
        <span className="w-fit py-1 px-4 rounded-2xl text-sm  bg-blue-50 border-blue-600 text-blue-600">
          {category}
        </span>
        <p className="text-zinc-400 text-start line-clamp-2">{description}</p>

        <div className="w-full flex justify-between items-center mt-4">
          <div className="flex  justify-start items-end gap-2">
            <span className="text-blue-500 text-lg font-bold">{price}</span>{" "}
            <span className="text-[12px] text-zinc-500">EGP</span>
          </div>

          <div className="text-sm font-semibold">
            <span className="text-red-400">In Stock {stock}</span>
          </div>

          <button
            onClick={async () => {
              if (!token) {
                navigate("/login");
              } else {
                addItemToCart({
                  productId,
                  token,
                  quantity: 1,
                });
                toast.success("A new product was added to cart!!");
              }
            }}
            className=" flex justify-center items-center w-[100px] px-2 py-1 rounded-md bg-blue-500 cursor-pointer text-white hover:bg-blue-700 duration-150"
          >
            <span>
              <TbShoppingCartPlus size={20} color="text-blue-500" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCart;
