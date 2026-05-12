import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiencesData = [
  {
    id: 1,
    title: "Frontend Developer",
    description:
      "Frontend developer building responsive web apps using React, Next.js, TypeScript, Redux Toolkit, and TailwindCSS. Focused on modern UI, API integration, and performance optimization.",
    className: "cyan",
    x: 150,
  },
  {
    id: 2,
    title: "React & Next.js Developer",
    description:
      "Built e-learning, CRM, and e-commerce applications using React and Next.js. Experienced in clean architecture, authentication, RTK Query, and responsive UI development.",
    className: "blue",
    x: 150,
  },
  {
    id: 3,
    title: "E-Commerce & Theme Developer",
    description:
      "Developed custom storefronts for Salla, Zid, and WordPress. Focused on performance optimization, dynamic UI sections, and smooth shopping experiences.",
    className: "yellow",
    x: 150,
  },
];
const AboutMe = () => {
  useEffect(() => {
    gsap.from(".about-title", {
      y: 80,
      opacity: 0,
      duration: 2,
      ease: "power4.inOut",  
          scrollTrigger: {
          trigger: `.about-title`,
          start: "bottom 100%",
          end: "bottom 80%",
          scrub: 1,
        }, 
    });

    gsap.from(".about-text", {
      y: 40,
      opacity: 0,
      duration: 2,
      delay: 0.2,
      ease: "power4.out",
          scrollTrigger: {
          trigger: `.about-text`,
          start: "bottom 100%",
          end: "bottom 80%",
          scrub: 1,
        },
    });

    gsap.from(".about-description", {
      y: 20,
      opacity: 0,
      duration: 2,
      delay: 0.4,
      ease: "power4.out",
          scrollTrigger: {
          trigger: `.about-description`,
          start: "bottom 100%",
          end: "bottom 80%",
          scrub: 1,
        },
    });

    experiencesData.forEach((item) => {

      gsap.from(`.${item.className}`, {
        x: item.x,
        opacity: 0,
        duration: 15,
        ease: "power3.inOut",
        stagger: 20,
        scrollTrigger: {
          trigger: `.${item.className}`,
          start: "bottom 150%",
          end: "bottom 90%",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="min-h-screen relative flex flex-col gap-10 items-center justify-center w-full overflow-hidden px-4 py-12 md:p-6 lg:p-8 ">
      {/* title */}
      <div className="text-center flex flex-col gap-5 items-center justify-center">
        <p className="about-title text-white/60 uppercase tracking-[0.35em] text-sm font-medium">
          About Me
        </p>

        <h2 className="about-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] font-black text-white max-w-5xl">
          Hi, I’m{" "}
          <span className="text-cyan-400 name-animation">Ali Elemam</span>{" "}
          — crafting modern, scalable, and high-performance web experiences.
        </h2>

        <p className="about-description text-white/50 text-base md:text-lg max-w-3xl leading-relaxed">
          I build responsive interfaces, smooth interactions, and optimized
          digital products focused on performance, clean architecture, and
          exceptional user experience.
        </p>
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 w-full">
        {experiencesData.map((item) => (
          <div
            key={item.id}
            className={`${item.className}   border-2 border-white/30 backdrop-blur-xl min-h-[50vh] px-4 md:px-6 lg:px-8 rounded-[40px] flex flex-col justify-center overflow-hidden`}
          >
            <span className="text-white/70 uppercase tracking-[0.3em] text-sm mb-4">
              Experience 0{item.id}
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              {item.title}
            </h2>

            <p className="text-lg md:text-xl text-white/90  leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutMe;
