import { useEffect, useState } from "react";
import useAuth from "../../context/auth/AuthContext";

import notionAvatar1 from "../../../public/notion-avatar-1.png";
import notionAvatar2 from "../../../public/notion-avatar-2.png";
import notionAvatar3 from "../../../public/notion-avatar-3.png";
import { TopCustomer } from "../../utils/types";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function TopRatedCustomers() {
  const [pending, setPending] = useState(false);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[] | []>([]);
  const randomInt = Math.floor(Math.random() * 3);
  const avatars = [notionAvatar1, notionAvatar2, notionAvatar3];
  const { token } = useAuth();

  useEffect(() => {
    async function getTopRatedCustomers() {
      try {
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/customers/top`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error("can't get top rated customer's list!!!");
        const data = await response.json();
        setTopCustomers(data);
        return data;
      } catch (err) {
        console.log(err);
      } finally {
        setPending(false);
      }
    }

    getTopRatedCustomers();
  }, [token]);
  return (
    <div>
      <h1>Top Spending Customers</h1>
      {pending ? (
        <div className="flex flex-col justify-start items-start w-full gap-1 mt-4">
          <TopCustomerSkeleton />
          <TopCustomerSkeleton />
          <TopCustomerSkeleton />
          <TopCustomerSkeleton />
          <TopCustomerSkeleton />
          <TopCustomerSkeleton />
        </div>
      ) : (
        <div className="flex flex-col justify-start items-start w-full gap-1 mt-4">
          {topCustomers.map((customer) => {
            return (
              <TopCustomerCard
                key={customer.userId}
                email={customer.email}
                profile={avatars[randomInt]}
                orderCount={customer.orderCount}
                totalSpent={customer.totalSpent}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopRatedCustomers;

function TopCustomerCard({
  email,
  totalSpent,
  orderCount,
  profile,
}: TopCustomer) {
  return (
    <div className="w-full flex items-center justify-center p-2 rounded-md border border-zinc-100 max-sm:flex-wrap max-md:flex-wrap">
      <div className="flex justify-start items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-300">
          <img
            loading="lazy"
            className={"w-full h-full object-cover"}
            src={profile}
            alt="notion avatar img for profile "
          />
        </div>
        <h1 className="text-sm text-zinc-400">{email}</h1>
      </div>

      <div className="ml-auto flex justify-center items-start gap-10">
        <div className="flex justify-start  items-center gap-2 w-[150px] text-sm text-zinc-500 max-sm:hidden max-md:hidden">
          <span>{orderCount}</span>
          <span>{orderCount <= 1 ? "order" : "orders"}</span>
        </div>
        <div>
          {totalSpent.toLocaleString()}{" "}
          <span className="text-sm text-zinc-700 font-light">EGP</span>
        </div>
      </div>
    </div>
  );
}
function TopCustomerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between p-2 rounded-md bg-zinc-50">
      <div className="flex justify-start items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden animate-pulse bg-zinc-200"></div>
        <div className=" rounded-xl w-[200px] h-5 animate-pulse bg-zinc-200"></div>
      </div>

      <div className="rounded-xl w-[60px] h-5 animate-pulse bg-zinc-200"></div>
    </div>
  );
}
