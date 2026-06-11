import React from "react";

export const CURATED_PALETTES = {
  dark: [
    { name: "Cyber Neon", primary: "#FF2E6E", secondary: "#161920", background: "#0D0E12", text: "#E2E8F0", accent: "#FF4E87" },
    { name: "Emerald Tech", primary: "#10B981", secondary: "#151E2E", background: "#0B0F19", text: "#E2E8F0", accent: "#34D399" },
    { name: "Nordic Blue", primary: "#3B82F6", secondary: "#1E293B", background: "#0F172A", text: "#F1F5F9", accent: "#60A5FA" },
    { name: "Sunset Violet", primary: "#F97316", secondary: "#1D1B26", background: "#0F0E17", text: "#FFFFFE", accent: "#8B5CF6" },
    { name: "Luxury Gold", primary: "#D97706", secondary: "#1C1917", background: "#0C0A09", text: "#F5F5F4", accent: "#F59E0B" },
    { name: "Electric Purple", primary: "#8B5CF6", secondary: "#171226", background: "#0B0813", text: "#EDEAFA", accent: "#A78BFA" },
    { name: "Teal Eclipse", primary: "#06B6D4", secondary: "#131E24", background: "#0A1115", text: "#E0F2FE", accent: "#22D3EE" },
    { name: "Oceanic Abyss", primary: "#00F2FE", secondary: "#0B131E", background: "#04070D", text: "#E2F1FF", accent: "#4FACFE" },
    { name: "Cherry Carbon", primary: "#F43F5E", secondary: "#1E1215", background: "#0F090A", text: "#FFEBEF", accent: "#FDA4AF" },
    { name: "Forest Moss", primary: "#22C55E", secondary: "#131A13", background: "#090C09", text: "#E8F8EE", accent: "#4ADE80" },
    { name: "Neon Cyberpunk", primary: "#E02424", secondary: "#1F1414", background: "#0F0A0A", text: "#FEE2E2", accent: "#F87171" },
    { name: "Deep Space", primary: "#6366F1", secondary: "#16162E", background: "#090915", text: "#EEEEFF", accent: "#818CF8" },
    { name: "Champagne Velvet", primary: "#C5A880", secondary: "#1A1613", background: "#0C0A09", text: "#F5F2EB", accent: "#E6D5BC" },
    { name: "Cyberpunk Edge", primary: "#00F2FE", secondary: "#1E1035", background: "#090415", text: "#EAF6FF", accent: "#F300FF" },
    { name: "Rosewood Luxury", primary: "#E28743", secondary: "#1F1113", background: "#120A0B", text: "#F6ECEC", accent: "#E23E57" },
    { name: "Nordic Frost", primary: "#8BE9FD", secondary: "#1B222C", background: "#0F131A", text: "#E6EDF5", accent: "#50FA7B" },
    { name: "Neon Tangerine", primary: "#FF6B6B", secondary: "#1D1712", background: "#0F0C0A", text: "#FFEBE8", accent: "#FFB84C" },
    { name: "Solarized Eclipse", primary: "#859900", secondary: "#0A1F27", background: "#00161E", text: "#93A1A1", accent: "#CB4B16" },
    { name: "Ultra Violet", primary: "#BD93F9", secondary: "#191428", background: "#0F0C1B", text: "#F1EAFF", accent: "#FF79C6" },
    { name: "Tokyo Drift", primary: "#00FFCC", secondary: "#1A1D2B", background: "#0F111A", text: "#E3EFFF", accent: "#FF2A54" },
    { name: "Monochrome Pro", primary: "#FFFFFF", secondary: "#1A1A1A", background: "#0B0B0B", text: "#E5E5E5", accent: "#A3A3A3" },
    { name: "Warm Amber", primary: "#FBBF24", secondary: "#1C130D", background: "#0E0906", text: "#FEFAF3", accent: "#F59E0B" },
    { name: "Mint Obsidian", primary: "#34D399", secondary: "#131C1A", background: "#090E0C", text: "#EAFDF7", accent: "#10B981" },
  ],
  light: [
    { name: "Clean Blue", primary: "#2563EB", secondary: "#FFFFFF", background: "#F8FAFC", text: "#1E293B", accent: "#3B82F6" },
    { name: "Forest Fresh", primary: "#059669", secondary: "#FFFFFF", background: "#F4FBF7", text: "#0F2F20", accent: "#10B981" },
    { name: "Warm Orange", primary: "#EA580C", secondary: "#FFFFFF", background: "#FFFDFB", text: "#2C1405", accent: "#F97316" },
    { name: "Soft Lavender", primary: "#7C3AED", secondary: "#FFFFFF", background: "#FAF9FE", text: "#1E152A", accent: "#8B5CF6" },
    { name: "Modern Slate", primary: "#0F172A", secondary: "#FFFFFF", background: "#FAFAFA", text: "#0F172A", accent: "#475569" },
    { name: "Crimson Rose", primary: "#E11D48", secondary: "#FFFFFF", background: "#FFFBFB", text: "#3F0712", accent: "#FB7185" },
    { name: "Teal Breeze", primary: "#0D9488", secondary: "#FFFFFF", background: "#F0FDFA", text: "#115E59", accent: "#14B8A6" },
    { name: "Sky Breeze", primary: "#0284C7", secondary: "#FFFFFF", background: "#F0F9FF", text: "#0369A1", accent: "#38BDF8" },
    { name: "Rose Blush", primary: "#DB2777", secondary: "#FFFFFF", background: "#FFF5F7", text: "#9D174D", accent: "#F472B6" },
    { name: "Mint Garden", primary: "#10B981", secondary: "#FFFFFF", background: "#F2FDF5", text: "#065F46", accent: "#34D399" },
    { name: "Lemon Honey", primary: "#D97706", secondary: "#FFFFFF", background: "#FEFDF0", text: "#78350F", accent: "#FBBF24" },
    { name: "Royal Orchid", primary: "#9333EA", secondary: "#FFFFFF", background: "#FAF5FF", text: "#581C87", accent: "#A855F7" },
    { name: "Peach Sorbet", primary: "#F97316", secondary: "#FFFFFF", background: "#FFF8F5", text: "#7C2D12", accent: "#FB923C" },
    { name: "Rose Gold", primary: "#B85C7A", secondary: "#FFF6F8", background: "#FFF0F3", text: "#3D1B24", accent: "#E07A5F" },
    { name: "Alpine Mist", primary: "#2A9D8F", secondary: "#F4F9F9", background: "#EBF5F5", text: "#1C3A35", accent: "#E76F51" },
    { name: "Vanilla Latte", primary: "#9A7B56", secondary: "#FFFDF9", background: "#FAF5EC", text: "#4A3525", accent: "#D4A373" },
    { name: "Retro Orange", primary: "#F26419", secondary: "#FFF8F5", background: "#FFF1EB", text: "#331405", accent: "#33658A" },
    { name: "Sage Garden", primary: "#556B2F", secondary: "#F9FBF6", background: "#F0F4E8", text: "#263310", accent: "#8FBC8F" },
    { name: "Cobalt Clean", primary: "#0052CC", secondary: "#FFFFFF", background: "#F2F6FC", text: "#091E42", accent: "#00B8D9" },
    { name: "Coral Sand", primary: "#F3722C", secondary: "#FFFBF9", background: "#FFF6F0", text: "#4D1A05", accent: "#F9C74F" },
    { name: "Plum Satin", primary: "#6D2E46", secondary: "#FDF8FA", background: "#F9F0F4", text: "#32111E", accent: "#D3B1C2" },
    { name: "Tiffany Teal", primary: "#0A9396", secondary: "#F4FBFB", background: "#E0F2F1", text: "#003D3C", accent: "#94D2BD" },
    { name: "Minimal Charcoal", primary: "#1A1A1A", secondary: "#FFFFFF", background: "#F6F6F6", text: "#111111", accent: "#7F7F7F" },
  ]
};


function hexToRgba(hex: string, opacity: number): string {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  let c = hex.trim().replace("#", "");
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  if (c.length !== 6) {
    return hex;
  }
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function getBrandStyles(brandColors: any) {
  if (!brandColors) return {};
  
  const bg = brandColors.background || "#151821";
  const text = brandColors.text || "#D6DAE2";
  const sec = brandColors.secondary || "#212632";
  const primary = brandColors.primary || "#FF2E6E";
  const accent = brandColors.accent || primary || "#FF4E87";
  
  // Calculate brightness of background color to determine if we're in light or dark mode
  let isLight = false;
  try {
    const c = bg.replace("#", "").toLowerCase();
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    isLight = brightness > 128;
  } catch (e) {
    // fallback
  }

  // Coordinated colors based on dark vs light mode
  const heading = isLight ? "#0f172a" : "#ffffff";
  const muted = isLight ? "#64748b" : "#96a0b3";
  const border = isLight ? "#e2e8f0" : "#394253";
  const cardForeground = isLight ? "#0f172a" : "#ffffff";

  // Create a stunning, creative ambient gradient background blending primary & accent colors
  const bgGradient = isLight
    ? `radial-gradient(circle at 10% 20%, ${hexToRgba(primary, 0.22)} 0%, transparent 45%), radial-gradient(circle at 90% 15%, ${hexToRgba(accent, 0.18)} 0%, transparent 40%), radial-gradient(circle at 50% 85%, ${hexToRgba(primary, 0.12)} 0%, transparent 50%), linear-gradient(135deg, ${bg} 0%, #ffffff 50%, ${bg} 100%)`
    : `radial-gradient(circle at 10% 20%, ${hexToRgba(primary, 0.35)} 0%, transparent 55%), radial-gradient(circle at 90% 15%, ${hexToRgba(accent, 0.25)} 0%, transparent 50%), radial-gradient(circle at 50% 85%, ${hexToRgba(primary, 0.18)} 0%, transparent 60%), linear-gradient(135deg, ${bg} 0%, ${sec} 50%, ${bg} 100%)`;

  // Semi-transparent background for sections so the page-wide gradient is visible behind them
  const semiBg = isLight ? hexToRgba(bg, 0.05) : hexToRgba(bg, 0.1);

  return {
    "--background": semiBg,
    "--solid-background": bg,
    "--bg-gradient": bgGradient,
    "--foreground": text,
    "--card": sec,
    "--card-foreground": cardForeground,
    "--border": border,
    "--primary": primary,
    "--hover": accent,
    "--muted": muted,
    "--heading": heading,
    // Tailwind v4 theme mapping overrides
    "--color-background": semiBg,
    "--color-solid-background": bg,
    "--color-bg-gradient": bgGradient,
    "--color-foreground": text,
    "--color-card": sec,
    "--color-card-foreground": cardForeground,
    "--color-border": border,
    "--color-primary": primary,
    "--color-hover": accent,
    "--color-muted": muted,
    "--color-heading": heading,
  } as React.CSSProperties;
}
