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
      const res = await axios.post(`/api/data/Home/prof-upload`, formData, {
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
    <>
      <h2 className="text-white pt-[0.5cm] pl-[10%] font-bold text-2xl ">
        Profile Picture
      </h2>
      <div className="w-full flex justify-center items-center gap-[5cm] mt-[0.8cm]">
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
        <button
          type="button"
          className="cursor-pointer opacity-100 hover:opacity-80 bg-white"
          onClick={() => {
            document.getElementById("profInput").click();
          }}
        >
          {selectedProf ? (
            <img
              src={selectedProf}
              alt="Profile Preview"
              className="Profle-preview"
            />
          ) : (
            <i
              className="fa-solid fa-upload text-[3cm] flex justify-center items-center m-[20px]"
              style={{ color: "#000000ff" }}
            ></i>
          )}
        </button>
        <img
          src={home?.home?.Profile}
          alt="currentProfile"
          style={{ background: "rgba(255, 255, 255, 0.4)" }}
        />
      </div>
      {selectedProf ? (
        <button
          type="button"
          className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer text-lg mt-[1cm] ml-[40%] opacity-100 active:scale-[0.999]"
          onClick={uploadProf}
        >
          Confirm Changes
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
