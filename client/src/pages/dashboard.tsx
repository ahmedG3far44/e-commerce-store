import { useEffect, useState } from "react";

import { LuBox } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { PiUsersDuotone } from "react-icons/pi";
import { OrdersCountType } from "../utils/types";
import { AiOutlineProduct } from "react-icons/ai";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiBarChartSquare, BiHomeSmile } from "react-icons/bi";
import { TbShoppingCartCopy, TbSitemap } from "react-icons/tb";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../context/auth/AuthContext";

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
      icon: <BiBarChartSquare size={20} />,
    },
    {
      id: 3,
      name: "Categories",
      link: "categories",
      path: "/dashboard/categories",
      icon: <TbSitemap size={20} />,
    },
    {
      id: 4,
      name: "Products",
      link: "products",
      path: "/dashboard/products",
      icon: <AiOutlineProduct size={20} />,
    },
    {
      id: 5,
      name: "Users",
      link: "users",
      path: "/dashboard/users",
      icon: <PiUsersDuotone size={20} />,
    },
    {
      id: 6,
      name: "All Orders",
      link: "all-orders",
      path: "/dashboard/all-orders",
      icon: <LuBox size={20} />,
    },
    {
      id: 7,
      name: "Delivered Orders",
      link: "delivered-orders",
      path: "/dashboard/delivered-orders",
      icon: <TbShoppingCartCopy size={20} />,
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
      <DashboardSidebar
        dashboardList={dashboardList}
        pending={pending}
        orderStatus={orderStatus}
        activeLink={activeLink as string}
        handelLogout={handelLogout}
      />
      <main className="w-[80%] min-h-screen h-screen overflow-y-auto absolute right-0 top-0  p-4 max-sm:w-full max-md:w-full max-sm:relative max-md:relative">
        {<Outlet />}
      </main>
    </div>
  );
}

export default Dashboard;

interface DashboardSidebarProps {
  dashboardList: any[];
  activeLink: string;
  orderStatus: {
    pending: number;
    delivered: number;
    shipped: number;
    totalOrders: number;
  };
  pending: boolean;
  handelLogout: () => void;
}

export function DashboardSidebar({
  dashboardList,
  activeLink,
  orderStatus,
  pending,
  handelLogout,
}: DashboardSidebarProps) {
  return (
    <aside className="min-h-screen h-full w-[280px] bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 p-6 flex flex-col justify-between items-start fixed left-0 top-0 max-md:hidden max-sm:hidden shadow-sm">
      <div className="w-full mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="w-full flex-1 overflow-y-auto">
        <ul className="w-full flex flex-col items-start gap-2">
          {dashboardList.map((url) => {
            const isActive = url.link === activeLink;
            let notificationCount = 0;
            if (url.link === "pending-orders") {
              notificationCount = orderStatus.pending;
            } else if (url.link === "shipped-orders") {
              notificationCount = orderStatus.shipped;
            } else if (url.link === "all-orders") {
              notificationCount = orderStatus.totalOrders;
            }

            return (
              <li key={url.id} className="w-full">
                <a
                  href={url.path}
                  className={`
                    group relative w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl
                    transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}

                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className={`
                        text-xl transition-transform duration-200
                        ${isActive ? "scale-110" : "group-hover:scale-110"}
                      `}
                    >
                      {url.icon}
                    </span>

                    <span
                      className={`
                        font-medium text-sm
                        ${isActive ? "font-semibold" : ""}
                      `}
                    >
                      {url.name}
                    </span>
                  </div>

                  {pending ? (
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                  ) : (
                    <>
                      {notificationCount > 0 && (
                        <>
                          {url.link === "all-orders" ? (
                            <span
                              className={`
                                text-xs font-semibold px-2 py-1 rounded-md
                                ${
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-200 text-gray-600"
                                }
                              `}
                            >
                              {notificationCount}
                            </span>
                          ) : (
                            <span className="relative flex items-center justify-center">
                              <span
                                className={`
                                  inline-flex items-center justify-center min-w-[24px] h-6 px-2
                                  text-xs font-bold rounded-full
                                  ${
                                    isActive
                                      ? "bg-white text-blue-600"
                                      : "bg-blue-600 text-white"
                                  }
                                  shadow-sm
                                `}
                              >
                                {notificationCount > 99
                                  ? "99+"
                                  : notificationCount}
                              </span>

                              {!isActive && notificationCount > 0 && (
                                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                              )}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="w-full pt-6 border-t border-gray-200 mb-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-500 truncate">
              adminuser@techbad.com
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handelLogout}
        className="
          w-full flex items-center justify-center gap-2
          px-4 py-3.5 rounded-xl
          bg-white text-gray-700 font-semibold
          border-2 border-gray-200
          hover:bg-red-50 hover:text-red-600 hover:border-red-200
          transition-all duration-200
          shadow-sm hover:shadow-md
          group cursor-pointer
        "
      >
        <FiLogOut className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
