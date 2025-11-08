"use client";

import React, { useEffect } from "react";
import AnimatedTitle from "@/app/Components/AnimatedTitle";
import RevealSection from "@/app/Components/RevealSection";
import LogoEdit from "@/app/Components/logoEdit";
import MainSectionEdits from "@/app/Components/MainSectionEdits";
import FooterEdit from '@/app/Components/FooterEdit'

export default function AdminHome() {
  useEffect(() => {
    document.title = "Hussain Portfolio | Home Edit";
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center text-white">
      <h1 className="text-[6vw] text-[#00c951] font-extrabold mt-6">
        <AnimatedTitle>Home Edit</AnimatedTitle>
      </h1>
      <LogoEdit />
      <RevealSection trigger="scroll">
        <MainSectionEdits />
      </RevealSection>
      <RevealSection trigger="scroll">
        <FooterEdit />
      </RevealSection>
    </div>
  );
}
