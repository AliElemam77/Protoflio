import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor="hover"]';

/**
 * 12px circular cursor. On interactive elements it scales 6x, turns white and
 * flips to mix-blend-mode: difference so it inverts whatever sits beneath it.
 * Elements marked [data-magnetic] lean toward the pointer.
 */
const CustomCursor = () => {
  const dotRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return undefined;

    document.documentElement.classList.add("has-custom-cursor");

    const el = dotRef.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    let magnetTarget = null;

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);

      if (magnetTarget) {
        const rect = magnetTarget.getBoundingClientRect();
        const strength = Number(magnetTarget.dataset.magnetic) || 0.35;
        gsap.to(magnetTarget, {
          x: (e.clientX - (rect.left + rect.width / 2)) * strength,
          y: (e.clientY - (rect.top + rect.height / 2)) * strength,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    };

    const onOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      if (target.closest(INTERACTIVE)) el.dataset.state = "hover";

      const magnet = target.closest("[data-magnetic]");
      if (magnet && magnet !== magnetTarget) magnetTarget = magnet;
    };

    const onOut = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      if (target.closest(INTERACTIVE) && !e.relatedTarget?.closest?.(INTERACTIVE)) {
        el.dataset.state = "default";
      }

      const magnet = target.closest("[data-magnetic]");
      if (magnet && magnet === magnetTarget && !magnet.contains(e.relatedTarget)) {
        gsap.to(magnetTarget, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        magnetTarget = null;
      }
    };

    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
};

export default CustomCursor;
