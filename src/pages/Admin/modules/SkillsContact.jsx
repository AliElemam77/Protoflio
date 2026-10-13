import { useState } from "react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { Card, Field, TI, TA, TagEditor, RowActions, ConfirmModal, Btn, Empty, uid } from "../ui";

export default function SkillsContact() {
  const { data, admin, stageData, stageAdmin, push } = usePortfolio();
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [inboxFilter, setInboxFilter] = useState("ALL");

  const skills = data.skills || [];
  const shownIdx = skills
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.toLowerCase().includes(q.toLowerCase()));
  const moveSkill = (shownPos, dir) => stageData((prev) => {
    const from = shownIdx[shownPos]?.i;
    const to = shownIdx[shownPos + dir]?.i;
    if (from == null || to == null) return prev;
    const arr = [...prev.skills];
    [arr[from], arr[to]] = [arr[to], arr[from]];
    return { ...prev, skills: arr };
  });
  const deleteSkillAt = (realIdx) => stageData((p) => ({
    ...p,
    skills: p.skills.filter((_, j) => j !== realIdx),
  }));

  const set = (path, value) => stageData((prev) => {
    const keys = path.split(".");
    const root = { ...prev };
    let node = root;
    for (let i = 0; i < keys.length - 1; i++) {
      node[keys[i]] = Array.isArray(node[keys[i]]) ? [...node[keys[i]]] : { ...(node[keys[i]] || {}) };
      node = node[keys[i]];
    }
    node[keys[keys.length - 1]] = value;
    return root;
  });

  const socials = data.contact?.socials || [];
  const inquiries = admin.inquiries || [];
  const unread = inquiries.filter((i) => !i.read).length;
  const visibleInquiries = inquiries.filter((i) => {
    if (inboxFilter === "UNREAD") return !i.read;
    if (inboxFilter === "READ") return i.read;
    return true;
  });

  const exportCSV = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["name", "email", "date", "read", "message"],
      ...inquiries.map((i) => [esc(i.name), esc(i.email), esc(i.date), i.read ? "read" : "new", esc(i.message)])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "inquiries.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    push("Inquiries exported as CSV");
  };

  return (
    <div className="flex flex-col gap-4">
      <Card title={`SKILLS CLOUD — ${skills.length}`} sub="Feeds the big marquee in About. Enter adds, arrows reorder. Duplicates are safe — moves use position, not name.">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter skills…" aria-label="Filter skills" className="mb-3 w-full rounded-lg border border-[#27272a] bg-[#080808] px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-[#ff4d00]" />
        <div className="flex flex-wrap gap-1.5">
          {shownIdx.map(({ s, i }, pos) => (
            <span key={`${s}-${i}`} className="inline-flex items-center gap-1 rounded-full border border-[#27272a] bg-[#161616] py-1 pl-3 pr-1.5 font-mono text-[10px] tracking-[0.15em] text-zinc-200">
              {s}
              <button type="button" disabled={pos === 0} onClick={() => moveSkill(pos, -1)} aria-label={`Move ${s} left`} className="text-zinc-500 hover:text-white disabled:opacity-20">‹</button>
              <button type="button" disabled={pos === shownIdx.length - 1} onClick={() => moveSkill(pos, 1)} aria-label={`Move ${s} right`} className="text-zinc-500 hover:text-white disabled:opacity-20">›</button>
              <button type="button" onClick={() => setConfirm({ title: "DELETE SKILL?", body: `Remove "${s}" from the cloud?`, fn: () => deleteSkillAt(i) })} aria-label={`Delete ${s}`} className="text-zinc-500 hover:text-red-400">×</button>
            </span>
          ))}
        </div>
        {shownIdx.length === 0 && <div className="mt-2"><Empty text="NO SKILLS MATCH" /></div>}
        <div className="mt-3"><TagEditor values={[]} onChange={(v) => { if (v.length) stageData((p) => ({ ...p, skills: [...p.skills, ...v.filter((x) => !p.skills.includes(x))] })); }} placeholder="Add new skill + Enter (duplicates skipped)" /></div>
      </Card>

      <Card title="CONTACT COPY">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TAG"><TI value={data.contact?.tag} onChange={(e) => set("contact.tag", e.target.value)} /></Field>
          <Field label="EMAIL"><TI value={data.contact?.email} onChange={(e) => set("contact.email", e.target.value)} /></Field>
          <Field label="LINE 1"><TI value={data.contact?.line1} onChange={(e) => set("contact.line1", e.target.value)} /></Field>
          <Field label="LINE 2"><TI value={data.contact?.line2} onChange={(e) => set("contact.line2", e.target.value)} /></Field>
          <div className="md:col-span-2"><Field label="BLURB"><TA value={data.contact?.blurb} onChange={(e) => set("contact.blurb", e.target.value)} rows={2} /></Field></div>
          <Field label="CV LABEL"><TI value={data.contact?.cv?.label} onChange={(e) => set("contact.cv.label", e.target.value)} /></Field>
          <Field label="CV URL / PATH"><TI value={data.contact?.cv?.href} onChange={(e) => set("contact.cv.href", e.target.value)} /></Field>
        </div>
      </Card>

      <Card title={`SOCIAL LINKS — ${socials.length}`} right={<Btn variant="primary" onClick={() => set("contact.socials", [...socials, { id: uid("soc"), label: "New", href: "https://" }])}>+ ADD</Btn>}>
        <div className="flex flex-col gap-2">
          {socials.map((s, i) => (
            <div key={s.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <TI value={s.label} onChange={(e) => { const n = [...socials]; n[i] = { ...n[i], label: e.target.value }; set("contact.socials", n); }} className="sm:w-32" aria-label="Link label" />
              <TI value={s.href} onChange={(e) => { const n = [...socials]; n[i] = { ...n[i], href: e.target.value }; set("contact.socials", n); }} className="flex-1" aria-label="Link URL" />
              <RowActions onUp={() => { const n = [...socials]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; set("contact.socials", n); }}
                onDown={() => { const n = [...socials]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; set("contact.socials", n); }}
                disableUp={i === 0} disableDown={i === socials.length - 1}
                onDelete={() => setConfirm({ title: "DELETE LINK?", body: `Remove "${s.label}"?`, fn: () => set("contact.socials", socials.filter((x) => x.id !== s.id)) })} />
            </div>
          ))}
        </div>
      </Card>

      <Card
        title={`INQUIRIES LOG — ${inquiries.length} (${unread} NEW)`}
        sub="Local inbox for contact-form messages. Reply via email, export, or simulate one."
        right={<Btn onClick={exportCSV} disabled={inquiries.length === 0}>EXPORT CSV</Btn>}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <Btn onClick={() => stageAdmin((a) => ({ ...a, inquiries: [{ id: uid("inq"), name: "Test Visitor", email: "visitor@test.com", message: "Hello — love the work, let's talk!", date: new Date().toISOString(), read: false }, ...(a.inquiries || [])] }))}>+ SIMULATE INQUIRY</Btn>
          <Btn onClick={() => stageAdmin((a) => ({ ...a, inquiries: (a.inquiries || []).map((x) => ({ ...x, read: true })) }))} disabled={unread === 0}>MARK ALL READ</Btn>
          <div className="ml-auto flex gap-1" role="group" aria-label="Filter inquiries">
            {["ALL", "UNREAD", "READ"].map((f) => (
              <button key={f} type="button" onClick={() => setInboxFilter(f)} className={`rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] ${inboxFilter === f ? "border-[#ff4d00] bg-[#ff4d00]/10 text-white" : "border-[#27272a] text-zinc-500 hover:text-zinc-200"}`}>{f}</button>
            ))}
          </div>
        </div>
        {visibleInquiries.length === 0 && <Empty text={inquiries.length === 0 ? "INBOX EMPTY" : `NO ${inboxFilter} MESSAGES`} />}
        {/* Mobile cards */}
        <div className="flex flex-col gap-2 md:hidden">
          {visibleInquiries.map((inq) => (
            <article key={inq.id} className={`rounded-xl border p-3 ${!inq.read ? "border-[#ff4d00]/40 bg-[#ff4d00]/5" : "border-[#27272a] bg-[#0a0a0a]"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] ${inq.read ? "bg-zinc-800 text-zinc-400" : "bg-[#ff4d00]/20 text-[#ff4d00]"}`}>{inq.read ? "READ" : "NEW"}</span>
                <span className="font-mono text-[10px] text-zinc-500">{new Date(inq.date).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm font-bold text-zinc-100">{inq.name}</p>
              <a href={`mailto:${inq.email}`} className="font-mono text-[11px] text-[#ff4d00]">{inq.email}</a>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{inq.message}</p>
              <div className="mt-2 flex gap-1.5">
                <a href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: your message to ${data.name || "me"}`)}&body=${encodeURIComponent(`Hi ${inq.name},\n\n`)}`} className="flex-1 rounded-md border border-[#27272a] px-2 py-1.5 text-center font-mono text-[10px] text-zinc-200">REPLY</a>
                <button type="button" onClick={() => stageAdmin((a) => ({ ...a, inquiries: a.inquiries.map((x) => (x.id === inq.id ? { ...x, read: !x.read } : x)) }))} className="flex-1 rounded-md border border-[#27272a] px-2 py-1.5 font-mono text-[10px] text-zinc-300">{inq.read ? "UNREAD" : "READ"}</button>
                <button type="button" onClick={() => setConfirm({ title: "DELETE INQUIRY?", body: `Remove message from ${inq.name}?`, fn: () => stageAdmin((a) => ({ ...a, inquiries: a.inquiries.filter((x) => x.id !== inq.id) })) })} className="rounded-md border border-red-900/50 px-3 py-1.5 font-mono text-[10px] text-red-400">DEL</button>
              </div>
            </article>
          ))}
        </div>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="font-mono text-[9px] tracking-[0.3em] text-zinc-500">
                <th className="border-b border-[#27272a] p-2">STATUS</th>
                <th className="border-b border-[#27272a] p-2">FROM</th>
                <th className="border-b border-[#27272a] p-2">MESSAGE</th>
                <th className="border-b border-[#27272a] p-2">DATE</th>
                <th className="border-b border-[#27272a] p-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {visibleInquiries.map((inq) => (
                <tr key={inq.id} className={!inq.read ? "bg-[#ff4d00]/5" : ""}>
                  <td className="border-b border-[#1c1c1c] p-2">
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] ${inq.read ? "bg-zinc-800 text-zinc-400" : "bg-[#ff4d00]/20 text-[#ff4d00]"}`}>{inq.read ? "READ" : "NEW"}</span>
                  </td>
                  <td className="border-b border-[#1c1c1c] p-2"><p className="font-bold text-zinc-100">{inq.name}</p><a href={`mailto:${inq.email}`} className="font-mono text-[10px] text-zinc-500 hover:text-[#ff4d00]">{inq.email}</a></td>
                  <td className="max-w-[240px] truncate border-b border-[#1c1c1c] p-2 text-zinc-400" title={inq.message}>{inq.message}</td>
                  <td className="border-b border-[#1c1c1c] p-2 font-mono text-[10px] text-zinc-500">{new Date(inq.date).toLocaleString()}</td>
                  <td className="border-b border-[#1c1c1c] p-2">
                    <div className="flex justify-end gap-1.5">
                      <a href={`mailto:${inq.email}?subject=${encodeURIComponent("Re: your message")}&body=${encodeURIComponent(`Hi ${inq.name},\n\n`)}`} className="rounded-md border border-[#27272a] px-2 py-1 font-mono text-[10px] text-zinc-300 hover:border-[#ff4d00]">REPLY</a>
                      <button type="button" onClick={() => stageAdmin((a) => ({ ...a, inquiries: a.inquiries.map((x) => (x.id === inq.id ? { ...x, read: !x.read } : x)) }))} className="rounded-md border border-[#27272a] px-2 py-1 font-mono text-[10px] text-zinc-300 hover:border-[#ff4d00]">{inq.read ? "UNREAD" : "READ"}</button>
                      <button type="button" onClick={() => setConfirm({ title: "DELETE INQUIRY?", body: `Remove message from ${inq.name}?`, fn: () => stageAdmin((a) => ({ ...a, inquiries: a.inquiries.filter((x) => x.id !== inq.id) })) })} className="rounded-md border border-red-900/50 px-2 py-1 font-mono text-[10px] text-red-400 hover:border-red-500">DEL</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmModal open={!!confirm} title={confirm?.title} body={confirm?.body} onCancel={() => setConfirm(null)} onConfirm={() => { confirm?.fn(); setConfirm(null); push("Deleted"); }} />
    </div>
  );
}
