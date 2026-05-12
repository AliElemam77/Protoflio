// components/page_components/home/ExperienceSection.jsx

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, ScrollToPlugin);

const experiences = [
  {
    id: "exp-1",
    title: "Frontend Developer",
    company: "ITI",
    desc: "React, Next.js, Tailwind CSS",
  },
  {
    id: "exp-2",
    title: "React Developer",
    company: "Freelance",
    desc: "Building scalable web applications",
  },
  {
    id: "exp-3",
    title: "CRM Project",
    company: "Sales Management System",
    desc: "React + TypeScript + Redux",
  },
  {
    id: "exp-4",
    title: "E-commerce Projects",
    company: "Souqna / Lunchify",
    desc: "Modern UI + API Integration",
  },
];

const ExperienceSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".theLine", {
        drawSVG: "0% 100%",
      });

      gsap.to(".theLine", {
        drawSVG: "0% 0%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      const navLinks = gsap.utils.toArray(".exp-link");

      navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();

          const target = document.querySelector(
            link.getAttribute("href"),
          );

          gsap.to(window, {
            duration: 1,
            scrollTo: target,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white"
    >
      {/* fixed timeline */}
      <div className="fixed left-0 top-0 z-20 h-screen w-28 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5/6 overflow-visible"
          viewBox="0 0 126.72 542.68"
        >
          {/* gray line */}
          <path
            fill="none"
            stroke="#333"
            strokeWidth="10px"
            d="M63.36,513.58c-15-14.83-30-29.65-30-59.3s15-44.48,30-59.3,30-29.66,30-59.31-15-44.47-30-59.3-30-29.65-30-59.3,15-44.48,30-59.31,30-29.65,30-59.3-15-44.48-30-59.31c-3.34-3.3-6.68-6.6-9.86-10.07"
          />

          {/* animated line */}
          <path
            className="theLine"
            fill="none"
            stroke="red"
            strokeWidth="10px"
            d="M63.36,513.58c-15-14.83-30-29.65-30-59.3s15-44.48,30-59.3,30-29.66,30-59.31-15-44.47-30-59.3-30-29.65-30-59.3,15-44.48,30-59.31,30-29.65,30-59.3-15-44.48-30-59.31c-3.34-3.3-6.68-6.6-9.86-10.07"
          />

          {experiences.map((item, index) => {
            const positions = [
              { cx: 93.36, cy: 101.58 },
              { cx: 33.36, cy: 221.58 },
              { cx: 93.36, cy: 333.58 },
              { cx: 33.36, cy: 447.58 },
            ];

            const textY = positions[index].cy + 30;

            return (
              <g key={item.id}>
                <circle
                  cx={positions[index].cx}
                  cy={positions[index].cy}
                  r="10"
                  fill="white"
                />

                <a
                  href={`#${item.id}`}
                  className="exp-link cursor-pointer"
                >
                  <text
                    x="63.36"
                    y={textY}
                    textAnchor="middle"
                    fill="white"
                    className="text-[10px]"
                  >
                    {item.company}
                  </text>
                </a>
              </g>
            );
          })}
        </svg>
      </div>

      {/* sections */}
      <div className="pl-32">
        {experiences.map((item, index) => (
          <section
            key={item.id}
            id={item.id}
            className={`min-h-screen flex items-center ${
              index % 2 === 0
                ? "bg-neutral-950"
                : "bg-neutral-900"
            }`}
          >
            <div className="max-w-3xl px-10">
              <p className="text-red-500 mb-3 text-sm uppercase tracking-widest">
                Experience
              </p>

              <h2 className="text-6xl font-bold mb-6">
                {item.title}
              </h2>

              <h3 className="text-2xl text-neutral-300 mb-4">
                {item.company}
              </h3>

              <p className="text-lg text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;