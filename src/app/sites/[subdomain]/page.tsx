import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, Globe, AlertTriangle } from "lucide-react";
import {
  getWebsiteBySubdomain,
  getProject,
  getPages,
  getSections,
} from "@/lib/db";
import SectionRenderer from "@/components/SectionRenderer";
import { getBrandStyles } from "@/lib/styles";

interface SitePageProps {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function DeployedSitePage({
  params,
  searchParams,
}: SitePageProps) {
  const { subdomain } = await params;
  const sParams = await searchParams;
  const activeSlug = sParams.page || "";

  // 1. Fetch website
  const rawWebsite = await getWebsiteBySubdomain(subdomain);
  if (!rawWebsite) {
    return (
      <div className="min-h-screen bg-[#151821] text-[#D6DAE2] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-heading text-3xl font-extrabold">Site Not Found</h1>
        <p className="text-muted text-sm mt-2 max-w-md mx-auto leading-relaxed">
          The subdomain <span className="text-white font-mono font-bold">{subdomain}.ventrixa.site</span> does not point to an active Ventrixa project.
        </p>
        <Link
          href="/"
          className="mt-8 bg-primary hover:bg-hover text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
        >
          Create Your Site Now
        </Link>
      </div>
    );
  }

  // Convert to plain object to prevent Mongoose document prototype serialization issues
  const website = JSON.parse(JSON.stringify(rawWebsite));

  if (!website.isPublished) {
    return (
      <div className="min-h-screen bg-[#151821] text-[#D6DAE2] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-heading text-3xl font-extrabold">Draft Mode</h1>
        <p className="text-muted text-sm mt-2 max-w-md mx-auto leading-relaxed">
          The project website <span className="text-white font-mono font-bold">{subdomain}.ventrixa.site</span> has not been deployed to the edge yet.
        </p>
        <p className="text-muted text-xs mt-1">
          If you are the owner, open your editor workspace and click the <strong className="text-primary">Deploy</strong> button to launch it globally.
        </p>
        <Link
          href="/"
          className="mt-8 bg-primary hover:bg-hover text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
        >
          Back to Ventrixa
        </Link>
      </div>
    );
  }

  // 2. Fetch associated project details (branding colors/logo)
  const rawProject = await getProject(website.projectId);
  const project = rawProject ? JSON.parse(JSON.stringify(rawProject)) : null;

  // 3. Fetch pages
  const rawPages = await getPages(website.id || website._id);
  const pages = JSON.parse(JSON.stringify(rawPages));
  const activePage =
    pages.find((p: any) => p.slug === activeSlug) ||
    pages.find((p: any) => p.slug === "") ||
    pages[0];

  if (!activePage) {
    return notFound();
  }

  // 4. Fetch sections for active page
  const rawSections = await getSections(activePage.id || activePage._id);
  const sections = JSON.parse(JSON.stringify(rawSections));

  // Custom styling tokens from brand colors
  const brandColors = project?.colorPalette || {
    primary: "#FF2E6E",
    secondary: "#151821",
    background: "#151821",
    text: "#D6DAE2",
    accent: "#FF4E87",
  };

  const isLightTheme = project?.theme === "light";
  return (
    <div
      className={`min-h-screen flex flex-col font-sans text-foreground ${isLightTheme ? "light" : "dark"}`}
      style={{
        ...getBrandStyles(brandColors),
        background: "var(--bg-gradient)",
      }}
    >
      {/* Site Header */}
      <header
        className="px-6 py-3 flex items-center justify-between border-b border-border bg-card/25"
      >
        {project?.logoType === "image" && project?.logoSrc ? (
          <img
            src={project.logoSrc}
            alt={project.logoText || project.name || "Logo"}
            style={{
              width: project.logoWidth ? `${project.logoWidth}px` : "auto",
              height: project.logoHeight ? `${project.logoHeight}px` : "32px",
              objectFit: "contain",
            }}
          />
        ) : (
          <span className="font-extrabold text-lg text-heading">
            {project?.logoText || project?.name || "Brand"}
          </span>
        )}

        {/* Dynamic Pages Navigation bar */}
        <nav className="flex items-center gap-6 text-xs font-semibold">
          {pages.map((p: any) => {
            const isSelected = activePage.slug === p.slug;
            return (
              <Link
                key={p.id || p._id}
                href={`/sites/${subdomain}${p.slug ? `?page=${p.slug}` : ""}`}
                style={{
                  color: isSelected ? brandColors.primary : undefined,
                }}
                className={`transition-colors ${isSelected ? "" : "text-muted hover:text-heading"}`}
              >
                {p.name}
              </Link>
            );
          })}
        </nav>

        {/* Small Launcher attribution */}
        <Link
          href="/"
          className="text-[10px] bg-card border border-border text-muted rounded-full px-3 py-1 flex items-center gap-1 hover:text-heading transition-colors"
        >
          Built with <span className="font-extrabold text-heading ml-1">Ventri<span className="text-primary">x</span>a</span>
        </Link>
      </header>

      {/* Main Sections Render Stack */}
      <main className="flex-grow">
        {sections.map((sec: any) => (
          <SectionRenderer
            key={sec.id || sec._id}
            type={sec.type}
            variant={sec.variant}
            props={sec.props}
            style={sec.style}
            brandColors={brandColors}
          />
        ))}
      </main>

      {/* attributions widget floating footer */}
      <footer className="py-6 border-t border-border bg-card/10 text-center text-[10px] text-muted">
        &copy; {new Date().getFullYear()} {project?.logoText || project?.name}. All rights reserved.
      </footer>
    </div>
  );
}
