import { ArrowUpRight } from "../../../commen/Icons";

/**
 * JourneyStageCard — Project Display Card for Journey Section
 *
 * Layout:
 * - Top Bar: Project Index, Category tag, and Status indicator
 * - Left Column: Title, Description, Tech stack tags, and Action buttons
 * - Right Column: Dedicated Project Screenshot Image with glowing HUD accents & hover link
 */
const JourneyStageCard = ({ stage, isActive }) => {
  const project = stage;
  const title = project.title;
  const category = project.category || project.badge || "FEATURED PROJECT";
  const desc = project.desc || project.summary;
  const tags = project.tags || project.stack || [];
  const status = project.status || "LIVE";
  const live = project.live || project.href;
  const repo = project.repo;
  const index = project.index;
  const image = project.image;
  const tint = project.tint || ["#ff4d00", "#b22222"];

  return (
    <article
      aria-label={`${title} - ${category}`}
      className={`relative flex flex-col justify-between transition-all duration-500 ${
        isActive ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4 pointer-events-none"
      }`}
    >
      {/* ── 1. Top Bar: Index & Status ── */}
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ff4d00]/60 bg-[#ff4d00]/15 font-mono text-xs font-bold text-[#ff4d00] shadow-[0_0_10px_rgba(255,77,0,0.3)]">
            {index}
          </span>
          <span className="mono text-[10px] tracking-[0.25em] text-[#ff4d00]">
            {category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="tech-dot-pulse inline-block h-2 w-2 rounded-full bg-[#ff4d00]" />
          <span
            className={`mono rounded-full border px-2.5 py-0.5 text-[9px] tracking-[0.25em] ${
              status === "LIVE"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/20 bg-white/5 text-zinc-300"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* ── 2. Content Row: Left Details + Right Image (Circled by user) ── */}
      <div className="mt-1 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Left: Title, Description, Tags, Action Buttons */}
        <div className="flex-1 min-w-0 pr-0 md:pr-4">
          <h3 className="font-display text-3xl uppercase tracking-tight text-white sm:text-4xl md:text-5xl leading-[0.95]">
            {title}
          </h3>

          <p className="my-2.5 text-xs sm:text-sm leading-relaxed text-zinc-300 line-clamp-3 md:line-clamp-none">
            {desc}
          </p>

          {tags.length > 0 && (
            <div className="my-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="mono rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] tracking-[0.16em] text-zinc-300 transition-colors hover:border-[#ff4d00] hover:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="illoca-btn"
              >
                <div className="illoca-btn__icon">
                  <ArrowUpRight width="13" height="13" />
                </div>
                <div className="illoca-btn__body">
                  <span className="illoca-btn__text">VISIT LIVE APP</span>
                  <span className="illoca-btn__text-hover">VISIT LIVE APP</span>
                </div>
              </a>
            )}

            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mono inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-[9px] tracking-[0.2em] text-white transition-colors hover:border-[#ff4d00] hover:bg-[#ff4d00] hover:text-black font-semibold"
              >
                <span>SOURCE CODE</span>
                <ArrowUpRight width="11" height="11" />
              </a>
            )}
          </div>
        </div>

        {/* Right: Project Image Thumbnail (Shown directly inside the card) */}
        <div className="w-full md:w-[44%] lg:w-[46%] shrink-0">
          <div className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-white/15 bg-black/60 shadow-2xl transition-all duration-500 hover:border-[#ff4d00]/70">
            {image ? (
              <>
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              </>
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center p-4 text-center"
                style={{
                  background: `linear-gradient(135deg, ${tint[0]}44 0%, ${tint[1]}66 100%)`,
                }}
              >
                <span className="font-display text-2xl tracking-wider text-white/90">
                  {title}
                </span>
                <span className="mono mt-1 text-[9px] tracking-[0.25em] text-[#ff4d00]">
                  {category}
                </span>
              </div>
            )}

            {/* Corner HUD accents */}
            <div className="hud-corner-tl !border-white/40" />
            <div className="hud-corner-tr !border-white/40" />
            <div className="hud-corner-bl !border-white/40" />
            <div className="hud-corner-br !border-white/40" />

            {/* Hover overlay link to Live */}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${title} live`}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
              >
                <span className="mono inline-flex items-center gap-1.5 rounded-full border border-[#ff4d00] bg-[#ff4d00] px-3.5 py-1 text-[10px] font-bold tracking-[0.2em] text-black shadow-[0_0_15px_rgba(255,77,0,0.6)]">
                  EXPLORE LIVE
                  <ArrowUpRight width="12" height="12" />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default JourneyStageCard;
