// Home.jsx

import AboutMe from "../../components/page_components/home/AboutMe";
import HeroSection from "../../components/page_components/home/HeroSection";
// import ExperienceSection from "../../components/page_components/home/ExperienceSection";



const Home = () => {

  return (
    <div
      className="relative min-h-screen "
    >
   

      {/* content */}
      <div id="smooth-content">
        <section className="flex flex-col relative text-amber-50 ">
          <HeroSection />
          <AboutMe />
          {/* <ExperienceSection /> */}

          <section className="min-h-screen flex justify-center">
            <h2 className="text-6xl font-bold">Skills</h2>
          </section>
          <section className="min-h-screen flex justify-center">
            <h2 className="text-6xl font-bold">Skills</h2>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Home;