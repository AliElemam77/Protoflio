import { profile } from "../../../data/profile";

// Wrap the highlighted term inside a description with a phosphor span.
function renderDesc(desc, term) {
  if (!term || !desc.includes(term)) return desc;
  const [before, after] = desc.split(term);
  return (
    <>
      {before}
      <span className="text-[#39ff7a]">{term}</span>
      {after}
    </>
  );
}

const WorkGrid = () => (
  <section id="work" className="term-reveal">
    <div className="mb-6 text-[#5cf6ff]">
      {profile.user}~/dev $ <span className="text-white">ls -la --recursive ~/projects</span>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {profile.projects.map((p) => (
        <div
          key={p.name}
          className="project-card group flex cursor-default flex-col gap-3 border border-[#143614] bg-[#070b07] p-5"
        >
          <div className="flex items-baseline justify-between">
            <span className="glow-soft text-[16px] font-bold text-[#39ff7a]">{p.name}</span>
            <div className="flex items-baseline gap-4 text-[12px]">
              <span className="glow-soft font-bold text-[#ffd24a]">{p.stars}</span>
              <span className="font-mono text-[#1c7a3c]">{p.perm}</span>
            </div>
          </div>

          <p className="text-[14px]">{renderDesc(p.desc, p.highlight)}</p>

          <div className="mt-auto flex flex-wrap gap-2 text-[10px]">
            {p.tags.map((t) => (
              <span key={t} className="rounded-sm border border-[#143614] px-2 py-0.5 text-[#5f8d68]">
                {t}
              </span>
            ))}
            <span className="rounded-sm border border-[#ffd24a]/40 px-2 py-0.5 text-[#ffd24a]">
              {p.tagAccent}
            </span>
          </div>

          <div className="mt-2 flex gap-6 border-t border-[#143614]/30 pt-2">
            <a
              href={p.demo}
              className="flex items-center gap-1 text-[12px] transition-colors group-hover:text-[#39ff7a]"
            >
              <span className="text-[#39ff7a]">»</span> live_demo.exe
            </a>
            <a
              href={p.source}
              className="flex items-center gap-1 text-[12px] transition-colors group-hover:text-[#39ff7a]"
            >
              <span className="text-[#39ff7a]">»</span> get_source.sh
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default WorkGrid;
