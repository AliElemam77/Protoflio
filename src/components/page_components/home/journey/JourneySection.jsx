import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { profile } from "../../../../data/profile";
import JourneyMarginalia from "./JourneyMarginalia";
import JourneyVideoPlayer from "./JourneyVideoPlayer";
import JourneyStageCard from "./JourneyStageCard";

// All production projects
const PROJECTS = (profile.projects || []).map((project, index) => ({
  ...project,
  index: String(index + 1).padStart(2, "0"),
}));

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
  const rootRef = useRef(null);
  const videoContainerRef = useRef(null);
  const textContainerRef = useRef(null);
  const cardInnerRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const prevProjectIndexRef = useRef(0);

  // Update dynamic widths, scales and parallax depth (no ping-pong flipping)
  const updateLayoutMotion = useCallback((prog) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const numProjects = PROJECTS.length;
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
  }, []);

  // Jump to specific project
  const goToProject = useCallback(
    (projectIdx) => {
      const nextIdx = Math.max(0, Math.min(PROJECTS.length - 1, projectIdx));
      const targetP = nextIdx / Math.max(1, PROJECTS.length - 1);
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
    [updateLayoutMotion]
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
      if (["ArrowRight", "ArrowDown"].includes(e.key)) {
        if (currentProjectIndex < PROJECTS.length - 1) {
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
  }, [active, currentProjectIndex, goToProject]);

  const activeProject = PROJECTS[currentProjectIndex] || PROJECTS[0];

  return (
    <div
      ref={rootRef}
      className="blueprint-grid relative h-full w-full overflow-hidden"
    >
      {/* Fullscreen HUD Viewport */}
      <div className="relative h-full w-full overflow-hidden flex flex-col justify-between p-6 pt-16 md:p-10 md:pt-20 lg:p-12 lg:pt-22 pointer-events-none">
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
                SELECTED WORK
              </span>
              <span className="text-zinc-600">/</span>
              <span className="mono text-[10px] tracking-[0.2em] text-zinc-400">
                رحلة المشاريع
              </span>
            </div>
            <h2 className="font-display text-3xl uppercase text-white sm:text-4xl md:text-5xl lg:text-6xl">
              JOURNEY
            </h2>
          </div>

          <div className="hidden max-w-xs text-right font-mono text-[10px] tracking-[0.2em] text-zinc-500 md:block">
            {profile.work?.note || "Enterprise platforms, SaaS products, storefronts and custom Salla themes."}
          </div>
        </div>

        {/* ── 3. Full-Width Main Arena: Grounded Split with Dynamic Width & Scale Breathing ── */}
        <div className="relative my-auto flex h-[58vh] md:h-[64vh] w-full items-center justify-center overflow-visible">
          {/* Media Player Container (Anchored Left, dynamic breathing width) */}
          <div
            ref={videoContainerRef}
            className="pointer-events-auto absolute z-10 flex h-full w-full max-w-lg md:max-w-none md:w-[45vw] items-center justify-center will-change-transform"
          >
            <JourneyVideoPlayer
              src="/journey.mp4"
              poster={activeProject.image || "/work/kader.webp"}
              progress={progress}
              currentStage={currentProjectIndex}
              stages={PROJECTS}
              active={active}
              frameCount={41}
              framesPath="/frames/frame_"
              framesExt="jpg"
              padLength={3}
            />
          </div>

          {/* Project Details Card Container (Anchored Right, dynamic expanding width & top slide-in) */}
          <div
            ref={textContainerRef}
            className="pointer-events-auto absolute z-20 flex w-full max-w-lg md:max-w-none md:w-[46vw] items-center justify-center will-change-transform"
          >
            <div
              ref={cardInnerRef}
              className="w-full rounded-2xl border border-white/15 bg-[#08080a]/92 p-5 backdrop-blur-2xl md:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
            >
              <JourneyStageCard
                stage={activeProject}
                isActive={true}
              />
            </div>
          </div>
        </div>

        {/* ── 4. Bottom Guidance ── */}
        <div className="pointer-events-auto flex items-center justify-end pt-2">
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
