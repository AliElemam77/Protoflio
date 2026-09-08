import { profile } from "../../../data/profile";
import {
  ArrowUpRight,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "../../commen/Icons";

const { contact, footer } = profile;

const socialIcons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: MailIcon,
};

const ContactSection = () => (
  <div className="section-content center-safe w-full items-center px-8 pb-28 pt-32 text-center md:px-24 md:pb-32 md:pt-40">
    <p data-anim className="label text-[#ff4d00]">
      {contact.tag}
    </p>

    <a
      data-anim
      href={`mailto:${contact.email}`}
      className="font-display mt-10 block text-[17vw] leading-[0.85] md:text-[13vw]"
      aria-label={`Email ${contact.email}`}
    >
      <span className="block text-white">{contact.line1}</span>
      <span className="outline-fill block italic">{contact.line2}</span>
    </a>

    <p data-anim className="mt-10 max-w-md text-[1.25rem] text-zinc-400">
      {contact.blurb}
    </p>

    <a
      data-anim
      href={`mailto:${contact.email}`}
      className="mono mt-6 inline-flex items-center gap-2 text-[12px] tracking-[0.3em] text-white transition-colors duration-500 hover:text-[#ff4d00]"
    >
      {contact.email}
      <ArrowUpRight width="14" height="14" />
    </a>

    <div data-anim className="mt-12 flex items-center gap-5">
      {contact.socials.map((social) => {
        const Icon = socialIcons[social.id];
        return (
          <a
            key={social.id}
            href={social.href}
            target={social.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer noopener"
            aria-label={social.label}
            data-magnetic="0.25"
            className="social flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-white"
          >
            <Icon />
          </a>
        );
      })}
    </div>

    <a
      data-anim
      href={contact.cv.href}
      className="mono mt-10 border-b border-zinc-700 pb-1 text-[10px] tracking-[0.4em] text-zinc-500 transition-colors duration-500 hover:border-[#ff4d00] hover:text-[#ff4d00]"
    >
      {contact.cv.label}
    </a>

    <p data-anim className="mono mt-16 text-[10px] tracking-[0.3em] text-zinc-700">
      {footer}
    </p>
  </div>
);

export default ContactSection;
