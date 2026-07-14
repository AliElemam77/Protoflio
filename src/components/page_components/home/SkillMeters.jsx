import { profile } from "../../../data/profile";

// "React/Next" -> "React/Next.[01]" padded to a fixed mono width.
function padLabel(label, index) {
  const suffix = `[${String(index + 1).padStart(2, "0")}]`;
  const dots = ".".repeat(Math.max(1, 12 - label.length));
  return `${label}${dots}${suffix}`;
}

const SkillMeters = () => (
  <section id="stack" className="term-reveal">
    <div className="mb-6 text-[#5cf6ff]">
      {profile.user}~/dev $ <span className="text-white">cat stack.txt | sort -r --ascii</span>
    </div>

    <div className="grid grid-cols-1 gap-x-16 gap-y-4 md:grid-cols-2">
      {profile.skills.map((s, i) => (
        <div key={s.label} className="flex items-center gap-4">
          <span className="w-[150px] shrink-0 font-mono text-[12px]">{padLabel(s.label, i)}</span>
          <div className="relative h-3 flex-1 overflow-hidden border border-[#143614] bg-black">
            <div
              className="skill-fill progress-bar absolute left-0 top-0 h-full"
              style={{ width: `${s.pct}%` }}
            />
          </div>
          <span className="glow-soft w-10 text-right text-[12px] text-[#39ff7a]">{s.pct}%</span>
        </div>
      ))}
    </div>
  </section>
);

export default SkillMeters;
