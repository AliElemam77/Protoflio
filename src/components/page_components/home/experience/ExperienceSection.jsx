import { useMemo } from "react";
import { useProfileData } from "../../../../context/PortfolioContext";
import { profile as fallbackProfile } from "../../../../data/profile";
import ExperienceTimeline from "./ExperienceTimeline";

/** Start year for the big display token; non-dated entries keep their label. */
const displayYear = (period) => String(period || "").match(/\d{4}/)?.[0] ?? period;

const ExperienceSection = ({ active = true }) => {
  const { data } = useProfileData();
  const experience = (data || fallbackProfile).experience;
  // Memoised so the WebGL timeline keeps a stable array identity per data change.
  const ITEMS = useMemo(() => [...(experience.roles || [])].reverse().map((role) => ({
    id: role.id,
    year: displayYear(role.period),
    role: role.title,
    company: role.org,
    period: role.period,
    description: role.summary,
    skills: role.stack,
    href: role.orgHref,
    current: /PRESENT/i.test(role.period || ""),
  })), [experience.roles]);
  const START_INDEX = Math.max(ITEMS.findIndex((item) => item.current), 0);
  return (
  <div className="section-content w-full px-8 pb-20 pt-24 md:px-24 md:pb-24 md:pt-32">
    <div className="mb-4 flex shrink-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p data-anim className="label mb-4 text-[#ff4d00]">
          {experience.tag}
        </p>
        <h2
          data-anim
          className="font-display text-[12vw] leading-[0.85] text-white md:text-[5.5vw]"
        >
          {experience.title}
        </h2>
      </div>
      <p
        data-anim
        className="mono max-w-xs text-[10px] leading-loose tracking-[0.25em] text-zinc-600"
      >
        {experience.note}
      </p>
    </div>

    <ExperienceTimeline
      items={ITEMS}
      active={active}
      initialIndex={START_INDEX}
    />
  </div>
);
};

export default ExperienceSection;
