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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#smooth-content",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // ======================== decoration section animation ================= //
    tl.fromTo(
      ".decoreation-section",
      {
        y: 300,
        rotate: 20,
        ease: "none",
      },
      {
        y: 0,
        rotate: 20,
        ease: "none",
      },
    )
      .fromTo(
        ".decoreation-hero-card",
        {
          skewX: 70,
        },
        {
          x: -100,
          stagger: 0.1,
          ease: "none",
        },
      )
      .to(".decoreation-section", {
        x: 400,
        ease: "none",
      })
      .to(".decoreation-hero-card", {
        background: "linear-gradient(90deg, #0f212e, #0f212e)",
        x: 150,
        stagger: 0.05,
        ease: "none",
      })
      .to("#smooth-wrapper", {
        backgroundColor: "white",
      })
      .to(".decoreation-section", {
        x: 200,
        ease: "none",
      })
      .to(".decoreation-hero-card", {
        skewX: -70,
        stagger: 0.05,
        ease: "none",
      });

    // ======================== decoration card animation ================= //
    gsap.from(".decoreation-hero-card", {
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out",
    });

    gsap.fromTo(
      "#smooth-wrapper",
      {
        backgroundColor: "white",
      },
      {
        backgroundColor: "#010203",
        duration: 0.3,
      },
    );

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};

export default useHomeAnimations;