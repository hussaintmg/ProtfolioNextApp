"use client";

import React, { useContext } from "react";
function Prof_1() {
  const { Prof } = "https://portfolio-react-nine-rose.vercel.app/static/media/Hussain-removebg-preview.d31eeb4b018f270afcf9.png"
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
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
        href={`https://portfolio-react-nine-rose.vercel.app/static/media/Hussain-removebg-preview.d31eeb4b018f270afcf9.png`}
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
