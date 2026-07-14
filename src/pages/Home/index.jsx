// Home.jsx — the shell session, rendered top-to-bottom inside the terminal window.

import BootLog from "../../components/page_components/home/BootLog";
import HeroSection from "../../components/page_components/home/HeroSection";
import IdentityCard from "../../components/page_components/home/IdentityCard";
import WorkGrid from "../../components/page_components/home/WorkGrid";
import SkillMeters from "../../components/page_components/home/SkillMeters";
import ContactSection from "../../components/page_components/home/ContactSection";

const Divider = ({ children, className = "" }) => (
  <div
    className={`select-none overflow-hidden whitespace-nowrap py-4 font-mono text-[#143614] opacity-50 ${className}`}
  >
    {children}
  </div>
);

const Home = () => {
  return (
    <>
      <BootLog />
      <HeroSection />

      <Divider className="flex justify-center">
        {"::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"}
      </Divider>

      <IdentityCard />

      <Divider>
        {"╔══════════════════════════════════════════════════════════════════════════════════════════╗"}
      </Divider>

      <WorkGrid />

      <Divider className="text-right">
        {"╚══════════════════════════════════════════════════════════════════════════════════════════╝"}
      </Divider>

      <SkillMeters />

      <Divider className="flex justify-center">
        {"X--------------------------------------------------------------------------------------X"}
      </Divider>

      <ContactSection />
    </>
  );
};

export default Home;
