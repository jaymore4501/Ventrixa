# Architecture Overview

Ventrixa is built with **Next.js 16 (App Router)**, **TypeScript**, and **MongoDB** for data persistence. The main components are:

- **Frontend** – React components under `src/app` using the new server/client component model. UI features a modern glass‑morphism style and dynamic animations.
- **API Layer** – Route handlers in `src/app/api/**` expose REST‑style endpoints via Next.js API Routes. Authentication is handled by **NextAuth.js** with JWT sessions.
- **Database** – A singleton MongoDB connection (`src/lib/mongodb.ts`). During development a mock JSON DB (`src/data/mockDb.json`) can be used.
- **Background Jobs** – Queue‑based tasks (e.g., project export) run using **Node worker threads** and are exposed via `/api/deploy`.
- **CI/CD** – GitHub Actions workflow runs on each push to `main`, installing dependencies, building, and testing.

### Data Flow
1. Client request → Next.js API Route → Auth middleware (if required) → Service layer → MongoDB.
2. Responses are serialized to JSON and sent back to the client.

### Extensibility
- New features can be added as additional API routes under `src/app/api`.
- UI components live in `src/components` and can be reused across pages.

---
*This file is intentionally concise; more detailed diagrams can be added later.*
