/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { login } from "../utils/handlers";
import { Navigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";
import { loginUserParams } from "../utils/types";

import { LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu";

function LoginPage() {
  const { isAuthenticated, logUser } = useAuth();

  const [userLogin, setUserLogin] = useState<loginUserParams>({
    email: "",
    password: "",
  });
  const [pending, setPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    try {
      const data = await login(userLogin);
      console.log(data);
      const { user, token } = data;

      logUser({ user, token });

      return <Navigate to="/profile" replace />;
    } catch (err: any) {
      setError(err?.message);
      return;
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-500 via-indigo-300 to-sky-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left decorative side */}
        <div className="w-full flex flex-col justify-center items-center md:flex-row">
          {/* Login form */}
          <div className="w-full p-8 ">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Log In </h1>
              <p className="text-gray-500 mt-2">Access your account</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <LuMail size={18} />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Email address"
                  defaultValue={userLogin.email}
                  onChange={(e) =>
                    setUserLogin({ ...userLogin, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <LuLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Password"
                  defaultValue={userLogin.password}
                  onChange={(e) =>
                    setUserLogin({ ...userLogin, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
              {error && (
                <p className="p-2 border border-red-500 rounded-md bg-red-100 text-red-500 text-sm">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-indigo-600"
                    required
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer   py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                disabled={pending}
              >
                {pending ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or create a new account
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center mt-8 text-gray-600">
              Don't have an account?
              <a
                href="/signup"
                className="text-indigo-600 hover:text-indigo-800 font-medium ml-1"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       alert('Login successful');
//     }, 1500);
//   };

//   return (

//   );
// }
