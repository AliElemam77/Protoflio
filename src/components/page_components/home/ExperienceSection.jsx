// components/page_components/home/ExperienceSection.jsx

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: "1",
    title: "Frontend & Cross-Platform Trainee",
    image: "https://i.ibb.co/8LsHt4sp/download-90.png",
    company: "ITI",
    link: "https://www.linkedin.com/school/information-technology-institute-iti-/",
    desc: "Completed intensive training in Frontend Development using React, Next.js, and Tailwind CSS, alongside Cross-Platform Mobile Development using React Native and Flutter at the Information Technology Institute (ITI).",
  },
  {
    id: "2",
    title: "Frontend Developer",
    link: "https://www.linkedin.com/company/taqnit-almalumat/",
    image: "https://i.ibb.co/8LFvP2SY/download-91.png",
    company: "Taqnit Al-M'alumat Company",
    desc: "Worked on SaaS and ERP systems, building responsive and scalable user interfaces using React, Next.js, TypeScript, and Tailwind CSS while collaborating with backend and design teams.",
  },
  {
    id: "3",
    title: "Frontend Developer",
    image: "https://i.ibb.co/9ksG6vXX/download-89.png",
    link: "https://www.linkedin.com/company/targroup1/posts/?feedView=all",
    company: "TAR Group",
    desc: "Developing CMS-based solutions and custom themes for Salla and Zid e-commerce platforms, while building responsive user experiences with a strong focus on performance optimization and clean architecture.",
  },
  {
    id: "4",
    title: "Freelance Frontend Developer",
    link: "#",
    company: "Freelance",
    desc: "Built custom websites, landing pages, e-commerce platforms, and dashboard interfaces for clients using modern frontend technologies with strong focus on UI quality and performance.",
  },
];

const ExperienceSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // title animation
      gsap.from(".experience-title", {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".experience-title",
          start: "top 85%",
        },
      });

      // cards animation
      gsap.from(".experience-card", {
        opacity: 0,
        y: 120,
        scale: 0.8,
        rotate: 6,
        stagger: 0.15,
        duration: 0.5,
        ease: "expo.out",
        scrollTrigger: {
          // markers: true,
          trigger: ".experience-cards-wrapper",
          start: "10% 100%",
          end: "50% 100%",
          scrub: true,
        },
      });

      

  
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative text-white min-h-screen flex flex-col gap-16 py-24 overflow-hidden"
    >
      <div className="experience-title container mx-auto text-4xl text-center flex flex-col gap-10 relative z-10">
        <div className="title-text">
          <p className="font-bold">Experience</p>
        </div>

      </div>

      <div className="experience-cards-wrapper w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-6 justify-between container mx-auto relative z-10">
        {experiences.map((experience,index) => (
          <div
            key={experience.id}
            className={`
              experience-card
              group
              relative
              flex
              w-full
              ${index === experiences.length - 1 && "col-span-3"}
              ${index === experiences.length - 1 && "h-fit min-h-fit"}
              min-h-[320px]
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              rounded-2xl
              transition-all
              duration-500
              p-6
              flex-col
              justify-between
              hover:-translate-y-3
              hover:border-cyan-400/40
              hover:bg-white/10
            `}
          >
            {/* glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-cyan-500/10 via-transparent to-blue-500/10"></div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex flex-col text-center gap-4">
                {experience.image && (
                  <img
                    src={experience.image}
                    alt={experience.company}
                    className="w-20 h-20 object-cover rounded-full mx-auto border border-white/10"
                  />
                )}

                <p className="text-gray-400 font-bold text-xl tracking-wide">
                  {experience.company}
                </p>

                <h3 className="text-2xl font-semibold text-white leading-snug">
                  {experience.title}
                </h3>
              </div>

              <p className="text-gray-300 text-sm leading-7 text-center">
                {experience.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;