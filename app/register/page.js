"use client";

import React, { useState, useEffect } from "react";
import AnimatedTitle from "../Components/AnimatedTitle";
import RevealSection from "../Components/RevealSection";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const router = useRouter();

  const { getUserData } = useAuth();

  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBtn, setShowPasswordBtn] = useState(false);
  const [remember, setRemember] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  useEffect(() => {
    document.title = "Hussain Portfolio | Register";
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (cPassword.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      if (password === cPassword || password.slice(6) === cPassword) {
        const res = await axios.post(
          `/api/auth/register`,
          { username, email, password, remember },
          { withCredentials: true }
        );
        toast.success(res.data.message);
        setUser(res.data.user);
        getUserData();
        if (res.data.user.role === "admin") router.push("/admin");
        else router.push("/");
      } else {
        toast.error("Passwords do not match");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-[#00c951] text-[2.5rem] mb-[1cm] font-bold">
        <AnimatedTitle>Register</AnimatedTitle>
      </h1>

      <RevealSection trigger="load">
        <form
          className="relative flex mx-auto flex-col gap-[1cm] items-center bg-black/50 p-[1cm] rounded-2xl shadow-[0_4px_25px_rgba(0,255,255,0.3)] w-[60%]
          max-[900px]:w-[75%] max-[450px]:w-[85%] max-[300px]:w-[95%]"
        >
          {/* Username */}
          <div className="relative w-[80%]">
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              className="peer w-full h-[1cm] bg-transparent border-b-2 border-[#ccc] text-white text-[1.3rem]
              outline-none transition-all duration-300 focus:border-[#00c951]
              focus:shadow-[0_4px_20px_rgba(0,255,255,0.4)]"
            />
            <label
              htmlFor="username"
              className={`absolute left-0 text-gray-400 text-[1rem] transition-all duration-300 pointer-events-none
              ${
                username
                  ? "top-[-12px] text-[13px] text-[#0f8f44] bg-black/40 px-[0.1cm]"
                  : "top-[8px]"
              }
              peer-focus:top-[-12px] peer-focus:text-[13px] peer-focus:text-[#0f8f44] peer-focus:bg-black/40 peer-focus:px-[0.1cm]`}
            >
              Username
            </label>
          </div>

          {/* Email */}
          <div className="relative w-[80%]">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
              className="peer w-full h-[1cm] bg-transparent border-b-2 border-[#ccc] text-white text-[1.3rem]
              outline-none transition-all duration-300 focus:border-[#00c951]
              focus:shadow-[0_4px_20px_rgba(0,255,255,0.4)]"
            />
            <label
              htmlFor="email"
              className={`absolute left-0 text-gray-400 text-[1rem] transition-all duration-300 pointer-events-none
              ${
                email
                  ? "top-[-12px] text-[13px] text-[#0f8f44] bg-black/40 px-[0.1cm]"
                  : "top-[8px]"
              }
              peer-focus:top-[-12px] peer-focus:text-[13px] peer-focus:text-[#0f8f44] peer-focus:bg-black/40 peer-focus:px-[0.1cm]`}
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative w-[80%]">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowPasswordBtn(true)}
              onBlur={() => setShowPasswordBtn(false)}
              required
              className="peer w-full h-[1cm] bg-transparent border-b-2 border-[#ccc] text-white text-[1.3rem]
              outline-none transition-all duration-300 focus:border-[#00c951]
              focus:shadow-[0_4px_20px_rgba(0,255,255,0.4)]"
            />
            <label
              htmlFor="password"
              className={`absolute left-0 text-gray-400 text-[1rem] transition-all duration-300 pointer-events-none
              ${
                password
                  ? "top-[-12px] text-[13px] text-[#0f8f44] bg-black/40 px-[0.1cm]"
                  : "top-[8px]"
              }
              peer-focus:top-[-12px] peer-focus:text-[13px] peer-focus:text-[#0f8f44] peer-focus:bg-black/40 peer-focus:px-[0.1cm]`}
            >
              Password
            </label>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              style={{ visibility: showPasswordBtn ? "visible" : "hidden" }}
              className="absolute top-1/2 -translate-y-1/2 left-[95%] text-[#aaa] bg-transparent border-none cursor-pointer
              transition-all duration-300 hover:text-white focus:outline-none
              max-[900px]:left-[93%] max-[450px]:left-[92%] max-[300px]:left-[91%]"
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                } text-[1.1rem]`}
              ></i>
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative w-[80%]">
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              required
              className="peer w-full h-[1cm] bg-transparent border-b-2 border-[#ccc] text-white text-[1.3rem]
              outline-none transition-all duration-300 focus:border-[#00c951]
              focus:shadow-[0_4px_20px_rgba(0,255,255,0.4)]"
            />
            <label
              htmlFor="confirm-password"
              className={`absolute left-0 text-gray-400 text-[1rem] transition-all duration-300 pointer-events-none
              ${
                cPassword
                  ? "top-[-12px] text-[13px] text-[#0f8f44] bg-black/40 px-[0.1cm]"
                  : "top-[8px]"
              }
              peer-focus:top-[-12px] peer-focus:text-[13px] peer-focus:text-[#0f8f44] peer-focus:bg-black/40 peer-focus:px-[0.1cm]`}
            >
              Confirm Password
            </label>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 text-[1rem] text-gray-300 w-[80%]">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-[#00c951] w-[16px] h-[16px]"
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleRegister}
            className="mt-[0.5cm] bg-[#00c951] text-white font-semibold px-[1cm] py-[0.4cm]
            rounded-md transition-all duration-300 hover:bg-[#0f8f44] cursor-pointer active:scale-90"
          >
            Register
          </button>

          {/* Go to login */}
          <div className="mt-[0.3cm] text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#00c951] hover:underline hover:text-white transition-all duration-200"
            >
              Login
            </Link>
          </div>
        </form>
      </RevealSection>
    </div>
  );
}
