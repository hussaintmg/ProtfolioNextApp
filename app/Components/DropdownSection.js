import React, { useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";

import { useMainData } from "@/app/context/MainDataContext";

import TitleEdit from "./TitleEdit";
import LinkEdit from "./LinkEdit.js";
import ImagesEdit from "./ImagesEdit";
import VideosEdit from "./VideosEdit";

export default function DropdownSection({ project }) {
  const { getData } = useMainData();

  const [open, setOpen] = useState(false);

  const delProject = async (id) => {
    try {
      await axios.delete(`/api/data/Projects/delete/${id}`);
      toast.success("Project deleted successfully!");
      getData();
    } catch (err) {
      toast.error("Delete error:", err);
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="rounded-lg mx-[5%] text-black mb-4 shadow-lg shadow-[rgba(32,211,167,0.715)] bg-gray-200 overflow-hidden">
      {/* Dropdown Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full h-[1.5cm] rounded-lg text-2xl text-left font-semibold bg-gray-200 cursor-pointer transition-colors duration-200 flex justify-between items-center px-[0.6cm] py-[0.75rem]`}
      >
        <span>{project.title}</span>
        <i
          className={`fa-solid fa-caret-down transition-transform duration-300 ease-in-out ${
            open ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {/* Dropdown Body */}
      {open && (
        <div className="p-[1rem] bg-white ">
          <div className="mb-[1.5rem]">
            <TitleEdit title={project.title} id={project._id} />
          </div>
          <div className="mb-[1.5rem]">
            <LinkEdit link={project.link} id={project._id} />
          </div>
          <div className="mb-[1.5rem]">
            <ImagesEdit images={project.images} id={project._id}/>
          </div>
          <div className="mb-[1.5rem]">
            <VideosEdit videos={project.videos} id={project._id} />
          </div>
          <button
            type="button"
            className="bg-red-500 py-[0.2cm] rounded-md text-2xl font-bold cursor-pointer w-2/5 mx-[30%] text-white hover:bg-red-700"
            onClick={() => delProject(project._id)}
          >
            Delete Project
          </button>
        </div>
      )}
    </div>
  );
}
