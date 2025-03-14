/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import OrderItems from "./OrderItems";
import { OrderHistoryProps } from "../utils/types";

import { LiaShippingFastSolid } from "react-icons/lia";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import useAuth from "../context/auth/AuthContext";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function ShowOrdersHistory({
  id,
  totalAmount,
  address,
  items,
  status,
  orderDate,
}: OrderHistoryProps) {
  const [isOpen, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  // const [status] = useState("COMPLETED");

  const date = new Date(orderDate);
  const orderDates = date.toString().split("T")[0];
  // const orderTime = date.toString().split("T")[1];

  const handelUpdateOrderStatusToDelivered = async () => {
    try {
      if (!token || !user?.isAdmin)
        throw new Error("Unauthorized user your not able to do this action!!");

      setLoading(true);
      const response = await fetch(`${BASE_URL}/admin/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: id,
          status: "DELIVERED",
        }),
      });
      if (!response.ok) {
        throw new Error("can't update order status, please try again");
      }
      const data = await response.json();
      if (!data) throw new Error("can't get response data!!");
      toast.success("order status updated to DELIVERED success!!");
      return;
    } catch (err: any) {
      console.log(err?.message);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };
  const handelUpdateOrderStatusToShipped = async () => {
    try {
      if (!token || !user?.isAdmin)
        throw new Error("Unauthorized user your not able to do this action!!");

      setPending(true);
      const response = await fetch(`${BASE_URL}/admin/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: id,
          status: "SHIPPED",
        }),
      });
      if (!response.ok) {
        throw new Error("can't update order status, please try again");
      }
      const data = await response.json();
      if (!data) throw new Error("can't get response data!!");
      toast.success("order status updated to SHIPPED success!!");
      return;
    } catch (err: any) {
      console.log(err?.message);
      toast.error(err?.message);
      return;
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="w-full">
      <div
        className={
          "hover:bg-zinc-200 bg-zinc-100 cursor-pointer rounded-md p-2 w-full flex justify-between items-center"
        }
        role="button"
        onClick={() => setOpen(!isOpen)}
      >
        <div>
          <h1>
            <span className="font-bold mr-4">Customer Address:</span>{" "}
            <span className="text-sm">{address}</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 ml-6 text-sm text-zinc-600">
          <span className=" font-semibold">Order Date:</span>
          <span>{orderDates}</span>
        </div>

        <div className="ml-auto self-end mr-10">
          <span
            className={` font-semibold 
            ${status.toString() === "PENDING" && "text-gray-500"}
            ${status.toString() === "SHIPPED" && "text-orange-600"}
            ${status.toString() === "DELIVERED" && "text-green-500"}
            
            `}
          >
            {status.toString() === "PENDING" && (
              <span className="flex justify-center items-center gap-2">
                {status} <MdOutlineWatchLater size={16} />{" "}
              </span>
            )}
            {status.toString() === "SHIPPED" && (
              <span className="flex justify-center items-center gap-2">
                {status} <LiaShippingFastSolid size={16} />{" "}
              </span>
            )}
            {status.toString() === "DELIVERED" && (
              <span className="flex justify-center items-center gap-2">
                COMPLETED <IoMdDoneAll size={16} />{" "}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            Total Price:{" "}
            <span className="text-blue-500 text-xl font-semibold">
              {totalAmount.toFixed(2)}{" "}
              <span className="text-[10px] text-zinc-500">EGP</span>
            </span>
          </span>
          <span className={isOpen ? " " : "rotate-180"}>
            <MdKeyboardArrowUp size={18} />
          </span>
        </div>
      </div>
      <div className="p-2">
        {isOpen && (
          <>
            <div>
              <OrderItems items={items} />
            </div>
            {user?.isAdmin && status.toString() !== "DELIVERED" && (
              <div className="ml-8 pl-4 mt-4 flex items-center gap-4 p-2">
                {status.toString() !== "SHIPPED" && (
                  <button
                    onClick={handelUpdateOrderStatusToShipped}
                    disabled={pending}
                    className="px-4 py-2 rounded-md text-white bg-orange-500 cursor-pointer hover:bg-orange-800 duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {pending ? "updating..." : "SHIPPED"}
                  </button>
                )}
                {status.toString() !== "DELIVERED" && (
                  <button
                    onClick={handelUpdateOrderStatusToDelivered}
                    disabled={loading}
                    className=" px-4 py-2 rounded-md text-white bg-green-500 cursor-pointer hover:bg-green-800 duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {loading ? "updating..." : "DELIVERED"}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ShowOrdersHistory;
