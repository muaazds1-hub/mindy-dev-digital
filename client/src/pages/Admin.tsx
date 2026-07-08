import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, LogOut, Eye, Save, X, Lock, User, Layers, Briefcase, Users, Sliders } from "lucide-react";
import type { PortfolioProject, Service } from "@shared/schema";
import AdminLeads from "./AdminLeads";
import AdminFormBuilder from "./AdminFormBuilder";

// ─── Shared constants ────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  "GraduationCap","Stethoscope","Dumbbell","Utensils","Briefcase",
  "Store","Home","Car","Plane","Camera","Code","ShoppingBag",
  "Heart","Star","Globe","Building","Laptop","Shirt",
  "Rocket","PenTool","Layout","TrendingUp","Target","Search",
  "MessageSquare","Users","CheckCircle2",
];

const COLOR_OPTIONS = [
  { label: "Green", value: "#20eca2" },
  { label: "Purple", value: "#6c63ff" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Pink", value: "#ec4899" },
  { label: "Orange", value: "#f97316" },
  { label: "Cyan", value: "#06b6d4" },
];

const CATEGORY_OPTIONS = [
  "Education","Medical","Fitness","Food","Business",
  "Fashion","Real Estate","Technology","Travel","Other",
];

// ─── Portfolio form ───────────────────────────────────────────────────────────

type ProjectFormData = {
  title: string; category: string; description: string; url: string;
  color: string; gradient: string; iconName: string; sortOrder: number;
};

const EMPTY_PROJECT: ProjectFormData = {
  title: "", category: "Business", description: "", url: "",
  color: "#20eca2", gradient: "from-teal-500/20 to-cyan-500/10", iconName: "Briefcase", sortOrder: 0,
};

function ProjectForm({ initial, onSave, onCancel, saving }: { initial: ProjectFormData; onSave: (d: ProjectFormData) => void; onCancel: () => void; saving: boolean }) {
  const [form, setForm] = useState<ProjectFormData>(initial);
  const set = (key: keyof ProjectFormData, value: string | number) => setForm(p => ({ ...p, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Title *</label>
          <input data-testid="input-project-title" type="text" value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="Project title" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all" />
        </div>
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Category *</label>
          <select data-testid="select-project-category" value={form.category} onChange={e => set("category", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0f1728] border border-white/10 text-white focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all">
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Live URL *</label>
        <input data-testid="input-project-url" type="url" value={form.url} onChange={e => set("url", e.target.value)}
          placeholder="https://example.com" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all" />
      </div>
      <div className="space-y-1">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Description *</label>
        <textarea data-testid="input-project-description" value={form.description} onChange={e => set("description", e.target.value)}
          placeholder="Short description..." rows={3}
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm resize-none transition-all" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Icon</label>
          <select data-testid="select-project-icon" value={form.iconName} onChange={e => set("iconName", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0f1728] border border-white/10 text-white focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all">
            {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Color</label>
          <select data-testid="select-project-color" value={form.color} onChange={e => set("color", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0f1728] border border-white/10 text-white focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all">
            {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label} ({c.value})</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Sort Order</label>
          <input data-testid="input-project-sort" type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all" />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button data-testid="button-save-project" onClick={() => onSave(form)} disabled={saving || !form.title || !form.url || !form.description}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-[#0f1728] disabled:opacity-50 transition-all"
          style={{ background: "linear-gradient(135deg, #20eca2, #10b981)" }}>
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Project"}
        </button>
        <button data-testid="button-cancel-project" onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white/70 border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Services form ────────────────────────────────────────────────────────────

type ServiceFormData = { title: string; description: string; iconName: string; isHot: boolean; sortOrder: number; };

const EMPTY_SERVICE: ServiceFormData = { title: "", description: "", iconName: "Rocket", isHot: false, sortOrder: 0 };

function ServiceForm({ initial, onSave, onCancel, saving }: { initial: ServiceFormData; onSave: (d: ServiceFormData) => void; onCancel: () => void; saving: boolean }) {
  const [form, setForm] = useState<ServiceFormData>(initial);
  const set = <K extends keyof ServiceFormData>(k: K, v: ServiceFormData[K]) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Title *</label>
          <input data-testid="input-service-title" type="text" value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="Service title" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all" />
        </div>
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Icon</label>
          <select data-testid="select-service-icon" value={form.iconName} onChange={e => set("iconName", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0f1728] border border-white/10 text-white focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all">
            {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Description *</label>
        <textarea data-testid="input-service-description" value={form.description} onChange={e => set("description", e.target.value)}
          placeholder="Describe this service..." rows={3}
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm resize-none transition-all" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Sort Order</label>
          <input data-testid="input-service-sort" type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#20eca2]/50 text-sm transition-all" />
        </div>
        <div className="space-y-1">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Hot Selling?</label>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" data-testid="toggle-service-hot" onClick={() => set("isHot", !form.isHot)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
              style={form.isHot ? { background: "#20eca2", color: "#0f1728", borderColor: "#20eca2" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.1)" }}>
              🔥 {form.isHot ? "Yes — Hot Selling" : "No"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button data-testid="button-save-service" onClick={() => onSave(form)} disabled={saving || !form.title || !form.description}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-[#0f1728] disabled:opacity-50 transition-all"
          style={{ background: "linear-gradient(135deg, #20eca2, #10b981)" }}>
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Service"}
        </button>
        <button data-testid="button-cancel-service" onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white/70 border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, sessionExpired }: { onLogin: (t: string) => void; sessionExpired?: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      if (!res.ok) { setError("Invalid username or password."); return; }
      const { token } = await res.json();
      localStorage.setItem("admin_token", token);
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      onLogin(token);
    } catch { setError("Connection error. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1728" }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #1f58f1, #20eca2)" }}>
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-white/40 text-sm">Mindy Dev — Restricted Access</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
          {sessionExpired && !error && <div className="rounded-xl px-4 py-3 text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20">Your session expired. Please sign in again.</div>}
          {error && <div className="rounded-xl px-4 py-3 text-sm font-medium text-red-300 bg-red-500/10 border border-red-500/20">{error}</div>}
          <div className="space-y-2">
            <label className="text-white/70 text-sm font-medium">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input data-testid="input-admin-username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/60 focus:ring-1 focus:ring-[#20eca2]/30 transition-all text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/70 text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input data-testid="input-admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/60 focus:ring-1 focus:ring-[#20eca2]/30 transition-all text-sm" />
            </div>
          </div>
          <button data-testid="button-admin-login" type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-[#0f1728] text-sm transition-all duration-200 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #20eca2 0%, #10b981 100%)", boxShadow: "0 0 24px rgba(32,236,162,0.35)" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Portfolio tab ────────────────────────────────────────────────────────────

function PortfolioTab({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();
  const authHeaders = { Authorization: `Bearer ${token}` };
  const handle401 = (err: unknown) => { if (err instanceof Error && err.message.startsWith("401:")) { onUnauthorized(); return true; } return false; };

  const { data: projects = [], isLoading } = useQuery<PortfolioProject[]>({ queryKey: ["/api/portfolio"] });

  const createMut = useMutation({
    mutationFn: (d: ProjectFormData) => apiRequest("POST", "/api/admin/portfolio", d, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/portfolio"] }); setAdding(false); toast({ title: "Project added!" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", description: "Failed to add project.", variant: "destructive" }); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectFormData }) => apiRequest("PUT", `/api/admin/portfolio/${id}`, data, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/portfolio"] }); setEditingId(null); toast({ title: "Project updated!" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", description: "Failed to update project.", variant: "destructive" }); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/portfolio/${id}`, undefined, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/portfolio"] }); toast({ title: "Deleted" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", description: "Failed to delete.", variant: "destructive" }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Projects</h2>
          <p className="text-white/40 text-sm mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        {!adding && (
          <button data-testid="button-add-project" onClick={() => { setAdding(true); setEditingId(null); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-[#0f1728] transition-all"
            style={{ background: "linear-gradient(135deg, #20eca2, #10b981)", boxShadow: "0 0 20px rgba(32,236,162,0.3)" }}>
            <Plus className="w-4 h-4" /> Add Project
          </button>
        )}
      </div>
      {adding && (
        <div className="rounded-2xl p-6 border border-[#20eca2]/20" style={{ background: "rgba(32,236,162,0.04)" }}>
          <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2"><Plus className="w-4 h-4 text-[#20eca2]" /> Add New Project</h3>
          <ProjectForm initial={EMPTY_PROJECT} onSave={d => createMut.mutate(d)} onCancel={() => setAdding(false)} saving={createMut.isPending} />
        </div>
      )}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-white/30">No projects yet.</div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} data-testid={`card-project-${p.id}`}>
              {editingId === p.id ? (
                <div className="rounded-2xl p-6 border border-[#1f58f1]/30" style={{ background: "rgba(31,88,241,0.06)" }}>
                  <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2"><Pencil className="w-4 h-4 text-[#1f58f1]" /> Editing: {p.title}</h3>
                  <ProjectForm
                    initial={{ title: p.title, category: p.category, description: p.description, url: p.url, color: p.color, gradient: p.gradient, iconName: p.iconName, sortOrder: p.sortOrder }}
                    onSave={d => updateMut.mutate({ id: p.id, data: d })}
                    onCancel={() => setEditingId(null)}
                    saving={updateMut.isPending}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/8 hover:border-white/15 transition-all" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}60` }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{p.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}33` }}>{p.category}</span>
                      <span className="text-white/25 text-xs">#{p.sortOrder}</span>
                    </div>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{p.url}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" data-testid={`link-preview-${p.id}`} className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"><Eye className="w-4 h-4" /></a>
                    <button data-testid={`button-edit-${p.id}`} onClick={() => { setEditingId(p.id); setAdding(false); }} className="p-2 rounded-lg text-white/40 hover:text-[#20eca2] hover:bg-[#20eca2]/10 transition-all"><Pencil className="w-4 h-4" /></button>
                    <button data-testid={`button-delete-${p.id}`} onClick={() => { if (confirm(`Delete "${p.title}"?`)) deleteMut.mutate(p.id); }} disabled={deleteMut.isPending} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Services tab ─────────────────────────────────────────────────────────────

function ServicesTab({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();
  const authHeaders = { Authorization: `Bearer ${token}` };
  const handle401 = (err: unknown) => { if (err instanceof Error && err.message.startsWith("401:")) { onUnauthorized(); return true; } return false; };

  const { data: list = [], isLoading } = useQuery<Service[]>({ queryKey: ["/api/services"] });

  const createMut = useMutation({
    mutationFn: (d: ServiceFormData) => apiRequest("POST", "/api/admin/services", d, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/services"] }); setAdding(false); toast({ title: "Service added!" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive" }); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ServiceFormData }) => apiRequest("PUT", `/api/admin/services/${id}`, data, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/services"] }); setEditingId(null); toast({ title: "Service updated!" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive" }); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/services/${id}`, undefined, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/services"] }); toast({ title: "Deleted" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive" }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Services</h2>
          <p className="text-white/40 text-sm mt-1">{list.length} service{list.length !== 1 ? "s" : ""}</p>
        </div>
        {!adding && (
          <button data-testid="button-add-service" onClick={() => { setAdding(true); setEditingId(null); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-[#0f1728] transition-all"
            style={{ background: "linear-gradient(135deg, #20eca2, #10b981)", boxShadow: "0 0 20px rgba(32,236,162,0.3)" }}>
            <Plus className="w-4 h-4" /> Add Service
          </button>
        )}
      </div>
      {adding && (
        <div className="rounded-2xl p-6 border border-[#20eca2]/20" style={{ background: "rgba(32,236,162,0.04)" }}>
          <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2"><Plus className="w-4 h-4 text-[#20eca2]" /> Add New Service</h3>
          <ServiceForm initial={EMPTY_SERVICE} onSave={d => createMut.mutate(d)} onCancel={() => setAdding(false)} saving={createMut.isPending} />
        </div>
      )}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 text-white/30">No services yet.</div>
      ) : (
        <div className="space-y-3">
          {list.map(svc => (
            <div key={svc.id} data-testid={`card-service-${svc.id}`}>
              {editingId === svc.id ? (
                <div className="rounded-2xl p-6 border border-[#1f58f1]/30" style={{ background: "rgba(31,88,241,0.06)" }}>
                  <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2"><Pencil className="w-4 h-4 text-[#1f58f1]" /> Editing: {svc.title}</h3>
                  <ServiceForm
                    initial={{ title: svc.title, description: svc.description, iconName: svc.iconName, isHot: svc.isHot, sortOrder: svc.sortOrder }}
                    onSave={d => updateMut.mutate({ id: svc.id, data: d })}
                    onCancel={() => setEditingId(null)}
                    saving={updateMut.isPending}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/8 hover:border-white/15 transition-all" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "#20eca2", boxShadow: "0 0 8px rgba(32,236,162,0.4)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{svc.title}</span>
                      {svc.isHot && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#20eca2]/15 text-[#20eca2] border border-[#20eca2]/30">🔥 Hot Selling</span>}
                      <span className="text-white/25 text-xs">#{svc.sortOrder}</span>
                    </div>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{svc.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button data-testid={`button-edit-service-${svc.id}`} onClick={() => { setEditingId(svc.id); setAdding(false); }} className="p-2 rounded-lg text-white/40 hover:text-[#20eca2] hover:bg-[#20eca2]/10 transition-all"><Pencil className="w-4 h-4" /></button>
                    <button data-testid={`button-delete-service-${svc.id}`} onClick={() => { if (confirm(`Delete "${svc.title}"?`)) deleteMut.mutate(svc.id); }} disabled={deleteMut.isPending} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin page ──────────────────────────────────────────────────────────

type TabId = "portfolio" | "services" | "leads" | "formbuilder";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "portfolio",   label: "Portfolio",   icon: Briefcase },
  { id: "services",    label: "Services",    icon: Layers },
  { id: "leads",       label: "Free Website Leads", icon: Users },
  { id: "formbuilder", label: "Form Builder", icon: Sliders },
];

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));
  const [activeTab, setActiveTab] = useState<TabId>("portfolio");
  const [sessionExpired, setSessionExpired] = useState(false);
  const { toast } = useToast();
  const authHeaders = { Authorization: `Bearer ${token}` };

  const forceLogout = () => { localStorage.removeItem("admin_token"); setToken(null); setSessionExpired(true); };

  const handleLogout = async () => {
    try { await fetch("/api/admin/logout", { method: "POST", headers: authHeaders }); } catch {}
    localStorage.removeItem("admin_token"); setToken(null); setSessionExpired(false);
  };

  useEffect(() => {
    document.title = "Admin — Mindy Dev";
    if (!token) return;
    fetch("/api/admin/check", { headers: authHeaders })
      .then(res => { if (res.status === 401) forceLogout(); })
      .catch(() => {});
  }, []);

  if (!token) return <LoginScreen onLogin={t => { setSessionExpired(false); setToken(t); }} sessionExpired={sessionExpired} />;

  return (
    <div className="min-h-screen" style={{ background: "#0f1728" }}>
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1f58f1, #20eca2)" }}>
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">Mindy Dev Admin</h1>
            <p className="text-white/35 text-xs mt-0.5">Content Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium transition-all">
            <Eye className="w-3.5 h-3.5" /> View Site
          </a>
          <button data-testid="button-admin-logout" onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/8 px-6 overflow-x-auto" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex gap-0 min-w-max">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} data-testid={`tab-${id}`} onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap"
              style={activeTab === id ? { color: "#20eca2", borderColor: "#20eca2" } : { color: "rgba(255,255,255,0.4)", borderColor: "transparent" }}>
              <Icon className="w-4 h-4" /> {label}
              {id === "leads" && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-[#20eca2]/15 text-[#20eca2]">NEW</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {activeTab === "portfolio"   && token && <PortfolioTab token={token} onUnauthorized={forceLogout} />}
        {activeTab === "services"    && token && <ServicesTab token={token} onUnauthorized={forceLogout} />}
        {activeTab === "leads"       && token && <AdminLeads token={token} onUnauthorized={forceLogout} />}
        {activeTab === "formbuilder" && token && <AdminFormBuilder token={token} onUnauthorized={forceLogout} />}
      </div>
    </div>
  );
}
