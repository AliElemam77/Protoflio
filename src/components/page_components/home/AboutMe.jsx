import { useProfileData } from "../../../context/PortfolioContext";
import { profile as fallbackProfile } from "../../../data/profile";

const row = (skills) => [...(skills || []), ...(skills || [])];

const SkillsMarquee = ({ skills }) => {
  const list = skills || [];
  const half = Math.ceil(list.length / 2);
  const top = row(list.slice(0, half));
  const bottom = row(list.slice(half));
  return (
    <div className="relative mt-12 select-none" aria-label={`Skills: ${list.length} technologies`}>
      {/* Big display row */}
      <div className="group relative overflow-hidden border-y border-white/10 py-5 md:py-7">
        <div className="marquee marquee-big marquee-pause w-max items-center" aria-hidden="true">
          {row(list).map((skill, i) => (
            <span key={`big-${skill}-${i}`} className="flex shrink-0 items-center">
              <span className={`font-display px-6 text-[clamp(1.8rem,5vw,3.8rem)] leading-none md:px-10 ${i % 2 ? "outline-text" : "text-white"}`}>
                {skill.toUpperCase()}
              </span>
              <span className="text-[1.4rem] text-[#ff4d00]" aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#080808] to-transparent md:w-40" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#080808] to-transparent md:w-40" />
      </div>

      {/* Mono detail rows — opposite directions */}
      <div className="group relative mt-3 overflow-hidden py-3">
        <div className="marquee marquee-slow marquee-pause mask-x w-max gap-8" aria-hidden="true">
          {top.map((skill, i) => (
            <span key={`t-${skill}-${i}`} className="mono flex shrink-0 items-center gap-3 whitespace-nowrap text-[11px] tracking-[0.3em] text-zinc-400 transition-colors hover:text-white">
              {skill}
              <span className="text-[#ff4d00]">/</span>
            </span>
          ))}
        </div>
      </div>
      <div className="group relative overflow-hidden py-3">
        <div className="marquee marquee-reverse marquee-slow marquee-pause mask-x w-max gap-8" aria-hidden="true">
          {bottom.map((skill, i) => (
            <span key={`b-${skill}-${i}`} className="mono flex shrink-0 items-center gap-3 whitespace-nowrap text-[11px] tracking-[0.3em] text-zinc-500 transition-colors hover:text-white">
              <span className="text-[#ff4d00]">·</span>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <p className="mono mt-4 text-center text-[9px] tracking-[0.4em] text-zinc-700">
        {list.length} SKILLS · HOVER TO PAUSE
      </p>
      {/* Screen-reader single copy */}
      <p className="sr-only">{list.join(", ")}</p>
    </div>
  );
};

const AboutMe = () => {
  const { data } = useProfileData();
  const p = data || fallbackProfile;
  const { about, skills } = p;
  return (
  <div className="section-content center-safe mx-auto w-full max-w-6xl px-6 pb-24 pt-28 sm:px-10 md:px-16 md:pb-24 md:pt-32 lg:px-20">
    <p data-anim className="label mb-8 text-[#ff4d00]">
      {about.tag}
    </p>

    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
      {/* ── Left column ── */}
      <div className="order-2 lg:order-1 lg:col-span-7">
        <h2 className="font-display text-[clamp(2.8rem,13vw,7rem)] leading-[0.85] md:text-[clamp(2.5rem,5.5vw,5.5rem)]">
          <span data-anim className="block text-white">
            {about.line1}
          </span>
          <span data-anim className="outline-text block italic">
            {about.line2}
          </span>
        </h2>

        <div className="mt-6 max-w-xl space-y-4">
          {about.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              data-anim
              className="text-[0.95rem] text-zinc-400 md:text-[1.05rem]"
              style={{ lineHeight: 1.75 }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div data-anim className="mt-10 grid max-w-md grid-cols-3 gap-6 md:gap-10">
          {about.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl text-white sm:text-4xl md:text-5xl xl:text-6xl">
                {stat.value}
                <span className="text-[#ff4d00]">.</span>
              </p>
              <p className="mono mt-3 text-[9px] tracking-[0.25em] text-zinc-600 md:text-[10px] md:tracking-[0.3em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right column: portrait ── */}
      <div data-anim className="order-1 lg:order-2 lg:col-span-5">
        <div className="relative mx-auto w-full max-w-[13rem] sm:max-w-xs lg:max-w-sm xl:max-w-md">
          {/* orange glow behind the bottom-right corner */}
          <div
            aria-hidden="true"
            className="absolute -bottom-14 -right-14 h-64 w-64 rounded-full opacity-90"
            style={{
              background: "radial-gradient(circle, var(--orange), transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <figure className="portrait relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
            <img
              src={about.portrait}
              alt={about.portraitAlt}
              className="h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent"
            />
            <figcaption className="mono absolute bottom-5 left-5 text-[10px] tracking-[0.4em] text-white/80">
              {p.name}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>

    <div data-anim>
      <SkillsMarquee skills={skills} />
    </div>
  </div>
);};

export default AboutMe;
