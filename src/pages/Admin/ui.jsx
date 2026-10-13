/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";

export const cx = (...c) => c.filter(Boolean).join(" ");

export function Card({ title, sub, right, children, className }) {
  return (
    <section className={cx("rounded-2xl border border-[#27272a] bg-[#0e0e0e]/90 p-5 backdrop-blur-xl md:p-6", className)}>
      {(title || right) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-mono text-[11px] tracking-[0.35em] text-white">{title}</h3>}
            {sub && <p className="mt-1 max-w-xl text-xs leading-relaxed text-zinc-500">{sub}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children, className }) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1.5 block font-mono text-[10px] tracking-[0.3em] text-zinc-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-zinc-600">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-[#27272a] bg-[#080808] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-[#ff4d00]";

export function TI(props) {
  return <input {...props} className={cx(inputCls, props.className)} />;
}

export function TA(props) {
  return <textarea {...props} rows={props.rows || 3} className={cx(inputCls, "resize-y leading-relaxed", props.className)} />;
}

export function Sel(props) {
  return (
    <select {...props} className={cx(inputCls, "cursor-pointer", props.className)}>
      {props.children}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="group flex items-center gap-3"
      aria-pressed={checked}
    >
      <span
        className={cx(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
          checked ? "border-[#ff4d00] bg-[#ff4d00]/20" : "border-[#27272a] bg-[#1a1a1a]"
        )}
      >
        <span
          className={cx(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all",
            checked ? "left-[22px] bg-[#ff4d00]" : "left-[3px] bg-zinc-500"
          )}
        />
      </span>
      {label && <span className="text-xs text-zinc-400 group-hover:text-zinc-200">{label}</span>}
    </button>
  );
}

export function Btn({ children, onClick, variant = "ghost", className, type = "button", disabled }) {
  const styles =
    variant === "primary"
      ? "bg-[#ff4d00] text-black hover:bg-white border-[#ff4d00]"
      : variant === "danger"
        ? "border-red-900/60 text-red-400 hover:border-red-500 hover:bg-red-500/10"
        : "border-[#27272a] text-zinc-300 hover:border-[#ff4d00] hover:text-white";
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-mono text-[11px] tracking-[0.2em] transition-all disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#ff4d00] active:scale-[0.98]",
        styles,
        className
      )}
    >
      {children}
    </button>
  );
}

export function ColorF({ value, onChange }) {
  const v = /^#[0-9a-fA-F]{6}$/.test(value || "") ? value : "#ff4d00";
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={v}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-12 cursor-pointer rounded-lg border border-[#27272a] bg-[#080808] p-1"
      />
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cx(inputCls, "font-mono text-xs uppercase")}
      />
    </div>
  );
}

/** Interactive pill editor for string arrays (tags, stack, meta, skills). */
export function TagEditor({ values = [], onChange, placeholder = "Type + Enter" }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...values, t]);
    setDraft("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {(values || []).map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#27272a] bg-[#161616] px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-zinc-300"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="text-zinc-500 hover:text-red-400"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        placeholder={placeholder}
        className={cx(inputCls, "mt-2")}
      />
    </div>
  );
}

export function RowActions({ onUp, onDown, onDelete, disableUp, disableDown, label = "item" }) {
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onUp} disabled={disableUp} title="Move up" className="rounded-md border border-[#27272a] px-2 py-1 font-mono text-xs text-zinc-400 hover:border-[#ff4d00] hover:text-white disabled:opacity-30">↑</button>
      <button type="button" onClick={onDown} disabled={disableDown} title="Move down" className="rounded-md border border-[#27272a] px-2 py-1 font-mono text-xs text-zinc-400 hover:border-[#ff4d00] hover:text-white disabled:opacity-30">↓</button>
      <button type="button" onClick={onDelete} title={`Delete ${label}`} className="rounded-md border border-red-900/50 px-2 py-1 font-mono text-xs text-red-400/80 hover:border-red-500 hover:text-red-300">DEL</button>
    </div>
  );
}

export function ConfirmModal({ open, title, body, confirmLabel = "DELETE", onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onCancel?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="alertdialog" aria-modal="true" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-2xl border border-[#27272a] bg-[#0e0e0e] p-6" onClick={(e) => e.stopPropagation()}>
        <h4 className="font-mono text-xs tracking-[0.3em] text-red-400">{title || "ARE YOU SURE?"}</h4>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{body}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Btn onClick={onCancel}>CANCEL</Btn>
          <Btn variant="danger" onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

export function Toasts({ items }) {
  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[9600] flex max-w-[calc(100vw-2rem)] flex-col gap-2 md:bottom-6 md:right-6">
      {items.map((t) => (
        <div
          key={t.id}
          className={cx(
            "rounded-lg border px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] backdrop-blur-xl",
            t.kind === "err" ? "border-red-500/60 bg-red-950/80 text-red-200" : "border-[#ff4d00]/60 bg-black/85 text-white"
          )}
        >
          {t.msg.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

export function Empty({ text }) {
  return <p className="rounded-lg border border-dashed border-[#27272a] p-6 text-center font-mono text-[11px] tracking-[0.25em] text-zinc-600">{text}</p>;
}

export const uid = (p = "id") => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
