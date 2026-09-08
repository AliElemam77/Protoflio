import { profile } from "../../../../data/profile";
import ExperienceTimeline from "./ExperienceTimeline";

const { experience } = profile;

/** Start year for the big display token; non-dated entries keep their label. */
const displayYear = (period) => period.match(/\d{4}/)?.[0] ?? period;

// Built once at module scope: the array identity has to stay stable or the
// timeline would tear down and rebuild its WebGL context on every render.
// Reversed so the row reads oldest → newest, left to right.
const ITEMS = [...experience.roles].reverse().map((role) => ({
  id: role.id,
  year: displayYear(role.period),
  role: role.title,
  company: role.org,
  period: role.period,
  description: role.summary,
  skills: role.stack,
  href: role.orgHref,
  current: /PRESENT/i.test(role.period),
}));

const START_INDEX = Math.max(
  ITEMS.findIndex((item) => item.current),
  0
);

const ExperienceSection = ({ active = true }) => (
  <div className="section-content w-full px-8 pb-24 pt-28 md:px-24 md:pb-28 md:pt-36">
    <div className="mb-6 flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p data-anim className="label mb-5 text-[#ff4d00]">
          {experience.tag}
        </p>
        <h2
          data-anim
          className="font-display text-[14vw] leading-[0.85] text-white md:text-[8vw]"
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

export default ExperienceSection;
