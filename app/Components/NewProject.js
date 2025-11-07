"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { useMainData } from "@/app/context/MainDataContext";

export default function NewProject() {
  const { getData } = useMainData();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const [newImg, setNewImg] = useState([]);
  const [newImgFile, setNewImgfile] = useState([]);

  const [newVideo, setNewVideo] = useState([]);
  const [newVideoFile, setNewVideoFile] = useState([]);

  // ------------------ IMAGE HANDLERS ------------------
  const handleAddImages = (files) => {
    const fileArray = Array.from(files);

    const filteredFiles = fileArray.filter(
      (file) =>
        !newImgFile.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        )
    );

    if (filteredFiles.length === 0) return;

    const previewArray = filteredFiles.map((file) => URL.createObjectURL(file));

    setNewImgfile((prev) => [...prev, ...filteredFiles]);
    setNewImg((prev) => [...prev, ...previewArray]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImg((prev) => prev.filter((_, i) => i !== index));
    setNewImgfile((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------ VIDEO HANDLERS ------------------
  const handleAddVideos = (files) => {
    const fileArray = Array.from(files);

    const filteredFiles = fileArray.filter(
      (file) =>
        !newVideoFile.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        )
    );

    if (filteredFiles.length === 0) return;

    const previewArray = filteredFiles.map((file) => URL.createObjectURL(file));

    setNewVideoFile((prev) => [...prev, ...filteredFiles]);
    setNewVideo((prev) => [...prev, ...previewArray]);
  };

  const handleRemoveNewVideo = (index) => {
    setNewVideo((prev) => prev.filter((_, i) => i !== index));
    setNewVideoFile((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------ UPLOAD PROJECT ------------------
  const uploadProject = async () => {
    if (!title) return toast.error("Please Enter Some Title!");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("link", link);

      newImgFile.forEach((file) => {
        formData.append("images[]", file);
      });

      newVideoFile.forEach((file) => {
        formData.append("videos[]", file);
      });

      if (newImgFile.length === 0) {
        formData.append("images[]", "");
      }
      if (newVideoFile.length === 0) {
        formData.append("videos[]", "");
      }

      const res = await axios.post(
        `/api/data/Projects/new-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Project uploaded successfully!");

      setTitle("");
      setLink("")
      setNewImg([]);
      setNewImgfile([]);
      setNewVideo([]);
      setNewVideoFile([]);
      getData();
    } catch (err) {
      console.error(err);
      toast.error("Error uploading project!");
    }
  };

  return (
    <div className="mx-[5%] my-[0.5cm]">
      <h2 className="mx-[5%] my-[0.3cm] text-[1.5rem] font-bold text-[#7497faff]">
        Upload New
      </h2>
      <input
        type="text"
        name="title"
        required
        className="w-[90%] h-[1cm] rounded-[5px] text-lg px-[0.5cm] my-[0.5cm] border border-[2px]"
        id="title"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        type="text"
        name="link"
        required
        id="link"
        className="w-[90%] h-[1cm] rounded-[5px] text-lg px-[0.5cm] my-[0.5cm] border border-[2px]"
        placeholder="link"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
        }}
      />

      {/* ---------- IMAGES ---------- */}
      <fieldset className="pl-[0.4cm] my-[0.5cm] border">
        <legend className="text-white text-[1.5rem] font-bold ml-[0.6cm]">
          Images
        </legend>
        <input
          type="file"
          name="images"
          id="images"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleAddImages(e.target.files)}
        />
        <div className="flex gap-[10px] flex-wrap">
          {newImg.map((img, index) => (
            <div className="relative inline-block group" key={index}>
              <img
                src={img}
                alt={`new-${index}`}
                className="bg-[rgba(255,255,255,0.338)] w-[100px] h-[100px] object-cover border-2 border-[#ccc] rounded-[5px]"
              />
              <button
                className="absolute top-[5px] left-[75px] bg-[rgba(255,0,0,0.8)] text-white text-[16px] font-bold rounded-full px-[6px] border-none cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300"
                onClick={() => handleRemoveNewImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center p-[0.6cm]">
          <button
            type="button"
            className="w-[100px] h-[100px] px-[1.2rem] py-[0.6rem] rounded-[0.5rem] text-[0.9rem] font-medium cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#b8b6bc] bg-white flex items-center justify-center"
            onClick={() => document.getElementById("images").click()}
          >
            <i
              className="fa-solid fa-upload text-[50px]"
              style={{ color: "#000000ff" }}
            ></i>
          </button>
        </div>
      </fieldset>

      {/* ---------- VIDEOS ---------- */}
      <fieldset className="pl-[0.4cm] my-[0.5cm] border">
        <legend className="text-white text-[1.5rem] font-bold ml-[0.6cm]">
          Videos
        </legend>
        <input
          type="file"
          name="videos"
          id="videos"
          multiple
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e) => handleAddVideos(e.target.files)}
        />
        <div className="flex gap-[10px] flex-wrap">
          {newVideo.map((video, index) => (
            <div className="relative inline-block group" key={index}>
              <video
                src={video}
                width="150"
                className="bg-[rgba(255,255,255,0.338)] w-[100px] h-[100px] object-cover border-2 border-[#ccc] rounded-[5px]"
              />
              <button
                className="absolute top-[5px] left-[75px] bg-[rgba(255,0,0,0.8)] text-white text-[16px] font-bold rounded-full px-[6px] border-none cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300"
                onClick={() => handleRemoveNewVideo(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center p-[0.6cm]">
          <button
            type="button"
            className="w-[100px] h-[100px] px-[1.2rem] py-[0.6rem] rounded-[0.5rem] text-[0.9rem] font-medium cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#b8b6bc] bg-white flex items-center justify-center"
            onClick={() => document.getElementById("videos").click()}
          >
            <i
              className="fa-solid fa-upload text-[50px]"
              style={{ color: "#000000ff" }}
            ></i>
          </button>
        </div>
      </fieldset>

      {/* ---------- UPLOAD BUTTON ---------- */}
      {title !== "" && link !== "" && (
        <button
          type="button"
              className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer text-lg mt-[1cm] ml-[40%] opacity-100 active:scale-[0.999]"
          onClick={uploadProject}
        >
          Upload Project
        </button>
      )}
    </div>
  );
}
