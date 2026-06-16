"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Check } from "lucide-react";
import BorderGlow from "@/components/reactbits/BorderGlow";

const GENERATION_STAGES = [
  { title: "Requirements Intake", desc: "Analyzing target audience & industry parameters." },
  { title: "Palette Hashing & Typography", desc: "Formulating custom color tokens & layout grids." },
  { title: "Routing Architecture", desc: "Constructing link indices, pages maps, and SEO paths." },
  { title: "Content Copy Synthesis", desc: "Writing copies and headlines in brand voice." },
  { title: "Component Layout Assembly", desc: "Assembling headers, hero blocks, features, & footers." },
  { title: "Media & Asset Curation", desc: "Shuffling image catalogs for visual section cards." },
  { title: "SEO Meta Optimization", desc: "Indexing tags, meta tags, and OpenGraph configurations." },
  { title: "Blueprint Finalization", desc: "Syncing templates structure & saving to database." }
];

export default function BlueprintDemo() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Simulate generation loop
    const runAnimation = () => {
      setActiveStageIdx(0);
      setProgressPercent(0);
      
      let currentProgress = 0;
      interval = setInterval(() => {
        currentProgress += 0.5; // smoother update
        
        if (currentProgress > 105) { // pause at 100%
          clearInterval(interval);
          setTimeout(runAnimation, 2500); // Restart after 2.5 seconds
          return;
        }
        
        setProgressPercent(Math.min(Math.floor(currentProgress), 100));
        
        // Map progress to stage index (0-8)
        const stage = Math.floor((currentProgress / 100) * GENERATION_STAGES.length);
        const newStage = Math.min(stage, GENERATION_STAGES.length - 1);
        setActiveStageIdx(newStage);
        
      }, 50);
    };

    runAnimation();
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll the stages list when active stage changes
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[activeStageIdx] as HTMLElement;
      if (activeEl) {
        // Calculate offset relative to the container to prevent full-page scroll jumping
        const container = listRef.current;
        const scrollPosition = activeEl.offsetTop - container.offsetTop - 20;
        container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      }
    }
  }, [activeStageIdx]);

  return (
    <div className="w-full">
      <BorderGlow glowColor="#FF2E6E" backgroundColor="#12141c" borderRadius={16} glowRadius={60} glowIntensity={0.3} animated>
        <div className="bg-[#12141c] rounded-2xl p-8 md:p-10 border border-white/[0.04] text-left grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: Progress timeline */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF2E6E] animate-pulse" />
                Assembling Website Blueprint
              </h3>
              <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                Our dynamic procedural generator is compiling layouts, styling tokens, and content blueprints.
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-400">Compiling...</span>
                <span className="text-[#FF2E6E] font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#212632] h-2 rounded-full overflow-hidden border border-white/[0.04]">
                <div
                  className="bg-gradient-to-r from-[#FF2E6E] to-purple-600 h-full rounded-full transition-all duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Stages checklist */}
            <div ref={listRef} className="space-y-3 max-h-[300px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {GENERATION_STAGES.map((stage, idx) => {
                const isCompleted = idx < activeStageIdx;
                const isCurrent = idx === activeStageIdx;
                
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#FF2E6E]/10 border-[#FF2E6E]/30 shadow-lg shadow-[#FF2E6E]/5"
                        : isCompleted
                        ? "bg-white/[0.02] border-white/[0.06] opacity-70"
                        : "bg-transparent border-transparent opacity-40"
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-[#FF2E6E]/20 border border-[#FF2E6E] flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E6E] animate-ping" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-mono text-gray-500">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isCurrent ? "text-[#FF2E6E]" : "text-white"}`}>
                        {stage.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed mt-1">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Wireframe Mockup */}
          <div className="hidden md:flex flex-col items-center justify-center bg-[#151821] border border-white/[0.04] rounded-2xl p-6 relative overflow-hidden min-h-[380px]">
            {/* Glowing background circles */}
            <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#FF2E6E]/10 rounded-full blur-[60px]" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px]" />

            {/* Browser outline */}
            <div className="w-full bg-[#12141c] border border-white/[0.06] rounded-xl shadow-2xl flex flex-col overflow-hidden max-w-sm z-10 transition-all duration-500">
              {/* Browser header tabs */}
              <div className="border-b border-white/[0.06] px-3 py-2.5 flex items-center justify-between bg-black/40 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 bg-[#212632] px-3 py-0.5 rounded border border-white/[0.04] w-32 truncate text-center">
                  kdfl.com
                </span>
                <div className="w-6" />
              </div>

              {/* Canvas content */}
              <div className="p-4 space-y-4 min-h-[260px] bg-[#0a0a0c]">
                {/* Nav Bar Wireframe */}
                <div
                  className={`border border-white/[0.06] rounded-md p-2 flex items-center justify-between bg-white/[0.02] transition-all duration-500 ${
                    activeStageIdx >= 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  }`}
                >
                  <div className="w-12 h-2.5 bg-[#FF2E6E]/40 rounded" />
                  <div className="flex gap-2.5">
                    <div className="w-6 h-1.5 bg-gray-500/40 rounded" />
                    <div className="w-6 h-1.5 bg-gray-500/40 rounded" />
                    <div className="w-6 h-1.5 bg-gray-500/40 rounded" />
                  </div>
                </div>

                {/* Hero Wireframe */}
                <div
                  className={`border border-white/[0.06] rounded-lg p-4 bg-white/[0.02] flex gap-4 transition-all duration-500 ${
                    activeStageIdx >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="flex-1 space-y-3">
                    <div className="w-24 h-3.5 bg-gray-300/80 rounded" />
                    <div className="w-32 h-2 bg-gray-500/40 rounded" />
                    <div className="w-14 h-4 bg-[#FF2E6E] rounded" />
                  </div>
                  <div className="w-16 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gray-500/50 animate-pulse" />
                  </div>
                </div>

                {/* Middle Grid Wireframe */}
                <div
                  className={`grid grid-cols-2 gap-3 transition-all duration-500 ${
                    activeStageIdx >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  <div className="border border-white/[0.06] rounded-lg p-3 bg-white/[0.02] space-y-2">
                    <div className="w-5 h-5 bg-[#FF2E6E]/20 rounded flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E6E]" />
                    </div>
                    <div className="w-12 h-2.5 bg-gray-300/80 rounded" />
                    <div className="w-16 h-1.5 bg-gray-500/40 rounded" />
                  </div>
                  <div className="border border-white/[0.06] rounded-lg p-3 bg-white/[0.02] space-y-2">
                    <div className="w-5 h-5 bg-[#FF2E6E]/20 rounded flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E6E]" />
                    </div>
                    <div className="w-12 h-2.5 bg-gray-300/80 rounded" />
                    <div className="w-16 h-1.5 bg-gray-500/40 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Wireframe Floating HUD Tag */}
            <div className="absolute bottom-5 right-5 bg-[#FF2E6E]/10 border border-[#FF2E6E]/30 text-[#FF2E6E] text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-lg z-20 flex items-center gap-1.5 animate-pulse backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E6E] inline-block" /> Live Assembly Mockup
            </div>
          </div>
        </div>
      </BorderGlow>
    </div>
  );
}
