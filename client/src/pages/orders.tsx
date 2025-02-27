import { useEffect, useState } from "react";
import { getAllUserOrders } from "../utils/handlers";
import useAuth from "../context/auth/AuthContext";
import { OrderList } from "../utils/types";


function OrdersHistory() {
  const { token } = useAuth();
  const [ordersList, setOrders] = useState<OrderList[] | []>([]);
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
    <div>
      <h1>get user order history</h1>
      {error && (
        <p className="p-2 rounded-md border bg-rose-100 border-rose-600 text-rose-500">
          {error}
        </p>
      )}
      <div>
        {ordersList.map((order) => {
          return (
            <div key={order?._id}>
              to <span>{order?.address}</span>
              <span>{order?.totalOrderPrice}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersHistory;
