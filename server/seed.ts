import { db } from "./db";
import { portfolioProjects, services, formSections, formQuestions } from "@shared/schema";
import { count } from "drizzle-orm";

const initialProjects = [
  { title: "School & Academy Website", category: "Education", description: "Modern responsive website designed for educational institutions to attract students and parents.", url: "https://calm-liger-7c30c7.netlify.app/", color: "#6c63ff", gradient: "from-purple-500/20 to-indigo-500/10", iconName: "GraduationCap", sortOrder: 1 },
  { title: "Doctor & Dental Clinic", category: "Medical", description: "Professional medical website built to increase patient appointments and build trust.", url: "https://ubiquitous-narwhal-7c07d9.netlify.app/", color: "#20eca2", gradient: "from-teal-500/20 to-cyan-500/10", iconName: "Stethoscope", sortOrder: 2 },
  { title: "Gym & Fitness Website", category: "Fitness", description: "High-energy fitness website designed to convert visitors into gym members.", url: "https://heroic-souffle-97cee4.netlify.app/", color: "#f59e0b", gradient: "from-amber-500/20 to-orange-500/10", iconName: "Dumbbell", sortOrder: 3 },
  { title: "Restaurant / Grill Website", category: "Food", description: "Mouth-watering restaurant website with online menu and reservation system.", url: "https://dreamy-truffle-e34231.netlify.app/", color: "#ef4444", gradient: "from-red-500/20 to-rose-500/10", iconName: "Utensils", sortOrder: 4 },
  { title: "Andi Services LLC", category: "Business", description: "Professional business services website built to generate leads and establish credibility.", url: "https://andiservicesllc.org/", color: "#3b82f6", gradient: "from-blue-500/20 to-sky-500/10", iconName: "Briefcase", sortOrder: 5 },
];

const initialServices = [
  { title: "Social Media Marketing", description: "Build brand awareness and engage your audience effectively.", iconName: "Target", isHot: false, sortOrder: 1 },
  { title: "Marketing Strategy", description: "Data-driven plans tailored to achieve your business goals.", iconName: "TrendingUp", isHot: false, sortOrder: 2 },
  { title: "Content Writing", description: "Compelling copy that converts visitors into loyal customers.", iconName: "PenTool", isHot: false, sortOrder: 3 },
  { title: "Graphic Design", description: "Stunning visuals that communicate your brand's unique identity.", iconName: "Layout", isHot: false, sortOrder: 4 },
  { title: "SMM Panel Services", description: "Boost your social metrics quickly with our reliable network.", iconName: "Rocket", isHot: false, sortOrder: 5 },
  { title: "Website Development", description: "High-performance, modern websites designed to convert visitors into paying customers.", iconName: "Code", isHot: true, sortOrder: 6 },
];

const initialSections = [
  { title: "Business Information", description: "Tell us about your business", sortOrder: 1, isActive: true },
  { title: "Contact Information", description: "How can we reach you?", sortOrder: 2, isActive: true },
  { title: "Business Goals", description: "What do you want to achieve?", sortOrder: 3, isActive: true },
  { title: "Social Media", description: "Your online presence", sortOrder: 4, isActive: true },
  { title: "Project Requirements", description: "What pages and features do you need?", sortOrder: 5, isActive: true },
];

const businessCategoryOptions = JSON.stringify(["Restaurant","Gym","Medical","Dental","School","College","Real Estate","Construction","E-commerce","Clothing","Beauty Salon","Spa","Travel Agency","Marketing Agency","Law Firm","Accounting","Photography","Event Planner","Furniture","Electronics","Automotive","Manufacturing","NGO","Software Company","Other"]);

export async function seedPortfolioIfEmpty() {
  const [{ value }] = await db.select({ value: count() }).from(portfolioProjects);
  if (value === 0) {
    await db.insert(portfolioProjects).values(initialProjects);
    console.log("Seeded initial portfolio projects.");
  }
}

export async function seedServicesIfEmpty() {
  const [{ value }] = await db.select({ value: count() }).from(services);
  if (value === 0) {
    await db.insert(services).values(initialServices);
    console.log("Seeded initial services.");
  }
}

export async function seedFormIfEmpty() {
  const [{ value }] = await db.select({ value: count() }).from(formSections);
  if (value !== 0) return;

  const inserted = await db.insert(formSections).values(initialSections).returning();
  const s1 = inserted[0].id;
  const s2 = inserted[1].id;
  const s3 = inserted[2].id;
  const s4 = inserted[3].id;
  const s5 = inserted[4].id;

  const questions = [
    // Section 1 — Business Information
    { sectionId: s1, fieldKey: "business_name", type: "text", label: "Business Name", placeholder: "Enter your business name", isRequired: true, isHidden: false, sortOrder: 1, options: "[]" },
    { sectionId: s1, fieldKey: "owner_name", type: "text", label: "Owner Name", placeholder: "Your full name", isRequired: true, isHidden: false, sortOrder: 2, options: "[]" },
    { sectionId: s1, fieldKey: "business_category", type: "dropdown", label: "Business Category", placeholder: "Select a category", isRequired: true, isHidden: false, sortOrder: 3, options: businessCategoryOptions },
    { sectionId: s1, fieldKey: "business_description", type: "textarea", label: "Business Description", placeholder: "Briefly describe what your business does...", isRequired: false, isHidden: false, sortOrder: 4, options: "[]" },
    { sectionId: s1, fieldKey: "years_in_business", type: "text", label: "Years in Business", placeholder: "e.g. 3 years", isRequired: false, isHidden: false, sortOrder: 5, options: "[]" },
    { sectionId: s1, fieldKey: "has_website", type: "radio", label: "Do you already have a website?", placeholder: "", isRequired: false, isHidden: false, sortOrder: 6, options: JSON.stringify(["Yes","No"]) },
    { sectionId: s1, fieldKey: "website_url", type: "text", label: "Website URL (if yes)", placeholder: "https://yoursite.com", isRequired: false, isHidden: false, sortOrder: 7, options: "[]" },
    { sectionId: s1, fieldKey: "business_address", type: "text", label: "Business Address", placeholder: "Street address", isRequired: false, isHidden: false, sortOrder: 8, options: "[]" },
    { sectionId: s1, fieldKey: "city", type: "text", label: "City", placeholder: "Your city", isRequired: false, isHidden: false, sortOrder: 9, options: "[]" },
    { sectionId: s1, fieldKey: "country", type: "text", label: "Country", placeholder: "Your country", isRequired: false, isHidden: false, sortOrder: 10, options: "[]" },
    // Section 2 — Contact Information
    { sectionId: s2, fieldKey: "full_name", type: "text", label: "Full Name", placeholder: "Your full name", isRequired: true, isHidden: false, sortOrder: 1, options: "[]" },
    { sectionId: s2, fieldKey: "phone_number", type: "phone", label: "Phone Number", placeholder: "+92 300 0000000", isRequired: true, isHidden: false, sortOrder: 2, options: "[]" },
    { sectionId: s2, fieldKey: "whatsapp_number", type: "phone", label: "WhatsApp Number", placeholder: "+92 300 0000000", isRequired: false, isHidden: false, sortOrder: 3, options: "[]" },
    { sectionId: s2, fieldKey: "business_email", type: "email", label: "Business Email", placeholder: "you@yourbusiness.com", isRequired: true, isHidden: false, sortOrder: 4, options: "[]" },
    { sectionId: s2, fieldKey: "preferred_contact", type: "radio", label: "Preferred Contact Method", placeholder: "", isRequired: false, isHidden: false, sortOrder: 5, options: JSON.stringify(["Email","WhatsApp","Phone Call"]) },
    // Section 3 — Business Goals
    { sectionId: s3, fieldKey: "website_goals", type: "checkbox", label: "What do you want your website to achieve?", placeholder: "", isRequired: false, isHidden: false, sortOrder: 1, options: JSON.stringify(["Generate Leads","Sell Products","Bookings","Appointments","Portfolio","Brand Awareness","Other"]) },
    { sectionId: s3, fieldKey: "target_customers", type: "textarea", label: "Who are your target customers?", placeholder: "Describe your ideal customer...", isRequired: false, isHidden: false, sortOrder: 2, options: "[]" },
    { sectionId: s3, fieldKey: "biggest_competitors", type: "textarea", label: "Who are your biggest competitors?", placeholder: "List competitor names or URLs...", isRequired: false, isHidden: false, sortOrder: 3, options: "[]" },
    { sectionId: s3, fieldKey: "has_logo", type: "radio", label: "Do you have a logo?", placeholder: "", isRequired: false, isHidden: false, sortOrder: 4, options: JSON.stringify(["Yes","No"]) },
    { sectionId: s3, fieldKey: "logo_files", type: "file", label: "Upload Logo", placeholder: "", isRequired: false, isHidden: false, sortOrder: 5, options: "[]" },
    { sectionId: s3, fieldKey: "brand_guidelines", type: "file", label: "Upload Brand Guidelines", placeholder: "", isRequired: false, isHidden: false, sortOrder: 6, options: "[]" },
    { sectionId: s3, fieldKey: "images", type: "file", label: "Upload Images", placeholder: "", isRequired: false, isHidden: false, sortOrder: 7, options: "[]" },
    { sectionId: s3, fieldKey: "videos", type: "file", label: "Upload Videos", placeholder: "", isRequired: false, isHidden: false, sortOrder: 8, options: "[]" },
    // Section 4 — Social Media
    { sectionId: s4, fieldKey: "facebook", type: "text", label: "Facebook", placeholder: "https://facebook.com/yourpage", isRequired: false, isHidden: false, sortOrder: 1, options: "[]" },
    { sectionId: s4, fieldKey: "instagram", type: "text", label: "Instagram", placeholder: "https://instagram.com/yourhandle", isRequired: false, isHidden: false, sortOrder: 2, options: "[]" },
    { sectionId: s4, fieldKey: "linkedin", type: "text", label: "LinkedIn", placeholder: "https://linkedin.com/company/...", isRequired: false, isHidden: false, sortOrder: 3, options: "[]" },
    { sectionId: s4, fieldKey: "tiktok", type: "text", label: "TikTok", placeholder: "https://tiktok.com/@yourhandle", isRequired: false, isHidden: false, sortOrder: 4, options: "[]" },
    { sectionId: s4, fieldKey: "youtube", type: "text", label: "YouTube", placeholder: "https://youtube.com/@yourchannel", isRequired: false, isHidden: false, sortOrder: 5, options: "[]" },
    { sectionId: s4, fieldKey: "google_business", type: "text", label: "Google Business Profile", placeholder: "Your Google Business link", isRequired: false, isHidden: false, sortOrder: 6, options: "[]" },
    // Section 5 — Project Requirements
    { sectionId: s5, fieldKey: "pages_needed", type: "checkbox", label: "Which pages do you need?", placeholder: "", isRequired: false, isHidden: false, sortOrder: 1, options: JSON.stringify(["Home","About","Services","Products","Gallery","Testimonials","Blog","Contact","FAQs","Booking","Shop","Other"]) },
    { sectionId: s5, fieldKey: "needs_payments", type: "radio", label: "Do you need online payments?", placeholder: "", isRequired: false, isHidden: false, sortOrder: 2, options: JSON.stringify(["Yes","No"]) },
    { sectionId: s5, fieldKey: "needs_booking", type: "radio", label: "Do you need appointment booking?", placeholder: "", isRequired: false, isHidden: false, sortOrder: 3, options: JSON.stringify(["Yes","No"]) },
    { sectionId: s5, fieldKey: "additional_requirements", type: "textarea", label: "Any additional requirements?", placeholder: "Tell us anything else you need...", isRequired: false, isHidden: false, sortOrder: 4, options: "[]" },
  ];

  await db.insert(formQuestions).values(questions);
  console.log("Seeded initial form sections and questions.");
}
