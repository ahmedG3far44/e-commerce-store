import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";

import { LiaShippingFastSolid } from "react-icons/lia";
import { PiUsersBold } from "react-icons/pi";
import { AiOutlineProduct } from "react-icons/ai";
import { BiHomeSmile } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";
import { PiShippingContainer } from "react-icons/pi";

function Dashboard() {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeLink = location.pathname.split("/").pop();
  const dashboardList = [
    {
      id: 1,
      name: "Home",
      link: "home",
      path: "/",

      icon: <BiHomeSmile size={20} />,
    },
    {
      id: 2,
      name: "Products",
      link: "products",
      path: "/dashboard/products",
      icon: <AiOutlineProduct size={20} />,
    },
    {
      id: 3,
      name: "Users",
      link: "users",
      path: "/dashboard/users",
      icon: <PiUsersBold size={20} />,
    },
    {
      id: 4,
      name: "All Orders",
      link: "orders",
      path: "/dashboard/orders",
      icon: <PiShippingContainer size={20} />,
    },
    {
      id: 5,
      name: "Pending Orders",
      link: "pending-orders",
      path: "/dashboard/pending-orders",
      icon: <MdAccessTime size={20} />,
    },
    {
      id: 6,
      name: "Shipped Orders",
      link: "shipped-orders",
      path: "/dashboard/shipped-orders",
      icon: <LiaShippingFastSolid size={20} />,
    },
  ];

  const handelLogout = () => {
    logOut();
    navigate("/");
  };
  return (
    <div className="w-screen min-h-screen max-w-screen flex justify-start items-start ">
      <aside className="min-h-screen w-[20%] bg-gray-100 p-4 flex flex-col justify-between items-start ">
        <ul className="w-full flex justify-between flex-col items-start gap-1">
          {dashboardList.map((url) => {
            return (
              <a
                key={url.id}
                className={`${
                  url.link === activeLink &&
                  "text-blue-500 bg-blue-200 font-bold"
                } hover:bg-blue-200 w-full p-4 rounded-md duration-150 border border-zinc-200 bg-white`}
                href={url.path}
              >
                <li className="flex items-center gap-4">
                  <span>{url.icon}</span>
                  {url.name}
                </li>
              </a>
            );
          })}
        </ul>
        <button
          onClick={handelLogout}
          className="hover:bg-blue-700 duration-150 cursor-pointer w-full p-4 rounded-md bg-blue-500 text-white"
        >
          Logout
        </button>
      </aside>
      <main className="w-[80%] min-h-screen   p-4">
        <h1>Dashboard Admin</h1>
        {<Outlet />}
      </main>
    </div>
  );
}

export default Dashboard;
