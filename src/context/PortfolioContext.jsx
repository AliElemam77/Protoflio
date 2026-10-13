/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { profile as DEFAULT_PROFILE } from "../data/profile";

const STORAGE_KEY = "ae.portfolio.cms.v1";
const AUTH_KEY = "ae.portfolio.admin.auth";

export const DEFAULT_THEME = {
  void: "#080808",
  voidSoft: "#0e0e0e",
  orange: "#ff4d00",
  ember: "#b22222",
  amber: "#ff8c00",
  ink: "#ffffff",
  muted: "#a1a1aa",
  dim: "#52525b",
  line: "#27272a",
  fontDisplay: '"Cabinet Grotesk", "Satoshi", system-ui, sans-serif',
  fontBody: '"Satoshi", system-ui, -apple-system, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  letterSpacing: "-0.035em",
  displayWeight: 900,
};

export const DEFAULT_FX = {
  cursorTrail: true,
  noiseOpacity: 0.05,
  glowRadius: 100,
  blobOpacity: 1,
  blobsEnabled: true,
  grainEnabled: true,
};

const DEFAULT_ADMIN = {
  pin: "1234",
  openForOpportunities: true,
  lastUpdated: null,
  lockMinutes: 15,
  inquiries: [
    { id: "inq-1", name: "Layla Hassan", email: "layla@store.com", message: "Need a custom Salla theme for a fashion store. Timeline ~3 weeks.", date: "2026-10-02T10:30:00", read: false },
    { id: "inq-2", name: "Omar Farouk", email: "omar@startup.io", message: "Interested in an ATS dashboard similar to Kader. Can we schedule a call?", date: "2026-09-28T16:12:00", read: true },
  ],
};

export const THEME_PRESETS = {
  cinematic: { label: "Cinematic Fire", tokens: { ...DEFAULT_THEME } },
  cyberpunk: {
    label: "Cyberpunk Neon",
    tokens: {
      ...DEFAULT_THEME,
      void: "#07070f", voidSoft: "#101020", orange: "#00f0ff",
      ember: "#7b2ff7", amber: "#ff2fb3", muted: "#9aa0b4",
      dim: "#555a6e", line: "#23233a",
    },
  },
  emerald: {
    label: "Obsidian Emerald",
    tokens: {
      ...DEFAULT_THEME,
      void: "#060807", voidSoft: "#0c1210", orange: "#10b981",
      ember: "#065f46", amber: "#a7f3d0", ink: "#f2fbf7",
      muted: "#93a39d", dim: "#4b5a55", line: "#1c2623",
    },
  },
  mono: {
    label: "Monochrome Luxury",
    tokens: {
      ...DEFAULT_THEME,
      void: "#000000", voidSoft: "#0a0a0a", orange: "#ffffff",
      ember: "#8a8a8a", amber: "#d4d4d4", muted: "#a3a3a3",
      dim: "#525252", line: "#262626",
    },
  },
};

const deepClone = (v) => JSON.parse(JSON.stringify(v));

const getPath = (obj, path) =>
  path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

const setPath = (obj, path, value) => {
  const keys = path.split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...obj };
  let node = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const next = node[k];
    const copy = Array.isArray(next) ? [...next] : { ...(next || {}) };
    node[k] = copy;
    node = copy;
  }
  node[keys[keys.length - 1]] = value;
  return root;
};

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

let cachedStored;
function getStored() {
  if (cachedStored === undefined) {
    cachedStored = typeof window !== "undefined" ? loadStored() : null;
  }
  return cachedStored || {};
}

/* ── Theme override engine ────────────────────────────────
   Portfolio components use hardcoded Tailwind arbitrary values
   (e.g. text-[#ff4d00]) which never read :root vars. This scoped,
   unlayered stylesheet remaps those literals to the live tokens, so
   the Appearance studio repaints the whole site in real time.
   Scoped to .portfolio-root — the /admin console is untouched. */
const HEX_RULES = [
  { hex: "#ff4d00", v: "var(--orange)", op: [5, 10, 15, 20, 40, 50, 60, 70] },
  { hex: "#b22222", v: "var(--ember)", op: [] },
  { hex: "#ff8c00", v: "var(--amber)", op: [] },
  { hex: "#080808", v: "var(--void)", op: [80], grad: true },
];

function buildThemeOverrides() {
  const R = [];
  const ex = (h, p) =>
    `:not([class*="hover:${p}-[${h}]"]):not([class*="group-hover:${p}-[${h}]"])`;
  for (const { hex: h, v, op, grad } of HEX_RULES) {
    for (const [prop, css] of [["text", "color"], ["bg", "background-color"], ["border", "border-color"]]) {
      R.push(`.portfolio-root [class*="${prop}-[${h}]"]${ex(h, prop)}{${css}:${v};}`);
      R.push(`.portfolio-root [class*="hover:${prop}-[${h}]"]:hover{${css}:${v};}`);
      R.push(`.portfolio-root .group:hover [class*="group-hover:${prop}-[${h}]"]{${css}:${v};}`);
    }
    for (const n of op) {
      R.push(`.portfolio-root [class*="bg-[${h}]/${n}"]{background-color:color-mix(in srgb,${v} ${n}%,transparent);}`);
      R.push(`.portfolio-root [class*="border-[${h}]/${n}"]{border-color:color-mix(in srgb,${v} ${n}%,transparent);}`);
    }
    if (grad) {
      R.push(`.portfolio-root [class*="from-[${h}]"]{--tw-gradient-from:${v};--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from) var(--tw-gradient-from-position),var(--tw-gradient-to) var(--tw-gradient-to-position));}`);
      for (const n of op) {
        R.push(`.portfolio-root [class*="via-[${h}]/${n}"]{--tw-gradient-via:color-mix(in srgb,${v} ${n}%,transparent);}`);
      }
    }
  }
  // Neutrals → ink / muted / dim / line
  R.push(`.portfolio-root [class*="text-white"]:not([class*="hover:text-white"]):not([class*="group-hover:text-white"]){color:var(--ink);}`);
  R.push(`.portfolio-root [class*="hover:text-white"]:hover{color:var(--ink);}`);
  R.push(`.portfolio-root .group:hover [class*="group-hover:text-white"]{color:var(--ink);}`);
  for (const n of [5, 10, 15, 20, 25, 40, 60, 70, 80, 90]) {
    R.push(`.portfolio-root [class*="text-white/${n}"]{color:color-mix(in srgb,var(--ink) ${n}%,transparent);}`);
    R.push(`.portfolio-root [class*="bg-white/${n}"]{background-color:color-mix(in srgb,var(--ink) ${n}%,transparent);}`);
    R.push(`.portfolio-root [class*="border-white/${n}"]{border-color:color-mix(in srgb,var(--ink) ${n}%,transparent);}`);
  }
  for (const z of ["zinc-100", "zinc-200", "zinc-300"]) R.push(`.portfolio-root [class*="text-${z}"]{color:var(--ink);}`);
  for (const z of ["zinc-400", "zinc-500"]) R.push(`.portfolio-root [class*="text-${z}"]{color:var(--muted);}`);
  for (const z of ["zinc-600", "zinc-700"]) R.push(`.portfolio-root [class*="text-${z}"]{color:var(--dim);}`);
  R.push(`.portfolio-root [class*="bg-zinc-800"]{background-color:var(--line);}`);
  for (const z of ["zinc-700", "zinc-800"]) R.push(`.portfolio-root [class*="border-${z}"]{border-color:var(--line);}`);
  // Orange glow shadows
  R.push(`.portfolio-root [class*="shadow-[0_0_10px_rgba(255,77,0,0.3)]"]{box-shadow:0 0 10px color-mix(in srgb,var(--orange) 30%,transparent);}`);
  R.push(`.portfolio-root [class*="shadow-[0_0_15px_rgba(255,77,0,0.6)]"]{box-shadow:0 0 15px color-mix(in srgb,var(--orange) 60%,transparent);}`);
  return R.join("\n");
}

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => getStored().data || deepClone(DEFAULT_PROFILE));
  const [theme, setThemeState] = useState(() => ({ ...DEFAULT_THEME, ...(getStored().theme || {}) }));
  const [fx, setFxState] = useState(() => ({ ...DEFAULT_FX, ...(getStored().fx || {}) }));
  const [admin, setAdminState] = useState(() => ({ ...DEFAULT_ADMIN, ...(getStored().admin || {}) }));
  const [dirty, setDirty] = useState(false);
  const [toasts, setToasts] = useState([]);

  const push = useCallback((msg, kind = "ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // Persist + stamp
  const persist = useCallback((next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, savedAt: new Date().toISOString() }));
    } catch { /* quota — ignore */ }
  }, []);

  const commit = useCallback((patch) => {
    const next = {
      data: patch.data !== undefined ? patch.data : data,
      theme: patch.theme !== undefined ? patch.theme : theme,
      fx: patch.fx !== undefined ? patch.fx : fx,
      admin: patch.admin !== undefined
        ? { ...patch.admin, lastUpdated: new Date().toISOString() }
        : { ...admin, lastUpdated: new Date().toISOString() },
    };
    if (patch.data !== undefined) setData(patch.data);
    if (patch.theme !== undefined) setThemeState(patch.theme);
    if (patch.fx !== undefined) setFxState(patch.fx);
    setAdminState(next.admin);
    persist(next);
    setDirty(false);
  }, [persist, data, theme, fx, admin]);

  // Stage changes (marks dirty, no timestamp bump until save)
  const stageData = useCallback((updater) => {
    setData((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setDirty(true);
  }, []);
  const stageTheme = useCallback((updater) => {
    setThemeState((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setDirty(true);
  }, []);
  const stageFx = useCallback((updater) => {
    setFxState((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setDirty(true);
  }, []);
  const stageAdmin = useCallback((updater) => {
    setAdminState((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setDirty(true);
  }, []);

  // Atomic public inbox write — persists immediately so a contact-form
  // message survives even if the tab closes before the debounced autosave.
  const addInquiry = useCallback((inquiry) => {
    let nextAdmin = null;
    setAdminState((prev) => {
      nextAdmin = {
        ...(prev || {}),
        inquiries: [inquiry, ...((prev && prev.inquiries) || [])],
        lastUpdated: new Date().toISOString(),
      };
      return nextAdmin;
    });
    setDirty(true);
    // Flush to storage on the next tick, after state has settled.
    setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const stored = raw ? JSON.parse(raw) : {};
        const merged = {
          ...stored,
          data: stored.data || deepClone(DEFAULT_PROFILE),
          theme: stored.theme || { ...DEFAULT_THEME },
          fx: stored.fx || { ...DEFAULT_FX },
          admin: nextAdmin || stored.admin,
          savedAt: new Date().toISOString(),
        };
        if (!merged.admin) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch { /* quota — ignore */ }
    }, 0);
  }, []);

  const save = useCallback(() => {
    const next = {
      data, theme, fx,
      admin: { ...admin, lastUpdated: new Date().toISOString() },
    };
    setAdminState(next.admin);
    persist(next);
    setDirty(false);
    push("Saved & applied live");
  }, [persist, push, data, theme, fx, admin]);

  // Live-inject CSS tokens into :root on every theme/fx change + persist drafts
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--void", theme.void);
    r.setProperty("--void-soft", theme.voidSoft);
    r.setProperty("--orange", theme.orange);
    r.setProperty("--ember", theme.ember);
    r.setProperty("--amber", theme.amber);
    r.setProperty("--ink", theme.ink);
    r.setProperty("--muted", theme.muted);
    r.setProperty("--dim", theme.dim);
    r.setProperty("--line", theme.line);
    r.setProperty("--font-display", theme.fontDisplay);
    r.setProperty("--font-body", theme.fontBody);
    r.setProperty("--font-mono", theme.fontMono);
    r.setProperty("--display-weight", String(theme.displayWeight || 900));
    r.setProperty("--letter-spacing", theme.letterSpacing || "-0.035em");
    document.body.style.backgroundColor = theme.void;
    document.body.style.color = theme.ink;
    // Scoped override sheet: remaps hardcoded utilities to live tokens
    let el = document.querySelector("style[data-cms-theme]");
    if (!el) {
      el = document.createElement("style");
      el.setAttribute("data-cms-theme", "");
      document.head.appendChild(el);
    }
    el.textContent = buildThemeOverrides();
  }, [theme]);

  // Autosave drafts (debounced) so live preview + reload survive
  useEffect(() => {
    if (!dirty) return undefined;
    const t = setTimeout(() => {
      persist({ data, theme, fx, admin });
    }, 600);
    return () => clearTimeout(t);
  }, [dirty, data, theme, fx, admin, persist]);

  const setField = useCallback((path, value) => {
    stageData((prev) => setPath(prev, path, value));
  }, [stageData]);

  const resetDefaults = useCallback(() => {
    const fresh = {
      data: deepClone(DEFAULT_PROFILE),
      theme: { ...DEFAULT_THEME },
      fx: { ...DEFAULT_FX },
      admin: { ...DEFAULT_ADMIN, pin: admin.pin, lastUpdated: new Date().toISOString() },
    };
    setData(fresh.data);
    setThemeState(fresh.theme);
    setFxState(fresh.fx);
    setAdminState(fresh.admin);
    persist(fresh);
    setDirty(false);
    push("Reset to profile.js defaults");
  }, [persist, push, admin.pin]);

  const exportProfileJS = useCallback(() => {
    const body = JSON.stringify(data, null, 2);
    const code = `// Generated by Portfolio Admin Dashboard — ${new Date().toISOString()}\n// Paste into src/data/profile.js\n\nexport const profile = ${body};\n\nexport const sectionIds = profile.sections.map((s) => s.id);\n`;
    const blob = new Blob([code], { type: "text/javascript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "profile.js";
    a.click();
    URL.revokeObjectURL(a.href);
    push("profile.js exported");
    return code;
  }, [data, push]);

  const exportThemeCSS = useCallback(() => {
    const css = `:root {\n  --void: ${theme.void};\n  --void-soft: ${theme.voidSoft};\n  --orange: ${theme.orange};\n  --ember: ${theme.ember};\n  --amber: ${theme.amber};\n  --ink: ${theme.ink};\n  --muted: ${theme.muted};\n  --dim: ${theme.dim};\n  --line: ${theme.line};\n  --font-display: ${theme.fontDisplay};\n  --font-body: ${theme.fontBody};\n  --font-mono: ${theme.fontMono};\n}\n`;
    const blob = new Blob([css], { type: "text/css" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "theme.css";
    a.click();
    URL.revokeObjectURL(a.href);
    push("Theme CSS exported");
    return css;
  }, [theme, push]);

  const exportBackup = useCallback(() => {
    const payload = { app: "portfolio-cms", version: 1, exportedAt: new Date().toISOString(), data, theme, fx, admin };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
    push("Backup JSON exported");
  }, [data, theme, fx, admin, push]);

  const importBackup = useCallback((payload) => {
    if (!payload || typeof payload !== "object" || !payload.data) throw new Error("Invalid backup file");
    commit({
      data: payload.data,
      theme: { ...DEFAULT_THEME, ...(payload.theme || {}) },
      fx: { ...DEFAULT_FX, ...(payload.fx || {}) },
      admin: { ...DEFAULT_ADMIN, ...(payload.admin || {}) },
    });
    push("Backup restored");
  }, [commit, push]);

  const storageUsage = useMemo(() => {
    try {
      const raw = JSON.stringify({ data, theme, fx, admin });
      return { bytes: new Blob([raw]).size, keys: Object.keys(localStorage).length };
    } catch {
      return { bytes: 0, keys: 0 };
    }
  }, [data, theme, fx, admin]);

  const value = useMemo(() => ({
    data, theme, fx, admin, dirty, toasts, push,
    stageData, stageTheme, stageFx, stageAdmin, addInquiry,
    setField, getField: (path) => getPath(data, path),
    save, commit, resetDefaults,
    exportProfileJS, exportThemeCSS, exportBackup, importBackup,
    storageUsage, setPath, deepClone,
    authKey: AUTH_KEY, storageKey: STORAGE_KEY,
    defaults: { profile: DEFAULT_PROFILE, theme: DEFAULT_THEME, fx: DEFAULT_FX },
  }), [data, theme, fx, admin, dirty, toasts, push, stageData, stageTheme, stageFx, stageAdmin, addInquiry, setField, save, commit, resetDefaults, exportProfileJS, exportThemeCSS, exportBackup, importBackup, storageUsage]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}

/** Safe accessor for public components: falls back to static profile when provider is absent. */
export function useProfileData() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) return { data: DEFAULT_PROFILE, theme: DEFAULT_THEME, fx: DEFAULT_FX, admin: { openForOpportunities: true, inquiries: [] } };
  return { data: ctx.data, theme: ctx.theme, fx: ctx.fx, admin: ctx.admin };
}
