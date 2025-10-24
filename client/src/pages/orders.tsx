import { useEffect, useState } from "react";
import { getAllUserOrders } from "../utils/handlers";
import { Order } from "../utils/types";

import useAuth from "../context/auth/AuthContext";
import ShowOrdersHistory from "../components/ShowOrdersHistory";

function OrdersHistory() {
  const { token } = useAuth();
  const [ordersList, setOrders] = useState<Order[] | []>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!token) return;

    getAllUserOrders({ token })
      .then((ordersList) => {
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
        <div className="w-full min-w-full p-4 rounded-md mt-4">
          <ShowOrdersHistory orders={ordersList} />
        </div>
      )}
    </div>
  );
}

export default OrdersHistory;
