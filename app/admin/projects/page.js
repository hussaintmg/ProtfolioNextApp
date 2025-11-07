"use client";

import React, { useEffect } from "react";
import AnimatedTitle from "@/app/Components/AnimatedTitle";
import RevealSection from "@/app/Components/RevealSection";

import DropdownSection from "@/app/Components/DropdownSection";
import NewProject from "@/app/Components/NewProject";

import { useMainData } from "@/app/context/MainDataContext";

export default function AdminProject() {
  const { projects } = useMainData();

  useEffect(() => {
    document.title = "Hussain Portfolio | Projects Edit";
  }, []);

  return (
    <div className="admin-project-edit-page w-full pt-[1cm] pl-[0.3cm]">
      <h1 className="text-[6vw] text-[#00c951] font-extrabold mt-6">
        <AnimatedTitle>Projects Edit Page</AnimatedTitle>
      </h1>
      <div className="my-[2cm]">
        <RevealSection trigger="load">
          {projects?.projects?.projectsArr.map((project) => {
            return <DropdownSection key={project.link} project={project} />;
          })}
          <p
            style={{
              textAlign: "center",
              color: "red",
              fontSize: "2rem",
              fontWeight: "700",
              display:
                Array.isArray(projects) && projects.length > 0
                  ? "none"
                  : "block",
            }}
          >
            No Projects Available
          </p>
        </RevealSection>
        <RevealSection trigger="load">
          <NewProject />
        </RevealSection>
      </div>
    </div>
  );
}
