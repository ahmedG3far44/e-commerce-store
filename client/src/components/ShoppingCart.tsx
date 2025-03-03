import { TbShoppingBag } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function ShoppingCart({ itemsCartNumber }: { itemsCartNumber: number }) {
  const navigate = useNavigate();
  const handelNavigateToCart = () => {
    navigate("/cart");
  };
  return (
    <div
      onClick={handelNavigateToCart}
      role="button"
      className="relative rounded-md duration-150 cursor-pointer "
    >
      {itemsCartNumber > 0 && (
        <span className="absolute -right-2 -top-1 w-5 h-5 p-2 text-sm flex justify-center items-center rounded-full bg-blue-500 text-white">
          {itemsCartNumber}
        </span>
      )}

      <TbShoppingBag size={25} />
    </div>
  );
}

export default ShoppingCart;
