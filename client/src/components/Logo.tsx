import { useNavigate } from "react-router-dom";
import { FaShoppingBasket } from "react-icons/fa";

function Logo() {
  const navigate = useNavigate();
  return (
    <div
      className="cursor-pointer hover:bg-zinc-50 p-4 rounded-xl"
      role="button"
      onClick={() => navigate("")}
    >
      <h1 className="text-3xl font-bold flex justify-center items-center gap-4">
        <span className="text-blue-500">
          <FaShoppingBasket size={40} />
        </span>{" "}
        <span className="text-blue-500">Online Store</span>
      </h1>
    </div>
  );
}

export default Logo;
