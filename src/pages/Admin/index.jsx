import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";
import { Toasts, Btn } from "./ui";
import Overview from "./modules/Overview";
import Appearance from "./modules/Appearance";
import Content from "./modules/Content";
import Projects from "./modules/Projects";
import Career from "./modules/Career";
import SkillsContact from "./modules/SkillsContact";
import Settings from "./modules/Settings";

const TABS = [
  { id: "overview", label: "OVERVIEW", icon: "◈" },
  { id: "appearance", label: "APPEARANCE", icon: "◐" },
  { id: "content", label: "PROFILE & HERO", icon: "♟" },
  { id: "projects", label: "PROJECTS", icon: "▣" },
  { id: "career", label: "JOURNEY & ROLES", icon: "∿" },
  { id: "skills", label: "SKILLS & CONTACT", icon: "✦" },
  { id: "settings", label: "BACKUP & ACCESS", icon: "⚙" },
];

function readAuth(authKey) {
  try {
    const raw = sessionStorage.getItem(authKey);
    if (!raw) return false;
    const { exp } = JSON.parse(raw);
    return Date.now() < exp;
  } catch {
    return false;
  }
}

function LoginGate({ onUnlock, pin, lockMinutes, authKey }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const submit = (e) => {
    e?.preventDefault();
    if (val === pin) {
      sessionStorage.setItem(authKey, JSON.stringify({ ok: true, exp: Date.now() + lockMinutes * 60000 }));
      onUnlock();
    } else {
      setErr("ACCESS DENIED — WRONG PIN");
      setVal("");
      setTimeout(() => setErr(""), 1800);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] p-6">
      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-2xl border border-[#27272a] bg-[#0e0e0e]/95 p-8 backdrop-blur-xl">
        <span className="hud-corner-tl" /><span className="hud-corner-tr" />
        <span className="hud-corner-bl" /><span className="hud-corner-br" />
        <p className="font-mono text-[10px] tracking-[0.5em] text-[#ff4d00]">RESTRICTED AREA</p>
        <h1 className="font-display mt-3 text-4xl text-white">ADMIN<span className="text-[#ff4d00]">.</span></h1>
        <p className="mt-2 text-xs text-zinc-500">Enter your console PIN to manage the portfolio. Default is <span className="font-mono text-zinc-300">1234</span>.</p>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value.replace(/\D/g, "").slice(0, 12))}
          type="password"
          inputMode="numeric"
          autoFocus
          placeholder="••••"
          className="mt-6 w-full rounded-lg border border-[#27272a] bg-[#080808] px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-white outline-none focus:border-[#ff4d00]"
        />
        {err && <p className="mt-3 text-center font-mono text-[10px] tracking-[0.25em] text-red-400">{err}</p>}
        <button type="submit" className="illoca-btn mt-6 w-full border border-[#ff4d00]/40">
          <span className="illoca-btn__icon">→</span>
          <span className="illoca-btn__body flex-1 justify-center">UNLOCK CONSOLE<span className="illoca-btn__text-hover">UNLOCK CONSOLE</span></span>
        </button>
        <Link to="/" className="mt-4 block text-center font-mono text-[10px] tracking-[0.3em] text-zinc-500 hover:text-white">← BACK TO PORTFOLIO</Link>
      </form>
    </div>
  );
}

export default function Admin() {
  const ctx = usePortfolio();
  const { dirty, save, resetDefaults, toasts, admin, push, authKey } = ctx;
  const [authed, setAuthed] = useState(() => readAuth(authKey));
  const [tab, setTab] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [q, setQ] = useState("");
  const activeIdx = Math.max(0, TABS.findIndex((t) => t.id === tab));
  const activeTab = TABS[activeIdx] || TABS[0];
  const visibleTabs = TABS.filter((t) =>
    `${t.label} ${t.id}`.toLowerCase().includes(q.toLowerCase())
  );

  // ESC closes mobile nav / drawers; 1–7 jump between modules.
  useEffect(() => {
    if (!authed) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileNav(false);
      const tag = e.target?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable;
      if (typing) return;
      const n = Number(e.key);
      if (n >= 1 && n <= TABS.length) setTab(TABS[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authed]);

  // The portfolio locks html/body to overflow:hidden — re-enable page scroll while the console is mounted.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "auto";
    body.style.overflow = "auto";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  const lock = useCallback(() => {
    sessionStorage.removeItem(authKey);
    setAuthed(false);
  }, [authKey]);

  // Sliding auto-lock on activity (mouse + keys + touch)
  useEffect(() => {
    if (!authed) return undefined;
    const bump = () => {
      try {
        sessionStorage.setItem(authKey, JSON.stringify({ ok: true, exp: Date.now() + (admin.lockMinutes || 15) * 60000 }));
      } catch { /* ignore */ }
    };
    const check = setInterval(() => {
      if (!readAuth(authKey)) lock();
    }, 10000);
    window.addEventListener("mousemove", bump);
    window.addEventListener("keydown", bump);
    window.addEventListener("touchstart", bump, { passive: true });
    window.addEventListener("scroll", bump, { passive: true });
    return () => {
      clearInterval(check);
      window.removeEventListener("mousemove", bump);
      window.removeEventListener("keydown", bump);
      window.removeEventListener("touchstart", bump);
      window.removeEventListener("scroll", bump);
    };
  }, [authed, admin.lockMinutes, authKey, lock]);

  if (!authed) {
    return <LoginGate onUnlock={() => setAuthed(true)} pin={admin.pin || "1234"} lockMinutes={admin.lockMinutes || 15} authKey={authKey} />;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">
      {/* Top bar */}
      <header className="sticky top-0 z-[100] flex items-center justify-between border-b border-[#27272a] bg-[#080808]/90 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileNav(!mobileNav)} className="rounded-lg border border-[#27272a] px-3 py-2 font-mono text-xs text-zinc-300 md:hidden" aria-label="Toggle menu">☰</button>
          <Link to="/" className="font-display text-xl text-white">AE<span className="text-[#ff4d00]">.</span></Link>
          <span className="hidden rounded-full border border-[#ff4d00]/50 px-2.5 py-1 font-mono text-[9px] tracking-[0.3em] text-[#ff4d00] sm:inline">ADMIN CONSOLE</span>
        </div>
        <div className="flex items-center gap-2">
          {dirty ? (
            <span className="hidden font-mono text-[10px] tracking-[0.25em] text-amber-400 sm:inline">● UNSAVED DRAFT</span>
          ) : (
            <span className="hidden font-mono text-[10px] tracking-[0.25em] text-emerald-400/80 sm:inline">✓ ALL SAVED</span>
          )}
          <Btn onClick={save} variant="primary" disabled={!dirty}>SAVE{dirty ? " *" : ""}</Btn>
          <Btn onClick={lock}>LOCK</Btn>
          <Link to="/" className="hidden rounded-lg border border-[#27272a] px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-zinc-300 hover:border-[#ff4d00] hover:text-white sm:inline-block">VIEW SITE</Link>
        </div>
      </header>

      <div className="flex">
        {/* Mobile backdrop */}
        {mobileNav && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNav(false)}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
        {/* Sidebar */}
        <aside className={`fixed left-0 top-[57px] z-[90] h-[calc(100vh-57px)] w-60 shrink-0 overflow-y-auto border-r border-[#27272a] bg-[#0a0a0a] p-4 transition-transform md:sticky md:top-[57px] md:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
          <p className="px-2 font-mono text-[9px] tracking-[0.4em] text-zinc-600">MODULES · KEYS 1–{TABS.length}</p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter modules…"
            aria-label="Filter modules"
            className="mt-3 w-full rounded-lg border border-[#27272a] bg-[#080808] px-3 py-2 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#ff4d00]"
          />
          <nav className="mt-3 flex flex-col gap-1">
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setMobileNav(false); }}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left font-mono text-[11px] tracking-[0.2em] transition-all ${
                  tab === t.id ? "border-[#ff4d00]/60 bg-[#ff4d00]/10 text-white" : "border-transparent text-zinc-500 hover:border-[#27272a] hover:text-zinc-200"
                }`}
              >
                <span className={tab === t.id ? "text-[#ff4d00]" : ""}>{t.icon}</span>
                {t.label}
                {t.id === "projects" && <span className="ml-auto rounded-full bg-[#ff4d00]/20 px-2 py-0.5 text-[9px] text-[#ff4d00]">{ctx.data.projects?.length || 0}</span>}
                {t.id === "skills" && (ctx.admin.inquiries?.filter((i) => !i.read).length > 0) && (
                  <span className="ml-auto rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] text-red-300">{ctx.admin.inquiries.filter((i) => !i.read).length} NEW</span>
                )}
              </button>
            ))}
            {visibleTabs.length === 0 && (
              <p className="mt-2 rounded-lg border border-dashed border-[#27272a] p-4 text-center font-mono text-[10px] tracking-[0.25em] text-zinc-600">NO MODULES MATCH</p>
            )}
          </nav>
          <div className="mt-6 rounded-xl border border-[#27272a] p-3">
            <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-600">STORAGE</p>
            <p className="mt-1 font-mono text-[11px] text-zinc-300">{(ctx.storageUsage.bytes / 1024).toFixed(1)} KB</p>
            <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-zinc-600">UPDATED</p>
            <p className="font-mono text-[10px] text-zinc-400">{admin.lastUpdated ? new Date(admin.lastUpdated).toLocaleString() : "NOT YET"}</p>
          </div>
          <button type="button" onClick={() => { if (window.confirm("Reset everything to profile.js defaults?")) resetDefaults(); }} className="mt-3 w-full rounded-lg border border-red-900/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-red-400/80 hover:border-red-500">
            RESET TO DEFAULTS
          </button>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.4em] text-[#ff4d00]">CONSOLE / {activeTab.label}</p>
              <h2 className="font-display mt-1 text-3xl text-white md:text-4xl">{activeTab.label}</h2>
            </div>
            {tab === "overview" && <Overview go={setTab} />}
            {tab === "appearance" && <Appearance />}
            {tab === "content" && <Content />}
            {tab === "projects" && <Projects />}
            {tab === "career" && <Career />}
            {tab === "skills" && <SkillsContact />}
            {tab === "settings" && <Settings lock={lock} />}
            {/* Prev / next module stepper */}
            <div className="mt-8 flex items-center justify-between gap-2 border-t border-[#1c1c1c] pt-4">
              <button
                type="button"
                disabled={activeIdx === 0}
                onClick={() => setTab(TABS[activeIdx - 1].id)}
                className="rounded-lg border border-[#27272a] px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-zinc-400 hover:border-[#ff4d00] hover:text-white disabled:opacity-30"
              >
                ← {activeIdx > 0 ? TABS[activeIdx - 1].label : "START"}
              </button>
              <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-600">{activeIdx + 1} / {TABS.length}</span>
              <button
                type="button"
                disabled={activeIdx >= TABS.length - 1}
                onClick={() => setTab(TABS[activeIdx + 1].id)}
                className="rounded-lg border border-[#27272a] px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-zinc-400 hover:border-[#ff4d00] hover:text-white disabled:opacity-30"
              >
                {activeIdx < TABS.length - 1 ? TABS[activeIdx + 1].label : "END"} →
              </button>
            </div>
          </div>
          <div className="h-28" />
        </main>
      </div>

      {/* Floating quick-save bar */}
      {dirty && (
        <div className="fixed bottom-5 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#ff4d00]/50 bg-black/90 py-2 pl-5 pr-2 shadow-[0_8px_40px_rgba(255,77,0,0.3)] backdrop-blur-xl">
          <span className="font-mono text-[10px] tracking-[0.25em] text-amber-300">UNSAVED CHANGES</span>
          <button type="button" onClick={save} className="rounded-full bg-[#ff4d00] px-5 py-2 font-mono text-[11px] tracking-[0.2em] text-black hover:bg-white">SAVE & APPLY</button>
          <button type="button" onClick={() => { push("Draft kept locally — autosaved"); }} className="rounded-full border border-[#27272a] px-4 py-2 font-mono text-[11px] text-zinc-400">LATER</button>
        </div>
      )}

      <Toasts items={toasts} />
    </div>
  );
}
