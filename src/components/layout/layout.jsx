import { Outlet } from "react-router-dom";
import useHomeAnimations from "../../utils/hooks/useHomeAnimations";
const DECRATION_HERO_CARD = 8;

export default function Layout() {
    useHomeAnimations();

  return (
    <div  id="smooth-wrapper" className="min-h-screen flex flex-col relative bg-[#010203]">
         {/* decoration */}
        <>
      <div className="decoreation-section flex items-center justify-between absolute inset-0 h-full w-full">
        {Array.from({ length: DECRATION_HERO_CARD }).map((_, index) => (
          <div
          key={index}
          className="decoreation-hero-card h-[500px] w-[500px] blur-lg rounded-full opacity-40 "
          />
        ))}
      </div>
        </>
      {/* <ScrollToTop /> */}
      <div id="smooth-content" className="grow relative z-10">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}