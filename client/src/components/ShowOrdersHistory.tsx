/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from "react";
// import OrderItems from "./OrderItems";
import { Customer, Order, ProductInITemsList } from "../utils/types";

import { LiaShippingFastSolid } from "react-icons/lia";
import { MdOutlineWatchLater, MdKeyboardArrowUp } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";

import useAuth from "../context/auth/AuthContext";
import toast from "react-hot-toast";
import { LuX } from "react-icons/lu";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function ShowOrdersHistory({
  _id,
  totalOrderPrice,
  orderItems,
  status,
  createdAt,
  customer,
}: Order) {
  const [isOpen, setOpen] = useState(false);
  const [shippPending, setShippPending] = useState(false);
  const [cancelPending, setCancelPending] = useState(false);
  const [completePending, setCompletePending] = useState(false);

  const { user, token } = useAuth();
  // const [status] = useState("COMPLETED");

  const date = new Date(createdAt);
  // const orderTime = date.toString().split("T")[1];

  const handelUpdateOrderStatusToDelivered = async () => {
    try {
      if (!token || !user?.isAdmin)
        throw new Error("Unauthorized user your not able to do this action!!");

      setCompletePending(true);
      const response = await fetch(`${BASE_URL}/admin/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: _id,
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
      setCompletePending(false);
    }
  };
  const handelUpdateOrderStatusToShipped = async () => {
    try {
      if (!token || !user?.isAdmin)
        throw new Error("Unauthorized user your not able to do this action!!");

      setShippPending(true);
      const response = await fetch(`${BASE_URL}/admin/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: _id,
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
      setShippPending(false);
    }
  };
  const handelUpdateOrderStatusToCanceled = async () => {
    try {
      if (!token || !user?.isAdmin)
        throw new Error("Unauthorized user your not able to do this action!!");

      setCancelPending(true);
      const response = await fetch(`${BASE_URL}/admin/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: _id,
          status: "CANCELED",
        }),
      });
      if (!response.ok) {
        throw new Error("can't update order status, please try again");
      }
      const data = await response.json();
      if (!data) throw new Error("can't get response data!!");
      toast.success("The order is cancled!!");
      return;
    } catch (err: any) {
      toast.error(err?.message);
      return;
    } finally {
      setCancelPending(false);
    }
  };
  return (
    <div className="w-full flex flex-col justify-start items-start  gap-4">
      <div
        role={"button"}
        className="w-full flex justify-between items-center p-2  border-zinc-200 border-t border-b  cursor-pointer hover:shadow-md transition-all  max-sm:flex-col max-md:flex-col max-sm:justify-start max-md:justify-start  max-sm:items-start max-md:items-start"
        onClick={() => setOpen(!isOpen)}
      >
        <div className="w-full flex items-center justify-center gap-2">
          <span>Reference:</span>
          <span className="text-sm underline text-blue-500 font-semibold">
            #{_id}
          </span>
        </div>
        <div className="w-full flex items-center justify-center gap-2 mx-4">
          <span className="w-full  text-sm text-nowrap text-zinc-600 font-semibold">
            {date.toLocaleDateString()} | {date.toLocaleTimeString()}
          </span>
        </div>
        <div className="w-full flex items-center justify-center gap-2">
          <Status statusText={status.toString()} className="text-sm">
            {status}
          </Status>
        </div>
        <div className="w-full flex items-center justify-center gap-2">
          <span>Total:</span>
          <span className="text-zinc-800 font-black text-xl">
            {totalOrderPrice.toFixed(2).toLocaleString()}{" "}
            <span className="text-sm text-zinc-800">EGP</span>
          </span>
        </div>

        <div
          className={`duration-150 transition-transform ${
            isOpen ? "-rotate-x-180" : "rotate-0"
          }`}
        >
          <span>
            <MdKeyboardArrowUp size={20} />
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="bg-zinc-200 p-4 w-full border border-zinc-300 rounded-2xl ">
          {customer && (
            <OrderCustomerInfo className="p-2" customer={customer} />
          )}
          <OrderTracker className="p-2" orderStatus={status.toString()} />
          <div className="w-full animate-fill p-2 bg-white border border-zinc-200 rounded-md">
            <h1 className="my-2 font-bold">All Items</h1>
            <Items
              itemsList={orderItems.map((item) => ({
                ...item,
                productImages: item.productImages || "",
              }))}
            />
          </div>
          {user?.isAdmin &&
            (status.toString() === "PENDING" ||
              status.toString() === "SHIPPED") && (
              <div className="flex items-center gap-2 my-2">
                <button
                  className={` duration-150 px-4 py-1 rounded-md bg-green-500 hover:bg-green-700 text-white cursor-pointer disabled:bg-zinc-600 disabled:cursor-not-allowed`}
                  disabled={status.toString() !== "SHIPPED" || completePending}
                  onClick={handelUpdateOrderStatusToDelivered}
                >
                  {completePending ? (
                    <span className="border border-b-transparent w-4 h-4 rounded-full border-zinc-500 animate-spin"></span>
                  ) : (
                    "Completed"
                  )}
                </button>
                <button
                  className={` duration-150 px-4 py-1 rounded-md bg-purple-500 hover:bg-purple-700 text-white cursor-pointer  disabled:bg-zinc-600 disabled:cursor-not-allowed`}
                  disabled={status.toString() !== "PENDING" || shippPending}
                  onClick={handelUpdateOrderStatusToShipped}
                >
                  {shippPending ? (
                    <span className="border border-b-transparent w-4 h-4 rounded-full border-zinc-500 animate-spin"></span>
                  ) : (
                    "Shipped"
                  )}
                </button>
                <button
                  className={` duration-150 px-4 py-1 rounded-md bg-red-500 hover:bg-red-700 text-white cursor-pointer disabled:bg-red-600 disabled:cursor-not-allowed`}
                  disabled={cancelPending}
                  onClick={handelUpdateOrderStatusToCanceled}
                >
                  {cancelPending ? (
                    <span className="border border-b-transparent w-4 h-4 rounded-full border-zinc-500 animate-spin"></span>
                  ) : (
                    "Cancel"
                  )}
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

function Items({ itemsList }: { itemsList: ProductInITemsList[] }) {
  return (
    <>
      {itemsList.map((item) => {
        return (
          <div
            key={item._id}
            className="w-full flex justify-between items-center p-2 border border-zinc-200 cursor-pointer hover:shadow-md transition-all "
          >
            <div className="flex justify-start items-center gap-2">
              <img
                width={50}
                height={50}
                src={item?.productImages || ""}
                alt={item?.productTitle}
                className="object-cover rounded-md"
              />
              <h1 className="text-sm font-semibold text-zinc-700">
                {item.productTitle}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-zinc-700">
                {item.quantity <= 1
                  ? `${item.quantity} item`
                  : `${item.quantity} items`}
              </div>
              <div className=" font-semibold">
                {(item.quantity * item.productPrice).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function Status({
  children,
  className,
  statusText,
}: {
  children: ReactNode;
  statusText: string;
  className: string;
}) {
  return (
    <span
      className={`${className} px-4 py-1 rounded-2xl border flex items-center gap-2 ${
        statusText === "PENDING"
          ? "bg-zinc-50 border-zinc-500 text-zinc-500 "
          : statusText === "SHIPPED"
          ? "bg-purple-50 border-purple-500 text-purple-500 "
          : statusText === "DELIVERED"
          ? "bg-green-50 border-green-500  text-green-500 "
          : statusText === "CANCELED"
          ? "bg-red-50 border-red-500 text-red-500 "
          : ""
      }`}
    >
      <span>
        {statusText === "PENDING" ? (
          <MdOutlineWatchLater size={20} />
        ) : statusText === "SHIPPED" ? (
          <LiaShippingFastSolid size={20} />
        ) : statusText === "DELIVERED" ? (
          <IoMdDoneAll size={20} />
        ) : statusText === "CANCELED" ? (
          <LuX size={20} />
        ) : null}
      </span>
      {children}
    </span>
  );
}

export function OrderCustomerInfo({
  customer,
  className,
}: {
  customer?: Customer;
  className?: string;
}) {
  return (
    <div
      className={`${className} bg-white border border-zinc-200 w-full rounded-md my-4`}
    >
      <h1 className="text-xl font-bold my-2">Customer Info:</h1>
      <h1 className="text-lg font-semibold pl-2">{customer?.name}</h1>
      <div className="p-2 text-sm text-zinc-600">
        <p>{customer?.email}</p>
        {customer?.phone && <h1>phone:{customer?.phone} </h1>}
        <h1>Address: {customer?.address}</h1>
        <h1>Payment: Cash on Delivery</h1>
        <h1>Postal Code: 21519</h1>
      </div>
    </div>
  );
}
export function OrderTracker({
  className,
  orderStatus,
}: {
  className?: string;
  orderStatus: string;
}) {
  return (
    <>
      {orderStatus.toString() === "CANCELED" ? (
        <div className="p-2 border rounded-md text-red-500 bg-red-100 border-red-500 my-4">
          This order it's been cancled
        </div>
      ) : (
        <>
          <div
            className={`${className} p-4  w-full flex flex-col justify-start items-start gap-2 bg-white border border-zinc-200  rounded-md my-4`}
          >
            <div className="w-full h-2 bg-gray-200 rounded-2xl">
              <span
                className={`flex h-full rounded-2xl 
            ${
              orderStatus === "PENDING"
                ? "w-[10%] bg-zinc-600"
                : orderStatus === "SHIPPED"
                ? "w-[50%] bg-purple-500"
                : orderStatus === "DELIVERED"
                ? "w-full bg-green-300"
                : ""
            }
          `}
              ></span>
            </div>
            {/* <div className="text-zinc-600 font-semibold">
        {orderStatus === "CANCELED" && "text-purple-500"}
      </div> */}
            <div className="w-full flex justify-between items-center">
              <span
                className={`${orderStatus === "PENDING" && "text-zinc-500"}`}
              >
                Pending
              </span>
              <span
                className={`${orderStatus === "SHIPPED" && "text-purple-500"}`}
              >
                Shipped
              </span>
              <span
                className={`${orderStatus === "DELIVERED" && "text-green-500"}`}
              >
                Completed
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ShowOrdersHistory;
