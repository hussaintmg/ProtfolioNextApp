"use client";
import React from "react";

export default function AnimatedLayout({ visible }) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-start bg-white z-[10000] ${
        visible ? "flex" : "hidden"
      }`}
    >
      {/* Top-left square */}
      <div className="
        absolute 
        top-4 left-4 
        md:top-6 md:left-10
        lg:top-8 lg:left-14
        w-8 h-8 
        md:w-16 md:h-16 
        lg:w-24 lg:h-24
        rounded-lg bg-gray-300 animate-fade
      "></div>

      {/* Floating circle (top-right) */}
      <div className="
        absolute 
        top-10 right-4 
        md:top-28 md:right-16
        lg:top-32 lg:right-[10vw]
        w-16 h-16 
        md:w-32 md:h-32 
        lg:w-48 lg:h-48
        rounded-full bg-gray-300 animate-fade
      "></div>

      {/* Top rectangles */}
      <div className="
        flex gap-2 md:gap-4 lg:gap-6 
        animate-fade 
        mt-28 
        md:mt-32 
        lg:mt-40
        px-4
      ">
        <div className="w-20 md:w-32 lg:w-36 h-10 md:h-14 lg:h-16 bg-gray-300 rounded-lg"></div>
        <div className="w-20 md:w-32 lg:w-36 h-10 md:h-14 lg:h-16 bg-gray-300 rounded-lg"></div>
        <div className="w-20 md:w-32 lg:w-36 h-10 md:h-14 lg:h-16 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Middle wide rectangle */}
      <div className="
        w-[92%] 
        md:w-[90%] 
        lg:w-[85%] 
        h-14 md:h-16 lg:h-20 
        bg-gray-300 rounded-lg animate-fade
        mt-12 
        md:mt-16 
        lg:mt-20
      "></div>

      {/* Row rectangles */}
      <div className="
        flex flex-col md:flex-row 
        justify-center w-full 
        gap-4 md:gap-6 
        mt-10 md:mt-16 lg:mt-20 
        animate-fade px-4
      ">
        <div className="w-full md:w-[45%] h-14 md:h-16 lg:h-20 bg-gray-300 rounded-lg"></div>
        <div className="w-full md:w-[45%] h-14 md:h-16 lg:h-20 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Bottom rectangle */}
      <div className="
        w-[75%] md:w-[60%] lg:w-[40%] 
        h-16 md:h-20 lg:h-24 
        bg-gray-300 rounded-lg 
        mt-10 md:mt-12 lg:mt-14 animate-fade
      "></div>
    </div>
  );
}
