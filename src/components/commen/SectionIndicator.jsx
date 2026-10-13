import { useExperience } from "../../context/experienceContext";

// Fixed bottom-left: current section number — rule — total. Hidden on small
// screens where it collides with content.
const SectionIndicator = () => {
  const { sections, current } = useExperience();
  if (!sections?.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-8 left-8 z-50 hidden items-center gap-4 sm:flex md:bottom-12 md:left-12">
      <span className="mono text-[12px] font-medium tracking-[0.3em] text-[#ff4d00]">
        {sections[Math.min(current, sections.length - 1)]?.index || "01"}
      </span>
      <span className="block h-px w-12 bg-zinc-800" />
      <span className="mono text-[12px] tracking-[0.3em] text-zinc-600">
        {String(sections.length).padStart(2, "0")}
      </span>
    </div>
  );
};

export default SectionIndicator;
