import { useState } from "react";
import { useExperience } from "../../context/experienceContext";
import { profile } from "../../data/profile";

// Each nav link gets a 300x400 preview panel that fades in on hover.
const PREVIEWS = {
  home: { tint: ["#ff4d00", "#b22222"], caption: "THE OPENING FRAME" },
  about: { image: profile.about.portrait, caption: "THE PERSON BEHIND IT" },
  work: { tint: ["#ff8c00", "#7a2e00"], caption: "SELECTED PROJECTS" },
  contact: { tint: ["#b22222", "#1a0505"], caption: "START A CONVERSATION" },
};

const MenuOverlay = () => {
  const { sections, current, go, menuOpen, setMenuOpen } = useExperience();
  const [hovered, setHovered] = useState(null);

  const preview = hovered ? PREVIEWS[hovered] : null;

  return (
    <div
      className="nav-overlay fixed inset-0 z-[7900] bg-[#080808]"
      data-open={menuOpen}
      aria-hidden={!menuOpen}
      {...(menuOpen ? {} : { inert: true })}
    >
      <div className="relative flex h-full w-full items-center justify-between gap-12 px-8 md:px-24">
        <nav className="flex flex-col gap-2 md:gap-4">
          <p className="label mb-8 text-zinc-600">NAVIGATION</p>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onMouseEnter={() => setHovered(section.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(section.id)}
              onBlur={() => setHovered(null)}
              onClick={() => {
                go(sections.findIndex((s) => s.id === section.id));
                setMenuOpen(false);
              }}
              className="nav-link font-display outline-text w-fit text-left text-[13vw] leading-[0.95] md:text-[8vw]"
              data-active={sections[current].id === section.id}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Hover preview */}
        <div className="pointer-events-none relative hidden h-[400px] w-[300px] shrink-0 lg:block">
          {sections.map((section) => {
            const item = PREVIEWS[section.id];
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
        {profile.contact.email}
      </p>
    </div>
  );
};

export default MenuOverlay;
