import Charts from "./Charts";
import TopRatedCustomers from "./TopRatedCustomers";
import StatusOrders from "./StatusOrders";
// import useAuth from "../../context/auth/AuthContext";
import SalesInsights from "./SalesInsights";

// const BASE_URL = import.meta.env.VITE_BASE_URL as string;
export interface SalesInsightsType {
  totalSales: number;
  totalOrders: number;
  mostSpent: number;
  activeCustomers: number;
}
function Insights() {
  // const { token } = useAuth();

  return (
    <div className="min-w-full min-h-full">
      <div className="w-full  p-4 flex justify-between items-center">
        <h1 className="font-black text-4xl text-zinc-900">
          Dashboard Insights
        </h1>
        <select
          className="p-2 w-[200px] rounded-md border border-zinc-100 bg-white"
          name=""
          id=""
        >
          <option value="">today</option>
          <option value="">yesterday</option>
          <option value="">month ago</option>
          <option value="">year ago </option>
        </select>
      </div>

      <SalesInsights />
      <StatusOrders />
      <div className="p-4 w-full grid grid-cols-2 grid-flow-row  gap-4 max-md:grid-cols-1 max-sm:grid-cols-1">
        <div className="p-4  border  border-zinc-200 bg-white rounded-xl">
          <Charts />
        </div>
        <div className="p-4  border  border-zinc-200 bg-white rounded-xl">
          <TopRatedCustomers />
        </div>
      </div>
    </div>
  );
}

export default Insights;
