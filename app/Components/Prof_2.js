"use client";

import React ,{ useContext} from "react";
function Prof_2() {
  const {Prof}= "https://portfolio-react-nine-rose.vercel.app/static/media/Hussain-removebg-preview.d31eeb4b018f270afcf9.png"
    const apiUrl = process.env.REACT_APP_BACKEND_SERVER;
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
            href={`https://portfolio-react-nine-rose.vercel.app/static/media/Hussain-removebg-preview.d31eeb4b018f270afcf9.png`}
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