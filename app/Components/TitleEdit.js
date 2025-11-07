"use client";

import React, { useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";

import { useMainData } from "@/app/context/MainDataContext";

export default function TitleEdit({ title, id }) {
  const { getData } = useMainData();

  const [value, setValue] = useState(title);

  const handleUpdate = async () => {
    if (!value || value === title) {
      return toast.error("Please enter a new value!");
    }

    try {
      await axios.put(
        `/api/data/Projects/title-up/${id}`,
        { title: value },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Title updated successfully!");
      getData();
    } catch (err) {
      console.error("Title update error:", err);
      toast.error("Failed to update title!");
    }
  };

  return (
    <>
      <h3 className="font-bold text-[1.3rem] text-center">Title</h3>
      <hr className="my-3 w-[40%] text-[#808080a8] mx-auto" />
      <div className="flex items-center justify-around">
        <input
          type="text"
          className="px-[0.75rem] py-[0.6rem] border-[#d1d5db] placeholder:text-[#9ca3af] border-[2px] rounded-sm border-solid border-[#000000]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={title}
        />
        <button
          className="text-black border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
          onClick={handleUpdate}
        >
          Update Title
        </button>
      </div>
      <hr className="my-3 font-bold bg-black h-[3px]" />
    </>
  );
}
