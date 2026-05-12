import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useEffect } from "react";
gsap.registerPlugin(SplitText);

const HeroSection = () => {
  useEffect(() => {
    const split = SplitText.create(
      ".hero-description , .hero-frontend , .hero-software , .hero-engineer",
      {
        type: "words, chars",
      },
    );

    gsap.from(split.words, {
      x: 100,
      opacity: 0,
      duration: 2,
      stagger: 0.05,
      ease: "power4.out",
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">



      {/* Content */}
      <div className="relative z-10 px-6">
        <div className="leading-none">
          {/* Frontend */}
          <h1
            className={`hero-frontend hover:text-red-700 text-[70px] md:text-[140px] font-semibold tracking-tight transition-all duration-300
            text-white`}
          >
            Frontend
          </h1>

          {/* Software Engineer */}
          <div className="flex flex-wrap items-center lg:gap-6 ml-10 md:ml-44 ">
            <span
              className={`hero-software hover:text-white text-[40px] md:text-[70px] italic font-serif transition-all duration-300
            text-red-600`}
            >
              software
            </span>

            <h2
              className={`hero-engineer hover:text-red-700 text-[70px] md:text-[140px] font-semibold tracking-tight transition-all duration-300
              text-white`}
            >
              engineer
            </h2>
          </div>

          {/* Description */}
          <p
            className={`hero-description mt-10 max-w-2xl text-lg md:text-xl leading-8 transition-all duration-300
            text-zinc-400`}
          >
            Building modern web experiences with Next.js, React, TypeScript,
            Redux Toolkit, Tailwind CSS, GSAP, Anime.js, Salla, Zid, Shopify,
            WordPress, and high-performance frontend architecture.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
