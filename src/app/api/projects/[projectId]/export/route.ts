import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getProject, getWebsiteByProject, getPages, getSections } from "@/lib/db";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 419 });
    }

    const { projectId } = await params;
    const project = await getProject(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const userId = (session.user as any).id || "demo-user-id";
    if (project.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const website = await getWebsiteByProject(projectId);
    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    const pages = await getPages(website.id || website._id);

    const zip = new JSZip();

    // 1. package.json
    const packageJson = {
      name: project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        "next": "15.1.0",
        "react": "^19.0.0",
        "react-dom": "^19.0.0",
        "lucide-react": "^0.300.0",
        "framer-motion": "^11.0.0"
      },
      devDependencies: {
        "typescript": "^5.0.0",
        "@types/node": "^20.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "tailwindcss": "^4.0.0",
        "@tailwindcss/postcss": "^4.0.0"
      }
    };
    zip.file("package.json", JSON.stringify(packageJson, null, 2));

    // 2. postcss.config.mjs
    const postcssConfig = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};`;
    zip.file("postcss.config.mjs", postcssConfig);

    // 3. tsconfig.json
    const tsconfigJson = {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        paths: {
          "@/*": ["./src/*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    };
    zip.file("tsconfig.json", JSON.stringify(tsconfigJson, null, 2));

    // 4. src/lib/styles.ts (Read directly from our filesystem)
    const stylesPath = path.join(process.cwd(), "src", "lib", "styles.ts");
    const stylesContent = fs.readFileSync(stylesPath, "utf8");
    zip.file("src/lib/styles.ts", stylesContent);

    // 5. src/components/SectionRenderer.tsx (Read directly, strip selectBorder outline hovers)
    const rendererPath = path.join(process.cwd(), "src", "components", "SectionRenderer.tsx");
    let rendererContent = fs.readFileSync(rendererPath, "utf8");
    
    // Replace selectBorder helper to disable editor hover styles
    rendererContent = rendererContent.replace(
      /const selectBorder = \([\s\S]*?cursor-pointer";/g,
      'const selectBorder = (elementId: string) => "";'
    );
    zip.file("src/components/SectionRenderer.tsx", rendererContent);

    // 5b. src/components/reactbits/BorderGlow.tsx & BorderGlow.css
    const borderGlowPath = path.join(process.cwd(), "src", "components", "reactbits", "BorderGlow.tsx");
    const borderGlowContent = fs.readFileSync(borderGlowPath, "utf8");
    zip.file("src/components/reactbits/BorderGlow.tsx", borderGlowContent);

    const borderGlowCssPath = path.join(process.cwd(), "src", "components", "reactbits", "BorderGlow.css");
    const borderGlowCssContent = fs.readFileSync(borderGlowCssPath, "utf8");
    zip.file("src/components/reactbits/BorderGlow.css", borderGlowCssContent);

    // 6. src/app/globals.css
    const brandColors = project.colorPalette || {
      primary: "#FF2E6E",
      secondary: "#151821",
      background: "#151821",
      text: "#D6DAE2",
      accent: "#FF4E87",
    };
    const isLight = project.theme === "light";
    const heading = isLight ? "#0f172a" : "#ffffff";
    const muted = isLight ? "#64748b" : "#96a0b3";
    const border = isLight ? "#e2e8f0" : "#394253";
    const cardForeground = isLight ? "#0f172a" : "#ffffff";

    const globalsCss = `@import "tailwindcss";

:root {
  --background: ${brandColors.background};
  --foreground: ${brandColors.text};
  --card: ${brandColors.secondary};
  --card-foreground: ${cardForeground};
  --border: ${border};
  --primary: ${brandColors.primary};
  --primary-foreground: #ffffff;
  --hover: ${brandColors.accent || brandColors.primary};
  --muted: ${muted};
  --heading: ${heading};
  --radius: 0.75rem;
}

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-hover: var(--hover);
  --color-muted: var(--muted);
  --color-heading: var(--heading);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  transition: background-color 150ms ease, color 150ms ease;
}`;
    zip.file("src/app/globals.css", globalsCss);

    // 7. src/app/layout.tsx
    const layoutTsx = `import React from "react";
import "./globals.css";

export const metadata = {
  title: "${project.name}",
  description: "${project.description}",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}`;
    zip.file("src/app/layout.tsx", layoutTsx);

    // 8. Generate React Page Component files for each page slug
    for (const pg of pages) {
      const pageSections = await getSections(pg.id || pg._id);
      
      const navLinks = pages.map((p) => {
        const href = p.slug === "" ? "/" : `/${p.slug}`;
        return `            <a key="${p.slug}" href="${href}" className="transition-colors text-muted hover:text-heading">${p.name}</a>`;
      }).join("\n");

      const logoTypeStr = project.logoType === "image" && project.logoSrc ? `
          <img
            src="${project.logoSrc}"
            alt="${project.logoText || project.name}"
            style={{
              width: "${project.logoWidth || 120}px",
              height: "${project.logoHeight || 40}px",
              objectFit: "contain",
            }}
          />
      ` : `
          <span className="font-extrabold text-lg text-heading">
            ${project.logoText || project.name}
          </span>
      `;

      const pageContent = `import React from "react";
import SectionRenderer from "@/components/SectionRenderer";

const sections = ${JSON.stringify(pageSections, null, 2)};
const brandColors = ${JSON.stringify(brandColors, null, 2)};

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-card/25">
        <a href="/">
          ${logoTypeStr.trim()}
        </a>
        <nav className="flex items-center gap-6 text-xs font-semibold">
${navLinks}
        </nav>
        <span className="text-[10px] bg-card border border-border text-muted rounded-full px-3 py-1">
          Built with Ventrixa
        </span>
      </header>

      <main className="flex-grow">
        {sections.map((sec: any, idx: number) => (
          <SectionRenderer
            key={idx}
            type={sec.type}
            variant={sec.variant}
            props={sec.props}
            style={sec.style}
            brandColors={brandColors}
          />
        ))}
      </main>

      <footer className="py-6 border-t border-border bg-card/10 text-center text-[10px] text-muted">
        &copy; {new Date().getFullYear()} ${project.logoText || project.name}. All rights reserved.
      </footer>
    </div>
  );
}`;

      if (pg.slug === "") {
        zip.file("src/app/page.tsx", pageContent);
      } else {
        zip.file(`src/app/${pg.slug}/page.tsx`, pageContent);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    return new Response(zipBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-source.zip"`,
      },
    });
  } catch (err: any) {
    console.error("Export project failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
