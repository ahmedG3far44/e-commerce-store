import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  return (
    <div
      className="w-full cursor-pointer  p-4 rounded-xl"
      role="button"
      onClick={() => navigate("/")}
    >
      <div className="text-3xl font-bold flex justify-center items-center gap-4">
        <span className="text-blue-500">
          <img src={"../../public/icon.png"} width={40} height={40} />
        </span>{" "}
        <h1 className="w-full text-start text-blue-500 max-sm:hidden hover:text-blue-600">
          Online Store
        </h1>
      </div>
    </div>
  );
}

export default Logo;
