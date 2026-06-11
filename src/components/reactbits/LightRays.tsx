"use client";

import React, { useState, useEffect, useRef } from "react";

interface LightRaysProps {
  raysColor?: string;
  raysOrigin?: "top-center" | "center" | "top-left";
  followMouse?: boolean;
  lightSpread?: number;
  rayLength?: number;
  opacity?: number;
  className?: string;
}

export default function LightRays({
  raysColor = "#FF2E6E",
  raysOrigin = "top-center",
  followMouse = true,
  lightSpread = 0.5,
  rayLength = 3,
  opacity = 0.15,
  className = "",
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 0 });

  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [followMouse]);

  // Determine origin coordinate depending on configuration
  const getOrigin = () => {
    if (followMouse) {
      return `${mousePos.x}% ${mousePos.y}%`;
    }
    switch (raysOrigin) {
      case "top-center":
        return "50% 0%";
      case "center":
        return "50% 50%";
      case "top-left":
        return "0% 0%";
      default:
        return "50% 0%";
    }
  };

  const bgStyle: React.CSSProperties = {
    background: `radial-gradient(circle at ${getOrigin()}, ${raysColor} 0%, rgba(0,0,0,0) ${lightSpread * 100}%)`,
    opacity: opacity,
    height: `${rayLength * 100}%`,
    width: "100%",
    transform: "translateY(-20%)",
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}
    >
      <div style={bgStyle} className="transition-all duration-300 ease-out" />
    </div>
  );
}
