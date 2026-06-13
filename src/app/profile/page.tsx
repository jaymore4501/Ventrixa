"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Mail, MapPin, Globe, Lock, Trash2, LogOut,
  ExternalLink, Edit3, Check, X, Loader2, AlertTriangle,
  LayoutDashboard, Settings, Image as ImageIcon, Layers, ArrowLeft,
  Eye, EyeOff, Plus, Calendar, ChevronRight,
} from "lucide-react";

type ProfileTab = "profile" | "sites" | "account";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  provider: string;
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: "draft" | "generating" | "completed";
  subdomain?: string;
  createdAt: string;
  colorPalette: { primary: string };
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");

  // Password change state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Delete project state
  const [deletingProject, setDeletingProject] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchProjects();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setEditName(data.user.name || "");
        setEditBio(data.user.bio || "");
        setEditLocation(data.user.location || "");
      }
    } catch (e) {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error("Failed to fetch projects");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, bio: editBio, location: editLocation }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setProfile(data.user);
      setSuccess("Profile updated successfully.");
      await update({ name: editName });
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { setError("New passwords don't match."); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess("Password changed successfully.");
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch {
      setError("Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setDeletingProject(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== projectId));
      }
    } catch {
      setError("Failed to delete project.");
    } finally {
      setDeletingProject(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== session?.user?.email) {
      setError("Email doesn't match. Please type your email exactly.");
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete account.");
      }
    } catch {
      setError("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF2E6E]" />
      </div>
    );
  }

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "sites", label: `My Sites (${projects.length})`, icon: <Layers className="w-4 h-4" /> },
    { id: "account", label: "Account", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#d1d5db] font-sans">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#ff2e6e]/8 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,46,110,0.03))",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-6 h-6 object-cover" style={{ borderRadius: "18%" /*, filter: "drop-shadow(0 0 5px rgba(255,46,110,0.4))"*/ }} />
            <span className="text-white font-extrabold text-base">Ventri<span className="text-[#FF2E6E]">x</span>a</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/jaymore4501/Ventrixa.git"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            <span className="uppercase tracking-wider">GitHub</span>
          </a>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Profile Hero */}
        <div
          className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(255,46,110,0.08), rgba(139,92,246,0.05))",
            border: "1px solid rgba(255,46,110,0.15)",
          }}
        >
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0 relative"
            style={{ background: "linear-gradient(135deg, #FF2E6E, #9d174d)", boxShadow: "0 0 24px rgba(255,46,110,0.3)" }}
          >
            {profile?.image ? (
              <img src={profile.image} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-grow">
            <h1 className="text-white text-2xl font-black">{profile?.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{profile?.email}</p>
            {profile?.bio && <p className="text-gray-300 text-sm mt-2 max-w-md">{profile.bio}</p>}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {profile?.location && (
                <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" />{profile.location}</span>
              )}
              {profile?.websiteUrl && (
                <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF2E6E] hover:underline">
                  <Globe className="w-3 h-3" />{profile.websiteUrl.replace(/^https?:\/\//, "")}
                </a>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" /> Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("profile")}
            className="text-xs font-semibold text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-black/30 border border-white/[0.06] rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(""); setSuccess(""); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg, rgba(255,46,110,0.2), rgba(157,23,77,0.15))" : "transparent",
                color: activeTab === tab.id ? "#FF2E6E" : "#6b7280",
                border: activeTab === tab.id ? "1px solid rgba(255,46,110,0.25)" : "1px solid transparent",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" /> {success}
          </div>
        )}

        {/* ── Profile Tab ─────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto rounded-2xl p-8" style={{ background: "rgba(18,20,28,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-white text-xl font-bold mb-8 text-center">Edit Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text" required minLength={2}
                    value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#FF2E6E]/60 transition-all focus:bg-black/60"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Bio</label>
                <textarea
                  rows={3}
                  value={editBio} onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#FF2E6E]/60 transition-all focus:bg-black/60 resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={editLocation} onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#FF2E6E]/60 transition-all focus:bg-black/60"
                  />
                </div>
              </div>
              <button
                type="submit" disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 mt-4 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-all hover:brightness-110 shadow-lg"
                style={{ background: "linear-gradient(135deg, #FF2E6E, #9d174d)", boxShadow: "0 0 20px rgba(255,46,110,0.25)" }}
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Check className="w-4 h-4" /> Save Changes</>}
              </button>
            </form>
          </div>
        )}

        {/* ── My Sites Tab ─────────────────────────────────────────── */}
        {activeTab === "sites" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-bold">My Website Creations</h2>
              <Link
                href="/dashboard/wizard"
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #FF2E6E, #9d174d)", boxShadow: "0 0 14px rgba(255,46,110,0.2)" }}
              >
                <Plus className="w-3.5 h-3.5" /> New Website
              </Link>
            </div>

            {projects.length === 0 ? (
              <div
                className="rounded-2xl p-16 text-center"
                style={{ background: "rgba(18,20,28,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-bold mb-2">No websites yet</h3>
                <p className="text-gray-500 text-sm mb-6">Start building your first AI-generated website</p>
                <Link
                  href="/dashboard/wizard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold hover:brightness-110 transition-all"
                  style={{ background: "linear-gradient(135deg, #FF2E6E, #9d174d)" }}
                >
                  <Plus className="w-4 h-4" /> Create First Site
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-2xl p-6 relative group transition-all"
                    style={{
                      background: "rgba(18,20,28,0.8)",
                      border: `1px solid ${project.colorPalette?.primary ? project.colorPalette.primary + "25" : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    {/* Color accent */}
                    <div className="w-3 h-3 rounded-full mb-4" style={{ background: project.colorPalette?.primary || "#FF2E6E", boxShadow: `0 0 8px ${project.colorPalette?.primary || "#FF2E6E"}60` }} />

                    <h3 className="text-white font-bold text-base mb-1 truncate">{project.name}</h3>
                    <p className="text-gray-500 text-xs mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{
                            background: project.status === "completed" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                            color: project.status === "completed" ? "#10b981" : project.status === "generating" ? "#f59e0b" : "#6b7280",
                          }}
                        >
                          {project.status}
                        </span>
                        <span className="text-[10px] text-gray-600">{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/editor/${project._id}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        {project.subdomain && (
                          <a
                            href={`http://${project.subdomain}.localhost:3000`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          disabled={deletingProject === project._id}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                          title="Delete"
                        >
                          {deletingProject === project._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Account Tab ─────────────────────────────────────────── */}
        {activeTab === "account" && (
          <div className="space-y-6">
            {/* Account Info */}
            <div className="max-w-2xl mx-auto rounded-2xl p-8" style={{ background: "rgba(18,20,28,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-white text-xl font-bold mb-6 text-center">Account Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Email</p>
                    <p className="text-white text-sm">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sign-in Method</p>
                    <p className="text-white text-sm capitalize">{profile?.provider === "credentials" ? "Email & Password" : profile?.provider}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password — credentials users only */}
            {profile?.provider === "credentials" && (
              <div className="max-w-2xl mx-auto rounded-2xl p-8" style={{ background: "rgba(18,20,28,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-white text-xl font-bold mb-6 text-center">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  {[
                    { label: "Current Password", value: currentPwd, setter: setCurrentPwd },
                    { label: "New Password", value: newPwd, setter: setNewPwd },
                    { label: "Confirm New Password", value: confirmPwd, setter: setConfirmPwd },
                  ].map(({ label, value, setter }) => (
                    <div key={label}>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type={showPwd ? "text" : "password"} required
                          value={value} onChange={(e) => setter(e.target.value)}
                          className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-11 pr-10 py-3.5 text-white text-sm focus:outline-none focus:border-[#FF2E6E]/60 transition-all focus:bg-black/60"
                        />
                        {label === "Current Password" && (
                          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="submit" disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 mt-4 rounded-xl text-white text-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all shadow-lg"
                    style={{ background: "linear-gradient(135deg, #FF2E6E, #9d174d)", boxShadow: "0 0 20px rgba(255,46,110,0.2)" }}
                  >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : <><Lock className="w-4 h-4" /> Update Password</>}
                  </button>
                </form>
              </div>
            )}

            {/* Danger Zone */}
            <div className="max-w-2xl mx-auto rounded-2xl p-8 text-center" style={{ background: "rgba(18,20,28,0.8)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <h2 className="text-red-400 text-xl font-bold mb-3 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Danger Zone
              </h2>
              <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">Once you delete your account, all your data, projects, and websites will be permanently removed. This action cannot be undone.</p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-red-400 font-bold text-sm border border-red-500/30 hover:bg-red-500/10 transition-all mx-auto"
                >
                  <Trash2 className="w-4 h-4" /> Delete My Account
                </button>
              ) : (
                <div className="space-y-6 text-left">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-sm">
                    <p className="font-bold mb-1">This will permanently delete:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-red-400/80">
                      <li>Your account and profile</li>
                      <li>All {projects.length} website project(s)</li>
                      <li>All deployed sites and configurations</li>
                    </ul>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Type <span className="text-red-400 font-mono">{profile?.email}</span> to confirm
                    </label>
                    <input
                      type="email"
                      value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)}
                      placeholder={profile?.email}
                      className="w-full bg-black/40 border border-red-500/30 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-red-500/60 transition-all focus:bg-black/60"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting || deleteInput !== profile?.email}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white font-bold text-sm bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Confirm Delete</>}
                    </button>
                    <button
                      onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                      className="flex-1 px-5 py-3.5 rounded-xl text-gray-400 font-bold text-sm border border-white/10 hover:border-white/20 hover:text-white transition-all bg-white/[0.02]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
