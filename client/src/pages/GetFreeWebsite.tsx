import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Building2, Phone, Target, Globe, Layout,
  ArrowLeft, ArrowRight, CheckCircle2, Upload,
  ChevronLeft, Star, Shield, Zap, Clock,
} from "lucide-react";

interface QuestionData {
  id: number;
  fieldKey: string;
  type: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  isHidden: boolean;
  options: string;
}

interface SectionData {
  section: { id: number; title: string; description: string; sortOrder: number };
  questions: QuestionData[];
}

interface FormApiResponse {
  sections: SectionData[];
}

const SECTION_ICONS = [Building2, Phone, Target, Globe, Layout];

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  contacted: "#3b82f6",
  completed: "#20eca2",
  rejected: "#ef4444",
};

const fieldLabel = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function QuestionInput({
  q,
  value,
  onChange,
  onFileChange,
  error,
}: {
  q: QuestionData;
  value: string | string[];
  onChange: (val: string | string[]) => void;
  onFileChange: (files: FileList | null) => void;
  error?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const options: string[] = (() => {
    try { return JSON.parse(q.options || "[]"); } catch { return []; }
  })();

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all text-sm"
    + " bg-white/10 border border-white/20 focus:border-[#20eca2]/60 focus:ring-[#20eca2]/20";

  const strVal = Array.isArray(value) ? "" : value;
  const arrVal = Array.isArray(value) ? value : [];

  const toggleCheck = (opt: string) => {
    if (arrVal.includes(opt)) onChange(arrVal.filter((x) => x !== opt));
    else onChange([...arrVal, opt]);
  };

  switch (q.type) {
    case "textarea":
      return (
        <textarea
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          rows={4}
          data-testid={`input-${q.fieldKey}`}
          className={inputClass + " resize-none"}
        />
      );

    case "dropdown":
      return (
        <select
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          data-testid={`select-${q.fieldKey}`}
          className={inputClass + " bg-[#1a3a8a] cursor-pointer"}
        >
          <option value="" className="text-white/50">{q.placeholder || "Select an option"}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#1a3a8a] text-white">{opt}</option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              data-testid={`radio-${q.fieldKey}-${opt}`}
              className="px-4 py-2 rounded-xl text-sm font-medium border transition-all"
              style={
                strVal === opt
                  ? { background: "#20eca2", color: "#0f1728", borderColor: "#20eca2", boxShadow: "0 0 12px rgba(32,236,162,0.4)" }
                  : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.15)" }
              }
            >
              {opt}
            </button>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {options.map((opt) => {
            const selected = arrVal.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleCheck(opt)}
                data-testid={`checkbox-${q.fieldKey}-${opt}`}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left font-medium border transition-all"
                style={
                  selected
                    ? { background: "rgba(32,236,162,0.15)", color: "#20eca2", borderColor: "rgba(32,236,162,0.5)" }
                    : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", borderColor: "rgba(255,255,255,0.12)" }
                }
              >
                <span className="w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center text-xs"
                  style={selected ? { background: "#20eca2", borderColor: "#20eca2", color: "#0f1728" } : { borderColor: "rgba(255,255,255,0.25)" }}>
                  {selected && "✓"}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      );

    case "file":
      return (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            data-testid={`file-${q.fieldKey}`}
            className="w-full flex items-center justify-center gap-3 px-4 py-6 rounded-xl border-2 border-dashed border-white/20 hover:border-[#20eca2]/50 transition-all text-white/60 hover:text-white cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <Upload className="w-5 h-5" />
            <span className="text-sm">{q.placeholder || "Click to upload files"}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => onFileChange(e.target.files)}
          />
        </div>
      );

    case "email":
      return (
        <input type="email" value={strVal} onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder} data-testid={`input-${q.fieldKey}`} className={inputClass} />
      );

    case "phone":
      return (
        <input type="tel" value={strVal} onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder} data-testid={`input-${q.fieldKey}`} className={inputClass} />
      );

    case "number":
      return (
        <input type="number" value={strVal} onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder} data-testid={`input-${q.fieldKey}`} className={inputClass} />
      );

    case "date":
      return (
        <input type="date" value={strVal} onChange={(e) => onChange(e.target.value)}
          data-testid={`input-${q.fieldKey}`} className={inputClass} />
      );

    default:
      return (
        <input type="text" value={strVal} onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder} data-testid={`input-${q.fieldKey}`} className={inputClass} />
      );
  }
}

export default function GetFreeWebsite() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [filesByKey, setFilesByKey] = useState<Record<string, FileList | null>>({});
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);

  const { data, isLoading } = useQuery<FormApiResponse>({ queryKey: ["/api/form"] });
  const sections = data?.sections ?? [];
  const totalSteps = sections.length;
  const isLastStep = step === totalSteps;

  const setAnswer = (key: string, val: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const setFile = (key: string, files: FileList | null) => {
    setFilesByKey((prev) => ({ ...prev, [key]: files }));
  };

  const validateStep = () => {
    if (isLastStep) {
      if (!agreed) { setErrors({ agreed: "You must agree to be contacted." }); return false; }
      return true;
    }
    const section = sections[step];
    const newErrors: Record<string, string> = {};
    for (const q of section.questions) {
      if (q.isRequired) {
        const val = answers[q.fieldKey];
        if (q.type === "checkbox") {
          if (!Array.isArray(val) || val.length === 0) newErrors[q.fieldKey] = "Please select at least one option";
        } else if (q.type !== "file") {
          if (!val || String(val).trim() === "") newErrors[q.fieldKey] = `${q.label} is required`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setDirection(1);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("answers", JSON.stringify(answers));
      fd.append("agreedToContact", String(agreed));
      Object.entries(filesByKey).forEach(([key, files]) => {
        if (files) Array.from(files).forEach((f) => fd.append(key, f));
      });
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      if (res.ok) setSubmitted(true);
      else throw new Error("Server error");
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = totalSteps > 0 ? ((isLastStep ? totalSteps : step) / totalSteps) * 100 : 0;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #1f58f1 0%, #0d3aab 100%)" }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #20eca2, #10b981)", boxShadow: "0 0 40px rgba(32,236,162,0.5)" }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">You're All Set! 🎉</h1>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Your free website request has been submitted successfully. Our team will review your details and contact you within <strong className="text-[#20eca2]">24–48 hours</strong>.
          </p>
          <Link href="/">
            <button className="px-8 py-4 rounded-2xl font-bold text-[#0f1728] text-sm"
              style={{ background: "linear-gradient(135deg, #20eca2, #10b981)", boxShadow: "0 0 24px rgba(32,236,162,0.4)" }}>
              ← Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1f58f1 0%, #0d3aab 50%, #091f6b 100%)" }}>
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10" style={{ background: "#20eca2", filter: "blur(80px)" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-8" style={{ background: "#1f58f1", filter: "blur(100px)" }} />
      </div>

      {/* Top Nav */}
      <div className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/">
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Back to Site
          </button>
        </Link>
        <img src="/mindy-dev-logo.png" alt="Mindy Dev"
          style={{ width: "110px", height: "auto", filter: "drop-shadow(0 0 10px rgba(32,236,162,0.4))" }} />
      </div>

      <div className="relative z-10 px-4 pb-16">
        <div className="max-w-3xl mx-auto">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(32,236,162,0.15)", color: "#20eca2", border: "1px solid rgba(32,236,162,0.3)" }}>
              🎁 Limited Offer — Completely Free
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Get Your Professional Business Website —{" "}
              <span style={{ color: "#20eca2" }}>Absolutely FREE</span>
            </h1>
            <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Answer a few questions so we can understand your business and create a professional website tailored specifically for you.
            </p>
            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { icon: Star, text: "Professional Design" },
                { icon: Shield, text: "Mobile Responsive" },
                { icon: Zap, text: "SEO Ready" },
                { icon: Clock, text: "Fast Delivery" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/80"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <Icon className="w-4 h-4 text-[#20eca2]" /> {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Progress bar */}
          {!isLoading && totalSteps > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                <span>Step {Math.min(step + 1, totalSteps + 1)} of {totalSteps + 1}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                <motion.div
                  className="h-2 rounded-full"
                  style={{ background: "linear-gradient(90deg, #20eca2, #10b981)", boxShadow: "0 0 10px rgba(32,236,162,0.5)" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
              <div className="flex gap-1 mt-2">
                {sections.map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all"
                    style={{ background: i < step ? "#20eca2" : i === step ? "rgba(32,236,162,0.4)" : "rgba(255,255,255,0.1)" }} />
                ))}
                <div className="flex-1 h-1 rounded-full transition-all"
                  style={{ background: isLastStep ? "#20eca2" : "rgba(255,255,255,0.1)" }} />
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="rounded-3xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>

            {isLoading ? (
              <div className="p-10 space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.1)" }} />)}
              </div>
            ) : (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ x: direction * 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction * -60, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {!isLastStep && sections[step] ? (
                    <div className="p-8">
                      {/* Section header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, rgba(32,236,162,0.2), rgba(31,88,241,0.2))", border: "1px solid rgba(32,236,162,0.3)" }}>
                          {(() => {
                            const Icon = SECTION_ICONS[step % SECTION_ICONS.length];
                            return <Icon className="w-6 h-6 text-[#20eca2]" />;
                          })()}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{sections[step].section.title}</h2>
                          {sections[step].section.description && (
                            <p className="text-white/55 text-sm mt-0.5">{sections[step].section.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="space-y-6">
                        {sections[step].questions.map((q) => (
                          <div key={q.id}>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                              {q.label}
                              {q.isRequired && <span className="text-[#20eca2] ml-1">*</span>}
                            </label>
                            <QuestionInput
                              q={q}
                              value={answers[q.fieldKey] ?? (["checkbox"].includes(q.type) ? [] : "")}
                              onChange={(val) => setAnswer(q.fieldKey, val)}
                              onFileChange={(files) => setFile(q.fieldKey, files)}
                              error={errors[q.fieldKey]}
                            />
                            {errors[q.fieldKey] && (
                              <p className="mt-1.5 text-sm" style={{ color: "#ef4444" }}>{errors[q.fieldKey]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Final Step */
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, rgba(32,236,162,0.2), rgba(31,88,241,0.2))", border: "1px solid rgba(32,236,162,0.3)" }}>
                          <CheckCircle2 className="w-6 h-6 text-[#20eca2]" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Almost Done!</h2>
                          <p className="text-white/55 text-sm mt-0.5">Review and submit your free website request</p>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl mb-6"
                        style={{ background: "rgba(32,236,162,0.06)", border: "1px solid rgba(32,236,162,0.2)" }}>
                        <p className="text-white/70 text-sm leading-relaxed">
                          🎉 Great job completing the form! Our team at <strong className="text-[#20eca2]">Mindy Dev</strong> will review your information and reach out within <strong className="text-white">24–48 hours</strong> to get started on your free website.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => { setAgreed(!agreed); if (errors.agreed) setErrors({}); }}
                        data-testid="checkbox-agreed"
                        className="flex items-start gap-3 w-full text-left p-4 rounded-xl border transition-all"
                        style={agreed
                          ? { background: "rgba(32,236,162,0.1)", borderColor: "rgba(32,236,162,0.4)" }
                          : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.15)" }}
                      >
                        <span className="w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all"
                          style={agreed ? { background: "#20eca2", borderColor: "#20eca2", color: "#0f1728" } : { borderColor: "rgba(255,255,255,0.3)" }}>
                          {agreed && <span className="text-xs font-bold">✓</span>}
                        </span>
                        <span className="text-white/75 text-sm leading-relaxed">
                          I agree to be contacted by <strong className="text-white">Mindy Dev</strong> regarding my free website request. I understand that my information will be kept confidential.
                        </span>
                      </button>
                      {errors.agreed && <p className="mt-1.5 text-sm" style={{ color: "#ef4444" }}>{errors.agreed}</p>}
                      {errors.submit && <p className="mt-3 text-sm text-center" style={{ color: "#ef4444" }}>{errors.submit}</p>}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation */}
            {!isLoading && (
              <div className="px-8 pb-8 flex items-center justify-between gap-4">
                <button
                  onClick={goBack}
                  disabled={step === 0}
                  data-testid="button-form-back"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {isLastStep ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    data-testid="button-form-submit"
                    className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all flex-1 justify-center"
                    style={{ background: "linear-gradient(135deg, #20eca2, #10b981)", color: "#0f1728", boxShadow: "0 0 24px rgba(32,236,162,0.4)" }}
                  >
                    {submitting ? (
                      <><span className="w-4 h-4 border-2 border-[#0f1728]/30 border-t-[#0f1728] rounded-full animate-spin" /> Submitting...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Submit My Free Website Request</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    data-testid="button-form-next"
                    className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all flex-1 justify-center"
                    style={{ background: "linear-gradient(135deg, #20eca2, #10b981)", color: "#0f1728", boxShadow: "0 0 20px rgba(32,236,162,0.35)" }}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Trust note */}
          <p className="text-center text-white/40 text-xs mt-6">
            🔒 Your information is 100% secure and will never be shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
