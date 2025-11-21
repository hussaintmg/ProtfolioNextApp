"use client";

import React, { useState } from "react";
import RevealSection from "./RevealSection";
import { toast } from "react-toastify";
import axios from "axios";
import { useMainData } from "@/app/context/MainDataContext";

export default function SkillsList() {
  const [editIndex, setEditIndex] = useState(null);
  const [editHeading, setEditHeading] = useState(null);
  const [editList, setEditList] = useState(null);
  const [newHeading, setnewHeading] = useState("");
  const [newList, setnewList] = useState("");

  const { skills, getData } = useMainData();

  const uploadList = async () => {
    if (!newHeading || !newList) return toast.error("Please Fill All Fields");

    const formData = new FormData();
    formData.append("heading", newHeading);
    formData.append("list", newList);

    try {
      await axios.post(`/api/data/Skills/skList-upload`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      getData();
      setnewHeading("");
      setnewList("");
      toast.success("Item uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload Item");
    }
  };

  const deleteList = async (index) => {
    try {
      await axios.delete(`/api/data/Skills/skList-delete`, { data: { index } });
      toast.success("Item deleted successfully!");
      getData();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = (index) => setEditIndex(index);
  const handleCancel = () => setEditIndex(null);

  const handleDone = async (index) => {
    try {
      if (!editHeading || !editList)
        return toast.error("Please Enter All Values to Update");
      if (
        editHeading === skills?.skills?.skList[index].heading &&
        editList === skills?.skills?.skList[index].list
      )
        return toast.error("All values are same as previous");

      await axios.put(
        `/api/data/Skills/skList-update/${index}`,
        { heading: editHeading, list: editList },
        { headers: { "Content-Type": "application/json" } }
      );
      getData();
      setEditIndex(null);
      setEditHeading(null);
      setEditList(null);
      toast.success("Updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="w-full">
      
      <RevealSection trigger="load">
        {skills?.skills?.skList.length > 0 ? (
          <table className="w-[90%] text-center my-[1cm] mx-auto bg-white text-[1.2rem] border-collapse border border-gray-400">
            
            <thead>
              
              <tr className="bg-[#07628dff] text-[1.3rem] text-white">
                
                <th className="w-[40%] py-[0.3cm] border border-black">
                  Heading
                </th>
                <th className="w-[40%] py-[0.3cm] border border-black">
                  Additional
                </th>
                <th className="w-[20%] py-[0.3cm] border border-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {skills?.skills?.skList.map((list, index) => (
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
                          value={editHeading}
                          onChange={(e) => setEditHeading(e.target.value)}
                          placeholder={list.heading}
                          className="border border-gray-400 rounded-md px-2 py-1 w-[90%] text-[1.2rem] font-semibold"
                        />
                      </td>
                      <td className="border border-black p-2">
                        <textarea
                          value={editList}
                          onChange={(e) => setEditList(e.target.value)}
                          placeholder={list.list}
                          className="border border-gray-400 rounded-md px-2 py-1 w-[90%] text-[1.1rem]"
                          rows={2}
                        />
                      </td>
                      <td className="border border-black p-2 align-middle text-center">
                        <div className="flex justify-center items-center gap-3 w-full h-full">
                          <button
                            onClick={() => handleDone(index)}
                            className="cursor-pointer px-4 py-1 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 transition-all"
                          >
                            Done
                          </button>
                          <button
                            onClick={handleCancel}
                            className="cursor-pointer px-4 py-1 rounded-md text-white font-semibold bg-orange-500 hover:bg-orange-600 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      
                      <td className="border border-black p-2 font-bold text-[1.4rem]">
                        {list.heading}
                      </td>
                      <td className="border border-black p-2">{list.list}</td>
                      <td className="border border-black p-2">
                        <button
                          type="button"
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold bg-yellow-400 hover:bg-yellow-500 transition-all"
                          onClick={() => {
                            handleEdit(index);
                            setEditHeading(list.heading);
                            setEditList(list.list);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-all"
                          onClick={() => deleteList(index)}
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
            No Item Available
          </p>
        )}

        {/* Upload Section */}
        <div className="flex justify-center items-center gap-[20%] mt-[1cm]">
          <div className="w-[50%] text-center">
            <input
              type="text"
              value={newHeading}
              onChange={(e) => setnewHeading(e.target.value)}
              name="heading"
              className="text-[1.5rem] w-full h-[40px] my-[1cm] px-[0.6cm] border border-gray-400 rounded-md font-semibold"
              placeholder="Heading"
            />
            <textarea
              name="list"
              rows={3}
              value={newList}
              onChange={(e) => setnewList(e.target.value)}
              placeholder="Additional"
              className="px-[0.6cm] w-full text-[1.5rem] border border-gray-400 rounded-md"
            />
          </div>
          <button
            type="button"
            onClick={uploadList}
            className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
          >
            Upload
          </button>
        </div>
      </RevealSection>
    </div>
  );
}
