// components/common/CustomCursor.jsx

import { useEffect, useRef, useState, useCallback } from "react";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailsRef = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const [state, setState] = useState("default"); // default | hover | click | text

  // Trail particles
  const TRAIL_COUNT = 6;

  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = useCallback(() => {
    // Smooth ring follow
    ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
    ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
    }

    // Trail: each segment chases the one before it
    let prevX = mouse.current.x;
    let prevY = mouse.current.y;
    trailsRef.current.forEach((el, i) => {
      if (!el) return;
      const stored = el._pos || { x: prevX, y: prevY };
      stored.x = lerp(stored.x, prevX, 0.35 - i * 0.04);
      stored.y = lerp(stored.y, prevY, 0.35 - i * 0.04);
      el._pos = stored;
      el.style.transform = `translate(${stored.x}px, ${stored.y}px)`;
      prevX = stored.x;
      prevY = stored.y;
    });

    // eslint-disable-next-line react-hooks/immutability
    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseDown = () => setState("click");
    const onMouseUp = () =>
      setState((s) => (s === "click" ? "default" : s));

    const checkHover = (e) => {
      const el = e.target;
      if (
        el.matches(
          'a, button, [role="button"], label, select, summary, [data-cursor="hover"]'
        )
      ) {
        setState("hover");
      } else if (el.matches('input[type="text"], textarea, [contenteditable]')) {
        setState("text");
      } else {
        setState("default");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  return (
    <>
      <style>{`
        *, *::before, *::after { cursor: none !important; }

        /* ── Shared base ── */
        .cc-base {
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          /* translate(-50%,-50%) baked into the wrapper so origin is center */
        }

        /* ── Dot (phosphor green) ── */
        .cc-dot {
          width: 8px; height: 8px;
          margin: -4px 0 0 -4px;
          border-radius: 50%;
          background: #39ff7a;
          box-shadow: 0 0 8px rgba(57,255,122,0.7);
          transition: width 0.2s, height 0.2s, margin 0.2s, border-radius 0.2s, background 0.2s;
        }
        .cc-dot.hover {
          width: 12px; height: 12px;
          margin: -6px 0 0 -6px;
          background: #39ff7a;
        }
        .cc-dot.click {
          width: 5px; height: 5px;
          margin: -2.5px 0 0 -2.5px;
        }
        .cc-dot.text {
          width: 2px; height: 20px;
          margin: -10px 0 0 -1px;
          border-radius: 1px;
          background: #39ff7a;
          animation: cc-blink 1s step-end infinite;
        }
        @keyframes cc-blink { 50% { opacity: 0; } }

        /* ── Ring (phosphor green) ── */
        .cc-ring {
          width: 36px; height: 36px;
          margin: -18px 0 0 -18px;
          border-radius: 50%;
          border: 1.5px solid rgba(57,255,122,0.55);
          box-shadow: 0 0 12px rgba(57,255,122,0.25);
          transition:
            width 0.35s cubic-bezier(0.23,1,0.32,1),
            height 0.35s cubic-bezier(0.23,1,0.32,1),
            margin 0.35s cubic-bezier(0.23,1,0.32,1),
            border-color 0.25s,
            border-width 0.25s,
            background 0.25s;
        }
        .cc-ring.hover {
          width: 56px; height: 56px;
          margin: -28px 0 0 -28px;
          border-color: rgba(57,255,122,0.9);
          background: rgba(57,255,122,0.06);
        }
        .cc-ring.click {
          width: 28px; height: 28px;
          margin: -14px 0 0 -14px;
          border-color: rgba(57,255,122,0.95);
          border-width: 2.5px;
        }
        .cc-ring.text {
          width: 2px; height: 36px;
          margin: -18px 0 0 -1px;
          border-radius: 1px;
          border-width: 0;
          background: rgba(57,255,122,0.35);
        }

        /* ── Trail dots ── */
        .cc-trail {
          position: fixed;
          top: 0; left: 0;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          will-change: transform;
          background: rgba(57,255,122,0.5);
        }
      `}</style>

      {/* Trail particles (behind everything) */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => {
        const size = Math.round(6 - i * 0.8);
        const opacity = 1 - i * 0.15;
        return (
          <div
            key={i}
            className="cc-trail"
            ref={(el) => (trailsRef.current[i] = el)}
            style={{
              width: size,
              height: size,
              marginTop: -size / 2,
              marginLeft: -size / 2,
              opacity,
            }}
          />
        );
      })}

      {/* Lagging ring */}
      <div ref={ringRef} className="cc-base">
        <div className={`cc-ring ${state}`} />
      </div>

      {/* Snappy dot */}
      <div ref={dotRef} className="cc-base">
        <div className={`cc-dot ${state}`} />
      </div>
    </>
  );
};

export default CustomCursor;
