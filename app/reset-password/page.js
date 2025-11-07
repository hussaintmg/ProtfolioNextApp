"use client";

import React, { useState, useEffect } from "react";
import AnimatedTitle from "../Components/AnimatedTitle";
import RevealSection from "../Components/RevealSection";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [userData, setUserData] = useState(null); // username/email

  // check rp_token validity on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get("/api/auth/verify-rp-token", {
          withCredentials: true,
        });
        setTokenValid(true);
        setUserData({ username: res.data.username, email: res.data.email });
      } catch {
        setTokenValid(false);
        router.push("/");
      }
    };
    verifyToken();
  }, []);

  useEffect(() => {
    document.title = "Hussain Portfolio | Reset Password";
  }, []);

  const handleRP = async (e) => {
    e.preventDefault();
    if (password !== cPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(
        `/api/auth/reset-password`,
        { newPassword: password },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password Reset Failed");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start text-center text-white min-h-screen pt-[6rem]">
      <h1 className="text-4xl font-bold mb-12">
        <AnimatedTitle>Reset Password</AnimatedTitle>
      </h1>

      <RevealSection trigger="load">
        {tokenValid === null ? (
          <p>Loading...</p>
        ) : tokenValid === false ? (
          <p className="text-red-500 text-lg">Invalid or Expired Token</p>
        ) : (
          <div>
            <p className="mb-6 text-lg">
              Resetting password for{" "}
              <b>{userData?.username || userData?.email}</b>
            </p>

            <form
              onSubmit={handleRP}
              className="w-full flex flex-col items-center px-6"
            >
              <div className="relative w-[60%] max-w-md mb-10">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="peer w-full h-12 bg-transparent border-b-2 border-gray-400 text-lg focus:outline-none focus:border-[#0f8f44] transition-all duration-300 text-white px-2"
                />
                <label
                  htmlFor="password"
                  className={`absolute left-2 text-gray-400 text-base transition-all duration-300
                  ${
                    password
                      ? "-top-3 text-sm text-[#0f8f44] bg-black/40 px-1"
                      : "top-3"
                  }
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#0f8f44] peer-focus:bg-black/40`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    } text-white`}
                  ></i>
                </button>
              </div>

              <div className="relative w-[60%] max-w-md mb-10">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirm-password"
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  required
                  className="peer w-full h-12 bg-transparent border-b-2 border-gray-400 text-lg focus:outline-none focus:border-[#0f8f44] transition-all duration-300 text-white px-2"
                />
                <label
                  htmlFor="confirm-password"
                  className={`absolute left-2 text-gray-400 text-base transition-all duration-300
                  ${
                    cPassword
                      ? "-top-3 text-sm text-[#0f8f44] bg-black/40 px-1"
                      : "top-3"
                  }
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#0f8f44] peer-focus:bg-black/40`}
                >
                  Confirm Password
                </label>
              </div>

              <button
                type="submit"
                className="cursor-pointer w-48 h-12 bg-[#0f8f44] rounded-md text-lg font-semibold hover:scale-105 active:scale-95 transition-all"
              >
                Reset Password
              </button>
            </form>
          </div>
        )}
      </RevealSection>
    </div>
  );
}
