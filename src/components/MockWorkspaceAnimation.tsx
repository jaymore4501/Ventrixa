"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, Tablet as TabletIcon, Smartphone, Undo2, Redo2, Edit3, Save, Download, Rocket, GripVertical, Plus, Sparkles } from "lucide-react";

export default function MockWorkspaceAnimation() {
  const [themeColor, setThemeColor] = useState("#8b5cf6"); // Starts purple, changes to pink #FF2E6E
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [primaryText, setPrimaryText] = useState("Scale Your SaaS Output");

  useEffect(() => {
    let isSubscribed = true;
    const runAnimation = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      
      while (isSubscribed) {
        // Change color
        if (!isSubscribed) return;
        setThemeColor("#FF2E6E");

        await new Promise((r) => setTimeout(r, 1500));

        // Click Save
        if (!isSubscribed) return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setSaving(false);

        await new Promise((r) => setTimeout(r, 1000));

        // Click Deploy
        if (!isSubscribed) return;
        setDeploying(true);
        await new Promise((r) => setTimeout(r, 1500));
        setDeploying(false);

        // Wait before resetting
        await new Promise((r) => setTimeout(r, 3000));
        
        if (!isSubscribed) return;
        // Reset state
        setThemeColor("#8b5cf6");
        
        // Wait before animating again
        await new Promise((r) => setTimeout(r, 1500));
      }
    };
    runAnimation();
    return () => { isSubscribed = false; };
  }, []);

  return (
    <div className="w-full max-w-5xl mt-20 mx-auto">
      <div className="bg-[#10121a] text-[#D6DAE2] font-sans border border-white/[0.08] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden text-left relative backdrop-blur-xl flex flex-col h-[450px]">
        {/* Editor Header */}
        <header className="border-b border-[#2A2F3D] bg-[#151821] px-4 py-2.5 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-xs">Acme Corp Workspace</span>
              <span className="text-gray-500 text-[9px] font-mono leading-none mt-0.5">acme.ventrixa.site</span>
            </div>
          </div>

          {/* Dynamic Resize controls */}
          <div className="hidden md:flex items-center bg-[#212632]/80 border border-[#2A2F3D] rounded-lg p-0.5">
            <motion.div animate={{ backgroundColor: themeColor + '33', color: themeColor }} className="p-1.5 rounded-md text-gray-400">
              <Monitor className="w-3.5 h-3.5" />
            </motion.div>
            <div className="p-1.5 rounded-md text-gray-500">
              <TabletIcon className="w-3.5 h-3.5" />
            </div>
            <div className="p-1.5 rounded-md text-gray-500">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 border-r border-[#2A2F3D] pr-2.5">
              <Undo2 className="w-3.5 h-3.5 text-gray-500" />
              <Redo2 className="w-3.5 h-3.5 text-gray-500" />
            </div>

            <div className="border border-[#2A2F3D] text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 bg-[#212632]/40">
              <Edit3 className="w-3 h-3" /> Build
            </div>

            <motion.div 
              animate={{ borderColor: saving ? themeColor : '#2A2F3D', color: saving ? themeColor : '#D6DAE2' }}
              className="border text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 bg-[#212632]/40"
            >
              <Save className="w-3 h-3" /> {saving ? "Saving..." : "Save"}
            </motion.div>

            <motion.div 
              animate={{ backgroundColor: themeColor, scale: deploying ? 1.05 : 1 }}
              className="text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            >
              <Rocket className="w-3 h-3" /> Deploy
            </motion.div>
          </div>
        </header>

        {/* Main Workspace Frame */}
        <div className="flex-grow flex overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-48 border-r border-[#2A2F3D] bg-[#151821] flex flex-col flex-shrink-0 z-20 overflow-y-auto hidden sm:flex">
            <div className="p-3 border-b border-[#2A2F3D]/80">
              <label className="block text-[8px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Active Workspace Page</label>
              <div className="w-full bg-[#212632] border border-[#2A2F3D] rounded-lg px-2 py-1.5 text-white text-[10px] font-semibold">
                Homepage (/home)
              </div>
            </div>

            <div className="p-3 flex-grow space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold uppercase tracking-wider text-gray-500">Page Sections</span>
                <div className="p-0.5 rounded bg-[#212632] border border-[#2A2F3D]">
                  <Plus className="w-3 h-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <motion.div animate={{ borderColor: themeColor + '80', backgroundColor: themeColor + '1A' }} className="bg-[#212632] border rounded-lg px-2 py-1.5 text-[10px] font-semibold text-white flex justify-between items-center">
                  Hero Block <GripVertical className="w-3 h-3 text-gray-500" />
                </motion.div>
                <div className="bg-[#212632] border border-[#2A2F3D] rounded-lg px-2 py-1.5 text-[10px] font-semibold text-gray-300 flex justify-between items-center">
                  Features Grid <GripVertical className="w-3 h-3 text-gray-500" />
                </div>
                <div className="bg-transparent border border-transparent rounded-lg px-2 py-1.5 text-[10px] font-semibold text-gray-500 flex justify-between items-center hover:bg-[#212632]">
                  Footer <GripVertical className="w-3 h-3 text-gray-600" />
                </div>
              </div>
            </div>
          </aside>

          {/* Central Canvas */}
          <div className="flex-grow bg-[#0d0e12] p-6 flex flex-col items-center justify-center relative overflow-y-auto" style={{ backgroundImage: "url('/grid.svg')", backgroundSize: "30px", opacity: 0.95 }}>
            <motion.div 
              layout
              className="w-full max-w-lg rounded-xl bg-gradient-to-br from-[#12141c] to-black relative shadow-2xl border"
              animate={{ borderColor: themeColor }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="p-8 flex flex-col items-center text-center">
                <motion.span 
                  animate={{ backgroundColor: themeColor + '1A', color: themeColor, borderColor: themeColor + '33' }}
                  className="text-[8px] px-2 py-1 rounded-full font-mono uppercase font-bold tracking-wider mb-4 border"
                >
                  Acme Copilot
                </motion.span>
                
                <h2 className="text-3xl font-black text-white mb-3">{primaryText}</h2>
                <div className="h-2.5 bg-gray-500/80 rounded w-4/5 mb-2" />
                <div className="h-2.5 bg-gray-600/80 rounded w-3/5 mb-6" />
                
                <motion.div 
                  layout
                  animate={{ backgroundColor: themeColor }}
                  className="text-white font-bold px-4 py-2 rounded-lg text-xs shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                >
                  Start Building Now
                </motion.div>
              </div>
            </motion.div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 font-mono bg-black/50 px-2 py-1 rounded">
              Canvas View: Desktop Resizable
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-56 border-l border-[#2A2F3D] bg-[#151821] flex flex-col flex-shrink-0 z-20 overflow-y-auto hidden md:flex">
            <div className="p-4 space-y-5">
              <div>
                <motion.span animate={{ color: themeColor, backgroundColor: themeColor + '20', borderColor: themeColor + '40' }} className="text-[8px] border font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Project Level
                </motion.span>
                <h3 className="text-white text-sm font-bold mt-2">Global Settings</h3>
                <p className="text-gray-500 text-[9px] mt-0.5 leading-tight">Configure brand identity.</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#2A2F3D]/60">
                <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-500">Custom Brand Colors</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 bg-[#212632] border border-[#2A2F3D] rounded-lg px-2 py-1.5">
                    <motion.div animate={{ backgroundColor: themeColor }} className="w-4 h-4 rounded shadow-sm" />
                    <span className="text-[9px] font-mono text-gray-300">Primary</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#212632] border border-[#2A2F3D] rounded-lg px-2 py-1.5">
                    <div className="w-4 h-4 rounded shadow-sm bg-[#FF4E87]" />
                    <span className="text-[9px] font-mono text-gray-300">Accent</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#212632] border border-[#2A2F3D] rounded-lg px-2 py-1.5">
                    <div className="w-4 h-4 rounded shadow-sm bg-[#151821]" />
                    <span className="text-[9px] font-mono text-gray-300">Bg</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#212632] border border-[#2A2F3D] rounded-lg px-2 py-1.5">
                    <div className="w-4 h-4 rounded shadow-sm bg-[#D6DAE2]" />
                    <span className="text-[9px] font-mono text-gray-300">Text</span>
                  </div>
                </div>
                <motion.button animate={{ color: themeColor, backgroundColor: themeColor + '15', borderColor: themeColor + '30' }} className="w-full mt-1 border py-1.5 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Suggest AI Palette
                </motion.button>
              </div>

              <div className="pt-3 border-t border-[#2A2F3D]/60 text-center">
                <motion.button animate={{ color: themeColor }} className="text-[10px] font-semibold">
                  Configure Logo Settings &rarr;
                </motion.button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
