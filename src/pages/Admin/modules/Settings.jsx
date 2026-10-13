import { useRef, useState } from "react";
import { usePortfolio } from "../../../context/PortfolioContext";
import { Card, Field, TI, Btn, ConfirmModal } from "../ui";

export default function Settings({ lock }) {
  const { admin, stageAdmin, save, resetDefaults, exportProfileJS, exportThemeCSS, exportBackup, importBackup, push } = usePortfolio();
  const [confirmReset, setConfirmReset] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const fileRef = useRef(null);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importBackup(JSON.parse(reader.result));
      } catch {
        push("Invalid backup file", "err");
      }
    };
    reader.readAsText(f);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <Card title="SYNC & EXPORT ENGINE" sub="Hand your edits back to source files or move them between machines.">
        <div className="flex flex-wrap gap-2">
          <Btn variant="primary" onClick={exportProfileJS}>EXPORT TO profile.js</Btn>
          <Btn onClick={exportThemeCSS}>EXPORT THEME CSS</Btn>
          <Btn onClick={exportBackup}>BACKUP JSON ↓</Btn>
          <Btn onClick={() => fileRef.current?.click()}>RESTORE BACKUP ↑</Btn>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={onFile} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          profile.js generates a formatted module ready to paste into <span className="font-mono text-zinc-300">src/data/profile.js</span>.
          Theme CSS outputs the updated <span className="font-mono text-zinc-300">:root</span> block for <span className="font-mono text-zinc-300">src/index.css</span>.
          Backup JSON carries data + theme + FX + inbox in one file.
        </p>
        <div className="mt-3">
          <Btn onClick={save}>SAVE NOW</Btn>
        </div>
      </Card>

      <Card title="DANGER ZONE" sub="Irreversible without a backup.">
        <Btn variant="danger" onClick={() => setConfirmReset(true)}>RESET TO DEFAULTS</Btn>
      </Card>

      <Card title="ACCESS & SESSION" sub="PIN unlocks /admin on this device. The session auto-locks after inactivity.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CONSOLE PIN" hint="Digits only. Takes effect immediately.">
            <div className="flex gap-2">
              <TI
                type={showPin ? "text" : "password"}
                value={admin.pin || ""}
                onChange={(e) => stageAdmin((a) => ({ ...a, pin: e.target.value.replace(/\D/g, "").slice(0, 12) || "1234" }))}
                className="font-mono tracking-[0.4em]"
              />
              <Btn onClick={() => setShowPin(!showPin)}>{showPin ? "HIDE" : "SHOW"}</Btn>
            </div>
          </Field>
          <Field label="AUTO-LOCK (MINUTES)" hint="Sliding window — any mouse/key activity extends it.">
            <TI type="number" min="1" max="120" value={admin.lockMinutes || 15} onChange={(e) => stageAdmin((a) => ({ ...a, lockMinutes: Math.max(1, Number(e.target.value) || 15) }))} />
          </Field>
        </div>
        <div className="mt-4 flex gap-2">
          <Btn onClick={lock}>LOCK NOW</Btn>
          <Btn onClick={() => { save(); push("Session PIN updated"); }}>APPLY ACCESS SETTINGS</Btn>
        </div>
      </Card>

      <ConfirmModal
        open={confirmReset}
        title="RESET EVERYTHING?"
        body="All edits, theme tweaks, skills, projects and inbox changes return to the hardcoded profile.js defaults. Export a backup first if unsure."
        confirmLabel="RESET"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => { setConfirmReset(false); resetDefaults(); }}
      />
    </div>
  );
}

