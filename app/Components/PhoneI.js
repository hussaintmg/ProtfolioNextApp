"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function MailEditI() {
  const { home, getData } = useMainData();
  const [selectedPhoneIcon, setSelectedPhoneIcon] = useState(null);
  const [selectedPhoneIconFile, setSelectedPhoneIconFile] = useState(null);

  const uploadPhoneIcon = async () => {
    if (!selectedPhoneIconFile)
      return toast.error("Please select an Icon first!");

    const formData = new FormData();
    formData.append("PI", selectedPhoneIconFile);

    try {
      await axios.post(`/api/data/Home/pi-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getData();
      setSelectedPhoneIcon(null);
      setSelectedPhoneIconFile(null);
      toast.success("Icon uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload Icon");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Hidden file input */}
        <input
          type="file"
          id="PhoneIcon"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedPhoneIcon(URL.createObjectURL(file));
              setSelectedPhoneIconFile(file);
            }
          }}
        />

        {/* Upload button / preview */}
        <button
          type="button"
          className="cursor-pointer bg-white rounded-md p-4 flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
          onClick={() => document.getElementById("PhoneIcon").click()}
        >
          {selectedPhoneIcon ? (
            <img
              src={selectedPhoneIcon}
              alt="Icon Preview"
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
            />
          ) : (
            <i className="fa-solid fa-upload text-6xl sm:text-8xl text-gray-800"></i>
          )}
        </button>

        {/* Current Icon */}
        <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden">
          {home?.home?.PhoneI && (
            <img
              src={home?.home?.PhoneI}
              alt="Current Icon"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Confirm button */}
      {selectedPhoneIcon && (
        <button
          type="button"
          className="w-full sm:w-auto mt-4 sm:mt-6 block mx-auto text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out text-lg"
          onClick={uploadPhoneIcon}
        >
          Confirm Changes
        </button>
      )}
    </div>
  );
}
