// Inline icon set — no icon dependency, everything ships with the bundle.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

export const MenuIcon = (props) => (
  <svg width="16" height="16" {...base} {...props}>
    <path d="M3 7h18M3 17h18" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg width="16" height="16" {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowUpRight = (props) => (
  <svg width="16" height="16" {...base} {...props}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

export const ArrowDown = (props) => (
  <svg width="16" height="16" {...base} {...props}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const GithubIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.72c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

export const LinkedinIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.2 8.48h3.6V21H3.2V8.48Zm5.86 0h3.45v1.71h.05c.48-.9 1.66-1.86 3.42-1.86 3.66 0 4.34 2.35 4.34 5.4V21h-3.6v-6.38c0-1.52-.03-3.48-2.15-3.48-2.15 0-2.48 1.66-2.48 3.37V21H9.06V8.48Z" />
  </svg>
);

export const MailIcon = (props) => (
  <svg width="20" height="20" {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);
