/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";
import { createOrder } from "../utils/handlers";
import toast from "react-hot-toast";

interface TotalOrderProps {
  total: string;
  addresses: string[];
}

function TotalOrder({ total, addresses }: TotalOrderProps) {
  const navigate = useNavigate();
  const addressRef = useRef<any>(null);
  const { token } = useAuth();
  const handelCheckout = async () => {
    try {
      const address = addressRef?.current?.value;
      if (!token) {
        throw new Error("address is required please fill it correct!!");
      }

      if (!address) throw new Error("address not added!!");
      const result = await createOrder({ token, address });
      console.log(result);
      toast.success("Congrats order was created successfully!! ");
      navigate("/success");
      return;
    } catch (err: any) {
      toast.error(err?.message);
      return;
    }
  };
  return (
    <div className="w-full sticky top-0 right-0 flex flex-col justify-between items-center gap-8 p-4 bg-gray-100 border border-gray-100 rounded-md">
      <select
        className="p-2 w-full bg-zinc-100 rounded-md border border-zinc-300"
        ref={addressRef}
        name="address"
        id="address"
      >
        {addresses.length > 0 ? (
          addresses.map((address, index) => {
            return (
              <option key={index} value={address}>
                {address}
              </option>
            );
          })
        ) : (
          <option
            className="flex items-center gap-2"
            onClick={() => navigate("/add-address")}
          >
            add address
          </option>
        )}
      </select>
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <input
          placeholder="Discount Coupon"
          type="text"
          name="discount"
          className="w-full p-2 border rounded-md  bg-zinc-200 border-zinc-200"
        />{" "}
        <button className="w-full p-2 rounded-md bg-blue-500 cursor-pointer duration-150 text-white hover:bg-blue-700">
          Apply
        </button>
      </div>
      <div className="w-full flex flex-col justify-start items-start gap-1 font-bold">
        <div className="w-full  flex items-center justify-between  ">
          <span>Tax:</span>
          <span className="text-gray-600">14%</span>
        </div>
        <div className="w-full flex items-center justify-between  ">
          <span>Discount:</span>
          <span className="text-red-500">-20.77 EGP</span>
        </div>
        <div className="w-full flex items-center justify-between  ">
          <span>Total:</span>
          <span className="text-blue-500">{total}EGP</span>
        </div>
      </div>

      {addresses.length !== 0 && (
        <div className="w-full">
          <button
            className="p-2 rounded-md w-full bg-blue-500 cursor-pointer text-white hover:bg-blue-700 duration-150"
            onClick={handelCheckout}
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
}

export default TotalOrder;
