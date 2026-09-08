// The whole portfolio lives here as four fixed section layers that swap
// with a scale/fade transition — the page itself never scrolls.

import SectionShell from "../../components/commen/SectionShell";
import HeroSection from "../../components/page_components/home/HeroSection";
import AboutMe from "../../components/page_components/home/AboutMe";
import WorkGrid from "../../components/page_components/home/WorkGrid";
import ContactSection from "../../components/page_components/home/ContactSection";
import { useExperience } from "../../context/experienceContext";

const SECTION_VIEWS = {
  home: HeroSection,
  about: AboutMe,
  work: WorkGrid,
  contact: ContactSection,
};

const Home = () => {
  const { sections, current, ready } = useExperience();

  return (
    <div className="relative h-full w-full">
      {sections.map((section, i) => {
        const View = SECTION_VIEWS[section.id];
        return (
          <SectionShell
            key={section.id}
            id={section.id}
            label={section.label}
            active={ready && current === i}
          >
            <View />
          </SectionShell>
        );
      })}
    </div>
  );
};

export default Home;
