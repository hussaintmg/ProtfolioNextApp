"use client";

import React, { useState } from "react";
import AnimatedTitle from "../Components/AnimatedTitle";
import RevealSection from "../Components/RevealSection";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();

  const { getUserData } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/api/auth/login`,
        { username, password, remember },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      getUserData()
      router.push(res.data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-white min-h-screen px-[3vw]">
      <h1 className="text-[2.5rem] font-bold mb-6 text-[#00c951]">
        <AnimatedTitle>Login</AnimatedTitle>
      </h1>

      <RevealSection trigger="load">
        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col items-center gap-[3vw] text-center"
        >
          {/* Username */}
          <div className="relative w-full flex justify-center">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
              placeholder=" "
              className="peer w-[60%] h-[1cm] text-[1.5rem] rounded-md px-[0.5cm] py-[0.3cm]
               border-b-[2px] border-[#ccc] bg-transparent text-white outline-none
               transition-all duration-300 focus:shadow-[0_4px_20px_rgba(0,255,255,0.4)]
               focus:border-[#0f8f44]"
            />

            <label
              htmlFor="username"
              className={`absolute left-[21%] text-gray-400 text-[16px] transition-all duration-300 pointer-events-none
                top-[-12px] text-[13px] text-[#0f8f44] bg-black/40 px-[0.1cm]   /* default = floated */
                peer-placeholder-shown:top-[8px] peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0
                peer-focus:top-[-12px] peer-focus:text-[13px] peer-focus:text-[#0f8f44] peer-focus:bg-black/40 peer-focus:px-[0.1cm]`}
            >
              Username
            </label>
          </div>

          {/* Password */}
          <div className="relative w-full flex justify-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              className="peer w-[60%] h-[1cm] text-[1.5rem] rounded-md px-[0.5cm] py-[0.3cm]
               border-b-[2px] border-[#ccc] bg-transparent text-white outline-none
               transition-all duration-300 focus:shadow-[0_4px_20px_rgba(0,255,255,0.4)]
               focus:border-[#0f8f44]"
            />

            <label
              htmlFor="password"
              className={`absolute left-[21%] text-gray-400 text-[16px] transition-all duration-300 pointer-events-none
                top-[-12px] text-[13px] text-[#0f8f44] bg-black/40 px-[0.1cm]
                peer-placeholder-shown:top-[8px] peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0
                peer-focus:top-[-12px] peer-focus:text-[13px] peer-focus:text-[#0f8f44] peer-focus:bg-black/40 peer-focus:px-[0.1cm]`}
            >
              Password
            </label>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 transform -translate-y-1/2 left-[78%] text-[#aaa] bg-transparent border-none cursor-pointer transition-all duration-300 hover:text-white max-[900px]:left-[76%] max-[450px]:left-[74%] max-[300px]:left-[72%]"
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
              ></i>
            </button>
          </div>

          {/* Remember Me */}
          <div className="w-[60%] flex items-center text-left mt-2 text-[1.2rem]">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="mr-2 accent-[#0f8f44] cursor-pointer"
            />
            <label htmlFor="remember" className="select-none">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            onClick={handleLogin}
            className="cursor-pointer w-[3cm] h-[1cm] bg-[#0f8f44] rounded-md text-white text-[1.3rem] font-bold transition-transform duration-300 hover:scale-110 active:scale-90 mt-[1.5cm]"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <div className="w-[60%] text-left mt-4">
          <Link
            href="/forgot-password"
            className="underline decoration-[#3480eb] text-[#3480eb] text-[1.2rem] bg-transparent border-none cursor-pointer"
          >
            Forgot Password
          </Link>
        </div>

        {/* Register */}
        <div className="w-full text-center mt-[1.5cm]">
          <Link
            href="/register"
            className="flex justify-center items-center mx-auto cursor-pointer w-[80%] h-[1.5cm] bg-[#0f8f44] rounded-md text-white text-[1.3rem] font-bold transition-transform duration-300 hover:scale-110 active:scale-90"
          >
            Go to Register
          </Link>
        </div>
      </RevealSection>
    </div>
  );
}
