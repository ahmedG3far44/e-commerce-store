/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import UsersList from "../UsersList";
const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function AdminUsers() {
  const [users, setUsersList] = useState<any[]>([]);
  useEffect(() => {
    async function getAllUsersInfo() {
      try {
        const response = await fetch(`${BASE_URL}/admin/users`);
        if (!response.ok) {
          throw new Error("connection error can't get users list!!");
        }
        const users = await response.json();
        return users;
      } catch (err: any) {
        console.log(err?.message);
        alert(err?.message);
      }
    }
    getAllUsersInfo().then((users) => setUsersList([...users]));
  }, []);
  return (
    <div>
      <h1>Pending Orders</h1>
      <div className="mt-10 flex flex-col justify-start items-start gap-2 w-full">
        {users.map((user) => {
          return (
            <UsersList
              id={user._id}
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email}
              isAdmin={user.isAdmin}
              joinUs={user.createdAt}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AdminUsers;
