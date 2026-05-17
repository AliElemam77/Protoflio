// components/page_components/home/ExperienceSection.jsx

const experiences = [
  {
    id: "1",
    title: "Frontend & Cross-Platform Trainee",
    company: "ITI",
    link: "https://www.linkedin.com/school/information-technology-institute-iti-/",
    desc: "Completed intensive training in Frontend Development using React, Next.js, and Tailwind CSS, alongside Cross-Platform Mobile Development using React Native and Flutter at the Information Technology Institute (ITI).",
  },
  {
    id: "2",
    title: "Frontend Developer",
    link: "https://www.linkedin.com/company/taqnit-almalumat/",
    company: "Taqnit Al-M'alumat Company",
    desc: "Worked on SaaS and ERP systems, building responsive and scalable user interfaces using React, Next.js, TypeScript, and Tailwind CSS while collaborating with backend and design teams.",
  },
  {
    id: "3",
    title: "Frontend Developer",
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
  return (
<section className="relative text-white min-h-screen flex flex-col gap-16 py-24 ">
  <div className="title-section container mx-auto text-4xl text-center flex flex-col gap-10 relative z-10">
    <div className="title-text">
      <p className="font-bold">
        Experience
      </p>
    </div>

    <div className="title-dec-line h-[2px] w-full bg-linear-to-r from-transparent via-blue-900 to-transparent"></div>
  </div>

  <div className="w-full h-full flex flex-wrap lg:flex-nowrap items-stretch gap-6 justify-between container mx-auto relative z-10">
    {experiences.map((experience) => (
      <div
        key={experience.id}
        className="group relative flex lg:w-1/4 w-full min-h-[320px] border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl transition-all duration-500 p-6 flex-col justify-between hover:-translate-y-3 "
      >

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-col text-center gap-2">
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
