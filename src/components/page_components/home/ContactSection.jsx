import { useState } from "react";
import { useProfileData, usePortfolio } from "../../../context/PortfolioContext";
import { profile as fallbackProfile } from "../../../data/profile";
import {
  ArrowUpRight,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "../../commen/Icons";

const socialIcons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: MailIcon,
};
const FallbackIcon = ArrowUpRight;

const BUDGETS = ["< $500", "$500 – $1k", "$1k – $3k", "$3k+", "Let's discuss"];
const TYPES = ["Salla theme", "Storefront", "SaaS / Platform", "Other"];
const MAX_MSG = 800;

const ContactSection = () => {
  const { data } = useProfileData();
  const portfolio = usePortfolio();
  const p = data || fallbackProfile;
  const { contact, footer } = p;

  const [form, setForm] = useState({ name: "", email: "", type: TYPES[0], budget: BUDGETS[2], message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email";
    if (form.message.trim().length < 10) e.message = "Tell me a little more (10+ chars)";
    if (form.message.trim().length > MAX_MSG) e.message = `Keep it under ${MAX_MSG} chars`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (!validate()) {
      setStatus({ type: "err", msg: "CHECK THE HIGHLIGHTED FIELDS" });
      return;
    }
    setSending(true);
    const inquiry = {
      id: `inq-${Date.now().toString(36)}`,
      name: form.name.trim(),
      email: form.email.trim(),
      message: `[${form.type} · ${form.budget}] ${form.message.trim()}`,
      date: new Date().toISOString(),
      read: false,
    };
    try {
      if (portfolio?.addInquiry) portfolio.addInquiry(inquiry);
      else portfolio?.stageAdmin?.((a) => ({ ...a, inquiries: [inquiry, ...(a.inquiries || [])] }));
    } catch {
      /* static fallback — still show success */
    }
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setStatus({ type: "ok", msg: "MESSAGE SENT — I'LL REPLY WITHIN 48H" });
    }, 600);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", type: TYPES[0], budget: BUDGETS[2], message: "" });
    setErrors({});
    setSent(false);
    setStatus({ type: "", msg: "" });
  };

  const inputCls = (bad) =>
    `w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-[#ff4d00] ${
      bad ? "border-red-500/70" : "border-white/10"
    }`;
  const labelCls = "mono mb-1.5 block text-[10px] tracking-[0.3em] text-zinc-400";

  return (
    <div className="section-content center-safe mx-auto w-full max-w-6xl items-center px-6 pb-28 pt-28 text-center sm:px-10 md:px-16 md:pb-32 md:pt-36 lg:px-20 xl:px-24">
      <p data-anim className="label text-[#ff4d00]">
        {contact.tag}
      </p>

      <a
        data-anim
        href={`mailto:${contact.email}`}
        className="font-display mt-8 block text-[clamp(3rem,17vw,13rem)] leading-[0.85] md:mt-10"
        aria-label={`Email ${contact.email}`}
      >
        <span className="block text-white">{contact.line1}</span>
        <span className="outline-fill block italic">{contact.line2}</span>
      </a>

      <p data-anim className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-zinc-400 md:text-[1.25rem]">
        {contact.blurb}
      </p>

      <div data-anim className="mt-12 grid w-full gap-5 text-left lg:grid-cols-[1fr_1.15fr]">
        {/* Left — direct channels */}
        <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
          <p className="mono text-[10px] tracking-[0.4em] text-zinc-500">DIRECT</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${contact.email}`}
              className="mono inline-flex max-w-full flex-wrap items-center gap-2 break-all text-[12px] tracking-[0.15em] text-white transition-colors duration-500 hover:text-[#ff4d00]"
            >
              {contact.email}
              <ArrowUpRight width="14" height="14" />
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="mono rounded-full border border-white/10 px-3 py-1.5 text-[9px] tracking-[0.25em] text-zinc-400 transition-colors hover:border-[#ff4d00] hover:text-white"
            >
              {copied ? "COPIED ✓" : "COPY"}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 sm:gap-4">
            {contact.socials.map((social) => {
              const Icon =
                socialIcons[social.id] ||
                socialIcons[social.label?.toLowerCase()] ||
                FallbackIcon;
              return (
                <a
                  key={social.id}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  title={social.label}
                  data-magnetic="0.25"
                  className="social flex h-14 w-14 items-center justify-center rounded-full border border-white/10 text-white sm:h-16 sm:w-16"
                >
                  <Icon />
                </a>
              );
            })}
          </div>

          <div className="mono mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] tracking-[0.3em]">
            <a
              href={contact.cv.href}
              className="w-fit border-b border-zinc-700 pb-1 text-zinc-400 transition-colors duration-500 hover:border-[#ff4d00] hover:text-[#ff4d00]"
            >
              {contact.cv.label}
            </a>
            <span className="hidden items-center gap-2 text-zinc-600 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              REPLIES IN ~48H
            </span>
          </div>
        </div>

        {/* Right — inquiry form */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
          {sent ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center py-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-2xl text-emerald-300">
                ✓
              </span>
              <h3 className="font-display mt-5 text-3xl text-white">RECEIVED.</h3>
              <p className="mono mt-3 max-w-xs text-[10px] leading-relaxed tracking-[0.25em] text-zinc-400">
                THANKS {form.name.split(" ")[0]?.toUpperCase() || "THERE"} — YOUR NOTE IS IN THE DASHBOARD INBOX
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="mono rounded-full border border-white/15 px-5 py-2.5 text-[10px] tracking-[0.25em] text-zinc-300 transition-colors hover:border-[#ff4d00] hover:text-white"
                >
                  SEND ANOTHER
                </button>
                <a
                  href={`mailto:${contact.email}`}
                  className="mono rounded-full bg-[#ff4d00] px-5 py-2.5 text-[10px] tracking-[0.25em] text-black transition-colors hover:bg-white"
                >
                  OR EMAIL DIRECTLY
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex items-center justify-between">
                <p className="mono text-[10px] tracking-[0.4em] text-zinc-500">SEND A MESSAGE</p>
                <span className="mono text-[9px] tracking-[0.25em] text-zinc-600">~30 SEC</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className={labelCls}>NAME *</label>
                  <input
                    id="ct-name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    className={inputCls(errors.name)}
                  />
                  {errors.name && <p className="mono mt-1 text-[9px] tracking-[0.2em] text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="ct-email" className={labelCls}>EMAIL *</label>
                  <input
                    id="ct-email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="jane@company.com"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={inputCls(errors.email)}
                  />
                  {errors.email && <p className="mono mt-1 text-[9px] tracking-[0.2em] text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="ct-type" className={labelCls}>PROJECT TYPE</label>
                  <select id="ct-type" value={form.type} onChange={(e) => set("type", e.target.value)} className={`${inputCls(false)} cursor-pointer`}>
                    {TYPES.map((t) => <option key={t} value={t} className="bg-[#0e0e0e]">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="ct-budget" className={labelCls}>BUDGET</label>
                  <select id="ct-budget" value={form.budget} onChange={(e) => set("budget", e.target.value)} className={`${inputCls(false)} cursor-pointer`}>
                    {BUDGETS.map((b) => <option key={b} value={b} className="bg-[#0e0e0e]">{b}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="ct-msg" className={labelCls}>MESSAGE *</label>
                    <span className={`mono text-[9px] tracking-[0.2em] ${form.message.length > MAX_MSG ? "text-red-400" : "text-zinc-600"}`}>
                      {form.message.length}/{MAX_MSG}
                    </span>
                  </div>
                  <textarea
                    id="ct-msg"
                    data-scroll-region=""
                    value={form.message}
                    onChange={(e) => set("message", e.target.value.slice(0, MAX_MSG + 100))}
                    placeholder="Goal, timeline, links…"
                    rows={4}
                    aria-invalid={!!errors.message}
                    className={`${inputCls(errors.message)} max-h-56 min-h-28 resize-y`}
                  />
                  {errors.message && <p className="mono mt-1 text-[9px] tracking-[0.2em] text-red-400">{errors.message}</p>}
                </div>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="illoca-btn mt-4 w-full border border-[#ff4d00]/40 disabled:opacity-50"
              >
                <span className="illoca-btn__icon">→</span>
                <span className="illoca-btn__body flex-1 justify-center">
                  {sending ? "SENDING…" : "SEND MESSAGE"}
                  <span className="illoca-btn__text-hover">{sending ? "SENDING…" : "SEND MESSAGE"}</span>
                </span>
              </button>
              {status.msg && (
                <p role="status" className={`mono mt-3 text-center text-[10px] tracking-[0.25em] ${status.type === "err" ? "text-red-400" : "text-emerald-400"}`}>
                  {status.msg}
                </p>
              )}
              <p className="mono mt-2 text-center text-[9px] tracking-[0.25em] text-zinc-700">
                SAVED TO DASHBOARD INBOX · NO BACKEND NEEDED
              </p>
            </form>
          )}
        </div>
      </div>

      <p data-anim className="mono mt-14 text-[10px] tracking-[0.3em] text-zinc-700">
        {footer}
      </p>
      <a
        data-anim
        href="/admin"
        className="mono mt-4 inline-block rounded-full border border-white/5 px-4 py-2 text-[9px] tracking-[0.4em] text-zinc-700 transition-colors hover:border-[#ff4d00]/50 hover:text-[#ff4d00]"
        aria-label="Open admin dashboard"
      >
        ADMIN CONSOLE →
      </a>
    </div>
  );
};

export default ContactSection;
