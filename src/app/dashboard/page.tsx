"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  ArrowRight,
  Globe,
  Settings,
  Trash2,
  ExternalLink,
  Loader2,
  Calendar,
  Layers,
  CheckCircle,
  FileCode,
  X,
  AlertTriangle,
} from "lucide-react";
import BorderGlow from "@/components/reactbits/BorderGlow";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error("Failed fetching projects:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const handleCreateProject = () => {
    if (projects.length >= 1) {
      setShowUpgradeModal(true);
      return;
    }
    router.push("/dashboard/wizard");
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => (p.id || p._id) !== id));
      }
    } catch (err) {
      console.error("Delete project failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#151821] flex flex-col items-center justify-center text-heading">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted text-sm font-mono">Loading OS Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151821] text-[#D6DAE2] flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border bg-background px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/logo.png"
            alt="Ventrixa Logo"
            className="w-8 h-8 rounded-lg object-cover"
            /* shadow-[0_0_15px_rgba(255,46,110,0.3)] */
          />
          <span className="font-extrabold text-heading text-lg">
            Ventri<span className="text-primary">x</span>a Dashboard
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-9 h-9 rounded-full border border-border"
              />
            )}
            <div className="hidden sm:block text-left">
              <p className="text-heading text-sm font-semibold leading-tight">{session?.user?.name}</p>
              <p className="text-muted text-xs font-mono">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-muted hover:text-white text-xs border border-border hover:border-muted rounded-lg px-3 py-1.5 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-heading">Your Web Blueprints</h1>
            <p className="text-muted text-sm mt-1.5">Manage, design, and deploy your custom-built generation platform applications.</p>
          </div>

          <button
            onClick={handleCreateProject}
            className="bg-primary hover:bg-hover text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,46,110,0.35)]"
          >
            <Plus className="w-5 h-5" /> Create New Site
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-16 text-center max-w-xl mx-auto mt-10 bg-card/20">
            <Layers className="w-12 h-12 text-muted/40 mx-auto mb-4" />
            <h3 className="text-heading text-xl font-bold">No websites built yet</h3>
            <p className="text-muted text-sm mt-2 leading-relaxed">
              Launch our AI generation engine to build your brand blueprint, write optimized copy, and assemble pages in minutes.
            </p>
            <button
              onClick={handleCreateProject}
              className="mt-6 inline-flex items-center gap-1.5 bg-primary hover:bg-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const pId = project.id || project._id;
              const isCompleted = project.status === "completed";
              const isGenerating = project.status === "generating";

              return (
                <BorderGlow
                  key={pId}
                  glowColor="#FF2E6E"
                  backgroundColor="#212632"
                  borderRadius={16}
                  glowRadius={30}
                  glowIntensity={0.25}
                  colors={["#FF2E6E", "#8b5cf6", "#ff4e87"]}
                  className="h-full"
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] uppercase font-bold tracking-wider rounded-full px-2.5 py-0.5 border ${
                          isCompleted
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : isGenerating
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}>
                          {project.status}
                        </span>

                        <button
                          onClick={(e) => handleDeleteProject(pId, e)}
                          disabled={deletingId === pId}
                          className="text-muted hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-background"
                          title="Delete Project"
                        >
                          {deletingId === pId ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <h3 className="text-heading text-lg font-bold truncate">{project.name}</h3>
                      <p className="text-muted text-xs font-mono mt-1">{project.industry} &bull; {project.businessType}</p>
                      <p className="text-muted text-sm line-clamp-3 mt-3.5 leading-relaxed">{project.description}</p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-border/60">
                      {isCompleted ? (
                        <div className="space-y-3">
                          <Link
                            href={`/editor/${pId}`}
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-hover hover:to-purple-500 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <Settings className="w-3.5 h-3.5" /> Open Visual Workspace
                          </Link>
                          {project.subdomain && (
                            <a
                              href={`/sites/${project.subdomain}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full border border-border hover:border-primary text-heading text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors bg-[#212632]/50"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Preview Live Site
                            </a>
                          )}
                        </div>
                      ) : isGenerating ? (
                        <Link
                          href={`/dashboard/wizard?projectId=${pId}`}
                          className="w-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Blueprint...
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/wizard?projectId=${pId}`}
                          className="w-full bg-primary hover:bg-hover text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Launch AI Wizard <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </BorderGlow>
              );
            })}
          </div>
        )}
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowUpgradeModal(false); }}
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
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 text-yellow-400 border border-yellow-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-white text-2xl font-bold mb-3">Project Limit Reached</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Free Plan users can only create 1 website for now. Premium plans offering unlimited projects are rolling out very soon!
            </p>

            <button
              onClick={() => setShowUpgradeModal(false)}
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
