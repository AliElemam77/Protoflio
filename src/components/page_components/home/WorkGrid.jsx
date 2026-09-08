import { profile } from "../../../data/profile";
import { ArrowUpRight } from "../../commen/Icons";

const { work, projects } = profile;

const ProjectCard = ({ project, index }) => {
  const external = project.href && project.href !== "#";
  const Tag = external ? "a" : "div";

  return (
    <Tag
      {...(external
        ? { href: project.href, target: "_blank", rel: "noreferrer noopener" }
        : {})}
      className="work-card group relative block aspect-video overflow-hidden rounded-[1.5rem] border border-white/10"
      style={{
        background: `linear-gradient(145deg, ${project.tint[0]}cc 0%, ${project.tint[1]}88 45%, #0a0a0a 100%)`,
      }}
    >
      {/* resting state */}
      <div className="work-card__rest absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between">
          <span className="mono text-[10px] tracking-[0.4em] text-white/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mono rounded-full border border-white/25 px-3 py-1 text-[9px] tracking-[0.3em] text-white/70">
            {project.status}
          </span>
        </div>
        <h3 className="font-display text-3xl text-white md:text-4xl">
          {project.title}
        </h3>
      </div>

      {/* hover overlay */}
      <div className="work-card__overlay absolute inset-0 flex flex-col justify-between bg-black/40 p-6 backdrop-blur-[2px] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="mono text-[10px] tracking-[0.4em] text-[#ff4d00]">
            {project.category}
          </p>
          {external ? (
            <span className="text-white">
              <ArrowUpRight width="18" height="18" />
            </span>
          ) : null}
        </div>

        <div>
          <h3 className="font-display text-3xl text-white md:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-300">
            {project.desc}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="mono rounded-full border border-white/20 px-3 py-1 text-[9px] tracking-[0.2em] text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Tag>
  );
};

const WorkGrid = () => (
  <div className="section-content w-full px-8 pb-24 pt-28 md:px-24 md:pb-28 md:pt-36">
    <div className="mb-8 flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p data-anim className="label mb-5 text-[#ff4d00]">
          {work.tag}
        </p>
        <h2
          data-anim
          className="font-display text-[16vw] leading-[0.85] text-white md:text-[9vw]"
        >
          {work.title}
        </h2>
      </div>
      <p
        data-anim
        className="mono max-w-xs text-[10px] leading-loose tracking-[0.25em] text-zinc-600"
      >
        {work.note}
      </p>
    </div>

    {/* The grid keeps its own scroll so the section itself stays fixed. */}
    <div
      data-anim
      data-scroll-region=""
      className="mask-y min-h-0 flex-1 overflow-y-auto pr-1"
    >
      <div className="grid grid-cols-1 gap-5 pb-2 md:grid-cols-2 md:gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  </div>
);

export default WorkGrid;
