import Tabs from "./Tabs";
import { useState, useEffect } from "react";
import RevealSection from "./RevealSection";
import GreetingEdit from "./GreetingEdit";
import MSBEdits from "./MSBEdits";
import MSEdits from "./MSEdits";
import ProfilePicEdit from "./ProfilePicEdit";
import FOEdit from "./FOEdit";

export default function MainSection() {
  const [activeTab, setActiveTab] = useState("GT");
  const [gtFirstLoad, setGtFirstLoad] = useState(true);

  useEffect(() => {
    if (activeTab !== "GT" && gtFirstLoad) {
      setGtFirstLoad(false);
    }
  }, [activeTab, gtFirstLoad]);

  const tabs = [
    { label: "Greeting Text", value: "GT" },
    { label: "My Self Bold", value: "MSB" },
    { label: "My Self", value: "MS" },
    { label: "Profile Picture", value: "PP" },
    { label: "Freelance On", value: "FO" },
  ];

  return (
    <div className=" ml-[5%] mt-[20px] w-[90%]">
      <h2 className="text-center text-[cornflowerblue] my-[0.5cm] text-3xl font-bold">
        Main Section
      </h2>
      <Tabs tabs={tabs} onChange={(value) => setActiveTab(value)} />

      {activeTab === "GT" && (
        <RevealSection trigger={gtFirstLoad ? "load" : "scroll"}>
          <GreetingEdit />
        </RevealSection>
      )}
      {activeTab === "MSB" && (
        <RevealSection trigger="load">
          <MSBEdits />
        </RevealSection>
      )}
      {activeTab === "MS" && (
        <RevealSection trigger="load">
          <MSEdits />
        </RevealSection>
      )}
      {activeTab === "PP" && (
        <RevealSection trigger="load">
          <ProfilePicEdit />
        </RevealSection>
      )}
      {activeTab === "FO" && (
        <RevealSection trigger="load">
          <FOEdit />
        </RevealSection>
      )}
    </div>
  );
}
