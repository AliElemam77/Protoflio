import { profile } from "../../../data/profile";

const HeroSection = () => {
  return (
    <section id="hero" className="space-y-6">
      <div className="hero-reveal text-[#5cf6ff]">
        {profile.user}~/dev $ <span className="text-white">whoami --full --glow</span>
      </div>

      <div className="hero-reveal">
        <h1 className="name-banner glow font-extrabold">
          {profile.name}
          <span className="blink text-[#39ff7a]">█</span>
        </h1>

        <p className="glow-soft mt-2 text-[17px] font-semibold text-[#39ff7a]">
          <span className="mr-2 text-[#5f8d68]">{"░>"}</span>
          {profile.role}
        </p>

        {/* TODO: edit your intro paragraph */}
        <p className="mt-4 max-w-[640px] border-l-2 border-[#143614] pl-4 italic leading-relaxed text-[#5f8d68]">
          I build modern web experiences with{" "}
          <span className="glow-soft text-[#39ff7a]">React, Next.js and TypeScript</span>, and craft{" "}
          <span className="glow-soft text-[#39ff7a]">high-performance storefronts</span> for Salla, Zid and
          Shopify. Lately I care about motion, clean architecture, and shipping fast.
        </p>
      </div>

      <div className="hero-reveal flex flex-wrap gap-4 text-[13px]">
        {profile.meta.map((m, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="glow-soft text-[#39ff7a]">[x]</span>
            <span className={m.amber ? "text-[#ffd24a]" : ""}>{m.text}</span>
          </div>
        ))}
      </div>

      <div className="hero-reveal flex flex-wrap gap-4 pt-4">
        <a
          href="#work"
          className="glow border border-transparent bg-[#39ff7a] px-6 py-2.5 text-[14px] font-bold text-[#050805] transition-transform hover:scale-105"
        >
          {"$ ls ~/projects ->"}
        </a>
        <a
          href="#contact"
          className="glow-soft border border-[#39ff7a] px-6 py-2.5 text-[14px] font-bold text-[#39ff7a] transition-colors hover:bg-[#39ff7a]/10"
        >
          ./contact --hire
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
