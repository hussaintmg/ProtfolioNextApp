"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useMainData } from "@/app/context/MainDataContext";

export default function VideosEdit({ videos = [], id }) {
  const { getData } = useMainData();

  const [videoList, setVideoList] = useState(videos || []);
  const [editVid, setEditVid] = useState(Array(videos.length).fill(null));
  const [editVidFile, setEditVidFile] = useState(
    Array(videos.length).fill(null)
  );
  const [newVid, setNewVid] = useState([]);
  const [newVidFile, setNewVidFile] = useState([]);

  useEffect(() => {
    setVideoList(videos || []);
    setEditVid(Array(videos.length).fill(null));
    setEditVidFile(Array(videos.length).fill(null));
  }, [videos]);

  // Add new videos
  const handleAddVideos = (files) => {
    const fileArray = Array.from(files);
    const filteredFiles = fileArray.filter(
      (file) =>
        !newVidFile.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        )
    );

    if (filteredFiles.length === 0) return;

    const previewArray = filteredFiles.map((file) => URL.createObjectURL(file));
    setNewVidFile((prev) => [...prev, ...filteredFiles]);
    setNewVid((prev) => [...prev, ...previewArray]);
  };

  const handleRemoveNewVideo = (index) => {
    URL.revokeObjectURL(newVid[index]);
    setNewVid((prev) => prev.filter((_, i) => i !== index));
    setNewVidFile((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload new videos
  const handleUploadNewVideos = async () => {
    if (newVidFile.length === 0)
      return toast.error("Please select videos first.");

    const formData = new FormData();
    formData.append("projectId", id);
    newVidFile.forEach((file) => formData.append("videos", file));

    try {
      await axios.post(`/api/data/Projects/add-videos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Videos uploaded successfully!");
      setNewVid([]);
      setNewVidFile([]);
      getData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload videos.");
    }
  };

  // Delete existing video
  const removeCurrentVideo = async (vidIndex) => {
    try {
      await axios.delete(`/api/data/Projects/delete-video/${id}/${vidIndex}`);
      toast.success("Video deleted successfully!");
      getData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete video.");
    }
  };

  // Select new video file for an existing video
  const handleFileChange = (file, index) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);

    setEditVid((prev) => {
      const copy = [...prev];
      copy[index] = preview;
      return copy;
    });

    setEditVidFile((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  };

  // Update specific video
  const updateExistingVideo = async (vidIndex) => {
    if (!editVidFile[vidIndex])
      return toast.error("Please select a video first");

    const formData = new FormData();
    formData.append("projectId", id);
    formData.append("index", vidIndex);
    formData.append("video", editVidFile[vidIndex]);

    try {
      await axios.post(`/api/data/Projects/update-video`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Video updated successfully!");
      setEditVid((prev) => {
        const copy = [...prev];
        copy[vidIndex] = null;
        return copy;
      });
      setEditVidFile((prev) => {
        const copy = [...prev];
        copy[vidIndex] = null;
        return copy;
      });
      getData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update video.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner">
      <fieldset className="p-6 border border-gray-300 rounded-lg">
        <h3 className="font-bold text-xl text-center text-gray-800">Videos</h3>
        <hr className="my-3 w-2/5 border-t-2 border-gray-400 mx-auto" />

        <table className="w-full border-collapse mb-4 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-500 bg-gray-600 p-3 text-left text-lg text-gray-200">
                Preview / Change / Update
              </th>
              <th className="border border-gray-500 bg-gray-600 p-3 text-left text-lg text-gray-200">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {videoList.map((vid, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="text-center border border-gray-300">
                  <div className="flex items-center justify-between p-3 w-full">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() =>
                          document.getElementById(`vid-${i}`).click()
                        }
                        className="w-[120px] h-[80px] border border-gray-300 rounded-lg overflow-hidden bg-gray-100 cursor-pointer transition duration-200 hover:scale-[1.05] flex items-center justify-center"
                      >
                        <video
                          src={editVid[i] || vid}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </button>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() =>
                            document.getElementById(`vid-${i}`).click()
                          }
                          className="bg-yellow-500 text-white py-1.5 px-3.5 rounded-lg text-sm font-medium cursor-pointer transition duration-200 hover:bg-yellow-600 shadow-md hover:shadow-lg"
                        >
                          Change
                        </button>

                        {editVid[i] && (
                          <button
                            className="bg-green-500 text-white py-1.5 px-3.5 rounded-lg text-sm font-medium cursor-pointer transition duration-200 hover:bg-green-600 shadow-md hover:shadow-lg"
                            onClick={() => updateExistingVideo(i)}
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="file"
                      className="hidden"
                      id={`vid-${i}`}
                      accept="video/*"
                      onChange={(e) => handleFileChange(e.target.files[0], i)}
                    />
                  </div>
                </td>

                <td className="text-center border border-gray-300">
                  <button
                    className="bg-red-500 text-white py-1.5 px-3.5 rounded-lg text-sm font-medium cursor-pointer transition duration-200 hover:bg-red-600 shadow-md hover:shadow-lg"
                    onClick={() => removeCurrentVideo(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="my-6 border-t-2 border-gray-400" />

        {/* Add New Videos */}
        <input
          id="add-videos"
          type="file"
          multiple
          accept="video/*"
          className="hidden"
          onChange={(e) => handleAddVideos(e.target.files)}
        />

        <div className="flex gap-4 flex-wrap mb-4">
          {newVid.map((vid, index) => (
            <div className="relative group" key={index}>
              <video
                src={vid}
                className="w-[120px] h-[80px] object-cover border-2 border-gray-400 rounded-md shadow-sm"
                controls
              />
              <button
                className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-lg font-bold w-6 h-6 rounded-full cursor-pointer opacity-0 transition duration-300 flex items-center justify-center p-0.5 transform scale-0 group-hover:opacity-100 group-hover:scale-100"
                onClick={() => handleRemoveNewVideo(index)}
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            className="p-4 border-2 border-gray-400 bg-gray-50 rounded-lg text-base font-medium cursor-pointer transition duration-200 w-[80px] h-[80px] hover:bg-gray-200 flex items-center justify-center shadow-md"
            onClick={() => document.getElementById("add-videos").click()}
          >
            <i className="fa-solid fa-upload text-4xl text-gray-700"></i>
          </button>
        </div>

        {newVid.length > 0 && (
          <button
            type="button"
            className="bg-purple-600 text-white py-2.5 px-5 rounded-lg text-base font-medium cursor-pointer transition duration-200 hover:bg-purple-700 shadow-lg hover:shadow-xl mt-4"
            onClick={handleUploadNewVideos}
          >
            Upload Videos
          </button>
        )}
      </fieldset>
    </div>
  );
}
