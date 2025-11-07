"use client";

import React, { useEffect } from "react";
import AnimatedTitle from "../Components/AnimatedTitle";
import RevealSection from "../Components/RevealSection";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Admin() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Hussian's Portfolio | Admin Page";
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center text-white">
      <h1 className="text-[6vw] text-[#00c951] font-extrabold mt-6">
        <AnimatedTitle>Admin</AnimatedTitle>
      </h1>

      <div className="w-full flex flex-col items-center mt-4 px-[1cm] box-border">
        <h2 className="text-2xl text-center my-[0.3cm]">
          Welcome Back, {user?.user?.username}
        </h2>

        <h2 className="text-yellow-400 font-bold text-[1.6rem] mb-[0.5cm] mt-[0.5cm] w-full max-w-[700px]">
          Edit
        </h2>

        <RevealSection trigger="load">
          <div className="w-[80%] mb-[0.3cm] mt-[0.5cm]">
            <Link
            href={"/admin/home"}
              className="w-full flex items-center cursor-pointer h-[2cm] bg-white text-black font-bold text-left pl-[1cm] rounded-lg text-lg shadow-[0_4px_10px_rgba(6,209,6,0.34)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.995]"
            >
              Home
            </Link>
          </div>
        </RevealSection>

        <RevealSection trigger="scroll">
          <div className="w-[80%] mb-[0.3cm] mt-[0.5cm]">
            <Link
            href={"/admin/skills"}
              className="w-full flex items-center cursor-pointer h-[2cm] bg-white text-black font-bold text-left pl-[1cm] rounded-lg text-lg shadow-[0_4px_10px_rgba(6,209,6,0.34)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.995]"
            >
              Skills
            </Link>
          </div>
        </RevealSection>

        <RevealSection trigger="scroll">
          <div className="w-[80%] mb-[0.3cm] mt-[0.5cm]">
            <Link
            href={"/admin/projects"}
              className="w-full flex items-center cursor-pointer h-[2cm] bg-white text-black font-bold text-left pl-[1cm] rounded-lg text-lg shadow-[0_4px_10px_rgba(6,209,6,0.34)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.995]"
            >
              Projects
            </Link>
          </div>
        </RevealSection>
      </div>

      {/* responsive tweaks */}
      <style jsx>{`
        @media (max-width: 1000px) {
          .text-[6vw] {
            font-size: 8vw;
          }
        }
        @media (max-width: 700px) {
          button {
            height: 1.5cm;
            font-size: 1rem;
            padding-left: 0.6cm;
          }
        }
        @media (max-width: 500px) {
          h2 {
            font-size: 1.2rem;
          }
          .w-[80%] {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
}
