import { useEffect, useMemo, useState } from "react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { Card, Field, TI, TA, Sel, TagEditor, ColorF, RowActions, ConfirmModal, Btn, Empty, uid } from "../ui";

const STATUSES = ["LIVE", "PRODUCTION", "PROJECT", "COLLABORATION"];

const blankProject = () => ({
  id: uid("proj"), title: "NEW PROJECT", category: "NEW CATEGORY",
  desc: "Describe the project…", tags: ["React"], status: "PROJECT",
  tint: ["#ff4d00", "#3a1200"], live: "", repo: "", image: "",
});

export default function Projects() {
  const { data, stageData, push } = usePortfolio();
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("ALL");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const projects = useMemo(() => data.projects || [], [data.projects]);
  const filtered = useMemo(() => projects.filter((p) => {
    const hit = `${p.title} ${p.category} ${(p.tags || []).join(" ")}`.toLowerCase().includes(q.toLowerCase());
    return hit && (statusF === "ALL" || p.status === statusF);
  }), [projects, q, statusF]);

  const mutate = (id, patch) => stageData((prev) => ({
    ...prev, projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  }));
  const remove = (id) => stageData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  const move = (i, dir) => stageData((prev) => {
    const arr = [...prev.projects];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return prev;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return { ...prev, projects: arr };
  });

  const draft = editing ? projects.find((p) => p.id === editing) : null;

  // ESC closes the drawer; lock body scroll while open.
  useEffect(() => {
    if (!draft) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setEditing(null); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [draft]);

  return (
    <div className="flex flex-col gap-4">
      <Card
        title={`ALL PROJECTS — ${projects.length}`}
        sub="Full CRUD. Reorder with arrows, edit inline in the drawer."
        right={<Btn variant="primary" onClick={() => { const b = blankProject(); stageData((p) => ({ ...p, projects: [b, ...p.projects] })); setEditing(b.id); }}>+ NEW PROJECT</Btn>}
      >
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, category, tags…" className="w-full rounded-lg border border-[#27272a] bg-[#080808] px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-[#ff4d00] sm:flex-1" />
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="rounded-lg border border-[#27272a] bg-[#080808] px-3 py-2.5 text-sm text-zinc-200">
            <option value="ALL">ALL STATUS</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {filtered.length === 0 && <Empty text="NO PROJECTS MATCH" />}
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((p) => {
            const gi = projects.findIndex((x) => x.id === p.id);
            return (
              <article key={p.id} className="rounded-xl border border-[#27272a] bg-[#0a0a0a] p-4 transition-colors hover:border-[#ff4d00]/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-lg border border-white/10" style={{ background: `linear-gradient(135deg, ${p.tint?.[0] || "#ff4d00"}, ${p.tint?.[1] || "#222"})` }} />
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <p className="font-mono text-[9px] tracking-[0.25em] text-zinc-500">{p.category}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-[#ff4d00]/40 px-2 py-0.5 font-mono text-[9px] text-[#ff4d00]">{p.status}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">{p.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Btn onClick={() => setEditing(p.id)}>EDIT</Btn>
                  <RowActions onUp={() => move(gi, -1)} onDown={() => move(gi, 1)} disableUp={gi === 0} disableDown={gi === projects.length - 1}
                    onDelete={() => setConfirm({ title: "DELETE PROJECT?", body: `Permanently remove "${p.title}"?`, fn: () => { remove(p.id); push("Project deleted"); } })} />
                </div>
              </article>
            );
          })}
        </div>
      </Card>

      {/* Edit drawer */}
      {draft && (
        <div className="fixed inset-0 z-[300] flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="h-full w-full max-w-lg overflow-y-auto border-l border-[#27272a] bg-[#0c0c0c] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.4em] text-[#ff4d00]">EDITING PROJECT</p>
                <h3 className="font-display text-2xl text-white">{draft.title}</h3>
              </div>
              <Btn onClick={() => setEditing(null)}>CLOSE ✕</Btn>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="TITLE"><TI autoFocus value={draft.title} onChange={(e) => mutate(draft.id, { title: e.target.value })} /></Field>
                <Field label="STATUS"><Sel value={draft.status} onChange={(e) => mutate(draft.id, { status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</Sel></Field>
              </div>
              <Field label="CATEGORY"><TI value={draft.category} onChange={(e) => mutate(draft.id, { category: e.target.value })} /></Field>
              <Field label="SHORT DESCRIPTION"><TA value={draft.desc} onChange={(e) => mutate(draft.id, { desc: e.target.value })} rows={4} /></Field>
              <Field label="TAGS"><TagEditor values={draft.tags} onChange={(v) => mutate(draft.id, { tags: v })} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="TINT COLOR 1"><ColorF value={draft.tint?.[0]} onChange={(v) => mutate(draft.id, { tint: [v, draft.tint?.[1] || "#3a1200"] })} /></Field>
                <Field label="TINT COLOR 2"><ColorF value={draft.tint?.[1]} onChange={(e) => mutate(draft.id, { tint: [draft.tint?.[0] || "#ff4d00", e] })} /></Field>
              </div>
              <div className="h-16 rounded-xl border border-white/10" style={{ background: `linear-gradient(135deg, ${draft.tint?.[0]}, ${draft.tint?.[1]})` }} />
              <Field label="LIVE URL"><TI value={draft.live || ""} onChange={(e) => mutate(draft.id, { live: e.target.value })} placeholder="https://…" /></Field>
              <Field label="GITHUB REPO URL"><TI value={draft.repo || ""} onChange={(e) => mutate(draft.id, { repo: e.target.value })} placeholder="https://github.com/…" /></Field>
              <Field label="IMAGE / POSTER URL"><TI value={draft.image || ""} onChange={(e) => mutate(draft.id, { image: e.target.value })} placeholder="/work/shot.webp" /></Field>
              {draft.image && <img src={draft.image} alt="" className="h-40 w-full rounded-xl border border-[#27272a] object-cover object-top" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
              <div className="flex gap-2">
                <Btn variant="primary" onClick={() => { setEditing(null); push("Project saved"); }}>DONE</Btn>
                <Btn variant="danger" onClick={() => setConfirm({ title: "DELETE PROJECT?", body: `Permanently remove "${draft.title}"?`, fn: () => { remove(draft.id); setEditing(null); push("Project deleted"); } })}>DELETE</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirm} title={confirm?.title} body={confirm?.body} onCancel={() => setConfirm(null)} onConfirm={() => { confirm?.fn(); setConfirm(null); }} />
    </div>
  );
}

