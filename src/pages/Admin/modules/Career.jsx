import { useState } from "react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { Card, Field, TI, TA, TagEditor, RowActions, ConfirmModal, Btn, Empty, uid } from "../ui";

const blankStage = (n) => ({
  id: uid("stage"), index: String(n).padStart(2, "0"), badge: "NEW MILESTONE",
  title: "New Stage", role: "Role", period: "2026", kind: "KIND", headline: "Headline",
  summary: "Summary…", stack: ["React"], side: "left", videoTime: { start: 0, end: 4 },
});

const blankRole = () => ({
  id: uid("role"), period: "2026 — PRESENT", title: "ROLE TITLE", org: "ORGANIZATION",
  orgHref: "", kind: "LOCATION", summary: "Summary…", stack: ["React"],
});

export default function Career() {
  const { data, stageData, push } = usePortfolio();
  const [confirm, setConfirm] = useState(null);
  const [openStage, setOpenStage] = useState(null);
  const [openRole, setOpenRole] = useState(null);

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

  const stages = data.journey?.stages || [];
  const roles = data.experience?.roles || [];
  const edStage = stages.find((s) => s.id === openStage);
  const edRole = roles.find((r) => r.id === openRole);
  const mutArr = (path, id, patch) => stageData((prev) => {
    const keys = path.split(".");
    const root = { ...prev };
    let node = root;
    for (let k = 0; k < keys.length - 1; k++) {
      node[keys[k]] = Array.isArray(node[keys[k]]) ? [...node[keys[k]]] : { ...node[keys[k]] };
      node = node[keys[k]];
    }
    node[keys[keys.length - 1]] = node[keys[keys.length - 1]].map((x) => (x.id === id ? { ...x, ...patch } : x));
    return root;
  });

  return (
    <div className="flex flex-col gap-4">
      <Card title="JOURNEY HEADER" sub="Section titles, background video and poster.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TAG"><TI value={data.journey?.tag} onChange={(e) => set("journey.tag", e.target.value)} /></Field>
          <Field label="TITLE"><TI value={data.journey?.title} onChange={(e) => set("journey.title", e.target.value)} /></Field>
          <Field label="ARABIC TITLE"><TI value={data.journey?.arabicTitle} onChange={(e) => set("journey.arabicTitle", e.target.value)} /></Field>
          <Field label="NOTE"><TI value={data.journey?.note} onChange={(e) => set("journey.note", e.target.value)} /></Field>
          <Field label="VIDEO SRC"><TI value={data.journey?.video?.src} onChange={(e) => set("journey.video.src", e.target.value)} /></Field>
          <Field label="VIDEO POSTER"><TI value={data.journey?.video?.poster} onChange={(e) => set("journey.video.poster", e.target.value)} /></Field>
          <Field label="VIDEO DURATION (s)"><TI type="number" value={data.journey?.video?.duration} onChange={(e) => set("journey.video.duration", Number(e.target.value))} /></Field>
        </div>
      </Card>

      <Card title={`JOURNEY STAGES — ${stages.length}`} right={<Btn variant="primary" onClick={() => { const b = blankStage(stages.length + 1); stageData((p) => ({ ...p, journey: { ...p.journey, stages: [...p.journey.stages, b] } })); setOpenStage(b.id); }}>+ ADD STAGE</Btn>}>
        {stages.length === 0 && <Empty text="NO STAGES" />}
        <div className="flex flex-col gap-2">
          {stages.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-[#27272a] bg-[#0a0a0a] p-3">
              <span className="font-mono text-xs text-[#ff4d00]">{s.index}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{s.title}</p>
                <p className="truncate font-mono text-[9px] tracking-[0.25em] text-zinc-500">{s.badge} · {s.period}</p>
              </div>
              <Btn onClick={() => setOpenStage(s.id)}>EDIT</Btn>
              <RowActions onUp={() => move("journey.stages", i, -1)} onDown={() => move("journey.stages", i, 1)} disableUp={i === 0} disableDown={i === stages.length - 1}
                onDelete={() => setConfirm({ title: "DELETE STAGE?", body: `Remove "${s.title}"?`, fn: () => set("journey.stages", stages.filter((x) => x.id !== s.id)) })} />
            </div>
          ))}
        </div>
      </Card>

      {edStage && (
        <Card title={`EDIT STAGE — ${edStage.title}`} right={<Btn onClick={() => setOpenStage(null)}>CLOSE ✕</Btn>}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="BADGE"><TI value={edStage.badge} onChange={(e) => mutArr("journey.stages", edStage.id, { badge: e.target.value })} /></Field>
            <Field label="INDEX"><TI value={edStage.index} onChange={(e) => mutArr("journey.stages", edStage.id, { index: e.target.value })} /></Field>
            <Field label="TITLE"><TI value={edStage.title} onChange={(e) => mutArr("journey.stages", edStage.id, { title: e.target.value })} /></Field>
            <Field label="ROLE"><TI value={edStage.role} onChange={(e) => mutArr("journey.stages", edStage.id, { role: e.target.value })} /></Field>
            <Field label="PERIOD"><TI value={edStage.period} onChange={(e) => mutArr("journey.stages", edStage.id, { period: e.target.value })} /></Field>
            <Field label="KIND"><TI value={edStage.kind} onChange={(e) => mutArr("journey.stages", edStage.id, { kind: e.target.value })} /></Field>
            <Field label="HEADLINE"><TI value={edStage.headline} onChange={(e) => mutArr("journey.stages", edStage.id, { headline: e.target.value })} /></Field>
            <Field label="SIDE"><TI value={edStage.side} onChange={(e) => mutArr("journey.stages", edStage.id, { side: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="SUMMARY"><TA value={edStage.summary} onChange={(e) => mutArr("journey.stages", edStage.id, { summary: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="TECH STACK"><TagEditor values={edStage.stack} onChange={(v) => mutArr("journey.stages", edStage.id, { stack: v })} /></Field></div>
            <Field label="VIDEO START (s)"><TI type="number" value={edStage.videoTime?.start} onChange={(e) => mutArr("journey.stages", edStage.id, { videoTime: { ...edStage.videoTime, start: Number(e.target.value) } })} /></Field>
            <Field label="VIDEO END (s)"><TI type="number" value={edStage.videoTime?.end} onChange={(e) => mutArr("journey.stages", edStage.id, { videoTime: { ...edStage.videoTime, end: Number(e.target.value) } })} /></Field>
          </div>
          <div className="mt-4"><Btn variant="primary" onClick={() => { setOpenStage(null); push("Stage saved"); }}>DONE</Btn></div>
        </Card>
      )}

      <Card title="EXPERIENCE HEADER">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TAG"><TI value={data.experience?.tag} onChange={(e) => set("experience.tag", e.target.value)} /></Field>
          <Field label="TITLE"><TI value={data.experience?.title} onChange={(e) => set("experience.title", e.target.value)} /></Field>
          <Field label="ARABIC TITLE"><TI value={data.experience?.arabicTitle} onChange={(e) => set("experience.arabicTitle", e.target.value)} /></Field>
          <Field label="NOTE"><TI value={data.experience?.note} onChange={(e) => set("experience.note", e.target.value)} /></Field>
        </div>
      </Card>

      <Card title={`ROLES — ${roles.length}`} right={<Btn variant="primary" onClick={() => { const b = blankRole(); stageData((p) => ({ ...p, experience: { ...p.experience, roles: [b, ...p.experience.roles] } })); setOpenRole(b.id); }}>+ ADD ROLE</Btn>}>
        {roles.length === 0 && <Empty text="NO ROLES" />}
        <div className="flex flex-col gap-2">
          {roles.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 rounded-xl border border-[#27272a] bg-[#0a0a0a] p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{r.title} <span className="text-zinc-500">@ {r.org}</span></p>
                <p className="truncate font-mono text-[9px] tracking-[0.25em] text-zinc-500">{r.period} · {r.kind}</p>
              </div>
              <Btn onClick={() => setOpenRole(r.id)}>EDIT</Btn>
              <RowActions onUp={() => move("experience.roles", i, -1)} onDown={() => move("experience.roles", i, 1)} disableUp={i === 0} disableDown={i === roles.length - 1}
                onDelete={() => setConfirm({ title: "DELETE ROLE?", body: `Remove "${r.title}"?`, fn: () => set("experience.roles", roles.filter((x) => x.id !== r.id)) })} />
            </div>
          ))}
        </div>
      </Card>

      {edRole && (
        <Card title={`EDIT ROLE — ${edRole.title}`} right={<Btn onClick={() => setOpenRole(null)}>CLOSE ✕</Btn>}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="TITLE"><TI value={edRole.title} onChange={(e) => mutArr("experience.roles", edRole.id, { title: e.target.value })} /></Field>
            <Field label="ORGANIZATION"><TI value={edRole.org} onChange={(e) => mutArr("experience.roles", edRole.id, { org: e.target.value })} /></Field>
            <Field label="ORG URL"><TI value={edRole.orgHref || ""} onChange={(e) => mutArr("experience.roles", edRole.id, { orgHref: e.target.value })} /></Field>
            <Field label="PERIOD"><TI value={edRole.period} onChange={(e) => mutArr("experience.roles", edRole.id, { period: e.target.value })} /></Field>
            <Field label="KIND"><TI value={edRole.kind} onChange={(e) => mutArr("experience.roles", edRole.id, { kind: e.target.value })} /></Field>
            <div><Field label="TECH STACK"><TagEditor values={edRole.stack} onChange={(v) => mutArr("experience.roles", edRole.id, { stack: v })} /></Field></div>
            <div className="md:col-span-2"><Field label="SUMMARY"><TA value={edRole.summary} onChange={(e) => mutArr("experience.roles", edRole.id, { summary: e.target.value })} /></Field></div>
          </div>
          <div className="mt-4"><Btn variant="primary" onClick={() => { setOpenRole(null); push("Role saved"); }}>DONE</Btn></div>
        </Card>
      )}

      <ConfirmModal open={!!confirm} title={confirm?.title} body={confirm?.body} onCancel={() => setConfirm(null)} onConfirm={() => { confirm?.fn(); setConfirm(null); push("Deleted"); }} />
    </div>
  );
}

