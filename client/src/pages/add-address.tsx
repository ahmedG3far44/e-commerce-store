/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import useAuth from "../context/auth/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function AddAddress() {
  const addressRef = useRef<any>(null);
  const { token } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handelAddNewAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!token) return;

      const newAddress = addressRef?.current.value;

      if (!newAddress) throw new Error("address field is required!!");

      setPending(true);
      const response = await fetch(`${BASE_URL}/user/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });

      if (!response.ok) {
        throw new Error("can't add new address!!");
      }

      const data = await response.json();
      toast.success("A new address was added!");
      navigate("/checkout");
      addressRef?.current.value.reset();
      return data;
    } catch (err: any) {
      setError(err?.message);
      toast.error(err?.message);
      return err;
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="w-full h-full flex flex-col gap-10 items-center justify-center">
      <h1 className="text-blue-500 font-bold text-2xl">Add New Address</h1>
      {error && (
        <div className="p-4 rounded-md border border-rose-500 text-rose-500 bg-rose-100 text-center">
          {error}
        </div>
      )}
      <form
        onSubmit={handelAddNewAddress}
        className="w-[400px] p-4 flex flex-col items-start justify-start gap-4 border border-gray-300 rounded-md"
      >
        <label htmlFor="address">Address</label>
        <textarea
          ref={addressRef}
          className="w-full rounded-md bg-zinc-200 border border-zinc-100 p-2 "
          placeholder="Enter your full  address"
          name="address"
          id="address"
        ></textarea>
        <input
          className="w-full disabled:cursor-not-allowed disabled:bg-gray-400 rounded-md p-2 text-white bg-blue-500 hover:bg-blue-700 duration-150 cursor-pointer border border-zinc-100 "
          type="submit"
          disabled={pending}
          value={pending ? "adding..." : "add address"}
        />
      </form>
    </div>
  );
}

export default AddAddress;
