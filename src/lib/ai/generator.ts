import { OpenAI } from "openai";
import { CURATED_PALETTES } from "../styles";
import { READY_TEMPLATES } from "../templates";

// Instantiate OpenAI client lazily to avoid throwing validation errors during build-time evaluation
const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-openai-key-for-build-time-pass",
  });
};

function extractJSON(text: string): any {
  const cleaned = text.trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const braceContent = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(braceContent);
    }
    throw e;
  }
}

export interface GeneratorInput {
  name: string;
  description: string;
  businessType: string;
  industry: string;
  targetAudience: string;
  brandVoice: string;
  colorPaletteType: "ai" | "manual";
  selectedColors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: string;
  selectedPages: string[];
  designTheme: string; // e.g. "modern", "minimal", "futuristic", "luxury"
  themeMode: "dark" | "light";
  layoutType?: "custom" | "template";
  selectedTemplate?: string;
  aiEngine?: "procedural" | "ollama" | "openai";
  aiModel?: string;
  apiBaseUrl?: string;
  keywords?: string;
}

// Typography Fonts Mapping
const TYPOGRAPHY_FONTS: Record<string, string> = {
  modern: "'Plus Jakarta Sans', sans-serif",
  professional: "'Inter', sans-serif",
  startup: "'Space Grotesque', sans-serif",
  luxury: "'Playfair Display', serif",
  creative: "'Outfit', sans-serif",
  minimal: "system-ui, -apple-system, sans-serif",
};

// --- HSL Color Palette Hashing & Generation Utilities ---

function hashStringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateDynamicPalette(name: string, description: string, mode: "dark" | "light") {
  const list = CURATED_PALETTES[mode] || [];
  if (list.length > 0) {
    const selected = list[Math.floor(Math.random() * list.length)];
    return {
      primary: selected.primary,
      secondary: selected.secondary,
      background: selected.background,
      text: selected.text,
      accent: selected.accent,
      name: selected.name
    };
  }

  const norm = (name + " " + description).toLowerCase();
  let hue = hashStringToHue(name + description);

  // Context-aware hue adjustment
  if (norm.includes("opera") || norm.includes("operax")) {
    hue = 350; // Elegant red/coral (Opera brand identity)
  } else if (norm.includes("browser") || norm.includes("cyber") || norm.includes("secure") || norm.includes("safe")) {
    hue = 200; // Secure deep blue/cyan
  } else if (norm.includes("student") || norm.includes("school") || norm.includes("education")) {
    hue = 260; // Engaging educational violet/purple
  } else if (norm.includes("health") || norm.includes("fitness") || norm.includes("medical")) {
    hue = 160; // Minty fresh green/teal
  } else if (norm.includes("finance") || norm.includes("wealth") || norm.includes("money")) {
    hue = 45; // Golden/yellow
  }

  if (mode === "dark") {
    return {
      primary: hslToHex(hue, 85, 60), // Vibrant primary hue
      secondary: hslToHex(hue, 15, 14), // brand-tinted card background
      background: hslToHex(hue, 16, 9), // brand-tinted deep background
      text: hslToHex(hue, 10, 88), // readable body text
      accent: hslToHex((hue + 40) % 360, 95, 65), // accent color
      name: `AI Dark ${hue}`,
    };
  } else {
    return {
      primary: hslToHex(hue, 85, 48), // Slightly darker for high-contrast visibility
      secondary: hslToHex(hue, 12, 95), // soft card background
      background: hslToHex(hue, 15, 98), // soft light background
      text: hslToHex(hue, 20, 22), // dark text
      accent: hslToHex((hue + 40) % 360, 90, 52), // coordinated accent
      name: `AI Light ${hue}`,
    };
  }
}

// --- Dynamic Brand Voice-Tone Copy Helper ---

function getVoiceTexts(voice: string, name: string, description: string, industry: string, targetAudience: string) {
  const lowercaseVoice = voice.toLowerCase();
  
  if (lowercaseVoice === "bold") {
    return {
      heroTitle: `Dominate ${industry}. Zero Friction with ${name}.`,
      heroSubtitle: `We build high-octane tools for ${targetAudience}. Stop wasting time on outdated processes. ${description}`,
      ctaText: "Get Started Now",
      featuresTitle: "Engineered for Extreme Output",
      featuresSubtitle: "No fluff. Just raw speed and modular blueprints built to scale.",
      benefitsTitle: "Why Elite Builders Choose Us",
      benefitsSubtitle: "We eliminate the critical bottlenecks holding you back.",
      ctaTitle: "Ready to Supercharge Your Setup?",
      ctaSubtitle: `Unlock elite performance today. Custom configured for ${targetAudience}.`,
    };
  } else if (lowercaseVoice === "luxury") {
    return {
      heroTitle: `Bespoke Digital Excellence by ${name}`,
      heroSubtitle: `Crafted exclusively for discerning ${targetAudience}. Experience the ultimate standard in ${industry} management. ${description}`,
      ctaText: "Request Private Invitation",
      featuresTitle: "Artisanal Digital Architecture",
      featuresSubtitle: "Precision-engineered details tailored specifically to your aesthetic guidelines.",
      benefitsTitle: "An Elevated Standard of Quality",
      benefitsSubtitle: "Sovereign performance designed to surpass standard expectations.",
      ctaTitle: "Step Into a World of Pure Excellence",
      ctaSubtitle: `Discover the premium difference with ${name}.`,
    };
  } else if (lowercaseVoice === "playful") {
    return {
      heroTitle: `Make Work Feel Like Play with ${name}! 🚀`,
      heroSubtitle: `Say hello to your new favorite platform! Built to help ${targetAudience} get things done with a splash of magic. ${description}`,
      ctaText: "Let's Go! 🎉",
      featuresTitle: "Amazingly Simple & Fun Features",
      featuresSubtitle: "So easy a kid could use it, yet powerful enough for pro teams!",
      benefitsTitle: "Say Goodbye to Boring Spreadsheets",
      benefitsSubtitle: "Inject some color and joy back into your daily routine.",
      ctaTitle: "Ready to Start Having Fun?",
      ctaSubtitle: `Get 14 days of pure magical features for free!`,
    };
  } else if (lowercaseVoice === "friendly") {
    return {
      heroTitle: `We're Here to Help You Grow with ${name}`,
      heroSubtitle: `A warm, welcoming platform designed to help ${targetAudience} reach their goals together. ${description}`,
      ctaText: "Start Building with Us",
      featuresTitle: "Designed to Make Your Life Easier",
      featuresSubtitle: "Friendly interfaces and helpful setups for teams of all shapes and sizes.",
      benefitsTitle: "Work Happier and Collaborate Better",
      benefitsSubtitle: "Clear pipelines and simple interfaces that everyone can understand.",
      ctaTitle: "Let's Grow Your Project Together",
      ctaSubtitle: `No credit cards, no setup fees. Just happy building.`,
    };
  } else if (lowercaseVoice === "corporate") {
    return {
      heroTitle: `Enterprise-Grade ${industry} Architectures by ${name}`,
      heroSubtitle: `Secure, compliant, and scalable pipelines designed to help corporate ${targetAudience} maintain data governance. ${description}`,
      ctaText: "Schedule Corporate Consultation",
      featuresTitle: "Compliant & Governed Systems",
      featuresSubtitle: "Strict encryption standards and automated multi-tenant sync parameters.",
      benefitsTitle: "Mitigate Risk and Optimize Output",
      benefitsSubtitle: "Systematic architectures built for modern security guidelines.",
      ctaTitle: "Streamline Corporate Workflows",
      ctaSubtitle: `Request an enterprise layout walkthrough with our deployment team.`,
    };
  } else { // professional / default
    return {
      heroTitle: `Smart ${industry} Automation by ${name}`,
      heroSubtitle: `The leading platform built specifically to help ${targetAudience} achieve high-fidelity results. ${description}`,
      ctaText: "Get Started Now",
      featuresTitle: "Designed for High Performance",
      featuresSubtitle: `Everything needed to scale your digital presence as a custom solution in the ${industry} market.`,
      benefitsTitle: `Unlocking Opportunities for ${targetAudience}`,
      benefitsSubtitle: "Premium standards built directly into your database operations and visual interfaces.",
      ctaTitle: "Ready to Supercharge Your Setup?",
      ctaSubtitle: `Get 14 days of premium access. No credit card required.`,
    };
  }
}

// Map stock images based on Industry
const INDUSTRY_IMAGES: Record<string, string[]> = {
  technology: [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  ],
  "creative arts": [
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
  ],
  "food & drink": [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
  ],
  consulting: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  ],
  finance: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  ],
};

const VERIFIED_IMAGES = {
  browser: [
    "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop", // coding UI / browser
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop", // UI interface layout
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"  // computer screen laptop
  ],
  security: [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop", // cybersecurity lines glow
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop", // lock shield mobile secure
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop"  // cybersecurity key lock
  ],
  students: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop", // college students studying
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop", // library/learn environment
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"  // digital tablet learning
  ],
  education: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
  ],
  creative: [
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop"
  ],
  food: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop"
  ],
  finance: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
  ]
};

function getIndustryImages(industry: string): string[] {
  const norm = industry.toLowerCase().trim();
  const list = INDUSTRY_IMAGES[norm] || INDUSTRY_IMAGES.technology;
  // Shuffle list to get dynamic output on each generation
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return [
    shuffled[0] || list[0],
    shuffled[1] || list[1] || list[0],
    shuffled[2] || list[2] || list[0]
  ];
}

function getContextAwareImages(description: string, industry: string): string[] {
  const norm = description.toLowerCase();
  let pool: string[] = [];

  // Match keyword topics in description
  if (norm.includes("opera") || norm.includes("browser") || norm.includes("surf") || norm.includes("web")) {
    pool = [...pool, ...VERIFIED_IMAGES.browser];
  }
  if (norm.includes("cyber") || norm.includes("secure") || norm.includes("safe") || norm.includes("privacy") || norm.includes("protection")) {
    pool = [...pool, ...VERIFIED_IMAGES.security];
  }
  if (norm.includes("student") || norm.includes("kid") || norm.includes("pupil") || norm.includes("university")) {
    pool = [...pool, ...VERIFIED_IMAGES.students];
  }
  if (norm.includes("learn") || norm.includes("education") || norm.includes("school") || norm.includes("class")) {
    pool = [...pool, ...VERIFIED_IMAGES.education];
  }
  if (norm.includes("design") || norm.includes("art") || norm.includes("creative") || norm.includes("music")) {
    pool = [...pool, ...VERIFIED_IMAGES.creative];
  }
  if (norm.includes("food") || norm.includes("cafe") || norm.includes("coffee") || norm.includes("restaurant") || norm.includes("cooking")) {
    pool = [...pool, ...VERIFIED_IMAGES.food];
  }
  if (norm.includes("finance") || norm.includes("wealth") || norm.includes("money") || norm.includes("investment") || norm.includes("crypto")) {
    pool = [...pool, ...VERIFIED_IMAGES.finance];
  }

  // If we found specific matches, return them (shuffled)
  if (pool.length >= 3) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1], shuffled[2]];
  }

  // Otherwise, default back to standard industry imagery
  return getIndustryImages(industry);
}

function getDynamicHomeSections(
  businessType: string,
  voiceCopy: any,
  images: string[],
  designTheme: string,
  name: string,
  industry: string,
  targetAudience: string
): any[] {
  const normTheme = designTheme.toLowerCase();
  
  // Randomly select variant based on theme, fallback, or variety
  const getRandVariant = (sectionType: string) => {
    if (normTheme === "minimal") return Math.random() > 0.3 ? "minimal" : "modern";
    if (normTheme === "futuristic") return Math.random() > 0.3 ? "futuristic" : "modern";
    if (normTheme === "luxury") return Math.random() > 0.3 ? "luxury" : "modern";
    if (normTheme === "creative") return Math.random() > 0.3 ? "creative" : "modern";
    
    const variants = ["modern", "minimal", "futuristic", "luxury", "creative"];
    return variants[Math.floor(Math.random() * variants.length)];
  };

  const sections: any[] = [];

  // 1. Hero is ALWAYS the first component
  sections.push({
    type: "hero",
    variant: getRandVariant("hero"),
    props: {
      title: voiceCopy.heroTitle,
      subtitle: voiceCopy.heroSubtitle,
      ctaText: voiceCopy.ctaText,
      ctaLink: businessType.toLowerCase() === "saas" || businessType.toLowerCase() === "local business" ? "#pricing" : "#contact",
      image: images[0],
    },
  });

  // 2. Build middle sections dynamically based on businessType
  const middleBlocks: any[] = [];
  const bType = businessType.toLowerCase();

  if (bType === "saas") {
    middleBlocks.push(
      {
        type: "features",
        variant: getRandVariant("features"),
        props: {
          title: voiceCopy.featuresTitle,
          subtitle: voiceCopy.featuresSubtitle,
          items: [
            { title: `Automated ${industry} Sync`, desc: `Remove manual overhead. Sync pipelines instantly.`, icon: "zap" },
            { title: "Enterprise Reliability", desc: "Military-grade data protection built in.", icon: "shield" },
            { title: `Tailored for ${targetAudience}`, desc: `Optimized grids matching your specific work profiles.`, icon: "sliders" },
          ],
        },
      },
      {
        type: "benefits",
        variant: getRandVariant("benefits"),
        props: {
          title: voiceCopy.benefitsTitle,
          subtitle: voiceCopy.benefitsSubtitle,
          items: [
            { title: "Save Hours Daily", desc: `Let automated nodes do the heavy lifting while you focus on growth.`, image: images[1] },
            { title: "Scale Without Friction", desc: "No local installs. Edge-based rendering built for speed.", image: images[2] },
          ],
        },
      }
    );

    if (Math.random() > 0.5) {
      middleBlocks.push({
        type: "services",
        variant: getRandVariant("services"),
        props: {
          title: "Premium Feature Nodes",
          subtitle: "Supercharge your workspace with elite modules.",
          items: [
            { title: "Real-time Analytics API", desc: "High-throughput endpoint sync dashboards.", price: "$19/mo" },
            { title: "Dedicated Support Sync", desc: "24/7 priority developer slack slot.", price: "$49/mo" },
          ],
        },
      });
    }
  } else if (bType === "agency") {
    middleBlocks.push(
      {
        type: "features",
        variant: getRandVariant("features"),
        props: {
          title: "Our Specialized Services",
          subtitle: "Full-service digital campaigns driven by measurable KPIs.",
          items: [
            { title: "Bespoke Consulting", desc: "Strategic audits mapping layout flaws.", icon: "cpu" },
            { title: "Growth Campaigns", desc: "Staggered marketing flows targeting customers.", icon: "trending-up" },
            { title: "Edge Development", desc: "Blazing fast Next.js page speeds.", icon: "zap" },
          ],
        },
      },
      {
        type: "benefits",
        variant: getRandVariant("benefits"),
        props: {
          title: "Our Client Commitment",
          subtitle: "We prioritize security, styling coordination, and clean results.",
          items: [
            { title: "Dedicated Growth Managers", desc: "Direct communication channels. No middle-men.", image: images[1] },
            { title: "Full Code Ownership", desc: "Every template compiled belongs completely to you.", image: images[2] },
          ],
        },
      }
    );

    if (Math.random() > 0.5) {
      middleBlocks.push({
        type: "services",
        variant: getRandVariant("services"),
        props: {
          title: "Coordinating Packages",
          subtitle: "Fixed pricing tiers built for custom brands.",
          items: [
            { title: "Brand Identity Design", desc: "Colors palettes, typography pairings, and vector layouts.", price: "$999" },
            { title: "Production Deployment", desc: "Custom subdomain configs, SSL certs, and database instances.", price: "$2,499" },
          ],
        },
      });
    }
  } else if (bType === "local business") {
    middleBlocks.push(
      {
        type: "services",
        variant: getRandVariant("services"),
        props: {
          title: "Our Services Menu",
          subtitle: "Clear, upfront packages with no hidden consultation fees.",
          items: [
            { title: "Standard Consultation", desc: "A 1-hour walkthrough session.", price: "$99" },
            { title: "Premium Package Setup", desc: "Full parameters implementation and tuning.", price: "$349" },
          ],
        },
      },
      {
        type: "contact",
        variant: getRandVariant("contact"),
        props: {
          title: "Visit Our Shop",
          subtitle: "Stop by or call us to check availability.",
          email: `office@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
          phone: "+1 (800) 555-0145",
          address: "100 Main Street, Suite A, Silicon Valley, CA",
        },
      }
    );
  } else if (bType === "portfolio") {
    middleBlocks.push(
      {
        type: "features",
        variant: getRandVariant("features"),
        props: {
          title: "Technical Skillset Matrix",
          subtitle: "A detailed breakdown of my engineering capabilities.",
          items: [
            { title: "Frontend Engineering", desc: "Tailwind, Framer Motion, and Next.js structures.", icon: "palette" },
            { title: "Backend Systems", desc: "Mongoose database abstractions and APIs.", icon: "code" },
            { title: "Performance Audits", desc: "Turbopack optimization structures.", icon: "zap" },
          ],
        },
      },
      {
        type: "benefits",
        variant: getRandVariant("benefits"),
        props: {
          title: "Featured Case Studies",
          subtitle: "Recent professional projects deployed to production.",
          items: [
            { title: "ApexFlow Synchronizer", desc: "Built a cloud synchronizer for developers.", image: images[1] },
            { title: "Chroma styling framework", desc: "Designed coordinate HSL colors palettes.", image: images[2] },
          ],
        },
      }
    );
  } else {
    middleBlocks.push(
      {
        type: "benefits",
        variant: getRandVariant("benefits"),
        props: {
          title: "My Coaching Philosophy",
          subtitle: "Step-by-step methodologies to align workflow patterns.",
          items: [
            { title: "Focus on Core Output", desc: "We strip away distractions to focus purely on high-leverage steps.", image: images[1] },
            { title: "Coordinating Life & Work", desc: "Create a stable layout routine that sustains energy levels.", image: images[2] },
          ],
        },
      }
    );
    if (Math.random() > 0.5) {
      middleBlocks.push({
        type: "features",
        variant: getRandVariant("features"),
        props: {
          title: "Coaching Modules",
          subtitle: "Structured blocks designed for long-term growth.",
          items: [
            { title: "1-on-1 Performance Mappings", desc: "Weekly alignment check-ins.", icon: "zap" },
            { title: "Visual Strategy Playbooks", desc: "Detailed execution roadmaps.", icon: "sliders" },
          ],
        },
      });
    }
  }

  // Shuffle middle blocks randomly
  const shuffledMiddle = [...middleBlocks].sort(() => Math.random() - 0.5);
  sections.push(...shuffledMiddle);

  return sections;
}

// --- Template-based Home Page Sections Generator ---

function getTemplateHomeSections(
  templateId: string,
  businessType: string,
  voiceCopy: any,
  images: string[],
  name: string,
  industry: string,
  targetAudience: string
): any[] {
  const template = READY_TEMPLATES.find((t) => t.id === templateId.toLowerCase());
  if (!template) {
    return getDynamicHomeSections(businessType, voiceCopy, images, "modern", name, industry, targetAudience);
  }

  const companyName = name || "Brand";
  const emailDomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const email = `contact@${emailDomain || "business"}.com`;

  return template.sections.map((sec) => {
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
    };
  });
}


// --- Main Blueprint Generator Logic ---

export async function generateWebsiteBlueprint(
  input: GeneratorInput,
  onProgress: (step: number, log: string) => void
): Promise<{
  brand: {
    colorPalette: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
      name?: string;
    };
    typography: string;
    logoText: string;
    brandVoice: string;
    logoType: "text" | "image";
    logoSrc: string;
    logoWidth: number;
    logoHeight: number;
  };
  pages: Array<{
    name: string;
    slug: string;
    seo: { title: string; description: string; keywords: string };
    sections: any[];
  }>;
}> {
  // Step 1: Detect AI configuration
  onProgress(1, "Analyzing database and detecting active AI model parameters...");
  await new Promise((r) => setTimeout(r, 400));

  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE_URL;
  const customModel = process.env.AI_MODEL;

  let useLLM = false;
  let client: OpenAI | null = null;
  let modelName = input.aiModel || customModel || "gpt-4o-mini";

  const engine = input.aiEngine || "procedural";

  if (engine === "ollama") {
    useLLM = true;
    client = new OpenAI({
      apiKey: "ollama",
      baseURL: input.apiBaseUrl || "http://127.0.0.1:11434/v1",
    });
  } else if (engine === "openai" || (engine === "procedural" && apiKey && apiKey !== "dummy-openai-key-for-build-time-pass")) {
    useLLM = true;
    client = new OpenAI({ apiKey, baseURL: apiBase || undefined });
  } else {
    // Determine the base URL for local Ollama API as fallback
    const localBase = apiBase || "http://127.0.0.1:11434/v1";
    const tagsUrl = localBase.endsWith("/v1")
      ? localBase.replace(/\/v1$/, "/api/tags")
      : `${localBase.replace(/\/$/, "")}/api/tags`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);
      const ping = await fetch(tagsUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (ping.ok) {
        const data = await ping.json();
        const modelsList = data.models || [];
        if (modelsList.length > 0) {
          useLLM = true;
          client = new OpenAI({
            apiKey: "ollama",
            baseURL: localBase,
          });
          modelName = customModel || modelsList[0].name;
        }
      }
    } catch (e) {
      // Local Ollama server offline or not responding
    }
  }

  if (useLLM && client) {
    try {
      onProgress(2, `AI Model connected successfully! Using model: "${modelName}"...`);
      await new Promise((r) => setTimeout(r, 400));

      onProgress(3, "Formulating system constraints and structured site schemas...");
      await new Promise((r) => setTimeout(r, 300));

      const selectedColorsText = input.selectedColors
        ? `Use this user-provided color palette: Primary: "${input.selectedColors.primary}", Secondary: "${input.selectedColors.secondary}", Background: "${input.selectedColors.background}", Text: "${input.selectedColors.text}", Accent: "${input.selectedColors.accent}".`
        : "Generate a beautifully matching, high-contrast, modern HSL-based palette fitting the business domain.";

      const keywordsPrompt = input.keywords
        ? `- Core Focus Keywords: "${input.keywords}" (Customize all website text, features, pricing, and blocks SPECIFICALLY around these keywords/niche. For example, if keywords focus on 'mobiles' or 'tyres', write highly relevant expert titles and service details directly referencing mobiles/tyres!)`
        : "";

      const prompt = `You are a professional website builder, branding designer, and copywriter.
Generate a complete structured website blueprint in valid JSON format for:
- Website Name: "${input.name}"
- Description/Mission: "${input.description}"
${keywordsPrompt}
- Business Type: "${input.businessType}" (SaaS, Agency, Local Business, Portfolio, Personal Brand)
- Industry: "${input.industry}"
- Target Audience: "${input.targetAudience}"
- Brand Voice: "${input.brandVoice}" (Bold, Professional, Friendly, Corporate, Luxury, Playful)
- Design Theme: "${input.designTheme}" (modern, minimal, futuristic, luxury)
- Theme Mode: "${input.themeMode}" (dark or light)
- Layout Option: "${input.layoutType || "custom"}" (custom or template)
- Selected Template: "${input.selectedTemplate || "none"}" (saas, agency, portfolio, local, blog)
- Selected Pages: ${JSON.stringify(input.selectedPages)}

${selectedColorsText}

Your response MUST be a single, valid JSON object matching this schema:
{
  "brand": {
    "colorPalette": {
      "primary": "Hex color code",
      "secondary": "Hex color code for cards/sections",
      "background": "Hex color code for page background",
      "text": "Hex color code for body text",
      "accent": "Hex color code for hover states and active buttons"
    },
    "typography": "Selected font or default font pairing name",
    "logoText": "${input.name}",
    "brandVoice": "${input.brandVoice}",
    "logoType": "text",
    "logoSrc": "",
    "logoWidth": 120,
    "logoHeight": 40
  },
  "pages": [
    {
      "name": "Page Name matching one of the Selected Pages",
      "slug": "page slug (use empty string '' for the Home page, otherwise lowercase kebab-case, e.g., 'about', 'pricing', 'contact')",
      "seo": {
        "title": "Optimized page title tag",
        "description": "Compelling page description",
        "keywords": "comma,separated,keywords"
      },
      "sections": [
        {
          "type": "hero | features | benefits | services | pricing | testimonials | faq | contact | cta | footer",
          "variant": "modern | minimal | futuristic | luxury | creative",
          "props": {
             // Rules for props details:
             // - For hero: title (string), subtitle (string), ctaText (string), ctaLink (string), image (Unsplash image URL related to the business/industry)
             // - For features: title (string), subtitle (string), items (array of {title, desc, icon: "zap"|"shield"|"sliders"|"cpu"|"refresh-cw"|"palette"|"code"|"trending-up"})
             // - For benefits: title (string), subtitle (string), items (array of {title, desc, image})
             // - For services: title (string), subtitle (string), items (array of {title, desc, price})
             // - For pricing: title (string), subtitle (string), tiers (array of {name, price, period, features: string[], popular: boolean})
             // - For testimonials: title (string), subtitle (string), items (array of {name, role, quote, avatar})
             // - For faq: title (string), subtitle (string), items (array of {q, a})
             // - For contact: title (string), subtitle (string), email (string), phone (string), address (string)
             // - For cta: title (string), subtitle (string), buttonText (string), buttonLink (string)
             // - For footer: logoText (string)
          }
        }
      ]
    }
  ]
}

Rules:
1. Do not use raw HTML anywhere in the JSON response.
2. For all image, avatar, or visual properties in sections (like "image" in hero/about/benefits/cta, or "avatar" in testimonials), you MUST select the most context-appropriate verified image URL from the following list:
- Technology/Browser/Laptop UI:
  - "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
- Cybersecurity/Security/Safe/Privacy:
  - "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop"
- Students/Education/Learning/School:
  - "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
- Creative/Art/Design/Music:
  - "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop"
- Food/Drink/Cafe/Restaurant:
  - "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop"
- Business/Consulting/Team/Office:
  - "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
- People Avatars (for testimonials/team):
  - "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"

If the description matches a student browser like "OperaX", pick browser, cybersecurity, and student learning images. Do NOT invent other image URLs.
3. Every page MUST include a footer section.
4. If Layout Option is "template", you MUST structure the page sections strictly matching the layout style of the Selected Template:
   - For 'saas': hero (modern), features (modern), benefits (modern), services (modern), pricing (modern), testimonials (modern), cta (modern), footer.
   - For 'agency': hero (minimal), services (modern), benefits (modern), testimonials (modern), contact (modern), footer.
   - For 'portfolio': hero (creative), features (modern), benefits (minimal), testimonials (modern), contact (modern), footer.
   - For 'local': hero (minimal), services (modern), contact (modern), faq (modern), footer.
   - For 'blog': hero (minimal), features (modern), about (minimal), cta (modern), footer.
   Otherwise, generate a custom layout dynamically.
5. Output ONLY the JSON string. Do not wrap the JSON in markdown code blocks like \`\`\`json. Output nothing else.`;

      onProgress(4, "Requesting structured blueprint from LLM model (this might take a few seconds)...");
      const response = await client.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      onProgress(5, "LLM generation finished. Processing output response...");
      let jsonText = response.choices[0].message.content || "";
      // Strip out markdown code blocks if the LLM outputted them
      jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      jsonText = jsonText.trim();

      onProgress(6, "Parsing and validating JSON blueprint structure...");
      const result = extractJSON(jsonText);

      onProgress(7, "Completing branding style layout systems...");
      await new Promise((r) => setTimeout(r, 300));

      onProgress(8, "AI website blueprint generated successfully!");
      return {
        brand: {
          colorPalette: input.selectedColors || result.brand.colorPalette,
          typography: result.brand.typography || "Modern",
          logoText: result.brand.logoText || input.name,
          brandVoice: result.brand.brandVoice || input.brandVoice,
          logoType: result.brand.logoType || "text",
          logoSrc: result.brand.logoSrc || "",
          logoWidth: result.brand.logoWidth || 120,
          logoHeight: result.brand.logoHeight || 40,
        },
        pages: result.pages,
      };
    } catch (err: any) {
      console.error("LLM Generation failed, falling back to procedural engine:", err);
      onProgress(4, `LLM prompt failed or returned invalid JSON. Falling back to Ventrixa compiler fallback...`);
    }
  }

  // PROCEDURAL COMPILER FALLBACK (TRULY DYNAMIC GENERATOR)
  onProgress(3, `Configuring layouts structure for: ${input.selectedPages.join(", ")}...`);
  await new Promise((r) => setTimeout(r, 400));

  onProgress(4, `Writing dynamic sections and features matching a ${input.brandVoice} tone...`);
  await new Promise((r) => setTimeout(r, 400));

  onProgress(5, `Assembling layout blocks for business type: ${input.businessType}...`);
  await new Promise((r) => setTimeout(r, 400));

  onProgress(6, "Retrieving stock images and responsive cards matching industry...");
  await new Promise((r) => setTimeout(r, 300));

  onProgress(7, "Writing search descriptors, indexing tags, and OpenGraph variables...");
  await new Promise((r) => setTimeout(r, 300));

  onProgress(8, "Packing static JSON layout configuration structures...");
  await new Promise((r) => setTimeout(r, 400));

  const name = input.name;
  const description = input.description;
  const industry = input.industry;
  const businessType = input.businessType;
  const targetAudience = input.targetAudience;

  const finalColorPalette =
    input.selectedColors
      ? { ...input.selectedColors, name: "Custom Palette" }
      : generateDynamicPalette(input.name + Math.random(), input.description, input.themeMode);

  const font = TYPOGRAPHY_FONTS[input.typography.toLowerCase()] || TYPOGRAPHY_FONTS.modern;
  const voiceCopy = getVoiceTexts(input.brandVoice, name, description, industry, targetAudience);
  
  // Make variants and images completely dynamic based on user theme selections and random signature query tags
  const layoutVariant = input.designTheme.toLowerCase() || "modern";
  const images = getContextAwareImages(description, industry);

  const generatedPages = input.selectedPages.map((pageName) => {
    const slug = pageName.toLowerCase() === "home" ? "" : pageName.toLowerCase().replace(/\s+/g, "-");
    const sections: any[] = [];

    // Custom Section builder based on Business Type
    if (pageName.toLowerCase() === "home") {
      const homeSections =
        input.layoutType === "template" && input.selectedTemplate
          ? getTemplateHomeSections(
              input.selectedTemplate,
              businessType,
              voiceCopy,
              images,
              name,
              industry,
              targetAudience
            )
          : getDynamicHomeSections(
              businessType,
              voiceCopy,
              images,
              input.designTheme,
              name,
              industry,
              targetAudience
            );
      sections.push(...homeSections);
    } else if (pageName.toLowerCase() === "about") {
      sections.push({
        type: "about",
        variant: "modern",
        props: {
          title: `About ${name}`,
          subtitle: `Our mission to redefine modern ${industry} operations.`,
          text: `At ${name}, we believe in crafting software that eliminates digital friction. As a leading ${businessType} in the ${industry} space, we design products that help ${targetAudience} scale and succeed. Founded by a team of software architects, our unified products focus on delivering value, styling alignment, and stable layouts.`,
          image: images[2],
        },
      });
    } else if (pageName.toLowerCase() === "services") {
      sections.push({
        type: "services",
        variant: "modern",
        props: {
          title: "Service Packages",
          subtitle: `Professional options custom configured for ${targetAudience}.`,
          items: [
            { title: `Bespoke ${industry} Setup`, desc: `Full onboarding consulting, custom API mappings, and dedicated implementation parameters.`, price: "Custom" },
            { title: `${businessType} Optimization Audit`, desc: `A thorough analysis of your digital workflow, stylesheets compile logs, and performance bottlenecks.`, price: "$1,499" },
          ],
        },
      });
    } else if (pageName.toLowerCase() === "pricing") {
      sections.push({
        type: "pricing",
        variant: "modern",
        props: {
          title: "Transparent Pricing Tiers",
          subtitle: "No hidden onboarding fees. Pick a plan matching your scale.",
          tiers: [
            { name: "Starter Bundle", price: "$29", period: "month", features: ["1 Core page layout", "Basic automation cards", "Standard support channels"], popular: false },
            { name: "Growth Suite", price: "$79", period: "month", features: ["Unlimited multi-pages", "Priority API integration slots", `Tailored for ${targetAudience}`, "SSL security certs"], popular: true },
            { name: "Enterprise OS", price: "$199", period: "month", features: ["Custom contract SLA", "Unlimited cloud database space", "Dedicated manager", "SSO/SAML client sync"], popular: false },
          ],
        },
      });
    } else if (pageName.toLowerCase() === "faq") {
      sections.push({
        type: "faq",
        variant: "modern",
        props: {
          title: "Frequently Asked Questions",
          subtitle: "Clear answers to resolve standard operational procedures.",
          items: [
            { q: `What is ${name}?`, a: `We are a professional ${businessType} focusing on providing cutting-edge ${industry} solutions designed to help ${targetAudience} scale.` },
            { q: `How long does the setup take?`, a: `With our advanced blueprints system, you can initialize, customize, and deploy your complete layout structure within a few minutes.` },
          ],
        },
      });
    } else if (pageName.toLowerCase() === "contact") {
      sections.push({
        type: "contact",
        variant: "modern",
        props: {
          title: "Request a Consultation",
          subtitle: "Drop us a note, and our team will coordinate a walkthrough.",
          email: `info@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
          phone: "+1 (800) 555-0199",
          address: "Headquarters, Suite 100, Silicon Valley, CA",
        },
      });
    } else if (pageName.toLowerCase() === "portfolio") {
      sections.push({
        type: "benefits",
        variant: "modern",
        props: {
          title: "Our Featured Project Portfolio",
          subtitle: "A showcase of engineering and design milestones completed by our team.",
          items: [
            { title: "Enterprise Cloud Sync System", desc: "Designed high-throughput databases and automated sync nodes for scaling businesses.", image: images[0] },
            { title: "Global CDN Edge Layer", desc: "Implemented SSL cert provisioning and dynamic domain mappings.", image: images[1] },
          ],
        },
      });
    } else if (pageName.toLowerCase() === "blog") {
      sections.push({
        type: "features",
        variant: "modern",
        props: {
          title: "The Ventrixa Knowledge Hub",
          subtitle: "Insights, guides, and tutorials from our software architects.",
          items: [
            { title: "Optimizing Next.js Page Speed", desc: "How we configured dynamic styles mapping and reduced first contentful paint.", icon: "zap" },
            { title: "Branding Systems with HSL", desc: "A guide on HSL color palette hashing and dynamic contrast calculations.", icon: "palette" },
            { title: "Designing Robust Schema Models", desc: "Structuring MongoDB documents for real-time live preview workspace editors.", icon: "code" },
          ],
        },
      });
    } else if (pageName.toLowerCase() === "team") {
      sections.push({
        type: "testimonials",
        variant: "modern",
        props: {
          title: "Meet the Core Architects",
          subtitle: "The engineering team behind our high-performance SaaS solutions.",
          items: [
            { name: "Marcus Vane", role: "Principal Engineer", quote: "We build modular blueprints that compile business parameters directly into responsive static page layouts.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
            { name: "Elena Rostova", role: "Design Director", quote: "Every template is engineered to adapt its color variables based on HSL lightness thresholds to maintain contrast.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
          ],
        },
      });
    } else if (pageName.toLowerCase() === "gallery") {
      sections.push({
        type: "benefits",
        variant: "minimal",
        props: {
          title: "Visual Gallery Showcase",
          subtitle: "A closer look at our visual workspaces and custom design themes.",
          items: [
            { title: "SaaS Visual Workspace", desc: "High-octane drag-and-drop builder with real-time undo-redo stack logs.", image: images[1] },
            { title: "Modern Design Theme Mode", desc: "Premium dark and light themes dynamically generated on demand.", image: images[2] },
          ],
        },
      });
    } else if (pageName.toLowerCase() === "privacy policy" || pageName.toLowerCase() === "privacy") {
      sections.push({
        type: "about",
        variant: "minimal",
        props: {
          title: "Privacy Policy Guidelines",
          subtitle: "How we collect, secure, and govern your site blueprints data.",
          text: `At ${name}, we prioritize the privacy and security of our users. We do not store private credentials or database keys without strict encryption standards. All layout blueprints, page structures, and SEO metadata generated by our systems are owned 100% by you. We do not sell user data to advertising networks.`,
          image: images[1],
        },
      });
    } else if (pageName.toLowerCase() === "terms" || pageName.toLowerCase() === "terms of service" || pageName.toLowerCase() === "terms") {
      sections.push({
        type: "about",
        variant: "minimal",
        props: {
          title: "Terms of Service Agreement",
          subtitle: "Legal agreements governing the compilation and deployment tools.",
          text: `By initializing project blueprints with ${name}, you agree to comply with modern internet security guidelines. You retain full copyright ownership of all compiled code templates. Ventrixa provides domain mappings and SSL certificates on an 'as-is' basis, and is not responsible for external content hosted on deployed subdomain routes.`,
          image: images[0],
        },
      });
    } else {
      sections.push({
        type: "hero",
        variant: "minimal",
        props: {
          title: pageName,
          subtitle: `Custom layout configurations for the ${pageName} application view.`,
          ctaText: "Return Home",
          ctaLink: "#",
        },
      });
    }

    // Append testimonials and CTA on Home/Services pages
    if (pageName.toLowerCase() === "home" || pageName.toLowerCase() === "services") {
      sections.push(
        {
          type: "testimonials",
          variant: "modern",
          props: {
            title: voiceCopy.benefitsTitle ? "Feedback from our Clients" : "Client Stories",
            subtitle: `Discover how teams are scaling with ${name}.`,
            items: [
              { name: "Sarah Jenkins", role: `Lead Architect, ${name} User`, quote: `Switching to this setup was a game-changer. Our team deployment velocity increased immediately, saving hours of dev time.`, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
              { name: "David Chen", role: `CTO, ${targetAudience} Network`, quote: `The components render seamlessly. Highly recommend this premium layout to anyone looking for a top-tier design presence.`, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
            ],
          },
        },
        {
          type: "cta",
          variant: "modern",
          props: {
            title: voiceCopy.ctaTitle,
            subtitle: voiceCopy.ctaSubtitle,
            buttonText: voiceCopy.ctaText,
            buttonLink: "#pricing",
          },
        }
      );
    }

    // Always append Footer
    sections.push({
      type: "footer",
      variant: "modern",
      props: {
        logoText: name,
      },
    });

    return {
      name: pageName,
      slug: slug,
      seo: {
        title: `${pageName} | ${name}`,
        description: `Explore the ${pageName} page of ${name}. ${description.substring(0, 110)}...`,
        keywords: `${pageName}, ${name}, ${industry}, business, website`,
      },
      sections: sections,
    };
  });

  const finalPages = generatedPages;
  if (!useLLM) {
    customizeProceduralOutputForKeywords(finalPages, input.keywords || "", input.name, input.targetAudience);
  }

  return {
    brand: {
      colorPalette: finalColorPalette,
      typography: font,
      logoText: input.name,
      brandVoice: input.brandVoice,
      logoType: "text",
      logoSrc: "",
      logoWidth: 120,
      logoHeight: 40,
    },
    pages: finalPages,
  };
}

function customizeProceduralOutputForKeywords(
  pages: any[],
  keywords: string,
  companyName: string,
  targetAudience: string
) {
  if (!keywords) return;

  const kwStr = keywords.toLowerCase();
  const kwList = keywords.split(",").map(k => k.trim()).filter(Boolean);
  const primaryKw = kwList[0] || "product";
  const capitalizedKw = primaryKw.charAt(0).toUpperCase() + primaryKw.slice(1);
  
  let domain = "general";
  if (kwStr.includes("cloth") || kwStr.includes("dress") || kwStr.includes("boutique") || kwStr.includes("fashion") || kwStr.includes("apparel") || kwStr.includes("wear") || kwStr.includes("garment") || kwStr.includes("suit") || kwStr.includes("shirt")) {
    domain = "clothes";
  } else if (kwStr.includes("tyre") || kwStr.includes("tire") || kwStr.includes("wheel") || kwStr.includes("align") || kwStr.includes("car") || kwStr.includes("auto") || kwStr.includes("mechanic") || kwStr.includes("garage")) {
    domain = "tyres";
  } else if (kwStr.includes("mobile") || kwStr.includes("phone") || kwStr.includes("smartphone") || kwStr.includes("device") || kwStr.includes("cell")) {
    domain = "mobiles";
  }

  pages.forEach(page => {
    if (page.seo) {
      if (domain === "clothes") {
        page.seo.title = `${page.name} | Boutique Fashion | ${companyName}`;
        page.seo.description = `Discover premium clothes, tailoring, and designer apparel at ${companyName}. Book a styling appointment today!`;
      } else if (domain === "tyres") {
        page.seo.title = `${page.name} | Professional Tyre Fitting | ${companyName}`;
        page.seo.description = `Quick tyre repairs, wheel alignment, and vehicle diagnostics at ${companyName}. Schedule auto fitting online.`;
      } else if (domain === "mobiles") {
        page.seo.title = `${page.name} | Device Repairs & Screen Fixes | ${companyName}`;
        page.seo.description = `Certified smartphone repair service at ${companyName}. Express screen swap and diagnostic calibrations.`;
      } else {
        page.seo.title = page.seo.title.replace(/SaaS Startup|AI Platform|Technology/gi, capitalizedKw);
        page.seo.description = page.seo.description.replace(/SaaS platform|automation tool|software/gi, primaryKw);
      }
      page.seo.keywords = keywords + ", " + page.seo.keywords;
    }

    page.sections.forEach((section: any) => {
      const type = section.type;
      const props = section.props || {};

      if (domain === "clothes") {
        if (type === "hero") {
          props.title = `Bespoke Fashion Collections by ${companyName}`;
          props.subtitle = `Discover premium apparel, custom fittings, and seasonal outfits tailored to your unique style. Book a private boutique appointment today.`;
          props.ctaText = `Book Styling Appointment`;
          props.ctaLink = `#contact`;
          props.image = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop";
        } else if (type === "features") {
          props.title = `Curated Designer Wear`;
          props.subtitle = `Handcrafted clothing and essential fashion pieces chosen by styling experts.`;
          props.items = [
            { title: "Seasonal Collections", desc: `Browse our curated dresses, shirts, and designer garments designed for everyday elegance.`, icon: "palette" },
            { title: "Custom Tailoring", desc: `Get professional alterations and bespoke fits made precisely to your measurements.`, icon: "sliders" },
            { title: "Bespoke Styling", desc: `Coordinate wardrobes with private consultants to elevate your personal brand.`, icon: "cpu" },
          ];
        } else if (type === "benefits") {
          props.title = `Eliminate Wardrobe Stress`;
          props.subtitle = `Why fashion enthusiasts choose our customized styling options.`;
          props.items = [
            { title: "Premium Italian Fabrics", desc: `We source only the finest sustainable textiles for long-lasting comfort and style.`, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop" },
            { title: "Perfect Fitting Guarantee", desc: `Every piece is tailored to hug your silhouette perfectly before you leave.`, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop" }
          ];
        } else if (type === "services") {
          props.title = `Our Styling Services Menu`;
          props.subtitle = `Clear, upfront styling packages with no hidden custom fees.`;
          props.items = [
            { title: "Personal Styling Consultation", desc: `A 1-hour private fitting session with our boutique designer.`, price: "$49" },
            { title: "Complete Seasonal Wardrobe Setup", desc: `Includes custom tailoring, 3 outfit selections, and styling guidelines.`, price: "$299" }
          ];
        } else if (type === "pricing") {
          props.title = `Transparent Styling Plans`;
          props.subtitle = `Choose the subscription tier that matches your wardrobe scale.`;
          props.tiers = [
            { name: "Essential Styling", price: "$49", period: "session", features: ["1-Hour boutique tour", "1 Wardrobe review", "Standard styling cards"], popular: false },
            { name: "Signature Wardrobe", price: "$149", period: "month", features: ["Monthly seasonal selections", "Free tailoring & alterations", "Priority fitting slots", "10% store-wide discount"], popular: true },
            { name: "Couture Collective", price: "$499", period: "month", features: ["Exclusive designer previews", "Unlimited custom tailors", "Dedicated personal stylist", "Same-day styling delivery"], popular: false }
          ];
        } else if (type === "faq") {
          props.title = `Frequently Asked Questions`;
          props.subtitle = `Fast answers to common inquiries regarding our clothing services.`;
          props.items = [
            { q: "Do you offer custom tailoring appointments?", a: "Yes, you can book a session online. Our master tailor will take your measurements and craft bespoke adjustments." },
            { q: "What is your return policy on apparel?", a: "We accept returns within 14 days on all unworn items with tags attached, excluding custom-altered garments." }
          ];
        } else if (type === "testimonials") {
          props.title = `Feedback from our Clients`;
          props.subtitle = `Discover how fashion enthusiasts are styling with ${companyName}.`;
          props.items = [
            { name: "Sarah Jenkins", role: `Fashion Designer`, quote: `"The tailoring was absolutely perfect! I wore one of their dresses to a gala and received countless compliments."`, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
            { name: "David Chen", role: `Boutique Client`, quote: `"Highly recommend their seasonal wardrobe service. The fabrics feel extremely premium and hold up beautifully."`, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
          ];
        } else if (type === "contact") {
          props.title = `Request a Styling Consultation`;
          props.subtitle = `Drop us a note, and our tailors will coordinate a walkthrough.`;
          props.email = `styling@${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
          props.phone = `+1 (800) 555-WEAR`;
          props.address = `Boutique Row, Suite 105, Beverly Hills, CA`;
        } else if (type === "about") {
          props.title = `About ${companyName}`;
          props.subtitle = `Redefining local fashion and tailoring standards.`;
          props.text = `At ${companyName}, we believe that clothes are more than just fabric—they are an extension of your identity. Founded by fashion designers and tailors, our boutique designs look to create custom fits and coordinates for ${targetAudience}. We prioritize quality textiles, styling support, and tailored blueprints.`;
          props.image = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop";
        }
      } else if (domain === "tyres") {
        if (type === "hero") {
          props.title = `Professional Tyre Fitting & Wheel Alignment`;
          props.subtitle = `Keep your vehicle safe and smooth. Top-tier tyres, master alignments, and fast auto service straight to your booking slot.`;
          props.ctaText = `Book Fitting Appointment`;
          props.ctaLink = `#contact`;
          props.image = "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=800&auto=format&fit=crop";
        } else if (type === "features") {
          props.title = `Full-Service Auto Care`;
          props.subtitle = `Expert mechanics, premium tyre brands, and precision alignment machinery.`;
          props.items = [
            { title: "Tyre Replacement", desc: `Wide selection of premium all-season, performance, and heavy-duty tyres.`, icon: "zap" },
            { title: "3D Wheel Alignment", desc: `Correct tracking issues to improve handling and extend the lifespan of your tyres.`, icon: "sliders" },
            { title: "Brake & Suspension Checks", desc: `Comprehensive diagnostics to ensure your vehicle is roadworthy and safe.`, icon: "cpu" },
          ];
        } else if (type === "benefits") {
          props.title = `Why Choose Our Tyre Service?`;
          props.subtitle = `Eliminate uneven wear and improve vehicle performance.`;
          props.items = [
            { title: "Fast 30-Minute Turnaround", desc: `Relax in our lounge while our certified technicians handle your vehicle quickly.`, image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop" },
            { title: "Road Hazard Protection", desc: `All new tyres come with a complimentary 12-month mileage warranty.`, image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop" }
          ];
        } else if (type === "services") {
          props.title = `Our Tyre Services Menu`;
          props.subtitle = `Clear, upfront auto service packages with no hidden diagnostics fees.`;
          props.items = [
            { title: "Standard Wheel Alignment", desc: `Front-toe adjustments and safety inspections.`, price: "$79" },
            { title: "Premium Tyre Fitting & Balance", desc: `Mounting 4 new tyres, balancing, and full road-force testing.`, price: "$199" }
          ];
        } else if (type === "pricing") {
          props.title = `Auto Service Pricing Tiers`;
          props.subtitle = `Choose a maintenance plan matching your fleet or personal vehicle.`;
          props.tiers = [
            { name: "Safety Checkup", price: "$39", period: "session", features: ["Tyre pressure check & rotation", "Visual brake pads review", "Suspension audit report"], popular: false },
            { name: "Precision Package", price: "$129", period: "session", features: ["Four-wheel alignment scan", "Computerized balancing", "Nitrogen inflation check", "12-Month warranty"], popular: true },
            { name: "Fleet Maintenance", price: "$349", period: "month", features: ["Priority auto care slots", "Emergency roadside tyre rescue", "Dedicated service manager", "Full fluid top-offs included"], popular: false }
          ];
        } else if (type === "faq") {
          props.title = `Frequently Asked Questions`;
          props.subtitle = `Fast answers to common inquiries regarding tyre fitting.`;
          props.items = [
            { q: "How often should I align my wheels?", a: "We recommend a wheel alignment check every 10,000 miles or immediately if you notice pulling to one side." },
            { q: "Do you stock tyres for off-road vehicles?", a: "Yes, we stock a wide catalog of premium off-road, SUV, all-terrain, and winter tyres in our service garage." }
          ];
        } else if (type === "testimonials") {
          props.title = `Feedback from our Clients`;
          props.subtitle = `Discover how drivers are scaling security with ${companyName}.`;
          props.items = [
            { name: "Sarah Jenkins", role: `SUV Owner`, quote: `"They fixed my tyre and did a 3D wheel alignment in 25 minutes flat. Excellent service!"`, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
            { name: "David Chen", role: `Logistics Manager`, quote: `"Our delivery fleet uses their maintenance service. Fast bookings, honest pricing, and high-performance tyres."`, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
          ];
        } else if (type === "contact") {
          props.title = `Book Tyre & Auto Service`;
          props.subtitle = `Drop us a note, and our technicians will coordinate a walkthrough.`;
          props.email = `service@${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
          props.phone = `+1 (800) 555-TYRE`;
          props.address = `Auto Service Hub, Suite B, Detroit, MI`;
        } else if (type === "about") {
          props.title = `About ${companyName}`;
          props.subtitle = `Redefining road safety and tyre fitting.`;
          props.text = `At ${companyName}, we believe that road safety starts with quality tyres and alignment tracking. Founded by certified mechanics, our garage builds high-fidelity service slots for ${targetAudience}. We prioritize premium tyre brands, transparent prices, and robust auto diagnostics.`;
          props.image = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop";
        }
      } else if (domain === "mobiles") {
        if (type === "hero") {
          props.title = `Premium Smartphone Repairs & Accessories`;
          props.subtitle = `Fast screen replacements, battery diagnostic tunings, and elite device protection. Schedule a professional repair slot online.`;
          props.ctaText = `Book Repair Appointment`;
          props.ctaLink = `#contact`;
          props.image = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop";
        } else if (type === "features") {
          props.title = `Certified Mobile Technicians`;
          props.subtitle = `OEM replacement parts, warranty-backed screens, and immediate diagnostic logic.`;
          props.items = [
            { title: "Express Screen Fix", desc: `Cracked glass and touch screen replacements completed in under 45 minutes.`, icon: "zap" },
            { title: "Battery Calibration", desc: `Restore battery health parameters and resolve power synchronization issues.`, icon: "sliders" },
            { title: "Hardware Diagnostics", desc: `Full motherboard testing, water damage repair, and speaker calibrations.`, icon: "cpu" },
          ];
        } else if (type === "benefits") {
          props.title = `Why Choose Our Repairs?`;
          props.subtitle = `Certified technicians ensuring your device is fully calibrated.`;
          props.items = [
            { title: "Lifetime Parts Warranty", desc: `We stand by our repairs with a comprehensive warranty on all replaced screens.`, image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop" },
            { title: "Data-Safe Repair Protocol", desc: `Your private photos, messages, and accounts remain completely secure.`, image: "https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=800&auto=format&fit=crop" }
          ];
        } else if (type === "services") {
          props.title = `Our Mobile Repair Menu`;
          props.subtitle = `Upfront pricing tiers with no hidden sensor calibration costs.`;
          props.items = [
            { title: "Standard Diagnostic Check", desc: `Full hardware sensor and battery health logs.`, price: "$29" },
            { title: "Premium Screen & Battery Pack", desc: `Replacement of cracked front glass and battery calibration.`, price: "$149" }
          ];
        } else if (type === "pricing") {
          props.title = `Device Service Tiers`;
          props.subtitle = `Pick a repair bundle that matches your hardware problem.`;
          props.tiers = [
            { name: "Basic Diagnosis", price: "$29", period: "session", features: ["Diagnostic logging check", "Dust clearance clean", "Estimated repair quote"], popular: false },
            { name: "Pro Shield Repair", price: "$99", period: "session", features: ["Express OEM parts swap", "Tempered glass guard included", "90-Day repair warranty", "Water-resistant seal reload"], popular: true },
            { name: "Enterprise Mobile Care", price: "$249", period: "month", features: ["Dedicated corporate desk portal", "Loaner devices during repair", "Priority 30-min express slot", "Full logic board repairs"], popular: false }
          ];
        } else if (type === "faq") {
          props.title = `Frequently Asked Questions`;
          props.subtitle = `Fast answers to common inquiries regarding device repair.`;
          props.items = [
            { q: "Are your screen replacements OEM quality?", a: "Yes, we use only high-grade certified original specification parts to ensure touch response and color accuracy." },
            { q: "Do I need to backup my device before repair?", a: "We recommend backing up, but our technicians follow strict data safety guidelines, ensuring no data loss during repairs." }
          ];
        } else if (type === "testimonials") {
          props.title = `Feedback from our Clients`;
          props.subtitle = `Discover how users are repairing devices with ${companyName}.`;
          props.items = [
            { name: "Sarah Jenkins", role: `iPhone User`, quote: `"My phone screen was completely shattered. They replaced it in 30 minutes and it looks brand new!"`, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
            { name: "David Chen", role: `Software Architect`, quote: `"Amazing service. They replaced my laptop battery and recalibrated the charge parameters in one go."`, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
          ];
        } else if (type === "contact") {
          props.title = `Schedule Mobile Repair Slot`;
          props.subtitle = `Drop us a note, and our repair technicians will coordinate a walkthrough.`;
          props.email = `repairs@${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
          props.phone = `+1 (800) 555-FIXIT`;
          props.address = `Tech Repair Hub, Suite 402, Cupertino, CA`;
        } else if (type === "about") {
          props.title = `About ${companyName}`;
          props.subtitle = `Redefining device repair and diagnostics.`;
          props.text = `At ${companyName}, we believe in restoring mobile devices to original factory specifications. Founded by certified micro-solderers, our repair desk builds express slots for ${targetAudience}. We prioritize OEM parts, data safety protocol, and robust logic testing.`;
          props.image = "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=800&auto=format&fit=crop";
        }
      } else {
        const repl = (s: any): any => {
          if (typeof s !== "string") return s;
          return s
            .replace(/SaaS Startup|AI Platform|Technology/gi, capitalizedKw)
            .replace(/SaaS platform|automation tool|software/gi, primaryKw)
            .replace(/developers|engineering teams/gi, targetAudience);
        };
        for (const key in props) {
          if (typeof props[key] === "string") {
            props[key] = repl(props[key]);
          } else if (Array.isArray(props[key])) {
            props[key] = props[key].map((item: any) => {
              if (typeof item === "string") {
                return repl(item);
              } else if (item && typeof item === "object") {
                const newItem = { ...item };
                for (const k in newItem) {
                  if (typeof newItem[k] === "string") {
                    newItem[k] = repl(newItem[k]);
                  }
                }
                return newItem;
              }
              return item;
            });
          }
        }
      }
    });
  });
}
