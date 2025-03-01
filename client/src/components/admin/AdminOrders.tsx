/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

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
      <div>{JSON.stringify(pendingOrders)}</div>
    </div>
  );
}

export default AdminOrders;
