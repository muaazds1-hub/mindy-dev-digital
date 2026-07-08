import {
  inquiries, portfolioProjects, services, formSections, formQuestions,
  leads, leadAnswers, leadFiles, leadNotes,
  type Inquiry, type InsertInquiry,
  type PortfolioProject, type InsertPortfolioProject, type UpdatePortfolioProject,
  type Service, type InsertService, type UpdateService,
  type FormSection, type InsertFormSection, type UpdateFormSection,
  type FormQuestion, type InsertFormQuestion, type UpdateFormQuestion,
  type Lead, type LeadAnswer, type LeadFile, type LeadNote,
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc, ilike, or, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getPortfolioProjects(): Promise<PortfolioProject[]>;
  createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject>;
  updatePortfolioProject(id: number, project: UpdatePortfolioProject): Promise<PortfolioProject | null>;
  deletePortfolioProject(id: number): Promise<boolean>;
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: UpdateService): Promise<Service | null>;
  deleteService(id: number): Promise<boolean>;
  // Form sections
  getFormSections(): Promise<FormSection[]>;
  createFormSection(section: InsertFormSection): Promise<FormSection>;
  updateFormSection(id: number, data: UpdateFormSection): Promise<FormSection | null>;
  deleteFormSection(id: number): Promise<boolean>;
  // Form questions
  getFormQuestions(sectionId?: number): Promise<FormQuestion[]>;
  getActiveFormWithQuestions(): Promise<{ section: FormSection; questions: FormQuestion[] }[]>;
  createFormQuestion(q: InsertFormQuestion): Promise<FormQuestion>;
  updateFormQuestion(id: number, data: UpdateFormQuestion): Promise<FormQuestion | null>;
  deleteFormQuestion(id: number): Promise<boolean>;
  // Leads
  createLead(data: { businessName: string; ownerName: string; businessCategory: string; email: string; phone: string; whatsapp: string; country: string; agreedToContact: boolean }): Promise<Lead>;
  getLeads(opts: { search?: string; status?: string; category?: string; country?: string; page?: number; limit?: number }): Promise<{ leads: Lead[]; total: number; stats: Record<string, number> }>;
  getLeadById(id: number): Promise<{ lead: Lead; answers: LeadAnswer[]; files: LeadFile[]; notes: LeadNote[] } | null>;
  updateLead(id: number, data: Partial<Pick<Lead, "status" | "assignedAgent">>): Promise<Lead | null>;
  deleteLead(id: number): Promise<boolean>;
  // Lead answers & files
  createLeadAnswers(answers: { leadId: number; questionId: number; fieldKey: string; answerText: string }[]): Promise<void>;
  createLeadFiles(files: { leadId: number; questionId: number; fieldKey: string; originalName: string; storedPath: string; mimeType: string; fileSize: number }[]): Promise<void>;
  // Lead notes
  addLeadNote(leadId: number, note: string, createdBy?: string): Promise<LeadNote>;
  getLeadNotes(leadId: number): Promise<LeadNote[]>;
}

export class DatabaseStorage implements IStorage {
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    return db.select().from(portfolioProjects).orderBy(asc(portfolioProjects.sortOrder), asc(portfolioProjects.id));
  }

  async createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject> {
    const [created] = await db.insert(portfolioProjects).values(project).returning();
    return created;
  }

  async updatePortfolioProject(id: number, project: UpdatePortfolioProject): Promise<PortfolioProject | null> {
    const [updated] = await db.update(portfolioProjects).set(project).where(eq(portfolioProjects.id, id)).returning();
    return updated ?? null;
  }

  async deletePortfolioProject(id: number): Promise<boolean> {
    const result = await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id)).returning();
    return result.length > 0;
  }

  async getServices(): Promise<Service[]> {
    return db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: number, service: UpdateService): Promise<Service | null> {
    const [updated] = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return updated ?? null;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id)).returning();
    return result.length > 0;
  }

  // ─── Form Sections ────────────────────────────────────────────────────────

  async getFormSections(): Promise<FormSection[]> {
    return db.select().from(formSections).orderBy(asc(formSections.sortOrder), asc(formSections.id));
  }

  async createFormSection(section: InsertFormSection): Promise<FormSection> {
    const [created] = await db.insert(formSections).values(section).returning();
    return created;
  }

  async updateFormSection(id: number, data: UpdateFormSection): Promise<FormSection | null> {
    const [updated] = await db.update(formSections).set(data).where(eq(formSections.id, id)).returning();
    return updated ?? null;
  }

  async deleteFormSection(id: number): Promise<boolean> {
    const result = await db.delete(formSections).where(eq(formSections.id, id)).returning();
    return result.length > 0;
  }

  // ─── Form Questions ───────────────────────────────────────────────────────

  async getFormQuestions(sectionId?: number): Promise<FormQuestion[]> {
    if (sectionId !== undefined) {
      return db.select().from(formQuestions).where(eq(formQuestions.sectionId, sectionId)).orderBy(asc(formQuestions.sortOrder), asc(formQuestions.id));
    }
    return db.select().from(formQuestions).orderBy(asc(formQuestions.sectionId), asc(formQuestions.sortOrder));
  }

  async getActiveFormWithQuestions(): Promise<{ section: FormSection; questions: FormQuestion[] }[]> {
    const sections = await db.select().from(formSections).where(eq(formSections.isActive, true)).orderBy(asc(formSections.sortOrder));
    const allQuestions = await db.select().from(formQuestions).where(eq(formQuestions.isHidden, false)).orderBy(asc(formQuestions.sortOrder));
    return sections.map((section) => ({
      section,
      questions: allQuestions.filter((q) => q.sectionId === section.id),
    }));
  }

  async createFormQuestion(q: InsertFormQuestion): Promise<FormQuestion> {
    const [created] = await db.insert(formQuestions).values(q).returning();
    return created;
  }

  async updateFormQuestion(id: number, data: UpdateFormQuestion): Promise<FormQuestion | null> {
    const [updated] = await db.update(formQuestions).set(data).where(eq(formQuestions.id, id)).returning();
    return updated ?? null;
  }

  async deleteFormQuestion(id: number): Promise<boolean> {
    const result = await db.delete(formQuestions).where(eq(formQuestions.id, id)).returning();
    return result.length > 0;
  }

  // ─── Leads ────────────────────────────────────────────────────────────────

  async createLead(data: { businessName: string; ownerName: string; businessCategory: string; email: string; phone: string; whatsapp: string; country: string; agreedToContact: boolean }): Promise<Lead> {
    const [lead] = await db.insert(leads).values({
      businessName: data.businessName,
      ownerName: data.ownerName,
      businessCategory: data.businessCategory,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      country: data.country,
      agreedToContact: data.agreedToContact,
      status: "pending",
    }).returning();
    return lead;
  }

  async getLeads(opts: { search?: string; status?: string; category?: string; country?: string; page?: number; limit?: number }) {
    const { search, status, category, country, page = 1, limit = 20 } = opts;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      conditions.push(or(
        ilike(leads.businessName, `%${search}%`),
        ilike(leads.ownerName, `%${search}%`),
        ilike(leads.email, `%${search}%`),
        ilike(leads.phone, `%${search}%`),
      )!);
    }
    if (status) conditions.push(eq(leads.status, status));
    if (category) conditions.push(eq(leads.businessCategory, category));
    if (country) conditions.push(ilike(leads.country, `%${country}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [allLeads, totalResult, allForStats] = await Promise.all([
      where
        ? db.select().from(leads).where(where).orderBy(desc(leads.submittedAt)).limit(limit).offset(offset)
        : db.select().from(leads).orderBy(desc(leads.submittedAt)).limit(limit).offset(offset),
      where
        ? db.select({ count: sql<number>`count(*)` }).from(leads).where(where)
        : db.select({ count: sql<number>`count(*)` }).from(leads),
      db.select({ status: leads.status, submittedAt: leads.submittedAt }).from(leads),
    ]);

    const total = Number(totalResult[0].count);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: Record<string, number> = {
      total: allForStats.length,
      today: allForStats.filter(l => l.submittedAt && l.submittedAt >= todayStart).length,
      thisWeek: allForStats.filter(l => l.submittedAt && l.submittedAt >= weekStart).length,
      thisMonth: allForStats.filter(l => l.submittedAt && l.submittedAt >= monthStart).length,
      pending: allForStats.filter(l => l.status === "pending").length,
      contacted: allForStats.filter(l => l.status === "contacted").length,
      completed: allForStats.filter(l => l.status === "completed").length,
      rejected: allForStats.filter(l => l.status === "rejected").length,
    };

    return { leads: allLeads, total, stats };
  }

  async getLeadById(id: number) {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    if (!lead) return null;
    const [answers, files, notes] = await Promise.all([
      db.select().from(leadAnswers).where(eq(leadAnswers.leadId, id)).orderBy(asc(leadAnswers.id)),
      db.select().from(leadFiles).where(eq(leadFiles.leadId, id)).orderBy(asc(leadFiles.id)),
      db.select().from(leadNotes).where(eq(leadNotes.leadId, id)).orderBy(desc(leadNotes.createdAt)),
    ]);
    return { lead, answers, files, notes };
  }

  async updateLead(id: number, data: Partial<Pick<Lead, "status" | "assignedAgent">>): Promise<Lead | null> {
    const [updated] = await db.update(leads).set(data).where(eq(leads.id, id)).returning();
    return updated ?? null;
  }

  async deleteLead(id: number): Promise<boolean> {
    await db.delete(leadAnswers).where(eq(leadAnswers.leadId, id));
    await db.delete(leadFiles).where(eq(leadFiles.leadId, id));
    await db.delete(leadNotes).where(eq(leadNotes.leadId, id));
    const result = await db.delete(leads).where(eq(leads.id, id)).returning();
    return result.length > 0;
  }

  async createLeadAnswers(answers: { leadId: number; questionId: number; fieldKey: string; answerText: string }[]): Promise<void> {
    if (answers.length === 0) return;
    await db.insert(leadAnswers).values(answers);
  }

  async createLeadFiles(files: { leadId: number; questionId: number; fieldKey: string; originalName: string; storedPath: string; mimeType: string; fileSize: number }[]): Promise<void> {
    if (files.length === 0) return;
    await db.insert(leadFiles).values(files);
  }

  async addLeadNote(leadId: number, note: string, createdBy = "Admin"): Promise<LeadNote> {
    const [created] = await db.insert(leadNotes).values({ leadId, note, createdBy }).returning();
    return created;
  }

  async getLeadNotes(leadId: number): Promise<LeadNote[]> {
    return db.select().from(leadNotes).where(eq(leadNotes.leadId, leadId)).orderBy(desc(leadNotes.createdAt));
  }
}

export const storage = new DatabaseStorage();
