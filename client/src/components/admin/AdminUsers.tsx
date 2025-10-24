import { useEffect, useState, useMemo } from "react";
import {
  FaSearch,
  FaUserShield,
  FaUser,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaFilter,
  FaUsers,
} from "react-icons/fa";
import useAuth from "../../context/auth/AuthContext";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isBlocked?: boolean;
  createdAt: string;
}

function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "admin" | "user" | "blocked"
  >("all");

  useEffect(() => {
    getAllUsersInfo();
  }, [token]);

  async function getAllUsersInfo() {
    try {
      if (!token) return;
      setLoading(true);
      const response = await fetch(`${BASE_URL}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Connection error: can't get users list!");
      }
      const usersData = await response.json();
      setUsersList(usersData);
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsersList(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message || "Failed to delete user");
    }
  };

  const handleBlockUser = async (
    userId: string,
    currentBlockStatus: "active" | "blocked"
  ) => {
    const action = currentBlockStatus ? "active" : "block";

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStatus: "blocked" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      setUsersList(
        users.map((user) =>
          user._id === userId
            ? { ...user, isBlocked: !currentBlockStatus }
            : user
        )
      );
      toast.success(`User ${action}ed successfully`);
    } catch (err: any) {
      console.error(err?.message);
      toast.error(err?.message || `Failed to ${action} user`);
    }
  };

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesFilter =
        filterType === "all" ||
        (filterType === "admin" && user.isAdmin) ||
        (filterType === "user" && !user.isAdmin) ||
        (filterType === "blocked" && user.isBlocked);

      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, filterType]);

  return (
    <div className="w-full min-h-screen py-8 px-4">
      <div className="max-w-7xl h-screen mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 text-sm">
                Manage and monitor all platform users
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 items-center">
              <FaFilter className="text-gray-400" />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("admin")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === "admin"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Admins
                </button>
                <button
                  onClick={() => setFilterType("user")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === "user"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setFilterType("blocked")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === "blocked"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Blocked
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredUsers.length}</span> of{" "}
            <span className="font-semibold">{users.length}</span> users
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg
                  className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <FaUser className="mx-auto text-gray-300 text-5xl mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No users found
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onDelete={handleDeleteUser}
                      onBlock={() => handleBlockUser(user._id, "blocked")}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface UserRowProps {
  user: User;
  onDelete: (userId: string) => void;
  onBlock: (userId: string, currentBlockStatus: boolean) => void;
}

function UserRow({ user, onDelete, onBlock }: UserRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-gray-500">
              ID: {user._id.slice(-8)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {user.isAdmin ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <FaUserShield />
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <FaUser />
            User
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {user.isBlocked ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <FaBan />
            Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <FaCheckCircle />
            Active
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onBlock(user._id, user.isBlocked || false)}
            className={`p-2 rounded-lg transition-all ${
              user.isBlocked
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            }`}
            title={user.isBlocked ? "Unblock user" : "Block user"}
          >
            {user.isBlocked ? <FaCheckCircle /> : <FaBan />}
          </button>
          <button
            onClick={() => onDelete(user._id)}
            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
            title="Delete user"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AdminUsers;
