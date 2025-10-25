import { ReactNode, useState, useMemo } from "react";
import { Customer, Order, ProductInITemsList } from "../utils/types";

import { handlePrice } from "../utils/handlers";
import { MdKeyboardArrowUp } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

import useAuth from "../context/auth/AuthContext";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function Status({
  statusText,
  className,
  children,
}: {
  statusText: string;
  className?: string;
  children: ReactNode;
}) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
        statusText
      )} ${className}`}
    >
      {children}
    </span>
  );
}

function OrderCustomerInfo({
  customer,
  className,
}: {
  customer: Customer;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-md ${className}`}>
      <h3 className="font-bold mb-2">Customer Information</h3>
      <div className="space-y-1 text-sm">
        <p>
          <span className="font-semibold">Name:</span> {customer.name}
        </p>
        {customer.email && (
          <p>
            <span className="font-semibold">Email:</span> {customer.email}
          </p>
        )}
        <p>
          <span className="font-semibold">Address:</span> {customer.address}
        </p>
        {customer?.phone ? (
          <p>
            <span className="font-semibold">Phone:</span> {customer.phone}
          </p>
        ) : (
          <p>
            <span className="font-semibold">Phone:</span> +201505508939
          </p>
        )}
      </div>
    </div>
  );
}

function OrderTracker({
  orderStatus,
  className,
}: {
  orderStatus: string;
  className?: string;
}) {
  const statuses = ["PENDING", "SHIPPED", "DELIVERED"];
  const currentStatusIndex = statuses.indexOf(orderStatus.toUpperCase());

  return (
    <div className={`bg-white border border-zinc-200 rounded-md ${className}`}>
      <h3 className="font-bold mb-3">Order Progress</h3>
      <div className="flex items-center space-x-4">
        {statuses.map((status, index) => (
          <div key={status} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                index <= currentStatusIndex
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                index <= currentStatusIndex ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {status}
            </span>
            {index < statuses.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-2 ${
                  index < currentStatusIndex ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Items({
  itemsList,
  className,
}: {
  itemsList: ProductInITemsList[];
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {itemsList.map((item, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-2 border border-zinc-200 rounded-md"
        >
          <img
            src={item.productImages}
            alt={item.productTitle}
            className="w-12 h-12 object-contain p-1 rounded-md border border-zinc-300"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{item.productTitle}</h4>
            <p className="w-3/5 overflow-x-hidden  text-xs  text-gray-600">
              {item.productDescription}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold">{handlePrice(item.productPrice)}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderItem({
  order,
  onStatusUpdate,
}: {
  order: Order;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}) {
  const [isOpen, setOpen] = useState(false);
  const [shippPending, setShippPending] = useState(false);
  const [cancelPending, setCancelPending] = useState(false);
  const [completePending, setCompletePending] = useState(false);

  const { user, token } = useAuth();

  const date = new Date(order.createdAt);

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
          orderId: order._id,
          status: "DELIVERED",
        }),
      });
      if (!response.ok) {
        throw new Error("can't update order status, please try again");
      }
      const data = await response.json();
      if (!data) throw new Error("can't get response data!!");

      if (onStatusUpdate) {
        onStatusUpdate(order._id, "DELIVERED");
      }

      toast.success("order status updated to DELIVERED success!!");
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
          orderId: order._id,
          status: "SHIPPED",
        }),
      });
      if (!response.ok) {
        throw new Error("can't update order status, please try again");
      }
      const data = await response.json();
      if (!data) throw new Error("can't get response data!!");

      if (onStatusUpdate) {
        onStatusUpdate(order._id, "SHIPPED");
      }

      toast.success("order status updated to SHIPPED success!!");
    } catch (err: any) {
      console.log(err?.message);
      toast.error(err?.message);
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
          orderId: order._id,
          status: "CANCELED",
        }),
      });
      if (!response.ok) {
        throw new Error("can't update order status, please try again");
      }
      const data = await response.json();
      if (!data) throw new Error("can't get response data!!");

      if (onStatusUpdate) {
        onStatusUpdate(order._id, "CANCELED");
      }

      toast.success("The order is cancled!!");
    } catch (err: any) {
      toast.error(err?.message);
    } finally {
      setCancelPending(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-start items-start gap-4">
      <div
        role="button"
        className="w-full flex justify-around items-center p-2 border-zinc-200 border-t border-b cursor-pointer hover:shadow-md transition-all max-sm:flex-col max-md:flex-col max-sm:justify-start max-md:justify-start max-sm:items-start max-md:items-start"
        onClick={() => setOpen(!isOpen)}
      >
        <span className="text-sm underline text-blue-500 font-semibold">
          #-{order._id}
        </span>

        <div className="w-full flex items-center justify-center gap-2 mx-4">
          <span className="w-full text-sm text-nowrap text-zinc-600 font-semibold">
            {date.toLocaleDateString()} | {date.toLocaleTimeString()}
          </span>
        </div>
        <div className="w-full flex items-center justify-center gap-2">
          <Status statusText={order.status.toString()} className="text-sm">
            {order.status}
          </Status>
        </div>
        <div className="w-full flex items-center justify-center gap-2">
          <span className="text-zinc-800 font-black text-xl">
            {handlePrice(order.totalOrderPrice)}
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
        <div className="bg-zinc-200 p-4 w-full border border-zinc-300 rounded-2xl">
          {order.customer && (
            <OrderCustomerInfo className="p-2" customer={order.customer} />
          )}
          <OrderTracker className="p-2" orderStatus={order.status.toString()} />
          <div className="w-full animate-fill p-2 bg-white border border-zinc-200 rounded-md">
            <h1 className="my-2 font-bold">All Items</h1>
            <Items
              itemsList={order.orderItems.map((item) => ({
                ...item,
                productImages: item.productImages || "",
              }))}
            />
          </div>
          {user?.isAdmin &&
            (order.status.toString() === "PENDING" ||
              order.status.toString() === "SHIPPED") && (
              <div className="flex items-center gap-2 my-2">
                <button
                  className="duration-150 px-4 py-1 rounded-md bg-green-500 hover:bg-green-700 text-white cursor-pointer disabled:bg-zinc-600 disabled:cursor-not-allowed"
                  disabled={
                    order.status.toString() !== "SHIPPED" || completePending
                  }
                  onClick={handelUpdateOrderStatusToDelivered}
                >
                  {completePending ? (
                    <span className="border border-b-transparent w-4 h-4 rounded-full border-zinc-500 animate-spin"></span>
                  ) : (
                    "Completed"
                  )}
                </button>
                <button
                  className="duration-150 px-4 py-1 rounded-md bg-purple-500 hover:bg-purple-700 text-white cursor-pointer disabled:bg-zinc-600 disabled:cursor-not-allowed"
                  disabled={
                    order.status.toString() !== "PENDING" || shippPending
                  }
                  onClick={handelUpdateOrderStatusToShipped}
                >
                  {shippPending ? (
                    <span className="border border-b-transparent w-4 h-4 rounded-full border-zinc-500 animate-spin"></span>
                  ) : (
                    "Shipped"
                  )}
                </button>
                <button
                  className="duration-150 px-4 py-1 rounded-md bg-red-500 hover:bg-red-700 text-white cursor-pointer disabled:bg-red-600 disabled:cursor-not-allowed"
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

function ShowOrdersHistory({
  orders,
  onStatusUpdate,
}: {
  orders: Order[];
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase().trim();
    return orders.filter((order) => {
      const matchesId = order._id.toLowerCase().includes(term);
      const matchesName = order.customer?.name?.toLowerCase().includes(term);
      const matchesEmail = order.customer?.email?.toLowerCase().includes(term);
      return matchesId || matchesName || matchesEmail;
    });
  }, [orders, searchTerm]);

  return (
    <div className="w-full">
      <div className="mb-6 relative">
        <div className="relative">
          <IoSearchOutline
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-zinc-600">
            Found {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
      {filteredOrders.length > 0 ? (
        <div className="w-full flex flex-col-reverse justify-start items-start gap-4">
          {filteredOrders.map((order) => (
            <OrderItem
              key={order._id}
              order={order}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center p-12 bg-zinc-50 border border-zinc-200 rounded-lg">
          <p className="text-lg text-gray-500 font-semibold">
            {searchTerm
              ? "No orders found matching your search"
              : "No orders available"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ShowOrdersHistory;
