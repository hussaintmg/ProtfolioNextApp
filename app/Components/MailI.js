"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function MailEditI() {
  const { home, getData } = useMainData();
  const [selectedEmailIcon, setSelectedEmailIcon] = useState(null);
  const [selectedEmailIconFile, setSelectedEmailIconFile] = useState(null);

  const uploadEmailIcon = async () => {
    if (!selectedEmailIconFile)
      return toast.error("Please select an Icon first!");

    const formData = new FormData();
    formData.append("EMI", selectedEmailIconFile);

    try {
      const res = await axios.post(`/api/data/Home/emi-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getData();
      setSelectedEmailIcon(null);
      setSelectedEmailIconFile(null);
      toast.success("Icon uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload Icon");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-center text-cornflowerblue text-2xl sm:text-3xl font-bold mb-6">
        Email Icon
      </h2>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        {/* Hidden File Input */}
        <input
          type="file"
          id="EmailIconI"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedEmailIcon(URL.createObjectURL(file));
              setSelectedEmailIconFile(file);
            }
          }}
        />

        {/* Upload Button / Preview */}
        <button
          type="button"
          className="flex justify-center items-center bg-white cursor-pointer p-4 rounded-md shadow hover:opacity-80 transition-all"
          onClick={() => document.getElementById("EmailIconI").click()}
        >
          {selectedEmailIcon ? (
            <img
              src={selectedEmailIcon}
              alt="Icon Preview"
              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md"
            />
          ) : (
            <i className="fa-solid fa-upload text-6xl sm:text-7xl text-gray-800"></i>
          )}
        </button>

        {/* Current Icon */}
        {home?.home?.EmailIcon && (
          <img
            src={home.home.EmailIcon}
            alt="Current Icon"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md bg-white/40"
          />
        )}
      </div>

      {/* Confirm Button */}
      {selectedEmailIcon && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={uploadEmailIcon}
            className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out text-lg"
          >
            Confirm Changes
          </button>
        </div>
      )}
    </div>
  );
}
