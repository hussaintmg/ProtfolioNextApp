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
      return toast.error("Please select a Icon first!");

    const formData = new FormData();
    formData.append("PI", selectedPhoneIconFile);

    try {
      const res = await axios.post(`/api/data/Home/pi-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getData();
      setSelectedPhoneIcon(null)
      setSelectedPhoneIconFile(null)
      toast.success("Icon uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload Icon");
    }
  };

  return (
    <div>
      <div className="w-full flex justify-center items-center gap-[5cm] mt-[0.8cm]">
        <input
          type="file"
          id="PhoneIcon"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedPhoneIcon(URL.createObjectURL(file));
              setSelectedPhoneIconFile(file);
            }
          }}
        />
        <button
          type="button"
          className="cursor-pointer opacity-100 hover:opacity-80 bg-white"
          onClick={() => {
            document.getElementById("PhoneIcon").click();
          }}
        >
          {selectedPhoneIcon ? (
            <img
              src={selectedPhoneIcon}
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
        <img
          src={home?.home?.PhoneI}
          alt="currentLogo"
          style={{ background: "rgba(255, 255, 255, 0.4)" }}
        />
      </div>
      {selectedPhoneIcon ? (
        <button
          type="button"
          className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer text-lg mt-[1cm] ml-[40%] opacity-100 active:scale-[0.999]"
          onClick={uploadPhoneIcon}
        >
          Confirm Changes
        </button>
      ) : (
        <></>
      )}{" "}
    </div>
  );
}
