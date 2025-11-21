"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function AddressT() {
  const { home, getData } = useMainData();
  const [AddressT, setAddressT] = useState("");

  const updateAddress = async () => {
    if (!AddressT) return toast.error("Please Enter Address!");

    try {
      const res = await axios.post(
        `/api/data/Home/at-upload`,
        { AddressT },
        { headers: { "Content-Type": "application/json" } }
      );
      getData();
      setAddressT("");
      toast.success(res.data.message || "Address updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to update");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col items-center gap-4">
      <input
        type="text"
        name="Address"
        id="Address"
        placeholder={home?.home?.AddressT || "Enter Address"}
        value={AddressT}
        onChange={(e) => setAddressT(e.target.value)}
        className="w-full sm:w-[90%] px-4 py-2 border rounded-md text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-[#00f2ea]"
      />
      <button
        type="button"
        onClick={updateAddress}
        className="w-full sm:w-auto mt-4 px-6 py-2 rounded-md border border-[#00f2ea] text-white hover:bg-[#00f2ea] hover:text-black transition-all duration-300 active:scale-95"
      >
        Update Address
      </button>
    </div>
  );
}
