import { Outlet } from "react-router-dom";
import useHomeAnimations from "../../utils/hooks/useHomeAnimations";
import { profile } from "../../data/profile";

export default function Layout() {
  useHomeAnimations();

  return (
    <div id="smooth-wrapper" className="relative min-h-screen bg-black">
      {/* CRT overlays (fixed, full-viewport) */}
      <div className="radial-glow-1" />
      <div className="radial-glow-2" />
      <div className="scanline-overlay" />
      <div className="vignette" />

      <div
        id="smooth-content"
        className="relative z-10 flex min-h-screen flex-col items-center p-4 md:p-8"
      >
        {/* Terminal window */}
        <div className="terminal-window relative flex w-full max-w-[1120px] flex-col overflow-hidden rounded-[4px] bg-[#050805]">
          {/* Title bar */}
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#1f4d1f] bg-[#070b07] px-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="ml-4 text-[13px] font-medium">
                <span className="glow-soft text-[#eafff1]">{profile.user}</span>
                <span className="text-[#5f8d68]">@{profile.host}: ~/dev</span>
              </span>
            </div>
            <nav className="hidden items-center gap-6 text-[13px] md:flex">
              <a href="#work" className="nav-link">[ ~/work ]</a>
              <a href="#stack" className="nav-link">[ ~/stack ]</a>
              <a href="#contact" className="nav-link">[ ~/contact ]</a>
              <span className="flex items-center gap-2">
                <span className="blink h-2 w-2 bg-[#ffd24a] shadow-[0_0_8px_#ffd24a]" />
                <span className="text-[11px] font-bold text-[#ffd24a]">ONLINE</span>
              </span>
            </nav>
          </div>

          {/* Terminal content (shell session) */}
          <div className="flex flex-col gap-12 p-6 md:p-10">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="flex select-none flex-col items-center justify-between gap-2 border-t border-[#1f4d1f] bg-[#070b07] px-6 py-4 text-[10px] sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-bold">{profile.footer.echo}</span>
              <span className="blink h-4 w-2 bg-[#39ff7a]" />
            </div>
            <div className="font-mono text-[#1c7a3c]">{profile.footer.git}</div>
          </footer>
        </div>
      </div>
    </div>
  );
}
