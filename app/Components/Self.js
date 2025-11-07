"use client";

import React from "react";

import { useMainData } from "../context/MainDataContext";

import ShinyText from "./ShinyText";

function Self() {
  const { home } = useMainData();
  const MSB = home?.home?.MSB;
  const MS = home?.home?.MS;
  return (
    <ShinyText
      text={
        <>
          <strong
            className="text-[50px]
    max-[1320px]:text-[40px]
    max-[1201px]:text-[40px]
    max-[950px]:text-[35px]
    max-[700px]:text-[30px]
    max-[650px]:text-[34px]
    max-[445px]:text-[25px]
    max-[330px]:text-[23px]"
          >
            {MSB}
          </strong>{" "}
          {MS}
        </>
      }
      disabled={false}
      speed={3}
      className="text-white ml-[2cm] text-[30px] w-[60vw]
      max-[1320px]:w-[62vw] max-[1320px]:text-[22px] max-[1320px]:ml-[1cm]
    max-[1201px]:w-[62vw] max-[1201px]:text-[22px] max-[1201px]:ml-[1cm]
    max-[950px]:w-[60vw] max-[950px]:text-[18px] max-[950px]:ml-[1cm]
    max-[700px]:w-[55vw] max-[700px]:text-[17px] max-[700px]:ml-[1cm]
    max-[650px]:w-[91vw] max-[650px]:text-[18px] max-[650px]:ml-[0.5cm]
    max-[445px]:w-[91vw] max-[445px]:text-[13px] max-[445px]:ml-[0.5cm]
    max-[330px]:w-[91vw] max-[330px]:text-[13px] max-[330px]:ml-[0.5cm]
      "
    />
  );
}
export default Self;
