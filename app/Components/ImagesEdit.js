"use client";

import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import axios from "axios";

import { useMainData } from "@/app/context/MainDataContext";

export default function ImagesEdit({ images, id }) {
  const { getData } = useMainData();

  const [imageList, setImageList] = useState(images || []);

  useEffect(() => {
    setImageList(images || []);
  }, [images]);

  const [editIcons, setEditIcons] = useState(Array(images.length).fill(null));
  const [editIconFiles, setEditIconFiles] = useState(
    Array(images.length).fill(null)
  );

  const [newImg, setNewImg] = useState([]);
  const [newImgFile, setNewImgfile] = useState([]);

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

  const handleFileChange = (file, index) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);

    setEditIcons((prev) => {
      const copy = [...prev];
      copy[index] = preview;
      return copy;
    });

    setEditIconFiles((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  };

  const handleUploadNewImages = async () => {
    if (newImgFile.length === 0)
      return toast.error("Please select images first");

    const formData = new FormData();
    formData.append("projectId", id);

    newImgFile.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post(`/api/data/Projects/add-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Images uploaded successfully!");

      setNewImg([]);
      setNewImgfile([]);

      getData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images");
    }
  };

  const removeCurrentImg = async (imgIndex) => {
    try {
      await axios.delete(`/api/data/Projects/delete-image/${id}/${imgIndex}`);

      toast.success("Image deleted successfully!");

      setEditIcons((prev) => prev.filter((_, i) => i !== imgIndex));
      setEditIconFiles((prev) => prev.filter((_, i) => i !== imgIndex));

      getData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    }
  };

  const updateExistingImg = async (imgIndex) => {
    if (!editIconFiles[imgIndex])
      return toast.error("Please select an image first");

    const formData = new FormData();
    formData.append("projectId", id);
    formData.append("index", imgIndex);
    formData.append("image", editIconFiles[imgIndex]);

    try {
      await axios.post(`/api/data/Projects/update-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Image updated successfully!");

      setEditIcons((prev) => {
        const copy = [...prev];
        copy[imgIndex] = null;
        return copy;
      });
      setEditIconFiles((prev) => {
        const copy = [...prev];
        copy[imgIndex] = null;
        return copy;
      });

      getData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update image");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner">
      <fieldset className="p-6 border border-gray-300 rounded-lg">
        <h3 className="font-bold text-xl text-center text-gray-800">Images</h3>
        <hr className="my-3 w-2/5 border-t-2 border-gray-400 mx-auto" />

        <table className="w-full border-collapse mb-4 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-500 bg-gray-600 p-3 text-left text-lg text-gray-200">
                Preview & Update
              </th>
              <th className="border border-gray-500 bg-gray-600 p-3 text-left text-lg text-gray-200">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {imageList.map((img, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="text-center border border-gray-300">
                  <div className="flex items-center justify-between p-3">
                    <button
                      onClick={() =>
                        document.getElementById(`img-${i}`).click()
                      }
                      className="w-[100px] h-[100px] border border-gray-300 rounded-lg overflow-hidden bg-gray-100 cursor-pointer transition duration-200 hover:scale-[1.05] flex items-center justify-center"
                    >
                      {editIcons[i] ? (
                        <img
                          src={editIcons[i]}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={img.icon}
                          alt="Current Image"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </button>
                    <input
                      type="file"
                      className="hidden"
                      name={`img-${i}`}
                      id={`img-${i}`}
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files[0], i)}
                    />

                    {editIcons[i] ? (
                      <button
                        className="bg-green-500 text-white py-1.5 px-3.5 rounded-lg text-sm font-medium cursor-pointer transition duration-200 hover:bg-green-600 shadow-md hover:shadow-lg"
                        onClick={() => updateExistingImg(i)}
                      >
                        Update
                      </button>
                    ) : null}
                  </div>
                </td>

                <td className="text-center border border-gray-300">
                  <button
                    className="bg-red-500 text-white py-1.5 px-3.5 rounded-lg text-sm font-medium cursor-pointer transition duration-200 hover:bg-red-600 shadow-md hover:shadow-lg"
                    onClick={() => removeCurrentImg(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="my-6 border-t-2 border-gray-400" />

        <input
          id="add-images"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleAddImages(e.target.files)}
        />

        <div className="flex gap-4 flex-wrap mb-4">
          {newImg.map((img, index) => (
            <div className="relative group" key={index}>
              <img
                src={img}
                alt={`new-${index}`}
                className="w-[100px] h-[100px] object-cover border-2 border-gray-400 rounded-md shadow-sm"
              />
              <button
                className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-lg font-bold w-6 h-6 rounded-full cursor-pointer opacity-0 transition duration-300 flex items-center justify-center p-0.5 transform scale-0 group-hover:opacity-100 group-hover:scale-100"
                onClick={() => handleRemoveNewImage(index)}
                aria-label="Remove image"
              >
                &times;
              </button>
            </div>
          ))}

          <button
            type="button"
            className="p-4 border-2 border-gray-400 bg-gray-50 rounded-lg text-base font-medium cursor-pointer transition duration-200 w-[80px] h-[80px] hover:bg-gray-200 flex items-center justify-center shadow-md"
            onClick={() => document.getElementById("add-images").click()}
          >
            <i className="fa-solid fa-upload text-4xl text-gray-700"></i>
          </button>
        </div>

        {newImg.length > 0 && (
          <button
            type="button"
            className="bg-purple-600 text-white py-2.5 px-5 rounded-lg text-base font-medium cursor-pointer transition duration-200 hover:bg-purple-700 shadow-lg hover:shadow-xl mt-4"
            onClick={handleUploadNewImages}
          >
            Upload Images
          </button>
        )}
      </fieldset>
    </div>
  );
}
