---
name: Mindy Dev project
description: Full-stack digital agency site — React+Vite frontend, Express backend, PostgreSQL+Drizzle, admin panel, leads form
---

# Mindy Dev — Key Architecture Decisions

**Why:** Preserve non-obvious decisions for future sessions.

## Admin URL
Secret: `/mindydev-admin-x7k2` — must NEVER appear in any navigation link. Credentials: muaaz657 / 0315muaaz15 (hardcoded in routes.ts, in-memory sessions).

## Key Routes
- Public form: `GET /api/form` → returns active sections + visible questions
- Lead submit: `POST /api/leads` → multipart/form-data (multer), `answers` field is JSON string
- CSV export: `GET /api/admin/leads/export/csv` → MUST be before `GET /api/admin/leads/:id` in routes.ts
- File download: `GET /api/admin/leads/:leadId/files/:fileId/download`

## File Uploads
- multer installed, stores files in `./uploads/leads/` (relative to project root)
- Directory auto-created in routes.ts startup using `__dirname` + `path.resolve`

## Form Questions
- Options stored as JSON string in `options` column: `["Option A","Option B"]`
- Parse on frontend: `JSON.parse(q.options || "[]")`
- `useRef` for file input must be at TOP of `QuestionInput` component — not inside switch/case (hooks violation)

## Brand Colors
- Background: #1f58f1 (blue)
- Accent: #20eca2 (green)
- Text: #ffffff
- Dark admin bg: #0f1728

## WhatsApp CTA
- URL: `https://wa.me/923289789178?text=...`
- All CTA buttons link here

## Admin Tabs
- `"portfolio" | "services" | "leads" | "formbuilder"`
- AdminLeads and AdminFormBuilder are separate files imported into Admin.tsx

## Seed
- Form seeded with 5 sections + 33 questions in `server/seed.ts` → `seedFormIfEmpty()`
- Called in `server/index.ts` before `registerRoutes`
