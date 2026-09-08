import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "../../data/profile";

const MESSAGES = profile.loader.messages;

const Loader = ({ onDone }) => {
  const rootRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = { value: 0 };

    const finish = () => {
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: reduced ? 0.01 : 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          setHidden(true);
          onDone?.();
        },
      });
    };

    const tween = gsap.to(counter, {
      value: 100,
      duration: reduced ? 0.3 : 2.4,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counter.value)),
      onComplete: () => gsap.delayedCall(reduced ? 0 : 0.35, finish),
    });

    return () => {
      tween.kill();
    };
  }, [onDone]);

  if (hidden) return null;

  const message = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(progress / 26))];

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[8900] flex flex-col items-center justify-center bg-[#080808]"
      role="status"
      aria-live="polite"
    >
      {/* Glowing orb behind the counter */}
      <div className="relative flex items-center justify-center">
        <div
          className="orb-pulse absolute h-64 w-64 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, #ff4d00, #b22222 70%)",
            filter: "blur(50px)",
          }}
          aria-hidden="true"
        />
        <span
          className="font-display relative text-[22vw] leading-none text-white md:text-[12vw]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {String(progress).padStart(2, "0")}
        </span>
      </div>

      <p className="label mt-10 text-zinc-500">{message}</p>

      {/* Thin progress rule */}
      <div className="mt-8 h-px w-40 bg-zinc-800">
        <div
          className="h-px bg-[#ff4d00] transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Loader;
