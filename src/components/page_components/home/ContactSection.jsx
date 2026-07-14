import { useState } from "react";
import { profile } from "../../../data/profile";

const ContactSection = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <section id="contact" className="term-reveal">
      <div className="mb-6 text-[#5cf6ff]">
        {profile.user}~/dev $ <span className="text-white">./contact --hire --urgent</span>
      </div>

      <div className="term-box relative overflow-hidden border-[#1f4d1f] bg-gradient-to-br from-[#070b07] to-[#050805] p-8">
        <div className="absolute right-0 top-0 h-32 w-32 bg-[#39ff7a]/5 blur-3xl" />

        <h2 className="mb-2 text-2xl font-bold text-[#eafff1]">
          Initiate{" "}
          <span className="glow-soft text-[#39ff7a] underline decoration-[#39ff7a]/30 decoration-double">
            {profile.contact.headline}
          </span>{" "}
          process
        </h2>
        <p className="mb-6 max-w-[500px] text-[14px] text-[#5f8d68]">{profile.contact.blurb}</p>

        <div className="mb-8 flex items-center justify-between rounded-sm border border-[#1f4d1f] bg-black p-4 shadow-[inset_0_0_15px_rgba(57,255,122,0.08)]">
          <code className="glow-soft text-[16px] tracking-tight text-[#39ff7a]">
            $ mail {profile.contact.email}
            <span className="blink ml-2 inline-block h-5 w-2.5 bg-[#39ff7a] align-middle" />
          </code>
          <button
            type="button"
            onClick={copyEmail}
            className="border border-[#143614] px-2 py-1 text-[11px] uppercase tracking-tighter text-[#5f8d68] transition-colors hover:text-[#39ff7a]"
          >
            {copied ? "COPIED!" : "COPY_ADDR"}
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {profile.contact.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="flex items-center gap-2 border border-[#143614] bg-black/30 px-4 py-2 text-[12px] transition-all hover:border-[#39ff7a] hover:text-[#39ff7a]"
            >
              <span className="text-[#39ff7a]">{"[>]"}</span> {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
