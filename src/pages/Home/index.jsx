// Home.jsx

import AboutMe from "../../components/page_components/home/AboutMe";
import HeroSection from "../../components/page_components/home/HeroSection";
// import ExperienceSection from "../../components/page_components/home/ExperienceSection";

import useHomeAnimations from "../../utils/hooks/useHomeAnimations";

const DECRATION_HERO_CARD = 8;

const Home = () => {
  useHomeAnimations();

  return (
    <div
      id="smooth-wrapper"
      className="relative min-h-screen "
    >
      {/* decoration */}
      <div className="decoreation-section flex items-center justify-between absolute inset-0 h-full w-full">
        {Array.from({ length: DECRATION_HERO_CARD }).map((_, index) => (
          <div
            key={index}
            className="decoreation-hero-card h-[500px] w-[500px] blur-lg rounded-full bg-red-800/40 border border-red-900"
          />
        ))}
      </div>

      {/* content */}
      <div id="smooth-content">
        <section className="flex flex-col relative text-amber-50 ">
          <HeroSection />
          <AboutMe />
          {/* <ExperienceSection /> */}

          <section className="min-h-screen flex items-center justify-center">
            <h2 className="text-6xl font-bold">Skills</h2>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Home;