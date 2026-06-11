"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  className?: string;
  disabled?: boolean;
  speed?: number; // speed in seconds
  baseColor?: string;
  shineColor?: string;
}

export default function ShinyText({
  text,
  className = "",
  disabled = false,
  speed = 3,
  baseColor = "rgba(255, 255, 255, 0.55)",
  shineColor = "rgba(255, 255, 255, 1)",
}: ShinyTextProps) {
  const shineStyle: React.CSSProperties = disabled
    ? {}
    : {
        backgroundImage: `linear-gradient(120deg, ${baseColor} 40%, ${shineColor} 50%, ${baseColor} 60%)`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `shiny-text-flow ${speed}s linear infinite`,
      };

  return (
    <>
      <style jsx global>{`
        @keyframes shiny-text-flow {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
      <span
        style={shineStyle}
        className={`inline-block select-none ${
          disabled ? "text-foreground" : ""
        } ${className}`}
      >
        {text}
      </span>
    </>
  );
}
