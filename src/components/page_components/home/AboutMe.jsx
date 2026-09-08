import { profile } from "../../../data/profile";

const { about, skills } = profile;

const SkillsMarquee = () => {
  const track = [...skills, ...skills];
  return (
    <div className="relative mt-10 overflow-hidden border-y border-white/10 py-4">
      <div className="marquee mask-x gap-10">
        {track.map((skill, i) => (
          <span
            key={`${skill.label}-${i}`}
            className="mono flex shrink-0 items-center gap-3 text-[11px] tracking-[0.3em] text-zinc-500"
          >
            {skill.label}
            <span className="text-[#ff4d00]">/</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const AboutMe = () => (
  <div className="section-content center-safe w-full px-8 pb-24 pt-28 md:px-24 md:pb-24 md:pt-32">
    <p data-anim className="label mb-8 text-[#ff4d00]">
      {about.tag}
    </p>

    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-20">
      {/* ── Left column ── */}
      <div className="order-2 lg:order-1 lg:col-span-7">
        <h2 className="font-display text-[13vw] leading-[0.85] md:text-[5.5vw]">
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

        <div data-anim className="mt-10 flex flex-wrap gap-8 md:gap-16">
          {about.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl text-white md:text-6xl">
                {stat.value}
                <span className="text-[#ff4d00]">.</span>
              </p>
              <p className="mono mt-3 text-[10px] tracking-[0.3em] text-zinc-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right column: portrait ── */}
      <div data-anim className="order-1 lg:order-2 lg:col-span-5">
        <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-xs lg:max-w-sm">
          {/* orange glow behind the bottom-right corner */}
          <div
            aria-hidden="true"
            className="absolute -bottom-14 -right-14 h-64 w-64 rounded-full opacity-90"
            style={{
              background: "radial-gradient(circle, #ff4d00, transparent 70%)",
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
              {profile.name}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>

    <div data-anim>
      <SkillsMarquee />
    </div>
  </div>
);

export default AboutMe;
