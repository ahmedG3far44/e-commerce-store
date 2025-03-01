/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function AdminUsers() {
  const [users, setUsersList] = useState<any[]>([]);
  useEffect(() => {
    async function getAllUsersInfo() {
      try {
        const response = await fetch(`${BASE_URL}/admin/users`);
        if(!response.ok){
            throw new Error("connection error can't get users list!!")
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
      <div>{JSON.stringify(users)}</div>
    </div>
  );
}

export default AdminUsers;
