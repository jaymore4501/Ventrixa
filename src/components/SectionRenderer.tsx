"use client";

import React, { useState } from "react";
import { getBrandStyles } from "@/lib/styles";
import BorderGlow from "@/components/reactbits/BorderGlow";
import {
  Cpu,
  RefreshCw,
  Zap,
  Palette,
  Code,
  TrendingUp,
  Shield,
  Sliders,
  Check,
  Send,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SectionProps {
  type: string;
  variant: string;
  props: Record<string, any>;
  style?: Record<string, any>;
  onElementClick?: (elementId: string) => void;
  selectedElementId?: string;
  brandColors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  canvasView?: "desktop" | "tablet" | "mobile";
}

// Map Lucide icons by name
const IconMap: Record<string, any> = {
  cpu: Cpu,
  "refresh-cw": RefreshCw,
  zap: Zap,
  palette: Palette,
  code: Code,
  "trending-up": TrendingUp,
  shield: Shield,
  sliders: Sliders,
};

export const getResponsiveClasses = (className: string, canvasView?: "desktop" | "tablet" | "mobile") => {
  if (!className) return "";
  if (!canvasView || canvasView === "desktop") return className;

  return className.split(" ").filter(c => {
    if (canvasView === "mobile") {
      return !c.startsWith("sm:") && !c.startsWith("md:") && !c.startsWith("lg:") && !c.startsWith("xl:") && !c.startsWith("2xl:");
    }
    if (canvasView === "tablet") {
      return !c.startsWith("lg:") && !c.startsWith("xl:") && !c.startsWith("2xl:");
    }
    return true;
  }).join(" ");
};

export default function SectionRenderer({
  type,
  variant,
  props,
  style = {},
  onElementClick,
  selectedElementId,
  brandColors,
  canvasView,
}: SectionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const activeBrandColors = brandColors || {
    primary: "#FF2E6E",
    secondary: "#151821",
    background: "#151821",
    text: "#D6DAE2",
    accent: "#FF4E87",
  };

  // Apply custom styling overrides if provided
  const customStyles = {
    ...(brandColors ? getBrandStyles(brandColors) : {}),
    ...(style?.section || {}),
  };

  const r = (className: string) => getResponsiveClasses(className, canvasView);

  const getElementStyle = (elementId: string) => {
    const elStyle = { ...style?.[elementId] };
    if (elStyle.fontSize && /^[0-9]+$/.test(String(elStyle.fontSize).trim())) {
      elStyle.fontSize = `${String(elStyle.fontSize).trim()}px`;
    }
    return elStyle;
  };

  // Elements clicking helper
  const handleClick = (e: React.MouseEvent, elementId: string) => {
    if (onElementClick) {
      e.stopPropagation();
      onElementClick(elementId);
    }
  };

  const isSelected = (elementId: string) => selectedElementId === elementId;
  const selectBorder = (elementId: string) =>
    isSelected(elementId)
      ? "outline outline-2 outline-primary outline-offset-2 rounded"
      : "hover:outline hover:outline-1 hover:outline-primary/50 hover:outline-offset-1 transition-all cursor-pointer";

  // Render components based on type
  switch (type) {
    case "hero": {
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 text-center bg-transparent border-b border-border/40 flex flex-col items-center justify-center">
            {props.image ? (
              <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center")}>
                <div className="space-y-6 text-left">
                  <h1
                    onClick={(e) => handleClick(e, "hero-title")}
                    style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("hero-title") }}
                    className={`${r("text-3xl md:text-5xl")} font-extrabold text-heading leading-tight ${selectBorder("hero-title")}`}
                  >
                    {props.title || "Headline Text"}
                  </h1>
                  <p
                    onClick={(e) => handleClick(e, "hero-subtitle")}
                    style={getElementStyle("hero-subtitle")}
                    className={`text-muted ${r("text-base")} leading-relaxed ${selectBorder("hero-subtitle")}`}
                  >
                    {props.subtitle || "Subtitle explanation text."}
                  </p>
                  {props.ctaText && (
                    <a
                      href={props.ctaLink || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(e, "hero-cta");
                      }}
                      style={getElementStyle("hero-cta")}
                      className={`inline-block border border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-3 rounded-lg transition-all ${selectBorder("hero-cta")}`}
                    >
                      {props.ctaText}
                    </a>
                  )}
                </div>
                <div
                  onClick={(e) => handleClick(e, "hero-image")}
                  style={getElementStyle("hero-image")}
                  className={`relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border ${selectBorder("hero-image")}`}
                >
                  <img src={props.image} alt="Hero illustration" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full text-center space-y-6 py-12">
                <h1
                  onClick={(e) => handleClick(e, "hero-title")}
                  style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("hero-title") }}
                  className={`${r("text-4xl md:text-6xl")} font-extrabold text-heading leading-tight ${selectBorder("hero-title")}`}
                >
                  {props.title || "Headline Text"}
                </h1>
                <p
                  onClick={(e) => handleClick(e, "hero-subtitle")}
                  style={getElementStyle("hero-subtitle")}
                  className={`text-muted ${r("text-lg")} leading-relaxed max-w-2xl mx-auto ${selectBorder("hero-subtitle")}`}
                >
                  {props.subtitle || "Subtitle explanation text."}
                </p>
                {props.ctaText && (
                  <div className="pt-4">
                    <a
                      href={props.ctaLink || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(e, "hero-cta");
                      }}
                      style={getElementStyle("hero-cta")}
                      className={`inline-block border border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-3 rounded-lg transition-all ${selectBorder("hero-cta")}`}
                    >
                      {props.ctaText}
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className={r("py-24 md:py-36 px-8 border-b border-border bg-transparent relative overflow-hidden")}>
            {/* Cyber tech grid lines */}
            {props.showGridLines !== false && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            )}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/25 rounded-full blur-3xl" />
            
            {props.image ? (
              <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10")}>
                <div className="space-y-6 text-left">
                  {props.showBadge !== false && (
                    <span className="inline-block text-[10px] font-mono tracking-widest text-primary bg-primary/10 border border-primary/25 rounded px-2.5 py-1 uppercase">
                      {props.badgeText || "// COGNITIVE EDGE INFERENCE NODE"}
                    </span>
                  )}
                  <h1
                    onClick={(e) => handleClick(e, "hero-title")}
                    style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 20px rgba(255,46,110,0.15)", ...getElementStyle("hero-title") }}
                    className={`${r("text-4xl md:text-5xl lg:text-6xl")} font-black text-heading leading-tight tracking-tight ${selectBorder("hero-title")}`}
                  >
                    {props.title || "Launch Your Business"}
                  </h1>
                  <p
                    onClick={(e) => handleClick(e, "hero-subtitle")}
                    style={getElementStyle("hero-subtitle")}
                    className={`text-muted ${r("text-base")} leading-relaxed font-mono ${selectBorder("hero-subtitle")}`}
                  >
                    {props.subtitle || "AI-powered website blueprint generated in seconds."}
                  </p>
                  {props.ctaText && (
                    <a
                      href={props.ctaLink || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(e, "hero-cta");
                      }}
                      style={getElementStyle("hero-cta")}
                      className={`inline-block bg-primary hover:bg-hover text-white font-bold px-6 py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(255,46,110,0.4)] ${selectBorder("hero-cta")}`}
                    >
                      {props.ctaText}
                    </a>
                  )}
                </div>
                <div
                  onClick={(e) => handleClick(e, "hero-image")}
                  style={getElementStyle("hero-image")}
                  className={`relative aspect-video rounded-xl overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.15)] border border-primary/30 ${selectBorder("hero-image")}`}
                >
                  <img src={props.image} alt="Hero illustration" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full relative z-10 py-12">
                <div className="text-center space-y-6">
                  {props.showBadge !== false && (
                    <span className="inline-block text-[10px] font-mono tracking-widest text-primary bg-primary/10 border border-primary/25 rounded px-2.5 py-1 uppercase">
                      {props.badgeText || "// COGNITIVE EDGE INFERENCE NODE"}
                    </span>
                  )}
                  <h1
                    onClick={(e) => handleClick(e, "hero-title")}
                    style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 20px rgba(255,46,110,0.15)", ...getElementStyle("hero-title") }}
                    className={`${r("text-4xl md:text-5xl lg:text-6xl")} font-black text-heading leading-tight tracking-tight ${selectBorder("hero-title")}`}
                  >
                    {props.title || "Launch Your Business"}
                  </h1>
                  <p
                    onClick={(e) => handleClick(e, "hero-subtitle")}
                    style={getElementStyle("hero-subtitle")}
                    className={`text-muted ${r("text-base sm:text-lg")} leading-relaxed font-mono max-w-2xl mx-auto ${selectBorder("hero-subtitle")}`}
                  >
                    {props.subtitle || "AI-powered website blueprint generated in seconds."}
                  </p>
                  {props.ctaText && (
                    <div className="pt-4">
                      <a
                        href={props.ctaLink || "#"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(e, "hero-cta");
                        }}
                        style={getElementStyle("hero-cta")}
                        className={`inline-block bg-primary hover:bg-hover text-white font-bold px-8 py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(255,46,110,0.4)] ${selectBorder("hero-cta")}`}
                      >
                        {props.ctaText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className={r("py-24 md:py-36 px-8 border-b border-border bg-transparent")}>
            {props.image ? (
              <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center")}>
                <div className="space-y-8 text-left">
                  <h1
                    onClick={(e) => handleClick(e, "hero-title")}
                    style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("hero-title") }}
                    className={`${r("text-4xl md:text-5xl lg:text-6xl")} font-normal leading-tight tracking-wide ${selectBorder("hero-title")}`}
                  >
                    {props.title}
                  </h1>
                  <p
                    onClick={(e) => handleClick(e, "hero-subtitle")}
                    style={getElementStyle("hero-subtitle")}
                    className={`text-[#d4cbb3] ${r("text-base")} leading-relaxed font-serif ${selectBorder("hero-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                  {props.ctaText && (
                    <a
                      href={props.ctaLink || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(e, "hero-cta");
                      }}
                      style={{ border: "1px solid #e8c87c", color: "#e8c87c", ...getElementStyle("hero-cta") }}
                      className={`inline-block hover:bg-[#e8c87c] hover:text-black font-semibold px-8 py-3 rounded-lg transition-all ${selectBorder("hero-cta")}`}
                    >
                      {props.ctaText}
                    </a>
                  )}
                </div>
                <div
                  onClick={(e) => handleClick(e, "hero-image")}
                  style={getElementStyle("hero-image")}
                  className={`relative aspect-video rounded-none overflow-hidden border border-[#e8c87c]/30 p-2 bg-[#1b1915]/50 backdrop-blur-md ${selectBorder("hero-image")}`}
                >
                  <img src={props.image} alt="Hero illustration" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full py-12">
                <div className="text-center space-y-8">
                  <h1
                    onClick={(e) => handleClick(e, "hero-title")}
                    style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("hero-title") }}
                    className={`${r("text-4xl md:text-5xl lg:text-6xl")} font-normal leading-tight tracking-wide ${selectBorder("hero-title")}`}
                  >
                    {props.title}
                  </h1>
                  <p
                    onClick={(e) => handleClick(e, "hero-subtitle")}
                    style={getElementStyle("hero-subtitle")}
                    className={`text-[#d4cbb3] ${r("text-base sm:text-lg")} leading-relaxed font-serif max-w-2xl mx-auto ${selectBorder("hero-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                  {props.ctaText && (
                    <div className="pt-4">
                      <a
                        href={props.ctaLink || "#"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(e, "hero-cta");
                        }}
                        style={{ border: "1px solid #e8c87c", color: "#e8c87c", ...getElementStyle("hero-cta") }}
                        className={`inline-block hover:bg-[#e8c87c] hover:text-black font-semibold px-8 py-4 rounded-lg transition-all ${selectBorder("hero-cta")}`}
                      >
                        {props.ctaText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className={r("py-20 md:py-32 px-8 border-b border-border bg-transparent")}>
            {props.image ? (
              <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center")}>
                <div className="space-y-6 text-left animate-in fade-in slide-in-from-left-4 duration-500">
                  <h1
                    onClick={(e) => handleClick(e, "hero-title")}
                    style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("hero-title") }}
                    className={`${r("text-4xl md:text-6xl")} font-black text-heading leading-tight tracking-tight ${selectBorder("hero-title")}`}
                  >
                    {props.title}
                  </h1>
                  <p
                    onClick={(e) => handleClick(e, "hero-subtitle")}
                    style={getElementStyle("hero-subtitle")}
                    className={`text-muted ${r("text-base")} leading-relaxed ${selectBorder("hero-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                  {props.ctaText && (
                    <a
                      href={props.ctaLink || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(e, "hero-cta");
                      }}
                      style={getElementStyle("hero-cta")}
                      className={`inline-block bg-primary hover:bg-hover text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[5px_5px_0px_#000] border-2 border-black ${selectBorder("hero-cta")}`}
                    >
                      {props.ctaText}
                    </a>
                  )}
                </div>
                <div
                  onClick={(e) => handleClick(e, "hero-image")}
                  style={getElementStyle("hero-image")}
                  className={`relative aspect-video rounded-3xl overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,0.15)] border-4 border-black ${selectBorder("hero-image")}`}
                >
                  <img src={props.image} alt="Hero illustration" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full py-12">
                <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <h1
                    onClick={(e) => handleClick(e, "hero-title")}
                    style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("hero-title") }}
                    className={`${r("text-4xl md:text-6xl")} font-black text-heading leading-tight tracking-tight ${selectBorder("hero-title")}`}
                  >
                    {props.title}
                  </h1>
                  <p
                    onClick={(e) => handleClick(e, "hero-subtitle")}
                    style={getElementStyle("hero-subtitle")}
                    className={`text-muted ${r("text-base sm:text-lg")} leading-relaxed max-w-2xl mx-auto ${selectBorder("hero-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                  {props.ctaText && (
                    <div className="pt-4">
                      <a
                        href={props.ctaLink || "#"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(e, "hero-cta");
                        }}
                        style={getElementStyle("hero-cta")}
                        className={`inline-block bg-primary hover:bg-hover text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[5px_5px_0px_#000] border-2 border-black ${selectBorder("hero-cta")}`}
                      >
                        {props.ctaText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className={r("py-20 md:py-32 px-8 border-b border-border bg-transparent")}>
          {props.image ? (
            <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center")}>
              <div className="space-y-6 text-left">
                <h1
                  onClick={(e) => handleClick(e, "hero-title")}
                  style={getElementStyle("hero-title")}
                  className={`${r("text-4xl md:text-5xl lg:text-6xl")} font-black text-heading leading-tight tracking-tight ${selectBorder("hero-title")}`}
                >
                  {props.title || "Launch Your Business"}
                </h1>
                <p
                  onClick={(e) => handleClick(e, "hero-subtitle")}
                  style={getElementStyle("hero-subtitle")}
                  className={`text-muted ${r("text-base sm:text-lg")} leading-relaxed ${selectBorder("hero-subtitle")}`}
                >
                  {props.subtitle || "AI-powered website generation platform blueprints generated in seconds."}
                </p>
                {props.ctaText && (
                  <a
                    href={props.ctaLink || "#"}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(e, "hero-cta");
                    }}
                    style={getElementStyle("hero-cta")}
                    className={`inline-block bg-primary hover:bg-hover text-white font-bold px-6 py-3.5 rounded-lg transition-all ${selectBorder("hero-cta")}`}
                  >
                    {props.ctaText}
                  </a>
                )}
              </div>
              <div
                onClick={(e) => handleClick(e, "hero-image")}
                style={getElementStyle("hero-image")}
                className={`relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border ${selectBorder("hero-image")}`}
              >
                <img src={props.image} alt="Hero illustration" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full py-12">
              <div className="text-center space-y-6">
                <h1
                  onClick={(e) => handleClick(e, "hero-title")}
                  style={getElementStyle("hero-title")}
                  className={`${r("text-4xl md:text-5xl lg:text-6xl")} font-black text-heading leading-tight tracking-tight ${selectBorder("hero-title")}`}
                >
                  {props.title || "Launch Your Business"}
                </h1>
                <p
                  onClick={(e) => handleClick(e, "hero-subtitle")}
                  style={getElementStyle("hero-subtitle")}
                  className={`text-muted ${r("text-base sm:text-lg")} leading-relaxed max-w-2xl mx-auto ${selectBorder("hero-subtitle")}`}
                >
                  {props.subtitle || "AI-powered website generation platform blueprints generated in seconds."}
                </p>
                {props.ctaText && (
                  <div className="pt-4">
                    <a
                      href={props.ctaLink || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(e, "hero-cta")}
                      }
                      style={getElementStyle("hero-cta")}
                      className={`inline-block bg-primary hover:bg-hover text-white font-bold px-6 py-3.5 rounded-lg transition-all ${selectBorder("hero-cta")}`}
                    >
                      {props.ctaText}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      );
    }

    case "features": {
      const items = props.items || [];
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border/40 bg-transparent text-center">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <h2
                  onClick={(e) => handleClick(e, "features-title")}
                  style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("features-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal text-heading ${selectBorder("features-title")}`}
                >
                  {props.title || "Features"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "features-subtitle")}
                    style={getElementStyle("features-subtitle")}
                    className={`text-muted text-xs sm:text-sm mt-4 max-w-2xl mx-auto font-serif ${selectBorder("features-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-3 gap-12")}>
                {items.map((item: any, idx: number) => {
                  const IconComponent = IconMap[item.icon] || Cpu;
                  return (
                    <div
                      key={idx}
                      onClick={(e) => handleClick(e, `feature-item-${idx}`)}
                      style={getElementStyle(`feature-item-${idx}`)}
                      className={`bg-transparent border-0 p-2 text-left hover:opacity-85 transition-all ${selectBorder(`feature-item-${idx}`)}`}
                    >
                      <IconComponent className="w-6 h-6 text-primary mb-4" />
                      <h4 className="text-heading font-semibold text-lg mb-2">{item.title}</h4>
                      <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0a0a0f] text-center relative overflow-hidden">
            {props.showGridLines !== false && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            )}
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="mb-16">
                <h2
                  onClick={(e) => handleClick(e, "features-title")}
                  style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 15px rgba(255,46,110,0.15)", ...getElementStyle("features-title") }}
                  className={`${r("text-2xl md:text-4xl")} font-black tracking-tight text-heading uppercase ${selectBorder("features-title")}`}
                >
                  {props.title || "Features"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "features-subtitle")}
                    style={getElementStyle("features-subtitle")}
                    className={`text-muted text-xs font-mono mt-3 max-w-2xl mx-auto ${selectBorder("features-subtitle")}`}
                  >
                    // {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-3 gap-8")}>
                {items.map((item: any, idx: number) => {
                  const IconComponent = IconMap[item.icon] || Cpu;
                  return (
                    <div
                      key={idx}
                      onClick={(e) => handleClick(e, `feature-item-${idx}`)}
                      style={getElementStyle(`feature-item-${idx}`)}
                      className={`bg-[#0f0f16]/85 backdrop-blur-md border border-primary/20 p-6 rounded-xl text-left hover:border-primary hover:shadow-[0_0_15px_rgba(255,46,110,0.15)] transition-all ${selectBorder(`feature-item-${idx}`)}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mb-4">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h4 style={{ fontFamily: "'Space Grotesque', sans-serif" }} className="text-heading font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-muted text-xs sm:text-sm leading-relaxed font-mono">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0f0e0b] text-center">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <h2
                  onClick={(e) => handleClick(e, "features-title")}
                  style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("features-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide ${selectBorder("features-title")}`}
                >
                  {props.title || "Features"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "features-subtitle")}
                    style={getElementStyle("features-subtitle")}
                    className={`text-[#d4cbb3] text-xs sm:text-sm mt-4 max-w-2xl mx-auto font-serif italic ${selectBorder("features-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-3 gap-10")}>
                {items.map((item: any, idx: number) => {
                  const IconComponent = IconMap[item.icon] || Cpu;
                  return (
                    <div
                      key={idx}
                      onClick={(e) => handleClick(e, `feature-item-${idx}`)}
                      style={getElementStyle(`feature-item-${idx}`)}
                      className={`bg-[#1a1814]/40 border border-[#e8c87c]/20 p-8 rounded-none text-left transition-all hover:bg-[#1a1814]/70 ${selectBorder(`feature-item-${idx}`)}`}
                    >
                      <IconComponent className="w-6 h-6 text-[#e8c87c] mb-5" />
                      <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c" }} className="font-normal text-lg mb-2.5">{item.title}</h4>
                      <p className="text-[#d4cbb3] text-xs sm:text-sm leading-relaxed font-serif">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className="py-20 px-8 border-b border-border bg-gradient-to-br from-purple-500/5 to-pink-500/5 text-center">
            <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                <h2
                  onClick={(e) => handleClick(e, "features-title")}
                  style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("features-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading ${selectBorder("features-title")}`}
                >
                  {props.title || "Features"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "features-subtitle")}
                    style={getElementStyle("features-subtitle")}
                    className={`text-muted text-sm mt-4 max-w-2xl mx-auto font-medium ${selectBorder("features-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-3 gap-8")}>
                {items.map((item: any, idx: number) => {
                  const IconComponent = IconMap[item.icon] || Cpu;
                  return (
                    <div
                      key={idx}
                      onClick={(e) => handleClick(e, `feature-item-${idx}`)}
                      style={getElementStyle(`feature-item-${idx}`)}
                      className={`bg-card border-3 border-black p-6 rounded-2xl text-left shadow-[5px_5px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all ${selectBorder(`feature-item-${idx}`)}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#ff2e6e] border-2 border-black text-white flex items-center justify-center mb-5 shadow-[2px_2px_0px_#000]">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h4 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-heading font-extrabold text-lg mb-2">{item.title}</h4>
                      <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className="py-20 px-8 border-b border-border bg-card/10 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2
                onClick={(e) => handleClick(e, "features-title")}
                style={getElementStyle("features-title")}
                className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading ${selectBorder("features-title")}`}
              >
                {props.title || "Features"}
              </h2>
              <p
                onClick={(e) => handleClick(e, "features-subtitle")}
                style={getElementStyle("features-subtitle")}
                className={`text-muted text-sm mt-3 max-w-2xl mx-auto ${selectBorder("features-subtitle")}`}
              >
                {props.subtitle}
              </p>
            </div>

            <div className={r("grid grid-cols-1 md:grid-cols-3 gap-8")}>
              {items.map((item: any, idx: number) => {
                const IconComponent = IconMap[item.icon] || Cpu;
                return (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `feature-item-${idx}`)}
                    style={getElementStyle(`feature-item-${idx}`)}
                    className={`bg-card/40 border border-border p-6 rounded-xl text-left hover:border-primary/40 transition-colors ${selectBorder(`feature-item-${idx}`)}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="text-heading font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case "benefits": {
      const items = props.items || [];
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border/40 bg-transparent">
            <div className="max-w-5xl mx-auto space-y-20">
              <div className="text-center">
                <h2
                  onClick={(e) => handleClick(e, "benefits-title")}
                  style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("benefits-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal text-heading ${selectBorder("benefits-title")}`}
                >
                  {props.title || "Why Us"}
                </h2>
              </div>

              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={(e) => handleClick(e, `benefit-item-${idx}`)}
                  style={getElementStyle(`benefit-item-${idx}`)}
                  className={`${r("grid grid-cols-1 md:grid-cols-2")} gap-12 items-center pb-10 border-b border-border/20 last:border-b-0 last:pb-0 ${selectBorder(`benefit-item-${idx}`)}`}
                >
                  <div className={`space-y-4 ${idx % 2 === 1 ? r("md:order-2") : ""}`}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-heading text-2xl font-normal">{item.title}</h3>
                    <p className="text-muted leading-relaxed text-sm sm:text-base font-serif">{item.desc}</p>
                  </div>
                  {item.image && (
                    <div className="relative aspect-video rounded-none overflow-hidden border border-border/50">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0a0a0f] relative overflow-hidden">
            {props.showGridLines !== false && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            )}
            <div className="max-w-5xl mx-auto space-y-20 relative z-10">
              <div className="text-center">
                <h2
                  onClick={(e) => handleClick(e, "benefits-title")}
                  style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 15px rgba(255,46,110,0.15)", ...getElementStyle("benefits-title") }}
                  className={`${r("text-2xl md:text-4xl")} font-black tracking-tight text-heading uppercase ${selectBorder("benefits-title")}`}
                >
                  {props.title || "Why Us"}
                </h2>
              </div>

              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={(e) => handleClick(e, `benefit-item-${idx}`)}
                  style={getElementStyle(`benefit-item-${idx}`)}
                  className={`${r("grid grid-cols-1 md:grid-cols-2")} gap-12 items-center ${selectBorder(`benefit-item-${idx}`)}`}
                >
                  <div className={`space-y-4 ${idx % 2 === 1 ? r("md:order-2") : ""}`}>
                    <span className="text-[10px] font-mono tracking-widest text-primary">// CORE SPECIFICATION {idx + 1}</span>
                    <h3 style={{ fontFamily: "'Space Grotesque', sans-serif" }} className="text-heading text-2xl font-bold uppercase tracking-tight">{item.title}</h3>
                    <p className="text-muted leading-relaxed text-xs sm:text-sm font-mono">{item.desc}</p>
                  </div>
                  {item.image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_20px_rgba(255,46,110,0.1)]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0f0e0b]">
            <div className="max-w-5xl mx-auto space-y-24">
              <div className="text-center">
                <h2
                  onClick={(e) => handleClick(e, "benefits-title")}
                  style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("benefits-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide ${selectBorder("benefits-title")}`}
                >
                  {props.title || "Why Us"}
                </h2>
              </div>

              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={(e) => handleClick(e, `benefit-item-${idx}`)}
                  style={getElementStyle(`benefit-item-${idx}`)}
                  className={`${r("grid grid-cols-1 md:grid-cols-2")} gap-16 items-center ${selectBorder(`benefit-item-${idx}`)}`}
                >
                  <div className={`space-y-6 ${idx % 2 === 1 ? r("md:order-2") : ""}`}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c" }} className="font-normal text-2xl tracking-wide">{item.title}</h3>
                    <p className="text-[#d4cbb3] leading-relaxed text-sm sm:text-base font-serif">{item.desc}</p>
                  </div>
                  {item.image && (
                    <div className="relative aspect-video rounded-none overflow-hidden border border-[#e8c87c]/30 p-2 bg-[#1b1915]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className="py-20 px-8 border-b border-border bg-gradient-to-tr from-purple-500/5 via-transparent to-pink-500/5">
            <div className="max-w-5xl mx-auto space-y-20">
              <div className="text-center">
                <h2
                  onClick={(e) => handleClick(e, "benefits-title")}
                  style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("benefits-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading ${selectBorder("benefits-title")}`}
                >
                  {props.title || "Why Us"}
                </h2>
              </div>

              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={(e) => handleClick(e, `benefit-item-${idx}`)}
                  style={getElementStyle(`benefit-item-${idx}`)}
                  className={`${r("grid grid-cols-1 md:grid-cols-2")} gap-12 items-center ${selectBorder(`benefit-item-${idx}`)}`}
                >
                  <div className={`space-y-4 ${idx % 2 === 1 ? r("md:order-2") : ""}`}>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-heading text-2xl font-extrabold">{item.title}</h3>
                    <p className="text-muted leading-relaxed text-sm sm:text-base font-medium">{item.desc}</p>
                  </div>
                  {item.image && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.15)]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className="py-20 px-8 border-b border-border">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center">
              <h2
                onClick={(e) => handleClick(e, "benefits-title")}
                style={getElementStyle("benefits-title")}
                className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading ${selectBorder("benefits-title")}`}
              >
                {props.title || "Why Us"}
              </h2>
            </div>

            {items.map((item: any, idx: number) => (
              <div
                key={idx}
                onClick={(e) => handleClick(e, `benefit-item-${idx}`)}
                style={getElementStyle(`benefit-item-${idx}`)}
                className={`${r("grid grid-cols-1 md:grid-cols-2")} gap-10 items-center ${selectBorder(`benefit-item-${idx}`)}`}
              >
                <div className={`space-y-4 ${idx % 2 === 1 ? r("md:order-2") : ""}`}>
                  <h3 className="text-heading text-2xl font-bold">{item.title}</h3>
                  <p className="text-muted leading-relaxed text-sm sm:text-base">{item.desc}</p>
                </div>
                {item.image && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-border shadow-lg">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "services": {
      const items = props.items || [];
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border/40 bg-transparent">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "services-title")}
                  style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("services-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal text-heading ${selectBorder("services-title")}`}
                >
                  {props.title || "Our Services"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "services-subtitle")}
                    style={getElementStyle("services-subtitle")}
                    className={`text-muted text-xs sm:text-sm mt-4 max-w-2xl mx-auto font-serif ${selectBorder("services-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-3 gap-10")}>
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `service-item-${idx}`)}
                    style={getElementStyle(`service-item-${idx}`)}
                    className={`border-b border-border/40 pb-8 pt-2 text-left bg-transparent rounded-none flex flex-col justify-between min-h-[160px] ${selectBorder(`service-item-${idx}`)}`}
                  >
                    <div>
                      <h4 className="text-heading font-semibold text-lg mb-2">{item.title}</h4>
                      <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="text-primary font-bold text-sm mt-4">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0a0a0f]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "services-title")}
                  style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 15px rgba(255,46,110,0.15)", ...getElementStyle("services-title") }}
                  className={`${r("text-2xl md:text-4xl")} font-black tracking-tight text-heading uppercase ${selectBorder("services-title")}`}
                >
                  {props.title || "Our Services"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "services-subtitle")}
                    style={getElementStyle("services-subtitle")}
                    className={`text-muted text-xs font-mono mt-3 ${selectBorder("services-subtitle")}`}
                  >
                    // {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")}>
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `service-item-${idx}`)}
                    style={getElementStyle(`service-item-${idx}`)}
                    className={`bg-[#0f0f16]/60 border border-primary/20 p-6 rounded-xl flex flex-col justify-between hover:border-primary hover:shadow-[0_0_15px_rgba(255,46,110,0.15)] transition-all ${selectBorder(`service-item-${idx}`)}`}
                  >
                    <div>
                      <h4 style={{ fontFamily: "'Space Grotesque', sans-serif" }} className="text-heading font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-muted text-xs sm:text-sm leading-relaxed font-mono">{item.desc}</p>
                    </div>
                    <div className="text-accent font-mono text-sm tracking-wider uppercase mt-6">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0f0e0b]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "services-title")}
                  style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("services-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide ${selectBorder("services-title")}`}
                >
                  {props.title || "Our Services"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "services-subtitle")}
                    style={getElementStyle("services-subtitle")}
                    className={`text-[#d4cbb3] text-xs sm:text-sm mt-4 font-serif italic ${selectBorder("services-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")}>
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `service-item-${idx}`)}
                    style={getElementStyle(`service-item-${idx}`)}
                    className={`bg-[#1a1814]/40 border border-[#e8c87c]/30 p-8 rounded-none flex flex-col justify-between hover:bg-[#1a1814]/75 transition-colors ${selectBorder(`service-item-${idx}`)}`}
                  >
                    <div>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c" }} className="font-normal text-lg mb-2.5">{item.title}</h4>
                      <p className="text-[#d4cbb3] text-xs sm:text-sm leading-relaxed font-serif">{item.desc}</p>
                    </div>
                    <div className="text-[#e8c87c] font-serif text-lg mt-6">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className="py-20 px-8 border-b border-border bg-background">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "services-title")}
                  style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("services-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading ${selectBorder("services-title")}`}
                >
                  {props.title || "Our Services"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "services-subtitle")}
                    style={getElementStyle("services-subtitle")}
                    className={`text-muted text-sm mt-4 font-medium ${selectBorder("services-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")}>
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `service-item-${idx}`)}
                    style={getElementStyle(`service-item-${idx}`)}
                    className={`bg-card border-3 border-black p-6 rounded-2xl flex flex-col justify-between shadow-[5px_5px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all ${selectBorder(`service-item-${idx}`)}`}
                  >
                    <div>
                      <h4 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-heading font-extrabold text-lg mb-2">{item.title}</h4>
                      <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="text-primary font-black text-xl mt-6">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className="py-20 px-8 border-b border-border bg-card/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                onClick={(e) => handleClick(e, "services-title")}
                style={getElementStyle("services-title")}
                className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading ${selectBorder("services-title")}`}
              >
                {props.title || "Our Services"}
              </h2>
              <p
                onClick={(e) => handleClick(e, "services-subtitle")}
                style={getElementStyle("services-subtitle")}
                className={`text-muted text-sm mt-3 ${selectBorder("services-subtitle")}`}
              >
                {props.subtitle}
              </p>
            </div>

            <div className={r("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")}>
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={(e) => handleClick(e, `service-item-${idx}`)}
                  style={getElementStyle(`service-item-${idx}`)}
                  className={`bg-card border border-border p-6 rounded-xl flex flex-col justify-between ${selectBorder(`service-item-${idx}`)}`}
                >
                  <div>
                    <h4 className="text-heading font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-muted text-sm leading-relaxed mb-4">{item.desc}</p>
                  </div>
                  <div className="text-primary font-bold text-lg">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "pricing": {
      const tiers = props.tiers || [];
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} id="pricing" className="py-24 px-8 border-b border-border/40 bg-transparent">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "pricing-title")}
                  style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("pricing-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal text-heading ${selectBorder("pricing-title")}`}
                >
                  {props.title || "Pricing Plans"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "pricing-subtitle")}
                    style={getElementStyle("pricing-subtitle")}
                    className={`text-muted text-xs sm:text-sm mt-4 font-serif ${selectBorder("pricing-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch")}>
                {tiers.map((tier: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `pricing-tier-${idx}`)}
                    style={getElementStyle(`pricing-tier-${idx}`)}
                    className={`border border-border/60 p-8 flex flex-col justify-between h-full bg-transparent rounded-none ${selectBorder(`pricing-tier-${idx}`)}`}
                  >
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-heading font-normal text-xl">{tier.name}</h3>
                      <div className="mt-4 flex items-baseline gap-1 text-heading">
                        <span className="text-3xl font-light">{tier.price}</span>
                        {tier.period && <span className="text-muted text-xs">/ {tier.period}</span>}
                      </div>

                      <ul className="mt-8 space-y-4">
                        {tier.features?.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-2 text-xs text-muted">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="mt-8 w-full border border-foreground text-foreground hover:bg-foreground hover:text-background text-xs font-bold py-2.5 rounded-none transition-all">
                      Get Started
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} id="pricing" className="py-24 px-8 border-b border-border bg-[#0f0e0b]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "pricing-title")}
                  style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("pricing-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide ${selectBorder("pricing-title")}`}
                >
                  {props.title || "Pricing Plans"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "pricing-subtitle")}
                    style={getElementStyle("pricing-subtitle")}
                    className={`text-[#d4cbb3] text-xs sm:text-sm mt-4 font-serif italic ${selectBorder("pricing-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch")}>
                {tiers.map((tier: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `pricing-tier-${idx}`)}
                    style={getElementStyle(`pricing-tier-${idx}`)}
                    className={`border border-[#e8c87c]/30 p-8 flex flex-col justify-between h-full bg-[#161411]/50 rounded-none ${selectBorder(`pricing-tier-${idx}`)}`}
                  >
                    <div>
                      {tier.popular && (
                        <span style={{ border: "1px solid #e8c87c", color: "#e8c87c" }} className="text-[9px] font-serif uppercase px-2 py-0.5 rounded-none tracking-widest inline-block mb-4">
                          Recommended
                        </span>
                      )}
                      <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c" }} className="font-normal text-xl tracking-wide">{tier.name}</h3>
                      <div className="mt-4 flex items-baseline gap-1 text-[#e8c87c]">
                        <span className="text-3xl font-serif">{tier.price}</span>
                        {tier.period && <span className="text-[#d4cbb3] text-xs">/ {tier.period}</span>}
                      </div>

                      <ul className="mt-6 space-y-3.5">
                        {tier.features?.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-2 text-xs text-[#d4cbb3]">
                            <span className="w-1.5 h-1.5 bg-[#e8c87c] flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button style={{ border: "1px solid #e8c87c", color: "#e8c87c" }} className="mt-8 w-full hover:bg-[#e8c87c] hover:text-black text-xs font-serif py-2.5 rounded-none transition-all">
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} id="pricing" className="py-20 px-8 border-b border-border bg-background">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "pricing-title")}
                  style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("pricing-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading ${selectBorder("pricing-title")}`}
                >
                  {props.title || "Pricing Plans"}
                </h2>
                {props.subtitle && (
                  <p
                    onClick={(e) => handleClick(e, "pricing-subtitle")}
                    style={getElementStyle("pricing-subtitle")}
                    className={`text-muted text-sm mt-4 font-medium ${selectBorder("pricing-subtitle")}`}
                  >
                    {props.subtitle}
                  </p>
                )}
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch")}>
                {tiers.map((tier: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `pricing-tier-${idx}`)}
                    style={getElementStyle(`pricing-tier-${idx}`)}
                    className={`border-3 border-black p-8 flex flex-col justify-between h-full bg-card rounded-3xl shadow-[5px_5px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all ${selectBorder(`pricing-tier-${idx}`)}`}
                  >
                    <div>
                      {tier.popular && (
                        <span className="text-[10px] bg-accent border-2 border-black text-black font-extrabold uppercase px-3 py-1 rounded-full tracking-wider inline-block mb-4 shadow-[2px_2px_0px_#000]">
                          Popular
                        </span>
                      )}
                      <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-heading font-extrabold text-xl">{tier.name}</h3>
                      <div className="mt-4 flex items-baseline gap-1 text-heading">
                        <span className="text-3xl font-black">{tier.price}</span>
                        {tier.period && <span className="text-muted text-xs font-semibold">/ {tier.period}</span>}
                      </div>

                      <ul className="mt-6 space-y-3.5">
                        {tier.features?.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-2.5 text-sm text-muted font-medium">
                            <Check className="w-4 h-4 text-primary border-2 border-black rounded bg-white flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="mt-8 w-full bg-primary border-2 border-black hover:bg-hover text-white text-xs font-bold py-3 rounded-xl shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all">
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} id="pricing" className="py-20 px-8 border-b border-border bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                onClick={(e) => handleClick(e, "pricing-title")}
                style={getElementStyle("pricing-title")}
                className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading ${selectBorder("pricing-title")}`}
              >
                {props.title || "Pricing Plans"}
              </h2>
              <p
                onClick={(e) => handleClick(e, "pricing-subtitle")}
                style={getElementStyle("pricing-subtitle")}
                className={`text-muted text-sm mt-3 ${selectBorder("pricing-subtitle")}`}
              >
                {props.subtitle}
              </p>
            </div>

            <div className={r("grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch")}>
              {tiers.map((tier: any, idx: number) => (
                <BorderGlow
                  key={idx}
                  glowColor={activeBrandColors.primary}
                  backgroundColor={activeBrandColors.secondary}
                  borderRadius={16}
                  glowRadius={45}
                  glowIntensity={tier.popular ? 0.5 : 0.25}
                  colors={[activeBrandColors.primary, activeBrandColors.accent || activeBrandColors.primary, activeBrandColors.secondary]}
                  className="h-full"
                  style={{
                    borderColor: tier.popular ? activeBrandColors.primary : "var(--border)",
                    borderWidth: tier.popular ? "2px" : "1px",
                    boxShadow: tier.popular ? `0 0 15px rgba(255, 46, 110, 0.25)` : undefined
                  } as any}
                >
                  <div
                    onClick={(e) => handleClick(e, `pricing-tier-${idx}`)}
                    style={getElementStyle(`pricing-tier-${idx}`)}
                    className={`p-8 flex flex-col justify-between h-full cursor-pointer ${selectBorder(`pricing-tier-${idx}`)}`}
                  >
                    <div>
                      {tier.popular && (
                        <span className="text-[10px] bg-primary text-white font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider self-start inline-block mb-4">
                          Popular
                        </span>
                      )}
                      <h3 className="text-heading font-bold text-xl">{tier.name}</h3>
                      <div className="mt-4 flex items-baseline gap-1 text-heading">
                        <span className="text-3xl font-black">{tier.price}</span>
                        {tier.period && <span className="text-muted text-xs">/ {tier.period}</span>}
                      </div>

                      <ul className="mt-6 space-y-3.5">
                        {tier.features?.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-2 text-xs text-muted">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="mt-8 w-full bg-primary hover:bg-hover text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
                      Get Started
                    </button>
                  </div>
                </BorderGlow>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "testimonials": {
      const items = props.items || [];
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border/40 bg-transparent">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "testimonials-title")}
                  style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("testimonials-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal text-heading ${selectBorder("testimonials-title")}`}
                >
                  {props.title || "Client Stories"}
                </h2>
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-2 gap-12")}>
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `testimonial-item-${idx}`)}
                    style={getElementStyle(`testimonial-item-${idx}`)}
                    className={`bg-transparent border-0 p-4 flex flex-col justify-between ${selectBorder(`testimonial-item-${idx}`)}`}
                  >
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-muted italic text-base leading-relaxed mb-6">"{item.quote}"</p>
                    <div className="flex items-center gap-3">
                      {item.avatar && (
                        <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full border border-border/60" />
                      )}
                      <div>
                        <h5 className="text-heading font-semibold text-sm">{item.name}</h5>
                        <span className="text-muted text-xs">{item.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0a0a0f] relative overflow-hidden">
            {props.showGridLines !== false && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            )}
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "testimonials-title")}
                  style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 15px rgba(255,46,110,0.15)", ...getElementStyle("testimonials-title") }}
                  className={`${r("text-2xl md:text-4xl")} font-black tracking-tight text-heading uppercase ${selectBorder("testimonials-title")}`}
                >
                  {props.title || "Client Stories"}
                </h2>
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-2 gap-8")}>
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `testimonial-item-${idx}`)}
                    style={getElementStyle(`testimonial-item-${idx}`)}
                    className={`bg-[#0f0f16]/70 border border-primary/20 p-6 rounded-xl flex flex-col justify-between hover:border-primary hover:shadow-[0_0_15px_rgba(255,46,110,0.1)] transition-colors ${selectBorder(`testimonial-item-${idx}`)}`}
                  >
                    <p className="text-muted italic text-xs sm:text-sm font-mono leading-relaxed mb-6">// "{item.quote}"</p>
                    <div className="flex items-center gap-3">
                      {item.avatar && (
                        <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full border border-primary/40" />
                      )}
                      <div>
                        <h5 style={{ fontFamily: "'Space Grotesque', sans-serif" }} className="text-heading font-bold text-sm uppercase">{item.name}</h5>
                        <span className="text-muted text-xs font-mono">{item.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0f0e0b]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "testimonials-title")}
                  style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("testimonials-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide ${selectBorder("testimonials-title")}`}
                >
                  {props.title || "Client Stories"}
                </h2>
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-2 gap-12")}>
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `testimonial-item-${idx}`)}
                    style={getElementStyle(`testimonial-item-${idx}`)}
                    className={`bg-[#1a1814]/40 border border-[#e8c87c]/20 p-8 rounded-none flex flex-col justify-between ${selectBorder(`testimonial-item-${idx}`)}`}
                  >
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#d4cbb3" }} className="italic text-base leading-relaxed mb-6">"{item.quote}"</p>
                    <div className="flex items-center gap-3">
                      {item.avatar && (
                        <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-none border border-[#e8c87c]/30 p-0.5 bg-[#1b1915]" />
                      )}
                      <div>
                        <h5 style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c" }} className="font-normal text-sm tracking-wide">{item.name}</h5>
                        <span className="text-[#d4cbb3] text-xs font-serif">{item.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className="py-20 px-8 border-b border-border bg-background">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "testimonials-title")}
                  style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("testimonials-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading ${selectBorder("testimonials-title")}`}
                >
                  {props.title || "Client Stories"}
                </h2>
              </div>

              <div className={r("grid grid-cols-1 md:grid-cols-2 gap-8")}>
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={(e) => handleClick(e, `testimonial-item-${idx}`)}
                    style={getElementStyle(`testimonial-item-${idx}`)}
                    className={`bg-card border-3 border-black p-6 rounded-2xl flex flex-col justify-between shadow-[5px_5px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all ${selectBorder(`testimonial-item-${idx}`)}`}
                  >
                    <p className="text-muted italic text-sm leading-relaxed mb-6">"{item.quote}"</p>
                    <div className="flex items-center gap-3">
                      {item.avatar && (
                        <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full border-2 border-black" />
                      )}
                      <div>
                        <h5 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-heading font-extrabold text-sm">{item.name}</h5>
                        <span className="text-muted text-xs font-semibold">{item.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className="py-20 px-8 border-b border-border bg-card/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                onClick={(e) => handleClick(e, "testimonials-title")}
                style={getElementStyle("testimonials-title")}
                className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading ${selectBorder("testimonials-title")}`}
              >
                {props.title || "Client Stories"}
              </h2>
              <p
                onClick={(e) => handleClick(e, "testimonials-subtitle")}
                style={getElementStyle("testimonials-subtitle")}
                className={`text-muted text-sm mt-3 ${selectBorder("testimonials-subtitle")}`}
              >
                {props.subtitle}
              </p>
            </div>

            <div className={r("grid grid-cols-1 md:grid-cols-2 gap-8")}>
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={(e) => handleClick(e, `testimonial-item-${idx}`)}
                  style={getElementStyle(`testimonial-item-${idx}`)}
                  className={`bg-card/60 border border-border p-6 rounded-xl flex flex-col justify-between ${selectBorder(`testimonial-item-${idx}`)}`}
                >
                  <p className="text-muted italic text-sm leading-relaxed mb-6">"{item.quote}"</p>
                  <div className="flex items-center gap-3">
                    {item.avatar && (
                      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full border border-border" />
                    )}
                    <div>
                      <h5 className="text-heading font-bold text-sm">{item.name}</h5>
                      <span className="text-muted text-xs">{item.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "faq": {
      const items = props.items || [];
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border/40 bg-transparent">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "faq-title")}
                  style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("faq-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal text-heading ${selectBorder("faq-title")}`}
                >
                  {props.title || "FAQs"}
                </h2>
              </div>

              <div className="space-y-4">
                {items.map((item: any, idx: number) => {
                  const open = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFaq(open ? null : idx);
                        handleClick(e, `faq-item-${idx}`);
                      }}
                      style={getElementStyle(`faq-item-${idx}`)}
                      className={`border-b border-border/40 rounded-none p-5 bg-transparent cursor-pointer ${selectBorder(`faq-item-${idx}`)}`}
                    >
                      <div className="flex items-center justify-between text-heading font-semibold text-sm">
                        <span>{item.q}</span>
                        {open ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                      </div>
                      {open && (
                        <p className="text-muted text-xs sm:text-sm mt-3.5 leading-relaxed pt-2 font-serif">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0a0a0f] relative overflow-hidden">
            {props.showGridLines !== false && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            )}
            <div className="max-w-3xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "faq-title")}
                  style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 15px rgba(255,46,110,0.15)", ...getElementStyle("faq-title") }}
                  className={`${r("text-2xl md:text-4xl")} font-black tracking-tight text-heading uppercase ${selectBorder("faq-title")}`}
                >
                  {props.title || "FAQs"}
                </h2>
              </div>

              <div className="space-y-4">
                {items.map((item: any, idx: number) => {
                  const open = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFaq(open ? null : idx);
                        handleClick(e, `faq-item-${idx}`);
                      }}
                      style={getElementStyle(`faq-item-${idx}`)}
                      className={`bg-[#0f0f16]/60 border border-primary/20 rounded-xl p-5 cursor-pointer hover:border-primary transition-colors ${selectBorder(`faq-item-${idx}`)}`}
                    >
                      <div className="flex items-center justify-between text-heading font-bold text-sm uppercase tracking-tight font-mono">
                        <span>// {item.q}</span>
                        {open ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary/45" />}
                      </div>
                      {open && (
                        <p className="text-muted text-xs mt-4 leading-relaxed pt-3 border-t border-primary/10 font-mono">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0f0e0b]">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "faq-title")}
                  style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("faq-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide ${selectBorder("faq-title")}`}
                >
                  {props.title || "FAQs"}
                </h2>
              </div>

              <div className="space-y-4">
                {items.map((item: any, idx: number) => {
                  const open = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFaq(open ? null : idx);
                        handleClick(e, `faq-item-${idx}`);
                      }}
                      style={getElementStyle(`faq-item-${idx}`)}
                      className={`bg-[#1a1814]/40 border border-[#e8c87c]/30 rounded-none p-6 cursor-pointer ${selectBorder(`faq-item-${idx}`)}`}
                    >
                      <div style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c" }} className="flex items-center justify-between text-sm tracking-wide">
                        <span>{item.q}</span>
                        {open ? <ChevronUp className="w-4 h-4 text-[#e8c87c]" /> : <ChevronDown className="w-4 h-4 text-[#d4cbb3]" />}
                      </div>
                      {open && (
                        <p className="text-[#d4cbb3] text-xs sm:text-sm mt-4 leading-relaxed pt-3 border-t border-[#e8c87c]/10 font-serif">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className="py-20 px-8 border-b border-border bg-background">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2
                  onClick={(e) => handleClick(e, "faq-title")}
                  style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("faq-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading ${selectBorder("faq-title")}`}
                >
                  {props.title || "FAQs"}
                </h2>
              </div>

              <div className="space-y-4">
                {items.map((item: any, idx: number) => {
                  const open = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFaq(open ? null : idx);
                        handleClick(e, `faq-item-${idx}`);
                      }}
                      style={getElementStyle(`faq-item-${idx}`)}
                      className={`bg-card border-3 border-black rounded-2xl p-5 cursor-pointer shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all ${selectBorder(`faq-item-${idx}`)}`}
                    >
                      <div style={{ fontFamily: "'Outfit', sans-serif" }} className="flex items-center justify-between text-heading font-extrabold text-sm sm:text-base">
                        <span>{item.q}</span>
                        {open ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                      </div>
                      {open && (
                        <p className="text-muted text-sm mt-4 leading-relaxed pt-3 border-t-2 border-black">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className="py-20 px-8 border-b border-border">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2
                onClick={(e) => handleClick(e, "faq-title")}
                style={getElementStyle("faq-title")}
                className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading ${selectBorder("faq-title")}`}
              >
                {props.title || "FAQs"}
              </h2>
              <p
                onClick={(e) => handleClick(e, "faq-subtitle")}
                style={getElementStyle("faq-subtitle")}
                className={`text-muted text-sm mt-3 ${selectBorder("faq-subtitle")}`}
              >
                {props.subtitle}
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item: any, idx: number) => {
                const open = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFaq(open ? null : idx);
                      handleClick(e, `faq-item-${idx}`);
                    }}
                    style={getElementStyle(`faq-item-${idx}`)}
                    className={`bg-card border border-border rounded-lg p-5 cursor-pointer ${selectBorder(`faq-item-${idx}`)}`}
                  >
                    <div className="flex items-center justify-between text-heading font-bold text-sm">
                      <span>{item.q}</span>
                      {open ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                    </div>
                    {open && (
                      <p className="text-muted text-xs mt-3.5 leading-relaxed pt-2.5 border-t border-border/40">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case "about": {
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border/40 bg-transparent">
            <div className={r("max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center")}>
              <div className="space-y-6">
                <h2
                  onClick={(e) => handleClick(e, "about-title")}
                  style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("about-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal text-heading ${selectBorder("about-title")}`}
                >
                  {props.title || "About Us"}
                </h2>
                <p
                  onClick={(e) => handleClick(e, "about-text")}
                  style={getElementStyle("about-text")}
                  className={`text-muted ${r("text-sm sm:text-base")} leading-relaxed font-serif ${selectBorder("about-text")}`}
                >
                  {props.text}
                </p>
              </div>
              {props.image && (
                <div
                  onClick={(e) => handleClick(e, "about-image")}
                  style={getElementStyle("about-image")}
                  className={`aspect-video rounded-none overflow-hidden border border-border/50 ${selectBorder("about-image")}`}
                >
                  <img src={props.image} alt="About Us" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0a0a0f] relative overflow-hidden">
            {props.showGridLines !== false && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            )}
            <div className={r("max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10")}>
              <div className="space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-primary">// COMPILER BIOGRAPHY NODE</span>
                <h2
                  onClick={(e) => handleClick(e, "about-title")}
                  style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 15px rgba(255,46,110,0.15)", ...getElementStyle("about-title") }}
                  className={`${r("text-2xl md:text-4xl")} font-black tracking-tight text-heading uppercase ${selectBorder("about-title")}`}
                >
                  {props.title || "About Us"}
                </h2>
                <p
                  onClick={(e) => handleClick(e, "about-text")}
                  style={getElementStyle("about-text")}
                  className={`text-muted ${r("text-xs sm:text-sm")} leading-relaxed font-mono ${selectBorder("about-text")}`}
                >
                  {props.text}
                </p>
              </div>
              {props.image && (
                <div
                  onClick={(e) => handleClick(e, "about-image")}
                  style={getElementStyle("about-image")}
                  className={`aspect-video rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_20px_rgba(255,46,110,0.1)] ${selectBorder("about-image")}`}
                >
                  <img src={props.image} alt="About Us" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0f0e0b]">
            <div className={r("max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center")}>
              <div className="space-y-6">
                <h2
                  onClick={(e) => handleClick(e, "about-title")}
                  style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("about-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide ${selectBorder("about-title")}`}
                >
                  {props.title || "About Us"}
                </h2>
                <p
                  onClick={(e) => handleClick(e, "about-text")}
                  style={getElementStyle("about-text")}
                  className={`text-[#d4cbb3] ${r("text-sm sm:text-base")} leading-relaxed font-serif ${selectBorder("about-text")}`}
                >
                  {props.text}
                </p>
              </div>
              {props.image && (
                <div
                  onClick={(e) => handleClick(e, "about-image")}
                  style={getElementStyle("about-image")}
                  className={`aspect-video rounded-none overflow-hidden border border-[#e8c87c]/30 p-2 bg-[#1b1915] ${selectBorder("about-image")}`}
                >
                  <img src={props.image} alt="About Us" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className="py-20 px-8 border-b border-border bg-background">
            <div className={r("max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center")}>
              <div className="space-y-6">
                <h2
                  onClick={(e) => handleClick(e, "about-title")}
                  style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("about-title") }}
                  className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading ${selectBorder("about-title")}`}
                >
                  {props.title || "About Us"}
                </h2>
                <p
                  onClick={(e) => handleClick(e, "about-text")}
                  style={getElementStyle("about-text")}
                  className={`text-muted ${r("text-sm sm:text-base")} leading-relaxed font-medium ${selectBorder("about-text")}`}
                >
                  {props.text}
                </p>
              </div>
              {props.image && (
                <div
                  onClick={(e) => handleClick(e, "about-image")}
                  style={getElementStyle("about-image")}
                  className={`aspect-video rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.15)] ${selectBorder("about-image")}`}
                >
                  <img src={props.image} alt="About Us" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className="py-20 px-8 border-b border-border">
          <div className={r("max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center")}>
            <div className="space-y-6">
              <h2
                onClick={(e) => handleClick(e, "about-title")}
                style={getElementStyle("about-title")}
                className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading ${selectBorder("about-title")}`}
              >
                {props.title || "About Us"}
              </h2>
              <p
                onClick={(e) => handleClick(e, "about-text")}
                style={getElementStyle("about-text")}
                className={`text-muted ${r("text-sm sm:text-base")} leading-relaxed ${selectBorder("about-text")}`}
              >
                {props.text}
              </p>
            </div>
            {props.image && (
              <div
                onClick={(e) => handleClick(e, "about-image")}
                style={getElementStyle("about-image")}
                className={`aspect-video rounded-xl overflow-hidden border border-border shadow-lg ${selectBorder("about-image")}`}
              >
                <img src={props.image} alt="About Us" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </section>
      );
    }

    case "contact": {
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border/40 bg-transparent">
            <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch")}>
              <div className="flex flex-col justify-between">
                <div>
                  <h2
                    onClick={(e) => handleClick(e, "contact-title")}
                    style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("contact-title") }}
                    className={`${r("text-3xl md:text-5xl")} font-normal text-heading ${selectBorder("contact-title")}`}
                  >
                    {props.title || "Contact Us"}
                  </h2>
                  {props.subtitle && (
                    <p
                      onClick={(e) => handleClick(e, "contact-subtitle")}
                      style={getElementStyle("contact-subtitle")}
                      className={`text-muted text-xs sm:text-sm mt-4 font-serif ${selectBorder("contact-subtitle")}`}
                    >
                      {props.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-6 mt-10 text-left font-serif text-sm">
                  {props.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{props.email}</span>
                    </div>
                  )}
                  {props.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{props.phone}</span>
                    </div>
                  )}
                  {props.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{props.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="bg-transparent border-0 p-0 space-y-6 text-left">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Your Name</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Jane Doe"
                    className="w-full bg-transparent border-b border-border/60 rounded-none px-0 py-2 text-heading text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    placeholder="jane@example.com"
                    className="w-full bg-transparent border-b border-border/60 rounded-none px-0 py-2 text-heading text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Message</label>
                  <textarea
                    rows={3}
                    disabled
                    placeholder="Type details..."
                    className="w-full bg-transparent border-b border-border/60 rounded-none px-0 py-2 text-heading text-xs focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="button"
                  className="border border-foreground text-foreground hover:bg-foreground hover:text-background text-xs font-bold px-6 py-2.5 rounded-none transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0a0a0f] relative overflow-hidden">
            {props.showGridLines !== false && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            )}
            <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch relative z-10")}>
              <div className="flex flex-col justify-between">
                <div>
                  <h2
                    onClick={(e) => handleClick(e, "contact-title")}
                    style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 15px rgba(255,46,110,0.15)", ...getElementStyle("contact-title") }}
                    className={`${r("text-2xl md:text-4xl")} font-black tracking-tight text-heading uppercase ${selectBorder("contact-title")}`}
                  >
                    {props.title || "Contact Us"}
                  </h2>
                  {props.subtitle && (
                    <p
                      onClick={(e) => handleClick(e, "contact-subtitle")}
                      style={getElementStyle("contact-subtitle")}
                      className={`text-muted text-xs font-mono mt-3 ${selectBorder("contact-subtitle")}`}
                    >
                      // {props.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-5 mt-8 text-left font-mono text-xs text-muted">
                  {props.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{props.email}</span>
                    </div>
                  )}
                  {props.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{props.phone}</span>
                    </div>
                  )}
                  {props.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{props.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-[#0f0f16]/60 border border-primary/20 p-6 rounded-xl space-y-4 text-left"
              >
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-primary mb-1">&gt; client_name</label>
                  <input
                    type="text"
                    disabled
                    placeholder="terminal_user"
                    className="w-full bg-[#07070a] border border-primary/30 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-primary mb-1">&gt; client_email</label>
                  <input
                    type="email"
                    disabled
                    placeholder="user@edge.node"
                    className="w-full bg-[#07070a] border border-primary/30 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-primary mb-1">&gt; telemetry_body</label>
                  <textarea
                    rows={3}
                    disabled
                    placeholder="Enter payload packet..."
                    className="w-full bg-[#07070a] border border-primary/30 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary resize-none font-mono"
                  />
                </div>
                <button
                  type="button"
                  className="bg-primary hover:bg-hover text-white text-xs font-mono font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,46,110,0.25)]"
                >
                  TRANSMIT_PACKET() <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className="py-24 px-8 border-b border-border bg-[#0f0e0b]">
            <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch")}>
              <div className="flex flex-col justify-between">
                <div>
                  <h2
                    onClick={(e) => handleClick(e, "contact-title")}
                    style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("contact-title") }}
                    className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide ${selectBorder("contact-title")}`}
                  >
                    {props.title || "Contact Us"}
                  </h2>
                  {props.subtitle && (
                    <p
                      onClick={(e) => handleClick(e, "contact-subtitle")}
                      style={getElementStyle("contact-subtitle")}
                      className={`text-[#d4cbb3] text-xs sm:text-sm mt-4 font-serif italic ${selectBorder("contact-subtitle")}`}
                    >
                      {props.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-6 mt-10 text-left font-serif text-sm text-[#d4cbb3]">
                  {props.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#e8c87c]" />
                      <span>{props.email}</span>
                    </div>
                  )}
                  {props.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#e8c87c]" />
                      <span>{props.phone}</span>
                    </div>
                  )}
                  {props.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#e8c87c]" />
                      <span>{props.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-[#1a1814]/40 border border-[#e8c87c]/30 p-8 rounded-none space-y-4 text-left"
              >
                <div>
                  <label className="block text-[9px] font-serif uppercase tracking-widest text-[#e8c87c] mb-1">Your Name</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Honorable Guest"
                    className="w-full bg-[#11100d] border border-[#e8c87c]/20 text-[#e8c87c] rounded-none px-3 py-2 text-xs focus:outline-none focus:border-[#e8c87c] font-serif"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-serif uppercase tracking-widest text-[#e8c87c] mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    placeholder="guest@domain.com"
                    className="w-full bg-[#11100d] border border-[#e8c87c]/20 text-[#e8c87c] rounded-none px-3 py-2 text-xs focus:outline-none focus:border-[#e8c87c] font-serif"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-serif uppercase tracking-widest text-[#e8c87c] mb-1">Message</label>
                  <textarea
                    rows={3}
                    disabled
                    placeholder="Inquire representation..."
                    className="w-full bg-[#11100d] border border-[#e8c87c]/20 text-[#e8c87c] rounded-none px-3 py-2 text-xs focus:outline-none focus:border-[#e8c87c] resize-none font-serif"
                  />
                </div>
                <button
                  type="button"
                  style={{ border: "1px solid #e8c87c", color: "#e8c87c" }}
                  className="w-full text-center hover:bg-[#e8c87c] hover:text-black text-xs font-serif py-3 rounded-none transition-all uppercase tracking-widest"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className="py-20 px-8 border-b border-border bg-background">
            <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch")}>
              <div className="flex flex-col justify-between">
                <div>
                  <h2
                    onClick={(e) => handleClick(e, "contact-title")}
                    style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("contact-title") }}
                    className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading ${selectBorder("contact-title")}`}
                  >
                    {props.title || "Contact Us"}
                  </h2>
                  {props.subtitle && (
                    <p
                      onClick={(e) => handleClick(e, "contact-subtitle")}
                      style={getElementStyle("contact-subtitle")}
                      className={`text-muted text-sm mt-4 font-medium ${selectBorder("contact-subtitle")}`}
                    >
                      {props.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-5 mt-10 text-left font-semibold text-sm">
                  {props.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{props.email}</span>
                    </div>
                  )}
                  {props.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{props.phone}</span>
                    </div>
                  )}
                  {props.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{props.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-card border-3 border-black p-6 rounded-2xl space-y-4 text-left shadow-[6px_6px_0px_#000]"
              >
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1">Your Name</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Enter name"
                    className="w-full bg-background border-2 border-black rounded-xl px-3 py-2 text-heading text-xs focus:shadow-[3px_3px_0px_#000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    placeholder="Enter email"
                    className="w-full bg-background border-2 border-black rounded-xl px-3 py-2 text-heading text-xs focus:shadow-[3px_3px_0px_#000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1">Message</label>
                  <textarea
                    rows={3}
                    disabled
                    placeholder="Type a message..."
                    className="w-full bg-background border-2 border-black rounded-xl px-3 py-2 text-heading text-xs focus:shadow-[3px_3px_0px_#000] outline-none resize-none"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-primary border-2 border-black hover:bg-hover text-white text-xs font-bold py-3 rounded-xl shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] flex items-center justify-center gap-1.5 transition-all"
                >
                  Send Message <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className="py-20 px-8 border-b border-border bg-card/5">
          <div className={r("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch")}>
            <div className="flex flex-col justify-between">
              <div>
                <h2
                  onClick={(e) => handleClick(e, "contact-title")}
                  style={getElementStyle("contact-title")}
                  className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading ${selectBorder("contact-title")}`}
                >
                  {props.title || "Contact Us"}
                </h2>
                <p
                  onClick={(e) => handleClick(e, "contact-subtitle")}
                  style={getElementStyle("contact-subtitle")}
                  className={`text-muted text-sm mt-3 ${selectBorder("contact-subtitle")}`}
                >
                  {props.subtitle}
                </p>
              </div>

              <div className="space-y-5 mt-8 text-left">
                {props.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{props.email}</span>
                  </div>
                )}
                {props.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{props.phone}</span>
                  </div>
                )}
                {props.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{props.address}</span>
                  </div>
                )}
              </div>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-card border border-border p-6 rounded-xl space-y-4 text-left"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Your Name</label>
                <input
                  type="text"
                  disabled
                  placeholder="Demo Input"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-heading text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  placeholder="Demo Input"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-heading text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Message</label>
                <textarea
                  rows={3}
                  disabled
                  placeholder="Type message..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-heading text-xs resize-none"
                />
              </div>
              <button
                type="button"
                className="bg-primary hover:bg-hover text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                Send Message <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>
      );
    }

    case "cta": {
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <section style={customStyles} className="py-24 px-8 text-center bg-transparent border-b border-border/40 flex flex-col items-center">
            <h2
              onClick={(e) => handleClick(e, "cta-title")}
              style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("cta-title") }}
              className={`${r("text-3xl md:text-5xl")} font-normal text-heading max-w-3xl leading-tight ${selectBorder("cta-title")}`}
            >
              {props.title}
            </h2>
            {props.subtitle && (
              <p
                onClick={(e) => handleClick(e, "cta-subtitle")}
                style={getElementStyle("cta-subtitle")}
                className={`text-muted text-xs sm:text-sm max-w-2xl mt-4 leading-relaxed font-serif ${selectBorder("cta-subtitle")}`}
              >
                {props.subtitle}
              </p>
            )}
            {props.buttonText && (
              <button
                onClick={(e) => handleClick(e, "cta-button")}
                style={getElementStyle("cta-button")}
                className={`mt-8 border border-foreground text-foreground hover:bg-foreground hover:text-background text-xs font-bold px-8 py-3 rounded-none transition-colors ${selectBorder("cta-button")}`}
              >
                {props.buttonText}
              </button>
            )}
          </section>
        );
      }

      if (isFuturistic) {
        return (
          <section style={customStyles} className="py-24 px-8 text-center bg-[#0a0a0f] border-b border-border flex flex-col items-center relative overflow-hidden">
            {props.showGridLines !== false && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            )}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
            <div className="max-w-3xl relative z-10 flex flex-col items-center">
              <h2
                onClick={(e) => handleClick(e, "cta-title")}
                style={{ fontFamily: "'Space Grotesque', sans-serif", textShadow: "0 0 15px rgba(255,46,110,0.15)", ...getElementStyle("cta-title") }}
                className={`${r("text-2xl md:text-4xl")} font-black tracking-tight text-heading uppercase ${selectBorder("cta-title")}`}
              >
                {props.title}
              </h2>
              {props.subtitle && (
                <p
                  onClick={(e) => handleClick(e, "cta-subtitle")}
                  style={getElementStyle("cta-subtitle")}
                  className={`text-muted text-xs font-mono mt-3 max-w-2xl leading-relaxed ${selectBorder("cta-subtitle")}`}
                >
                  // {props.subtitle}
                </p>
              )}
              {props.buttonText && (
                <button
                  onClick={(e) => handleClick(e, "cta-button")}
                  style={getElementStyle("cta-button")}
                  className={`mt-8 bg-primary hover:bg-hover text-white text-xs font-mono font-bold px-8 py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(255,46,110,0.4)] ${selectBorder("cta-button")}`}
                >
                  {props.buttonText}
                </button>
              )}
            </div>
          </section>
        );
      }

      if (isLuxury) {
        return (
          <section style={customStyles} className="py-24 px-8 text-center bg-[#0f0e0b] border-b border-border flex flex-col items-center">
            <h2
              onClick={(e) => handleClick(e, "cta-title")}
              style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("cta-title") }}
              className={`${r("text-3xl md:text-5xl")} font-normal tracking-wide text-heading max-w-3xl leading-tight ${selectBorder("cta-title")}`}
            >
              {props.title}
            </h2>
            {props.subtitle && (
              <p
                onClick={(e) => handleClick(e, "cta-subtitle")}
                style={getElementStyle("cta-subtitle")}
                className={`text-[#d4cbb3] text-xs sm:text-sm max-w-2xl mt-4 leading-relaxed font-serif italic ${selectBorder("cta-subtitle")}`}
              >
                {props.subtitle}
              </p>
            )}
            {props.buttonText && (
              <button
                onClick={(e) => handleClick(e, "cta-button")}
                style={{ border: "1px solid #e8c87c", color: "#e8c87c", ...getElementStyle("cta-button") }}
                className={`mt-8 hover:bg-[#e8c87c] hover:text-black text-xs font-serif px-8 py-3 rounded-none transition-all uppercase tracking-widest ${selectBorder("cta-button")}`}
              >
                {props.buttonText}
              </button>
            )}
          </section>
        );
      }

      if (isCreative) {
        return (
          <section style={customStyles} className="py-20 px-8 text-center bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-b border-border flex flex-col items-center">
            <h2
              onClick={(e) => handleClick(e, "cta-title")}
              style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("cta-title") }}
              className={`${r("text-3xl md:text-5xl")} font-black tracking-tight text-heading max-w-3xl leading-tight ${selectBorder("cta-title")}`}
            >
              {props.title}
            </h2>
            {props.subtitle && (
              <p
                onClick={(e) => handleClick(e, "cta-subtitle")}
                style={getElementStyle("cta-subtitle")}
                className={`text-muted text-sm max-w-2xl mt-4 leading-relaxed font-medium ${selectBorder("cta-subtitle")}`}
              >
                {props.subtitle}
              </p>
            )}
            {props.buttonText && (
              <button
                onClick={(e) => handleClick(e, "cta-button")}
                style={getElementStyle("cta-button")}
                className={`mt-8 bg-primary hover:bg-hover text-white text-sm font-bold px-8 py-4 rounded-2xl transition-all shadow-[5px_5px_0px_#000] border-2 border-black ${selectBorder("cta-button")}`}
              >
                {props.buttonText}
              </button>
            )}
          </section>
        );
      }

      // Default (Modern)
      return (
        <section style={customStyles} className="py-20 px-8 text-center bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border-b border-border flex flex-col items-center">
          <h2
            onClick={(e) => handleClick(e, "cta-title")}
            style={getElementStyle("cta-title")}
            className={`${r("text-2xl md:text-4xl")} font-extrabold text-heading max-w-3xl leading-tight ${selectBorder("cta-title")}`}
          >
            {props.title}
          </h2>
          <p
            onClick={(e) => handleClick(e, "cta-subtitle")}
            style={getElementStyle("cta-subtitle")}
            className={`text-muted text-sm max-w-2xl mt-4 leading-relaxed ${selectBorder("cta-subtitle")}`}
          >
            {props.subtitle}
          </p>
          {props.buttonText && (
            <button
              onClick={(e) => handleClick(e, "cta-button")}
              style={getElementStyle("cta-button")}
              className={`mt-8 bg-primary hover:bg-hover text-white text-xs font-bold px-6 py-3 rounded-lg transition-colors ${selectBorder("cta-button")}`}
            >
              {props.buttonText}
            </button>
          )}
        </section>
      );
    }

    case "footer": {
      const isMinimal = variant === "minimal" || variant === "Minimal";
      const isFuturistic = variant === "futuristic" || variant === "Futuristic";
      const isLuxury = variant === "luxury" || variant === "Luxury";
      const isCreative = variant === "creative" || variant === "Creative";

      if (isMinimal) {
        return (
          <footer style={customStyles} className="py-12 px-8 bg-transparent border-b border-border/40 text-center text-xs text-muted">
            <div className={r("max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4")}>
              <h4
                onClick={(e) => handleClick(e, "footer-logo")}
                style={{ fontFamily: "'Playfair Display', serif", ...getElementStyle("footer-logo") }}
                className={`text-heading font-normal text-sm uppercase tracking-wider ${selectBorder("footer-logo")}`}
              >
                {props.logoText || "Brand"}
              </h4>
              <p className="font-serif">&copy; {new Date().getFullYear()} {props.logoText || "Brand"}. All rights reserved.</p>
            </div>
          </footer>
        );
      }

      if (isFuturistic) {
        return (
          <footer style={customStyles} className="py-12 px-8 bg-[#07070a] border-b border-border text-center text-xs text-muted font-mono">
            <div className={r("max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4")}>
              <h4
                onClick={(e) => handleClick(e, "footer-logo")}
                style={{ fontFamily: "'Space Grotesque', sans-serif", ...getElementStyle("footer-logo") }}
                className={`text-primary font-bold text-sm tracking-widest ${selectBorder("footer-logo")}`}
              >
                // {props.logoText || "Brand"}
              </h4>
              <p>&copy; {new Date().getFullYear()} {props.logoText || "Brand"}. Edge distribution network synced.</p>
            </div>
          </footer>
        );
      }

      if (isLuxury) {
        return (
          <footer style={customStyles} className="py-16 px-8 bg-[#0c0b09] border-b border-border text-center text-xs text-[#d4cbb3]">
            <div className={r("max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4")}>
              <h4
                onClick={(e) => handleClick(e, "footer-logo")}
                style={{ fontFamily: "'Playfair Display', serif", color: "#e8c87c", ...getElementStyle("footer-logo") }}
                className={`font-normal text-base uppercase tracking-widest ${selectBorder("footer-logo")}`}
              >
                {props.logoText || "Brand"}
              </h4>
              <p className="font-serif">&copy; {new Date().getFullYear()} {props.logoText || "Brand"}. All rights reserved.</p>
            </div>
          </footer>
        );
      }

      if (isCreative) {
        return (
          <footer style={customStyles} className="py-12 px-8 bg-card border-t-4 border-black text-center text-xs text-muted font-bold">
            <div className={r("max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4")}>
              <h4
                onClick={(e) => handleClick(e, "footer-logo")}
                style={{ fontFamily: "'Outfit', sans-serif", ...getElementStyle("footer-logo") }}
                className={`text-heading font-black text-sm uppercase tracking-wider ${selectBorder("footer-logo")}`}
              >
                {props.logoText || "Brand"}
              </h4>
              <p>&copy; {new Date().getFullYear()} {props.logoText || "Brand"}. Playfully built.</p>
            </div>
          </footer>
        );
      }

      // Default (Modern)
      return (
        <footer style={customStyles} className="py-12 px-8 bg-background/50 border-b border-border text-center text-xs text-muted">
          <div className={r("max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4")}>
            <h4
              onClick={(e) => handleClick(e, "footer-logo")}
              style={getElementStyle("footer-logo")}
              className={`text-heading font-extrabold text-sm uppercase tracking-wider ${selectBorder("footer-logo")}`}
            >
              {props.logoText || "Brand"}
            </h4>
            <p>&copy; {new Date().getFullYear()} {props.logoText || "Brand"}. All rights reserved.</p>
          </div>
        </footer>
      );
    }

    default:
      return <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-xs">Unsupported block: {type}</div>;
  }
}
