"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTitle from "../Components/AnimatedTitle";
import FadeContent from "../Components/FadeContent";
import RevealSection from "../Components/RevealSection";

const randomPercent = (min, max) =>
  `${Math.floor(Math.random() * (max - min) + min)}%`;

const MIN_DISTANCE = 15;

const isFarEnough = (pos, positions) => {
  return positions.every((p) => {
    const topDiff = Math.abs(parseInt(p.top) - parseInt(pos.top));
    const leftDiff = Math.abs(parseInt(p.left) - parseInt(pos.left));
    return topDiff > MIN_DISTANCE || leftDiff > MIN_DISTANCE;
  });
};

// Dynamic icon import
const DynamicFaIcon = ({ iconName, size = 40, color = "white" }) => {
  const Icon = React.lazy(() =>
    import("react-icons/fa").then((module) => ({ default: module[iconName] }))
  );
  return (
    <Suspense fallback={<span style={{ width: size, height: size }}>...</span>}>
      <Icon size={size} color={color} />
    </Suspense>
  );
};

export default function Skills() {
  const [activeService, setActiveService] = useState(null);
  const [randomIndex, setRandomIndex] = useState(0);

  const icons = useMemo(
    () => [
      "https://cdn-icons-png.flaticon.com/128/888/888859.png",
      "https://cdn-icons-png.flaticon.com/128/888/888859.png",
      "https://cdn-icons-png.flaticon.com/128/888/888859.png",
      "https://cdn-icons-png.flaticon.com/128/888/888859.png",
      "https://cdn-icons-png.flaticon.com/128/888/888859.png",
      "https://cdn-icons-png.flaticon.com/128/888/888859.png",
    ],
    []
  );

  const services = [
    { title: "Custom Web Development", icon: "FaLaptopCode" },
    { title: "API Integration", icon: "FaCode" },
    { title: "Responsive Design", icon: "FaMobileAlt" },
  ];

  const skList = [
    { heading: "Frontend:", list: "HTML, CSS, JavaScript, React, TailwindCSS" },
    { heading: "Backend:", list: "Node.js, Express, MongoDB" },
    { heading: "Backend:", list: "Node.js, Express, MongoDB" },
    { heading: "Backend:", list: "Node.js, Express, MongoDB" },
    { heading: "Backend:", list: "Node.js, Express, MongoDB" },
  ];

  const generatePositions = useCallback((count) => {
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
  const newPositions = [];

  const topRange = isSmallScreen ? [10, 50] : [20, 80];
  const leftRange = isSmallScreen ? [20, 70] : [10, 85];

  for (let i = 0; i < count; i++) {
    let valid = false;
    let attempt = 0;
    let pos = null;
    while (!valid && attempt < 100) {
      pos = {
        top: randomPercent(topRange[0], topRange[1]),
        left: randomPercent(leftRange[0], leftRange[1]),
      };
      valid = isFarEnough(pos, newPositions);
      attempt++;
    }
    newPositions.push(pos);
  }
  return newPositions;
}, []);

  const [positions, setPositions] = useState(() => generatePositions(icons.length));
  const [prevPositions, setPrevPositions] = useState(positions);

  useEffect(() => {
    const newPositions = generatePositions(icons.length);
    setPositions(newPositions);
    setPrevPositions(newPositions);
  }, [icons, generatePositions]);

  useEffect(() => {
    document.title = "Hussain Portfolio | Skills";
    const interval = setInterval(() => {
      setPrevPositions(positions);
      setPositions(generatePositions(icons.length));
    }, 5000);
    return () => clearInterval(interval);
  }, [positions, icons.length, generatePositions]);

  useEffect(() => {
    if (activeService) return;
    const interval = setInterval(() => {
      setRandomIndex((prev) => (prev + 1) % (services.length || 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeService, services]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white flex flex-col items-center">
      {/* Floating Icons */}
      <div className="absolute inset-0 -z-10 pointer-events-none h-[70%]">
        {icons.map((icon, i) => {
          if (!positions[i] || !prevPositions[i]) return null;
          const angle = Math.atan2(
            parseInt(positions[i].top) - parseInt(prevPositions[i].top),
            parseInt(positions[i].left) - parseInt(prevPositions[i].left)
          );
          const rotateDeg = (angle * 180) / Math.PI;
          return (
            <motion.img
              key={i}
              src={icon}
              alt="tech-icon"
              className="absolute opacity-90 lg:w-[5vw] sm:w-[4vw] md:w-[6vw] max-[700px]:w-[20px]"
              initial={{ top: prevPositions[i].top, left: prevPositions[i].left }}
              animate={{
                top: positions[i].top,
                left: positions[i].left,
                rotate: [0, rotateDeg, 0],
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          );
        })}
      </div>

      {/* Heading */}
      <h1 className="text-[6vw] font-extrabold text-[#00c951]">
        <AnimatedTitle>My Skills</AnimatedTitle>
      </h1>

      {/* Skills Section */}
      <RevealSection trigger="load">
        <div className="w-full mt-10 flex justify-center">
          <FadeContent className="block w-full ml-[15%]">
            <h3 className="text-green-500 text-5xl max-[1000px]:text-4xl font-bold mb-5 max-[800px]:text-3xl max-[650px]:text-[2rem] max-[400px]:text-[1.4rem]">
              Skills & Technologies:
            </h3>
            <ul className="list-disc ml-15 max-[1000px]:ml-10 max-[800px]:ml-7 max-[600px]:ml-4 max-[400px]:ml-2 text-gray-300 space-y-3 w-[100%]">
              {skList.map((list, i) => (
                <li key={i} className="text-3xl max-[1000px]:text-2xl max-[800px]:text-xl max-[650px]:text-[1rem] max-[400px]:text-[0.7rem] font-light">
                  <span className="text-white font-extrabold max-[800px]:font-bold text-4xl max-[1000px]:text-3xl max-[800px]:text-2xl mr-2  max-[650px]:text-[1.3rem] max-[400px]:text-[1rem]"> 
                    {list.heading}
                  </span>
                  {list.list}
                </li>
              ))}
            </ul>
          </FadeContent>
        </div>
      </RevealSection>

      {/* Services Section */}
      <RevealSection trigger="scroll">
        <div className="w-full flex flex-col gap-6 mt-[6cm] mb-10">
          <FadeContent className=" w-90% mx-auto">
            <h3 className="text-green-500 text-5xl max-[1000px]:text-4xl max-[800px]:text-3xl max-[650px]:text-[2rem] max-[400px]:text-[1.4rem] font-bold mb-4 text-left">
              Services Offered:
            </h3>

            <div className="relative flex items-start">
              {/* Icon Box */}
              <div className="absolute -left-10 sm:-left-16 top-1/2 transform -translate-y-1/2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService || randomIndex}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeService ? (
                      <DynamicFaIcon iconName={activeService.icon} />
                    ) : (
                      <DynamicFaIcon iconName={services[randomIndex].icon} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* List */}
              <ul className="ml-12 sm:ml-16 text-left space-y-3">
                {services.map((service, i) => (
                  <li
                    key={i}
                    onMouseEnter={() => setActiveService(service)}
                    onMouseLeave={() => setActiveService(null)}
                    className="list-disc text-3xl max-[1000px]:text-2xl max-[800px]:text-xl max-[650px]:text-[1rem] max-[400px]:text-[0.7rem] font-light"
                  >
                    {service.title}
                  </li>
                ))}
              </ul>
            </div>
          </FadeContent>
        </div>
      </RevealSection>
    </div>
  );
}
