"use client";

import React from "react";

interface LogoLoopProps {
  items: Array<{ id: string | number; logo: React.ReactNode | string; name?: string }>;
  speed?: number; // Speed in seconds for a full loop
  direction?: "left" | "right";
  className?: string;
}

export default function LogoLoop({
  items,
  speed = 25,
  direction = "left",
  className = "",
}: LogoLoopProps) {
  // Duplicate items to make the loop seamless
  const loopItems = [...items, ...items, ...items];

  return (
    <>
      <style jsx global>{`
        @keyframes logo-loop-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        @keyframes logo-loop-right {
          0% {
            transform: translateX(-33.3333%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
      <div
        className={`w-full overflow-hidden relative flex py-4 select-none ${className}`}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
        }}
      >
        <div
          className="flex whitespace-nowrap gap-16 min-w-full justify-around items-center"
          style={{
            animation: `${
              direction === "left" ? "logo-loop-left" : "logo-loop-right"
            } ${speed}s linear infinite`,
          }}
        >
          {loopItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center justify-center flex-shrink-0 text-muted hover:text-foreground transition-colors duration-200"
            >
              {typeof item.logo === "string" ? (
                <span className="text-xl font-bold tracking-tight opacity-60">
                  {item.logo}
                </span>
              ) : (
                item.logo
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
