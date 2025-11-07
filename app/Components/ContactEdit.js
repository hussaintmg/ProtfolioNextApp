"use client";

import React, { useState, useEffect } from "react";

import Tabs from "./Tabs";
import RevealSection from "./RevealSection";
import MailEdit from "./MailEdit";
import PhoneEdit from "./PhoneEdit";
import AddressEdit from "./AddressEdit";

export default function ContactEdit({ activeTab1 }) {
  const [activeTab, setActiveTab] = useState("Mail");
  const [mailFirstLoad, setMailFirstLoad] = useState(true);

  useEffect(() => {
    if (activeTab !== "Mail" && mailFirstLoad) {
      setMailFirstLoad(false);
    }
  }, [activeTab, mailFirstLoad]);

  const tabs = [
    { label: "Mail", value: "Mail" },
    { label: "Phone", value: "Phone" },
    { label: "Address", value: "Address" },
  ];

  return (
    <div className="mt-[20px]">
      <Tabs tabs={tabs} onChange={(value) => setActiveTab(value)} />

      {activeTab === "Mail" && (
        <RevealSection trigger={mailFirstLoad ? "load" : "scroll"}>
          <MailEdit />
        </RevealSection>
      )}
      {activeTab === "Phone" && (
        <RevealSection trigger="scroll">
          <PhoneEdit />
        </RevealSection>
      )}
      {activeTab === "Address" && (
        <RevealSection trigger="scroll">
          <AddressEdit />
        </RevealSection>
      )}
    </div>
  );
}
