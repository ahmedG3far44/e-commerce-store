import { useEffect, useState } from "react";
import useAuth from "../../context/auth/AuthContext";
import { HiOutlineCash } from "react-icons/hi";
import { HiOutlineTruck } from "react-icons/hi2";
import { FcShipped } from "react-icons/fc";
import { LuTimer } from "react-icons/lu";
import InsightsCard from "./InsightsCard";
import { InsightsCardSkeleton } from "./SalesInsights";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function StatusOrders() {
  const [pending, setPending] = useState(false);

  const [statusOrders, setOrderStatus] = useState({
    pending: 0,
    shipped: 0,
    delivered: 0,
    totalOrders: 0,
  });
  const { token } = useAuth();
  useEffect(() => {
    if (!token) return;
    async function getStatusOrders() {
      try {
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/orders-insights`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("can't get admin orders insights");

        const data = await response.json();
        setOrderStatus({ ...data });
        return;
      } catch (error) {
        console.error(error);
      } finally {
        setPending(false);
      }
    }
    getStatusOrders();
  }, [token]);

  const ordersInfo = [
    {
      name: "Pending Orders",
      icon: <LuTimer color="gray" size={25} />,
      money: statusOrders.pending,
      prefix: statusOrders.pending <= 1 ? "order" : "orders",
    },
    {
      name: "Shipped Orders",
      icon: <HiOutlineTruck color="gray" size={25} />,
      money: statusOrders.shipped,
      prefix: statusOrders.shipped <= 1 ? "order" : "orders",
    },
    {
      name: "Delivered Orders",
      icon: <FcShipped color="green" size={25} />,
      money: statusOrders.delivered,
      prefix: statusOrders.delivered <= 1 ? "order" : "orders",
    },
    {
      name: "Total Orders",
      icon: <HiOutlineCash color="green" size={25} />,
      money: statusOrders.totalOrders,
      prefix: statusOrders.totalOrders <= 1 ? "order" : "orders",
    },
  ];
  return (
    <div className="p-4 w-full flex justify-between gap-1 items-center flex-wrap max-sm:flex-wrap max-md:flex-wrap max-sm:justify-center max-md:justify-center">
      {ordersInfo.map((card) => {
        return (
          <>
            {pending ? (
              <InsightsCardSkeleton />
            ) : (
              <InsightsCard
                name={card.name}
                icon={<span>{card.icon}</span>}
                money={card.money}
                info={`The number of ${card.name}`}
                prefix={card.prefix}
              />
            )}
          </>
        );
      })}
    </div>
  );
}

export default StatusOrders;
