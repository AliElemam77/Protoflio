import { useState } from "react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { Card, Btn, Toggle, Empty } from "../ui";

export default function Overview({ go }) {
  const { data, admin, stageAdmin, storageUsage, exportProfileJS, exportThemeCSS, exportBackup } = usePortfolio();
  const [preview, setPreview] = useState(false);
  const roles = data.experience?.roles || [];
  const liveRoles = roles.filter((r) => /PRESENT/i.test(r.period || "")).length;

  const stats = [
    { k: "SHIPPED PROJECTS", v: data.projects?.length || 0, fn: () => go("projects") },
    { k: "ACTIVE ROLES", v: liveRoles, fn: () => go("career") },
    { k: "SKILL TAGS", v: data.skills?.length || 0, fn: () => go("skills") },
    { k: "JOURNEY STAGES", v: data.journey?.stages?.length || 0, fn: () => go("career") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card title="GETTING STARTED" sub="New here? Three steps and you're live. Press keys 1–7 to jump between modules.">
        <ol className="grid gap-2 sm:grid-cols-3">
          {[
            { n: "1", t: "EDIT CONTENT", d: "Profile, hero, projects, journey.", fn: () => go("content") },
            { n: "2", t: "PICK A LOOK", d: "Preset or custom theme + FX.", fn: () => go("appearance") },
            { n: "3", t: "READ INBOX", d: `${admin.inquiries?.filter((i) => !i.read).length || 0} unread messages.`, fn: () => go("skills") },
          ].map((s) => (
            <button key={s.n} type="button" onClick={s.fn} className="group rounded-xl border border-[#27272a] p-4 text-left transition-all hover:border-[#ff4d00]/60">
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#ff4d00]">STEP {s.n}</p>
              <p className="mt-1 text-sm font-bold text-white group-hover:text-[#ff4d00]">{s.t} →</p>
              <p className="mt-1 text-xs text-zinc-500">{s.d}</p>
            </button>
          ))}
        </ol>
      </Card>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <button key={s.k} type="button" onClick={s.fn} className="group rounded-2xl border border-[#27272a] bg-[#0e0e0e]/90 p-5 text-left transition-all hover:border-[#ff4d00]/60">
            <p className="font-display text-4xl text-white group-hover:text-[#ff4d00]">{s.v}<span className="text-[#ff4d00]">.</span></p>
            <p className="mt-2 font-mono text-[9px] tracking-[0.3em] text-zinc-500">{s.k}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="OPPORTUNITY BADGE" sub="Controls the OPEN TO OPPORTUNITIES meta badge in the hero.">
          <Toggle
            checked={!!admin.openForOpportunities}
            onChange={(v) => stageAdmin((a) => ({ ...a, openForOpportunities: v }))}
            label={admin.openForOpportunities ? "Badge is VISIBLE on the site" : "Badge is HIDDEN"}
          />
          <p className="mt-3 text-xs text-zinc-500">Hero meta preview: {(data.hero?.meta || []).filter((m) => admin.openForOpportunities || !/OPPORTUNIT/i.test(m)).join(" · ") || "—"}</p>
        </Card>
        <Card title="SYSTEM STATUS">
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-[#27272a] p-3"><dt className="font-mono text-[9px] tracking-[0.3em] text-zinc-500">STORAGE</dt><dd className="mt-1 font-mono text-white">{(storageUsage.bytes / 1024).toFixed(1)} KB · {storageUsage.keys} keys</dd></div>
            <div className="rounded-lg border border-[#27272a] p-3"><dt className="font-mono text-[9px] tracking-[0.3em] text-zinc-500">LAST UPDATED</dt><dd className="mt-1 font-mono text-white">{admin.lastUpdated ? new Date(admin.lastUpdated).toLocaleString() : "—"}</dd></div>
            <div className="rounded-lg border border-[#27272a] p-3"><dt className="font-mono text-[9px] tracking-[0.3em] text-zinc-500">INQUIRIES</dt><dd className="mt-1 font-mono text-white">{admin.inquiries?.length || 0} total · {admin.inquiries?.filter((i) => !i.read).length || 0} unread</dd></div>
            <div className="rounded-lg border border-[#27272a] p-3"><dt className="font-mono text-[9px] tracking-[0.3em] text-zinc-500">SECTIONS</dt><dd className="mt-1 font-mono text-white">{(data.sections || []).map((s) => s.label).join(" / ")}</dd></div>
          </dl>
        </Card>
      </div>

      <Card
        title="LIVE PREVIEW"
        sub="Split-screen preview of the real portfolio reading the same live store. Edit anywhere and watch it update."
        right={<Btn onClick={() => setPreview(!preview)}>{preview ? "HIDE" : "SHOW"} PREVIEW</Btn>}
      >
        {preview ? (
          <div className="overflow-hidden rounded-xl border border-[#27272a]">
            <div className="flex items-center gap-2 border-b border-[#27272a] bg-[#0a0a0a] px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-2 font-mono text-[10px] text-zinc-500">localhost — live store</span>
              <a href="/" target="_blank" rel="noreferrer" className="ml-auto font-mono text-[10px] tracking-[0.2em] text-[#ff4d00]">OPEN FULL ↗</a>
            </div>
            <iframe title="Live portfolio preview" src="/" className="h-[60vh] w-full bg-[#080808]" />
          </div>
        ) : <Empty text="PREVIEW HIDDEN — TOGGLE TO INSPECT LIVE CHANGES" />}
      </Card>

      <Card title="QUICK EXPORT" sub="One-click code generation for hand-off back to source files.">
        <div className="flex flex-wrap gap-2">
          <Btn variant="primary" onClick={exportProfileJS}>EXPORT profile.js</Btn>
          <Btn onClick={exportThemeCSS}>EXPORT THEME CSS</Btn>
          <Btn onClick={exportBackup}>BACKUP JSON</Btn>
        </div>
      </Card>
    </div>
  );
}

