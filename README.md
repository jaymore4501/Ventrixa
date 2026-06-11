# Ventrixa — AI Website Operating System

<div align="center">
  <img src="/public/Logo.png" alt="Ventrixa Logo" width="120" height="120" style="border-radius: 20%;" />
  <p><strong>Bespoke, professional websites generated, customized, and deployed instantly via AI.</strong></p>

  [![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](package.json)
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![React Version](https://img.shields.io/badge/React-19-blue.svg)](package.json)
  [![Next.js Version](https://img.shields.io/badge/Next.js-16.2.7-black.svg)](package.json)
  [![Tailwind v4](https://img.shields.io/badge/Tailwind-v4.0.0-38bdf8.svg)](package.json)
</div>

---

## 📋 Description

**Ventrixa** is an AI-powered Website Operating System that simplifies website creation. Unlike traditional drag-and-drop builders that require manual layout setup, or generic AI code generators that produce hard-to-maintain code, Ventrixa uses a **data-driven blueprint model**. 

By compiling user-provided brand voices, colors, and industry keywords into structured JSON configurations, Ventrixa creates professional, responsive, and SEO-optimized website pages instantly. It includes a visual live preview workspace editor, automated styling theme generators (both light and dark modes), and instant edge deployment simulations to subdomains.

---

## ✨ Features

- 🪄 **AI Website Generation Wizard**: Builds multi-page layouts from natural language description prompts, industries, and target audiences.
- 🎨 **Coordinating HSL Color Systems**: Automatically generates harmonious background, card, primary, secondary, and accent color relationships.
- 🛠️ **Visual live preview editor**: Allows drag-and-drop component positioning, text updates, button configurations, and custom styling updates in real time.
- 🚀 **Dynamic Section Rendering Engine**: React components dynamically load layout nodes based on structured JSON configurations, avoiding raw HTML injection.
- 📁 **Instant Deployment & Exporting**: Bundles generated static structures, assets, styling variables, and Next.js routes into a downloadable zip file or routes preview.
- 🌐 **Ollama & OpenAI Integrations**: Seamlessly fallbacks to local LLMs (Ollama) or remote models (OpenAI `gpt-4o-mini`) for fully customized generation.
- 📈 **SEO & Metadata Auto-Optimization**: Tailors titles, descriptions, and page keywords to the selected domain name and target business profile.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.2.7](https://nextjs.org/) (App Router & Turbopack)
- **UI & Components**: [React 19](https://react.dev/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [ReactBits UI System](https://reactbits.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & CSS Variables
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)

### Backend & Database
- **API Runtime**: Next.js Server Actions & Edge API Routes
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Mongoose ODM)
- **Mock Database Fallback**: File-system JSON storage (`src/data/mockDb.json`) for seamless local runs.
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/) (Credentials and JWT strategy)
- **AI Engine**: [OpenAI API Node SDK](https://github.com/openai/openai-node)

---

## 📁 Project Structure

```
ventrixa/
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── LICENSE
├── README.md
├── SystemOverview.md
├── SystemPrompt.md
├── ProjectDeployment.md
├── public/
│   ├── Favicon.png
│   ├── Full logo.png
│   ├── Logo.png
│   └── (SVGs & assets)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── signup/
│   │   │   │       └── route.ts
│   │   │   ├── deploy/
│   │   │   │   └── route.ts
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   ├── ollama/
│   │   │   │   └── models/
│   │   │   │       └── route.ts
│   │   │   ├── pages/
│   │   │   │   └── [pageId]/
│   │   │   │       └── sections/
│   │   │   │           └── route.ts
│   │   │   ├── projects/
│   │   │   │   ├── [projectId]/
│   │   │   │   │   ├── export/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── pages/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── user/
│   │   │       └── profile/
│   │   │           └── route.ts
│   │   ├── dashboard/
│   │   │   ├── wizard/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── editor/
│   │   │   └── [projectId]/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── sites/
│   │   │   └── [subdomain]/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── reactbits/
│   │   │   ├── BorderGlow.css
│   │   │   ├── BorderGlow.tsx
│   │   │   ├── ChromaGrid.tsx
│   │   │   ├── GradualBlur.tsx
│   │   │   ├── LightRays.tsx
│   │   │   ├── LogoLoop.tsx
│   │   │   ├── Plasma.css
│   │   │   ├── Plasma.tsx
│   │   │   ├── ScrollReveal.tsx
│   │   │   ├── ScrollVelocity.tsx
│   │   │   ├── ShinyText.tsx
│   │   │   └── SplitText.tsx
│   │   ├── Providers.tsx
│   │   └── SectionRenderer.tsx
│   ├── data/
│   │   ├── previews/
│   │   └── mockDb.json
│   ├── lib/
│   │   ├── ai/
│   │   │   └── generator.ts
│   │   ├── db.ts
│   │   ├── mongodb.ts
│   │   ├── styles.ts
│   │   └── templates.ts
│   └── models/
│       └── schemas.ts
```

---

## 🏛️ Architecture Summary

```
                       ┌────────────────────────────────────────────────────────┐
                       │                       Frontend                         │
                       │             (Next.js App / Visual Editor)              │
                       └──────────────────────────┬─────────────────────────────┘
                                                  │ (NextAuth HTTP API)
                                                  ▼
                       ┌────────────────────────────────────────────────────────┐
                       │                   API Route Handlers                   │
                       │           (Authentication, Generator API)              │
                       └──────────────────────────┬─────────────────────────────┘
                                                  │
                   ┌──────────────────────────────┴─────────────────────────────┐
                   ▼                                                            ▼
    ┌─────────────────────────────┐                             ┌─────────────────────────────┐
    │       AI Engine Layer       │                             │      Data Access Layer      │
    │  (OpenAI SDK / Ollama client│                             │  (db.ts Database Switcher)  │
    └─────────────────────────────┘                             └──────────────┬──────────────┘
                                                                               │
                                                   ┌───────────────────────────┴───────────────────────────┐
                                                   ▼                                                       ▼
                                    ┌─────────────────────────────┐                         ┌─────────────────────────────┐
                                    │    MongoDB Atlas (Prod)     │                         │   File Mock DB (Local Dev)  │
                                    │      (models/schemas.ts)    │                         │    (src/data/mockDb.json)   │
                                    └─────────────────────────────┘                         └─────────────────────────────┘
```

The system operates on an **abstracted database provider framework**. When `MONGODB_URI` is present in the environment variables, the system connects directly to a live **MongoDB Atlas** cluster via Mongoose. If the environment variable is absent or empty, the application seamlessly falls back to a **local filesystem mock database JSON file** (`src/data/mockDb.json`). This ensures that the application starts, generates project mockups, edits pages, and exports source code packages immediately on any computer, container, or CI environment without setup.

---

## 📸 Screenshots

*To be added following local browser rendering walkthroughs.*

---

## 🚀 Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v20.x or higher
- [npm](https://www.npmjs.com/) v10.x or higher
- (Optional) [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas)
- (Optional) [Ollama API running locally](https://ollama.com/) or [OpenAI API key](https://platform.openai.com/)

### Step-by-Step Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ventrixa.git
   cd ventrixa
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory and copy the contents from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Modify the variables as detailed in the [Environment Variables](#environment-variables) section.

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open your browser to [http://localhost:3000](http://localhost:3000) to view the Ventrixa panel.

---

## 🎯 Usage Guide

### 1. Account Onboarding & Login
- Open [http://localhost:3000](http://localhost:3000) and click **Sign In** or **Build site for free**.
- Create an account using credentials or click tab panels to sign in.

### 2. Website Generation Wizard
- Click **New Project** to start the onboarding wizard.
- **Step 1 (Information)**: Enter the website name, description, industry, business type, and target audience. 
- **Step 2 (Keywords)**: Input keywords related to the niche (e.g. `fashion`, `clothes`, `luxury`). Press `Enter` to lock keywords.
- **Step 3 (Branding)**: Select AI-suggested or manual color palettes, custom typography, brand voice tone, and regenerate or accept logo layouts.
- **Step 4 (Structure)**: Choose required page routes (e.g. `Home`, `About`, `Services`, `Pricing`).
- **Step 5 (Compile)**: Confirm and watch the compile pipeline load styling coordinates, retrieve images, write SEO metatags, and output the website blueprint.

### 3. Live Preview & Visual Editing
- Inside the workspace dashboard, choose your website project to launch the visual editor.
- Click any header text, feature title, pricing item, or layout block to modify properties.
- Drag-and-drop sections or click buttons in the side inspector panel to re-order, duplicate, or delete sections.

### 4. Deploying & Exporting Source Code
- Click **Publish** to make the site live instantly at a simulated subdomain (`subdomain.ventrixa.site`).
- Click **Export Source Code** to download a production-ready Next.js zip file pre-packaged with all routes, page configurations, dynamic component renderers, CSS styling variables, and assets.

---

## ⚙️ Configuration

The project configures visual properties, typography limits, and component variants through the configuration files:
- `next.config.ts`: Enables Turbopack development optimizations and handles image domains mappings.
- `postcss.config.mjs`: Integrates Tailwind v4's CSS parser.
- `src/lib/styles.ts`: Defines curated light/dark color themes and HSL palette-generation algorithms.
- `src/lib/templates.ts`: Stores prebuilt JSON structure schemas for standard template layouts.

---

## 🌐 Environment Variables

| Variable | Description | Default / Example | Required |
|----------|-------------|-------------------|----------|
| `MONGODB_URI` | MongoDB Atlas cluster connection string. If missing, runs in File Mock DB mode. | `mongodb+srv://...` | No (dev/mock) / Yes (prod) |
| `NEXTAUTH_SECRET` | Secret key used to encrypt user session cookies. | `ventrixa-secret-key-dev-only` | Yes (prod) |
| `NEXTAUTH_URL` | Canonical URL of the application. | `http://localhost:3000` | Yes (prod) |
| `OPENAI_API_KEY` | OpenAI API credentials for remote site generation. | `sk-proj-xxxx...` | No (falls back to local LLM or procedural) |
| `OPENAI_API_BASE_URL` | Endpoint base URL for Ollama local API or custom gateways. | `http://127.0.0.1:11434/v1` | No |
| `AI_MODEL` | Default model used for text generation. | `gpt-4o-mini` (or `llama3` for Ollama) | No |

---

## 🔌 API Overview

### 🔐 Authentication API
- `POST /api/auth/signup`: Registers credentials users.
- `POST /api/auth/signin` (NextAuth): Issues session tokens.

### 🎨 Blueprint Generation API
- `POST /api/generate`: Receives project descriptors, checks for LLM models (OpenAI or Ollama), and generates the page structures JSON.

### 📁 Project Management API
- `GET /api/projects`: Lists current user projects.
- `POST /api/projects`: Saves a new project blueprint.
- `GET /api/projects/[projectId]`: Retrieves details of a specific project.
- `PUT /api/projects/[projectId]`: Updates project metadata or color configuration.
- `DELETE /api/projects/[projectId]`: Deletes project files.
- `GET /api/projects/[projectId]/export`: Bundles the pages, components, and css into a zipped file response.

### 📃 Page and Section APIs
- `GET /api/projects/[projectId]/pages`: Lists site pages.
- `POST /api/pages/[pageId]/sections`: Saves updated visual layout sections.

---

## 🤝 Contributing Guidelines

1. **Create an Issue**: Document the bug report or requested feature enhancements.
2. **Branch Naming**: Use clean, descriptive branch naming conventions:
   ```bash
   git checkout -b feature/color-palette-hashing
   ```
3. **Lint & Format**: Ensure code compiles without warnings and meets standard strict TypeScript types.
4. **Pull Request (PR)**: Target the `main` branch. Provide detailed summaries of components modified, visual screenshots, and compilation test validations.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
