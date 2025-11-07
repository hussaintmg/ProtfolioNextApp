"use client";

import React, { useState, Suspense } from "react";
import RevealSection from "../Components/RevealSection";
import { toast } from "react-toastify";
import axios from "axios";
import { useMainData } from "@/app/context/MainDataContext";
import DynamicFaIcon from './DynamicFaIcon'

export default function ServicesEdit() {
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newIcon, setNewIcon] = useState("");

  const { skills, getData } = useMainData();

  // --- CRUD OPERATIONS ---
  const uploadService = async () => {
    if (!newTitle || !newIcon) return toast.error("Please fill all fields");

    try {
      await axios.post(`/api/data/Skills/service-upload`, {
        title: newTitle,
        icon: newIcon,
      });
      toast.success("Service uploaded successfully!");
      setNewTitle("");
      setNewIcon("");
      getData();
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload service");
    }
  };

  const deleteService = async (index) => {
    try {
      await axios.delete(`/api/data/Skills/service-delete`, {
        data: { index },
      });
      toast.success("Service deleted successfully!");
      getData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete service");
    }
  };

  const handleEdit = (index, service) => {
    setEditIndex(index);
    setEditTitle(service.title);
    setEditIcon(service.icon);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditTitle("");
    setEditIcon("");
  };

  const handleDone = async (index) => {
    if (!editTitle || !editIcon) return toast.error("Please enter all values");

    try {
      await axios.put(`/api/data/Skills/service-update/${index}`, {
        title: editTitle,
        icon: editIcon,
      });
      toast.success("Service updated successfully!");
      getData();
      handleCancel();
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Update failed");
    }
  };

  // --- RENDER ---
  return (
    <div className="w-[90%] mx-auto my-[1cm]">
      <h2 className="text-center text-[cornflowerblue] my-[0.5cm] text-3xl font-bold">
        Services Section
      </h2>

      <RevealSection trigger="scroll">
        {skills?.skills?.services?.length > 0 ? (
          <table className="w-[90%] text-center my-[1cm] mx-auto bg-white text-[1.2rem] border-collapse border border-gray-400">
            <thead>
              <tr className="bg-[#07628dff] text-[1.3rem] text-white">
                <th className="w-[33%] py-[0.3cm] border border-black">
                  Title
                </th>
                <th className="w-[33%] py-[0.3cm] border border-black">Icon</th>
                <th className="w-[33%] py-[0.3cm] border border-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {skills.skills.services.map((service, index) => (
                <tr
                  key={index}
                  className={`text-black ${
                    index % 2 === 0 ? "bg-[#e8f4fd]" : "bg-white"
                  } hover:bg-[#d4ecff] transition-all`}
                >
                  {editIndex === index ? (
                    <>
                      <td className="border border-black p-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Service Title"
                          className="w-[90%] border rounded-md px-3 py-1 text-[1.2rem]"
                        />
                      </td>
                      <td className="border border-black p-2">
                        <input
                          type="text"
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                          placeholder="Icon name (e.g. FaCode)"
                          className="w-[90%] border rounded-md px-3 py-1 text-[1.2rem]"
                        />
                      </td>
                      <td className="border border-black p-2">
                        <button
                          onClick={() => handleDone(index)}
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700"
                        >
                          Done
                        </button>
                        <button
                          onClick={handleCancel}
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md text-white font-semibold bg-orange-500 hover:bg-orange-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-black p-2 font-semibold text-[1.2rem]">
                        {service.title}
                      </td>
                      <td className="border border-black p-2">
                        <div className="flex justify-center items-center gap-3">
                          <DynamicFaIcon iconName={service.icon} size={30} />
                          <span className="text-gray-600 text-sm">
                            {service.icon}
                          </span>
                        </div>
                      </td>
                      <td className="border border-black p-2">
                        <button
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold bg-yellow-400 hover:bg-yellow-500"
                          onClick={() => handleEdit(index, service)}
                        >
                          Edit
                        </button>
                        <button
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700"
                          onClick={() => deleteService(index)}
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
          <p className="text-center text-red-600 text-[1.5rem] font-bold">
            No Service Available
          </p>
        )}

        {/* New Service Upload */}
        <div className="flex justify-center items-start gap-10 mt-10">
          <div className="flex flex-col w-[50%]">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Service Title"
              className="border rounded-md px-4 py-2 mb-3 text-[1.2rem]"
            />
            <input
              type="text"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="Icon Name (e.g. FaCode)"
              className="border rounded-md px-4 py-2 text-[1.2rem]"
            />
          </div>
          <button
            className="text-white ml-[5%] border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
            onClick={uploadService}
          >
            Upload Service
          </button>
        </div>
      </RevealSection>
    </div>
  );
}
