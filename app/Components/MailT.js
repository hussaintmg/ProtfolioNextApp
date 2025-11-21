"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function MailT({ activeTab3 }) {
  const { home, getData } = useMainData();
  const [EmailT, setEmailT] = useState("");

  const updateEmail = async () => {
    if (!EmailT) return toast.error("Please Enter an Email!");

    try {
      const res = await axios.post(
        `/api/data/Home/emt-upload`,
        { EmailT },
        { headers: { "Content-Type": "application/json" } }
      );
      getData();
      setEmailT("");
      toast.success(res.data.message || "Email updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to update");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <input
        type="text"
        name="UPEmail"
        id="UPEmail"
        placeholder={home?.home?.EmailT}
        value={EmailT}
        onChange={(e) => setEmailT(e.target.value)}
        className="w-full sm:w-full h-12 sm:h-14 text-lg sm:text-xl border rounded-md px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-[#00f2ea] focus:border-transparent"
      />
      <button
        type="button"
        className="w-full sm:w-auto block mx-auto text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out text-lg"
        onClick={updateEmail}
      >
        Update Email
      </button>
    </div>
  );
}
