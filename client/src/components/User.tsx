import { useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { LuHistory } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";

import guestImg from "../../public/guestImg.jpg";
import useAuth from "../context/auth/AuthContext";


function User() {
  const { user, logOut } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const handelLogout = () => {
    logOut();
    navigate("/");
  };



  return (
    <div className="relative  ">
      <div
        onClick={() => setOpen(!isOpen)}
        role="button"
        className="w-fit p-2 rounded-md shadow-none hover:bg-zinc-50 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <h1>
            {user?.firstName} {user?.lastName}
          </h1>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={guestImg}
              alt="user profile picture"
            />
          </div>
          <span className={isOpen ? "" : "rotate-180"}>
            <MdKeyboardArrowUp size={20} />
          </span>
        </div>
      </div>
      {isOpen && (
        <ul className="absolute z-50 top-15 right-0 min-w-40 p-2 animate-fade flex flex-col justify-start items-start  rounded-md bg-zinc-100 border-zinc-400 shadow-md transition-all">
          {user?.isAdmin ? (
            <a
              className="p-2 rounded-md  cursor-pointer w-full hover:bg-zinc-200 duration-150"
              href="/dashboard/insights"
            >
              <li className="flex items-center gap-4">
                <RxDashboard size={20} />
                Dashboard
              </li>
            </a>
          ) : (
            <>
              <a
                className="p-2 rounded-md  cursor-pointer w-full hover:bg-zinc-200 duration-150 text-gray-600"
                href="/profile"
              >
                <li className="flex items-center gap-4">
                  <CgProfile size={20} />
                  Profile
                </li>
              </a>
              <a
                className="p-2 rounded-md  cursor-pointer w-full hover:bg-zinc-200 duration-150 text-gray-600"
                href="/orders-history"
              >
                <li className="flex items-center gap-4">
                  <LuHistory size={20} />
                  Order History
                </li>
              </a>
            </>
          )}
          <li className="p-2 text-sm text-gray-600 rounded-md  cursor-pointer w-full hover:bg-zinc-200 duration-150">
            {user?.email}
          </li>
          <li className="p-2 rounded-md cursor-pointer w-full duration-150">
            <button
              className="px-4 py-2 w-full bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-800 duration-150"
              onClick={handelLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default User;
