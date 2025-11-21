"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function PhoneN() {
  const { home, getData } = useMainData();
  const [number, setNumber] = useState("");

  const updateNumber = async () => {
    if (!number) return toast.error("Please Enter Number!");

    try {
      await axios.post(
        `/api/data/Home/pn-upload`,
        { number },
        { headers: { "Content-Type": "application/json" } }
      );
      getData();
      setNumber("");
      toast.success("Number updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to update");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col gap-4">
      <input
        type="text"
        name="Number"
        id="Number"
        placeholder={home?.home?.PhoneN || "Enter Number"}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className="w-full text-lg sm:text-xl border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      <button
        type="button"
        onClick={updateNumber}
        className="w-full sm:w-auto self-center text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out text-lg active:scale-95"
      >
        Update Number
      </button>
    </div>
  );
}
