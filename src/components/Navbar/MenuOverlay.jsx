import { useState } from "react";
import { useExperience } from "../../context/experienceContext";
import { useProfileData } from "../../context/PortfolioContext";
import { profile as fallbackProfile } from "../../data/profile";

// Each nav link gets a 300x400 preview panel that fades in on hover (computed live inside the component).

const MenuOverlay = () => {
  const { sections, current, go, menuOpen, setMenuOpen } = useExperience();
  const { data } = useProfileData();
  const live = data || fallbackProfile;
  const PREVIEWS = {
    home: { tint: ["#ff4d00", "#b22222"], caption: "THE OPENING FRAME" },
    about: { image: live.about?.portrait, caption: "THE PERSON BEHIND IT" },
    experience: { tint: ["#ff4d00", "#3a1200"], caption: "ROLES, TRAINING, DEGREE" },
    journey: { image: live.journey?.video?.poster || live.projects?.[0]?.image, caption: "MILESTONES & JOURNEY" },
    work: { image: live.projects?.[0]?.image, caption: "SELECTED PROJECTS" },
    contact: { tint: ["#b22222", "#1a0505"], caption: "START A CONVERSATION" },
  };
  const [hovered, setHovered] = useState(null);

  const preview = hovered ? PREVIEWS[hovered] : null;
  const currentId = sections?.[current]?.id;

  return (
    <div
      className="nav-overlay fixed inset-0 z-[7900] bg-[#080808]"
      data-open={menuOpen}
      aria-hidden={!menuOpen}
      {...(menuOpen ? {} : { inert: true })}
    >
      <div data-scroll-region="" className="relative flex h-full w-full items-center justify-between gap-12 overflow-y-auto px-6 py-24 sm:px-10 md:px-24">
        <nav className="flex w-full flex-col gap-1 sm:gap-2 md:gap-4" aria-label="Primary">
          <p className="label mb-6 text-zinc-600 md:mb-8">NAVIGATION</p>
          {sections.map((section) => {
            const item = PREVIEWS[section.id] || { tint: ["#ff4d00", "#1a0505"], caption: section.label };
            void item;
            return (
            <button
              key={section.id}
              type="button"
              tabIndex={menuOpen ? 0 : -1}
              onMouseEnter={() => setHovered(section.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(section.id)}
              onBlur={() => setHovered(null)}
              onClick={() => {
                go(sections.findIndex((s) => s.id === section.id));
                setMenuOpen(false);
              }}
              className="nav-link font-display outline-text w-fit text-left text-[clamp(2.6rem,13vw,6rem)] leading-[0.95] md:text-[clamp(3rem,8vw,7rem)]"
              data-active={currentId === section.id}
            >
              {section.label}
            </button>
            );
          })}
        </nav>

        {/* Hover preview */}
        <div className="pointer-events-none relative hidden h-[400px] w-[300px] shrink-0 lg:block">
          {sections.map((section) => {
            const item = PREVIEWS[section.id] || { tint: ["#ff4d00", "#1a0505"], caption: section.label };
            const active = hovered === section.id;
            return (
              <figure
                key={section.id}
                className="absolute inset-0 overflow-hidden rounded-[1.5rem] border border-white/10 transition-[opacity,transform] duration-700"
                style={{
                  opacity: active ? 0.8 : 0,
                  transform: active ? "scale(1)" : "scale(0.94)",
                  transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  background: item.image
                    ? undefined
                    : `linear-gradient(150deg, ${item.tint[0]}, ${item.tint[1]})`,
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover object-top grayscale"
                  />
                ) : null}
                <figcaption className="mono absolute bottom-5 left-5 right-5 text-[9px] tracking-[0.3em] text-white/80">
                  {item.caption}
                </figcaption>
              </figure>
            );
          })}
          <p
            className="label absolute bottom-5 right-0 text-zinc-700 transition-opacity duration-500"
            style={{ opacity: preview ? 0 : 1 }}
          >
            HOVER A LINK
          </p>
        </div>
      </div>

      <p className="label absolute bottom-10 left-8 text-zinc-700 md:left-24">
        {live.contact?.email}
      </p>
      <a
        href="/admin"
        onClick={() => setMenuOpen(false)}
        className="mono absolute bottom-10 right-8 text-[10px] tracking-[0.4em] text-zinc-600 transition-colors hover:text-[#ff4d00] md:right-24"
        aria-label="Open admin dashboard"
      >
        ADMIN →
      </a>
    </div>
  );
};

export default MenuOverlay;
