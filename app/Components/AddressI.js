"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function AddressI() {
  const { home, getData } = useMainData();
  const [selectedAddressIcon, setSelectedAddressIcon] = useState(null);
  const [selectedAddressIconFile, setSelectedAddressIconFile] = useState(null);

  const uploadAddressIcon = async () => {
    if (!selectedAddressIconFile)
      return toast.error("Please select an Icon first!");

    const formData = new FormData();
    formData.append("AI", selectedAddressIconFile);

    try {
      await axios.post(`/api/data/Home/ai-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getData();
      setSelectedAddressIcon(null);
      setSelectedAddressIconFile(null);
      toast.success("Icon uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload Icon");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col items-center gap-4">
      <input
        type="file"
        id="AddressIcon"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setSelectedAddressIcon(URL.createObjectURL(file));
            setSelectedAddressIconFile(file);
          }
        }}
      />
      <button
        type="button"
        className="cursor-pointer bg-white rounded-md p-2 hover:opacity-80 transition"
        onClick={() => document.getElementById("AddressIcon").click()}
      >
        {selectedAddressIcon ? (
          <img
            src={selectedAddressIcon}
            alt="Logo Preview"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
          />
        ) : (
          <i className="fa-solid fa-upload text-6xl sm:text-8xl text-black p-4"></i>
        )}
      </button>
      {home?.home?.AddressI && !selectedAddressIcon && (
        <img
          src={home.home.AddressI}
          alt="Current Icon"
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain bg-white/40 rounded-md"
        />
      )}
      {selectedAddressIcon && (
        <button
          type="button"
          onClick={uploadAddressIcon}
          className="mt-4 w-full sm:w-auto text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 active:scale-95"
        >
          Confirm Changes
        </button>
      )}
    </div>
  );
}
