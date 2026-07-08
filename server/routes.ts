import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import {
  insertPortfolioProjectSchema, updatePortfolioProjectSchema,
  insertServiceSchema, updateServiceSchema,
  insertFormSectionSchema, updateFormSectionSchema,
  insertFormQuestionSchema, updateFormQuestionSchema,
} from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "uploads", "leads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname) || "";
      cb(null, `${unique}${ext}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const ADMIN_USERNAME = "muaaz657";
const ADMIN_PASSWORD = "0315muaaz15";
const activeSessions = new Set<string>();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "").trim();
  if (!token || !activeSessions.has(token)) return res.status(401).json({ message: "Unauthorized" });
  next();
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  // ─── Inquiry ─────────────────────────────────────────────────────────────
  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      res.status(201).json(await storage.createInquiry(input));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join(".") });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ─── Admin auth ───────────────────────────────────────────────────────────
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body ?? {};
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = crypto.randomBytes(32).toString("hex");
      activeSessions.add(token);
      return res.json({ token });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/admin/logout", requireAdmin, (req, res) => {
    const token = (req.headers.authorization ?? "").replace("Bearer ", "").trim();
    activeSessions.delete(token);
    res.json({ ok: true });
  });

  app.get("/api/admin/check", requireAdmin, (_req, res) => res.json({ ok: true }));

  // ─── Portfolio (public + admin) ───────────────────────────────────────────
  app.get("/api/portfolio", async (_req, res) => {
    try { res.json(await storage.getPortfolioProjects()); } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  app.post("/api/admin/portfolio", requireAdmin, async (req, res) => {
    try {
      const input = insertPortfolioProjectSchema.parse(req.body);
      res.status(201).json(await storage.createPortfolioProject(input));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/portfolio/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updatePortfolioProject(Number(req.params.id), updatePortfolioProjectSchema.parse(req.body));
      if (!updated) return res.status(404).json({ message: "Project not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/portfolio/:id", requireAdmin, async (req, res) => {
    try {
      if (!await storage.deletePortfolioProject(Number(req.params.id))) return res.status(404).json({ message: "Project not found" });
      res.json({ ok: true });
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Services (public + admin) ────────────────────────────────────────────
  app.get("/api/services", async (_req, res) => {
    try { res.json(await storage.getServices()); } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  app.post("/api/admin/services", requireAdmin, async (req, res) => {
    try {
      res.status(201).json(await storage.createService(insertServiceSchema.parse(req.body)));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/services/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updateService(Number(req.params.id), updateServiceSchema.parse(req.body));
      if (!updated) return res.status(404).json({ message: "Service not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/services/:id", requireAdmin, async (req, res) => {
    try {
      if (!await storage.deleteService(Number(req.params.id))) return res.status(404).json({ message: "Service not found" });
      res.json({ ok: true });
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Public form endpoint ─────────────────────────────────────────────────
  app.get("/api/form", async (_req, res) => {
    try {
      const sections = await storage.getActiveFormWithQuestions();
      res.json({ sections });
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Public lead submission ───────────────────────────────────────────────
  app.post("/api/leads", upload.any(), async (req: Request & { files?: Express.Multer.File[] }, res) => {
    try {
      const rawAnswers = req.body.answers;
      const agreedToContact = req.body.agreedToContact === "true";

      let answers: Record<string, string | string[]> = {};
      if (rawAnswers) {
        try { answers = JSON.parse(rawAnswers); } catch { answers = {}; }
      }

      const get = (key: string) => {
        const v = answers[key];
        return Array.isArray(v) ? v.join(", ") : (v || "");
      };

      const lead = await storage.createLead({
        businessName: get("business_name"),
        ownerName: get("full_name") || get("owner_name"),
        businessCategory: get("business_category"),
        email: get("business_email"),
        phone: get("phone_number"),
        whatsapp: get("whatsapp_number"),
        country: get("country"),
        agreedToContact,
      });

      // Get all questions to map fieldKey → id
      const allQuestions = await storage.getFormQuestions();
      const questionMap = new Map(allQuestions.map(q => [q.fieldKey, q.id]));

      // Save answers
      const answerRows = Object.entries(answers).map(([fieldKey, val]) => ({
        leadId: lead.id,
        questionId: questionMap.get(fieldKey) || 0,
        fieldKey,
        answerText: Array.isArray(val) ? val.join(", ") : String(val || ""),
      }));
      await storage.createLeadAnswers(answerRows);

      // Save files
      if (req.files && req.files.length > 0) {
        const fileRows = req.files.map((f) => ({
          leadId: lead.id,
          questionId: questionMap.get(f.fieldname) || 0,
          fieldKey: f.fieldname,
          originalName: f.originalname,
          storedPath: f.path,
          mimeType: f.mimetype,
          fileSize: f.size,
        }));
        await storage.createLeadFiles(fileRows);
      }

      res.status(201).json({ ok: true, leadId: lead.id });
    } catch (err) {
      console.error("Lead submission error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ─── Admin: leads CSV export (must be before /:id routes) ─────────────────
  app.get("/api/admin/leads/export/csv", requireAdmin, async (_req, res) => {
    try {
      const { leads } = await storage.getLeads({ limit: 10000 });
      const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const headers = ["ID","Business Name","Owner Name","Category","Email","Phone","WhatsApp","Country","Status","Submitted At"].join(",");
      const rows = leads.map(l => [
        l.id, l.businessName, l.ownerName, l.businessCategory,
        l.email, l.phone, l.whatsapp, l.country, l.status,
        l.submittedAt?.toISOString() ?? "",
      ].map(escape).join(","));
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
      res.send([headers, ...rows].join("\n"));
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Admin: leads list ────────────────────────────────────────────────────
  app.get("/api/admin/leads", requireAdmin, async (req, res) => {
    try {
      const { search, status, category, country, page } = req.query as Record<string, string>;
      const result = await storage.getLeads({
        search: search || undefined,
        status: status || undefined,
        category: category || undefined,
        country: country || undefined,
        page: page ? Number(page) : 1,
      });
      res.json(result);
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Admin: lead detail ───────────────────────────────────────────────────
  app.get("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    try {
      const detail = await storage.getLeadById(Number(req.params.id));
      if (!detail) return res.status(404).json({ message: "Lead not found" });
      res.json(detail);
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Admin: update lead ───────────────────────────────────────────────────
  app.patch("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    try {
      const { status, assignedAgent } = req.body;
      const updated = await storage.updateLead(Number(req.params.id), { status, assignedAgent });
      if (!updated) return res.status(404).json({ message: "Lead not found" });
      res.json(updated);
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Admin: delete lead ───────────────────────────────────────────────────
  app.delete("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    try {
      if (!await storage.deleteLead(Number(req.params.id))) return res.status(404).json({ message: "Lead not found" });
      res.json({ ok: true });
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Admin: lead notes ────────────────────────────────────────────────────
  app.post("/api/admin/leads/:id/notes", requireAdmin, async (req, res) => {
    try {
      const { note } = req.body;
      if (!note?.trim()) return res.status(400).json({ message: "Note is required" });
      const created = await storage.addLeadNote(Number(req.params.id), note.trim());
      res.status(201).json(created);
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Admin: file download ─────────────────────────────────────────────────
  app.get("/api/admin/leads/:leadId/files/:fileId/download", requireAdmin, async (req, res) => {
    try {
      const detail = await storage.getLeadById(Number(req.params.leadId));
      if (!detail) return res.status(404).json({ message: "Lead not found" });
      const file = detail.files.find(f => f.id === Number(req.params.fileId));
      if (!file) return res.status(404).json({ message: "File not found" });
      if (!fs.existsSync(file.storedPath)) return res.status(404).json({ message: "File not found on disk" });
      res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
      res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
      fs.createReadStream(file.storedPath).pipe(res);
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Admin: form sections ─────────────────────────────────────────────────
  app.get("/api/admin/form-sections", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getFormSections()); } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  app.post("/api/admin/form-sections", requireAdmin, async (req, res) => {
    try {
      const input = insertFormSectionSchema.parse(req.body);
      res.status(201).json(await storage.createFormSection(input));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/form-sections/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updateFormSection(Number(req.params.id), updateFormSectionSchema.parse(req.body));
      if (!updated) return res.status(404).json({ message: "Section not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/form-sections/:id", requireAdmin, async (req, res) => {
    try {
      if (!await storage.deleteFormSection(Number(req.params.id))) return res.status(404).json({ message: "Section not found" });
      res.json({ ok: true });
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  // ─── Admin: form questions ────────────────────────────────────────────────
  app.get("/api/admin/form-questions", requireAdmin, async (req, res) => {
    try {
      const sectionId = req.query.sectionId ? Number(req.query.sectionId) : undefined;
      res.json(await storage.getFormQuestions(sectionId));
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  app.post("/api/admin/form-questions", requireAdmin, async (req, res) => {
    try {
      const input = insertFormQuestionSchema.parse(req.body);
      res.status(201).json(await storage.createFormQuestion(input));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/form-questions/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updateFormQuestion(Number(req.params.id), updateFormQuestionSchema.parse(req.body));
      if (!updated) return res.status(404).json({ message: "Question not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/form-questions/:id", requireAdmin, async (req, res) => {
    try {
      if (!await storage.deleteFormQuestion(Number(req.params.id))) return res.status(404).json({ message: "Question not found" });
      res.json({ ok: true });
    } catch { res.status(500).json({ message: "Internal server error" }); }
  });

  return httpServer;
}
