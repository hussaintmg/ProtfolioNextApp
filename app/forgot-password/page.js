"use client";

import React, { useState, useEffect } from "react";
import AnimatedTitle from "../Components/AnimatedTitle";
import RevealSection from "../Components/RevealSection";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import CheckCodePopup from "../Components/CheckCodePopup";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [stateAsU, setStateAsU] = useState(true);
  const [showCodePopup, setShowCodePopup] = useState(false);

  useEffect(() => {
    document.title = "Hussain Portfolio | Forgot Password";
    // page load pe check cookie
    async function checkFPToken() {
      try {
        const res = await axios.get("/api/auth/check-fp", { withCredentials: true });
        if (res.data.valid) setShowCodePopup(true);
      } catch {}
    }
    checkFPToken();
  }, []);

  const handleFP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/auth/forgot-password",
        { username, stateAsU },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setShowCodePopup(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative -top-[2cm]">
      <h1 className="text-[#00c951] text-[2.5rem] mb-[1cm] font-bold">
        <AnimatedTitle>Forgot Password</AnimatedTitle>
      </h1>

      <RevealSection trigger="load">
        <form
          onSubmit={handleFP}
          className="relative flex flex-col mx-auto gap-[1cm] items-center bg-black/50 p-[1cm] rounded-2xl shadow-[0_4px_25px_rgba(0,255,255,0.3)] w-[60%]
          max-[900px]:w-[75%] max-[450px]:w-[85%] max-[300px]:w-[95%]"
        >
          <div className="relative w-[80%]">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              className="peer w-full h-[1.2cm] bg-transparent border-b-2 border-[#ccc] text-white text-[1.2rem]
              outline-none transition-all duration-300 focus:border-[#00c951] px-3
              focus:shadow-[0_4px_20px_rgba(0,255,255,0.4)]"
            />
            <label
              htmlFor="username"
              className={`absolute left-2 text-gray-400 text-[1.1rem] transition-all duration-300 bg-transparent px-1
                ${
                  username
                    ? "-top-3 text-sm text-[#0f8f44] bg-black/40"
                    : "top-[0.3cm]"
                }
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#0f8f44] peer-focus:bg-black/40`}
            >
              {stateAsU ? "Username" : "Email"}
            </label>
          </div>

          <button
            type="button"
            onClick={() => setStateAsU(!stateAsU)}
            className="underline cursor-pointer text-[#3480eb] text-[1.1rem] hover:text-[#00c951] transition-all duration-200"
          >
            {stateAsU ? "Forgot Username" : "Continue with Username"}
          </button>

          <button
            type="submit"
            className="bg-[#0f8f44] cursor-pointer w-[3cm] h-[1cm] rounded-md font-bold text-[1.2rem] transition-all duration-300 hover:scale-110 active:scale-90"
          >
            Submit
          </button>

          <div className="mt-[0.5cm]">
            <Link
              href="/login"
              className="text-[#00c951] hover:text-white transition-all duration-300"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </RevealSection>

      <CheckCodePopup visible={showCodePopup} setVisible={setShowCodePopup} />
    </div>
  );
}
