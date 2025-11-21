"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProfilePicEdit() {
  const { home, getData } = useMainData();
  const [selectedProf, setSelectedProf] = useState(null);
  const [selectedProfFile, setSelectedProfFile] = useState(null);

  const uploadProf = async () => {
    if (!selectedProf) return toast.error("Please select a Profile first!");

    const formData = new FormData();
    formData.append("Prof", selectedProfFile);

    try {
      await axios.post(`/api/data/Home/prof-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getData();
      setSelectedProf(null);
      setSelectedProfFile(null);
      toast.success("Profile Pic uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload Profile");
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 py-6">
      <h2 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl mb-6 text-center">
        Profile Picture
      </h2>

      <div className="w-full flex flex-col sm:flex-row items-center gap-6 sm:gap-10 justify-center">
        {/* Hidden file input */}
        <input
          type="file"
          id="profInput"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedProf(URL.createObjectURL(file));
              setSelectedProfFile(file);
            }
          }}
        />

        {/* Upload Button / Preview */}
        <button
          type="button"
          className="cursor-pointer bg-white rounded-lg p-2 flex justify-center items-center hover:opacity-80 transition-all duration-300 w-30 h-30 sm:w-48 sm:h-48 md:w-56 md:h-56"
          onClick={() => document.getElementById("profInput").click()}
        >
          {selectedProf ? (
            <img
              src={selectedProf}
              alt="Profile Preview"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <i
              className="fa-solid fa-upload text-6xl sm:text-7xl md:text-8xl text-black"
            ></i>
          )}
        </button>

        {/* Current Profile */}
        {home?.home?.Profile && (
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white/30 rounded-lg flex justify-center items-center overflow-hidden">
            <img
              src={home.home.Profile}
              alt="currentProfile"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Confirm Button */}
      {selectedProf && (
        <button
          type="button"
          className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer text-lg mt-6 sm:mt-8"
          onClick={uploadProf}
        >
          Confirm Changes
        </button>
      )}
    </div>
  );
}
