"use client";

import React, { useState } from "react";
import RevealSection from "@/app/Components/RevealSection";
import { toast } from "react-toastify";
import axios from "axios";
import { useMainData } from "@/app/context/MainDataContext";

export default function SkillsIcons() {
  const { skills, getData } = useMainData();

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedIconFile, setSelectedIconFile] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editRow, setEditRow] = useState({});

  const uploadIcon = async () => {
    if (!selectedIconFile) return toast.error("Please select an icon first!");
    const formData = new FormData();
    formData.append("icon", selectedIconFile);

    try {
      await axios.post(`/api/data/Skills/icon-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedIcon(null);
      setSelectedIconFile(null);
      getData();
      toast.success("Icon uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload icon");
    }
  };

  const deleteIcon = async (index) => {
    try {
      await axios.delete(`/api/data/Skills/icon-delete`, {
        data: { index },
      });
      getData();
      toast.success("Icon deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete icon");
    }
  };

  const handleEdit = (index) => setEditIndex(index);

  const handleCancel = () => {
    setEditIndex(null);
    setEditRow({});
    setEditPreview(null);
  };

  const handleDone = async (index) => {
    try {
      const formData = new FormData();
      if (editRow.icon instanceof File) formData.append("icon", editRow.icon);

      await axios.put(`/api/data/Skills/icon-update/${index}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditIndex(null);
      setEditPreview(null);
      getData();
      toast.success("Updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="w-full">
      <RevealSection trigger="load">
        {skills?.skills?.skIcons.length > 0 ? (
          <table className="w-[80%] text-center my-[1cm] mx-auto bg-white text-[1.2rem] border-collapse border border-gray-400">
            <thead>
              <tr className="bg-[#07628dff] text-[1.3rem] text-white">
                <th className="w-[50%] py-[0.3cm] border border-black">Icon</th>
                <th className="w-[50%] py-[0.3cm] border border-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {skills?.skills?.skIcons.map((icon, index) => (
                <tr
                  key={index}
                  className={`text-black ${
                    index % 2 === 0 ? "bg-[#e8f4fd]" : "bg-white"
                  } hover:bg-[#d4ecff] transition-all`}
                >
                  {editIndex === index ? (
                    <>
                      <td className="border border-black p-2">
                        <div className="flex justify-center">
                          <input
                            type="file"
                            id={`editIcon-${index}`}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setEditPreview(URL.createObjectURL(file));
                                setEditRow({ ...editRow, icon: file });
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              document
                                .getElementById(`editIcon-${index}`)
                                .click()
                            }
                            className="cursor-pointer border border-gray-400 bg-white rounded-md p-2 hover:bg-gray-100 transition-all"
                          >
                            <img
                              src={editPreview || icon.url}
                              alt="Preview"
                              width="70"
                              height="70"
                              className="rounded-md"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="border border-black p-2">
                        <button
                          onClick={() => handleDone(index)}
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 transition-all"
                        >
                          Done
                        </button>
                        <button
                          onClick={handleCancel}
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md text-white font-semibold bg-orange-500 hover:bg-orange-600 transition-all"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-black p-2">
                        <div className="w-full h-full flex justify-center items-center">
                          <img
                            src={icon.url}
                            alt="Skill Icon"
                            className="max-w-full max-h-[70px] sm:max-h-[100px] object-contain"
                          />
                        </div>
                      </td>

                      <td className="border border-black p-2">
                        <button
                          type="button"
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold bg-yellow-400 hover:bg-yellow-500 transition-all"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-all"
                          onClick={() => deleteIcon(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-red-600 text-[1.5rem] font-bold mt-[1cm]">
            No Icon Available
          </p>
        )}

        {/* Upload New Icon */}
        <div className="flex justify-around items-center mt-[1cm]">
          <div className="flex flex-col items-center">
            <input
              type="file"
              id="sk-icon"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedIcon(URL.createObjectURL(file));
                  setSelectedIconFile(file);
                }
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById("sk-icon").click()}
              className="cursor-pointer border border-gray-400 bg-white rounded-md p-3 hover:bg-gray-100 transition-all"
            >
              {selectedIcon ? (
                <img
                  src={selectedIcon}
                  alt="Preview"
                  className="w-[100px] h-[100px] object-contain rounded-md"
                />
              ) : (
                <i className="fa-solid fa-upload text-[2cm] text-black" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={uploadIcon}
            className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
          >
            Upload Icon
          </button>
        </div>
      </RevealSection>
    </div>
  );
}
