"use client";

import { useState, useEffect } from "react";
import SplitText from "./Components/SplitText";
import Self from "./Components/Self";
import RevealSection from "./Components/RevealSection";
import Profone from "./Components/Prof_1";
import Proftwo from "./Components/Prof_2";
import Profthree from "./Components/Prof_3";
import Proffour from "./Components/Prof_4";
import FadeContent from "./Components/FadeContent";

export default function Home() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    document.title = "Hussain's Portfolio | Home";
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let content;
  if (width >= 1200) {
    content = <Profone />;
  } else if (width >= 750) {
    content = <Proftwo />;
  } else if (width >= 250) {
    content = <Profthree />;
  } else {
    content = <Proffour />;
  }

  const FO = [
    { FOI: "Fiverr", FOL: "https://www.fiverr.com/s/Q7VlVY2" }
  ];

  return (
    <div className="Home">
      <div className="wel">
        <SplitText
          text="Welcome"
          className="text-center"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
        />
      </div>
      <RevealSection trigger="load">
        <div className="float-right flex -mt-[4cm]">{content}</div>
      </RevealSection>
      <Self />

      <RevealSection trigger="load">
        <div className="mt-[5cm] flex justify-center">
          <FadeContent
            className="inline-block lg:text-[2rem] md:text-[1.5rem] sm:text-[1rem] text-[1rem]"
            blur={true}
            duration={1500}
            easing="ease-out"
            initialOpacity={0}
          >
            <h3 className="text-[#24ad4a] lg:text-[3rem] md:text-[2.3rem] sm:text-[1.5rem] text-[1.3rem] lg:mb-[0.5cm] mb-0 font-bold">Freelance On:</h3>
            <ul className="lg:ml-[1.5cm] ml-[1cm] list-disc marker:text-white space-y-2">
              {FO && FO.length > 0 ? (
                FO.map((obj, index) => {
                  return (
                    <li key={index}>
                      <a
                        style={{ textDecoration: "none", color: "white" }}
                        href={obj.FOL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {obj.FOI}
                      </a>
                    </li>
                  );
                })
              ) : (
                <p
                  style={{
                    color: "red",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  No link Available
                </p>
              )}
            </ul>
          </FadeContent>
        </div>
      </RevealSection>
    </div>
  );
}
