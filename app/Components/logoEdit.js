"use client";

import React, { useState } from "react";
import RevealSection from "./RevealSection";
import { useMainData } from "@/app/context/MainDataContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function LogoEdit() {
  const { home, getData } = useMainData();

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);

  const uploadLogo = async () => {
    if (!selectedLogoFile) return toast.error("Please select a logo first!");

    const formData = new FormData();
    formData.append("logo", selectedLogoFile);

    try {
      await axios.post(`/api/data/Home/logo-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      getData();
      setSelectedLogo(null);
      setSelectedLogoFile(null);
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload logo");
    }
  };

  return (
    <div className="w-full pt-10 px-4 sm:px-6 lg:px-10">
      <h2 className="text-center text-[cornflowerblue] mb-10 text-3xl font-bold">
        Top Bar Editing
      </h2>

      <RevealSection trigger="load">
        <h2 className="text-white text-2xl sm:text-3xl font-semibold mb-6">
          Logo
        </h2>

        {/* File Input + Preview + Current Logo */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 mt-6">

          {/* Upload Button */}
          <div>
            <input
              type="file"
              id="logoInput"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedLogo(URL.createObjectURL(file));
                  setSelectedLogoFile(file);
                }
              }}
            />

            <button
              className="cursor-pointer bg-white p-4 rounded-xl shadow-md hover:opacity-80 transition"
              onClick={() => document.getElementById("logoInput").click()}
              type="button"
            >
              {selectedLogo ? (
                <img
                  src={selectedLogo}
                  alt="Logo Preview"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              ) : (
                <i className="fa-solid fa-upload text-6xl sm:text-7xl text-black"></i>
              )}
            </button>
          </div>

          {/* Current Logo Display */}
          <div className="flex flex-col items-center">
            <p className="text-white mb-3 text-lg">Current Logo</p>
            <img
              src={home?.home?.logo}
              alt="Current Logo"
              className="w-40 sm:w-56 md:w-64 object-contain rounded-lg shadow"
            />
          </div>
        </div>

        {/* Confirm Button */}
        {selectedLogo && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={uploadLogo}
              className="text-white border border-[#00f2ea] px-8 py-3 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 text-lg active:scale-95"
            >
              Confirm Changes
            </button>
          </div>
        )}
      </RevealSection>
    </div>
  );
}
