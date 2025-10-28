"use client";

import React, { useRef, useState } from "react";
import RevealSection from "./RevealSection";

function Footer() {
  const holdTimers = useRef({});
  const [copied, setCopied] = useState(false);

  const showPopup = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleHoldStart = (key, text) => {
    holdTimers.current[key] = setTimeout(() => {
      navigator.clipboard.writeText(text).then(() => {
        showPopup();
      });
    }, 600);
  };

  const handleHoldEnd = (key) => {
    clearTimeout(holdTimers.current[key]);
  };

  const contacts = [
    {
      text: "hussaintmerng@gmail.com",
      img: "/favicon.ico",
      shape: "rounded-full",
      colour: "bg-white",
      copyable: true,
    },
    {
      text: "PhoneNumber",
      img: "/favicon.ico",
      shape: "rounded-full",
      colour: "bg-white",
      copyable: true,
    },
    {
      text: "AddressT",
      img: "/favicon.ico",
      shape: "rounded-full",
      colour: "bg-white",
      copyable: false,
    },
  ];

  const socials = [
    {
      title: "Facebook",
      icon: "/favicon.ico",
      link: "https://facebook.com",
      shape: "rounded-full",
      colour: "bg-blue-500",
    },
  ];

  return (
    <RevealSection trigger="scroll">
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 animate-fade">
          Copied!
        </div>
      )}
      <div className="w-[96.25%] bg-[#1f1e1e] border border-white rounded-[15px] mt-[0.5cm] mb-[0.5cm] ml-auto mr-auto p-[1vw]">
        {/* Logo */}
        <div className="ml-[3.54375vw] w-[13.75vw] h-[13.75vw]">
          <img
            src="https://portfolio-react-nine-rose.vercel.app/static/media/tmg-removebg-preview.e123cd361188562e6ffe.png"
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="text-white flex w-full gap-8 mb-[40px] max-[700px]:flex-col max-[700px]:items-baseline ">
          {/* Contact Section */}
          <div className="flex-1 ml-[15%] min-w-[250px]">
            <h2 className="text-[2.7vw] max-[700px]:text-[3.5vw] font-bold mb-3">
              Contact:
            </h2>
            <div className="flex flex-col gap-3">
              {contacts.map((item, index) => (
                <div
                  className="flex items-center gap-3 ml-[2%] mt-[2%]"
                  key={index}
                >
                  <div
                    className={`w-[1.875vw] h-[1.875vw]  max-[700px]:w-[3vw] max-[700px]:h-[3vw] flex justify-center items-center ${item.colour} ${item.shape}`}
                  >
                    <img
                      src={item.img}
                      alt={item.text}
                      className="w-[2vw] h-[2vw] max-[700px]:w-[3vw] max-[700px]:h-[3vw] object-cover"
                    />
                  </div>
                  <span
                    className={`text-[1.4375vw] max-[700px]:text-[2.5vw] ${
                      item.copyable ? "cursor-pointer" : ""
                    }`}
                    onMouseDown={() =>
                      item.copyable && handleHoldStart(index, item.text)
                    }
                    onMouseUp={() => handleHoldEnd(index)}
                    onMouseLeave={() => handleHoldEnd(index)}
                    onTouchStart={() =>
                      item.copyable && handleHoldStart(index, item.text)
                    }
                    onTouchEnd={() => handleHoldEnd(index)}
                    onTouchCancel={() => handleHoldEnd(index)}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="flex-1 min-w-[250px]">
            <h2 className="text-[2.7vw]  max-[700px]:text-[3.5vw] font-bold mb-3">
              Social Media:
            </h2>
            <div className="flex flex-col gap-3">
              {socials.map((social, index) => (
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  className="flex items-center gap-3 ml-[2%] mt-[2%] text-white hover:text-gray-300"
                >
                  <div
                    className={`w-[1.875vw] h-[1.875vw] max-[700px]:w-[3vw] max-[700px]:h-[3vw] flex justify-center items-center ${social.colour} ${social.shape}`}
                  >
                    <img
                      src={social.icon}
                      alt={social.title}
                      className="w-[2vw] h-[2vw] max-[700px]:w-[3vw] max-[700px]:h-[3vw] object-cover"
                    />
                  </div>
                  <span className="text-[1.4375vw]  max-[700px]:text-[2.5vw]">
                    {social.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

export default Footer;
