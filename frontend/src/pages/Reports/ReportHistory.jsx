import { useEffect, useMemo, useState } from "react";
import { FileText, History as HistoryIcon, Play, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
import { reportService } from "../../services/reportService";
import { interviewService } from "../../services/interviewService";

export const ReportHistory = () => {
  const [items, setItems] = useState([]); const [status, setStatus] = useState("all"); const [dateRange, setDateRange] = useState("all"); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [deletingId, setDeletingId] = useState(null); const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  useEffect(() => { reportService.getHistory().then(setItems).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => items.filter((item) => {
    const age = Date.now() - new Date(item.startedAt).getTime();
    return (status === "all" || item.status === status)
      && (dateRange === "all" || age <= Number(dateRange) * 86400000);
  }), [items, status, dateRange]);
  const completed = items.filter((item) => item.status === "completed");
  const scores = completed.map((item) => item.report?.overallScore).filter((value) => typeof value === "number");
  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      await interviewService.deleteSession(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.message || "Failed to delete interview.");
    } finally {
      setDeletingId(null);
    }
  };
  return <div className="py-10 bg-[#fbfdfc] min-h-[90vh]"><Container size="lg">
    <div className="mb-8"><span className="text-xs font-bold uppercase tracking-wider text-[#008f4c]">Progress</span><h1 className="text-3xl font-bold text-slate-900 mt-1">Interview history</h1></div>
    {loading ? <p className="text-slate-500">Loading your interviews...</p> : error ? <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">{error}</div> : <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">{[["Total interviews", items.length], ["Completed", completed.length], ["Average score", scores.length ? `${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%` : "—"], ["Best score", scores.length ? `${Math.max(...scores)}%` : "—"]].map(([label, value]) => <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4"><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-900 mt-1">{value}</p></div>)}</div>
      <div className="flex flex-wrap gap-2 mb-4"><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 p-2 text-sm"><option value="all">All statuses</option><option value="completed">Completed</option><option value="in_progress">In progress</option></select><select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="rounded-xl border border-slate-200 p-2 text-sm"><option value="all">All dates</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></div>
      {filtered.length === 0 ? <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500"><HistoryIcon className="mx-auto mb-2 w-8 h-8 text-slate-300" />No interview history yet.</div> : <div className="space-y-3">{filtered.map((item) => <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center gap-4 justify-between"><div className="min-w-0 flex-1"><p className="font-bold text-slate-900 truncate">{item.targetRole}</p><p className="text-xs text-slate-500 mt-1">{item.interviewType || "Technical Interview"} · {new Date(item.startedAt).toLocaleDateString()} · {item.difficulty} · {item.answeredQuestions}/{item.questionCount} answered</p></div><div className="flex flex-nowrap items-center gap-1 sm:gap-2 text-sm min-w-0 max-w-full overflow-visible">{item.status === "in_progress" && <><span className="shrink-0 px-1.5 sm:px-2 py-1 rounded-full bg-amber-50 text-amber-700">in progress</span><button type="button" aria-label="Delete in-progress interview" title="Delete interview" disabled={deletingId === item.id} onClick={() => setConfirmDeleteId(item.id)} className="shrink-0 rounded-md p-1 text-rose-600 transition-colors duration-150 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button></>}{item.status === "completed" && <><span className="shrink-0 px-1.5 sm:px-2 py-1 rounded-full bg-[#e8faf1] text-[#008f4c]">completed</span>{item.report?.overallScore != null && <span className="shrink-0 px-1.5 sm:px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">{item.report.overallScore}/100</span>}<Link className="shrink-0" to={`/interview/${item.id}/report`}><Button className="max-[639px]:px-1.5 max-[639px]:gap-1 max-[639px]:text-[10px]" variant="outline" size="sm">Detailed report</Button></Link><Button className="shrink-0 max-[639px]:px-1.5 max-[639px]:gap-1 max-[639px]:text-[10px]" variant="outline" size="sm" onClick={() => reportService.downloadResume(item.id)} icon={<FileText className="w-3.5 h-3.5" />}>Resume</Button></>}{item.status === "in_progress" && <Link className="shrink-0" to={`/interview/${item.id}`}><Button className="max-[639px]:px-1.5 max-[639px]:gap-1 max-[639px]:text-[10px]" size="sm" icon={<Play className="w-3.5 h-3.5" />}>Resume</Button></Link>}</div></div>)}</div>}
      {confirmDeleteId && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-interview-title">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
          <h2 id="delete-interview-title" className="text-lg font-bold text-slate-900">Delete interview?</h2>
          <p className="mt-2 text-sm text-slate-500">This in-progress interview and its saved answers will be permanently removed.</p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setConfirmDeleteId(null)} disabled={deletingId === confirmDeleteId} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Keep</button>
            <button type="button" onClick={() => handleDelete(confirmDeleteId)} disabled={deletingId === confirmDeleteId} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">{deletingId === confirmDeleteId ? "Deleting..." : "Delete"}</button>
          </div>
        </div>
      </div>}
    </>}</Container></div>;
};
