import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  getProject,
  updateProject,
  createWebsite,
  createPage,
  saveSections,
} from "@/lib/db";
import { generateWebsiteBlueprint } from "@/lib/ai/generator";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 419 });
    }

    const userId = (session.user as any).id || "demo-user-id";
    const body = await req.json();
    const { projectId, wizardData } = body;

    // Check target project
    const project = await getProject(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Set generating status
    await updateProject(projectId, { status: "generating" });

    // Prepare inputs
    const generatorInput = {
      name: wizardData.name || project.name,
      description: wizardData.description || project.description,
      keywords: wizardData.keywords || "",
      businessType: wizardData.businessType || "general",
      industry: wizardData.industry || "general",
      targetAudience: wizardData.targetAudience || "everyone",
      brandVoice: wizardData.brandVoice || "friendly",
      colorPaletteType: wizardData.colorPaletteType || "ai",
      selectedColors: wizardData.colorPalette,
      typography: wizardData.typography || "modern",
      selectedPages: wizardData.selectedPages || ["Home"],
      designTheme: wizardData.designTheme || "modern",
      themeMode: wizardData.theme || "dark",
      layoutType: wizardData.layoutType || "custom",
      selectedTemplate: wizardData.selectedTemplate || "saas",
      aiEngine: wizardData.aiEngine || "procedural",
      aiModel: wizardData.aiModel,
      apiBaseUrl: wizardData.apiBaseUrl,
    };

    // Dummy progress callback logs tracker
    const logsList: string[] = [];
    const blueprint = await generateWebsiteBlueprint(generatorInput, (step, log) => {
      logsList.push(`[Step ${step}/8] ${log}`);
      console.log(`[AI Builder] Project ${projectId}: ${log}`);
    });

    // Create the website entry
    const nameSlug = generatorInput.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Generate unique subdomain
    const randSuffix = Math.random().toString(36).substring(2, 6);
    const subdomain = `${nameSlug}-${randSuffix}`;

    const website = await createWebsite({
      projectId,
      userId,
      subdomain,
      isPublished: false,
      version: 1,
    });

    // Loop through blueprint pages and save them to DB
    for (const pgBlueprint of blueprint.pages) {
      const page = await createPage({
        websiteId: website.id || website._id,
        name: pgBlueprint.name,
        slug: pgBlueprint.slug,
        seoTitle: pgBlueprint.seo.title,
        seoDescription: pgBlueprint.seo.description,
        seoKeywords: pgBlueprint.seo.keywords,
      });

      // Save sections associated with this page
      await saveSections(page.id || page._id, pgBlueprint.sections);
    }

    // Update project with final branding, logo details, and mark completed
    await updateProject(projectId, {
      name: generatorInput.name,
      description: generatorInput.description,
      industry: generatorInput.industry,
      businessType: generatorInput.businessType,
      targetAudience: generatorInput.targetAudience,
      brandVoice: generatorInput.brandVoice,
      theme: generatorInput.themeMode,
      colorPalette: blueprint.brand.colorPalette,
      typography: blueprint.brand.typography,
      logoText: blueprint.brand.logoText,
      logoType: blueprint.brand.logoType || "text",
      logoSrc: blueprint.brand.logoSrc || "",
      logoWidth: blueprint.brand.logoWidth || 120,
      logoHeight: blueprint.brand.logoHeight || 40,
      selectedPages: generatorInput.selectedPages,
      designTheme: generatorInput.designTheme,
      status: "completed",
      subdomain,
    });

    return NextResponse.json({
      success: true,
      subdomain,
      websiteId: website.id || website._id,
      logs: logsList,
    });
  } catch (e: any) {
    console.error("AI Generation API failed:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
