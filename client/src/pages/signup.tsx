/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { register } from "../utils/handlers";
import { Navigate } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";

import {
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuCircleUserRound,
  LuUserRoundCheck,
} from "react-icons/lu";

interface UserRegisterInputsType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function SignUpPage() {
  const { isAuthenticated, logUser } = useAuth();

  const [userRegister, setUserRegister] = useState<UserRegisterInputsType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [pending, setPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setUserRegister((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    try {
      const data = await register(userRegister);
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
    <div className="min-h-screen bg-gradient-to-tr from-purple-500 via-indigo-300 to-sky-500  flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left decorative side */}
        <div className="flex flex-col md:flex-row">
          {/* Signup form */}
          <div className="p-8  w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Sign Up</h1>
              <p className="text-gray-500 mt-2">Create a new account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <LuCircleUserRound size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="First Name"
                  defaultValue={userRegister.firstName}
                  onChange={(e) =>
                    setUserRegister({
                      ...userRegister,
                      firstName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <LuUserRoundCheck size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Last Name"
                  defaultValue={userRegister.lastName}
                  onChange={(e) =>
                    setUserRegister({
                      ...userRegister,
                      lastName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <LuMail size={18} />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Email address"
                  defaultValue={userRegister.email}
                  onChange={(e) =>
                    setUserRegister({ ...userRegister, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <LuLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Password"
                  defaultValue={userRegister.password}
                  onChange={(e) =>
                    setUserRegister({
                      ...userRegister,
                      password: e.target.value,
                    })
                  }
                  required
                />
                {error && (
                  <p className="w-full p-2 rounded-md border border-red-500 text-sm text-red-500 bg-red-100">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>

              <div className="flex items-center text-sm mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2 h-4 w-4 accent-indigo-600"
                  required
                />
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center mt-6"
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
                  "Create Account"
                )}
              </button>
            </form>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or login with your account
                </span>
              </div>
            </div>

            <p className="text-center mt-8 text-gray-600">
              Already have an account?
              <a
                href="/login"
                className="text-indigo-600 hover:underline hover:text-indigo-800  duration-150 font-medium ml-1"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;

// import React, { useState } from 'react';
// import { Mail, Lock, Eye, EyeOff, User, UserCheck, Facebook, Github } from 'lucide-react';

// export default function SignupPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       alert('Account created successfully!');
//     }, 1500);
//   };

//   return (

//   );
// }
