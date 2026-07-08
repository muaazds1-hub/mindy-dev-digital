import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Pencil, Save, X, ChevronUp, ChevronDown,
  Eye, EyeOff, Copy, GripVertical, Layers,
} from "lucide-react";

interface FormSection { id: number; title: string; description: string; sortOrder: number; isActive: boolean; }
interface FormQuestion { id: number; sectionId: number; fieldKey: string; type: string; label: string; placeholder: string; isRequired: boolean; isHidden: boolean; sortOrder: number; options: string; }

const QUESTION_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "file", label: "File Upload" },
];

const TYPE_COLOR: Record<string, string> = {
  text: "#3b82f6", textarea: "#8b5cf6", email: "#20eca2", phone: "#f59e0b",
  number: "#ef4444", date: "#06b6d4", dropdown: "#ec4899", radio: "#10b981",
  checkbox: "#6366f1", file: "#f97316",
};

function TypeBadge({ type }: { type: string }) {
  const color = TYPE_COLOR[type] ?? "#999";
  const label = QUESTION_TYPES.find(t => t.value === type)?.label ?? type;
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: `${color}18`, color }}>
      {label}
    </span>
  );
}

interface QuestionModalProps {
  sectionId: number;
  initial: Partial<FormQuestion> | null;
  token: string;
  onClose: () => void;
  onUnauthorized: () => void;
}

function QuestionModal({ sectionId, initial, token, onClose, onUnauthorized }: QuestionModalProps) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const authHeaders = { Authorization: `Bearer ${token}` };
  const handle401 = (err: unknown) => { if (err instanceof Error && err.message.startsWith("401:")) { onUnauthorized(); return true; } return false; };

  const isEditing = !!initial?.id;
  const [form, setForm] = useState({
    fieldKey: initial?.fieldKey ?? "",
    type: initial?.type ?? "text",
    label: initial?.label ?? "",
    placeholder: initial?.placeholder ?? "",
    isRequired: initial?.isRequired ?? false,
    isHidden: initial?.isHidden ?? false,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [optionsList, setOptionsList] = useState<string[]>(() => {
    try { return JSON.parse(initial?.options ?? "[]"); } catch { return []; }
  });
  const [newOption, setNewOption] = useState("");

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const hasOptions = ["dropdown", "radio", "checkbox"].includes(form.type);

  const saveMut = useMutation({
    mutationFn: (data: object) => isEditing
      ? apiRequest("PUT", `/api/admin/form-questions/${initial!.id}`, data, { headers: authHeaders })
      : apiRequest("POST", "/api/admin/form-questions", data, { headers: authHeaders }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/form-questions"] });
      toast({ title: isEditing ? "Question updated" : "Question added" });
      onClose();
    },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive", description: "Failed to save question." }); },
  });

  const handleSave = () => {
    if (!form.label.trim()) { toast({ title: "Label is required", variant: "destructive" }); return; }
    if (!form.fieldKey.trim()) { toast({ title: "Field key is required", variant: "destructive" }); return; }
    saveMut.mutate({
      ...form,
      sectionId,
      options: hasOptions ? JSON.stringify(optionsList) : "[]",
    });
  };

  const addOption = () => {
    if (newOption.trim() && !optionsList.includes(newOption.trim())) {
      setOptionsList(prev => [...prev, newOption.trim()]);
      setNewOption("");
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all";

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-white/10" style={{ background: "#0f1728" }}>
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <h3 className="text-white font-bold">{isEditing ? "Edit Question" : "Add Question"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wide">Question Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a1120] border border-white/10 text-white focus:outline-none focus:border-[#20eca2]/50 text-sm">
                {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wide">Label *</label>
              <input type="text" value={form.label} onChange={e => set("label", e.target.value)}
                placeholder="Question label shown to user" className={inputClass} />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wide">Field Key *</label>
              <input type="text" value={form.fieldKey} onChange={e => set("fieldKey", e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""))}
                placeholder="unique_field_key" className={inputClass} />
              <p className="text-white/25 text-xs">Unique identifier (lowercase, underscores only)</p>
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wide">Placeholder</label>
              <input type="text" value={form.placeholder} onChange={e => set("placeholder", e.target.value)}
                placeholder="Hint text shown inside the field" className={inputClass} />
            </div>

            <div className="space-y-1">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wide">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))}
                className={inputClass} />
            </div>

            <div className="space-y-3">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wide">Flags</label>
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => set("isRequired", !form.isRequired)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                  style={form.isRequired
                    ? { background: "rgba(32,236,162,0.12)", color: "#20eca2", borderColor: "rgba(32,236,162,0.35)" }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.1)" }}>
                  ✓ Required
                </button>
                <button type="button" onClick={() => set("isHidden", !form.isHidden)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                  style={form.isHidden
                    ? { background: "rgba(239,68,68,0.12)", color: "#ef4444", borderColor: "rgba(239,68,68,0.35)" }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.1)" }}>
                  👁 Hidden
                </button>
              </div>
            </div>
          </div>

          {/* Options editor */}
          {hasOptions && (
            <div className="space-y-2">
              <label className="text-white/50 text-xs font-medium uppercase tracking-wide">Options</label>
              <div className="space-y-2">
                {optionsList.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 text-white/25 text-xs text-center">{i + 1}</span>
                    <input type="text" value={opt}
                      onChange={e => setOptionsList(prev => prev.map((o, j) => j === i ? e.target.value : o))}
                      className={inputClass + " flex-1"} />
                    <button onClick={() => setOptionsList(prev => prev.filter((_, j) => j !== i))}
                      className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="w-6" />
                  <input type="text" value={newOption} onChange={e => setNewOption(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addOption(); }}
                    placeholder="Type option and press Enter..."
                    className={inputClass + " flex-1"} />
                  <button onClick={addOption}
                    className="p-2 rounded-lg text-[#20eca2] bg-[#20eca2]/10 hover:bg-[#20eca2]/20 transition-all">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/8 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-white/60 border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saveMut.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-[#0f1728] disabled:opacity-50 transition-all"
            style={{ background: "linear-gradient(135deg, #20eca2, #10b981)" }}>
            <Save className="w-4 h-4" />
            {saveMut.isPending ? "Saving..." : "Save Question"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFormBuilder({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const authHeaders = { Authorization: `Bearer ${token}` };
  const handle401 = (err: unknown) => { if (err instanceof Error && err.message.startsWith("401:")) { onUnauthorized(); return true; } return false; };

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [addingSectionForm, setAddingSectionForm] = useState(false);
  const [sectionForm, setSectionForm] = useState({ title: "", description: "", sortOrder: 0, isActive: true });
  const [questionModal, setQuestionModal] = useState<{ sectionId: number; initial: Partial<FormQuestion> | null } | null>(null);

  const { data: sections = [], isLoading: loadingSections } = useQuery<FormSection[]>({
    queryKey: ["/api/admin/form-sections"],
    queryFn: () => fetch("/api/admin/form-sections", { headers: authHeaders }).then(r => r.json()),
  });

  const { data: allQuestions = [] } = useQuery<FormQuestion[]>({
    queryKey: ["/api/admin/form-questions"],
    queryFn: () => fetch("/api/admin/form-questions", { headers: authHeaders }).then(r => r.json()),
  });

  const createSectionMut = useMutation({
    mutationFn: (d: object) => apiRequest("POST", "/api/admin/form-sections", d, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/form-sections"] }); setAddingSectionForm(false); setSectionForm({ title: "", description: "", sortOrder: 0, isActive: true }); toast({ title: "Section added" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive" }); },
  });

  const updateSectionMut = useMutation({
    mutationFn: ({ id, ...d }: { id: number; [k: string]: unknown }) => apiRequest("PUT", `/api/admin/form-sections/${id}`, d, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/form-sections"] }); setEditingSectionId(null); toast({ title: "Section updated" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive" }); },
  });

  const deleteSectionMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/form-sections/${id}`, undefined, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/form-sections"] }); toast({ title: "Section deleted" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive" }); },
  });

  const deleteQuestionMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/form-questions/${id}`, undefined, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/form-questions"] }); toast({ title: "Question deleted" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive" }); },
  });

  const toggleQuestionMut = useMutation({
    mutationFn: ({ id, isHidden }: { id: number; isHidden: boolean }) =>
      apiRequest("PUT", `/api/admin/form-questions/${id}`, { isHidden }, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/form-questions"] }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive" }); },
  });

  const updateOrderMut = useMutation({
    mutationFn: ({ id, sortOrder }: { id: number; sortOrder: number }) =>
      apiRequest("PUT", `/api/admin/form-questions/${id}`, { sortOrder }, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/form-questions"] }); },
  });

  const toggleSection = (id: number) =>
    setExpandedSections(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const getQuestions = (sectionId: number) =>
    allQuestions.filter(q => q.sectionId === sectionId).sort((a, b) => a.sortOrder - b.sortOrder);

  const moveQuestion = (q: FormQuestion, dir: 1 | -1) => {
    const siblings = getQuestions(q.sectionId);
    const idx = siblings.findIndex(s => s.id === q.id);
    const swap = siblings[idx + dir];
    if (!swap) return;
    updateOrderMut.mutate({ id: q.id, sortOrder: swap.sortOrder });
    updateOrderMut.mutate({ id: swap.id, sortOrder: q.sortOrder });
  };

  const dupQuestion = (q: FormQuestion) => {
    const newQ = { sectionId: q.sectionId, fieldKey: q.fieldKey + "_copy", type: q.type, label: q.label + " (Copy)", placeholder: q.placeholder, isRequired: q.isRequired, isHidden: true, sortOrder: q.sortOrder + 1, options: q.options };
    apiRequest("POST", "/api/admin/form-questions", newQ, { headers: authHeaders }).then(() => {
      qc.invalidateQueries({ queryKey: ["/api/admin/form-questions"] });
      toast({ title: "Question duplicated (hidden)" });
    });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Form Builder</h2>
          <p className="text-white/40 text-sm mt-1">
            {sections.length} section{sections.length !== 1 ? "s" : ""} · {allQuestions.length} question{allQuestions.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!addingSectionForm && (
          <button onClick={() => setAddingSectionForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0f1728]"
            style={{ background: "linear-gradient(135deg, #20eca2, #10b981)", boxShadow: "0 0 20px rgba(32,236,162,0.3)" }}>
            <Plus className="w-4 h-4" /> Add Section
          </button>
        )}
      </div>

      {/* Add section form */}
      {addingSectionForm && (
        <div className="rounded-2xl p-6 border border-[#20eca2]/20" style={{ background: "rgba(32,236,162,0.04)" }}>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-[#20eca2]" /> New Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" value={sectionForm.title} onChange={e => setSectionForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Section title *" className={inputClass} />
            <input type="text" value={sectionForm.description} onChange={e => setSectionForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Description (optional)" className={inputClass} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => createSectionMut.mutate(sectionForm)} disabled={createSectionMut.isPending || !sectionForm.title}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#0f1728] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #20eca2, #10b981)" }}>
              <Save className="w-4 h-4" /> {createSectionMut.isPending ? "Saving..." : "Save Section"}
            </button>
            <button onClick={() => setAddingSectionForm(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/60 border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loadingSections ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : sections.length === 0 ? (
        <div className="text-center py-16 text-white/25 text-sm">No sections yet. Add a section to start building your form.</div>
      ) : (
        <div className="space-y-4">
          {sections.sort((a, b) => a.sortOrder - b.sortOrder).map((section) => {
            const questions = getQuestions(section.id);
            const expanded = expandedSections.has(section.id);
            const isEditing = editingSectionId === section.id;

            return (
              <div key={section.id} className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
                {/* Section header */}
                <div className="px-5 py-4 flex items-center gap-4">
                  <div className="flex items-center gap-2 mr-1 flex-shrink-0">
                    <Layers className="w-4 h-4 text-[#20eca2]" />
                    <span className="text-white/30 text-xs font-mono">#{section.sortOrder}</span>
                  </div>
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-3 flex-wrap">
                      <input type="text" defaultValue={section.title}
                        onBlur={(e) => updateSectionMut.mutate({ id: section.id, title: e.target.value })}
                        className="flex-1 min-w-32 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#20eca2]/50" />
                      <input type="text" defaultValue={section.description ?? ""}
                        onBlur={(e) => updateSectionMut.mutate({ id: section.id, description: e.target.value })}
                        placeholder="Description"
                        className="flex-1 min-w-32 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#20eca2]/50" />
                      <button onClick={() => setEditingSectionId(null)}
                        className="p-1.5 rounded-lg text-[#20eca2] bg-[#20eca2]/10 hover:bg-[#20eca2]/20 transition-all">
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 cursor-pointer" onClick={() => toggleSection(section.id)}>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">{section.title}</span>
                        <span className="text-white/30 text-xs">{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
                        {!section.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">Inactive</span>}
                      </div>
                      {section.description && <p className="text-white/35 text-xs mt-0.5">{section.description}</p>}
                    </div>
                  )}

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => { setEditingSectionId(isEditing ? null : section.id); }}
                      className="p-1.5 rounded-lg text-white/30 hover:text-[#20eca2] hover:bg-[#20eca2]/10 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => updateSectionMut.mutate({ id: section.id, isActive: !section.isActive })}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all" title={section.isActive ? "Deactivate" : "Activate"}>
                      {section.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
                    </button>
                    <button onClick={() => { if (confirm(`Delete section "${section.title}"?`)) deleteSectionMut.mutate(section.id); }}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toggleSection(section.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                      {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Questions */}
                {expanded && (
                  <div className="border-t border-white/6 px-5 py-4 space-y-2">
                    {questions.length === 0 ? (
                      <p className="text-white/25 text-xs text-center py-4">No questions in this section yet</p>
                    ) : (
                      questions.map((q) => (
                        <div key={q.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                          style={{
                            background: q.isHidden ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.03)",
                            borderColor: q.isHidden ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.07)",
                          }}>
                          <GripVertical className="w-3.5 h-3.5 text-white/15 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <TypeBadge type={q.type} />
                              <span className="text-white/80 text-sm font-medium">{q.label}</span>
                              {q.isRequired && <span className="text-xs text-[#20eca2] font-bold">*Required</span>}
                              {q.isHidden && <span className="text-xs text-red-400 font-bold">Hidden</span>}
                            </div>
                            <p className="text-white/30 text-xs mt-0.5 font-mono">{q.fieldKey}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => moveQuestion(q, -1)} className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/5 transition-all"><ChevronUp className="w-3 h-3" /></button>
                            <button onClick={() => moveQuestion(q, 1)} className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/5 transition-all"><ChevronDown className="w-3 h-3" /></button>
                            <button onClick={() => toggleQuestionMut.mutate({ id: q.id, isHidden: !q.isHidden })}
                              className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/5 transition-all">
                              {q.isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                            <button onClick={() => dupQuestion(q)} className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/5 transition-all"><Copy className="w-3 h-3" /></button>
                            <button onClick={() => setQuestionModal({ sectionId: section.id, initial: q })} className="p-1.5 rounded-lg text-white/25 hover:text-[#20eca2] hover:bg-[#20eca2]/10 transition-all"><Pencil className="w-3 h-3" /></button>
                            <button onClick={() => { if (confirm(`Delete "${q.label}"?`)) deleteQuestionMut.mutate(q.id); }} className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))
                    )}
                    <button onClick={() => setQuestionModal({ sectionId: section.id, initial: null })}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white/40 border border-dashed border-white/15 hover:border-[#20eca2]/40 hover:text-[#20eca2] transition-all mt-2">
                      <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Question Modal */}
      {questionModal && (
        <QuestionModal
          sectionId={questionModal.sectionId}
          initial={questionModal.initial}
          token={token}
          onClose={() => setQuestionModal(null)}
          onUnauthorized={onUnauthorized}
        />
      )}
    </div>
  );
}
