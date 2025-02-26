import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex justify-start items-start ">
      <aside className="min-h-screen w-[20%] bg-gray-300 p-4 flex flex-col justify-between items-start ">
        <ul className="w-full flex justify-between flex-col items-start gap-4">
          <li className="hover:bg-gray-400 w-full p-4 rounded-md">
            <a href="/">Home</a>
          </li>
          <li className="hover:bg-gray-400 w-full p-4 rounded-md">
            <a href="/dashboard/products">Products</a>
          </li>
          <li className="hover:bg-gray-400 w-full p-4 rounded-md">
            <a href="/dashboard/orders">Orders</a>
          </li>
          <li className="hover:bg-gray-400 w-full p-4 rounded-md">
            <a href="/dashboard/users">Users</a>
          </li>
        </ul>
        <button className="hover:bg-gray-400 w-full p-4 rounded-md">
          Logout
        </button>
      </aside>
      <main className="w-full min-h-screen   p-4">
        <h1>Dashboard Admin</h1>
        {<Outlet />}
      </main>
    </div>
  );
}

export default Dashboard;
