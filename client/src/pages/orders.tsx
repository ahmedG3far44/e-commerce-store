import { useEffect, useState } from "react";
import { getAllUserOrders } from "../utils/handlers";
import useAuth from "../context/auth/AuthContext";
import { Order } from "../utils/types";
import ShowOrdersHistory from "../components/ShowOrdersHistory";

function OrdersHistory() {
  const { token } = useAuth();
  const [ordersList, setOrders] = useState<Order[] | []>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!token) return;

    getAllUserOrders({ token })
      .then((ordersList) => {
        console.log(ordersList);
        setOrders(ordersList);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      });
  }, [token]);
  return (
    <div className="w-full">
      <h1 className="text-2xl text-gray-700 font-semibold">
        Orders History List{" "}
        {ordersList.length > 0 && (
          <span className="text-blue-500 mx-4">{ordersList.length} Orders</span>
        )}
      </h1>
      {error && (
        <p className="p-2 rounded-md border bg-rose-100 border-rose-600 text-rose-500">
          {error}
        </p>
      )}
      {ordersList.length === 0 ? (
        <div>
          <p className="text-2xl font-bold text-gray-700">
            there is no Orders available
          </p>
        </div>
      ) : (
        <div className="w-full b min-w-full flex flex-col-reverse justify-start items-start p-4 rounded-md mt-4">
          {ordersList.map((order) => {
            return (
              <ShowOrdersHistory
                key={order._id}
                _id={order._id}
                userId={order.userId}
                customer={order.customer}
                totalOrderPrice={order.totalOrderPrice}
                status={order.status as string}
                orderItems={order?.orderItems}
                createdAt={order?.createdAt}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersHistory;
