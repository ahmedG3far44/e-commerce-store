/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ShowOrdersHistory from "../ShowOrdersHistory";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function AdminOrders() {
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  useEffect(() => {
    async function getAllPendingOrders() {
      try {
        const response = await fetch(`${BASE_URL}/admin/orders`);
        if (!response.ok) {
          throw new Error("connection error can't get pending orders list!!");
        }
        const pendingOrders = await response.json();
        return pendingOrders;
      } catch (err: any) {
        console.log(err?.message);
        alert(err?.message);
      }
    }
    getAllPendingOrders().then((orders) => setPendingOrders([...orders]));
  }, []);
  return (
    <div>
      <h1>Pending Orders</h1>
      {pendingOrders.length > 0 ? (
        <div className="w-full min-w-full flex flex-col-reverse justify-start items-start gap-4 bg-zinc-50 border border-zinc-200 p-4 rounded-md my-4">
          {pendingOrders.map((order) => {
            return (
              <ShowOrdersHistory
                key={order._id}
                id={order._id}
                address={order.address}
                totalAmount={order.totalOrderPrice}
                status={order.status}
                items={order.orderItems}
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center mt-40">
          <p className="text-3xl text-gray-500 font-semibold">
            There is no orders yet!!
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
