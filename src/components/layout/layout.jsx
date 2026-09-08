import { useCallback } from "react";
import { Outlet } from "react-router-dom";
import ExperienceProvider from "../../context/ExperienceProvider";
import { useExperience } from "../../context/experienceContext";
import Header from "../Navbar";
import MenuOverlay from "../Navbar/MenuOverlay";
import GrainOverlay from "../commen/GrainOverlay";
import MeshBlobs from "../commen/MeshBlobs";
import SectionIndicator from "../commen/SectionIndicator";
import Loader from "../commen/Loader";

const Shell = () => {
  const { setReady } = useExperience();
  const handleLoaded = useCallback(() => setReady(true), [setReady]);

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-[#080808]">
      {/* Atmosphere */}
      <MeshBlobs />
      <GrainOverlay />

      {/* Chrome scrims — keep scrolled content legible under the fixed UI */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[7950] h-28 bg-gradient-to-b from-[#080808] via-[#080808]/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent"
      />

      {/* Chrome */}
      <Header />
      <MenuOverlay />
      <SectionIndicator />

      {/* Sections */}
      <main className="relative z-10 h-full w-full">
        <Outlet />
      </main>

      <Loader onDone={handleLoaded} />
    </div>
  );
};

export default function Layout() {
  return (
    <ExperienceProvider>
      <Shell />
    </ExperienceProvider>
  );
}
