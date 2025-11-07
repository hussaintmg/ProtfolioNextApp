"use client";

import React, { useState } from "react";
import RevealSection from "./RevealSection";
import { useMainData } from "@/app/context/MainDataContext";

import axios from "axios";
import { toast } from "react-toastify";

export default function logoEdit() {
  const { home, getData } = useMainData();
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);

  const uploadLogo = async () => {
    if (!selectedLogoFile) return toast.error("Please select a logo first!");

    const formData = new FormData();
    formData.append("logo", selectedLogoFile);

    try {
      const res = await axios.post(`/api/data/Home/logo-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getData();
      setSelectedLogo(null)
      setSelectedLogoFile(null)
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload logo");
    }
  };
  return (
    <div className="w-full pt-[1cm] pl-[0.3cm]">
      <h2 className="text-center text-[cornflowerblue] my-[0.5cm] text-3xl font-bold">
        Top Bar Editing
      </h2>
      <RevealSection trigger="load">
        <h2 className="text-white pt-[0.5cm] pl-[20%] text-3xl">Logo </h2>
        <div className="w-full flex justify-center items-center gap-[5cm] mt-[0.8cm]">
          <input
            type="file"
            id="logoInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedLogo(URL.createObjectURL(file));
                setSelectedLogoFile(file);
              }
            }}
          />
          <button
            className="cursor-pointer opacity-100 hover:opacity-80 bg-white"
            type="button"
            onClick={() => {
              document.getElementById("logoInput").click();
            }}
          >
            {selectedLogo ? (
              <img
                src={selectedLogo}
                alt="Logo Preview"
                className="logo-preview"
              />
            ) : (
              <i
                className="fa-solid fa-upload text-[3cm] flex justify-center items-center m-[20px]"
                style={{ color: "#000000ff" }}
              ></i>
            )}
          </button>
          <img src={home?.home?.logo} alt="currentLogo" width={`250px`} />
        </div>
        {selectedLogo ? (
          <button
            type="button"
            onClick={uploadLogo}
            className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer text-lg mt-[1cm] ml-[40%] opacity-100 active:scale-[0.999]"
          >
            Confirm Changes
          </button>
        ) : (
          <></>
        )}
      </RevealSection>
    </div>
  );
}
