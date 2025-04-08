// hooks 
import { useEffect, useState } from "react";
import useAuth from "../../context/auth/AuthContext";

// components
import InsightsCard from "./InsightsCard";
import { SalesInsightsType } from "./Insights";

// icons 
import { FaRegUserCircle } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";
import { MdDoneAll } from "react-icons/md";
import { PiChartLineUp } from "react-icons/pi";


const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function SalesInsights() {
  const { token } = useAuth();
  const [pending, setPending] = useState(false);

  const [duration] = useState("day");
  const [salesInsights, setSalesInsights] = useState<SalesInsightsType>({
    totalSales: 0,
    totalOrders: 0,
    mostSpent: 0,
    activeCustomers: 0,
  });

  useEffect(() => {
    const handleChangeInsights = async () => {
      try {
        if (!token)
          throw new Error("Your aren't authorized to do this action!!");
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/sales`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("can't get admin insights!!");
        const insights = await response.json();

        setSalesInsights({ ...insights });
        return;
      } catch (err) {
        console.error(err);
        return;
      } finally {
        setPending(false);
      }
    };
    handleChangeInsights();
  }, [token]);
  const info = [
    {
      name: "Total Sales",
      icon: <PiChartLineUp color="#2196F3" size={25} />,
      money: salesInsights.totalSales,
      prefix: "EGP",
    },
    {
      name: "Confirmed Orders",
      icon: <MdDoneAll color="green" size={25} />,
      money: salesInsights.totalOrders,
      prefix: salesInsights.totalOrders <= 1 ? "order" : "orders",
    },
    {
      name: "Most Spent",
      icon: <LuWallet color="gray" size={25} />,
      money: salesInsights.mostSpent,
      prefix: "EGP",
    },
    {
      name: "Active Customers",
      icon: <FaRegUserCircle color="gray" size={25} />,
      money: salesInsights.activeCustomers,
      prefix: salesInsights.activeCustomers <= 1 ? "customer" : "customers",
    },
  ];
  return (
    <div className="p-4 w-full flex justify-between gap-1 items-center flex-wrap max-sm:flex-wrap max-md:flex-wrap max-sm:justify-center max-md:justify-center">
      {info.map((card) => {
        return (
          <>
            {pending ? (
              <>
                <InsightsCardSkeleton />
              </>
            ) : (
              <InsightsCard
                name={card.name}
                icon={card.icon}
                money={card.money}
                info={`The ${card.name} of ${duration}`}
                prefix={card.prefix}
              />
            )}
          </>
        );
      })}
    </div>
  );
}

export function InsightsCardSkeleton() {
  return (
    <div
      className={
        "min-w-[350px] p-4 border border-zinc-50 rounded-md flex flex-col justify-center items-start gap-2 bg-zinc-100"
      }
    >
      <div className="w-full flex justify-between items-center">
        <h1 className="w-[100px] bg-zinc-200 rounded-md  p-1 h-5 animate-pulse"></h1>
        <h1 className="w-[80px] bg-zinc-200 rounded-md  p-1 h-5 animate-pulse"></h1>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-2">
        <span className="p-2 rounded-md h-5 w-[50%] bg-zinc-300 animate-pulse"></span>
        <span className="text-p-2 rounded-md h-6 w-[70%]  bg-zinc-300 animate-pulse"></span>
      </div>
      <p className="p-2 rounded-md h-5 w-[50%] bg-zinc-200 animate-pulse"></p>
    </div>
  );
}

export default SalesInsights;
