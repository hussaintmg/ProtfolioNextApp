"use client";

import React, { useState, useEffect } from "react";
import AnimatedTitle from "../Components/AnimatedTitle";
import RevealSection from "../Components/RevealSection";

import { useMainData } from "../context/MainDataContext";

export default function Projects() {
  const { projects } = useMainData();
  const website_details = projects?.projects?.projectsArr || [];

  return (
    <div className="text-white">
      <h1 className="mb-[3rem] text-[6vw] max-[800px]:text-[3vw] text-[#00c951] font-extrabold">
        <AnimatedTitle>My Projects</AnimatedTitle>
      </h1>

      {website_details.map((web, index) => (
        <RevealSection key={index} trigger={index === 0 ? "load" : "scroll"}>
          <ProjectBlock
            index={index}
            web={web}
            reverse={index % 2 !== 0}
            website_details={website_details}
          />
        </RevealSection>
      ))}

      <RevealSection trigger="load">
        <p
          className="text-center text-red-500 text-[2rem] font-bold"
          style={{
            display:
              Array.isArray(website_details) && website_details.length > 0
                ? "none"
                : "block",
          }}
        >
          No Projects Available
        </p>
      </RevealSection>
    </div>
  );
}

function ProjectBlock({ index, web, reverse, website_details }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [slideClass, setSlideClass] = useState("active");
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    document.title = "Hussain Portfolio | Projects";
    const interval = setInterval(() => {
      setSlideClass("slide-out");
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % web.images.length);
        setSlideClass("active");
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [web.images.length]);

  const handleVideoEnd = () => {
    if (web.videos.length > 1) {
      setCurrentVideo((prev) => (prev + 1) % web.videos.length);
    } else {
      const videoElement = document.getElementById(`video-${index}`);
      if (videoElement) videoElement.play();
    }
  };

  return (
    <div className={`w-[95%] mb-[4rem] block`}>
      <div
        className={`flex items-center w-full ${
          reverse ? "flex-row-reverse" : ""
        } justify-evenly max-[850px]:flex-col mx-[10px]`}
      >
        {/* Title */}
        <div className="flex-1 text-center text-[1.8rem] font-semibold text-[#00e6e6] p-4">
          <a href={web.link} target="_blank" rel="noopener noreferrer">
            {web.title}
          </a>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center overflow-hidden max-w-[80%] w-[80%] h-auto rounded-[12px] shadow-[0_4px_15px_rgba(0,255,255,0.2)] max-[1000px]:w-[85%] max-[850px]:w-[90%]">
          <img
            src={web.images[currentImage].icon}
            alt={`${web.title} img`}
            className={`w-full max-w-[600px] h-auto object-contain overflow-hidden rounded-[12px] transition-transform duration-[600ms] ease-in-out ${
              slideClass === "active"
                ? "translate-x-0"
                : reverse
                ? "translate-x-[150%]"
                : "-translate-x-[150%]"
            }`}
            loading="lazy"
          />
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full max-[1000px]:w-[90%] max-[600px]:w-[70%] max-h-[52.5%] h-[52.5%] flex justify-center mt-[1.5rem] relative max-w-[70%] mx-auto rounded-[12px] overflow-hidden shadow-[0_8px_20px_rgba(0,255,255,0.493)]">
        <video
          id={`video-${index}`}
          key={currentVideo}
          src={web.videos[currentVideo].video}
          autoPlay
          muted
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover rounded-[12px]"
        />
      </div>

      {/* Divider Line */}
      <hr
        className={`text-gray-400 mt-[5vh] ${
          website_details.length - 1 !== index ? "block" : "hidden"
        }`}
      />
    </div>
  );
}
