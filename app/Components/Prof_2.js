"use client";

import React from "react";
import { useMainData } from "../context/MainDataContext";
function Prof_2() {
  const { home } = useMainData();
  return (
         <svg
          width="300"
          height="371.5"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          <circle cx="150" cy="250" r="120" fill="rgb(37,36,36)" />
          <defs>
            <clipPath id="circle-clip">
              <ellipse cx="151" cy="170" rx="142" ry="205"></ellipse>
            </clipPath>
          </defs>
          <image
            href={home?.home?.Profile}
            width="270"
            height="330"
            x="15"
            y="60"
            clipPath="url(#circle-clip)"
            preserveAspectRatio="xMidYMid slice"
          />
        </svg>
  );
}
export default Prof_2;