import { useEffect, useState } from "react";

/**
 * Technical architectural marginalia inspired by illoca.com:
 * - Live mouse/scroll coordinates tracker (X / Y)
 * - Stage indicator with micro-ticks
 * - System status readout
 */
const JourneyMarginalia = ({ currentStage, totalStages, progress = 0 }) => {
  const [coords, setCoords] = useState({ x: 420.5, y: 180.2 });

  useEffect(() => {
    const onMouseMove = (e) => {
      setCoords({
        x: Math.round(e.clientX * 10) / 10,
        y: Math.round(e.clientY * 10) / 10,
      });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      {/* Top Left: Architectural Coordinates (matching illoca) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-6 z-30 hidden font-mono text-[11px] leading-tight tracking-[0.2em] text-zinc-500 md:block"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#ff4d00]">X</span>
          <span className="w-16 tabular-nums text-zinc-400">
            {coords.x.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#ff4d00]">Y</span>
          <span className="w-16 tabular-nums text-zinc-400">
            {coords.y.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Top Right: System Status & Cadence */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-6 z-30 hidden items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-zinc-500 sm:flex"
      >
        <span className="tech-dot-pulse inline-block h-1.5 w-1.5 rounded-full bg-[#ff4d00]" />
        <span className="text-zinc-400">JOURNEY ENGINE</span>
        <span className="text-zinc-700">|</span>
        <span>
          STAGE {String(currentStage + 1).padStart(2, "0")} / {String(totalStages).padStart(2, "0")}
        </span>
      </div>

      {/* Blueprint Grid Lines & Corner Accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 z-20">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />
      </div>

      {/* Bottom Progress Track */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-4 z-30 flex items-center justify-between font-mono text-[9px] tracking-[0.3em] text-zinc-600 md:inset-x-12"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#ff4d00]">CADENCE</span>
          <span>TIMELINE SCRUB</span>
        </div>
        
        {/* Visual progress bar */}
        <div className="relative mx-4 h-1 flex-1 max-w-xs overflow-hidden rounded-full bg-zinc-800/80">
          <div
            className="h-full bg-gradient-to-r from-[#ff4d00] to-[#ff8c00] transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>

        <div className="tabular-nums text-zinc-400">
          {Math.round(progress * 100)}% COMPLETE
        </div>
      </div>
    </>
  );
};

export default JourneyMarginalia;
