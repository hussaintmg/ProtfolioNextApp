"use client";

import React from "react";
import { useMainData } from "../context/MainDataContext";
function Prof_1() {
  const { home } = useMainData();
  return (
    <svg
      width="340"
      height="400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <circle cx="170" cy="230" r="160" fill="rgb(37,36,36)" />
      <defs>
        <clipPath id="circle-clip">
          <ellipse cx="171" cy="134" rx="190" ry="260"></ellipse>
        </clipPath>
      </defs>
      <image
        href={home?.home?.Profile}
        width="350"
        height="450"
        x="-10"
        y="-50"
        clipPath="url(#circle-clip)"
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
}
export default Prof_1;
