"use client";
import React, { useState } from "react";

export default function Tabs({ tabs, onChange }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index, value) => {
    setActiveIndex(index);
    onChange && onChange(value);
  };

  const indicatorWidth = 100 / tabs.length + "%";
  const indicatorLeft = (activeIndex * 100) / tabs.length + "%";

  return (
    <div
      className="relative flex justify-center items-center w-full 
                 border-2 border-white rounded-xl 
                 bg-[rgb(28,113,209)] overflow-hidden
                 h-[3rem] sm:h-[3.5rem] md:h-[4rem] lg:h-[4.5rem]"
    >
      {/* Indicator */}
      <span
        className="absolute bottom-0 h-full bg-red-500 rounded-xl transition-all duration-500 ease-in-out"
        style={{ width: indicatorWidth, left: indicatorLeft }}
      ></span>

      {/* Tabs */}
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          onClick={() => handleClick(i, tab.value)}
          className={`relative w-full h-full font-bold text-white 
                      bg-transparent border-none cursor-pointer z-[2]
                      transition-all duration-300
                      text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem]
                      ${
                        i === activeIndex
                          ? "text-blue-600"
                          : "text-gray-300 hover:text-blue-200"
                      }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
