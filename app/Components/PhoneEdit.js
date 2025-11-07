"use client";

import React, { useState, useEffect } from "react";

import Tabs from "./Tabs";
import RevealSection from "./RevealSection";
import PhoneI from "./PhoneI";
import PhoneN from "./PhoneN";

export default function PhoneEdit() {
  const [activeTab, setActiveTab] = useState("icon");
  const [iconFirstLoad, setIconFirstLoad] = useState(true);

  useEffect(() => {
    if (activeTab !== "icon" && iconFirstLoad) {
      setIconFirstLoad(false);
    }
  }, [activeTab, iconFirstLoad]);

  const tabs = [
    { label: "Icon", value: "icon" },
    { label: "Number", value: "number" },
  ];

  return (
    <div className="mt-[20px]">
      <Tabs tabs={tabs} onChange={(value) => setActiveTab(value)} />
      {activeTab === "icon" && (
        <RevealSection trigger={iconFirstLoad ? "load" : "scroll"}>
          <PhoneI />
        </RevealSection>
      )}
      {activeTab === "number" && (
        <RevealSection trigger="scroll">
          <PhoneN />
        </RevealSection>
      )}
    </div>
  );
}
