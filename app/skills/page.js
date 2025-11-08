"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTitle from "../Components/AnimatedTitle";
import FadeContent from "../Components/FadeContent";
import RevealSection from "../Components/RevealSection";
import { useMainData } from "../context/MainDataContext";

// random positioning
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

// Lazy icon component
const LazyFaIcon = ({ iconName, size = 40, color = "white" }) => {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("react-icons/fa").then((mod) => {
      const Selected = mod[iconName];
      if (mounted) setIcon(() => Selected || null);
    });
    return () => (mounted = false);
  }, [iconName]);

  if (!Icon)
    return (
      <span
        style={{
          width: size,
          height: size,
          display: "inline-block",
          textAlign: "center",
        }}
      >
        ...
      </span>
    );

  return <Icon size={size} color={color} />;
};

export default function Skills() {
  const { skills } = useMainData();
  const [activeService, setActiveService] = useState(null);
  const [randomIndex, setRandomIndex] = useState(0);

  const icons = useMemo(() => skills?.skills?.skIcons || [], [skills]);
  const services = skills?.skills?.services || [];
  const skList = skills?.skills?.skList || [];

  // icon positions
  const generatePositions = useCallback((count) => {
    const isSmall = typeof window !== "undefined" && window.innerWidth < 768;
    const newPositions = [];
    const topRange = isSmall ? [10, 50] : [20, 80];
    const leftRange = isSmall ? [20, 70] : [10, 85];

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

  const [positions, setPositions] = useState(() =>
    generatePositions(icons?.length)
  );
  const [prevPositions, setPrevPositions] = useState(positions);

  useEffect(() => {
    const newPos = generatePositions(icons.length);
    setPositions(newPos);
    setPrevPositions(newPos);
  }, [icons, generatePositions]);

  useEffect(() => {
    document.title = "Hussain Portfolio | Skills";
    const interval = setInterval(() => {
      setPrevPositions(positions);
      setPositions(generatePositions(icons.length));
    }, 5000);
    return () => clearInterval(interval);
  }, [positions, icons.length, generatePositions]);

  // rotate random service icon
  useEffect(() => {
    if (activeService) return;
    const interval = setInterval(() => {
      setRandomIndex((prev) =>
        services.length > 0 ? (prev + 1) % services.length : 0
      );
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
              src={icon.url}
              alt={`tech-icon-${i}`}
              className="absolute opacity-90 lg:w-[5vw] sm:w-[4vw] md:w-[6vw] max-[700px]:w-[20px]"
              initial={{
                top: prevPositions[i].top,
                left: prevPositions[i].left,
              }}
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

      {/* Skills List */}
      <RevealSection trigger="load">
        <div className="w-full mt-10 flex justify-center">
          <FadeContent className="block w-full ml-[15%]">
            <h3 className="text-green-500 text-5xl max-[1000px]:text-4xl font-bold mb-5">
              Skills & Technologies:
            </h3>
            <ul className="list-disc ml-15 text-gray-300 space-y-3">
              {skList.map((item, i) => (
                <li key={i} className="text-2xl font-light">
                  <span className="text-white font-extrabold mr-2">
                    {item.heading}:
                  </span>
                  {item.list}
                </li>
              ))}
            </ul>
          </FadeContent>
        </div>
      </RevealSection>

      {/* Services */}
      <RevealSection trigger="scroll">
        <div className="w-full flex flex-col gap-6 mt-[6cm] mb-10">
          <FadeContent className="w-90% mx-auto">
            <h3 className="text-green-500 text-5xl font-bold mb-4 text-left">
              Services Offered:
            </h3>

            <div className="relative flex items-start">
              <div className="absolute -left-10 sm:-left-16 top-1/2 transform -translate-y-1/2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService ? activeService.icon : randomIndex}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeService ? (
                      <LazyFaIcon iconName={activeService.icon} />
                    ) : services.length > 0 ? (
                      <LazyFaIcon iconName={services[randomIndex]?.icon} />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              <ul className="ml-12 sm:ml-16 text-left space-y-3">
                {services.map((service, i) => (
                  <li
                    key={i}
                    onMouseEnter={() => setActiveService(service)}
                    onMouseLeave={() => setActiveService(null)}
                    className="list-disc text-2xl font-light cursor-pointer"
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
