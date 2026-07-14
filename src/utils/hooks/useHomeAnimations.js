// hooks/useHomeAnimations.js
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useHomeAnimations = () => {
  useEffect(() => {
    // Respect reduced-motion preference: skip entrance animations entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Boot log — lines type in sequence
      gsap.from(".boot-line", {
        opacity: 0,
        x: -12,
        duration: 0.25,
        stagger: 0.12,
        ease: "none",
      });

      // Hero — reveal after the boot log finishes
      gsap.from(".hero-reveal", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.7,
      });

      // Section panels — slide up as they scroll into view
      gsap.utils.toArray(".term-reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Skill meters — fill from the left on scroll into view
      gsap.utils.toArray(".skill-fill").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
    });

    return () => ctx.revert();
  }, []);
};

export default useHomeAnimations;
