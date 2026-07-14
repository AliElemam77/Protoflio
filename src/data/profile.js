// ============================================================
//  EDIT ME — all portfolio content lives here.
//  Lines marked  // TODO  are placeholders: swap in real data.
// ============================================================

export const profile = {
  // Title bar + footer identity
  user: "ali",
  host: "ELEMAM-01",
  name: "ALI ELEMAM",
  role: "Frontend engineer & indie hacker, building web experiences",

  // Hero meta checks ( [x] ... ) — set amber:true for the highlighted one
  meta: [
    { text: "TODO: City, Country (UTC+?)", amber: false }, // TODO: your location
    { text: "Frontend & cross-platform", amber: false },
    { text: "Open to opportunities", amber: true },
  ],

  // neofetch identity list (green keys / sage values)
  neofetch: [
    { k: "OS", v: "Human v1.0 (frontend build)" },
    { k: "Host", v: "TODO-location" }, // TODO: your location
    { k: "Role", v: "Frontend + E-commerce" },
    { k: "Uptime", v: "TODO yrs, 4 roles" }, // TODO: years of experience
    { k: "Shell", v: "vscode, git, figma" },
    { k: "Stack", v: "React, Next, TS, Tailwind" },
    { k: "Focus", v: "storefronts & performance" },
  ],
  status: "AVAILABLE", // amber-glow status value

  // neofetch terminal color-swatch strip
  swatches: ["#000000", "#1c7a3c", "#2bbf5c", "#39ff7a", "#5cf6ff", "#ffd24a", "#5f8d68", "#eafff1"],

  // ls -la ~/projects  — TODO: replace all four with your real projects
  projects: [
    {
      name: "project-one/",
      stars: "★ TODO",
      perm: "-rwxr-xr-x",
      desc: "TODO: one-line description of what you built.",
      highlight: "what you built",
      tags: ["React", "Next.js"],
      tagAccent: "open-source",
      demo: "#",
      source: "#",
    },
    {
      name: "project-two/",
      stars: "★ TODO",
      perm: "-rwxr-xr-x",
      desc: "TODO: one-line description with a highlighted term.",
      highlight: "highlighted term",
      tags: ["TypeScript", "Tailwind"],
      tagAccent: "SaaS",
      demo: "#",
      source: "#",
    },
    {
      name: "project-three/",
      stars: "★ TODO",
      perm: "-rw-r--r--",
      desc: "TODO: a Salla / Zid storefront or theme project.",
      highlight: "storefront",
      tags: ["Salla", "Zid"],
      tagAccent: "open-source",
      demo: "#",
      source: "#",
    },
    {
      name: "project-four/",
      stars: "★ TODO",
      perm: "-rwxr-xr-x",
      desc: "TODO: a component library or animation-heavy project.",
      highlight: "animation",
      tags: ["GSAP", "React"],
      tagAccent: "SaaS",
      demo: "#",
      source: "#",
    },
  ],

  // cat stack.txt | sort -r  — honest, varied self-assessment
  skills: [
    { label: "React/Next", pct: 95 },
    { label: "JavaScript", pct: 93 },
    { label: "Tailwind CSS", pct: 92 },
    { label: "TypeScript", pct: 90 },
    { label: "Salla/Zid", pct: 88 },
    { label: "GSAP/Motion", pct: 85 },
    { label: "State/Redux", pct: 82 },
    { label: "Design/UI", pct: 80 },
  ],

  // ./contact --hire
  contact: {
    email: "hello@alielemam.dev", // TODO: your real email
    headline: "handshake",
    blurb: "Ready to build something fast, robust, and memorable. Drop a line if you have a challenge for me.",
    links: [
      { label: "github", href: "#" }, // TODO
      { label: "x.com", href: "#" }, // TODO
      { label: "blog", href: "#" }, // TODO
      { label: "CV.pdf", href: "#" }, // TODO
    ],
  },

  // shell-echo footer
  footer: {
    echo: "ali@ELEMAM-01: (c) 2026 — shell v1.0",
    git: "LAST_COMMIT: TODO [main@a1f9e2c] | UPTIME: 99.98%", // TODO
  },
};
