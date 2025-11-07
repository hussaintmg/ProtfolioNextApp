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
      setAddressT("")
      toast.success(res.data.message || "Address update successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to update");
    }
  };
  return (
    <div className="m-[20px]">
      <input
        type="text"
        name="Address"
        id="Address"
        placeholder={home?.home?.AddressT}
        value={AddressT}
        onChange={(e) => setAddressT(e.target.value)}
        className="w-[50%] h-[1cm] text-[30px] border rounded-sm px-[10px]"
      />
      <button
        type="button"
        className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer text-lg mt-[1cm] ml-[40%] opacity-100 active:scale-[0.999]"
        style={{ margin: " 0 0 0 10%" }}
        onClick={updateAddress}
      >
        Update Address
      </button>
    </div>
  );
}
