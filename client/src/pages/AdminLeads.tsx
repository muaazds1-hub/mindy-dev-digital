import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Filter, Download, Trash2, Eye, X, Plus,
  Users, Calendar, TrendingUp, Clock, CheckCircle2, XCircle, Phone,
  ChevronLeft, ChevronRight, FileText,
} from "lucide-react";

interface Lead {
  id: number;
  businessName: string;
  ownerName: string;
  businessCategory: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  status: string;
  assignedAgent: string;
  submittedAt: string;
  agreedToContact: boolean;
}

interface LeadAnswer { id: number; leadId: number; questionId: number; fieldKey: string; answerText: string; }
interface LeadFile { id: number; leadId: number; fieldKey: string; originalName: string; mimeType: string; fileSize: number; }
interface LeadNote { id: number; leadId: number; note: string; createdBy: string; createdAt: string; }
interface LeadDetail { lead: Lead; answers: LeadAnswer[]; files: LeadFile[]; notes: LeadNote[]; }

interface LeadsResponse {
  leads: Lead[];
  total: number;
  stats: Record<string, number>;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  contacted: { label: "Contacted", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  completed: { label: "Completed", color: "#20eca2", bg: "rgba(32,236,162,0.15)" },
  rejected:  { label: "Rejected",  color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

const toLabel = (key: string) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtSize = (b: number) => b < 1024 ? `${b}B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1024 / 1024).toFixed(1)}MB`;

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, color: "#999", bg: "rgba(150,150,150,0.1)" };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ color: meta.color, background: meta.bg }}>
      {meta.label}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/50 text-xs font-medium uppercase tracking-wide">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value ?? 0}</div>
    </div>
  );
}

function LeadDetailModal({
  leadId, token, onClose, onUnauthorized,
}: { leadId: number; token: string; onClose: () => void; onUnauthorized: () => void }) {
  const [noteText, setNoteText] = useState("");
  const { toast } = useToast();
  const qc = useQueryClient();
  const authHeaders = { Authorization: `Bearer ${token}` };
  const handle401 = (err: unknown) => { if (err instanceof Error && err.message.startsWith("401:")) { onUnauthorized(); return true; } return false; };

  const { data, isLoading } = useQuery<LeadDetail>({
    queryKey: ["/api/admin/leads", leadId],
    queryFn: () => fetch(`/api/admin/leads/${leadId}`, { headers: authHeaders }).then(r => r.json()),
  });

  const updateMut = useMutation({
    mutationFn: (d: { status?: string; assignedAgent?: string }) =>
      apiRequest("PATCH", `/api/admin/leads/${leadId}`, d, { headers: authHeaders }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/leads", leadId] });
    },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive", description: "Failed to update." }); },
  });

  const noteMut = useMutation({
    mutationFn: (note: string) =>
      apiRequest("POST", `/api/admin/leads/${leadId}/notes`, { note }, { headers: authHeaders }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/leads", leadId] });
      setNoteText("");
      toast({ title: "Note added" });
    },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive", description: "Failed to add note." }); },
  });

  const handleDownloadFile = async (file: LeadFile) => {
    const res = await fetch(`/api/admin/leads/${leadId}/files/${file.id}/download`, { headers: authHeaders });
    if (!res.ok) { toast({ title: "File not found", variant: "destructive" }); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = file.originalName; a.click();
    URL.revokeObjectURL(url);
  };

  const lead = data?.lead;
  const answers = data?.answers ?? [];
  const files = data?.files ?? [];
  const notes = data?.notes ?? [];

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-end" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion_div className="h-full w-full max-w-2xl overflow-y-auto flex flex-col" style={{ background: "#0f1728", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#20eca2]/30 border-t-[#20eca2] rounded-full animate-spin" />
          </div>
        ) : lead ? (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/8 flex items-start justify-between gap-4 sticky top-0 z-10" style={{ background: "#0f1728" }}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-white font-bold text-lg leading-none">{lead.businessName || "Unnamed Business"}</h2>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="text-white/40 text-sm">#{lead.id} · Submitted {fmtDate(lead.submittedAt)}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-8">
              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Owner", value: lead.ownerName },
                  { label: "Category", value: lead.businessCategory },
                  { label: "Email", value: lead.email },
                  { label: "Phone", value: lead.phone },
                  { label: "WhatsApp", value: lead.whatsapp },
                  { label: "Country", value: lead.country },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="text-white/40 text-xs mb-1">{label}</div>
                    <div className="text-white text-sm font-medium">{value || "—"}</div>
                  </div>
                ))}
              </div>

              {/* Status change */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide font-medium block mb-2">Change Status</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_META).map(([key, meta]) => (
                    <button key={key} onClick={() => updateMut.mutate({ status: key })}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                      style={lead.status === key
                        ? { background: meta.bg, color: meta.color, borderColor: meta.color }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.1)" }}>
                      {meta.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign agent */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide font-medium block mb-2">Assigned Agent</label>
                <input
                  type="text"
                  defaultValue={lead.assignedAgent || ""}
                  onBlur={(e) => updateMut.mutate({ assignedAgent: e.target.value })}
                  placeholder="Enter agent name..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm"
                />
              </div>

              {/* All answers */}
              {answers.length > 0 && (
                <div>
                  <h3 className="text-white/50 text-xs uppercase tracking-wide font-medium mb-4">Form Answers</h3>
                  <div className="space-y-3">
                    {answers.filter(a => a.answerText?.trim()).map((a) => (
                      <div key={a.id} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-white/40 text-xs mb-1">{toLabel(a.fieldKey)}</div>
                        <div className="text-white/80 text-sm whitespace-pre-wrap">{a.answerText}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {files.length > 0 && (
                <div>
                  <h3 className="text-white/50 text-xs uppercase tracking-wide font-medium mb-4">Uploaded Files</h3>
                  <div className="space-y-2">
                    {files.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-[#20eca2] flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-white text-sm truncate">{f.originalName}</div>
                            <div className="text-white/35 text-xs">{toLabel(f.fieldKey)} · {fmtSize(f.fileSize || 0)}</div>
                          </div>
                        </div>
                        <button onClick={() => handleDownloadFile(f)}
                          className="p-2 rounded-lg text-white/40 hover:text-[#20eca2] hover:bg-[#20eca2]/10 transition-all flex-shrink-0">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="text-white/50 text-xs uppercase tracking-wide font-medium mb-4">Notes</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    onKeyDown={(e) => { if (e.key === "Enter" && noteText.trim()) noteMut.mutate(noteText.trim()); }}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm"
                  />
                  <button onClick={() => noteText.trim() && noteMut.mutate(noteText.trim())}
                    disabled={noteMut.isPending || !noteText.trim()}
                    className="px-4 py-2.5 rounded-xl text-[#0f1728] text-sm font-bold disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #20eca2, #10b981)" }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {notes.length === 0 ? (
                  <p className="text-white/25 text-sm text-center py-6">No notes yet</p>
                ) : (
                  <div className="space-y-3">
                    {notes.map((n) => (
                      <div key={n.id} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-white/80 text-sm">{n.note}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-white/30 text-xs">{n.createdBy}</span>
                          <span className="text-white/15 text-xs">·</span>
                          <span className="text-white/30 text-xs">{fmtDate(n.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/30">Lead not found</div>
        )}
      </motion_div>
    </div>
  );
}

// Simple motion wrapper (no framer-motion dep needed here)
function motion_div({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={className} style={style}>{children}</div>;
}

export default function AdminLeads({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();
  const authHeaders = { Authorization: `Bearer ${token}` };
  const handle401 = (err: unknown) => { if (err instanceof Error && err.message.startsWith("401:")) { onUnauthorized(); return true; } return false; };

  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  if (statusFilter) params.set("status", statusFilter);

  const { data, isLoading } = useQuery<LeadsResponse>({
    queryKey: ["/api/admin/leads", search, statusFilter, page],
    queryFn: () => fetch(`/api/admin/leads?${params}`, { headers: authHeaders }).then(r => r.json()),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/leads/${id}`, undefined, { headers: authHeaders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/leads"] }); toast({ title: "Lead deleted" }); },
    onError: (err) => { if (!handle401(err)) toast({ title: "Error", variant: "destructive", description: "Failed to delete." }); },
  });

  const handleExportCSV = async () => {
    const res = await fetch("/api/admin/leads/export/csv", { headers: authHeaders });
    if (!res.ok) { toast({ title: "Export failed", variant: "destructive" }); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mindy-dev-leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const stats = data?.stats ?? {};
  const leads = data?.leads ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Free Website Leads</h2>
          <p className="text-white/40 text-sm mt-1">{stats.total ?? 0} total leads collected</p>
        </div>
        <button onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total" value={stats.total} icon={Users} color="#20eca2" />
        <StatCard label="Today" value={stats.today} icon={Calendar} color="#3b82f6" />
        <StatCard label="This Week" value={stats.thisWeek} icon={TrendingUp} color="#8b5cf6" />
        <StatCard label="This Month" value={stats.thisMonth} icon={Clock} color="#f59e0b" />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <button key={key} onClick={() => setStatusFilter(statusFilter === key ? "" : key)}
            className="rounded-2xl p-4 border text-left transition-all"
            style={{
              background: statusFilter === key ? `${meta.bg}` : "rgba(255,255,255,0.02)",
              borderColor: statusFilter === key ? `${meta.color}40` : "rgba(255,255,255,0.06)",
            }}>
            <div className="text-xs font-medium mb-1" style={{ color: meta.color }}>{meta.label}</div>
            <div className="text-xl font-bold text-white">{stats[key] ?? 0}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone..."
            data-testid="input-leads-search"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#20eca2]/50 text-sm"
          />
        </div>
        {statusFilter && (
          <button onClick={() => setStatusFilter("")}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-white/60 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" /> {STATUS_META[statusFilter]?.label}
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 text-white/25 text-sm">
          {search || statusFilter ? "No leads match your search." : "No leads yet. They'll appear here after someone submits the form."}
        </div>
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["#", "Business", "Category", "Email", "Phone", "Country", "Status", "Date", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-white/40 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={lead.id} data-testid={`row-lead-${lead.id}`}
                    className="border-b border-white/5 hover:bg-white/3 transition-all cursor-pointer"
                    onClick={() => setSelectedLeadId(lead.id)}
                    style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                    <td className="px-4 py-3 text-white/30 text-xs">#{lead.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-semibold text-xs truncate max-w-[140px]">{lead.businessName || "—"}</div>
                      <div className="text-white/40 text-xs truncate max-w-[140px]">{lead.ownerName}</div>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs truncate max-w-[100px]">{lead.businessCategory || "—"}</td>
                    <td className="px-4 py-3 text-white/60 text-xs truncate max-w-[140px]">{lead.email || "—"}</td>
                    <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">{lead.phone || "—"}</td>
                    <td className="px-4 py-3 text-white/60 text-xs">{lead.country || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{fmtDate(lead.submittedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedLeadId(lead.id)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-[#20eca2] hover:bg-[#20eca2]/10 transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { if (confirm(`Delete lead #${lead.id}?`)) deleteMut.mutate(lead.id); }}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40 text-xs">Showing {leads.length} of {total} leads</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white/60 text-xs px-2">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Lead detail panel */}
      {selectedLeadId !== null && (
        <LeadDetailModal
          leadId={selectedLeadId}
          token={token}
          onClose={() => setSelectedLeadId(null)}
          onUnauthorized={onUnauthorized}
        />
      )}
    </div>
  );
}
