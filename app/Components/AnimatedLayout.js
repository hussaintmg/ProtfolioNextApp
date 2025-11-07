"use client";
import React from "react";

export default function AnimatedLayout({ visible }) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-start pt-12 bg-white z-[10000] ${
        visible ? "flex" : "hidden"
      }`}
    >
      {/* Top-left square */}
      <div className="absolute top-5 left-10 w-24 h-24 rounded-lg bg-gray-300 animate-fade"></div>

      {/* Floating circle (top-right) */}
      <div className="absolute top-24 right-[10vw] w-48 h-48 rounded-full bg-gray-300 animate-fade"></div>

      {/* Top rectangles (responsive) */}
      <div className="flex gap-3 animate-fade sm:gap-4 sm:scale-100 scale-90">
        <div className="w-24 sm:w-36 h-12 sm:h-16 bg-gray-300 rounded-lg"></div>
        <div className="w-24 sm:w-36 h-12 sm:h-16 bg-gray-300 rounded-lg"></div>
        <div className="w-24 sm:w-36 h-12 sm:h-16 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Spacer */}
      <div className="mt-72"></div>

      {/* Middle wide rectangle */}
      <div className="w-[90%] h-20 bg-gray-300 rounded-lg animate-fade"></div>

      {/* Row rectangles */}
      <div className="flex justify-center w-full gap-5 mt-16 animate-fade">
        <div className="w-[45%] h-20 bg-gray-300 rounded-lg"></div>
        <div className="w-[45%] h-20 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Bottom rectangle */}
      <div className="w-[60%] h-24 bg-gray-300 rounded-lg mt-10 animate-fade"></div>
    </div>
  );
}
