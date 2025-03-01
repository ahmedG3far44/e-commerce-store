import { useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import OrderItems from "./OrderItems";
import { OrderHistoryProps } from "../utils/types";

import { LiaShippingFastSolid } from "react-icons/lia";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";

function ShowOrdersHistory({
  totalAmount,
  address,
  items,
  status,
}: OrderHistoryProps) {
  const [isOpen, setOpen] = useState(false);
  // const [status] = useState("COMPLETED");

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
          <h1>Ship Address: {address}</h1>
        </div>

        <div className="ml-auto self-end mr-10">
          <span
            className={` font-semibold 
            ${status.toString() === "PENDING" && "text-gray-500"}
            ${status.toString() === "SHIPPED" && "text-orange-600"}
            ${status.toString() === "COMPLETED" && "text-green-500"}
            
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
            {status.toString() === "COMPLETED" && (
              <span className="flex justify-center items-center gap-2">
                {status} <IoMdDoneAll size={16} />{" "}
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
          <div>
            <OrderItems items={items} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowOrdersHistory;
