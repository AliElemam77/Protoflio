import { useEffect, useRef } from "react";
import gsap from "gsap";

// Three background blobs that drift with the cursor at different depths.
const BLOBS = [
  {
    color: "#ff4d00",
    depth: 0.5,
    style: { top: "-12%", left: "-8%", width: "46vw", height: "46vw", opacity: 0.18 },
  },
  {
    color: "#b22222",
    depth: 1,
    style: { bottom: "-18%", right: "-10%", width: "52vw", height: "52vw", opacity: 0.15 },
    delay: "-5s",
  },
  {
    color: "#ff8c00",
    depth: 1.5,
    style: { top: "28%", left: "42%", width: "34vw", height: "34vw", opacity: 0.12 },
    delay: "-9s",
  },
];

const MeshBlobs = () => {
  const layerRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const setters = layerRefs.current.filter(Boolean).map((el, i) => ({
      x: gsap.quickTo(el, "x", { duration: 1.6, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 1.6, ease: "power3.out" }),
      depth: BLOBS[i].depth,
    }));

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 40;
      const ny = (e.clientY / window.innerHeight - 0.5) * 40;
      setters.forEach(({ x, y, depth }) => {
        x(nx * depth);
        y(ny * depth);
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {BLOBS.map((blob, i) => (
        <div
          key={blob.color}
          className="blob-wrap blob-float"
          style={{ ...blob.style, animationDelay: blob.delay }}
        >
          <div
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className="blob"
            style={{ backgroundColor: blob.color }}
          />
        </div>
      ))}
    </div>
  );
};

export default MeshBlobs;
