"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  Rocket,
  Smartphone,
  Tablet as TabletIcon,
  Monitor,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Eye,
  Edit3,
  CheckCircle,
  Download,
  Check,
  Globe,
  ExternalLink,
  X,
  LayoutGrid,
  Maximize2,
  Minimize2,
  FolderUp,
  Server,
  Cloud,
  FileCode,
  Layers,
  AlertTriangle,
} from "lucide-react";
import SectionRenderer from "@/components/SectionRenderer";
import { getBrandStyles, CURATED_PALETTES } from "@/lib/styles";
import { READY_TEMPLATES } from "@/lib/templates";

const compressImage = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(img.src);
        resolve(dataUrl);
      } else {
        URL.revokeObjectURL(img.src);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result as string);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(img.src);
      reject(err);
    };
  });
};

const SECTION_TEMPLATES = {
  hero: {
    type: "hero",
    variant: "modern",
    props: {
      title: "New Headline Added",
      subtitle: "Customize this subtitle text to fit your business guidelines.",
      ctaText: "Explore More",
      ctaLink: "#",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    },
  },
  features: {
    type: "features",
    variant: "modern",
    props: {
      title: "Core Service Highlights",
      subtitle: "Take a look at what makes our implementation stand out from competitors.",
      items: [
        { title: "Rapid Automation", desc: "Automate manual task entries in seconds.", icon: "zap" },
        { title: "High Reliability", desc: "Safe encryption protocols standard on all runs.", icon: "shield" },
      ],
    },
  },
  cta: {
    type: "cta",
    variant: "modern",
    props: {
      title: "Join Thousands of Builders Today",
      subtitle: "Launch your custom digital business blueprint in minutes.",
      buttonText: "Register Free",
      buttonLink: "#",
    },
  },
  faq: {
    type: "faq",
    variant: "modern",
    props: {
      title: "Help & Frequently Asked Questions",
      subtitle: "Find fast answers to common setup tasks.",
      items: [
        { q: "How do I edit layouts?", a: "Simply click on any item in the preview canvas and edit its content in the right sidebar." },
      ],
    },
  },
};

export default function VisualEditor({
  params,
}: {
  params: React.Usable<{ projectId: string }>;
}) {
  const { projectId } = React.use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Project and Site Configurations
  const { data: session } = useSession();
  const isPro = session?.user?.plan === "pro";

  const [project, setProject] = useState<any>(null);
  const [website, setWebsite] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false);
  const [proUpgradeFeature, setProUpgradeFeature] = useState("");

  // Editor states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [canvasView, setCanvasView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editMode, setEditMode] = useState<"edit" | "preview">("edit");
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "alert" | "confirm";
    onConfirm?: () => void;
  }>({ isOpen: false, title: "", message: "", type: "alert" });

  // Undo/Redo stack history
  const [history, setHistory] = useState<any[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add new section dropdown state
  const [showAddSection, setShowAddSection] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const loadWorkspaceData = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages);
        setWebsite(data.website);
        if (data.pages.length > 0) {
          setActivePage(data.pages[0]);
        }
        setIsUnsaved(false);
      }

      const pRes = await fetch(`/api/projects/${projectId}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setProject(pData);
      }
    } catch (e) {
      console.error("Workspace load failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadWorkspaceData();
    }
  }, [session, projectId]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUnsaved) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isUnsaved]);

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept shortcut when typing in inputs/textareas
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      const isUndo = (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z";
      const isRedo =
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"));

      if (isUndo) {
        e.preventDefault();
        handleUndo();
      } else if (isRedo) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  // Load sections when active page changes
  useEffect(() => {
    const fetchPageSections = async () => {
      if (!activePage) return;
      try {
        const res = await fetch(`/api/pages/${activePage.id || activePage._id}/sections`);
        if (res.ok) {
          const list = await res.json();
          // sort by position
          const sorted = list.sort((a: any, b: any) => a.position - b.position);
          setSections(sorted);
          // Reset history on page switch
          setHistory([sorted]);
          setHistoryIndex(0);
          setSelectedSectionIdx(null);
          setSelectedElementId(null);
          setIsUnsaved(false);
        }
      } catch (err) {
        console.error("Error loading page sections:", err);
      }
    };
    fetchPageSections();
  }, [activePage]);

  // Update canvas state with history entry
  const updateSectionsState = (newSections: any[]) => {
    setSections(newSections);
    setIsUnsaved(true);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newSections]);
    setHistoryIndex(newHistory.length);
  };

  const applyTemplateLayout = (templateId: string) => {
    setDialogState({
      isOpen: true,
      title: "Replace Layout?",
      message: "Are you sure you want to replace the current page layout with this template? Your unsaved custom modifications on this page will be overwritten.",
      type: "confirm",
      onConfirm: () => executeApplyTemplateLayout(templateId)
    });
  };

  const executeApplyTemplateLayout = (templateId: string) => {

    const template = READY_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const companyName = project?.name || "Brand";
    const emailDomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const email = `contact@${emailDomain || "business"}.com`;

    const interpolated = template.sections.map((sec) => {
      const newProps = JSON.parse(JSON.stringify(sec.props));

      const interpolate = (str: any): any => {
        if (typeof str !== "string") return str;
        return str
          .replace(/ApexFlow/g, companyName)
          .replace(/ApexFlow's/g, `${companyName}'s`)
          .replace(/ApexAgency/g, companyName)
          .replace(/apexagency\.com/g, `${emailDomain}.com`)
          .replace(/Brew House Cafe/g, companyName)
          .replace(/Brew House/g, companyName)
          .replace(/Apex Athletics/g, companyName)
          .replace(/Vane & Partners/g, companyName)
          .replace(/Vane Barber Shop/g, companyName)
          .replace(/Vane/g, companyName)
          .replace(/Crestwood Realty/g, companyName)
          .replace(/Crestwood/g, companyName)
          .replace(/Silicon Clinic/g, companyName)
          .replace(/Alex/g, companyName)
          .replace(/alex@designscode\.dev/g, email)
          .replace(/orders@brewhousecafe\.com/g, email)
          .replace(/welcome@apexathletics\.com/g, email)
          .replace(/intake@vanelegal\.com/g, email)
          .replace(/summit@ventrixa\.site/g, email)
          .replace(/cuts@vanebarbershop\.com/g, email)
          .replace(/care@siliconclinic\.com/g, email)
          .replace(/brokerage@crestwoodrealty\.com/g, email)
          .replace(/info@localservicing\.com/g, email)
          .replace(/office@localservicing\.com/g, email);
      };

      for (const key in newProps) {
        if (typeof newProps[key] === "string") {
          newProps[key] = interpolate(newProps[key]);
        } else if (Array.isArray(newProps[key])) {
          newProps[key] = newProps[key].map((item: any) => {
            if (typeof item === "string") {
              return interpolate(item);
            } else if (item && typeof item === "object") {
              const newItem = { ...item };
              for (const k in newItem) {
                if (typeof newItem[k] === "string") {
                  newItem[k] = interpolate(newItem[k]);
                } else if (Array.isArray(newItem[k])) {
                  newItem[k] = newItem[k].map(interpolate);
                }
              }
              return newItem;
            }
            return item;
          });
        }
      }

      return {
        type: sec.type,
        variant: sec.variant,
        props: newProps,
        style: sec.style || {},
        id: Math.random().toString(36).substring(2, 9),
        _id: Math.random().toString(36).substring(2, 9),
      };
    });

    updateSectionsState(interpolated);
    setSelectedSectionIdx(null);
    setSelectedElementId(null);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
      setSelectedSectionIdx(null);
      setSelectedElementId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
      setSelectedSectionIdx(null);
      setSelectedElementId(null);
    }
  };

  // Sections Actions
  const moveSection = (idx: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const reordered = [...sections];
    const temp = reordered[idx];
    reordered[idx] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    updateSectionsState(reordered);
    setSelectedSectionIdx(targetIdx);
  };

  const duplicateSection = (idx: number) => {
    const duplicated = [...sections];
    const source = duplicated[idx];
    const copy = {
      ...source,
      id: Math.random().toString(36).substring(2, 9),
      _id: Math.random().toString(36).substring(2, 9),
      position: idx + 1,
    };
    duplicated.splice(idx + 1, 0, copy);
    updateSectionsState(duplicated);
    setSelectedSectionIdx(idx + 1);
  };

  const deleteSection = (idx: number) => {
    if (sections.length <= 1) {
      setDialogState({
        isOpen: true,
        title: "Action Restricted",
        message: "Your website needs at least one section!",
        type: "alert"
      });
      return;
    }
    const filtered = sections.filter((_, i) => i !== idx);
    updateSectionsState(filtered);
    setSelectedSectionIdx(null);
    setSelectedElementId(null);
  };

  const addSection = (type: keyof typeof SECTION_TEMPLATES) => {
    const template = SECTION_TEMPLATES[type];
    if (!template) return;

    const newSec = {
      ...template,
      id: Math.random().toString(36).substring(2, 9),
      _id: Math.random().toString(36).substring(2, 9),
      position: sections.length,
    };

    updateSectionsState([...sections, newSec]);
    setSelectedSectionIdx(sections.length);
    setShowAddSection(false);
  };

  const handlePropChange = (key: string, val: any) => {
    if (selectedSectionIdx === null) return;
    const updated = [...sections];
    updated[selectedSectionIdx] = {
      ...updated[selectedSectionIdx],
      props: {
        ...updated[selectedSectionIdx].props,
        [key]: val,
      },
    };
    updateSectionsState(updated);
  };

  const handleLogoUpdate = async (key: string, value: any) => {
    if (!project) return;
    const updatedProject = {
      ...project,
      [key]: value
    };

    let payload: any = { [key]: value };

    // Auto-update color palette when switching theme modes
    if (key === "theme") {
      const palette = project.colorPalette || {};
      if (value === "light") {
        updatedProject.colorPalette = {
          primary: palette.primary || "#ff2e6e",
          accent: palette.accent || "#ff4e87",
          background: "#ffffff",
          text: "#334155",
          secondary: "#f8fafc",
        };
      } else {
        updatedProject.colorPalette = {
          primary: palette.primary || "#ff2e6e",
          accent: palette.accent || "#ff4e87",
          background: "#151821",
          text: "#d6dae2",
          secondary: "#212632",
        };
      }
      payload = {
        theme: value,
        colorPalette: updatedProject.colorPalette
      };
    }

    setProject(updatedProject);

    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Error updating logo property:", err);
    }
  };

  const handleColorPaletteChange = (key: string, value: string) => {
    if (!project) return;
    const newPalette = {
      ...project.colorPalette,
      [key]: value
    };
    handleLogoUpdate("colorPalette", newPalette);
  };

  const handleSuggestAIPalette = () => {
    if (!project) return;
    const mode = project.theme === "light" ? "light" : "dark";
    const list = CURATED_PALETTES[mode] || [];
    if (list.length === 0) return;
    
    let filtered = list;
    if (project.colorPalette && project.colorPalette.name) {
      filtered = list.filter(p => p.name !== project.colorPalette.name);
    }
    const pool = filtered.length > 0 ? filtered : list;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    const newPalette = {
      primary: selected.primary,
      secondary: selected.secondary,
      background: selected.background,
      text: selected.text,
      accent: selected.accent,
      name: selected.name,
    };

    handleLogoUpdate("colorPalette", newPalette);
  };

  const handleElementStyleChange = (elementId: string, styleKey: string, val: any) => {
    if (selectedSectionIdx === null || !sections[selectedSectionIdx]) return;
    const updated = [...sections];
    const section = updated[selectedSectionIdx];
    const currentStyle = section.style || {};
    const elementStyle = { ...(currentStyle[elementId] || {}) };

    if (val === "" || val === undefined) {
      delete elementStyle[styleKey];
    } else {
      elementStyle[styleKey] = val;
    }

    updated[selectedSectionIdx] = {
      ...section,
      style: {
        ...currentStyle,
        [elementId]: Object.keys(elementStyle).length > 0 ? elementStyle : undefined
      }
    };
    updateSectionsState(updated);
  };

  const adjustSectionPadding = (idx: number, direction: "increase" | "decrease") => {
    if (idx === null || !sections[idx]) return;
    const updated = [...sections];
    const section = updated[idx];
    const currentStyle = section.style || {};
    const sectionStyle = { ...(currentStyle.section || {}) };

    let currentPadTop = sectionStyle.paddingTop || sectionStyle.padding || "96px";
    let padValue = parseInt(currentPadTop);
    if (isNaN(padValue)) padValue = 96;

    if (direction === "increase") {
      padValue = Math.min(padValue + 16, 240);
    } else {
      padValue = Math.max(padValue - 16, 16);
    }

    updated[idx] = {
      ...section,
      style: {
        ...currentStyle,
        section: {
          ...sectionStyle,
          paddingTop: `${padValue}px`,
          paddingBottom: `${padValue}px`,
        }
      }
    };
    updateSectionsState(updated);
  };

  const handleItemChange = (idx: number, field: string, val: any) => {
    if (selectedSectionIdx === null || !sections[selectedSectionIdx]) return;
    const updated = [...sections];
    const section = updated[selectedSectionIdx];
    if (section.props.items && Array.isArray(section.props.items)) {
      const updatedItems = [...section.props.items];
      updatedItems[idx] = {
        ...updatedItems[idx],
        [field]: val
      };
      updated[selectedSectionIdx] = {
        ...section,
        props: {
          ...section.props,
          items: updatedItems
        }
      };
      updateSectionsState(updated);
    }
  };

  const handlePricingChange = (idx: number, field: string, val: any) => {
    if (selectedSectionIdx === null || !sections[selectedSectionIdx]) return;
    const updated = [...sections];
    const section = updated[selectedSectionIdx];
    if (section.props.tiers && Array.isArray(section.props.tiers)) {
      const updatedTiers = [...section.props.tiers];
      updatedTiers[idx] = {
        ...updatedTiers[idx],
        [field]: val
      };
      updated[selectedSectionIdx] = {
        ...section,
        props: {
          ...section.props,
          tiers: updatedTiers
        }
      };
      updateSectionsState(updated);
    }
  };

  const handleSave = async () => {
    if (!activePage) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${activePage.id || activePage._id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });

      if (res.ok) {
        setIsUnsaved(false);
        setAlertMsg({ type: "success", text: "Page modifications saved successfully!" });
        setTimeout(() => setAlertMsg(null), 3000);
      } else {
        setAlertMsg({ type: "error", text: `Failed to save changes: ${res.statusText || "Server Error"}` });
        setTimeout(() => setAlertMsg(null), 4000);
      }
    } catch (e) {
      console.error("Save sections failed:", e);
      setAlertMsg({ type: "error", text: "Network connection error while saving changes." });
      setTimeout(() => setAlertMsg(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeploy = async () => {
    if (!website) return;
    await handleSave();

    // Quick redeploy if already published
    if (website.isPublished) {
      setAlertMsg({ type: "success", text: "Updating existing deployment..." });
      try {
        const res = await fetch("/api/deploy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subdomain: website.subdomain }),
        });
        if (res.ok) {
           const data = await res.json();
           setWebsite((prev: any) => ({ ...prev, isPublished: true, version: data.version }));
           setDeploySuccess(true);
        } else {
           setAlertMsg({ type: "error", text: "Error updating deployment." });
        }
      } catch (e) {
         setAlertMsg({ type: "error", text: "Network error during deployment." });
      }
      return;
    }

    setDeploying(true);
    setDeploySuccess(false);
    setDeployLogs([]);
    setCopiedLink(false);

    const simLogs = [
      "Compressing production code bundle templates...",
      "Uploading assets to Ventrixa Edge Distribution Network...",
      "Propagating build payload globally to 48 server locations...",
      "Registering custom routing tables for: " + website.subdomain + ".ventrixa.site...",
      "Configuring DNS servers & provisioning SSL security certificates...",
      "Deployment distributed successfully to SF, London, Tokyo, and Frankfurt!"
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < simLogs.length) {
        setDeployLogs((prev) => [...prev, simLogs[logIdx]]);
        logIdx++;
      }
    }, 1200);

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain: website.subdomain }),
      });

      clearInterval(interval);

      if (res.ok) {
        const runLogsFinish = () => {
          if (logIdx < simLogs.length) {
            setDeployLogs((prev) => [...prev, ...simLogs.slice(logIdx)]);
          }
          setDeployLogs((prev) => [...prev, "Sync complete! Project is now accessible globally."]);
          setTimeout(() => {
            setDeploying(false);
            setDeploySuccess(true);
          }, 1200);
        };
        runLogsFinish();
      } else {
        setDeployLogs((prev) => [...prev, "Error: Edge routing propagation failed."]);
      }
    } catch (e) {
      clearInterval(interval);
      setDeployLogs((prev) => [...prev, "Error: Network error during edge compilation."]);
    }
  };

  const handleDownloadZip = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/export`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${project?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project"}-source.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        setDialogState({ isOpen: true, title: "Export Failed", message: "Failed to export project code. Please try again.", type: "alert" });
      }
    } catch (e) {
      console.error("Download ZIP error:", e);
      setDialogState({ isOpen: true, title: "Export Error", message: "Error occurred during ZIP generation.", type: "alert" });
    } finally {
      setExporting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#151821] flex flex-col items-center justify-center text-heading">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted text-sm font-mono">Loading workspace editor...</p>
      </div>
    );
  }

  const selectedSection = selectedSectionIdx !== null ? sections[selectedSectionIdx] : null;

  return (
    <div className="min-h-screen bg-[#10121a] text-[#D6DAE2] flex flex-col font-sans overflow-hidden relative">
      {/* Alert banner overlay */}
      {alertMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-2xl border text-xs font-bold ${
            alertMsg.type === "success" 
              ? "bg-green-500/10 border-green-500/30 text-green-400" 
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            <span>{alertMsg.text}</span>
            <button type="button" onClick={() => setAlertMsg(null)} className="ml-1 hover:opacity-80 p-0.5 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Global Dialog Modal */}
      {dialogState.isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDialogState(prev => ({ ...prev, isOpen: false })); }}
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
              onClick={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 border border-blue-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-white text-2xl font-bold mb-3">{dialogState.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">{dialogState.message}</p>

            <div className="flex gap-4">
              {dialogState.type === "confirm" ? (
                <>
                  <button
                    onClick={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-bold py-3.5 rounded-xl transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setDialogState(prev => ({ ...prev, isOpen: false }));
                      if (dialogState.onConfirm) dialogState.onConfirm();
                    }}
                    className="flex-1 bg-gradient-to-r from-[#FF2E6E] to-[#9d174d] hover:brightness-110 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,46,110,0.25)]"
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
                  className="w-full bg-gradient-to-r from-[#FF2E6E] to-[#9d174d] hover:brightness-110 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,46,110,0.25)]"
                >
                  Got it
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pro Upgrade Modal */}
      {showProUpgradeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowProUpgradeModal(false); }}
        >
          <div
            className="relative w-full max-w-md text-center p-8 overflow-hidden rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(18,20,28,0.98) 0%, rgba(22,14,20,0.98) 100%)",
              border: "1px solid rgba(139,92,246,0.3)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,246,0.1)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(255,255,255,0.3), rgba(139,92,246,0.6), transparent)" }} />
            
            <button
              onClick={() => setShowProUpgradeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <h2 className="text-white text-2xl font-bold mb-3">Pro Feature Locked</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              <span className="font-semibold text-purple-300">{proUpgradeFeature}</span> is exclusively available for Pro Builder Mode users.
            </p>
            
            <ul className="text-left space-y-2 text-xs font-medium text-gray-300 mb-8 mx-auto inline-block">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Up to 10 Projects & Deployments</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Advanced AI Regenerations</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Custom Domains & SEO Setup</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Cloud Database Storage</li>
            </ul>

            <Link
              href="/profile"
              className="block w-full bg-gradient-to-r from-purple-600 to-[#FF2E6E] hover:brightness-110 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)]"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}

      {/* Visual Editor Header */}
      <header className="border-b border-border bg-background px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="font-extrabold text-heading text-sm sm:text-base leading-tight">
              {project?.name || "Workspace Editor"}
            </span>
            <span className="text-muted text-[10px] font-mono leading-none">
              {website?.subdomain && `${website.subdomain}.ventrixa.site`}
            </span>
          </div>
        </div>

        {/* Dynamic Resize controls */}
        <div className="hidden lg:flex items-center bg-[#212632]/80 border border-border rounded-lg p-0.5">
          <button
            onClick={() => setCanvasView("desktop")}
            className={`p-2 rounded-md transition-all ${
              canvasView === "desktop" ? "bg-primary/20 text-primary border border-primary/20" : "text-muted hover:text-white"
            }`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCanvasView("tablet")}
            className={`p-2 rounded-md transition-all ${
              canvasView === "tablet" ? "bg-primary/20 text-primary border border-primary/20" : "text-muted hover:text-white"
            }`}
            title="Tablet view"
          >
            <TabletIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCanvasView("mobile")}
            className={`p-2 rounded-md transition-all ${
              canvasView === "mobile" ? "bg-primary/20 text-primary border border-primary/20" : "text-muted hover:text-white"
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-3">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1.5 border-r border-border pr-3">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded hover:bg-[#212632] disabled:opacity-30 disabled:hover:bg-transparent text-muted hover:text-white"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded hover:bg-[#212632] disabled:opacity-30 disabled:hover:bg-transparent text-muted hover:text-white"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Mode switch */}
          <button
            onClick={() => setEditMode(editMode === "edit" ? "preview" : "edit")}
            className="border border-border text-heading text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 hover:border-primary transition-colors bg-[#212632]/40"
          >
            {editMode === "edit" ? (
              <>
                <Eye className="w-3.5 h-3.5" /> Preview Mode
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" /> Build Mode
              </>
            )}
          </button>

          {/* Save/Deploy */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="border border-border hover:border-primary text-heading text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors bg-[#212632]/40"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save
              </>
            )}
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={exporting}
            className="border border-border hover:border-purple-500 text-heading text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors bg-[#212632]/40 disabled:opacity-50 cursor-pointer"
          >
            {exporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Exporting...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" /> Download ZIP
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (!isPro) {
                setProUpgradeFeature("Custom Domains & SEO Configuration");
                setShowProUpgradeModal(true);
              } else {
                setDialogState({ isOpen: true, title: "Coming Soon", message: "Advanced SEO & Domain Configuration dashboard is rolling out to Pro users soon!", type: "alert" });
              }
            }}
            className="border border-border hover:border-amber-500 text-heading text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors bg-[#212632]/40 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" /> SEO & Domains
          </button>

          <button
            onClick={() => {
              if (!isPro) {
                setProUpgradeFeature("AI Layout Regeneration");
                setShowProUpgradeModal(true);
              } else {
                setDialogState({ isOpen: true, title: "Coming Soon", message: "AI Regenerate capabilities are currently being calibrated for Pro users.", type: "alert" });
              }
            }}
            className="border border-border hover:border-cyan-500 text-heading text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors bg-[#212632]/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Regenerate
          </button>

          <button
            onClick={handleDeploy}
            className="bg-primary hover:bg-hover text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,46,110,0.3)] cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" /> Deploy
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar: Pages & Sections list */}
        {editMode === "edit" && (
          <aside className="w-64 border-r border-border bg-background flex flex-col flex-shrink-0 z-20 overflow-y-auto">
            {/* Page selection */}
            <div className="p-4 border-b border-border/80">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Active Workspace Page</label>
              <select
                value={activePage?.id || activePage?._id || ""}
                onChange={(e) => {
                  const pg = pages.find((p) => (p.id || p._id) === e.target.value);
                  if (pg) setActivePage(pg);
                }}
                className="w-full bg-[#212632] border border-border rounded-lg px-2.5 py-2 text-heading text-xs font-semibold focus:outline-none focus:border-primary"
              >
                {pages.map((p) => (
                  <option key={p.id || p._id} value={p.id || p._id}>
                    {p.name} (/{p.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Page Templates Switcher */}
            <div className="p-4 border-b border-border/80 bg-background/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-2 flex items-center gap-1.5 select-none">
                <LayoutGrid className="w-3.5 h-3.5 text-primary" /> Swap Page Layout
              </span>
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      applyTemplateLayout(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full bg-[#212632] border border-border rounded-lg px-2.5 py-2 text-heading text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Choose layout template...</option>
                  {READY_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.domain})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[9px] text-muted leading-relaxed mt-1.5 select-none">
                Swapping layouts will replace all sections on this page with the selected template structure.
              </p>
            </div>

            {/* Sections Outline */}
            <div className="p-4 flex-grow space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Page Sections</span>
                <div className="relative">
                  <button
                    onClick={() => setShowAddSection(!showAddSection)}
                    className="p-1 rounded bg-[#212632] text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                    title="Add Layout Block"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  {showAddSection && (
                    <div className="absolute right-0 mt-1 w-44 bg-[#212632] border border-border rounded-lg shadow-2xl py-1.5 z-40 text-xs font-semibold">
                      <button
                        onClick={() => addSection("hero")}
                        className="w-full text-left px-3 py-2 hover:bg-primary/25 hover:text-primary transition-colors"
                      >
                        Hero Section
                      </button>
                      <button
                        onClick={() => addSection("features")}
                        className="w-full text-left px-3 py-2 hover:bg-primary/25 hover:text-primary transition-colors"
                      >
                        Features Grid
                      </button>
                      <button
                        onClick={() => addSection("cta")}
                        className="w-full text-left px-3 py-2 hover:bg-primary/25 hover:text-primary transition-colors"
                      >
                        CTA Panel
                      </button>
                      <button
                        onClick={() => addSection("faq")}
                        className="w-full text-left px-3 py-2 hover:bg-primary/25 hover:text-primary transition-colors"
                      >
                        FAQ Accordion
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sections list cards */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {sections.map((sec, idx) => {
                  const active = selectedSectionIdx === idx;
                  return (
                    <div
                      key={sec.id || sec._id}
                      onClick={() => {
                        setSelectedSectionIdx(idx);
                        setSelectedElementId(null);
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                        active ? "bg-primary/10 border-primary text-primary" : "bg-card/30 border-border hover:border-muted text-muted"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold capitalize text-heading">{sec.type}</p>
                        <p className="text-[10px] font-mono text-muted/80">{sec.variant}</p>
                      </div>

                      {active && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(idx, "up");
                            }}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-[#212632] disabled:opacity-20 text-heading"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(idx, "down");
                            }}
                            disabled={idx === sections.length - 1}
                            className="p-1 rounded hover:bg-[#212632] disabled:opacity-20 text-heading"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateSection(idx);
                            }}
                            className="p-1 rounded hover:bg-[#212632] text-heading"
                            title="Duplicate"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(idx);
                            }}
                            className="p-1 rounded hover:bg-[#212632] text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Editor Preview Canvas (Center) */}
        <div className="flex-grow bg-[#151821]/60 flex justify-center items-start overflow-y-auto p-8 z-10">
          <div
            className={`transition-all duration-300 border border-border shadow-2xl rounded-2xl overflow-hidden text-foreground ${
              project?.theme === "light" ? "light" : "dark"
            }`}
            style={{
              width: canvasView === "desktop" ? "100%" : canvasView === "tablet" ? "768px" : "375px",
              maxWidth: "100%",
              minHeight: "80vh",
              ...getBrandStyles(project?.colorPalette),
              background: "var(--bg-gradient)",
            }}
          >
            {/* Header placeholder in preview */}
            <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-card/20 select-none">
              <div
                onClick={(e) => {
                  if (editMode === "edit") {
                    e.stopPropagation();
                    setSelectedSectionIdx(null);
                    setSelectedElementId("logo");
                  }
                }}
                className={`cursor-pointer transition-all p-1 ${
                  editMode === "edit" && selectedElementId === "logo"
                    ? "outline outline-2 outline-primary outline-offset-2 rounded"
                    : "hover:outline hover:outline-1 hover:outline-primary/50 hover:outline-offset-1"
                }`}
              >
                {project?.logoType === "image" && project?.logoSrc ? (
                  <img
                    src={project.logoSrc}
                    alt={project.logoText || "Logo"}
                    style={{
                      width: project.logoWidth ? `${project.logoWidth}px` : "auto",
                      height: project.logoHeight ? `${project.logoHeight}px` : "32px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span className="font-bold text-heading text-sm">{project?.logoText || "Brand"}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-muted justify-end">
                {pages.map((p) => (
                  <span key={p.id || p._id}>{p.name}</span>
                ))}
              </div>
            </div>

            {/* Main Sections render stack */}
            <div className="divide-y divide-border/20">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id || sec._id}
                  onClick={() => {
                    if (editMode === "edit") {
                      setSelectedSectionIdx(idx);
                    }
                  }}
                  className={`relative ${
                    editMode === "edit" && selectedSectionIdx === idx ? "ring-2 ring-primary ring-inset" : ""
                  }`}
                >
                  <SectionRenderer
                    type={sec.type}
                    variant={sec.variant}
                    props={sec.props}
                    style={sec.style}
                    brandColors={project?.colorPalette}
                    canvasView={canvasView}
                    onElementClick={(elId) => {
                      if (editMode === "edit") {
                        setSelectedSectionIdx(idx);
                        setSelectedElementId(elId);
                      }
                    }}
                    selectedElementId={selectedElementId || undefined}
                  />

                  {/* Section Label overlay in edit mode */}
                  {editMode === "edit" && (
                    <span className="absolute top-2 left-2 bg-[#212632] border border-border text-[9px] font-mono text-muted rounded px-1.5 py-0.5 opacity-60 pointer-events-none uppercase">
                      {sec.type}
                    </span>
                  )}

                  {/* Section Floating Action Toolbar */}
                  {editMode === "edit" && selectedSectionIdx === idx && (
                    <div className="absolute top-4 right-4 z-40 bg-[#1e222b]/95 border border-primary/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-lg flex items-center gap-1 p-1.5 backdrop-blur-md select-none pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, "up");
                        }}
                        disabled={idx === 0}
                        className="p-1.5 rounded hover:bg-[#2c3240] text-[#d6dae2] hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        title="Move Block Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, "down");
                        }}
                        disabled={idx === sections.length - 1}
                        className="p-1.5 rounded hover:bg-[#2c3240] text-[#d6dae2] hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        title="Move Block Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-[1px] h-4 bg-border/40 mx-1" />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustSectionPadding(idx, "decrease");
                        }}
                        className="p-1.5 rounded hover:bg-[#2c3240] text-[#d6dae2] hover:text-white transition-colors cursor-pointer"
                        title="Decrease Height Spacing"
                      >
                        <Minimize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustSectionPadding(idx, "increase");
                        }}
                        className="p-1.5 rounded hover:bg-[#2c3240] text-[#d6dae2] hover:text-white transition-colors cursor-pointer"
                        title="Increase Height Spacing"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-[1px] h-4 bg-border/40 mx-1" />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSection(idx);
                        }}
                        className="p-1.5 rounded hover:bg-[#2c3240] text-[#d6dae2] hover:text-white transition-colors cursor-pointer"
                        title="Duplicate Block"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(idx);
                        }}
                        className="p-1.5 rounded hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Element Inspector (Active in edit mode) */}
        {editMode === "edit" && (
          <aside className="w-80 border-l border-border bg-background flex flex-col flex-shrink-0 z-20 overflow-y-auto p-5">
            {selectedSection ? (
              <div className="space-y-6">
                {selectedElementId ? (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] bg-primary/20 border border-primary/30 text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider select-none">
                        {selectedSection.type} &gt; {selectedElementId}
                      </span>
                      <h3 className="text-heading text-lg font-bold mt-2.5">Edit Element</h3>
                      <p className="text-muted text-xs">Configure text values and custom font styles.</p>
                    </div>

                    <div className="space-y-4">
                      {(() => {
                        if (
                          selectedElementId === "hero-title" ||
                          selectedElementId === "features-title" ||
                          selectedElementId === "benefits-title" ||
                          selectedElementId === "services-title" ||
                          selectedElementId === "pricing-title" ||
                          selectedElementId === "testimonials-title" ||
                          selectedElementId === "faq-title" ||
                          selectedElementId === "about-title" ||
                          selectedElementId === "contact-title" ||
                          selectedElementId === "cta-title"
                        ) {
                          return (
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Title Copy</label>
                              <input
                                type="text"
                                value={selectedSection.props.title || ""}
                                onChange={(e) => handlePropChange("title", e.target.value)}
                                className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                              />
                            </div>
                          );
                        }

                        if (
                          selectedElementId === "hero-subtitle" ||
                          selectedElementId === "features-subtitle" ||
                          selectedElementId === "services-subtitle" ||
                          selectedElementId === "pricing-subtitle" ||
                          selectedElementId === "testimonials-subtitle" ||
                          selectedElementId === "faq-subtitle" ||
                          selectedElementId === "contact-subtitle" ||
                          selectedElementId === "cta-subtitle"
                        ) {
                          return (
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Subtitle Copy</label>
                              <textarea
                                rows={3}
                                value={selectedSection.props.subtitle || ""}
                                onChange={(e) => handlePropChange("subtitle", e.target.value)}
                                className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary resize-none"
                              />
                            </div>
                          );
                        }

                        if (selectedElementId === "about-text") {
                          return (
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Body Copy</label>
                              <textarea
                                rows={5}
                                value={selectedSection.props.text || ""}
                                onChange={(e) => handlePropChange("text", e.target.value)}
                                className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary resize-none"
                              />
                            </div>
                          );
                        }

                        if (selectedElementId === "hero-cta") {
                          return (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Button text</label>
                                <input
                                  type="text"
                                  value={selectedSection.props.ctaText || ""}
                                  onChange={(e) => handlePropChange("ctaText", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Button link</label>
                                <input
                                  type="text"
                                  value={selectedSection.props.ctaLink || ""}
                                  onChange={(e) => handlePropChange("ctaLink", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (selectedElementId === "cta-button") {
                          return (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Button text</label>
                                <input
                                  type="text"
                                  value={selectedSection.props.buttonText || ""}
                                  onChange={(e) => handlePropChange("buttonText", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Button link</label>
                                <input
                                  type="text"
                                  value={selectedSection.props.buttonLink || ""}
                                  onChange={(e) => handlePropChange("buttonLink", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (selectedElementId === "hero-image" || selectedElementId === "about-image") {
                          return (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Image URL</label>
                                <input
                                  type="text"
                                  value={selectedSection.props.image || ""}
                                  onChange={(e) => handlePropChange("image", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Or Upload Image File</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const base64 = await compressImage(file);
                                        handlePropChange("image", base64);
                                      } catch (err) {
                                        console.error("Compression failed:", err);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          if (typeof reader.result === "string") {
                                            handlePropChange("image", reader.result);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }
                                  }}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (selectedElementId === "footer-logo") {
                          return (
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Logo Text</label>
                              <input
                                type="text"
                                value={selectedSection.props.logoText || ""}
                                onChange={(e) => handlePropChange("logoText", e.target.value)}
                                className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                              />
                            </div>
                          );
                        }

                        if (selectedElementId.startsWith("feature-item-")) {
                          const idx = parseInt(selectedElementId.replace("feature-item-", ""), 10);
                          const item = selectedSection.props.items?.[idx];
                          if (!item) return null;
                          return (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Feature Title</label>
                                <input
                                  type="text"
                                  value={item.title || ""}
                                  onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Feature Description</label>
                                <textarea
                                  rows={3}
                                  value={item.desc || ""}
                                  onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs resize-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Icon (zap, shield, sliders, cpu, etc.)</label>
                                <input
                                  type="text"
                                  value={item.icon || "zap"}
                                  onChange={(e) => handleItemChange(idx, "icon", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (selectedElementId.startsWith("benefit-item-")) {
                          const idx = parseInt(selectedElementId.replace("benefit-item-", ""), 10);
                          const item = selectedSection.props.items?.[idx];
                          if (!item) return null;
                          return (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Benefit Title</label>
                                <input
                                  type="text"
                                  value={item.title || ""}
                                  onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Feature Description</label>
                                <textarea
                                  rows={3}
                                  value={item.desc || ""}
                                  onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs resize-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Benefit Image URL</label>
                                <input
                                  type="text"
                                  value={item.image || ""}
                                  onChange={(e) => handleItemChange(idx, "image", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Or Upload Local Image</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const base64 = await compressImage(file);
                                        handleItemChange(idx, "image", base64);
                                      } catch (err) {
                                        console.error("Compression failed:", err);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          if (typeof reader.result === "string") {
                                            handleItemChange(idx, "image", reader.result);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }
                                  }}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (selectedElementId.startsWith("service-item-")) {
                          const idx = parseInt(selectedElementId.replace("service-item-", ""), 10);
                          const item = selectedSection.props.items?.[idx];
                          if (!item) return null;
                          return (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Service Title</label>
                                <input
                                  type="text"
                                  value={item.title || ""}
                                  onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Service Description</label>
                                <textarea
                                  rows={3}
                                  value={item.desc || ""}
                                  onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs resize-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Service Price</label>
                                <input
                                  type="text"
                                  value={item.price || ""}
                                  onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (selectedElementId.startsWith("pricing-tier-")) {
                          const idx = parseInt(selectedElementId.replace("pricing-tier-", ""), 10);
                          const tier = selectedSection.props.tiers?.[idx];
                          if (!tier) return null;
                          return (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Tier Name</label>
                                <input
                                  type="text"
                                  value={tier.name || ""}
                                  onChange={(e) => handlePricingChange(idx, "name", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Price Amount</label>
                                <input
                                  type="text"
                                  value={tier.price || ""}
                                  onChange={(e) => handlePricingChange(idx, "price", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Billing Period</label>
                                <input
                                  type="text"
                                  value={tier.period || ""}
                                  onChange={(e) => handlePricingChange(idx, "period", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Popular Badge</label>
                                <select
                                  value={tier.popular ? "true" : "false"}
                                  onChange={(e) => handlePricingChange(idx, "popular", e.target.value === "true")}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-2.5 py-2 text-heading text-xs font-semibold focus:outline-none focus:border-primary"
                                >
                                  <option value="false">Standard Option</option>
                                  <option value="true">Popular Highlight</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Features (Line-separated)</label>
                                <textarea
                                  rows={4}
                                  value={Array.isArray(tier.features) ? tier.features.join("\n") : ""}
                                  onChange={(e) => handlePricingChange(idx, "features", e.target.value.split("\n"))}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary resize-none"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (selectedElementId.startsWith("testimonial-item-")) {
                          const idx = parseInt(selectedElementId.replace("testimonial-item-", ""), 10);
                          const item = selectedSection.props.items?.[idx];
                          if (!item) return null;
                          return (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Client Name</label>
                                <input
                                  type="text"
                                  value={item.name || ""}
                                  onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Client Role</label>
                                <input
                                  type="text"
                                  value={item.role || ""}
                                  onChange={(e) => handleItemChange(idx, "role", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Quote Copy</label>
                                <textarea
                                  rows={3}
                                  value={item.quote || ""}
                                  onChange={(e) => handleItemChange(idx, "quote", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs resize-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Avatar URL</label>
                                <input
                                  type="text"
                                  value={item.avatar || ""}
                                  onChange={(e) => handleItemChange(idx, "avatar", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Or Upload Avatar</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const base64 = await compressImage(file, 400, 400, 0.8);
                                        handleItemChange(idx, "avatar", base64);
                                      } catch (err) {
                                        console.error("Compression failed:", err);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          if (typeof reader.result === "string") {
                                            handleItemChange(idx, "avatar", reader.result);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }
                                  }}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                                />
                              </div>
                            </div>
                          );
                        }

                        if (selectedElementId.startsWith("faq-item-")) {
                          const idx = parseInt(selectedElementId.replace("faq-item-", ""), 10);
                          const item = selectedSection.props.items?.[idx];
                          if (!item) return null;
                          return (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Question</label>
                                <input
                                  type="text"
                                  value={item.q || ""}
                                  onChange={(e) => handleItemChange(idx, "q", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Answer Copy</label>
                                <textarea
                                  rows={4}
                                  value={item.a || ""}
                                  onChange={(e) => handleItemChange(idx, "a", e.target.value)}
                                  className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs resize-none"
                                />
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })()}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/80 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Style Customization
                      </h4>
                      
                      <div className="text-[9px] text-muted font-mono bg-[#212632] px-2 py-0.5 rounded border border-border/40 inline-block uppercase select-none">
                        Element: {selectedElementId}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Font Family</label>
                        <select
                          value={selectedSection.style?.[selectedElementId]?.fontFamily || ""}
                          onChange={(e) => handleElementStyleChange(selectedElementId, "fontFamily", e.target.value)}
                          className="w-full bg-[#212632] border border-border rounded-lg px-2.5 py-2 text-heading text-xs font-semibold focus:outline-none focus:border-primary"
                        >
                          <option value="">Default Brand Font</option>
                          <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                          <option value="'Inter', sans-serif">Inter</option>
                          <option value="'Space Grotesque', sans-serif">Space Grotesque</option>
                          <option value="'Playfair Display', serif">Playfair Display</option>
                          <option value="'Outfit', sans-serif">Outfit</option>
                          <option value="system-ui, -apple-system, sans-serif">System Sans</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">Font Size</label>
                          {selectedSection.style?.[selectedElementId]?.fontSize && (
                            <button
                              type="button"
                              onClick={() => handleElementStyleChange(selectedElementId, "fontSize", "")}
                              className="text-[9px] text-primary hover:underline cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. 36px, 2.5rem"
                          value={selectedSection.style?.[selectedElementId]?.fontSize || ""}
                          onChange={(e) => handleElementStyleChange(selectedElementId, "fontSize", e.target.value)}
                          className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">Font Color</label>
                          {selectedSection.style?.[selectedElementId]?.color && (
                            <button
                              type="button"
                              onClick={() => handleElementStyleChange(selectedElementId, "color", "")}
                              className="text-[9px] text-primary hover:underline cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedSection.style?.[selectedElementId]?.color || "#ffffff"}
                            onChange={(e) => handleElementStyleChange(selectedElementId, "color", e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Color"
                            value={selectedSection.style?.[selectedElementId]?.color || ""}
                            onChange={(e) => handleElementStyleChange(selectedElementId, "color", e.target.value)}
                            className="flex-grow bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedElementId(null)}
                      className="w-full text-center py-2 border border-border/80 text-muted hover:text-heading hover:bg-[#212632]/50 text-xs font-semibold rounded-lg mt-4 transition-colors"
                    >
                      Back to Section settings
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] bg-primary/20 border border-primary/30 text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {selectedSection.type} Block
                      </span>
                      <h3 className="text-heading text-lg font-bold mt-2.5">Section settings</h3>
                      <p className="text-muted text-xs">Configure variant styling and section-level data.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Block Style variant</label>
                        <select
                          value={selectedSection.variant}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[selectedSectionIdx!] = {
                              ...updated[selectedSectionIdx!],
                              variant: e.target.value,
                            };
                            updateSectionsState(updated);
                          }}
                          className="w-full bg-[#212632] border border-border rounded-lg px-2.5 py-2 text-heading text-xs font-semibold focus:outline-none focus:border-primary"
                        >
                          <option value="modern">Modern Grid</option>
                          <option value="minimal">Minimalist Layout</option>
                          <option value="futuristic">Futuristic Glow</option>
                          <option value="luxury">Luxury Serif</option>
                          <option value="creative">Creative Bold</option>
                        </select>
                      </div>

                      {/* Futuristic Customizations */}
                      {selectedSection.variant.toLowerCase() === "futuristic" && (
                        <div className="space-y-4 pt-4 border-t border-border/40">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">Futuristic Layout Design</span>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="toggle-grid-lines"
                              checked={selectedSection.props.showGridLines !== false}
                              onChange={(e) => handlePropChange("showGridLines", e.target.checked)}
                              className="rounded border-border bg-[#212632] text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="toggle-grid-lines" className="text-heading text-xs font-semibold select-none cursor-pointer">
                              Show background grid lines
                            </label>
                          </div>

                          {selectedSection.type === "hero" && (
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="toggle-hero-badge"
                                  checked={selectedSection.props.showBadge !== false}
                                  onChange={(e) => handlePropChange("showBadge", e.target.checked)}
                                  className="rounded border-border bg-[#212632] text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="toggle-hero-badge" className="text-heading text-xs font-semibold select-none cursor-pointer">
                                  Show futuristic badge
                                </label>
                              </div>

                              {selectedSection.props.showBadge !== false && (
                                <div className="space-y-1.5">
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">Badge Text Copy</label>
                                  <input
                                    type="text"
                                    value={selectedSection.props.badgeText || ""}
                                    placeholder="// COGNITIVE EDGE INFERENCE NODE"
                                    onChange={(e) => handlePropChange("badgeText", e.target.value)}
                                    className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedSection.props.image !== undefined && (
                        <div className="space-y-3 pt-3 border-t border-border/40">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Section Image URL</label>
                            <input
                              type="text"
                              value={selectedSection.props.image || ""}
                              onChange={(e) => handlePropChange("image", e.target.value)}
                              className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Or Upload Image File</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const base64 = await compressImage(file);
                                    handlePropChange("image", base64);
                                  } catch (err) {
                                    console.error("Compression failed:", err);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === "string") {
                                        handlePropChange("image", reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }
                              }}
                              className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {(selectedSection.props.email !== undefined || selectedSection.props.phone !== undefined || selectedSection.props.address !== undefined) && (
                        <div className="space-y-3 pt-3 border-t border-border/40">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">Contact Info</span>
                          {selectedSection.props.email !== undefined && (
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Email Address</label>
                              <input
                                type="text"
                                value={selectedSection.props.email || ""}
                                onChange={(e) => handlePropChange("email", e.target.value)}
                                className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                              />
                            </div>
                          )}
                          {selectedSection.props.phone !== undefined && (
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Phone Number</label>
                              <input
                                type="text"
                                value={selectedSection.props.phone || ""}
                                onChange={(e) => handlePropChange("phone", e.target.value)}
                                className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                              />
                            </div>
                          )}
                          {selectedSection.props.address !== undefined && (
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Address Location</label>
                              <textarea
                                rows={2}
                                value={selectedSection.props.address || ""}
                                onChange={(e) => handlePropChange("address", e.target.value)}
                                className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary resize-none"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {selectedSection.props.items && Array.isArray(selectedSection.props.items) && (
                        <div className="space-y-3 pt-4 border-t border-border/40">
                          <div className="flex justify-between items-center">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">List Items ({selectedSection.props.items.length})</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...selectedSection.props.items];
                                if (selectedSection.type === "features") {
                                  newItems.push({ title: "New Feature Title", desc: "Short description outlining this feature...", icon: "zap" });
                                } else if (selectedSection.type === "benefits") {
                                  newItems.push({ title: "New Benefit Highlight", desc: "Longer detail text describing the benefit...", image: "" });
                                } else if (selectedSection.type === "services") {
                                  newItems.push({ title: "New Service Plan", desc: "Description of deliverables...", price: "$99" });
                                } else if (selectedSection.type === "testimonials") {
                                  newItems.push({ name: "New Client Name", role: "Software Developer", quote: "Excellent feedback quote about Ventrixa...", avatar: "" });
                                } else if (selectedSection.type === "faq") {
                                  newItems.push({ q: "Frequently Asked Question?", a: "Detailed answer explaining the topic..." });
                                } else {
                                  newItems.push({ title: "New List Item", desc: "Item description..." });
                                }
                                handlePropChange("items", newItems);
                              }}
                              className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Item
                            </button>
                          </div>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {selectedSection.props.items.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} className="flex items-center justify-between bg-[#212632]/40 border border-border/50 rounded-lg p-2 text-xs">
                                <span className="truncate max-w-[150px] font-semibold text-heading">
                                  {item.title || item.name || item.q || `Item ${itemIdx + 1}`}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedElementId(`${selectedSection.type === "faq" ? "faq" : selectedSection.type === "benefits" ? "benefit" : selectedSection.type === "services" ? "service" : "feature"}-item-${itemIdx}`)}
                                    className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newItems = selectedSection.props.items.filter((_: any, i: number) => i !== itemIdx);
                                      handlePropChange("items", newItems);
                                      setSelectedElementId(null);
                                    }}
                                    className="text-red-400 hover:text-red-300 cursor-pointer"
                                    title="Delete Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedSection.props.tiers && Array.isArray(selectedSection.props.tiers) && (
                        <div className="space-y-3 pt-4 border-t border-border/40">
                          <div className="flex justify-between items-center">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">Pricing Plans ({selectedSection.props.tiers.length})</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newTiers = [...selectedSection.props.tiers];
                                newTiers.push({ name: "Pro Plan Bundle", price: "$99", period: "month", features: ["1 Core page layout", "Standard API sync", "Dedicated database"], popular: false });
                                handlePropChange("tiers", newTiers);
                              }}
                              className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Plan
                            </button>
                          </div>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {selectedSection.props.tiers.map((tier: any, tierIdx: number) => (
                              <div key={tierIdx} className="flex items-center justify-between bg-[#212632]/40 border border-border/50 rounded-lg p-2 text-xs">
                                <span className="truncate max-w-[150px] font-semibold text-heading">{tier.name}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedElementId(`pricing-tier-${tierIdx}`)}
                                    className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newTiers = selectedSection.props.tiers.filter((_: any, i: number) => i !== tierIdx);
                                      handlePropChange("tiers", newTiers);
                                      setSelectedElementId(null);
                                    }}
                                    className="text-red-400 hover:text-red-300 cursor-pointer"
                                    title="Delete Tier"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-[10px] text-muted italic leading-relaxed pt-2">
                        💡 Tip: Click directly on any text or image in the website mockup canvas to edit its copy and font overrides.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSectionIdx(null);
                        setSelectedElementId(null);
                      }}
                      className="w-full text-center py-2 border border-border/80 text-muted hover:text-heading hover:bg-[#212632]/50 text-xs font-semibold rounded-lg mt-4 transition-colors"
                    >
                      Deselect & Show Global settings
                    </button>
                  </div>
                )}
              </div>
            ) : selectedElementId === "logo" ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] bg-primary/20 border border-primary/30 text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Logo Branding
                  </span>
                  <h3 className="text-heading text-lg font-bold mt-2.5">Edit Logo Properties</h3>
                  <p className="text-muted text-xs">Configure text representation or logo image parameters.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Logo Style type</label>
                    <select
                      value={project?.logoType || "text"}
                      onChange={(e) => handleLogoUpdate("logoType", e.target.value)}
                      className="w-full bg-[#212632] border border-border rounded-lg px-2.5 py-2 text-heading text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="text">Text Logo Only</option>
                      <option value="image">Image Logo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Logo Text / Alt Text</label>
                    <input
                      type="text"
                      value={project?.logoText || ""}
                      onChange={(e) => handleLogoUpdate("logoText", e.target.value)}
                      className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  {(project?.logoType || "text") === "image" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Logo Image URL</label>
                        <input
                          type="text"
                          value={project?.logoSrc || ""}
                          onChange={(e) => handleLogoUpdate("logoSrc", e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Or Upload Logo File (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const base64 = await compressImage(file, 600, 300, 0.8);
                                handleLogoUpdate("logoSrc", base64);
                              } catch (err) {
                                console.error("Compression failed:", err);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === "string") {
                                    handleLogoUpdate("logoSrc", reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                          className="w-full bg-[#212632] border border-border rounded-lg px-3 py-2 text-heading text-xs focus:outline-none focus:border-primary file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 mt-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">Width: {project?.logoWidth || 120}px</label>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="400"
                        value={project?.logoWidth || 120}
                        onChange={(e) => handleLogoUpdate("logoWidth", Number(e.target.value))}
                        className="w-full h-1.5 bg-[#212632] rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">Height: {project?.logoHeight || 40}px</label>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={project?.logoHeight || 40}
                        onChange={(e) => handleLogoUpdate("logoHeight", Number(e.target.value))}
                        className="w-full h-1.5 bg-[#212632] rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] bg-primary/20 border border-primary/30 text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Global Settings
                  </span>
                  <h3 className="text-heading text-lg font-bold mt-2.5">Global Branding</h3>
                  <p className="text-muted text-xs">Configure site-wide design layouts, fonts, and colors.</p>
                </div>

                <div className="space-y-4">
                  {/* Theme Mode */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Background Theme Mode</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLogoUpdate("theme", "dark")}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          project?.theme === "dark"
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-border text-muted hover:border-muted"
                        }`}
                      >
                        Dark Mode
                      </button>
                      <button
                        onClick={() => handleLogoUpdate("theme", "light")}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          project?.theme === "light"
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-border text-muted hover:border-muted"
                        }`}
                      >
                        Light Mode
                      </button>
                    </div>
                  </div>

                  {/* Typography Pairings */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Typography Pairings</label>
                    <select
                      value={project?.typography || "Modern"}
                      onChange={(e) => handleLogoUpdate("typography", e.target.value)}
                      className="w-full bg-[#212632] border border-border rounded-lg px-2.5 py-2 text-heading text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="Modern">Modern (Plus Jakarta Sans)</option>
                      <option value="Professional">Professional (Inter)</option>
                      <option value="Startup">Startup (Space Grotesque)</option>
                      <option value="Luxury">Luxury (Playfair Display)</option>
                      <option value="Creative">Creative (Outfit)</option>
                      <option value="Minimal">Minimal (system-ui)</option>
                    </select>
                  </div>

                  {/* Design Theme */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Visual Design Theme</label>
                    <select
                      value={project?.designTheme || "Modern"}
                      onChange={(e) => handleLogoUpdate("designTheme", e.target.value)}
                      className="w-full bg-[#212632] border border-border rounded-lg px-2.5 py-2 text-heading text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="Modern">Modern</option>
                      <option value="Minimal">Minimalist</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Startup">Startup</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Creative">Creative</option>
                      <option value="Futuristic">Futuristic</option>
                    </select>
                  </div>

                  {/* Custom Brand Colors */}
                  {project?.colorPalette && (
                    <div className="space-y-3 pt-3 border-t border-border/60">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">Custom Brand Colors</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 bg-[#212632] border border-border rounded-lg px-2.5 py-1.5">
                          <input
                            type="color"
                            value={project.colorPalette.primary || "#FF2E6E"}
                            onChange={(e) => handleColorPaletteChange("primary", e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-[10px] font-mono">Primary</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#212632] border border-border rounded-lg px-2.5 py-1.5">
                          <input
                            type="color"
                            value={project.colorPalette.accent || "#FF4E87"}
                            onChange={(e) => handleColorPaletteChange("accent", e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-[10px] font-mono">Accent</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#212632] border border-border rounded-lg px-2.5 py-1.5">
                          <input
                            type="color"
                            value={project.colorPalette.background || "#151821"}
                            onChange={(e) => handleColorPaletteChange("background", e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-[10px] font-mono">Bg</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#212632] border border-border rounded-lg px-2.5 py-1.5">
                          <input
                            type="color"
                            value={project.colorPalette.text || "#D6DAE2"}
                            onChange={(e) => handleColorPaletteChange("text", e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-[10px] font-mono">Text</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-[#212632] border border-border rounded-lg px-2.5 py-1.5 w-full">
                        <input
                          type="color"
                          value={project.colorPalette.secondary || "#151821"}
                          onChange={(e) => handleColorPaletteChange("secondary", e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-[10px] font-mono">Secondary</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleSuggestAIPalette}
                        className="w-full mt-1 bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Suggest AI Palette
                      </button>
                    </div>
                  )}

                  {/* Logo settings also accessible here */}
                  <div className="pt-4 border-t border-border/60 text-center">
                    <button
                      onClick={() => setSelectedElementId("logo")}
                      className="text-primary hover:underline text-xs font-semibold"
                    >
                      Configure Logo Settings &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Deployment progress modal */}
      {deploying && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-[#0f1117] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden">
            {/* Glowing neon bg accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/30">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-black tracking-tight">Deploying to Global Edge CDN</h3>
                <p className="text-gray-400 text-sm mt-1">Propagating code bundle to 48 regions worldwide...</p>
              </div>
            </div>

            {/* Cloud Sync Animation */}
            <div className="relative h-[220px] bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden mb-8 shadow-inner">
              <style>{`
                @keyframes slide-right {
                  0% { transform: translateX(-100px); opacity: 0; }
                  20% { opacity: 1; }
                  80% { opacity: 1; }
                  100% { transform: translateX(300px); opacity: 0; }
                }
                @keyframes dash-flow {
                  to { stroke-dashoffset: -20; }
                }
              `}</style>

              {/* Grid background */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

              <div className="absolute inset-0 flex items-center justify-between px-10 md:px-16">
                {/* Local Project Folder */}
                <div className="relative flex flex-col items-center z-20">
                  <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] z-10 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent" />
                    <FolderUp className="w-10 h-10 text-blue-400 relative z-10 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 mt-4 font-bold tracking-widest uppercase">Local Build</span>
                </div>

                {/* Animated Transfer Path */}
                <div className="flex-1 relative h-20 mx-4 md:mx-6 flex items-center justify-center z-10">
                  {/* SVG Flowing Path */}
                  <svg className="absolute w-full h-[4px]" preserveAspectRatio="none">
                    <path d="M 0 2 L 1000 2" stroke="rgba(255, 46, 110, 0.4)" strokeWidth="2" strokeDasharray="10 10" style={{ animation: 'dash-flow 1s linear infinite' }} />
                  </svg>
                  
                  {/* Floating Files */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden w-full">
                    <div className="absolute" style={{ animation: 'slide-right 2.5s linear infinite' }}>
                      <div className="w-10 h-10 bg-[#0f1117] border border-primary/50 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,46,110,0.4)]">
                        <FileCode className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="absolute" style={{ animation: 'slide-right 2.5s linear infinite 1.25s' }}>
                      <div className="w-10 h-10 bg-[#0f1117] border border-primary/50 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,46,110,0.4)]">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Progress Badge */}
                  <div className="absolute -top-12 bg-[#0f1117] border border-white/10 text-white text-[10px] font-mono font-bold px-4 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-2 animate-pulse whitespace-nowrap">
                    <Cloud className="w-3.5 h-3.5 text-primary" /> Syncing files to server...
                  </div>
                </div>

                {/* Cloud Server */}
                <div className="relative flex flex-col items-center z-20">
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] z-10 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
                    <Server className="w-10 h-10 text-emerald-400 relative z-10" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#0f1117] border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] z-20">
                    <Cloud className="w-5 h-5 text-emerald-400 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 mt-4 font-bold tracking-widest uppercase">Cloud Server</span>
                </div>
              </div>
            </div>

            {/* Logs console */}
            <div className="relative bg-[#090a0f] border border-white/5 rounded-xl p-6 h-[180px] overflow-y-auto font-mono text-sm space-y-3 leading-relaxed shadow-inner">
              {deployLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <span className="text-gray-600 mt-0.5">&gt;</span>
                  <p className="transition-all duration-300">
                    {log.includes("successfully") || log.includes("complete") ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> {log}
                      </span>
                    ) : (
                      <span className="text-gray-300">{log}</span>
                    )}
                  </p>
                </div>
              ))}
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="text-primary/50">&gt;</span>
                <span className="w-2 h-4 bg-primary inline-block animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Success Modal */}
      {deploySuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#212632] border border-primary/20 rounded-3xl shadow-2xl p-8 text-center space-y-6 overflow-hidden">
            {/* Glowing neon bg accents */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl" />

            <div className="flex flex-col items-center space-y-3 relative z-10">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-heading text-2xl font-black tracking-tight text-white">Website Live on the Edge!</h3>
              <p className="text-muted text-xs max-w-sm">
                Your Ventrixa project has been successfully uploaded over the Internet and is now accessible globally.
              </p>
            </div>

            {/* Laptop preview browser mockup */}
            <div className="bg-[#151821] border border-border rounded-xl p-4 text-left font-sans shadow-inner relative z-10">
              <div className="flex items-center gap-1.5 border-b border-border/60 pb-2.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <div className="bg-[#212632] text-[10px] font-mono text-muted/80 px-4 py-1 rounded border border-border/20 flex-grow text-center flex items-center justify-center gap-1 select-all font-semibold ml-2">
                  <Globe className="w-3 h-3 text-primary animate-pulse" />
                  {`${window.location.protocol}//${window.location.host}/sites/${website.subdomain}`}
                </div>
              </div>
              
              <div className="text-[10px] text-muted space-y-1.5 leading-relaxed">
                <div className="flex justify-between border-b border-border/30 pb-1.5">
                  <span>Subdomain Node:</span>
                  <span className="text-white font-mono font-bold">{website.subdomain}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-1.5">
                  <span>Routing SSL Certificate:</span>
                  <span className="text-green-400 font-bold font-mono">ACTIVE (Let's Encrypt TLS)</span>
                </div>
                <div className="flex justify-between">
                  <span>CDN Headers Cache:</span>
                  <span className="text-purple-400 font-mono font-bold">Edge Propagated</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <button
                onClick={() => {
                  const url = `${window.location.protocol}//${window.location.host}/sites/${website.subdomain}`;
                  navigator.clipboard.writeText(url);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className={`flex-1 py-3 px-5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  copiedLink
                    ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                    : "bg-[#212632] border-border text-heading hover:border-primary"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" /> Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Shareable URL
                  </>
                )}
              </button>
              
              <a
                href={`/sites/${website.subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-5 rounded-xl text-xs font-bold bg-primary hover:bg-hover text-white flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,46,110,0.2)] text-center cursor-pointer"
              >
                Visit Live Site <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={() => setDeploySuccess(false)}
              className="text-muted hover:text-white text-xs font-semibold underline block mx-auto cursor-pointer"
            >
              Close Overlay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
