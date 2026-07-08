import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true });

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  color: text("color").notNull().default("#20eca2"),
  gradient: text("gradient").notNull().default("from-teal-500/20 to-cyan-500/10"),
  iconName: text("icon_name").notNull().default("Briefcase"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).omit({ id: true });
export const updatePortfolioProjectSchema = insertPortfolioProjectSchema.partial();

export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;
export type UpdatePortfolioProject = z.infer<typeof updatePortfolioProjectSchema>;

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull().default("Rocket"),
  isHot: boolean("is_hot").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export const updateServiceSchema = insertServiceSchema.partial();

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type UpdateService = z.infer<typeof updateServiceSchema>;

// ─── Form Builder tables ─────────────────────────────────────────────────────

export const formSections = pgTable("form_sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertFormSectionSchema = createInsertSchema(formSections).omit({ id: true });
export const updateFormSectionSchema = insertFormSectionSchema.partial();

export type FormSection = typeof formSections.$inferSelect;
export type InsertFormSection = z.infer<typeof insertFormSectionSchema>;
export type UpdateFormSection = z.infer<typeof updateFormSectionSchema>;

export const formQuestions = pgTable("form_questions", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull(),
  fieldKey: text("field_key").notNull(),
  type: text("type").notNull().default("text"),
  label: text("label").notNull(),
  placeholder: text("placeholder").default(""),
  isRequired: boolean("is_required").notNull().default(false),
  isHidden: boolean("is_hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  options: text("options").default("[]"),
});

export const insertFormQuestionSchema = createInsertSchema(formQuestions).omit({ id: true });
export const updateFormQuestionSchema = insertFormQuestionSchema.partial();

export type FormQuestion = typeof formQuestions.$inferSelect;
export type InsertFormQuestion = z.infer<typeof insertFormQuestionSchema>;
export type UpdateFormQuestion = z.infer<typeof updateFormQuestionSchema>;

// ─── Leads tables ────────────────────────────────────────────────────────────

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").notNull().default("pending"),
  assignedAgent: text("assigned_agent").default(""),
  businessName: text("business_name").default(""),
  ownerName: text("owner_name").default(""),
  businessCategory: text("business_category").default(""),
  email: text("email").default(""),
  phone: text("phone").default(""),
  whatsapp: text("whatsapp").default(""),
  country: text("country").default(""),
  agreedToContact: boolean("agreed_to_contact").default(false),
});

export type Lead = typeof leads.$inferSelect;

export const leadAnswers = pgTable("lead_answers", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  questionId: integer("question_id").notNull(),
  fieldKey: text("field_key").notNull(),
  answerText: text("answer_text").default(""),
});

export type LeadAnswer = typeof leadAnswers.$inferSelect;

export const leadFiles = pgTable("lead_files", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  questionId: integer("question_id").notNull(),
  fieldKey: text("field_key").notNull(),
  originalName: text("original_name").notNull(),
  storedPath: text("stored_path").notNull(),
  mimeType: text("mime_type").default(""),
  fileSize: integer("file_size").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export type LeadFile = typeof leadFiles.$inferSelect;

export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  note: text("note").notNull(),
  createdBy: text("created_by").default("Admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type LeadNote = typeof leadNotes.$inferSelect;
