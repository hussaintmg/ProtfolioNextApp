"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function FOEdit() {
  const { home, getData } = useMainData();

  const [FOI, setFOI] = useState("");
  const [FOL, setFOL] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editFOI, setEditFOI] = useState("");
  const [editFOL, setEditFOL] = useState("");

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditFOI(home?.home?.FO[index].FOI);
    setEditFOL(home?.home?.FO[index].FOL);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditFOI("");
    setEditFOL("");
  };

  const handleDelete = async (index) => {
    try {
      const res = await axios.post(
        `/api/data/Home/FO-del`,
        { index },
        { headers: { "Content-Type": "application/json" } }
      );
      getData();
      toast.success(res.data.message || "Item Deleted!");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete");
    }
  };

  const handleDone = async (index) => {
    try {
      const res = await axios.post(
        `/api/data/Home/FO-update`,
        { index, FOI: editFOI, FOL: editFOL },
        { headers: { "Content-Type": "application/json" } }
      );
      setEditIndex(null);
      getData();
      toast.success(res.data.message || "Item Updated!");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update");
    }
  };

  const uploadNew = async () => {
    if (!FOI) return toast.error("Please enter Title!");
    if (!FOL) return toast.error("Please enter Link!");

    try {
      const res = await axios.post(
        `/api/data/Home/FO-upload`,
        { FOI, FOL },
        { headers: { "Content-Type": "application/json" } }
      );
      getData();
      setFOI("");
      setFOL("");
      toast.success("Text uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload text");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-center text-cornflowerblue text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        Freelance On
      </h2>

      {/* Table Section */}
      {home?.home?.FO && home?.home?.FO.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-center bg-white border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#07628dff] text-white text-sm sm:text-base md:text-lg">
                <th className="px-2 sm:px-4 py-2 border border-black">Title</th>
                <th className="px-2 sm:px-4 py-2 border border-black">Link</th>
                <th className="px-2 sm:px-4 py-2 border border-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {home?.home?.FO.map((item, index) => (
                <tr
                  key={index}
                  className={`text-black text-sm sm:text-base md:text-lg ${
                    index % 2 === 0 ? "bg-[#e8f4fd]" : "bg-white"
                  } hover:bg-[#d4ecff] transition-all`}
                >
                  {editIndex === index ? (
                    <>
                      <td className="border border-black p-2">
                        <input
                          type="text"
                          value={editFOI}
                          onChange={(e) => setEditFOI(e.target.value)}
                          placeholder="Title"
                          className="w-full border rounded-md px-2 py-1 text-sm sm:text-base"
                        />
                      </td>
                      <td className="border border-black p-2">
                        <input
                          type="text"
                          value={editFOL}
                          onChange={(e) => setEditFOL(e.target.value)}
                          placeholder="Link"
                          className="w-full border rounded-md px-2 py-1 text-sm sm:text-base"
                        />
                      </td>
                      <td className="border border-black p-2 flex flex-col sm:flex-row justify-center items-center gap-2">
                        <button
                          onClick={() => handleDone(index)}
                          className="px-3 sm:px-4 py-1 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700"
                        >
                          Done
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 sm:px-4 py-1 rounded-md text-white font-semibold bg-orange-500 hover:bg-orange-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-black p-2 font-semibold">{item.FOI}</td>
                      <td className="border border-black p-2 font-semibold">{item.FOL}</td>
                      <td className="border border-black p-2 flex flex-col sm:flex-row justify-center items-center gap-2">
                        <button
                          className="px-3 sm:px-4 py-1 rounded-md font-semibold bg-yellow-400 hover:bg-yellow-500"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 sm:px-4 py-1 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(index)}
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
        </div>
      ) : (
        <p className="text-center text-red-600 text-lg sm:text-xl font-bold">
          No Freelance Links Available
        </p>
      )}

      {/* Upload New Item */}
      <div className="flex flex-col sm:flex-row justify-center items-start gap-4 sm:gap-6 mt-8">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-3/4">
          <input
            type="text"
            value={FOI}
            onChange={(e) => setFOI(e.target.value)}
            placeholder="Title"
            className="border rounded-md px-3 py-2 text-sm sm:text-base w-full"
          />
          <input
            type="text"
            value={FOL}
            onChange={(e) => setFOL(e.target.value)}
            placeholder="Link"
            className="border rounded-md px-3 py-2 text-sm sm:text-base w-full"
          />
        </div>
        <button
          onClick={uploadNew}
          className="text-white border border-[#00f2ea] px-4 sm:px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out w-full sm:w-auto"
        >
          Upload Item
        </button>
      </div>
    </div>
  );
}
