import { useEffect, useRef, useState } from "react";
import ExperienceGallery from "./experienceGallery";
import ExperienceFallback from "./ExperienceFallback";

/** One-shot capability probe — a WebGL context is cheap to open and discard. */
const supportsWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Interactive WebGL career timeline.
 *
 * Falls back to a static, fully semantic list when motion is reduced or WebGL
 * is unavailable. Even in canvas mode the content is mirrored into a visually
 * hidden list so assistive tech never depends on the shader.
 */
const ExperienceTimeline = ({
  items,
  active = true,
  bend = 1,
  scrollSpeed = 2,
  scrollEase = 0.06,
  wheelAxis = "x",
  initialIndex = 0,
  accent = "#ff4d00",
  autoplay = 4500,
}) => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const [index, setIndex] = useState(initialIndex);
  const [staticMode] = useState(() => prefersReducedMotion() || !supportsWebGL());

  useEffect(() => {
    if (staticMode || !containerRef.current) return undefined;

    const gallery = new ExperienceGallery(containerRef.current, {
      items,
      bend,
      scrollSpeed,
      scrollEase,
      wheelAxis,
      initialIndex,
      accent,
      autoplay,
      onIndexChange: setIndex,
    });
    galleryRef.current = gallery;

    return () => {
      gallery.destroy();
      galleryRef.current = null;
    };
  }, [
    accent,
    autoplay,
    bend,
    initialIndex,
    items,
    scrollEase,
    scrollSpeed,
    staticMode,
    wheelAxis,
  ]);

  // The section stack keeps every layer mounted — only the visible one renders.
  useEffect(() => {
    galleryRef.current?.setPaused(!active);
  }, [active]);

  if (staticMode) return <ExperienceFallback items={items} />;

  const current = items[index] ?? items[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={containerRef}
        className="exp-canvas min-h-0 flex-1"
        role="group"
        tabIndex={0}
        aria-label="Career timeline. Use the left and right arrow keys to move between roles."
      />

      {/* Progress — deliberately quiet next to the cards. */}
      <div
        data-anim
        className="mt-4 flex items-center justify-end gap-6 md:mt-5"
      >
        <div className="flex items-center gap-2.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => galleryRef.current?.goTo(i)}
              aria-label={`Go to ${item.role} at ${item.company}`}
              aria-current={i === index}
              className={`exp-dot ${i === index ? "is-active" : ""}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-5">
          <p className="mono hidden text-[10px] tracking-[0.35em] text-zinc-700 sm:block">
            DRAG · SWIPE · ← →
          </p>
          <p className="mono text-[11px] tracking-[0.3em] text-zinc-600">
            <span className="text-[#ff4d00]">{String(index + 1).padStart(2, "0")}</span>
            {` / ${String(items.length).padStart(2, "0")}`}
          </p>
        </div>
      </div>

      {/* Semantic mirror of what the canvas is drawing. */}
      <ol className="sr-only">
        {items.map((item) => (
          <li key={item.id} aria-current={item.id === current?.id}>
            <h3>
              {item.year} — {item.role}
            </h3>
            <p>
              {item.company}, {item.period}
            </p>
            <p>{item.description}</p>
            {item.skills?.length ? <p>Stack: {item.skills.join(", ")}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ExperienceTimeline;
