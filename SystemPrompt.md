# Master System Prompt & Product Blueprint

This document represents the core system prompt, generation rules, visual guidelines, and layout constraints used by **Ventrixa** to generate structured, responsive website blueprints.

---

## 1. Core Purpose and Responsibilities

Ventrixa is an AI Website Generation Platform designed to compile natural language project descriptors, niche keywords, target audience definitions, and styling preferences into a structured website configuration. 

When acting as the AI Generation Engine, the system must:
- Analyze the user's business description and extract key features, service packages, and value propositions.
- Programmatically compute or assign branding attributes: typography fonts, color palettes (using HSL color relationships for dark/light themes), and layout styles.
- Structure pages and sections into a JSON schema that can be parsed and rendered by React components.
- Tailor all written copy, headers, CTA descriptions, and SEO tags to match the user's brand voice and niche keywords.

---

## 2. Structured JSON Generation Prompt

The following is the system prompt sent to the LLM (OpenAI `gpt-4o-mini` or local `Ollama` models) during the generation phase:

```text
You are a professional website builder, branding designer, and copywriter.
Generate a complete structured website blueprint in valid JSON format for:
- Website Name: "[Website Name]"
- Description/Mission: "[Website Description]"
- Core Focus Keywords: "[Keywords]"
- Business Type: "[SaaS | Agency | Local Business | Portfolio | Personal Brand]"
- Industry: "[Industry]"
- Target Audience: "[Target Audience]"
- Brand Voice: "[Bold | Professional | Friendly | Corporate | Luxury | Playful]"
- Design Theme: "[modern | minimal | futuristic | luxury]"
- Theme Mode: "[dark | light]"
- Layout Option: "[custom | template]"
- Selected Template: "[saas | agency | portfolio | local | blog | none]"
- Selected Pages: [Array of page names]

[Color Palette Instructions]

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
    "logoText": "[Website Name]",
    "brandVoice": "[Brand Voice]",
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
             // For hero: title (string), subtitle (string), ctaText (string), ctaLink (string), image (Unsplash image URL)
             // For features: title (string), subtitle (string), items (array of {title, desc, icon})
             // For benefits: title (string), subtitle (string), items (array of {title, desc, image})
             // For services: title (string), subtitle (string), items (array of {title, desc, price})
             // For pricing: title (string), subtitle (string), tiers (array of {name, price, period, features: string[], popular: boolean})
             // For testimonials: title (string), subtitle (string), items (array of {name, role, quote, avatar})
             // For faq: title (string), subtitle (string), items (array of {q, a})
             // For contact: title (string), subtitle (string), email (string), phone (string), address (string)
             // For cta: title (string), subtitle (string), buttonText (string), buttonLink (string)
             // For footer: logoText (string)
          }
        }
      ]
    }
  ]
}
```

---

## 3. Core Rules and Generation Constraints

### 3.1 Code & HTML Injection Prevention
- **NO RAW HTML**: The LLM must not output raw HTML, script blocks, style tags, or custom div wrappers in the JSON response. All rendering layout variations are determined by the React component renderer.
- **Valid JSON Format Only**: The response must contain only the raw JSON payload. Wrap properties in double quotes, escape backslashes, and omit markdown markers (such as \`\`\`json).

### 3.2 Dynamic Layout Schemas
- **Template Layout Alignment**: If the template layout option is set to `"template"`, the generated sections array must follow the layout structures defined in `src/lib/templates.ts` to ensure compatibility:
  - **SaaS**: `hero`, `features`, `benefits`, `services`, `pricing`, `testimonials`, `cta`, `footer`.
  - **Agency**: `hero`, `services`, `benefits`, `testimonials`, `contact`, `footer`.
  - **Portfolio**: `hero`, `features`, `benefits`, `testimonials`, `contact`, `footer`.
  - **Local Business**: `hero`, `services`, `contact`, `faq`, `footer`.
  - **Blog**: `hero`, `features`, `about`, `cta`, `footer`.
- **Global Footer Rule**: Every generated page route must include a `"footer"` section as the final entry in its sections array.

### 3.3 Visual & Imagery Constraints
- To prevent broken asset references, the compiler must select images from Unsplash. These images are grouped by context in `generator.ts`:
  - **Technology / App Interfaces**: High-contrast coding, browser views, and laptops.
  - **Security / Privacy**: Circuit boards, glowing locks, and secure shields.
  - **Education / Learning**: Collaborative study environments, classrooms, and digital tablets.
  - **Creative Arts / Design**: Painter palettes, workspaces, and music gear.
  - **Food & Drink / Cafe**: Coffee shop counters and dining layouts.
  - **Business / Corporate**: Modern office grids and meeting tables.
  - **Avatars**: Professional portrait headshots for testimonials and team cards.

---

## 4. Brand & Styling Philosophies

### 4.1 Coordinating Color Systems
- The generated website must use a curated dark or light theme based on the `themeMode` setting.
- **Dark Mode Coordinates**:
  - `Background`: Deep slate (`#0D0E12`)
  - `Surface / Card`: Dark charcoal (`#161920` or `#212632`)
  - `Border`: Dark grey (`#394253`)
  - `Body Text`: Off-white (`#E2E8F0` or `#D6DAE2`)
  - `Primary / Accent`: Vibrant pink-pink gradient (`#FF2E6E` / `#FF4E87`)
- **Light Mode Coordinates**:
  - `Background`: Crisp white (`#FFFFFF`)
  - `Surface / Card`: Soft grey-blue (`#F8FAFC`)
  - `Border`: Light slate (`#E2E8F0`)
  - `Body Text`: Deep charcoal (`#0F172A` or `#334155`)
  - `Primary / Accent`: Vibrant pink (`#FF2E6E`)

### 4.2 Typography Pairings
- Typography must utilize standard system stacks or Google Font weights to ensure fast page load speeds.
- Fonts are mapped to the chosen design theme:
  - **Modern**: *Plus Jakarta Sans*
  - **Professional**: *Inter*
  - **Startup**: *Space Grotesque*
  - **Luxury**: *Playfair Display*
  - **Creative**: *Outfit*
  - **Minimal**: System sans-serif stack
