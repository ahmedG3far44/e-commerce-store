/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useCart from "../context/cart/CartContext";
import useAuth from "../context/auth/AuthContext";
import ItemCart from "../components/ItemCart";
import TotalOrder from "../components/TotalOrder";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function CheckoutPage() {
  const { token } = useAuth();
  const { cartItems, totalAmount, getUserCart } = useCart();

  const [pending, setPending] = useState(false);
  const [addresses, setAddressesList] = useState<string[]>([]);
  // const addressRef = useRef(null);
  // const addressFormRef = useRef(null);

  const getAddressesList = async ({ token }: { token: string }) => {
    try {
      if (!token) return;

      setPending(true);
      const response = await fetch(`${BASE_URL}/user/address`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("connection error can't get a addresses!!");
      }

      const addressesList = await response.json();

      // console.log(addressesList);

      setAddressesList([...addressesList]);

      return addressesList;
    } catch (err: any) {
      return err.message;
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    getUserCart({ token });
    getAddressesList({ token });
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

      <div className="w-full flex items-start justify-between gap-4 relative">
        <div className="w-[80%] flex flex-col justify-start items-start gap-1">
          {cartItems.length > 0 ? (
            cartItems.map(
              ({ product, productId, quantity, updatedAt }: any) => {
                const { title, description, category, image, price, stock } =
                  product;
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
              }
            )
          ) : (
            <p className="text-sm text-zinc-500 mt-8">
              your cart is empty continue shopping and add new items!!
            </p>
          )}
        </div>
        {pending ? (
          <div>loading...</div>
        ) : (
          <div className="w-[20%]">
            <TotalOrder total={totalAmount.toFixed(2)} addresses={addresses} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;
