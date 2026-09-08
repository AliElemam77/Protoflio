import { useExperience } from "../../context/experienceContext";
import { profile } from "../../data/profile";
import { MenuIcon, CloseIcon } from "../commen/Icons";

const Header = () => {
  const { menuOpen, setMenuOpen, go } = useExperience();

  return (
    <header className="fixed inset-x-0 top-0 z-[8000] flex items-center justify-between p-8 md:p-12">
      <button
        type="button"
        onClick={() => {
          setMenuOpen(false);
          go(0);
        }}
        className="font-display text-2xl leading-none text-white transition-colors duration-500 hover:text-[#ff4d00] md:text-3xl"
        aria-label="Back to the top"
      >
        {profile.brand}
      </button>

      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="group flex items-center gap-4"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <span className="mono hidden text-[10px] tracking-[0.5em] text-zinc-400 transition-colors duration-500 group-hover:text-white sm:block">
          {menuOpen ? "CLOSE" : "MENU"}
        </span>
        <span
          data-magnetic="0.3"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-[background-color,border-color] duration-500 group-hover:border-[#ff4d00] group-hover:bg-[#ff4d00]"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </span>
      </button>
    </header>
  );
};

export default Header;
