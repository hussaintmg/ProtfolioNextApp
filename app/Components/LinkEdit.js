"use client";

import React, { useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";

import { useMainData } from "@/app/context/MainDataContext";

export default function LinkEdit({ link, id }) {
  const { getData } = useMainData();

  const [value, setValue] = useState(link);

  const handleUpdate = async () => {
    if (!value || value === link) {
      return toast.error("Please enter a new value!");
    }

    try {
      await axios.put(
        `/api/data/Projects/link-up/${id}`,
        { link: value },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Link updated successfully!");
      getData();
    } catch (err) {
      console.error("Link update error:", err);
      toast.error("Failed to update link!");
    }
  };

  return (
    <>
      <h3 className="font-bold text-[1.3rem] text-center">Link</h3>
      <hr className="my-3 w-[40%] text-[#808080a8] mx-auto" />
      <div className="flex items-center justify-around">
        <input
          type="text"
          className="px-[0.75rem] py-[0.6rem] border-[#d1d5db] placeholder:text-[#9ca3af] border-[2px] rounded-sm border-solid border-[#000000]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={link}
        />
        <button
          className="text-black border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
          onClick={handleUpdate}
        >
          Update Link
        </button>
      </div>
      <hr className="my-3 font-bold bg-black h-[3px]" />
    </>
  );
}
