"use client";

import React from "react";
import { useMainData } from "../context/MainDataContext";

function Prof_3() {
  const { home } = useMainData();
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg
        width="150"
        height="250"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <circle cx="75" cy="170" r="60" fill="rgb(37,36,36)" />
        <defs>
          <clipPath id="circle-clip">
            <ellipse cx="75" cy="155" rx="65" ry="80"></ellipse>
          </clipPath>
        </defs>
        <image
          href={home?.home?.Profile}
          x="15"
          y="70"
          clipPath="url(#circle-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>
  );
}

export default Prof_3;
