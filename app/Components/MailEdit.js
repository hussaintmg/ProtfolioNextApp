"use client";

import React, { useState, useEffect } from "react";

import Tabs from "./Tabs";
import RevealSection from "./RevealSection";
import MailI from "./MailI";
import MailT from "./MailT";

export default function MailEdit() {
  const [activeTab, setActiveTab] = useState("icon");
  const [iconFirstLoad, setIconFirstLoad] = useState(true);

  useEffect(() => {
    if (activeTab !== "icon" && iconFirstLoad) {
      setIconFirstLoad(false);
    }
  }, [activeTab, iconFirstLoad]);

  const tabs = [
    { label: "Icon", value: "icon" },
    { label: "Email", value: "email" },
  ];

  return (
    <div className="mt-[20px]">
      <Tabs tabs={tabs} onChange={(value) => setActiveTab(value)} />
      {activeTab === "icon" && (
        <RevealSection trigger={iconFirstLoad ? "load" : "scroll"}>
          <MailI />
        </RevealSection>
      )}
      {activeTab === "email" && (
        <RevealSection trigger={iconFirstLoad ? "load" : "scroll"}>
          <MailT />
        </RevealSection>
      )}
    </div>
  );
}
