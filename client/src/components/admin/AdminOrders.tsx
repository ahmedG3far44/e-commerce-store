import { Order } from "../../utils/types";
import { useEffect, useState } from "react";
import ShowOrdersHistory from "../ShowOrdersHistory";
import useAuth from "../../context/auth/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function AdminOrders({ OrderStatus }: { OrderStatus: string }) {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const { token } = useAuth();
  useEffect(() => {
    async function getAllPendingOrders(OrderStatus: string) {
      const url = `${BASE_URL}/admin/orders/${
        OrderStatus === "shipped"
          ? "shipped"
          : OrderStatus === "pending"
          ? "pending"
          : OrderStatus === "delivered"
          ? "delivered"
          : OrderStatus === "canceled"
          ? "canceled"
          : "all"
      }`;
      try {
        console.log(url);
        if (!token) return;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("connection error can't get pending orders list!!");
        }
        const ordersList = await response.json();
        console.log(ordersList);
        const { orders } = ordersList;
        return orders;
      } catch (err: any) {
        console.log(err?.message);
        alert(err?.message);
      }
    }
    getAllPendingOrders(OrderStatus).then((orders) =>
      setOrdersList([...orders])
    );
  }, [token]);
  return (
    <div>
      {ordersList.length > 0 ? (
        <>
          <h1 className="text-2xl text-blue-500 font-bold my-8">
            Orders: {ordersList.length}
          </h1>
          <div className="w-full min-w-full flex flex-col-reverse justify-start items-start gap-4 bg-zinc-50 border border-zinc-200 p-4 rounded-md my-4">
            {ordersList.map((order) => {
              return (
                <ShowOrdersHistory
                  key={order._id}
                  _id={order._id}
                  totalOrderPrice={order.totalOrderPrice}
                  status={order.status}
                  updatedAt={order.updatedAt}
                  userId={order.userId}
                  orderItems={order.orderItems}
                  createdAt={order.createdAt}
                  customer={order?.customer}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center mt-40">
          <p className="text-3xl text-gray-500 font-semibold">
            There is no orders available yet!!
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
