"use client";

import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import RevealSection from "./RevealSection";
import ContactEdit from "./ContactEdit";
import SocialMediaAdmin from "./SocialMediaAdmin";

export default function FooterEdit({ savedEmailT }) {
  const [activeTab, setActiveTab] = useState("Contacts");
  const [contactsFirstLoad, setContactsFirstLoad] = useState(true);

  useEffect(() => {
    if (activeTab !== "Contacts" && contactsFirstLoad) {
      setContactsFirstLoad(false);
    }
  }, [activeTab, contactsFirstLoad]);

  const tabs = [
    { label: "Contacts", value: "Contacts" },
    { label: "Social Media", value: "SM" },
  ];

  return (
    <div className=" ml-[5%] mt-[20px] mb-[4cm] w-[90%]">
      <h2 className="text-center text-[cornflowerblue] my-[0.5cm] text-3xl font-bold">
        Footer
      </h2>
      <Tabs tabs={tabs} onChange={(value) => setActiveTab(value)} />

      {activeTab === "Contacts" && (
        <RevealSection trigger={contactsFirstLoad ? "load" : "scroll"}>
          <ContactEdit />
        </RevealSection>
      )}
      {activeTab === "SM" && (
        <RevealSection trigger="scroll">
          <SocialMediaAdmin />
        </RevealSection>
      )}
    </div>
  );
}
