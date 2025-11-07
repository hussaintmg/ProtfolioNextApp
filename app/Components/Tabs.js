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
    <div className="relative flex justify-center items-center w-full border-2 border-white rounded-xl bg-[rgb(28,113,209)] overflow-hidden">
      <span
        className="absolute bottom-0 h-full bg-red-500 rounded-xl transition-all duration-500 ease-in-out"
        style={{ width: indicatorWidth, left: indicatorLeft }}
      ></span>

      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          onClick={() => handleClick(i, tab.value)}
          className={`relative w-full h-[2cm] text-[1.2rem] font-extrabold text-white text-center bg-transparent border-none cursor-pointer z-[2] hover:opacity-[0.99] ${
            i === activeIndex
              ? "text-blue-600"
              : "text-gray-600 hover:text-blue-400"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
