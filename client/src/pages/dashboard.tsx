import { useEffect, useState } from "react";
import useAuth from "../context/auth/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { BiHomeSmile } from "react-icons/bi";
import {
  LuChartColumnBig,
  LuBox,
  LuBoxes,
  LuGitCompare,
  LuLayoutPanelTop,
} from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { LiaUserCircleSolid, LiaShippingFastSolid } from "react-icons/lia";
import { OrdersCountType } from "../utils/types";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function Dashboard() {
  const { logOut, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrdersCountType>({
    pending: 0,
    delivered: 0,
    shipped: 0,
    totalOrders: 0,
  });
  const activeLink = location.pathname.split("/").pop();
  useEffect(() => {
    async function getOrdersCountStatus() {
      try {
        if (!token) throw new Error("your not authorized to do this action!!!");
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/orders-insights`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("can't get orders counts insights!!");
        const data = await response.json();
        setOrderStatus({ ...data });
        return;
      } catch (err) {
        console.error(err);
      } finally {
        setPending(false);
      }
    }
    getOrdersCountStatus();
  }, [token]);

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
      name: "Insight",
      link: "insights",
      path: "/dashboard/insights",
      icon: <LuChartColumnBig size={20} />,
    },
    {
      id: 3,
      name: "Categories",
      link: "categories",
      path: "/dashboard/categories",
      icon: <LuLayoutPanelTop size={20} />,
    },
    {
      id: 4,
      name: "Products",
      link: "products",
      path: "/dashboard/products",
      icon: <LuBox size={20} />,
    },
    {
      id: 5,
      name: "Users",
      link: "users",
      path: "/dashboard/users",
      icon: <LiaUserCircleSolid size={20} />,
    },
    {
      id: 6,
      name: "All Orders",
      link: "all-orders",
      path: "/dashboard/all-orders",
      icon: <LuBoxes size={20} />,
    },
    {
      id: 7,
      name: "Delivered Orders",
      link: "delivered-orders",
      path: "/dashboard/delivered-orders",
      icon: <LuBoxes size={20} />,
    },
    {
      id: 8,
      name: "Pending Orders",
      link: "pending-orders",
      path: "/dashboard/pending-orders",
      icon: <MdAccessTime size={20} />,
    },
    {
      id: 9,
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
    <div className="w-full min-h-screen max-w-full flex justify-start bg-zinc-300 items-start  relative ">
      <aside className="min-h-screen h-full w-[20%] bg-gray-100 p-4 flex flex-col justify-between items-start fixed left-0 top-0 max-md:hidden max-sm:hidden">
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
                <li className="flex justify-between items-center gap-4">
                  <div className="flex justify-start gap-4 items-center">
                    <span>{url.icon}</span>
                    {url.name}
                  </div>
                  {url.link === "pending-orders" ? (
                    pending ? (
                      <Skeleton />
                    ) : (
                      <>
                        {orderStatus.pending > 0 && (
                          <Notification number={orderStatus.pending} />
                        )}
                      </>
                    )
                  ) : url.link === "delivered-orders" ? (
                    pending ? (
                      <Skeleton />
                    ) : (
                      <>
                        {orderStatus.delivered > 0 && (
                          <Notification number={orderStatus.delivered} />
                        )}
                      </>
                    )
                  ) : url.link === "shipped-orders" ? (
                    pending ? (
                      <Skeleton />
                    ) : (
                      <>
                        {orderStatus.shipped > 0 && (
                          <Notification number={orderStatus.shipped} />
                        )}
                      </>
                    )
                  ) : url.link === "all-orders" ? (
                    pending ? (
                      <Skeleton />
                    ) : (
                      <>
                        {orderStatus.totalOrders > 0 && (
                          <span className="text-[12px] font-semibold text-zinc-500">
                            {orderStatus.totalOrders}
                          </span>
                        )}
                      </>
                    )
                  ) : null}
                </li>
              </a>
            );
          })}
        </ul>
        <button
          onClick={handelLogout}
          className="hover:bg-blue-700 duration-150 cursor-pointer w-full p-4 rounded-md bg-blue-500 text-white mt-auto"
        >
          Logout
        </button>
      </aside>
      <main className="w-[80%] min-h-screen h-screen overflow-y-auto absolute right-0 top-0  p-4 max-sm:w-full max-md:w-full max-sm:relative max-md:relative">
        {<Outlet />}
      </main>
    </div>
  );
}

export default Dashboard;

function Skeleton() {
  return (
    <span className={"w-6 h-6 bg-zinc-300 rounded-full animate-pulse"}></span>
  );
}
function Notification({ number }: { number: number }) {
  return (
    <div className="p-2 w-5 h-5 font-semibold bg-blue-500 text-white rounded-full text-[10px] flex items-center justify-center">
      <span>{number}</span>
    </div>
  );
}
