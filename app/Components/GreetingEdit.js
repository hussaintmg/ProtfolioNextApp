"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";

import axios from "axios";
import { toast } from "react-toastify";

export default function GreetingEdit() {
  const { home ,getData} = useMainData();
  const [welText, setWelText] = useState("");
  const uploadWelText = async () => {
    if (!welText) return toast.error("Please enter some text!");

    try {
      const res = await axios.post(
        `/api/data/Home/welText-upload`,
        { welText },
        { headers: { "Content-Type": "application/json" } }
      );
      getData()
      setWelText("")
      toast.success("text updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload  text");
    }
  };
  return (
    <>
      <h2 className="text-white pt-[0.5cm] pl-[10%] font-bold text-2xl ">
        Greeting Text
      </h2>
      <div className="w-full flex justify-center items-center gap-[5cm] mt-[0.8cm] gap-[2cm]">
        <div className="glitch-input-wrapper">
          <div className="input-container">
            <input
              type="text"
              value={welText}
              onChange={(e) => {
                setWelText(e.target.value);
              }}
              id="holo-input"
              className="holo-input"
              required=""
            />
            <label htmlFor="holo-input" className="input-label">
              {home?.home?.welText}
            </label>

            <div className="input-border"></div>
            <div className="input-scanline"></div>
            <div className="input-glow"></div>

            <div className="input-data-stream">
              <div className="stream-bar" style={{ "--i": 0 }}></div>
              <div className="stream-bar" style={{ "--i": 1 }}></div>
              <div className="stream-bar" style={{ "--i": 2 }}></div>
              <div className="stream-bar" style={{ "--i": 3 }}></div>
              <div className="stream-bar" style={{ "--i": 4 }}></div>
              <div className="stream-bar" style={{ "--i": 5 }}></div>
              <div className="stream-bar" style={{ "--i": 6 }}></div>
              <div className="stream-bar" style={{ "--i": 7 }}></div>
              <div className="stream-bar" style={{ "--i": 8 }}></div>
              <div className="stream-bar" style={{ "--i": 9 }}></div>
            </div>

            <div className="input-corners">
              <div className="corner corner-tl"></div>
              <div className="corner corner-tr"></div>
              <div className="corner corner-bl"></div>
              <div className="corner corner-br"></div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer"
          style={{ margin: " 0 0 0 10%" }}
          onClick={uploadWelText}
        >
          Confirm Changes
        </button>
      </div>
      <style jsx global>
        {`
          body {
            background: #0d0d0d;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          .glitch-input-wrapper {
            --bg-color: rgba(13, 13, 13, 0);
            --primary-color: #00f2ea;
            --secondary-color: #a855f7;
            --text-color: #e5e5e5;
            --font-family: "Fira Code", Consolas, "Courier New", Courier,
              monospace;
            --glitch-anim-duration: 0.4s;

            display: flex;
            justify-content: center;
            align-items: center;
            font-family: var(--font-family);
            font-size: 16px;
            padding: 3rem;
          }

          /* --- Container  --- */
          .input-container {
            position: relative;
            width: 19rem;
          }

          /* --- Input --- */
          .holo-input {
            width: 100%;
            height: 3.5rem;
            background: rgba(13, 13, 13, 0.7);
            border: none;
            border-bottom: 2px solid #333;
            outline: none;
            padding: 0 1rem;
            color: var(--primary-color);
            font-family: inherit;
            font-size: 1.1rem;
            caret-color: var(--primary-color);
            z-index: 10;
            transition: background 0.3s ease, border-color 0.3s ease;
          }

          /* --- Floating Label --- */
          .input-label {
            position: absolute;
            top: 1rem;
            left: 1rem;
            color: var(--text-color);
            opacity: 0.6;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 11;
          }
          .holo-input:focus + .input-label,
          .holo-input:not(:placeholder-shown) + .input-label {
            top: -1.5rem;
            left: 0;
            font-size: 0.8rem;
            opacity: 1;
            color: var(--primary-color);
          }

          .holo-input:focus + .input-label::before,
          .holo-input:focus + .input-label::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000000ff;
          }
          .holo-input:focus + .input-label::before {
            color: var(--secondary-color);
            animation: glitch-label var(--glitch-anim-duration)
              cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          }
          .holo-input:focus + .input-label::after {
            color: var(--primary-color);
            animation: glitch-label var(--glitch-anim-duration)
              cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
          }

          /* --- Decorative Layers --- */
          .input-border,
          .input-scanline,
          .input-glow,
          .input-corners {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
          .input-border {
            border: 1px solid rgba(0, 242, 234, 0.2);
            opacity: 0.5;
            transition: all 0.3s ease;
          }
          .corner {
            position: absolute;
            width: 1rem;
            height: 1rem;
            border: 2px solid var(--primary-color);
            transition: all 0.3s ease;
            opacity: 0.5;
          }
          .corner-tl {
            top: -0.3rem;
            left: -0.3rem;
            border-right: none;
            border-bottom: none;
          }
          .corner-tr {
            top: -0.3rem;
            right: -0.3rem;
            border-left: none;
            border-bottom: none;
          }
          .corner-bl {
            bottom: -0.3rem;
            left: -0.3rem;
            border-right: none;
            border-top: none;
          }
          .corner-br {
            bottom: -0.3rem;
            right: -0.3rem;
            border-left: none;
            border-top: none;
          }

          .input-glow {
            background: radial-gradient(
              ellipse at center,
              rgba(0, 242, 234, 0.2) 0%,
              transparent 70%
            );
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .input-scanline {
            height: 100%;
            background: linear-gradient(
              to bottom,
              transparent 0%,
              rgba(0, 242, 234, 0.1) 48%,
              rgba(0, 242, 234, 0.3) 50%,
              rgba(0, 242, 234, 0.1) 52%,
              transparent 100%
            );
            opacity: 0;
          }

          /* --- Data Visualization --- */
          .input-data-stream {
            position: absolute;
            bottom: 2px;
            left: 0;
            width: 100%;
            height: 0.3rem;
            display: flex;
            opacity: 0;
            transition: opacity 0.3s ease 0.1s;
          }
          .stream-bar {
            flex-grow: 1;
            background-color: var(--primary-color);
            transition: transform 0.2s, opacity 0.2s;
            transform: scaleY(0);
            transform-origin: bottom;
          }

          .holo-input:focus {
            border-color: transparent;
          }
          .holo-input:focus ~ .input-border {
            opacity: 1;
            border-color: rgba(0, 242, 234, 0.5);
          }
          .holo-input:focus ~ .input-corners .corner {
            width: 1.25rem;
            height: 1.25rem;
            border-width: 3px;
            opacity: 1;
          }
          .holo-input:focus ~ .input-glow {
            opacity: 1;
          }
          .holo-input:focus ~ .input-scanline {
            animation: scan-vertical 4s linear infinite;
          }
          .holo-input:focus ~ .input-data-stream {
            opacity: 1;
          }
          .holo-input:focus ~ .input-data-stream .stream-bar {
            animation: data-pulse 2s infinite;
            animation-delay: calc(var(--i) * 0.1s);
          }

          /* --- Keyframes --- */
          @keyframes glitch-label {
            0% {
              transform: translate(0);
              clip-path: inset(0 0 0 0);
            }
            20% {
              transform: translate(-0.2rem, 0.1rem);
              clip-path: inset(50% 0 20% 0);
            }
            40% {
              transform: translate(0.1rem, -0.1rem);
              clip-path: inset(20% 0 60% 0);
            }
            60% {
              transform: translate(-0.15rem, 0.1rem);
              clip-path: inset(80% 0 5% 0);
            }
            80% {
              transform: translate(0.15rem, -0.15rem);
              clip-path: inset(30% 0 45% 0);
            }
            100% {
              transform: translate(0);
              clip-path: inset(0 0 0 0);
            }
          }

          @keyframes scan-vertical {
            0% {
              opacity: 0;
              transform: translateY(-100%);
            }
            25% {
              opacity: 0.5;
            }
            75% {
              opacity: 0.5;
            }
            100% {
              opacity: 0;
              transform: translateY(100%);
            }
          }

          @keyframes data-pulse {
            0%,
            100% {
              transform: scaleY(0.2);
              opacity: 0.3;
            }
            50% {
              transform: scaleY(1);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </>
  );
}
