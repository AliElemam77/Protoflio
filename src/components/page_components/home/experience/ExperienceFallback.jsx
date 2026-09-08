import { ArrowUpRight } from "../../../commen/Icons";

/**
 * Static timeline used when motion is reduced or WebGL is unavailable.
 * Same information, same visual language — no canvas, no animation.
 */
const ExperienceFallback = ({ items }) => (
  <div
    data-anim
    data-scroll-region=""
    className="mask-y min-h-0 flex-1 overflow-y-auto pr-1"
  >
    <ol className="list-none">
      {items.map((item, i) => (
        <li key={item.id}>
          <article className="exp-row grid grid-cols-1 gap-3 border-t border-white/10 py-6 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
              <p className="mono text-[10px] tracking-[0.3em] text-[#ff4d00]">
                {item.period}
              </p>
              <p className="mono mt-2 text-[9px] tracking-[0.25em] text-zinc-600">
                {String(i + 1).padStart(2, "0")} · {item.year}
              </p>
            </div>

            <div className="md:col-span-4">
              <h3 className="font-display text-xl leading-tight text-white md:text-2xl">
                {item.role}
              </h3>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mono mt-2 inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] text-zinc-400 transition-colors duration-500 hover:text-[#ff4d00]"
                >
                  {item.company}
                  <ArrowUpRight width="12" height="12" />
                </a>
              ) : (
                <p className="mono mt-2 text-[10px] tracking-[0.3em] text-zinc-400">
                  {item.company}
                </p>
              )}
            </div>

            <div className="md:col-span-5">
              <p className="text-sm leading-relaxed text-zinc-500">
                {item.description}
              </p>
              {item.skills?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="mono rounded-full border border-white/10 px-2.5 py-1 text-[9px] tracking-[0.15em] text-zinc-500"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        </li>
      ))}
    </ol>
  </div>
);

export default ExperienceFallback;
