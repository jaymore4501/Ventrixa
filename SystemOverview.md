# 🏢 Ventrixa — System Overview & Architectural Design

This document details the architectural specifications, component interfaces, database schemas, and data flow pipelines for **Ventrixa**.

---

## 1. System Architecture Overview

Ventrixa is structured as a modular, decoupled Next.js web application. It combines Client-Side Client Components for interactive visual layout editing with Server-Side Server Routes for secure database query transactions, file generation, and AI generation tasks.

```
      ┌──────────────────────────────────────────┐
      │               Client Tier                │
      │   (React 19, Tailwind v4, Zustand UI)    │
      └────────────────────┬─────────────────────┘
                           │ HTTP JSON API
                           ▼
      ┌──────────────────────────────────────────┐
      │            Web & API Router              │
      │     (App Router, NextAuth Security)      │
      └────────────────────┬─────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
      ┌────────────────────┐ ┌───────────────────┐
      │   AI Core Service  │ │  Data Controller  │
      │ (OpenAI & Ollama)  │ │ (Database Switch) │
      └────────────────────┘ └─────────┬─────────┘
                                       │
                             ┌─────────┴─────────┐
                             ▼                   ▼
                       ┌───────────┐       ┌───────────┐
                       │  MongoDB  │       │  Mock DB  │
                       │  (Cloud)  │       │  (JSON)   │
                       └───────────┘       └───────────┘
```

---

## 2. Component Breakdown & Service Interactions

### 2.1 Web Workspace Tier
- **Landing Page (`src/app/page.tsx`)**: An interactive page rendered with high-performance animations (WebGL Plasma background, LightRays, ShinyText headers, and BorderGlow panels). It handles credential and OAuth authentication modals.
- **Onboarding Wizard (`src/app/dashboard/wizard/page.tsx`)**: Guides the user through project configuration: metadata input, color choices, typography themes, and page mappings. It also includes an input interface for adding/removing custom keywords.
- **Visual Workspace Editor (`src/app/editor/[projectId]/page.tsx`)**: A client-side visual editor. It renders the pages of a site using layout configurations, processes element selections, handles undo/redo stacks, updates component parameters in real time, and sends save payloads to API endpoints.
- **Subdomain Renderer (`src/app/sites/[subdomain]/page.tsx`)**: A dynamic route that reads a site configuration by its subdomain and renders the layout sections with user-defined style coordinates.

### 2.2 Reusable Visual Components
- **`SectionRenderer.tsx`**: The core component visual library. It receives a section's type (e.g. `hero`, `features`, `pricing`, `faq`, `contact`), style properties, and color palettes, and renders the corresponding HTML structures.
- **ReactBits Libraries (`src/components/reactbits/*`)**: Modular styling and animation scripts:
  - `LightRays.tsx`: Ambient cursor tracking glow.
  - `Plasma.tsx`: Interactive WebGL noise gradient.
  - `BorderGlow.tsx`: Smooth gradient borders for card outlines.
  - `ShinyText.tsx`, `SplitText.tsx`: Text effect elements.
  - `LogoLoop.tsx`: Continuous brand logo banners.

### 2.3 Backend Service Modules
- **Database Abstraction (`src/lib/db.ts`)**: Acts as a query dispatcher. It checks for a MongoDB Atlas environment key. If present, it executes queries using Mongoose schemas. If absent, it reads and writes to `src/data/mockDb.json`.
- **AI Generator Service (`src/lib/ai/generator.ts`)**: Handles site generation:
  1. Detects available AI endpoints (online OpenAI API key or local Ollama client).
  2. Builds prompts containing project parameters, selected typography models, and domain-specific keywords.
  3. Requests structured JSON layout configurations from the LLM.
  4. Parses the JSON output or triggers the procedural generation engine as a fallback.

---

## 3. Data Flow & Request Lifecycles

### 3.1 Website Generation Sequence

```
User          Wizard          generator.ts          OpenAI/Ollama          db.ts          Database/JSON
 │              │                  │                      │                  │                  │
 ├─Submit inputs│                  │                      │                  │                  │
 ├─────────────►│                  │                      │                  │                  │
 │              ├─Initialize step  │                      │                  │                  │
 │              ├─────────────────►│                      │                  │                  │
 │              │                  ├─Ping local Ollama    │                  │                  │
 │              │                  ├─────────────────────►│                  │                  │
 │              │                  ├─LLM prompt request   │                  │                  │
 │              │                  ├─────────────────────►│                  │                  │
 │              │                  │◄─────────────────────┤                  │                  │
 │              │                  │  (Returns JSON)      │                  │                  │
 │              │                  ├─Validate structure   │                  │                  │
 │              │                  ├─(Or run fallback)    │                  │                  │
 │              │                  ├────────────────────────────────────────►│                  │
 │              │                  │  Save project structures                ├─Write records    │
 │              │                  │                                         ├─────────────────►│
 │              │                  │◄────────────────────────────────────────┤                  │
 │              │◄─────────────────┤                                         │                  │
 │              │  (Complete UI)   │                                         │                  │
 │◄─────────────┤                  │                                         │                  │
```

### 3.2 Dynamic Routing & Section Rendering Lifecycle
1. A client requests `http://company.ventrixa.site/` or a custom sub-path.
2. Next.js router captures the request at `src/app/sites/[subdomain]/page.tsx`.
3. The server queries `db.ts` to locate the website configuration matches for the `subdomain` string.
4. The database returns the matching website structure, pages, and section lists.
5. The server serializes the Mongoose document structure into a clean JSON object to prevent Client Component serialization errors.
6. The client parses the JSON configurations and renders the components in order using `<SectionRenderer />` with the project's color palette and fonts.

---

## 4. Database Architecture & Relationships

Ventrixa maps configurations using Mongoose schemas in `src/models/schemas.ts`. If running in development without MongoDB Atlas, all records persist in a single nested database file `src/data/mockDb.json`.

```
         ┌──────────────┐
         │     User     │
         └──────┬───────┘
                │ 1
                │
                │ *
         ┌──────▼───────┐
         │   Project    │
         └──────┬───────┘
                │ 1
                │
                │ 1
         ┌──────▼───────┐
         │   Website    │
         └─┬──────────┬─┘
           │ 1        │ 1
           │          │
           │ *        │ *
    ┌──────▼───────┐┌─▼────────────┐
    │     Page     ││  Deployment  │
    └──────┬───────┘└──────────────┘
           │ 1
           │
           │ *
    ┌──────▼───────┐
    │   Section    │
    └──────────────┘
```

### 4.1 Schema Definitions

#### User Schema
- `name`: string (required)
- `email`: string (unique, lowercase, required)
- `password`: string (select: false) - Salted bcrypt hash
- `image`: string
- `provider`: enum ("credentials", "google", "github")
- `bio`: string
- `location`: string
- `websiteUrl`: string

#### Project Schema
- `userId`: string (foreign key reference)
- `name`: string
- `description`: string
- `industry`: string
- `businessType`: string
- `targetAudience`: string
- `brandVoice`: string
- `theme`: enum ("dark", "light")
- `colorPalette`: primary (hex), secondary (hex), background (hex), text (hex), accent (hex), name (string)
- `typography`: string (maps to system font stack)
- `logoText`: string
- `logoType`: enum ("text", "image")
- `logoSrc`, `logoWidth`, `logoHeight`
- `selectedPages`: array of strings
- `designTheme`: string
- `status`: enum ("draft", "generating", "completed")
- `subdomain`: string

#### Website Schema
- `projectId`: string (reference to Project)
- `userId`: string
- `subdomain`: string (unique subdomain handle)
- `customDomain`: string (optional DNS routing mapping)
- `isPublished`: boolean
- `version`: number

#### Page Schema
- `websiteId`: string (reference to Website)
- `name`: string
- `slug`: string (empty string for homepage `/`, otherwise lowercase paths)
- `seoTitle`, `seoDescription`, `seoKeywords`: string

#### Section Schema
- `pageId`: string (reference to Page)
- `type`: string (e.g. "navbar", "hero", "features")
- `variant`: string (e.g. "minimal", "modern", "luxury")
- `position`: number (layout ordering index)
- `props`: Mixed (attributes like titles, subtitle copy, items, image paths)
- `style`: Mixed (override settings)

#### Deployment Schema
- `websiteId`: string (reference to Website)
- `version`: number
- `subdomain`: string
- `customDomain`: string (optional)
- `status`: enum ("pending", "success", "failed")
- `logs`: array of strings

---

## 5. Security & Authentication Flow

### 5.1 NextAuth & Session Management
The system uses **NextAuth.js** for authentication, configured in `src/app/api/auth/[...nextauth]/route.ts`:
- **Provider**: CredentialsProvider validates users using standard email and password input.
- **Password Hashing**: User passwords are encrypted using `bcryptjs` with 10 salt rounds during registration (`src/app/api/auth/signup/route.ts`).
- **Session Strategy**: Uses encrypted JWTs (JSON Web Tokens) with a maximum token age of 30 days.
- **Callbacks**: JWT and Session callback hooks attach the Mongoose user `id` and `image` metadata to the session, making user metadata accessible in both client and server pages.

### 5.2 Server-Side Serialization & Data Sanitization
- To prevent serialization errors when passing Mongoose document states from Server Components to Client Components, dynamic site routers perform serialization:
  ```ts
  const plainProjectData = JSON.parse(JSON.stringify(rawMongooseProject));
  ```
- Password hashes are marked as `select: false` in the schema definitions, ensuring they are excluded from Mongoose queries by default.
- Input keyword strings in the onboarding wizard are processed and split:
  ```ts
  const kwList = keywords.split(",").map(k => k.trim()).filter(Boolean);
  ```
  This ensures that only clean array strings are sent to the AI engines.

---

## 6. Integrations & Dynamic Engines

### 6.1 OpenAI and Ollama Connectivity
The AI compiler in `generator.ts` connects to model gateways:
1. **Ollama Integration**: Detects if a local server is running on `http://127.0.0.1:11434` by querying the `/api/tags` endpoint. If a model is available locally, it routes requests to Ollama.
2. **OpenAI Integration**: Falls back to the official OpenAI API (`gpt-4o-mini`) using the `OPENAI_API_KEY` defined in the environment.
3. **Procedural Fallback**: If no LLM endpoint responds, the system triggers a rules-based layout engine. This engine matches keywords (like `clothes`, `tyres`, or `mobiles`) to generate themed website layouts and content.

### 6.2 Next.js Project Export Pipeline
The export route at `src/app/api/projects/[projectId]/export/route.ts` generates complete, standalone Next.js code structures:
- Reads database sections, templates, and styles.
- Formulates a custom `package.json`, `tsconfig.json`, `postcss.config.mjs`, and Tailwind CSS stylesheets containing the generated brand color variables.
- Uses `JSZip` to compile pages, routing files, and rendering components into a single ZIP archive for download.

---

## 7. Performance & Error Architecture

### 7.1 Database Connection Pooling
In serverless Next.js API operations, MongoDB connections are cached using a global promise singleton to prevent connection leaks during hot reloads:
```ts
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}
```

### 7.2 Fault-Tolerant Generation Fallbacks
If the LLM connection fails or returns invalid JSON:
- The system catches the error and logs a traceback.
- It transitions to the procedural generator fallback, ensuring the user's project creation flow is not interrupted.
- Subdomain rendering checks database connections and serves mock assets if database records are unavailable.
