"use client";
import React, { Suspense } from "react";

export default function DynamicFaIcon({ iconName, size = 24, color = "#000" }) {
  const Icon = React.lazy(async () => {
    try {
      const icons = await import("react-icons/fa");
      const Component = icons[iconName];
      if (!Component) throw new Error(`Icon "${iconName}" not found`);
      return { default: Component };
    } catch (error) {
      console.error(error);
      return { default: () => <span style={{ color }}>⚠️</span> };
    }
  });

  return (
    <Suspense fallback={<span style={{ width: size, height: size }}>...</span>}>
      <Icon size={size} color={color} />
    </Suspense>
  );
}
