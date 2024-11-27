import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom"; // Import Link component
import { Context, server } from "../main";
import toast from "react-hot-toast";
import axios from "axios";

function Login() {
  // Define state variables for username and password

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { isAuthenticated, setAthu, loader, setLoader } = useContext(Context);

  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      const { data } = await axios.post(
        `${server}/users/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setAthu(true);
      setLoader(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoader(false);
      setAthu(false);
    }
  };
  if (isAuthenticated) return <Navigate to={"/"} />;
  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: `url("https://th.bing.com/th/id/OIG3.Mhlurv5ktAtK9hg_N_vR?pid=ImgGn")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className=" shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-opacity-100 backdrop-blur-sm"
        >
          <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="username"
              value={email}
              onChange={handleUsernameChange}
              placeholder="Enter your email ex: alice@outlook.com"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center px-4 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 15v-2a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 15v-2a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              disabled={loader}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
            <span>
              Or{" "}
              <Link to="/register" className="text-blue-500">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
