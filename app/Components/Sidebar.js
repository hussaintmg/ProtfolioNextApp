"use client";

import React, { useRef } from "react";
import Link from "next/link";

export default function SideBar({ role, openMenu, setOpenMenu, activePage }) {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
  ];

  const getPath = (name) => {
    if (role === "admin") {
      if (name === "Home") return "/admin/home";
      if (name === "Skills") return "/admin/skills";
      if (name === "Projects") return "/admin/projects";
    } else {
      if (name === "Home") return "/";
      if (name === "Skills") return "/skills";
      if (name === "Projects") return "/projects";
    }
    return "/";
  };

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 60) {
      setOpenMenu(false);
    }
  };

  return (
    <div className="hidden max-[720px]:block">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          openMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpenMenu(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900/90 to-gray-800/80 backdrop-blur-xl border-r border-gray-700/30 shadow-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          openMenu ? "translate-x-0" : "-translate-x-full"
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={() => setOpenMenu(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200"
          aria-label="Close Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Menu content */}
        <div className="flex flex-col justify-start items-start h-full py-10 px-6 space-y-4">
          <h1 className="text-2xl font-bold text-white mb-6 tracking-wide">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              My Portfolio
            </span>
          </h1>

          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpenMenu(false)}
              className={`w-full text-left py-2.5 px-4 rounded-xl font-medium text-lg tracking-wide transition-all duration-300 ${
                activePage === "AdminMain"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              Main Page
            </Link>
          )}

          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={getPath(item.name)}
              onClick={() => setOpenMenu(false)}
              className={`w-full text-left py-2.5 px-4 rounded-xl font-medium text-lg tracking-wide transition-all duration-300 ${
                activePage === item.name || activePage === `Admin${item.name}`
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
