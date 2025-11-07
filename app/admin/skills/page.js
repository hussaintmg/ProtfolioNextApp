"use client";

import React, { useEffect } from "react";
import RevealSection from "@/app/Components/RevealSection";
import SkillsEdit from "@/app/Components/SkillsEdit";
import ServicesEdit from '@/app/Components/ServicesEdit'
import AnimatedTitle from "@/app/Components/AnimatedTitle";

export default function AdminSkill() {
  useEffect(() => {
    document.title = "Hussain Portfolio | Skills Edit";
  }, []);
  return (
    <div className="AdminSkillsPage w-full pt-[1cm] pl-[0.3cm]">
      <h1 className="text-[6vw] text-[#00c951] font-extrabold mt-6">
        <AnimatedTitle>Skills Edit</AnimatedTitle>
      </h1>
      <RevealSection trigger="load">
        <SkillsEdit />
      </RevealSection>
      <RevealSection trigger="load"><ServicesEdit /></RevealSection>
    </div>
  );
}
