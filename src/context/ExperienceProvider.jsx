import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExperienceContext } from "./experienceContext";
import { profile } from "../data/profile";

const SECTIONS = profile.sections;
const LOCK_MS = 1000; // matches the section cross-fade duration
const WHEEL_THRESHOLD = 40;
const SWIPE_THRESHOLD = 60;

/**
 * Returns true when the wheel/swipe should scroll a nested region instead of
 * moving to the next section — i.e. the pointer is over a scrollable area that
 * still has room to travel in that direction.
 */
const consumedByScrollRegion = (target, delta) => {
  let node = target instanceof Element ? target : null;
  while (node) {
    if (node.hasAttribute?.("data-scroll-region")) {
      const { scrollTop, scrollHeight, clientHeight } = node;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll > 4) {
        if (delta > 0 && scrollTop < maxScroll - 1) return true;
        if (delta < 0 && scrollTop > 1) return true;
      }
    }
    node = node.parentElement;
  }
  return false;
};

export default function ExperienceProvider({ children }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const lockedUntil = useRef(0);
  const wheelAcc = useRef(0);
  const touchStart = useRef(null);

  const go = useCallback((index) => {
    const next = Math.max(0, Math.min(SECTIONS.length - 1, index));
    setCurrent((prev) => {
      if (prev === next) return prev;
      setDirection(next > prev ? 1 : -1);
      lockedUntil.current = performance.now() + LOCK_MS;
      wheelAcc.current = 0;
      return next;
    });
  }, []);

  const goTo = useCallback(
    (id) => {
      const index = SECTIONS.findIndex((s) => s.id === id);
      if (index >= 0) go(index);
    },
    [go]
  );

  const step = useCallback(
    (offset) => {
      setCurrent((prev) => {
        const next = prev + offset;
        if (next < 0 || next > SECTIONS.length - 1) return prev;
        setDirection(offset);
        lockedUntil.current = performance.now() + LOCK_MS;
        wheelAcc.current = 0;
        return next;
      });
    },
    []
  );

  // Wheel / keyboard / touch navigation between fixed sections.
  useEffect(() => {
    if (!ready) return undefined;

    const locked = () => performance.now() < lockedUntil.current;

    const onWheel = (e) => {
      if (menuOpen) return;
      if (consumedByScrollRegion(e.target, e.deltaY)) return;
      e.preventDefault();
      if (locked()) return;
      wheelAcc.current += e.deltaY;
      if (Math.abs(wheelAcc.current) < WHEEL_THRESHOLD) return;
      step(wheelAcc.current > 0 ? 1 : -1);
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (menuOpen || locked()) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        go(0);
      } else if (e.key === "End") {
        go(SECTIONS.length - 1);
      }
    };

    const onTouchStart = (e) => {
      touchStart.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e) => {
      if (menuOpen || touchStart.current == null) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStart.current;
      const delta = touchStart.current - endY;
      touchStart.current = null;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      if (consumedByScrollRegion(e.target, delta)) return;
      if (locked()) return;
      step(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [go, menuOpen, ready, step]);

  const value = useMemo(
    () => ({
      sections: SECTIONS,
      current,
      direction,
      go,
      goTo,
      step,
      menuOpen,
      setMenuOpen,
      ready,
      setReady,
    }),
    [current, direction, go, goTo, menuOpen, ready, step]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}
