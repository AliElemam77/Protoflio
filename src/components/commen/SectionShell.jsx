import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * One full-screen section layer. Sections never scroll the page — they swap
 * with a scale/fade transition, and anything tagged [data-anim] staggers in
 * once its section becomes active.
 */
const SectionShell = ({ id, label, active, children, className = "" }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = el.querySelectorAll("[data-anim]");

    gsap.killTweensOf(el);
    if (items.length) gsap.killTweensOf(items);

    if (active) {
      el.scrollTop = 0;
      gsap.fromTo(
        el,
        { autoAlpha: 0, scale: 1.06 },
        { autoAlpha: 1, scale: 1, duration: reduced ? 0.01 : 1, ease: "expo.out" }
      );
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduced ? 0.01 : 1.1,
          stagger: reduced ? 0 : 0.07,
          delay: reduced ? 0 : 0.15,
          ease: "expo.out",
        }
      );
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        scale: 0.94,
        duration: reduced ? 0.01 : 0.7,
        ease: "power3.inOut",
      });
    }

    return () => gsap.killTweensOf([el, items]);
  }, [active]);

  return (
    <section
      ref={rootRef}
      id={id}
      aria-label={label}
      aria-hidden={!active}
      data-active={active}
      data-scroll-region=""
      className={`section-layer ${className}`}
    >
      {children}
    </section>
  );
};

export default SectionShell;
