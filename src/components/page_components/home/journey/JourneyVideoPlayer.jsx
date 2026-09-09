import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

/**
 * JourneyVideoPlayer — Apple-Style Canvas Frame Scrubber (60fps Zero-Lag)
 *
 * Automatically loads extracted frames from /frames/frame_001.jpg to frame_041.jpg.
 * Renders on HTML5 Canvas with aspect-ratio cover scaling.
 * Scrubs forward on scroll-down, rewinds on scroll-up.
 */
const JourneyVideoPlayer = ({
  src = "/journey.mp4",
  poster = "/work/kader.webp",
  progress = 0,
  currentStage = 0,
  stages = [],
  active = true,
  frameCount = 41,
  framesPath = "/frames/frame_",
  framesExt = "jpg",
  padLength = 3,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [videoAvailable, setVideoAvailable] = useState(false);
  const [framesAvailable, setFramesAvailable] = useState(false);
  const [loadedFramesCount, setLoadedFramesCount] = useState(0);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);
  const [scrollDirection, setScrollDirection] = useState("IDLE");

  const videoProxy = useRef({ time: 0 });
  const prevProgressRef = useRef(progress);
  const scrubTweenRef = useRef(null);
  const framesCache = useRef([]);

  const activeProject = stages[currentStage] || stages[0] || {};
  const activeImage = activeProject.image || poster;

  // Helper to draw image using object-fit: cover on canvas
  const renderFrameToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const canvasRatio = cw / ch;
    const imgRatio = iw / ih;
    let rw, rh, rx, ry;

    if (canvasRatio > imgRatio) {
      rw = cw;
      rh = cw / imgRatio;
      rx = 0;
      ry = (ch - rh) / 2;
    } else {
      rh = ch;
      rw = ch * imgRatio;
      rx = (cw - rw) / 2;
      ry = 0;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, rx, ry, rw, rh);
  }, []);

  // ── 1. Image Sequence Preloader (Apple-style 60fps) ──
  useEffect(() => {
    if (frameCount <= 0) return;

    let isMounted = true;
    const images = [];
    let count = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(padLength, "0");
      img.src = `${framesPath}${numStr}.${framesExt}`;

      img.onload = () => {
        if (!isMounted) return;
        count++;
        setLoadedFramesCount(count);
        if (count >= Math.min(5, frameCount)) {
          setFramesAvailable(true);
        }
        // Immediately paint first frame as soon as frame 1 arrives
        if (i === 1) {
          renderFrameToCanvas(img);
        }
      };

      images.push(img);
    }
    framesCache.current = images;

    return () => {
      isMounted = false;
    };
  }, [frameCount, framesPath, framesExt, padLength, renderFrameToCanvas]);

  // ── 2. Canvas Resize Listener with High-DPI support ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Re-draw current frame after resize
      const cache = framesCache.current;
      if (cache.length > 0) {
        const idx = Math.min(
          cache.length - 1,
          Math.max(0, Math.floor(prevProgressRef.current * (cache.length - 1)))
        );
        if (cache[idx]) renderFrameToCanvas(cache[idx]);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [renderFrameToCanvas]);

  // ── 3. Bidirectional Frame Scrubbing via GSAP ──
  useEffect(() => {
    const delta = progress - prevProgressRef.current;
    if (Math.abs(delta) > 0.0005) {
      setScrollDirection(delta > 0 ? "FORWARD ▶▶" : "◀◀ REWIND");
    }
    prevProgressRef.current = progress;

    if (scrubTweenRef.current) {
      scrubTweenRef.current.kill();
    }

    // GSAP tween for fluid frame interpolation
    scrubTweenRef.current = gsap.to(videoProxy.current, {
      time: progress,
      duration: 0.15,
      ease: "power2.out",
      onUpdate: () => {
        const p = videoProxy.current.time;
        const cache = framesCache.current;

        if (framesAvailable && cache.length > 0) {
          const frameIndex = Math.min(
            cache.length - 1,
            Math.max(0, Math.floor(p * (cache.length - 1)))
          );
          setCurrentFrameNum(frameIndex + 1);

          const targetImg = cache[frameIndex];
          if (targetImg) {
            renderFrameToCanvas(targetImg);
          }
        }
      },
    });

    return () => {
      if (scrubTweenRef.current) scrubTweenRef.current.kill();
    };
  }, [progress, framesAvailable, renderFrameToCanvas]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-[#09090b] shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md">
      {/* Corner HUD accents */}
      <div className="hud-corner-tl !border-[#ff4d00]/70" />
      <div className="hud-corner-tr !border-[#ff4d00]/70" />
      <div className="hud-corner-bl !border-[#ff4d00]/70" />
      <div className="hud-corner-br !border-[#ff4d00]/70" />

      {/* Frame Sequence Canvas (60fps Apple-Style Scrubber) */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          framesAvailable ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Fallback Project Image Showcase when frames are loading */}
      {!framesAvailable && activeImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            key={activeProject.id || "poster"}
            src={activeImage}
            alt={activeProject.title || "Project preview"}
            className="h-full w-full object-cover object-top transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}

      {/* CRT scanline overlay */}
      <div className="video-scanline pointer-events-none absolute inset-0 opacity-20" />

      {/* Top Bar HUD Telemetry */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[10px] tracking-[0.2em] text-white/80 z-20">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#ff4d00] animate-ping" />
          <span className="font-semibold text-[#ff4d00]">
            {framesAvailable
              ? "FRAME SEQUENCE // 60FPS SCRUBBING"
              : "PROJECT MEDIA // SCROLL-BOUND"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded border border-white/10 bg-black/60 px-2.5 py-0.5 text-zinc-400 sm:inline-block">
            {scrollDirection}
          </span>
          <div className="rounded border border-white/20 bg-black/60 px-2.5 py-0.5 tabular-nums text-white backdrop-blur-md">
            FRAME {String(currentFrameNum).padStart(3, "0")} / {String(frameCount).padStart(3, "0")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyVideoPlayer;
