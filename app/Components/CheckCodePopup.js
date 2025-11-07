"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CheckCodePopup({ visible: initialVisible, setVisible }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(initialVisible);

  useEffect(() => {
    async function checkToken() {
      try {
        const res = await axios.get("/api/auth/check-fp", { withCredentials: true });
        setShow(res.data.valid || initialVisible);
      } catch {
        setShow(initialVisible);
      }
    }
    checkToken();
  }, [initialVisible]);

  if (!show) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/check-code", { code }, { withCredentials: true });
      toast.success(res.data.message || "Code verified successfully");
      localStorage.setItem("resetToken", res.data.resetToken);
      setShow(false);
      setVisible(false);
      window.location.href = "/reset-password";
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100]">
      <div className="bg-[#111] border border-[#0f8f44] text-white p-8 rounded-2xl shadow-[0_0_25px_rgba(0,255,150,0.3)] w-[90%] max-w-sm">
        <h2 className="text-center text-2xl font-semibold mb-4 text-[#00c951]">Enter Verification Code</h2>
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="6-digit code"
            required
            className="w-full text-center text-xl p-3 bg-transparent border-2 border-[#00c951] rounded-lg tracking-widest outline-none focus:ring focus:ring-[#00c951]/50"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#0f8f44] cursor-pointer font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95 ${loading && "opacity-50 cursor-not-allowed"}`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <p className="text-center text-sm mt-3 text-gray-400">This code will expire in 10 minutes.</p>
      </div>
    </div>
  );
}
  