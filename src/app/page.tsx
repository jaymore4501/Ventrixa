"use client";

import React, { useState, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Zap,
  Cpu,
  Layers,
  Globe,
  Sliders,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Loader2,
  Play,
  Monitor,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Mail,
  User as UserIcon,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import LightRays from "@/components/reactbits/LightRays";
import ShinyText from "@/components/reactbits/ShinyText";
import LogoLoop from "@/components/reactbits/LogoLoop";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import BorderGlow from "@/components/reactbits/BorderGlow";
import SplitText from "@/components/reactbits/SplitText";
import Plasma from "@/components/reactbits/Plasma";

function NavAvatar({ session }: { session: any }) {
  const [open, setOpen] = useState(false);
  const initials = session?.user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0 hover:scale-105 transition-transform"
        style={{ background: "linear-gradient(135deg, #FF2E6E, #9d174d)", boxShadow: "0 0 14px rgba(255,46,110,0.35)" }}
      >
        {session?.user?.image ? (
          <img src={session.user.image} alt="" className="w-full h-full rounded-xl object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-12 w-52 z-50 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(18,20,28,0.98), rgba(22,14,20,0.98))",
              border: "1px solid rgba(255,46,110,0.2)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,46,110,0.05)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-white text-xs font-bold truncate">{session?.user?.name}</p>
              <p className="text-gray-500 text-[10px] truncate">{session?.user?.email}</p>
            </div>
            <div className="py-1.5">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <UserIcon className="w-3.5 h-3.5" /> My Profile
              </Link>
            </div>
            <div className="border-t border-white/[0.06] py-1.5">
              <button onClick={() => signOut()} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siShowPwd, setSiShowPwd] = useState(false);

  // Sign Up state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suShowPwd, setSuShowPwd] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openModal = (tab: "signin" | "signup" = "signin") => {
    setActiveTab(tab);
    setError("");
    setSuccessMsg("");
    setShowAuthModal(true);
  };

  const closeModal = () => {
    setShowAuthModal(false);
    setError("");
    setSuccessMsg("");
  };

  const passwordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0-4
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Fast client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(siEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (siPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: siEmail.toLowerCase().trim(),
        password: siPassword,
        redirect: false,
      });
      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Incorrect email or password." : res.error);
      } else {
        closeModal();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (suPassword !== suConfirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: suName, email: suEmail, password: suPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed.");
        return;
      }
      // Auto sign-in after successful signup
      const signInRes = await signIn("credentials", {
        email: suEmail,
        password: suPassword,
        redirect: false,
      });
      if (signInRes?.ok) {
        closeModal();
      } else {
        setSuccessMsg("Account created! You can now sign in.");
        setActiveTab("signin");
        setSiEmail(suEmail);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const dummyBrands = [
    { id: 1, logo: "Stripe" },
    { id: 2, logo: "Vercel" },
    { id: 3, logo: "Linear" },
    { id: 4, logo: "Framer" },
    { id: 5, logo: "Figma" },
    { id: 6, logo: "OpenAI" },
  ];

  return (
    <div className="relative min-h-screen bg-[#0d0e12] text-[#d1d5db] overflow-x-hidden flex flex-col font-sans antialiased">
      {/* Full-Page WebGL Plasma Background — fixed so it covers the entire scroll height */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Plasma
          color="#FF4E87"
          speed={2}
          direction="reverse"
          scale={3.2}
          opacity={1}
          mouseInteractive={false}
        />
      </div>

      {/* Dark gradient overlay to keep content readable at all scroll depths */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,14,18,0.72) 0%, rgba(13,14,18,0.55) 30%, rgba(13,14,18,0.62) 60%, rgba(13,14,18,0.82) 85%, rgba(9,10,13,0.97) 100%)",
        }}
      />

      {/* Subtle ambient top accent glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[280px] bg-gradient-to-b from-[#ff2e6e]/10 to-transparent rounded-full blur-[120px] pointer-events-none z-[2]" />

      {/* Background Interactive Mouse Glow */}
      <LightRays raysColor="#FF2E6E" raysOrigin="top-center" followMouse={true} opacity={0.10} />

      {/* Header / Navbar — Premium Glassmorphism */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-8 py-0 flex items-center justify-between transition-all duration-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,46,110,0.04) 50%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 1px 0 0 rgba(255,46,110,0.08), 0 4px 24px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Inner highlight shimmer line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,46,110,0.4) 30%, rgba(255,255,255,0.25) 50%, rgba(255,46,110,0.4) 70%, transparent 100%)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2.5 py-3">
          <img
            src="/logo.png"
            alt="Ventrixa Logo"
            className="w-8 h-8 object-cover"
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "20%",
              // filter:
              //   "drop-shadow(0 0 8px rgba(255,46,110,0.55)) drop-shadow(0 0 2px rgba(255,46,110,0.3))",
            }}
          />
          <span className="text-white font-extrabold text-base">Ventri<span className="text-[#FF2E6E]">x</span>a</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-400 py-3">
          {["#features", "#pricing", "#demo"].map((href, i) => (
            <a
              key={href}
              href={href}
              className="relative group transition-colors duration-200 hover:text-white"
            >
              {["Features", "Pricing", "Workspace Demo"][i]}
              <span
                className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#FF2E6E] to-pink-400 group-hover:w-full transition-all duration-300 rounded-full"
              />
            </a>
          ))}
          <a
            href="https://github.com/jaymore4501/Ventrixa.git"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group transition-colors duration-200 hover:text-white flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            <span>GitHub</span>
            <span
              className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#FF2E6E] to-pink-400 group-hover:w-full transition-all duration-300 rounded-full"
            />
          </a>
        </nav>

        {/* CTA area */}
        <div className="flex items-center gap-4 py-3">
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#FF2E6E]" />
          ) : session ? (
            <NavAvatar session={session} />
          ) : (
            <button
              onClick={() => openModal()}
              className="relative text-white text-xs font-bold px-5 py-2 rounded-lg uppercase tracking-wider transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.13)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,46,110,0.12)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,46,110,0.35)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 16px rgba(255,46,110,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.13)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.3)";
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-36 pb-24 text-center relative z-10">


        <ScrollReveal duration={0.8} yOffset={30}>
          <div className="inline-flex items-center gap-2 bg-[#FF2E6E]/10 border border-[#FF2E6E]/20 rounded-full px-4 py-1.5 mb-8 text-[10px] text-[#FF2E6E] font-extrabold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Ventrixa Compiler Active v1.0
          </div>
        </ScrollReveal>

        <ScrollReveal duration={0.8} delay={0.08} yOffset={25}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.08] tracking-tighter max-w-5xl mx-auto flex flex-col items-center gap-1">
            <SplitText text="The Website" className="text-white font-extrabold" />
            <ShinyText text="Generation Platform" baseColor="#FF2E6E" shineColor="#ffb3c6" className="font-black" />
          </h1>
        </ScrollReveal>

        <ScrollReveal duration={0.8} delay={0.16} yOffset={20}>
          <p className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto mt-8 leading-relaxed font-medium">
            A next-generation visual sandbox that compiles business requirements into color-hashed branding structures, optimized code pages, and dynamic deployments.
          </p>
        </ScrollReveal>

        <ScrollReveal duration={0.8} delay={0.24} yOffset={15}>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-10">
            {session ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-[#FF2E6E] to-[#9d174d] hover:brightness-110 text-white font-bold px-7 py-3.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,46,110,0.3)]"
              >
                Go to Dashboard <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            ) : (
              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-[#FF2E6E] to-[#9d174d] hover:brightness-110 text-white font-bold px-7 py-3.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,46,110,0.3)]"
              >
                Build site for free <Sparkles className="w-4.5 h-4.5 text-pink-200" />
              </button>
            )}
            <a
              href="#demo"
              className="text-gray-300 hover:text-white font-bold px-7 py-3.5 rounded-lg text-sm border border-white/[0.06] hover:border-white/20 bg-white/[0.02] backdrop-blur-md transition-all"
            >
              Live Demo
            </a>
          </div>
        </ScrollReveal>

        {/* --- High-Fidelity Workspace HTML/CSS Mockup (Hero Highlight) --- */}
        <ScrollReveal duration={0.9} delay={0.35} yOffset={40} className="w-full max-w-5xl mt-20">
          <div className="bg-[#12141c]/90 border border-white/[0.08] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden text-left relative backdrop-blur-xl">
            {/* Window chrome bar */}
            <div className="bg-black/30 px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]/80" />
                <span className="text-[11px] font-mono text-gray-500 ml-3 uppercase tracking-widest font-bold">Ventrixa Workspace v1.0</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono border border-white/[0.06] rounded px-2.5 py-0.5 bg-black/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                Edge status: connected
              </div>
            </div>

            {/* Mock Workspace Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 h-[380px] overflow-hidden text-xs">
              {/* Left sidebar Mock */}
              <div className="bg-black/25 border-r border-white/[0.06] p-4 flex flex-col justify-between hidden md:flex">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">App Pages</span>
                    <div className="space-y-1.5 mt-2">
                      <div className="p-2 rounded bg-[#FF2E6E]/10 border border-[#FF2E6E]/20 text-[#FF2E6E] font-bold">/home (Active)</div>
                      <div className="p-2 text-gray-400 hover:text-white transition-colors">/about</div>
                      <div className="p-2 text-gray-400 hover:text-white transition-colors">/services</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Layout Layers</span>
                    <div className="space-y-1 mt-2 font-mono text-[10px] text-gray-400">
                      <div>├─ navbar</div>
                      <div className="text-[#FF2E6E]">├─ hero (Selected)</div>
                      <div>├─ features</div>
                      <div>└─ footer</div>
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-[10px] border-t border-white/[0.05] pt-3">
                  Press <kbd className="bg-white/5 border border-white/10 px-1 rounded text-gray-400">⌘S</kbd> to Sync
                </div>
              </div>

              {/* Central Canvas Mock */}
              <div className="col-span-2 bg-[#0d0e12]/60 p-6 flex flex-col items-center justify-center relative border-r border-white/[0.06] overflow-y-auto">
                <div className="w-full border border-[#FF2E6E] rounded-xl p-6 bg-gradient-to-br from-[#12141c] to-black relative shadow-lg">
                  <span className="absolute top-2 left-2 bg-[#FF2E6E] text-white text-[8px] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider scale-90">
                    Hero Section
                  </span>
                  <div className="space-y-2 mt-2">
                    <div className="h-3.5 bg-white/90 rounded w-4/5" />
                    <div className="h-2.5 bg-gray-500 rounded w-11/12" />
                    <div className="h-2 bg-gray-600 rounded w-10/12" />
                  </div>
                  <div className="mt-5 inline-flex items-center gap-1 bg-[#FF2E6E] text-white font-bold px-3 py-1.5 rounded text-[10px] shadow">
                    Get Started <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
                <div className="absolute bottom-2 text-[10px] text-gray-500 font-mono">
                  Canvas View: Desktop Resizable
                </div>
              </div>

              {/* Right Sidebar Mock */}
              <div className="bg-black/25 p-4 space-y-4">
                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Inspector</span>
                <div className="space-y-3 mt-2">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 block mb-1">Headline Content</label>
                    <input
                      type="text"
                      disabled
                      value="Scale Your SaaS Output"
                      className="w-full bg-[#12141c] border border-white/[0.06] rounded px-2.5 py-1.5 text-white font-semibold text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 block mb-1">Alignment Padding</label>
                    <div className="flex gap-2">
                      <span className="flex-1 py-1 text-center bg-[#FF2E6E]/10 border border-[#FF2E6E]/20 text-[#FF2E6E] font-bold rounded">Medium</span>
                      <span className="flex-1 py-1 text-center border border-white/[0.06] text-gray-500 rounded">Large</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 block mb-1">Brand Theme color</label>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-4 h-4 rounded-full bg-[#FF2E6E]" />
                      <span className="text-[10px] font-mono text-gray-400">#FF2E6E (Hashed)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Client Brands loops */}
        <ScrollReveal duration={0.8} delay={0.4} yOffset={20} className="w-full max-w-5xl mt-24">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-6">Engineered for modern production architectures</p>
          <LogoLoop items={dummyBrands} speed={35} direction="left" />
        </ScrollReveal>

        {/* Features Section */}
        <section id="features" className="w-full max-w-6xl mt-40 pt-16">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Vibrant Color Architectures</h2>
            <p className="text-gray-400 text-base sm:text-lg mt-3 max-w-xl mx-auto">No generic color systems. Ventrixa hashes and compiles cohesive brand identities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BorderGlow
              className="h-full"
              glowColor="#FF2E6E"
              backgroundColor="#12141c"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={0.3}
              colors={["#FF2E6E", "#8b5cf6"]}
            >
              <div className="p-8 flex flex-col items-start text-left h-full border border-white/[0.04]">
                <div className="w-10 h-10 bg-[#FF2E6E]/10 rounded-lg flex items-center justify-center mb-6 text-[#FF2E6E] border border-[#FF2E6E]/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2.5">Dynamic HSL Hashing</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Our system hashes project metadata to extract an optimal core hue, then computes secondary and accent shades programmatically.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow
              className="h-full"
              glowColor="#8b5cf6"
              backgroundColor="#12141c"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={0.3}
              colors={["#8b5cf6", "#ec4899"]}
            >
              <div className="p-8 flex flex-col items-start text-left h-full border border-white/[0.04]">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2.5">Visual Editor Workspace</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Click on canvas elements to inspect properties, reorder layout layers, and adjust spacing options in real-time.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow
              className="h-full"
              glowColor="#FF2E6E"
              backgroundColor="#12141c"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={0.3}
              colors={["#FF2E6E", "#b91c1c"]}
            >
              <div className="p-8 flex flex-col items-start text-left h-full border border-white/[0.04]">
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center mb-6 text-pink-400 border border-pink-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2.5">Edge Deployments</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Stream site static structures instantly to custom DNS subdomains with automated SSL encryption provisioning in one click.
                </p>
              </div>
            </BorderGlow>
          </div>
        </section>


        {/* Interactive Demo Preview Section */}
        <section id="demo" className="w-full max-w-5xl mt-40 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Structured Layout BLUEPRINTS</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2">Rendering data structures instead of raw generated code.</p>
          </div>

          <BorderGlow
            glowColor="#FF2E6E"
            backgroundColor="#12141c"
            borderRadius={16}
            glowRadius={60}
            glowIntensity={0.3}
            colors={["#FF2E6E", "#8b5cf6", "#ec4899"]}
            animated
          >
            <div className="p-6 text-left border border-white/[0.06]">
              {/* Fake Window bar */}
              <div className="flex items-center gap-2 mb-6 border-b border-white/[0.06] pb-4">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]/80" />
                <span className="text-[10px] text-gray-500 ml-2 font-mono uppercase tracking-widest font-bold">engine_blueprint.json</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-bold leading-tight">Procedural Components Array</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    By parsing layout grids as JSON configurations, Ventrixa eliminates custom code injection risks, improves static render times, and optimizes responsive structures.
                  </p>
                  <div className="bg-black/50 rounded-lg p-4 border border-white/[0.06] font-mono text-[10px] text-[#FF2E6E] space-y-1 overflow-x-auto max-h-[160px]">
                    <p className="text-gray-600">// Generated Section Blueprint Schema</p>
                    <p>{"{"}</p>
                    <p className="pl-4">"type": <span className="text-white">"hero"</span>,</p>
                    <p className="pl-4">"variant": <span className="text-white">"modern"</span>,</p>
                    <p className="pl-4">"props": {"{"}</p>
                    <p className="pl-8">"title": <span className="text-pink-300">"Supercharge Workflows"</span>,</p>
                    <p className="pl-8">"accent": <span className="text-pink-300">"#FF2E6E"</span></p>
                    <p className="pl-4">{"}"}</p>
                    <p>{"}"}</p>
                  </div>
                </div>
                <div className="relative aspect-video w-full rounded-lg bg-black/40 border border-white/[0.06] overflow-hidden flex flex-col justify-center items-center text-center p-6 backdrop-blur">
                  <div className="p-4 rounded-xl bg-[#FF2E6E]/10 border border-[#FF2E6E]/20 animate-bounce mb-3 text-[#FF2E6E]">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-white text-base font-bold">Interactive Sandbox Waiting</h4>
                  <p className="text-gray-500 text-xs mt-1.5 max-w-xs leading-relaxed">
                    Authenticate via the Sandbox dashboard panel to run generation runs and preview live sites.
                  </p>
                </div>
              </div>
            </div>
          </BorderGlow>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-6xl mt-40 mb-20 pt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Flexible SaaS Subscriptions</h2>
            <p className="text-gray-400 text-base sm:text-lg mt-3">Simple pricing modules built to match your current deployment scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free Plan */}
            <BorderGlow
              className="h-full"
              glowColor="#3f3f46"
              backgroundColor="#12141c"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={0.15}
              colors={["#3f3f46", "#27272a"]}
            >
              <div className="p-8 flex flex-col h-full text-left justify-between border border-white/[0.04]">
                <div>
                  <h3 className="text-white text-lg font-bold">Free Sandbox</h3>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">Perfect for exploring Ventrixa and building your first AI-powered website.</p>
                  <div className="mt-6 flex items-baseline gap-1 text-white">
                    <span className="text-3xl font-extrabold">$0</span>
                    <span className="text-gray-500 text-xs font-semibold">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-3.5 text-xs text-gray-400">
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> 1 Project</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> AI Website Generation</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Visual Editor</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Local Preview</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> 1 Website Deployment</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Community Support</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Download 1 Project ZIP Export</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    if (session) {
                      window.location.href = "/dashboard";
                    } else {
                      openModal("signup");
                    }
                  }}
                  className="mt-8 w-full border border-white/[0.06] hover:border-white/20 text-white text-xs font-bold py-3 rounded-lg transition-all bg-white/[0.02]"
                >
                  Start Building
                </button>
              </div>
            </BorderGlow>

            {/* Pro Plan */}
            <BorderGlow
              className="h-full"
              glowColor="#FF2E6E"
              backgroundColor="#12141c"
              borderRadius={16}
              glowRadius={45}
              glowIntensity={0.4}
              colors={["#FF2E6E", "#8b5cf6", "#ec4899"]}
              style={{ borderColor: "#FF2E6E", borderWidth: "1.5px" }}
            >
              <div className="p-8 flex flex-col h-full text-left justify-between relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#FF2E6E] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(255,46,110,0.4)] z-20">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold flex items-center gap-2">Pro Builder <span className="text-yellow-400">⭐</span></h3>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">For freelancers, startups, and growing businesses.</p>
                  <div className="mt-6 flex items-baseline gap-1 text-white">
                    <span className="text-3xl font-extrabold">$19</span>
                    <span className="text-gray-500 text-xs font-semibold">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-3.5 text-xs text-gray-400">
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Up to 10 Projects</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> AI Regenerations</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Cloud Database Storage</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Up to 10 Website Deployments</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Custom Domains</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> SEO Configuration</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Export Any Project as Next.js ZIP</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Deployment Management Dashboard</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowPricingPopup(true)}
                  className="mt-8 w-full bg-gradient-to-r from-[#FF2E6E] to-[#9d174d] hover:brightness-110 text-white text-xs font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(255,46,110,0.25)]"
                >
                  Upgrade to Pro
                </button>
              </div>
            </BorderGlow>

            {/* Enterprise Plan */}
            <BorderGlow
              className="h-full"
              glowColor="#8b5cf6"
              backgroundColor="#12141c"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={0.25}
              colors={["#8b5cf6", "#ec4899"]}
            >
              <div className="p-8 flex flex-col h-full text-left justify-between border border-white/[0.04]">
                <div>
                  <h3 className="text-white text-lg font-bold">Agency OS</h3>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">Built for agencies managing multiple clients and websites.</p>
                  <div className="mt-6 flex items-baseline gap-1 text-white">
                    <span className="text-3xl font-extrabold">$79</span>
                    <span className="text-gray-500 text-xs font-semibold">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-3.5 text-xs text-gray-400">
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Unlimited Projects</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Unlimited Deployments</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Unlimited Custom Domains</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Remove Ventrixa Branding</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Priority AI Processing</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Version History & Rollbacks</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Premium Website Templates</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Priority Support</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4.5 h-4.5 text-[#FF2E6E] flex-shrink-0" /> Early Access to New Features</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowPricingPopup(true)}
                  className="mt-8 w-full border border-white/[0.06] hover:border-white/20 text-white text-xs font-bold py-3 rounded-lg transition-all bg-white/[0.02]"
                >
                  Contact Sales
                </button>
              </div>
            </BorderGlow>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#090a0d]/90 backdrop-blur-sm px-8 py-14 text-xs text-gray-500 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-white font-extrabold text-base">Ventri<span className="text-[#FF2E6E]">x</span>a</span>
            <span>— AI Website Generation Platform</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Ventrixa Inc. All rights reserved.</p>
        </div>
      </footer>

      {/* Premium Auth Modal — Sign In / Sign Up */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="relative w-full max-w-md text-left overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(18,20,28,0.98) 0%, rgba(22,14,20,0.98) 100%)",
              border: "1px solid rgba(255,46,110,0.2)",
              borderRadius: "20px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,46,110,0.06)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,46,110,0.5), rgba(255,255,255,0.2), rgba(255,46,110,0.5), transparent)" }} />

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo + Title */}
            <div className="px-8 pt-8 pb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src="/logo.png" alt="" className="w-7 h-7 object-cover" style={{ borderRadius: "18%" /*, filter: "drop-shadow(0 0 6px rgba(255,46,110,0.5))"*/ }} />
                <span className="text-white font-extrabold text-base">Ventri<span className="text-[#FF2E6E]">x</span>a</span>
              </div>
              <h2 className="text-white text-xl font-bold">{activeTab === "signin" ? "Welcome back" : "Create your account"}</h2>
              <p className="text-gray-400 text-xs mt-1">{activeTab === "signin" ? "Sign in to your workspace" : "Join Ventrixa — it's free"}</p>
            </div>

            {/* Tabs */}
            <div className="px-8 mb-6">
              <div className="flex rounded-xl overflow-hidden border border-white/[0.06] bg-black/30">
                {(["signin", "signup"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setError(""); setSuccessMsg(""); }}
                    className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                    style={{
                      background: activeTab === tab ? "linear-gradient(135deg, #FF2E6E, #9d174d)" : "transparent",
                      color: activeTab === tab ? "#fff" : "#9ca3af",
                    }}
                  >
                    {tab === "signin" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="px-8">
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-red-400 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                  {successMsg}
                </div>
              )}
            </div>

            {/* Sign In Form */}
            {activeTab === "signin" && (
              <form onSubmit={handleSignIn} className="px-8 pb-8 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="email" required
                      value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-9 pr-4 py-3 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#FF2E6E]/60 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type={siShowPwd ? "text" : "password"} required
                      value={siPassword}
                      onChange={(e) => setSiPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-9 pr-10 py-3 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#FF2E6E]/60 transition-colors"
                    />
                    <button type="button" onClick={() => setSiShowPwd(!siShowPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {siShowPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 disabled:opacity-50 transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #FF2E6E, #9d174d)", boxShadow: "0 0 20px rgba(255,46,110,0.3)" }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="bg-transparent px-3 text-gray-500" style={{ background: "#160e14" /* Matches modal bg near bottom */ }}>Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                    GitHub
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => { setActiveTab("signup"); setError(""); }} className="text-[#FF2E6E] hover:underline font-semibold">Create one</button>
                </p>
              </form>
            )}

            {/* Sign Up Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignUp} className="px-8 pb-8 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text" required minLength={2}
                      value={suName}
                      onChange={(e) => setSuName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-9 pr-4 py-3 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#FF2E6E]/60 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="email" required
                      value={suEmail}
                      onChange={(e) => setSuEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-9 pr-4 py-3 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#FF2E6E]/60 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type={suShowPwd ? "text" : "password"} required minLength={8}
                      value={suPassword}
                      onChange={(e) => setSuPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-9 pr-10 py-3 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#FF2E6E]/60 transition-colors"
                    />
                    <button type="button" onClick={() => setSuShowPwd(!suShowPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {suShowPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {/* Password strength meter */}
                  {suPassword && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const str = passwordStrength(suPassword);
                        const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
                        return <div key={level} className={`h-1 flex-1 rounded-full transition-all ${str >= level ? colors[str - 1] : "bg-white/10"}`} />;
                      })}
                    </div>
                  )}
                  {suPassword && <p className="text-[10px] mt-1 text-gray-500">{["Too weak", "Weak", "Fair", "Good", "Strong"][passwordStrength(suPassword)]} password</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="password" required
                      value={suConfirm}
                      onChange={(e) => setSuConfirm(e.target.value)}
                      placeholder="Repeat password"
                      className={`w-full bg-black/40 border rounded-xl pl-9 pr-4 py-3 text-white text-xs placeholder-gray-600 focus:outline-none transition-colors ${suConfirm && suConfirm !== suPassword ? "border-red-500/50" : "border-white/[0.08] focus:border-[#FF2E6E]/60"
                        }`}
                    />
                  </div>
                  {suConfirm && suConfirm !== suPassword && <p className="text-[10px] mt-1 text-red-400">Passwords don't match</p>}
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 disabled:opacity-50 transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #FF2E6E, #9d174d)", boxShadow: "0 0 20px rgba(255,46,110,0.3)" }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account"}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="bg-transparent px-3 text-gray-500" style={{ background: "#160e14" /* Matches modal bg near bottom */ }}>Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                    GitHub
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500">
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setActiveTab("signin"); setError(""); }} className="text-[#FF2E6E] hover:underline font-semibold">Sign in</button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Coming Soon Pricing Popup */}
      {showPricingPopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPricingPopup(false); }}
        >
          <div
            className="relative w-full max-w-md text-center p-8 overflow-hidden rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(18,20,28,0.98) 0%, rgba(22,14,20,0.98) 100%)",
              border: "1px solid rgba(255,46,110,0.2)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,46,110,0.06)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,46,110,0.5), rgba(255,255,255,0.2), rgba(255,46,110,0.5), transparent)" }} />
            
            <button
              onClick={() => setShowPricingPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <img src="/logo.png" alt="Ventrixa Logo" className="w-14 h-14 object-cover" style={{ borderRadius: "22%" }} />
            </div>
            
            <h2 className="text-white text-2xl font-bold mb-3">Coming Soon</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              We are currently in the testing phase! These premium features and subscriptions will be rolling out soon. Stay tuned.
            </p>

            <button
              onClick={() => setShowPricingPopup(false)}
              className="w-full bg-gradient-to-r from-[#FF2E6E] to-[#9d174d] hover:brightness-110 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,46,110,0.25)]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
