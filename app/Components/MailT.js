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
      setEmailT("")
      toast.success(res.data.message || "Email update successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to update");
    }
  };
  return (
    <div className="m-[20px]">
      <input
        type="text"
        name="UPEmail"
        id="UPEmail"
        placeholder={home?.home?.EmailT}
        value={EmailT}
        onChange={(e) => setEmailT(e.target.value)}
        className="w-[50%] h-[1cm] text-[30px] border rounded-sm px-[10px]"
      />
      <button
        type="button"
        className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer text-lg mt-[1cm] ml-[40%] opacity-100 active:scale-[0.999]"
        style={{ margin: " 0 0 0 10%" }}
        onClick={updateEmail}
      >
        Update Email
      </button>
    </div>
  );
}
