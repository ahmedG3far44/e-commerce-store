import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  // ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAuth from "../../context/auth/AuthContext";
import StatusOrders from "./StatusOrders";
const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function Insights() {
  const { token } = useAuth();
  const [pending, setPending] = useState(false);
  const data = [
    {
      name: "Jan Orders",
      totalOrders: 2400,
      month: "Jan",
      amt: 2400,
    },
    {
      name: "Feb Orders",
      totalOrders: 1398,
      month: "Feb",
      amt: 2210,
    },
    {
      name: "Mar Orders",
      totalOrders: 9800,
      month: "Mar",
      amt: 2290,
    },
    {
      name: "Apr Orders",
      totalOrders: 3908,
      month: "Apr",
      amt: 2000,
    },
    {
      name: "May Orders",
      totalOrders: 4800,
      month: "May",
      amt: 2181,
    },
    {
      name: "Jun Orders",
      totalOrders: 3800,
      month: "Jun",
      amt: 2500,
    },
    {
      name: "Jul Orders",
      totalOrders: 4300,
      month: "Jul",
      amt: 2100,
    },
    {
      name: "Aug Orders",
      totalOrders: 4300,
      month: "Aug",
      amt: 2100,
    },
    {
      name: "Oct Orders",
      totalOrders: 4300,
      month: "Oct",
      amt: 2100,
    },
    {
      name: "Nov Orders",
      totalOrders: 4300,
      month: "Nov",
      amt: 2100,
    },
    {
      name: "Dec Orders",
      totalOrders: 12000,
      month: "Dec",
      amt: 2100,
    },
  ];
  const [duration, setDuration] = useState("day");
  const [insightsData, setInsightsData] = useState({
    period: "day",
    totalRevenue: 0,
  });
  const handleChangeInsights = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDuration(e.target.value);
    console.log(insightsData);
    try {
      if (!token) throw new Error("Your aren't authorized to do this action!!");
      setPending(true);
      const response = await fetch(`${BASE_URL}/admin/revenue/${duration}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("can't get admin insights!!");
      const insights = await response.json();
      console.log(insights);
      // const data = insights.data;
      // console.log(insights.data);

      setInsightsData({ ...insights });
      // set new data
      return;
    } catch (err) {
      console.error(err);
      return;
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="p-4 w-full flex justify-start items-start min-h-full gap-4">
      {pending ? (
        <div className="w-full min-h-screen flex justify-center items-start mt-20">
          <div className="border-zinc-500 border-2 border-l-transparent rounded-full animate-spin w-8 h-8"></div>
        </div>
      ) : (
        <div className="p-4 w-full flex flex-col items-start gap-4">
          <div className="w-full flex justify-start items-center gap-8 flex-wrap">
            <div className="min-w-[250px] h-[200px] bg-white  p-4 border border-zinc-100 rounded-lg shadow-md flex flex-col items-center justify-center gap-8 font-bold text-3xl">
              <div>{insightsData?.period}</div>{" "}
              <div>{insightsData?.totalRevenue.toFixed(1)}EGP</div>
            </div>
          </div>
          <StatusOrders/>
          <div className="flex flex-col items-start space-y-8 p-8 bg-white shadow-md rounded-md">
            <select
              className="p-2 border rounded-md bg-zinc-100 border-zinc-200 w-[200px]"
              name="month-insights"
              id="month-insights"
              onChange={handleChangeInsights}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            {/* <ResponsiveContainer width={700} height="80%"> */}
            <AreaChart
              data={data}
              width={700}
              height={300}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  key={"colorUv"}
                  id="colorUv"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  key={"colorPv"}
                  id="colorPv"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis dataKey={"totalOrders"} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                key={1}
                type="monotone"
                dataKey="month"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
              <Area
                key={2}
                type="monotone"
                dataKey="totalOrders"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            </AreaChart>
            {/* </ResponsiveContainer> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Insights;
