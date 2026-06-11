"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Paintbrush,
  Type,
  LayoutGrid,
  MonitorPlay,
  FileText,
  BadgeAlert,
  Compass,
} from "lucide-react";
import BorderGlow from "@/components/reactbits/BorderGlow";
import { CURATED_PALETTES } from "@/lib/styles";
import { READY_TEMPLATES } from "@/lib/templates";

const PAGE_OPTIONS = ["Home", "About", "Services", "Portfolio", "Pricing", "Blog", "Contact", "FAQ", "Team", "Gallery", "Privacy Policy", "Terms"];
const TYPOGRAPHY_OPTIONS = ["Modern", "Professional", "Startup", "Luxury", "Creative", "Minimal"];
const VOICE_OPTIONS = ["Professional", "Friendly", "Bold", "Corporate", "Luxury", "Playful"];
const THEME_OPTIONS = ["Modern", "Minimal", "Luxury", "Startup", "Corporate", "Creative", "Futuristic"];

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

function WizardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStepName, setCurrentStepName] = useState("");
  const [error, setError] = useState("");
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Wizard States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businessType, setBusinessType] = useState("SaaS");
  const [industry, setIndustry] = useState("Technology");
  const [targetAudience, setTargetAudience] = useState("Professionals");
  const [layoutType, setLayoutType] = useState<"custom" | "template">("custom");
  const [selectedTemplate, setSelectedTemplate] = useState("saas");

  const [colorPaletteType, setColorPaletteType] = useState<"ai" | "manual">("ai");
  const [primaryColor, setPrimaryColor] = useState("#FF2E6E");
  const [secondaryColor, setSecondaryColor] = useState("#151821");
  const [bgColor, setBgColor] = useState("#151821");
  const [textColor, setTextColor] = useState("#D6DAE2");
  const [accentColor, setAccentColor] = useState("#FF4E87");

  const [typoStyle, setTypoStyle] = useState("Modern");
  const [brandVoice, setBrandVoice] = useState("Bold");
  const [logoText, setLogoText] = useState("");

  const [selectedPages, setSelectedPages] = useState<string[]>(["Home", "About", "Contact"]);
  const [designTheme, setDesignTheme] = useState("Modern");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  // AI engine & Ollama scan states
  const [keywords, setKeywords] = useState("");
  const [keywordsArray, setKeywordsArray] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim().replace(/,/g, "");
      if (!val) return;
      
      if (!keywordsArray.includes(val)) {
        if (keywordsArray.length >= 9) {
          setError("You can add at most 9 keywords.");
          return;
        }
        setKeywordsArray([...keywordsArray, val]);
        setKeywordInput("");
        setError("");
      }
    } else if (e.key === "Backspace" && !keywordInput && keywordsArray.length > 0) {
      setKeywordsArray(keywordsArray.slice(0, -1));
    }
  };

  const handleKeywordBlur = () => {
    const val = keywordInput.trim().replace(/,/g, "");
    if (!val) return;
    if (!keywordsArray.includes(val)) {
      if (keywordsArray.length >= 9) {
        setError("You can add at most 9 keywords.");
        return;
      }
      setKeywordsArray([...keywordsArray, val]);
      setKeywordInput("");
      setError("");
    }
  };

  const removeKeywordTag = (tagToRemove: string) => {
    setKeywordsArray(keywordsArray.filter(t => t !== tagToRemove));
  };

  useEffect(() => {
    if (keywords && keywordsArray.length === 0) {
      const arr = keywords.split(",").map(k => k.trim()).filter(Boolean);
      setKeywordsArray(arr);
    }
  }, [keywords]);

  useEffect(() => {
    setKeywords(keywordsArray.join(", "));
  }, [keywordsArray]);

  const [aiEngine, setAiEngine] = useState<"procedural" | "ollama">("procedural");
  const [ollamaUrl, setOllamaUrl] = useState("http://127.0.0.1:11434");
  const [ollamaModels, setOllamaModels] = useState<any[]>([]);
  const [ollamaOnline, setOllamaOnline] = useState<boolean | null>(null);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState("");
  const [scanningOllama, setScanningOllama] = useState(false);

  const scanOllamaModels = async (urlToScan?: string) => {
    const targetUrl = urlToScan || ollamaUrl;
    setScanningOllama(true);
    setOllamaOnline(null);
    try {
      const res = await fetch(`/api/ollama/models?url=${encodeURIComponent(targetUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.online) {
          setOllamaOnline(true);
          setOllamaModels(data.models || []);
          if (data.models && data.models.length > 0) {
            setSelectedOllamaModel(data.models[0].name);
          } else {
            setSelectedOllamaModel("");
          }
        } else {
          setOllamaOnline(false);
          setOllamaModels([]);
          setSelectedOllamaModel("");
        }
      } else {
        setOllamaOnline(false);
      }
    } catch (e) {
      setOllamaOnline(false);
    } finally {
      setScanningOllama(false);
    }
  };

  // Layout Modal Selection state
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [tempLayoutType, setTempLayoutType] = useState<"custom" | "template">("custom");
  const [tempSelectedTemplate, setTempSelectedTemplate] = useState("saas");

  // Sync temp modal selections when modal opens
  useEffect(() => {
    if (showLayoutModal) {
      setTempLayoutType(layoutType);
      setTempSelectedTemplate(selectedTemplate);
    }
  }, [showLayoutModal]);

  // Sync default curated colors when themeMode or colorPaletteType changes
  useEffect(() => {
    if (colorPaletteType === "ai") {
      const mode = themeMode; // "dark" or "light"
      const list = CURATED_PALETTES[mode] || [];
      if (list.length > 0) {
        const defaultPalette = list[0]; // Use first curated palette as the initial default
        setPrimaryColor(defaultPalette.primary);
        setSecondaryColor(defaultPalette.secondary);
        setBgColor(defaultPalette.background);
        setTextColor(defaultPalette.text);
        setAccentColor(defaultPalette.accent);
      }
    }
  }, [themeMode, colorPaletteType]);

  const suggestPalette = () => {
    const list = CURATED_PALETTES[themeMode] || [];
    if (list.length > 0) {
      const randomIdx = Math.floor(Math.random() * list.length);
      const chosen = list[randomIdx];
      setPrimaryColor(chosen.primary);
      setSecondaryColor(chosen.secondary);
      setBgColor(chosen.background);
      setTextColor(chosen.text);
      setAccentColor(chosen.accent);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Load project details if editing draft
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return;
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const project = await res.ok ? await res.json() : null;
          if (project) {
            setName(project.name || "");
            setDescription(project.description || "");
            setLogoText(project.logoText || project.name || "");
            setIndustry(project.industry || "Technology");
            setBusinessType(project.businessType || "SaaS");
            setTargetAudience(project.targetAudience || "Professionals");
            setBrandVoice(project.brandVoice || "Bold");
            setTypoStyle(project.typography || "Modern");
            setDesignTheme(project.designTheme || "Modern");
            setThemeMode(project.theme || "dark");
            setKeywords(project.keywords || "");
            if (project.selectedPages && project.selectedPages.length > 0) {
              setSelectedPages(project.selectedPages);
            }
          }
        }
      } catch (err) {
        console.error("Error loading project:", err);
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  // Sync logo text with name if user hasn't edited logo text separately
  useEffect(() => {
    if (!logoText || logoText === name.slice(0, -1)) {
      setLogoText(name);
    }
  }, [name]);

  const togglePage = (p: string) => {
    if (p === "Home") return; // Home is mandatory
    setSelectedPages((prev) => {
      const arr = prev || [];
      return arr.includes(p) ? arr.filter((item) => item !== p) : [...arr, p];
    });
  };

  const handleNext = () => {
    if (step === 1) {
      let currentKeywordsArray = [...keywordsArray];
      const val = keywordInput.trim().replace(/,/g, "");
      if (val && !currentKeywordsArray.includes(val)) {
        if (currentKeywordsArray.length >= 9) {
          setError("You can add at most 9 keywords.");
          return;
        }
        currentKeywordsArray.push(val);
        setKeywordsArray(currentKeywordsArray);
        setKeywordInput("");
      }

      if (!name || !description) {
        setError("Please fill in the website name and description.");
        return;
      }
      if (currentKeywordsArray.length < 1 || currentKeywordsArray.length >= 10) {
        setError("Please enter between 1 and 9 keywords. Currently entered: " + currentKeywordsArray.length);
        return;
      }
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleStartGeneration = async () => {
    const kwArray = keywords.split(",")
      .map(k => k.trim())
      .filter(Boolean);
    if (kwArray.length < 1 || kwArray.length >= 10) {
      setError("Please enter between 1 and 9 keywords in Step 1.");
      setStep(1);
      return;
    }

    setGenerating(true);
    setLogs([]);
    setError("");

    const wizardData = {
      name,
      description,
      keywords,
      businessType,
      industry,
      targetAudience,
      brandVoice,
      colorPaletteType,
      layoutType,
      selectedTemplate,
      colorPalette: {
        primary: primaryColor,
        secondary: secondaryColor,
        background: bgColor,
        text: textColor,
        accent: accentColor
      },
      typography: typoStyle,
      logoText: logoText || name,
      selectedPages,
      designTheme,
      theme: themeMode,
      aiEngine,
      aiModel: selectedOllamaModel,
      apiBaseUrl: ollamaUrl ? `${ollamaUrl.replace(/\/$/, "")}/v1` : undefined,
    };

    let apiResult: any = null;
    let apiError: string | null = null;
    let animationFinished = false;

    // If no projectId, create project first
    let currentProjectId = projectId;
    const executeGeneration = async () => {
      try {
        if (!currentProjectId) {
          const createRes = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(wizardData),
          });
          if (!createRes.ok) {
            const err = await createRes.json();
            throw new Error(err.error || "Failed to create project");
          }
          const createdProject = await createRes.json();
          currentProjectId = createdProject._id || createdProject.id;
        }

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: currentProjectId,
            wizardData,
          }),
        });

        if (res.ok) {
          apiResult = await res.json();
        } else {
          const err = await res.json();
          throw new Error(err.error || "Generation failed. Please try again.");
        }
      } catch (e: any) {
        apiError = e.message || "Network error occurred during site generation.";
      }
    };

    // Start async execution
    executeGeneration();


    const STAGES_COUNT = 8;
    let simIdx = 0;
    
    const interval = setInterval(() => {
      if (simIdx < STAGES_COUNT) {
        setActiveStageIdx(simIdx);
        setProgressPercent(Math.round(((simIdx + 1) / STAGES_COUNT) * 100));
        simIdx++;
      } else {
        clearInterval(interval);
        animationFinished = true;
        checkCompletion();
      }
    }, 1000);

    function checkCompletion() {
      if (animationFinished) {
        if (apiResult) {
          setProgressPercent(100);
          setTimeout(() => {
            router.push(`/editor/${currentProjectId}`);
          }, 1000);
        } else if (apiError) {
          setError(apiError);
          setGenerating(false);
        } else {
          setTimeout(checkCompletion, 500);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#151821] text-[#D6DAE2] flex flex-col font-sans">
      {/* Top bar */}
      <header className="border-b border-border bg-background px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-muted hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-extrabold text-heading text-lg">AI Builder Wizard</span>
        </div>

        <div className="text-xs text-muted font-mono font-semibold">
          Step {step} of 5
        </div>
      </header>

      {/* Main Wizard Form Card */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-3xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-6 flex items-start gap-2">
              <BadgeAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {!generating ? (
            <BorderGlow glowColor="from-primary to-purple-600">
              <div className="bg-card rounded-xl p-8 md:p-10 border border-border">
                {/* Step 1: Project Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-heading text-2xl font-bold flex items-center gap-2">
                        <Compass className="w-6 h-6 text-primary" /> Tell us about your website
                      </h2>
                      <p className="text-muted text-sm mt-1">Provide basic information about your project concept.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Website / Project Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. ApexFlow Solutions"
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-heading text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Description & Mission</label>
                        <textarea
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="e.g. A SaaS platform providing cloud data synchronization pipelines for remote engineering teams."
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-heading text-sm focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Focus Keywords (Press Enter or Comma to add)</label>
                        <div className="w-full bg-background border border-border rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-primary transition-colors min-h-[48px] items-center">
                          {keywordsArray.map((tag, idx) => (
                            <span key={idx} className="bg-primary/15 border border-primary/25 text-primary text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150 select-none">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeKeywordTag(tag)}
                                className="text-primary hover:text-red-400 font-bold text-xs focus:outline-none transition-colors cursor-pointer"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          {keywordsArray.length < 9 && (
                            <input
                              type="text"
                              value={keywordInput}
                              onChange={(e) => setKeywordInput(e.target.value)}
                              onKeyDown={handleKeywordKeyDown}
                              onBlur={handleKeywordBlur}
                              placeholder={keywordsArray.length === 0 ? "Type keyword & press Enter" : "Add keyword..."}
                              className="flex-grow bg-transparent border-0 outline-none text-heading text-sm min-w-[120px] py-1 focus:ring-0 focus:border-transparent"
                            />
                          )}
                        </div>
                        <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
                          Add between 1 and 9 keywords (e.g. <i>clothes</i>, <i>apparel</i>, <i>dresses</i>). Press Enter or Comma to save.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Business Type</label>
                          <select
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-3 text-heading text-sm focus:outline-none focus:border-primary transition-colors"
                          >
                            <option value="SaaS">SaaS / App</option>
                            <option value="Agency">Agency</option>
                            <option value="Local Business">Local Business</option>
                            <option value="Portfolio">Portfolio</option>
                            <option value="Personal Brand">Personal Brand</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Industry</label>
                          <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-3 text-heading text-sm focus:outline-none focus:border-primary transition-colors"
                          >
                            <option value="Technology">Technology</option>
                            <option value="Creative Arts">Creative / Design</option>
                            <option value="Food & Drink">Food & Cafe</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Finance">Finance</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Target Audience</label>
                          <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="e.g. Remote developers"
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-heading text-sm focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      {/* Layout Selection Popup Trigger */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Structure & Layout Blueprint</label>
                        <button
                          type="button"
                          onClick={() => setShowLayoutModal(true)}
                          className="w-full flex items-center justify-between bg-background border border-border hover:border-primary/50 rounded-lg px-4 py-3.5 text-heading text-sm font-semibold transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutGrid className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                              <span className="block text-sm font-bold text-heading">
                                {layoutType === "custom" ? "Custom AI Layout (Dynamic)" : `${selectedTemplate.toUpperCase()} Template`}
                              </span>
                              <span className="block text-[11px] text-muted font-normal mt-0.5">
                                {layoutType === "custom" 
                                  ? "AI dynamically plans layouts based on description." 
                                  : "Strictly follows the template wireframe section blueprint."}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full group-hover:bg-primary/20 transition-all">
                            Select Layout...
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Brand Identity */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-heading text-2xl font-bold flex items-center gap-2">
                        <Paintbrush className="w-6 h-6 text-primary" /> Define Brand Identity
                      </h2>
                      <p className="text-muted text-sm mt-1">Configure typography, logo details, and brand voice.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Typography Pairings</label>
                          <select
                            value={typoStyle}
                            onChange={(e) => setTypoStyle(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-3 text-heading text-sm focus:outline-none focus:border-primary transition-colors"
                          >
                            {TYPOGRAPHY_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Brand Voice Tone</label>
                          <select
                            value={brandVoice}
                            onChange={(e) => setBrandVoice(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-3 text-heading text-sm focus:outline-none focus:border-primary transition-colors"
                          >
                            {VOICE_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Logo Text Concept</label>
                        <input
                          type="text"
                          value={logoText}
                          onChange={(e) => setLogoText(e.target.value)}
                          placeholder="Logo textual representation"
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-heading text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Theme Color Palette</label>
                        <div className="flex gap-4 mb-4">
                          <button
                            type="button"
                            onClick={() => setColorPaletteType("ai")}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                              colorPaletteType === "ai"
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border hover:border-muted"
                            }`}
                          >
                            AI Suggested Palette
                          </button>
                          <button
                            type="button"
                            onClick={() => setColorPaletteType("manual")}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                              colorPaletteType === "manual"
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border hover:border-muted"
                            }`}
                          >
                            Choose Colors manually
                          </button>
                        </div>

                        {colorPaletteType === "ai" && (
                          <div className="space-y-4 p-4 bg-background/50 rounded-xl border border-border">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-heading flex items-center gap-1.5 animate-in fade-in duration-200">
                                <Sparkles className="w-3.5 h-3.5 text-primary" /> Active Palette Preview
                              </span>
                              <button
                                type="button"
                                onClick={suggestPalette}
                                className="flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-lg border border-primary/20 transition-all animate-in fade-in duration-200"
                              >
                                <Sparkles className="w-3 h-3" /> Suggest Creative Palette
                              </button>
                            </div>

                            <div className="flex rounded-lg overflow-hidden h-9 border border-border shadow-inner animate-in fade-in duration-200">
                              <div className="flex-1 flex flex-col items-center justify-center text-[9px] font-bold text-white shadow" style={{ backgroundColor: primaryColor }}>
                                <span className="drop-shadow-md">Primary</span>
                              </div>
                              <div className="flex-1 flex flex-col items-center justify-center text-[9px] font-bold text-white shadow" style={{ backgroundColor: secondaryColor }}>
                                <span className="drop-shadow-md">Secondary</span>
                              </div>
                              <div className="flex-1 flex flex-col items-center justify-center text-[9px] font-bold text-white shadow" style={{ backgroundColor: bgColor }}>
                                <span className="drop-shadow-md">Bg</span>
                              </div>
                              <div className="flex-1 flex flex-col items-center justify-center text-[9px] font-bold shadow" style={{ backgroundColor: textColor, color: bgColor }}>
                                <span className="drop-shadow-md">Text</span>
                              </div>
                              <div className="flex-1 flex flex-col items-center justify-center text-[9px] font-bold text-white shadow" style={{ backgroundColor: accentColor }}>
                                <span className="drop-shadow-md">Accent</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {colorPaletteType === "manual" && (
                          <div className="grid grid-cols-5 gap-3 p-4 bg-background/50 rounded-xl border border-border animate-in fade-in duration-200">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-muted mb-1">Primary</span>
                              <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-muted mb-1">Secondary</span>
                              <input
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-muted mb-1">Bg</span>
                              <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-muted mb-1">Text</span>
                              <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-muted mb-1">Accent</span>
                              <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Page Selection */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-heading text-2xl font-bold flex items-center gap-2">
                        <LayoutGrid className="w-6 h-6 text-primary" /> Select Required Pages
                      </h2>
                      <p className="text-muted text-sm mt-1">Check pages you would like the AI to construct automatically.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {PAGE_OPTIONS.map((p) => {
                        const isSelected = selectedPages && Array.isArray(selectedPages) && selectedPages.includes(p);
                        return (
                          <div
                            key={p}
                            onClick={() => togglePage(p)}
                            className={`p-4 rounded-xl border cursor-pointer select-none flex items-center justify-between transition-all ${
                              isSelected
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border bg-background/30 hover:border-muted text-muted"
                            }`}
                          >
                            <span className="text-sm font-semibold">{p}</span>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : "border-border bg-background"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Design Theme */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-heading text-2xl font-bold flex items-center gap-2">
                        <Type className="w-6 h-6 text-primary" /> Visual Design Language
                      </h2>
                      <p className="text-muted text-sm mt-1">Select theme styles and ambient settings.</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">Design Theme Styling</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {THEME_OPTIONS.map((o) => {
                            const active = designTheme === o;
                            return (
                              <button
                                key={o}
                                type="button"
                                onClick={() => setDesignTheme(o)}
                                className={`py-3 text-xs font-bold rounded-lg border transition-all ${
                                  active
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "border-border hover:border-muted text-muted"
                                }`}
                              >
                                {o}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">Background Theme Mode</label>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => setThemeMode("dark")}
                            className={`flex-1 py-3 text-sm font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                              themeMode === "dark"
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border hover:border-muted text-muted"
                            }`}
                          >
                            Dark Mode
                          </button>
                          <button
                            type="button"
                            onClick={() => setThemeMode("light")}
                            className={`flex-1 py-3 text-sm font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                              themeMode === "light"
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border hover:border-muted text-muted"
                            }`}
                          >
                            Light Mode
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Step 5: Ready to Generate */}
                {step === 5 && (
                  <div className="space-y-6 text-center py-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20 animate-pulse">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-heading text-3xl font-extrabold">Ready to Compile Blueprint</h2>
                    <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
                      Ventrixa will run the 8-stage assembly process, writing copy headers, colors palette styling, and page sections for: <br />
                      <span className="text-heading font-semibold mt-2 block">{selectedPages.join(", ")}</span>
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 pt-6 border-t border-border/80">
                  {step > 1 ? (
                    <button
                      onClick={handlePrev}
                      className="border border-border hover:border-muted text-heading text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1 bg-[#212632]/50"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 5 ? (
                    <button
                      onClick={handleNext}
                      className="bg-primary hover:bg-hover text-white text-sm font-bold px-6 py-2.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleStartGeneration}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-hover hover:to-purple-500 text-white text-sm font-bold px-7 py-3 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,46,110,0.3)]"
                    >
                      Generate Website Blueprint <Sparkles className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>
              </div>
            </BorderGlow>
          ) : (
            /* AI GENERATION PROCESSING VIEW (STEP 5 ACTIVE) */
            <BorderGlow glowColor="from-yellow-500 via-primary to-purple-600" duration={2}>
              <div className="bg-card rounded-xl p-8 md:p-10 border border-border text-left grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Column: Progress timeline */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-heading text-2xl font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      Assembling Website Blueprint
                    </h3>
                    <p className="text-muted text-xs mt-1">
                      Our dynamic procedural generator is compiling layouts, styling tokens, and content blueprints.
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-muted">Compiling...</span>
                      <span className="text-primary font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#212632] h-2 rounded-full overflow-hidden border border-border">
                      <div
                        className="bg-gradient-to-r from-primary to-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stages checklist */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {GENERATION_STAGES.map((stage, idx) => {
                      const isCompleted = idx < activeStageIdx;
                      const isCurrent = idx === activeStageIdx;
                      
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                            isCurrent
                              ? "bg-primary/5 border-primary/30 shadow-md"
                              : isCompleted
                              ? "bg-card/20 border-border opacity-70"
                              : "bg-transparent border-transparent opacity-40"
                          }`}
                        >
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            ) : isCurrent ? (
                              <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-border/20 border border-border flex items-center justify-center text-[8px] font-mono text-muted">
                                {idx + 1}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${isCurrent ? "text-primary" : "text-heading"}`}>
                              {stage.title}
                            </h4>
                            <p className="text-[10px] text-muted leading-relaxed mt-0.5">
                              {stage.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Visual Wireframe Mockup */}
                <div className="hidden md:flex flex-col items-center justify-center bg-[#212632]/50 border border-border/80 rounded-2xl p-6 relative overflow-hidden min-h-[380px]">
                  {/* Glowing background circles */}
                  <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl" />

                  {/* Browser outline */}
                  <div className="w-full bg-[#151821] border border-border/80 rounded-xl shadow-2xl flex flex-col overflow-hidden max-w-sm z-10 transition-all duration-500">
                    {/* Browser header tabs */}
                    <div className="border-b border-border/80 px-3 py-2 flex items-center justify-between bg-card/45 select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/50" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <span className="w-2 h-2 rounded-full bg-green-500/50" />
                      </div>
                      <span className="text-[9px] font-mono text-muted/60 bg-[#212632] px-3 py-0.5 rounded border border-border/20 w-32 truncate text-center">
                        {name ? `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com` : "new-site.com"}
                      </span>
                      <div className="w-6" />
                    </div>

                    {/* Canvas content */}
                    <div className="p-3 space-y-3 min-h-[240px] bg-background">
                      {/* Nav Bar Wireframe */}
                      <div
                        className={`border border-border/50 rounded p-1.5 flex items-center justify-between bg-card/30 transition-all duration-500 ${
                          activeStageIdx >= 2 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                        }`}
                      >
                        <div className="w-10 h-2 bg-primary/30 rounded" />
                        <div className="flex gap-2">
                          <div className="w-6 h-1.5 bg-muted/30 rounded" />
                          <div className="w-6 h-1.5 bg-muted/30 rounded" />
                          <div className="w-6 h-1.5 bg-muted/30 rounded" />
                        </div>
                      </div>

                      {/* Hero Wireframe */}
                      <div
                        className={`border border-border/50 rounded p-3 bg-card/20 flex gap-3 transition-all duration-500 ${
                          activeStageIdx >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      >
                        <div className="flex-1 space-y-2">
                          <div className="w-20 h-3 bg-heading/60 rounded" />
                          <div className="w-24 h-2 bg-muted/30 rounded" />
                          <div className="w-12 h-3.5 bg-primary/80 rounded" />
                        </div>
                        <div className="w-14 h-10 bg-muted/20 border border-border/40 rounded flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-muted/40 animate-pulse" />
                        </div>
                      </div>

                      {/* Middle Grid Wireframe */}
                      <div
                        className={`grid grid-cols-2 gap-2 transition-all duration-500 ${
                          activeStageIdx >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        }`}
                      >
                        <div className="border border-border/50 rounded p-2 bg-card/10 space-y-1.5">
                          <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </div>
                          <div className="w-10 h-2 bg-heading/60 rounded" />
                          <div className="w-14 h-1 bg-muted/20 rounded" />
                        </div>
                        <div className="border border-border/50 rounded p-2 bg-card/10 space-y-1.5">
                          <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </div>
                          <div className="w-10 h-2 bg-heading/60 rounded" />
                          <div className="w-14 h-1 bg-muted/20 rounded" />
                        </div>
                      </div>

                      {/* Footer Wireframe */}
                      <div
                        className={`border border-border/50 rounded p-1.5 flex justify-between bg-card/30 transition-all duration-500 ${
                          activeStageIdx >= 7 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        }`}
                      >
                        <div className="w-12 h-1.5 bg-muted/30 rounded" />
                        <div className="w-14 h-1.5 bg-muted/20 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Wireframe Floating HUD Tag */}
                  <div className="absolute bottom-4 right-4 bg-primary/20 border border-primary/40 text-primary text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow z-20 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" /> Live Assembly Mockup
                  </div>
                </div>
              </div>
            </BorderGlow>
          )}
        </div>
      </main>

      {/* Layout Selection Modal */}
      {showLayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#1c202b] border border-border/80 w-full max-w-6xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="border-b border-border/80 px-6 py-4 flex items-center justify-between bg-card/30">
              <div>
                <h3 className="text-heading text-lg font-bold flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-primary" /> Structure & Layout Selector
                </h3>
                <p className="text-muted text-xs mt-0.5">Select a layout template to generate exactly as previewed, or choose Custom AI.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowLayoutModal(false)}
                className="text-muted hover:text-white transition-colors text-sm font-semibold border border-border px-3 py-1.5 rounded-lg bg-[#212632]/50"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow flex overflow-hidden min-h-0">
              {/* Left Column: Template Selection List */}
              <div className="w-1/3 border-r border-border/80 p-4 overflow-y-auto space-y-3 bg-[#181b24]">
                <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Generation Modes</span>
                
                {/* Custom AI Layout option */}
                <div
                  onClick={() => {
                    setTempLayoutType("custom");
                    setTempSelectedTemplate("none");
                  }}
                  className={`p-4 rounded-xl border cursor-pointer select-none transition-all ${
                    tempLayoutType === "custom"
                      ? "bg-primary/10 border-primary text-primary shadow"
                      : "border-border/60 hover:border-muted text-muted bg-[#212632]/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">Custom AI Layout</span>
                  </div>
                  <p className="text-[10px] text-muted leading-relaxed mt-1">
                    AI synthesizes layout structure dynamically based on your website description.
                  </p>
                </div>

                <div className="border-t border-border/40 my-3" />
                <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Ready-Made Templates ({READY_TEMPLATES.length})</span>

                {/* Ready-made template choices */}
                {READY_TEMPLATES.map((t) => {
                  const isSelected = tempLayoutType === "template" && tempSelectedTemplate === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setTempLayoutType("template");
                        setTempSelectedTemplate(t.id);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow"
                          : "border-border/60 hover:border-muted text-muted bg-[#212632]/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold truncate">{t.name}</span>
                        <span className="text-[8px] uppercase tracking-wider text-primary font-mono font-bold bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded whitespace-nowrap">
                          {t.domain}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted leading-relaxed mt-1">{t.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Scrollable Live Wireframe Preview Stack */}
              <div className="w-2/3 p-6 overflow-y-auto bg-background/30 flex flex-col items-center justify-start min-h-0">
                <span className="block text-[10px] font-bold text-muted uppercase tracking-wider self-start mb-3">Live Blueprint Preview</span>

                {/* Browser Mock frame */}
                <div className="w-full bg-[#151821] border border-border/80 rounded-xl shadow-xl flex flex-col overflow-hidden max-w-xl">
                  {/* Browser toolbar */}
                  <div className="border-b border-border/80 px-3 py-2 flex items-center justify-between bg-card/40 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500/50" />
                      <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <span className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[8px] font-mono text-muted/60 bg-[#212632] px-3 py-0.5 rounded border border-border/20 w-48 truncate text-center font-semibold">
                      {name ? `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com` : "preview-layout.com"}
                    </span>
                    <div className="w-6" />
                  </div>

                  {/* Viewport sections stack based on temp choices */}
                  <div className="p-5 space-y-4 bg-background min-h-[350px]">
                    {/* Render matching sections */}
                    <div className="border border-border/40 rounded p-2 flex items-center justify-between bg-card/25 select-none">
                      <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Navbar</span>
                      <div className="flex gap-2">
                        <span className="w-6 h-1.5 bg-muted/30 rounded" />
                        <span className="w-6 h-1.5 bg-muted/30 rounded" />
                        <span className="w-6 h-1.5 bg-muted/30 rounded" />
                      </div>
                    </div>

                    {/* Render custom AI preview */}
                    {tempLayoutType === "custom" && (
                      <div className="space-y-4">
                        <div className="border border-dashed border-primary/40 rounded-lg p-8 bg-primary/5 flex flex-col items-center justify-center text-center select-none animate-pulse">
                          <Sparkles className="w-7 h-7 text-primary mb-2.5" />
                          <span className="text-xs font-bold text-heading">Dynamic AI Synthesis</span>
                          <span className="text-[10px] text-muted mt-1.5 max-w-[280px] leading-relaxed">
                            AI will outline and assemble sections specifically tailored to your business profile in the next step.
                          </span>
                        </div>
                        <div className="border border-border/30 rounded-lg p-5 bg-[#212632]/10 select-none opacity-50">
                          <div className="w-16 h-2 bg-muted/30 rounded mb-2.5" />
                          <div className="w-28 h-3 bg-muted/30 rounded mb-1.5" />
                          <div className="w-20 h-2 bg-muted/30 rounded" />
                        </div>
                        <div className="border border-border/30 rounded-lg p-5 bg-[#212632]/10 select-none opacity-50">
                          <div className="w-20 h-2 bg-muted/30 rounded mb-2.5" />
                          <div className="w-16 h-3 bg-muted/30 rounded" />
                        </div>
                      </div>
                    )}

                    {/* Render templates wireframes */}
                    {tempLayoutType === "template" && (
                      <div className="space-y-4 select-none">
                        {(() => {
                          const activeT = READY_TEMPLATES.find((t) => t.id === tempSelectedTemplate);
                          if (!activeT) return null;
                          return activeT.sections.map((sec, sIdx) => {
                            switch (sec.type) {
                              case "hero":
                                const isMin = sec.variant === "minimal";
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 flex gap-4">
                                    <div className="flex-grow space-y-2.5">
                                      <span className="text-[8px] font-bold text-primary uppercase block">Hero ({sec.variant})</span>
                                      <div className={`h-3.5 bg-heading/50 rounded ${isMin ? 'w-36 mx-auto' : 'w-24'}`} />
                                      <div className={`h-2 bg-muted/30 rounded ${isMin ? 'w-48 mx-auto' : 'w-36'}`} />
                                      <div className={`h-4.5 bg-primary/20 border border-primary/40 rounded ${isMin ? 'w-14 mx-auto' : 'w-10'}`} />
                                    </div>
                                    {!isMin && (
                                      <div className="w-16 h-16 bg-muted/20 border border-border/40 rounded flex items-center justify-center flex-shrink-0">
                                        <span className="text-[8px] text-muted">Image</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              case "features":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 space-y-2">
                                    <span className="text-[8px] font-bold text-primary uppercase block">Features Grid</span>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="border border-border/30 rounded p-2 space-y-1.5 bg-background/50">
                                        <div className="w-4 h-4 bg-primary/20 rounded-full" />
                                        <div className="w-8 h-1.5 bg-heading/40 rounded" />
                                      </div>
                                      <div className="border border-border/30 rounded p-2 space-y-1.5 bg-background/50">
                                        <div className="w-4 h-4 bg-primary/20 rounded-full" />
                                        <div className="w-8 h-1.5 bg-heading/40 rounded" />
                                      </div>
                                      <div className="border border-border/30 rounded p-2 space-y-1.5 bg-background/50">
                                        <div className="w-4 h-4 bg-primary/20 rounded-full" />
                                        <div className="w-8 h-1.5 bg-heading/40 rounded" />
                                      </div>
                                    </div>
                                  </div>
                                );
                              case "benefits":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 space-y-2">
                                    <span className="text-[8px] font-bold text-primary uppercase block">Benefits Row</span>
                                    <div className="flex gap-3 items-center">
                                      <div className="w-10 h-10 bg-muted/20 rounded flex-shrink-0" />
                                      <div className="flex-grow space-y-2">
                                        <div className="w-16 h-2 bg-heading/50 rounded" />
                                        <div className="w-24 h-1 bg-muted/30 rounded" />
                                      </div>
                                    </div>
                                  </div>
                                );
                              case "services":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 space-y-2">
                                    <span className="text-[8px] font-bold text-primary uppercase block">Services Menu</span>
                                    <div className="space-y-2">
                                      <div className="flex justify-between border-b border-border/20 pb-1.5">
                                        <div className="w-20 h-2 bg-heading/40 rounded" />
                                        <div className="w-6 h-2 bg-primary/20 rounded" />
                                      </div>
                                      <div className="flex justify-between">
                                        <div className="w-20 h-2 bg-heading/40 rounded" />
                                        <div className="w-6 h-2 bg-primary/20 rounded" />
                                      </div>
                                    </div>
                                  </div>
                                );
                              case "pricing":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 space-y-2">
                                    <span className="text-[8px] font-bold text-primary uppercase block">Pricing Tiers</span>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="border border-border/30 rounded p-2 text-center bg-background/50">
                                        <span className="text-[7px] text-muted block">Basic</span>
                                        <span className="text-[10px] font-bold text-heading block">$29</span>
                                      </div>
                                      <div className="border border-primary/40 rounded p-2 text-center bg-primary/5">
                                        <span className="text-[7px] text-primary font-bold block">Pro</span>
                                        <span className="text-[10px] font-bold text-primary block">$79</span>
                                      </div>
                                      <div className="border border-border/30 rounded p-2 text-center bg-background/50">
                                        <span className="text-[7px] text-muted block">Ent</span>
                                        <span className="text-[10px] font-bold text-heading block">$199</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              case "testimonials":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 space-y-2">
                                    <span className="text-[8px] font-bold text-primary uppercase block">Client Stories</span>
                                    <div className="flex gap-2">
                                      <div className="flex-1 border border-border/30 rounded p-2 bg-background/50">
                                        <div className="w-full h-1.5 bg-muted/20 rounded mb-2" />
                                        <div className="w-10 h-1.5 bg-heading/40 rounded" />
                                      </div>
                                      <div className="flex-1 border border-border/30 rounded p-2 bg-background/50">
                                        <div className="w-full h-1.5 bg-muted/20 rounded mb-2" />
                                        <div className="w-10 h-1.5 bg-heading/40 rounded" />
                                      </div>
                                    </div>
                                  </div>
                                );
                              case "faq":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 space-y-2">
                                    <span className="text-[8px] font-bold text-primary uppercase block">FAQs Accordion</span>
                                    <div className="border border-border/30 rounded p-2.5 flex justify-between items-center bg-background/40">
                                      <div className="w-24 h-1.5 bg-heading/40 rounded" />
                                      <span className="text-[7px] text-muted font-bold">+</span>
                                    </div>
                                  </div>
                                );
                              case "contact":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 space-y-2">
                                    <span className="text-[8px] font-bold text-primary uppercase block">Contact Form</span>
                                    <div className="flex gap-3">
                                      <div className="flex-grow space-y-2">
                                        <div className="w-16 h-2 bg-muted/40 rounded" />
                                        <div className="w-24 h-2 bg-muted/40 rounded" />
                                      </div>
                                      <div className="w-16 h-10 bg-muted/10 border border-border/30 rounded" />
                                    </div>
                                  </div>
                                );
                              case "cta":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 text-center space-y-2">
                                    <span className="text-[8px] font-bold text-primary uppercase block">Call to Action</span>
                                    <div className="w-24 h-2 bg-heading/40 rounded mx-auto" />
                                    <div className="w-12 h-4.5 bg-primary/20 border border-primary/40 rounded mx-auto" />
                                  </div>
                                );
                              case "about":
                                return (
                                  <div key={sIdx} className="border border-border/60 rounded-lg p-4 bg-card/20 flex gap-4">
                                    <div className="flex-grow space-y-2">
                                      <span className="text-[8px] font-bold text-primary uppercase block">About Us</span>
                                      <div className="w-20 h-2 bg-heading/40 rounded" />
                                      <div className="w-28 h-1.5 bg-muted/30 rounded" />
                                    </div>
                                    <div className="w-12 h-12 bg-muted/20 border border-border/40 rounded flex-shrink-0" />
                                  </div>
                                );
                              case "footer":
                                return (
                                  <div key={sIdx} className="border border-border/40 rounded p-2 flex justify-between bg-card/25">
                                    <span className="text-[7px] text-muted">Footer Copyright</span>
                                    <span className="text-[7px] text-muted">© 2026</span>
                                  </div>
                                );
                              default:
                                return null;
                            }
                          });
                        })()}
                      </div>
                    )}

                    {/* Footer wireframe */}
                    <div className="border border-border/40 rounded p-1.5 flex justify-between bg-card/20 select-none">
                      <span className="text-[7px] text-muted">{name || "Footer"}</span>
                      <span className="text-[7px] text-muted">© 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border/80 px-6 py-4 flex items-center justify-between bg-card/10">
              <span className="text-xs text-muted">
                Selected: <span className="font-semibold text-heading">{tempLayoutType === "custom" ? "Custom AI Layout" : `${tempSelectedTemplate.toUpperCase()} Template`}</span>
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLayoutModal(false)}
                  className="px-4 py-2 border border-border hover:border-muted text-muted hover:text-heading text-xs font-semibold rounded-lg bg-[#212632]/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLayoutType(tempLayoutType);
                    setSelectedTemplate(tempSelectedTemplate);
                    setShowLayoutModal(false);
                  }}
                  className="bg-primary hover:bg-hover text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors"
                >
                  Apply Layout Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Wizard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#151821] flex flex-col items-center justify-center text-heading">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted text-sm font-mono">Loading OS Wizard...</p>
      </div>
    }>
      <WizardContent />
    </Suspense>
  );
}
