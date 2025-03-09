/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import useCart from "../context/cart/CartContext";
import useAuth from "../context/auth/AuthContext";
import ItemCart from "../components/ItemCart";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../utils/handlers";
import toast from "react-hot-toast";
import ChooseAddresses from "../components/ChooseAddresses";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function CheckoutPage() {
  const { user, token } = useAuth();
  const { cartItems, totalAmount, getUserCart } = useCart();
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState<string[] | undefined>(
    user?.addresses
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const addressRef = useRef(null);
  const addressFormRef = useRef(null);

  const handelAddNewAddress = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (!token) return;

      setPending(true);
      const response = await fetch(`${BASE_URL}/user/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: addressRef?.current?.value,
        }),
      });

      if (!response.ok) {
        throw new Error("connection error can't add a new address!!");
      }

      const user = await response.json();
      toast.success("A new Address was added success!!");

      addressFormRef?.current?.reset();
      return user;
    } catch (err: any) {
      return err.message;
    } finally {
      setPending(false);
    }
  };
  const handelCheckout = async () => {
    try {
      if (!token) {
        throw new Error("address is required please fill it correct!!");
      }
      if (!userAddress) {
        const address: any | string = addressRef?.current?.value;
        if (!address) {
          throw new Error("input address is required!!");
        }
        const result = await createOrder({ token, address });
        console.log(result);
        toast.success("Congrats order was created successfully!! ");
        navigate("/success");
        return;
      } else {
        const result = await createOrder({ token, address: userAddress });
        console.log(result);
        toast.success("Congrats order was created successfully!! ");
        navigate("/success");
        return;
      }
    } catch (err: any) {
      setError(err?.message);
      toast.error(err?.message);
      return;
    }
  };

  useEffect(() => {
    if (!token) return;
    getUserCart({ token });
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-start items-center gap-4 p-4">
      <div className="p-4 rounded-md bg-zinc-100 flex justify-between text-2xl font-bold items-center w-full">
        <h1 className="text-blue-500">All Cart Items</h1>
        <h1 className="text-2xl font-bold">
          Total:{" "}
          <span className="text-blue-500">{totalAmount.toFixed(2)} EGP</span>
        </h1>
      </div>
      {user?.addresses?.length === 0 ? (
        <form
          ref={addressFormRef}
          onSubmit={handelAddNewAddress}
          className="w-1/2 p-4 border border-gray-200 rounded-md flex items-center gap-4"
        >
          <input
            ref={addressRef}
            type="text"
            name="address"
            id="address"
            placeholder="enter your address"
            className={`w-full p-2 rounded-md border  ${
              error
                ? "bg-red-100 border-red-500"
                : "bg-zinc-100 border-zinc-300 "
            }`}
          />
          <input
            className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 duration-150 cursor-pointer "
            type="submit"
            disabled={pending}
            value={pending ? "adding..." : "add address"}
          />
        </form>
      ) : (
        <ChooseAddresses
          userAddress={userAddress || []}
          setUserAddress={setUserAddress}
        />
      )}
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {cartItems.length > 0 ? (
        cartItems.map(({ product, productId, quantity, updatedAt }) => {
          const { title, description, category, image, price, stock } = product;
          return (
            <ItemCart
              key={productId}
              productId={productId}
              title={title}
              category={category}
              stock={stock}
              description={description || ""}
              image={image || ""}
              price={price}
              quantity={quantity}
              updatedAt={updatedAt}
              checkoutState={false}
            />
          );
        })
      ) : (
        <p className="text-sm text-zinc-500 mt-8">
          your cart is empty continue shopping and add new items!!
        </p>
      )}
      {cartItems.length > 0 && (
        <div className="p-4 rounded-md bg-zinc-100 flex justify-between items-center w-full">
          <div>
            <h1 className="text-2xl font-bold">
              Total:{" "}
              <span className="text-blue-500">
                {totalAmount.toFixed(2)} EGP
              </span>
            </h1>
          </div>
          <div>
            <button
              className="w-[150px] px-4 py-2 rounded-md cursor-pointer  border bg-blue-500 text-white hover:bg-blue-800 duration-150"
              onClick={handelCheckout}
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
