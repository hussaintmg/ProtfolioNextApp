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
    <div className="w-[90%] mx-auto my-[1cm]">
      {" "}
      <h2 className="text-center text-[cornflowerblue] my-[0.5cm] text-3xl font-bold">
        Freelance On{" "}
      </h2>
      {home?.home?.FO && home?.home?.FO.length > 0 ? (
        <table className="w-[90%] text-center my-[1cm] mx-auto bg-white text-[1.2rem] border-collapse border border-gray-400">
          {" "}
          <thead>
            {" "}
            <tr className="bg-[#07628dff] text-[1.3rem] text-white">
              {" "}
              <th className="w-[33%] py-[0.3cm] border border-black">
                Title
              </th>{" "}
              <th className="w-[33%] py-[0.3cm] border border-black">Link</th>{" "}
              <th className="w-[33%] py-[0.3cm] border border-black">
                Actions
              </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {home?.home?.FO.map((item, index) => (
              <tr
                key={index}
                className={`text-black ${
                  index % 2 === 0 ? "bg-[#e8f4fd]" : "bg-white"
                } hover:bg-[#d4ecff] transition-all`}
              >
                {editIndex === index ? (
                  <>
                    {" "}
                    <td className="border border-black p-2">
                      <input
                        type="text"
                        value={editFOI}
                        onChange={(e) => setEditFOI(e.target.value)}
                        placeholder="Title"
                        className="w-[90%] border rounded-md px-3 py-1 text-[1.2rem]"
                      />{" "}
                    </td>{" "}
                    <td className="border border-black p-2">
                      <input
                        type="text"
                        value={editFOL}
                        onChange={(e) => setEditFOL(e.target.value)}
                        placeholder="Link"
                        className="w-[90%] border rounded-md px-3 py-1 text-[1.2rem]"
                      />{" "}
                    </td>{" "}
                    <td className="border border-black p-2">
                      <button
                        onClick={() => handleDone(index)}
                        className="cursor-pointer px-4 py-1 mx-1 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700"
                      >
                        Done{" "}
                      </button>{" "}
                      <button
                        onClick={handleCancel}
                        className="cursor-pointer px-4 py-1 mx-1 rounded-md text-white font-semibold bg-orange-500 hover:bg-orange-600"
                      >
                        Cancel{" "}
                      </button>{" "}
                    </td>
                  </>
                ) : (
                  <>
                    {" "}
                    <td className="border border-black p-2 font-semibold text-[1.2rem]">
                      {item.FOI}{" "}
                    </td>{" "}
                    <td className="border border-black p-2 font-semibold text-[1.2rem]">
                      {item.FOL}{" "}
                    </td>{" "}
                    <td className="border border-black p-2">
                      <button
                        className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold bg-yellow-400 hover:bg-yellow-500"
                        onClick={() => handleEdit(index)}
                      >
                        Edit{" "}
                      </button>
                      <button
                        className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700"
                        onClick={() => handleDelete(index)}
                      >
                        Delete{" "}
                      </button>{" "}
                    </td>
                  </>
                )}{" "}
              </tr>
            ))}{" "}
          </tbody>{" "}
        </table>
      ) : (
        <p className="text-center text-red-600 text-[1.5rem] font-bold">
          No Freelance Links Available{" "}
        </p>
      )}
      <div className="flex justify-center items-start gap-10 mt-10">
        <div className="flex flex-col w-[50%]">
          <input
            type="text"
            value={FOI}
            onChange={(e) => setFOI(e.target.value)}
            placeholder="Title"
            className="border rounded-md px-4 py-2 mb-3 text-[1.2rem]"
          />
          <input
            type="text"
            value={FOL}
            onChange={(e) => setFOL(e.target.value)}
            placeholder="Link"
            className="border rounded-md px-4 py-2 text-[1.2rem]"
          />
        </div>
        <button
          onClick={uploadNew}
          className="text-white ml-[5%] border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
        >
          Upload Item
        </button>
      </div>
    </div>
  );
}
