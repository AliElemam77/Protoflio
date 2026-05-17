// hooks/useHomeAnimations.js
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const useHomeAnimations = () => {
  useEffect(() => {
    ScrollSmoother.get()?.kill();

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      smoothTouch: 0.1,
    });

    const mm = gsap.matchMedia();

    // ======================== Desktop ======================== //
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#smooth-content",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      tl.fromTo(
        ".decoreation-section",
        {
          y: 150,
          rotate: 12,
        },
        {
          y: 150,
          rotate: 12,

          duration: 2,
          ease: "power2.out",
        },
      )

        // دخول الكروت
        .fromTo(
          ".decoreation-hero-card",
          {
            backgroundColor: "#CE2626",
            x: -80,
            skewX: -20,
          },
          {
            backgroundColor: "#73A5CA",
            x: -80,
            skewX: 0,
            duration: 2.5,
            stagger: 0.08,
            ease: "expo.out",
          },
          "-=1.5",
        )

        // حركة يمين خفيفة
        .to(".decoreation-hero-card", {
          x: 250,
          duration: 2,
          stagger: 0.05,
          ease: "power1.inOut",
        })

        // رجوع بسيط
        .to(".decoreation-hero-card", {
          x: -120,
          scale: 0.7,
          backgroundColor: "#F0D8A1",
          duration: 2,
          stagger: 0.05,
          ease: "power1.inOut",
        })

        // خروج نهائي
        .to(".decoreation-hero-card", {
          backgroundColor: "#DCF0C3",
                    scale: 1,
          x: -1200,
          y: -250,
          rotate: -10,
          duration: 3,
          stagger: 0.08,
          ease: "power3.in",
        });

      gsap.from(".decoreation-hero-card", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
      });
    });

    // ======================== Mobile ======================== //
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#smooth-content",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.fromTo(
        ".decoreation-section",
        {
          y: 100,
          skewX: 70,
        },
        {
          y: 0,
          skewX: -70,
          duration: 1,
          ease: "power2.out",
        },
      )
        .fromTo(
          ".decoreation-hero-card",
          {
            y: 150,
            scale: 0.8,
          },
          {
            y: -200,
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
          },
        )
        .to(".decoreation-hero-card", {
          y: -100,
          duration: 1.5,
          stagger: 0.1,
          ease: "power1.inOut",
        });
    });

    // ======================== Background Animation ======================== //
    gsap.fromTo(
      "#smooth-wrapper",
      {
        backgroundColor: "white",
      },
      {
        backgroundColor: "#010203",
        duration: 2,
      },
    );

    return () => {
      mm.revert();
      smoother.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};

export default useHomeAnimations;
