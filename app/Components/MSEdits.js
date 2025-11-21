"use client";

import React, { useState } from "react";
import { useMainData } from "@/app/context/MainDataContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function MSEdit() {
  const { home, getData } = useMainData();
  const [MS, setMS] = useState("");

  const uploadMS = async () => {
    if (!MS) return toast.error("Please enter some text!");

    try {
      await axios.post(
        `/api/data/Home/MS-upload`,
        { MS },
        { headers: { "Content-Type": "application/json" } }
      );
      getData();
      setMS("");
      toast.success("Text updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload text");
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 py-6">
      <h2 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl mb-6 text-center">
        My Self
      </h2>

      <div className="w-full flex flex-col sm:flex-row items-center gap-6 sm:gap-10 justify-center">
        <div className="glitch-input-wrapper w-full sm:w-80 md:w-96">
          <div className="input-container w-full relative">
            <textarea
              value={MS}
              placeholder={home?.home?.MS || "Enter your text"}
              onChange={(e) => setMS(e.target.value)}
              id="holo-input"
              className="holo-input resize-none"
              rows={4}
              required
            />

            <div className="input-border"></div>
            <div className="input-scanline"></div>
            <div className="input-glow"></div>

            <div className="input-data-stream">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="stream-bar" style={{ "--i": i }}></div>
              ))}
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
          className="text-white border border-[#00f2ea] px-6 py-2 rounded-md hover:bg-[#00f2ea] hover:text-black transition-all duration-300 ease-in-out cursor-pointer w-full sm:w-auto"
          onClick={uploadMS}
        >
          Confirm Changes
        </button>
      </div>

      <style jsx global>{`
        body {
          background: #0d0d0d;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        .glitch-input-wrapper {
          --primary-color: #00f2ea;
          --secondary-color: #a855f7;
          --text-color: #e5e5e5;
          --glitch-anim-duration: 0.4s;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Fira Code", Consolas, "Courier New", monospace;
          font-size: 16px;
        }
        .input-container {
          position: relative;
          width: 100%;
        }
        .holo-input {
          width: 100%;
          background: rgba(13, 13, 13, 0.7);
          border: none;
          border-bottom: 2px solid #333;
          outline: none;
          padding: 0.75rem 1rem;
          color: var(--primary-color);
          font-family: inherit;
          font-size: 1.1rem;
          caret-color: var(--primary-color);
          z-index: 10;
          transition: all 0.3s ease;
          min-height: 3.5rem;
        }
        .holo-input:focus {
          border-color: transparent;
        }
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
      `}</style>
    </div>
  );
}
