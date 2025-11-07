"use client";

import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import RevealSection from "./RevealSection";
import SkillsIcon from "./SkillsIcons";
import SkillsList from "./SkillsList";

export default function SkillsEdit() {
  const [activeTab, setActiveTab] = useState("icon");
  const [iconFirstLoad, setIconFirstLoad] = useState(true);

  useEffect(() => {
    if (activeTab !== "icon" && iconFirstLoad) {
      setIconFirstLoad(false);
    }
  }, [activeTab, iconFirstLoad]);

  const tabs = [
    { label: "Icon", value: "icon" },
    { label: "List", value: "list" },
  ];
  return (
    <div className="w-[90%] mx-auto">
      <h2 className="text-center text-[cornflowerblue] my-[0.5cm] text-3xl font-bold">
        Skills And Technologies Section
      </h2>
      <Tabs tabs={tabs} onChange={(value) => setActiveTab(value)} />
      {activeTab === "icon" && (
        <RevealSection trigger={iconFirstLoad ? "load" : "scroll"}>
          <SkillsIcon />
        </RevealSection>
      )}
      {activeTab === "list" && (
        <RevealSection trigger="scroll">
          <SkillsList />
        </RevealSection>
      )}
    </div>
  );
}
