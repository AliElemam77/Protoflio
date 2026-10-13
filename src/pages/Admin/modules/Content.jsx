import { useState } from "react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { Card, Field, TI, TA, TagEditor, RowActions, ConfirmModal, Btn } from "../ui";

export default function Content() {
  const { data, stageData, push } = usePortfolio();
  const [confirm, setConfirm] = useState(null);

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

  const move = (path, i, dir) => stageData((prev) => {
    const keys = path.split(".");
    const root = { ...prev };
    let node = root;
    for (let k = 0; k < keys.length - 1; k++) {
      node[keys[k]] = Array.isArray(node[keys[k]]) ? [...node[keys[k]]] : { ...node[keys[k]] };
      node = node[keys[k]];
    }
    const arr = [...node[keys[keys.length - 1]]];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return prev;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    node[keys[keys.length - 1]] = arr;
    return root;
  });

  const bio = data.about?.body || [];
  const stats = data.about?.stats || [];

  return (
    <div className="flex flex-col gap-4">
      <Card title="BRAND & PERSONAL INFO">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="BRAND LOGO"><TI value={data.brand} onChange={(e) => set("brand", e.target.value)} /></Field>
          <Field label="FULL NAME"><TI value={data.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="ROLE"><TI value={data.role} onChange={(e) => set("role", e.target.value)} /></Field>
          <Field label="LOCATION"><TI value={data.location} onChange={(e) => set("location", e.target.value)} /></Field>
          <Field label="TIMEZONE"><TI value={data.timezone} onChange={(e) => set("timezone", e.target.value)} /></Field>
          <Field label="STATUS BANNER"><TI value={data.status} onChange={(e) => set("status", e.target.value)} /></Field>
        </div>
      </Card>

      <Card title="NAV SECTIONS" sub="Labels drive the menu, indicator and section order. IDs stay fixed so views keep working.">
        <div className="flex flex-col gap-2">
          {(data.sections || []).map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className="w-10 font-mono text-xs text-[#ff4d00]">{s.index}</span>
              <TI value={s.label} onChange={(e) => { const n = [...(data.sections || [])]; n[i] = { ...n[i], label: e.target.value }; set("sections", n); }} className="flex-1" />
              <span className="hidden font-mono text-[10px] text-zinc-600 sm:inline">/{s.id}</span>
              <RowActions onUp={() => move("sections", i, -1)} onDown={() => move("sections", i, 1)} disableUp={i === 0} disableDown={i === (data.sections || []).length - 1}
                onDelete={() => setConfirm({ title: "REMOVE SECTION?", body: `Hide "${s.label}" from navigation?`, fn: () => set("sections", (data.sections || []).filter((x) => x.id !== s.id)) })} label="section" />
            </div>
          ))}
        </div>
      </Card>

      <Card title="HERO SECTION">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TAGLINE"><TI value={data.hero?.tag} onChange={(e) => set("hero.tag", e.target.value)} /></Field>
          <Field label="LINE 1"><TI value={data.hero?.line1} onChange={(e) => set("hero.line1", e.target.value)} /></Field>
          <Field label="LINE 2"><TI value={data.hero?.line2} onChange={(e) => set("hero.line2", e.target.value)} /></Field>
          <div className="md:col-span-2"><Field label="BLURB"><TA value={data.hero?.blurb} onChange={(e) => set("hero.blurb", e.target.value)} /></Field></div>
          <div className="md:col-span-2"><Field label="META BADGES"><TagEditor values={data.hero?.meta} onChange={(v) => set("hero.meta", v)} /></Field></div>
        </div>
      </Card>

      <Card title="ABOUT SECTION">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TAG"><TI value={data.about?.tag} onChange={(e) => set("about.tag", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="LINE 1"><TI value={data.about?.line1} onChange={(e) => set("about.line1", e.target.value)} /></Field>
            <Field label="LINE 2"><TI value={data.about?.line2} onChange={(e) => set("about.line2", e.target.value)} /></Field>
          </div>
          <Field label="PORTRAIT URL"><TI value={data.about?.portrait} onChange={(e) => set("about.portrait", e.target.value)} /></Field>
          <Field label="PORTRAIT ALT"><TI value={data.about?.portraitAlt} onChange={(e) => set("about.portraitAlt", e.target.value)} /></Field>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-400">BIO PARAGRAPHS</p>
          {bio.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <TA value={p} onChange={(e) => { const next = [...bio]; next[i] = e.target.value; set("about.body", next); }} className="flex-1" />
              <RowActions
                onUp={() => move("about.body", i, -1)} onDown={() => move("about.body", i, 1)}
                disableUp={i === 0} disableDown={i === bio.length - 1}
                onDelete={() => setConfirm({ title: "DELETE PARAGRAPH?", body: "This bio paragraph will be removed.", fn: () => set("about.body", bio.filter((_, j) => j !== i)) })}
              />
            </div>
          ))}
          <Btn onClick={() => set("about.body", [...bio, "New paragraph — click to edit."])}>+ ADD PARAGRAPH</Btn>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-400">COUNTER STATS</p>
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <TI value={s.value} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; set("about.stats", n); }} className="w-24" />
              <TI value={s.label} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], label: e.target.value }; set("about.stats", n); }} className="flex-1" />
              <RowActions onUp={() => move("about.stats", i, -1)} onDown={() => move("about.stats", i, 1)} disableUp={i === 0} disableDown={i === stats.length - 1}
                onDelete={() => setConfirm({ title: "DELETE STAT?", body: `Remove "${s.label}"?`, fn: () => set("about.stats", stats.filter((_, j) => j !== i)) })} />
            </div>
          ))}
          <Btn onClick={() => set("about.stats", [...stats, { value: "00", label: "NEW STAT" }])}>+ ADD STAT</Btn>
        </div>
      </Card>

      <Card title="WORK INTRO & LOADER" sub="Section headers and loading messages.">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="WORK TAG"><TI value={data.work?.tag} onChange={(e) => set("work.tag", e.target.value)} /></Field>
          <Field label="WORK TITLE"><TI value={data.work?.title} onChange={(e) => set("work.title", e.target.value)} /></Field>
          <Field label="FOOTER"><TI value={data.footer} onChange={(e) => set("footer", e.target.value)} /></Field>
        </div>
        <div className="mt-4 grid gap-4">
          <Field label="WORK NOTE"><TA value={data.work?.note} onChange={(e) => set("work.note", e.target.value)} rows={2} /></Field>
          <Field label="LOADER MESSAGES"><TagEditor values={data.loader?.messages} onChange={(v) => set("loader.messages", v)} /></Field>
        </div>
      </Card>

      <ConfirmModal open={!!confirm} title={confirm?.title} body={confirm?.body} onCancel={() => setConfirm(null)}
        onConfirm={() => { confirm?.fn(); setConfirm(null); push("Deleted"); }} />
    </div>
  );
}


