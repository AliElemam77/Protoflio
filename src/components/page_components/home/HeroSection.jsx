import { useProfileData } from "../../../context/PortfolioContext";
import { profile as fallbackProfile } from "../../../data/profile";
import { useExperience } from "../../../context/experienceContext";
import { ArrowDown } from "../../commen/Icons";

const HeroSection = () => {
  const { step } = useExperience();
  const { data, admin } = useProfileData();
  const p = data || fallbackProfile;
  const { hero, status } = p;
  const meta = (hero.meta || []).filter((m) => admin?.openForOpportunities !== false || !/OPPORTUNIT/i.test(m));

  return (
    <div className="section-content mx-auto w-full max-w-6xl justify-between px-6 pb-28 pt-28 sm:px-10 md:px-16 md:pb-32 md:pt-36 lg:px-20">
      {/* Top tag */}
      <p data-anim className="label text-[#ff4d00]">
        {hero.tag}
      </p>

      {/* Display type */}
      <div className="relative my-12 md:my-0">
        {/* soft-light blob sitting behind the outlined line, for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] top-[35%] h-[38vw] w-[55vw] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--orange), transparent 70%)",
            filter: "blur(100px)",
            mixBlendMode: "soft-light",
          }}
        />
        <h1 className="font-display relative text-[clamp(3.2rem,15vw,12rem)] leading-[0.82] sm:text-[clamp(3.5rem,16vw,13rem)] md:text-[clamp(4rem,14vw,12rem)]">
          <span data-anim className="block text-white">
            {hero.line1}
          </span>
          <span data-anim className="outline-text block italic">
            {hero.line2}
          </span>
        </h1>
      </div>

      {/* Footer row */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p
          data-anim
          className="max-w-[28rem] text-[1.05rem] leading-relaxed text-zinc-400 md:text-[1.25rem]"
        >
          {hero.blurb}
        </p>

        <div data-anim className="flex flex-col gap-3 md:items-end">
          <span className="mono flex items-center gap-2 text-[10px] tracking-[0.4em] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d00]" />
            {status}
          </span>
          {meta.map((item) => (
            <span
              key={item}
              className="mono text-[10px] tracking-[0.4em] text-zinc-600"
            >
              {item}
            </span>
          ))}
          <button
            type="button"
            onClick={() => step(1)}
            className="mono mt-4 flex items-center gap-3 text-[10px] tracking-[0.4em] text-zinc-500 transition-colors duration-500 hover:text-[#ff4d00]"
          >
            SCROLL <ArrowDown width="14" height="14" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
