"use client";

import React from "react";
import Link from "next/link";

import { useMainData } from "../context/MainDataContext";

export default function Topbar({ activePage, setOpenMenu, role }) {
  const { home } = useMainData();
  const navItems = [
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

  return (
    <div className="w-full flex items-center h-auto max-[720px]:items-start max-[720px]:justify-center">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="text-white text-4xl absolute left-3 top-6 bg-transparent border-none cursor-pointer hidden max-[720px]:block"
        onClick={() => setOpenMenu(true)}
      >
        ≡
      </button>

      {/* Logo */}
      <Link
        href={"/"}
        className="w-[250px] h-[170px] -mt-[35px] bg-transparent border-none overflow-hidden max-[720px]:w-auto max-[720px]:h-1/3 max-[720px]:m-0 max-[720px]:flex max-[720px]:justify-center"
      >
        <img
          src={home?.home?.logo}
          alt="Logo"
          className="w-[250px] h-[250px] -mt-[20px] cursor-pointer max-[720px]:w-[170px] max-[720px]:h-[170px] max-[300px]:w-[130px] max-[300px]:h-[130px]"
        />
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-1 justify-center items-center gap-[2%] text-white max-[720px]:hidden">
        {/* Extra link for admin */}
        {role === "admin" && (
          <Link
            href="/admin"
            className={`text-[35px] max-[1000px]:text-[30px] no-underline bg-transparent cursor-pointer h-11 ${
              activePage === "AdminMain"
                ? "text-gray-400"
                : "hover:text-gray-400"
            }`}
          >
            Main Page
          </Link>
        )}
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={getPath(item.name)}
            className={`text-[35px] max-[1000px]:text-[30px] no-underline bg-transparent cursor-pointer h-11 ${
              activePage === item.name || activePage === `Admin${item.name}`
                ? "text-gray-400"
                : "hover:text-gray-400"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
