"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useMainData } from "@/app/context/MainDataContext";

export default function SocialMediaAdmin({ activeTab1 }) {
  const { home, getData } = useMainData();

  const [newData, setNewData] = useState({
    title: "",
    link: "",
    icon: null,
    colour: "",
    shape: "",
  });
  const [newPreview, setNewPreview] = useState(null);

  const [editIndex, setEditIndex] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editRow, setEditRow] = useState({});

  const handleUpload = async () => {
    if (
      !newData.title ||
      !newData.link ||
      !newData.icon ||
      !newData.colour ||
      !newData.shape
    ) {
      return toast.error("Please fill all fields");
    }
    try {
      const formData = new FormData();
      for (const key in newData) formData.append(key, newData[key]);
      await axios.post(`/api/data/Home/social-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getData();
      setNewData({ title: "", link: "", icon: null, colour: "", shape: "" });
      setNewPreview(null);
      toast.success("Uploaded successfully");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`/api/data/Home/social-delete/${index}`);
      getData();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditRow(home?.home?.socials[index]);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditRow({});
    setEditPreview(null);
  };

  const handleDone = async (index) => {
    try {
      const formData = new FormData();
      formData.append("title", editRow.title);
      formData.append("link", editRow.link);
      if (editRow.icon instanceof File) formData.append("icon", editRow.icon);
      formData.append("colour", editRow.colour);
      formData.append("shape", editRow.shape);
      await axios.put(`/api/data/Home/social-update/${index}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getData();
      setEditIndex(null);
      setEditPreview(null);
      toast.success("Updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="w-full py-[1cm] text-center">
      {" "}
      <h2 className="text-white font-bold text-2xl mb-4">Social Media Links</h2>
      {home?.home?.socials?.length === 0 ? (
        <p className="text-red-600 text-2xl font-semibold">No data available</p>
      ) : (
        <table className="w-[80%] text-center my-[1cm] mx-auto bg-white text-[1.2rem] border-collapse border border-gray-400">
          <thead>
            <tr className="bg-[#07628dff] text-[1.3rem] text-white">
              {["Title", "Link", "Icon", "Colour", "Shape", "Actions"].map(
                (h, i) => (
                  <th key={i} className="py-[0.3cm] border border-black">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {home?.home?.socials.map((item, index) => (
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
                        value={editRow.title || ""}
                        onChange={(e) =>
                          setEditRow({ ...editRow, title: e.target.value })
                        }
                        className="w-[80%] p-[0.2cm] text-[1rem] rounded-md border border-gray-400"
                      />
                    </td>
                    <td className="border border-black p-2">
                      <input
                        type="text"
                        value={editRow.link || ""}
                        onChange={(e) =>
                          setEditRow({ ...editRow, link: e.target.value })
                        }
                        className="w-[80%] p-[0.2cm] text-[1rem] rounded-md border border-gray-400"
                      />
                    </td>
                    <td className="border border-black p-2">
                      <div className="flex flex-col items-center">
                        <input
                          type="file"
                          id={`editIcon-${index}`}
                          className="hidden"
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
                          className="cursor-pointer"
                          onClick={() =>
                            document.getElementById(`editIcon-${index}`).click()
                          }
                        >
                          <img
                            src={editPreview || item.icon}
                            alt="Preview"
                            className="w-[70px] h-[70px] object-contain rounded"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="border border-black p-2">
                      <input
                        type="text"
                        value={editRow.colour || ""}
                        onChange={(e) =>
                          setEditRow({ ...editRow, colour: e.target.value })
                        }
                        className="w-[80%] p-[0.2cm] text-[1rem] rounded-md border border-gray-400"
                      />
                    </td>
                    <td className="border border-black p-2">
                      <input
                        type="text"
                        value={editRow.shape || ""}
                        onChange={(e) =>
                          setEditRow({ ...editRow, shape: e.target.value })
                        }
                        className="w-[80%] p-[0.2cm] text-[1rem] rounded-md border border-gray-400"
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
                    <td className="border border-black p-2">{item.title}</td>
                    <td className="border border-black p-2">{item.link}</td>
                    <td className="border border-black p-2">
                      <img
                        src={item.icon}
                        alt="icon"
                        className="w-[70px] h-[70px] object-contain mx-auto"
                      />
                    </td>
                    <td
                      className="border border-black p-2"
                      style={{ background: item.colour }}
                    >
                      {item.colour}
                    </td>
                    <td className="border border-black p-2">{item.shape}</td>
                    <td className="border border-black p-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold bg-yellow-400 hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="cursor-pointer px-4 py-1 mx-1 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700"
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
      )}
      {/* Add New Item */}
      <div className="w-full flex flex-col items-center mt-8">
        <input
          type="text"
          placeholder="Title"
          className="w-4/5 h-10 mb-3 px-3 border rounded text-lg"
          value={newData.title}
          onChange={(e) => setNewData({ ...newData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Link"
          className="w-4/5 h-10 mb-3 px-3 border rounded text-lg"
          value={newData.link}
          onChange={(e) => setNewData({ ...newData, link: e.target.value })}
        />
        <div className="flex flex-col items-center my-3">
          <label className="text-white font-semibold mb-2">Icon</label>
          <input
            type="file"
            id="newIconInput"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setNewPreview(URL.createObjectURL(file));
                setNewData({ ...newData, icon: file });
              }
            }}
          />
          <button
            type="button"
            className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-3 rounded cursor-pointer"
            onClick={() => document.getElementById("newIconInput").click()}
          >
            {newPreview ? (
              <img
                src={newPreview}
                alt="Preview"
                className="w-[100px] h-[100px] object-contain"
              />
            ) : (
              <i className="fa-solid fa-upload"></i>
            )}
          </button>
        </div>
        <input
          type="text"
          placeholder="Colour"
          className="w-4/5 h-10 mb-3 px-3 border rounded text-lg"
          value={newData.colour}
          onChange={(e) => setNewData({ ...newData, colour: e.target.value })}
        />
        <input
          type="text"
          placeholder="Shape"
          className="w-4/5 h-10 mb-3 px-3 border rounded text-lg"
          value={newData.shape}
          onChange={(e) => setNewData({ ...newData, shape: e.target.value })}
        />
        <button
          onClick={handleUpload}
          className="text-white border border-[#00f2ea] px-6 py-2 mt-4 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
        >
          Upload Item
        </button>
      </div>
    </div>
  );
}
