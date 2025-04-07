import { useEffect, useState } from "react";
import useAuth from "../../context/auth/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function StatusOrders() {
  const [pending, setPending] = useState(false);
  const [statusOrders, setOrderStatus] = useState({
    pending: 0,
    shipped: 0,
    delivered: 0,
    totalOrders: 0,
  });
  const { token } = useAuth();
  useEffect(() => {
    if (!token) return;
    async function getStatusOrders() {
      try {
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/orders-insights`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("can't get admin orders insights");

        const data = await response.json();
        setOrderStatus({ ...data });
        return;
      } catch (error) {
        console.error(error);
      } finally {
        setPending(false);
      }
    }
    getStatusOrders();
  }, [token]);
  if (pending) return <div>loading....</div>;
  return <div className="w-full flex items-center justify-start gap-8 bg-white rounded-md p-4">
    <div className="flex flex-col items-start justify-center gap-4 p-4 border border-zinc-100 rounded-md font-bold text-2xl shadow-md"><span>icon</span>{statusOrders.totalOrders}</div>
    <div className="flex flex-col items-start justify-center gap-4 p-4 border border-zinc-100 rounded-md font-bold text-2xl shadow-md"><span>icon</span>{statusOrders.pending}</div>
    <div className="flex flex-col items-start justify-center gap-4 p-4 border border-zinc-100 rounded-md font-bold text-2xl shadow-md"><span>icon</span>{statusOrders.shipped}</div>
    <div className="flex flex-col items-start justify-center gap-4 p-4 border border-zinc-100 rounded-md font-bold text-2xl shadow-md"><span>icon</span>{statusOrders.delivered}</div>
  </div>;
}

export default StatusOrders;
