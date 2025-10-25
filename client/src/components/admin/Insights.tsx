import Charts from "./Charts";
import StatusOrders from "./StatusOrders";
import SalesInsights from "./SalesInsights";
import TopRatedCustomers from "./TopRatedCustomers";

export interface SalesInsightsType {
  totalSales: number;
  totalOrders: number;
  mostSpent: number;
  activeCustomers: number;
}
function Insights() {
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
