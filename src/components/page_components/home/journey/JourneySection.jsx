import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { useProfileData } from "../../../../context/PortfolioContext";
import { profile as fallbackProfile } from "../../../../data/profile";
import JourneyMarginalia from "./JourneyMarginalia";
import JourneyVideoPlayer from "./JourneyVideoPlayer";
import JourneyStageCard from "./JourneyStageCard";

// All production projects (recomputed inside the component from live data)

/**
 * JourneySection (سيكشن الرحلة — رحلة المشاريع)
 *
 * Design Architecture:
 * - Stable, grounded widescreen split (Media on Left, Project Details on Right)
 * - Calibrated slower scroll sensitivity for smooth, deliberate travel
 * - Dynamic width & scale modulation (card expands in width/scale during focus)
 * - Elegant vertical slide-in from above/below when transitioning projects
 * - Apple-style 60fps canvas frame scrubbing on mouse scroll
 */
const JourneySection = ({ active = true }) => {
  const { data } = useProfileData();
  const liveProfile = data || fallbackProfile;
  // All production projects
  const PROJECTS = useMemo(() => ((liveProfile.projects || []).map((project, index) => ({
    ...project,
    index: String(index + 1).padStart(2, "0"),
  }))), [liveProfile.projects]);
  const rootRef = useRef(null);
  const videoContainerRef = useRef(null);
  const textContainerRef = useRef(null);
  const cardInnerRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const prevProjectIndexRef = useRef(0);

  const projectCount = PROJECTS.length;

  // Update dynamic widths, scales and parallax depth (no ping-pong flipping)
  const updateLayoutMotion = useCallback((prog) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const numProjects = projectCount;
    if (numProjects <= 1) return;

    const rawProject = prog * (numProjects - 1);
    const base = Math.floor(rawProject);
    const fraction = rawProject - base;

    // Active project index
    const activeIdx = Math.min(numProjects - 1, Math.round(rawProject));
    setCurrentProjectIndex(activeIdx);

    // Focus modulation curve (peaks near center of each project)
    const focus = Math.sin(fraction * Math.PI);

    if (isMobile) {
      if (videoContainerRef.current) {
        gsap.to(videoContainerRef.current, {
          x: 0,
          y: -10,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (textContainerRef.current) {
        gsap.to(textContainerRef.current, {
          x: 0,
          y: 10,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    } else {
      // Desktop / Widescreen:
      // Media stays anchored on Left (-24vw), Project Card stays anchored on Right (+24vw)
      // Width and scale subtly modulate: Card gently expands in width/scale during focus
      const baseX = typeof window !== "undefined" && window.innerWidth >= 1440 ? 24 : 22;
      const cardWidthVw = 46 + focus * 2.5; // Card width expands from 46vw to 48.5vw
      const mediaWidthVw = 45 - focus * 1.5; // Media width stays balanced

      // Subtle vertical parallax drift for breathing feel
      const parallaxY = (fraction - 0.5) * 12;

      if (videoContainerRef.current) {
        gsap.to(videoContainerRef.current, {
          x: `${-baseX}vw`,
          y: -parallaxY * 0.5,
          width: `${mediaWidthVw}vw`,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (textContainerRef.current) {
        gsap.to(textContainerRef.current, {
          x: `${baseX}vw`,
          y: parallaxY,
          width: `${cardWidthVw}vw`,
          scale: 1 + focus * 0.015,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }
  }, [projectCount]);

  // Jump to specific project
  const goToProject = useCallback(
    (projectIdx) => {
      const nextIdx = Math.max(0, Math.min(projectCount - 1, projectIdx));
      const targetP = nextIdx / Math.max(1, projectCount - 1);
      targetProgressRef.current = targetP;

      gsap.killTweensOf(progressRef);
      gsap.to(progressRef, {
        current: targetP,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => {
          const p = progressRef.current;
          setProgress(p);
          updateLayoutMotion(p);
        },
      });
    },
    [updateLayoutMotion, projectCount]
  );

  // Set initial stable positions on mount
  useEffect(() => {
    if (!active) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile) {
      const baseX = typeof window !== "undefined" && window.innerWidth >= 1440 ? 24 : 22;
      if (videoContainerRef.current) {
        gsap.set(videoContainerRef.current, { x: `${-baseX}vw`, width: "45vw" });
      }
      if (textContainerRef.current) {
        gsap.set(textContainerRef.current, { x: `${baseX}vw`, width: "46vw" });
      }
    }
    updateLayoutMotion(progressRef.current);
  }, [active, updateLayoutMotion]);

  // Project transition: Slide in from TOP/VERTICAL with clean stagger
  useEffect(() => {
    if (prevProjectIndexRef.current !== currentProjectIndex) {
      const dir = currentProjectIndex > prevProjectIndexRef.current ? 1 : -1;
      prevProjectIndexRef.current = currentProjectIndex;

      if (cardInnerRef.current) {
        gsap.fromTo(
          cardInnerRef.current,
          { autoAlpha: 0.15, y: -dir * 28, scale: 0.97 }, // Slide from top/vertical
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.48, ease: "expo.out" }
        );
      }
    }
  }, [currentProjectIndex]);

  // Capture mouse wheel: Slower, deliberate scroll travel
  useEffect(() => {
    if (!active) return;

    const onWheelCapture = (e) => {
      // Don't hijack scroll when the menu is open or the user types.
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable) return;
      if (typeof document !== "undefined" && document.querySelector('.nav-overlay[data-open="true"]')) return;
      // Slower sensitivity (~3x slower than before) for smooth, controlled scrubbing
      const delta = e.deltaY * 0.00014;
      const prev = targetProgressRef.current;
      const next = Math.max(0, Math.min(1, prev + delta));

      // Boundary escape: If at start and scrolling UP -> go to EXPERIENCE
      if (prev <= 0.001 && e.deltaY < 0) return;
      // Boundary escape: If at end and scrolling DOWN -> go to CONTACT
      if (prev >= 0.999 && e.deltaY > 0) return;

      // Inside Journey: consume scroll event to scrub smoothly
      e.preventDefault();
      e.stopPropagation();

      targetProgressRef.current = next;

      gsap.to(progressRef, {
        current: next,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: () => {
          const p = progressRef.current;
          setProgress(p);
          updateLayoutMotion(p);
        },
      });
    };

    window.addEventListener("wheel", onWheelCapture, { capture: true, passive: false });
    return () => window.removeEventListener("wheel", onWheelCapture, { capture: true });
  }, [active, updateLayoutMotion]);

  // Keyboard navigation support
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable) return;
      if (typeof document !== "undefined" && document.querySelector('.nav-overlay[data-open="true"]')) return;
      if (["ArrowRight", "ArrowDown"].includes(e.key)) {
        if (currentProjectIndex < projectCount - 1) {
          goToProject(currentProjectIndex + 1);
        }
      } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        if (currentProjectIndex > 0) {
          goToProject(currentProjectIndex - 1);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, currentProjectIndex, goToProject, projectCount]);

  const activeProject = PROJECTS[currentProjectIndex] || PROJECTS[0];

  return (
    <div
      ref={rootRef}
      className="blueprint-grid relative h-full w-full overflow-hidden"
    >
      {/* Fullscreen HUD Viewport */}
      <div className="pointer-events-none relative flex h-full w-full flex-col justify-between overflow-hidden p-5 pt-20 sm:p-6 sm:pt-20 md:p-10 md:pt-24 lg:p-12">
        {/* ── 1. Architectural HUD Marginalia (Coordinates, Status, Project ticks) ── */}
        <JourneyMarginalia
          currentStage={currentProjectIndex}
          totalStages={PROJECTS.length}
          progress={progress}
        />

        {/* ── 2. Top Header ── */}
        <div className="pointer-events-auto flex items-end justify-between border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] tracking-[0.4em] text-[#ff4d00]">
                {liveProfile.journey?.tag || "SELECTED WORK"}
              </span>
              <span className="text-zinc-600">/</span>
              <span className="mono text-[10px] tracking-[0.2em] text-zinc-400">
                {liveProfile.journey?.arabicTitle || "رحلة المشاريع"}
              </span>
            </div>
            <h2 className="font-display text-3xl uppercase text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {liveProfile.journey?.title || "JOURNEY"}
            </h2>
          </div>

          <div className="hidden max-w-xs text-right font-mono text-[10px] tracking-[0.2em] text-zinc-500 md:block">
            {liveProfile.work?.note || "Enterprise platforms, SaaS products, storefronts and custom Salla themes."}
          </div>
        </div>

        {/* ── 3. Main Arena: stacked scroll on mobile, grounded split on md+ ── */}
        <div data-scroll-region="" className="relative my-4 flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto pr-1 md:my-auto md:h-[64vh] md:flex-none md:flex-row md:items-center md:justify-center md:overflow-visible">
          {/* Media Player Container */}
          <div
            ref={videoContainerRef}
            className="pointer-events-auto z-10 flex h-56 w-full shrink-0 items-center justify-center will-change-transform sm:h-64 md:absolute md:h-full md:w-[45vw] md:max-w-none"
          >
            <JourneyVideoPlayer
              poster={activeProject.image || liveProfile.journey?.video?.poster || "/work/kader.webp"}
              progress={progress}
              currentStage={currentProjectIndex}
              stages={PROJECTS}
              frameCount={41}
              framesPath="/frames/frame_"
              framesExt="jpg"
              padLength={3}
            />
          </div>

          {/* Project Details Card Container */}
          <div
            ref={textContainerRef}
            className="pointer-events-auto z-20 flex w-full shrink-0 items-center justify-center will-change-transform md:absolute md:w-[46vw] md:max-w-none"
          >
            <div
              ref={cardInnerRef}
              className="w-full rounded-2xl border border-white/15 bg-[#08080a]/92 p-5 backdrop-blur-2xl md:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
            >
              <JourneyStageCard
                stage={activeProject}
                isActive={true}
              />
              {/* Mobile prev/next — desktop uses wheel scrub */}
              <div className="mt-4 flex gap-2 md:hidden">
                <button
                  type="button"
                  disabled={currentProjectIndex === 0}
                  onClick={() => goToProject(currentProjectIndex - 1)}
                  className="mono flex-1 rounded-full border border-white/15 px-4 py-2.5 text-[10px] tracking-[0.25em] text-zinc-300 disabled:opacity-30"
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  disabled={currentProjectIndex >= PROJECTS.length - 1}
                  onClick={() => goToProject(currentProjectIndex + 1)}
                  className="mono flex-1 rounded-full bg-[#ff4d00] px-4 py-2.5 text-[10px] tracking-[0.25em] text-black disabled:opacity-30"
                >
                  NEXT →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Bottom Guidance ── */}
        <div className="pointer-events-auto hidden items-center justify-end pt-2 md:flex">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-zinc-500">
            <span className="hidden sm:inline">
              SCROLL MOUSE WHEEL TO SCRUB PROJECTS
            </span>
            <svg
              className="h-4 w-4 animate-bounce text-[#ff4d00]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneySection;
