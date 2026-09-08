// WebGL engine for the experience timeline.
//
// Adapted from the CircularGallery pattern (OGL Renderer/Camera/Plane/Program/
// Texture, inertia scroll, circular bend, infinite wrap). The differences that
// matter here: every plane carries a painted *card* texture rather than a photo,
// each one gets a `uActive` uniform derived from its distance to centre, and
// off-centre cards are pushed back in z so the row reads as depth rather than a
// flat carousel.

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { CARD_ASPECT, ensureFonts, paintCard } from "./paintCard";

const VERTEX = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpeed;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    // A whisper of flex while the row is moving — never a wobble at rest.
    p.z += (sin(p.x * 3.0 + uTime) * 0.6 + cos(p.y * 2.0 + uTime) * 0.6) * uSpeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform vec3 uAccent;
  uniform vec2 uPlaneSize;
  uniform float uRadius;
  uniform float uActive;
  uniform float uOpacity;
  varying vec2 vUv;

  float roundedBox(vec2 p, vec2 b, float r) {
    return length(max(abs(p) - b + r, 0.0)) - r;
  }

  void main() {
    vec4 tex = texture2D(tMap, vUv);

    // Distant cards drain toward monochrome and dim; the centre stays full.
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 color = mix(vec3(lum), tex.rgb, 0.42 + 0.58 * uActive);
    color *= 0.55 + 0.45 * uActive;

    // Orange rim that only the focused card earns.
    vec2 p = (vUv - 0.5) * uPlaneSize;
    float d = roundedBox(p, uPlaneSize * 0.5, uRadius);
    float rim = smoothstep(-uRadius * 0.14, 0.0, d);
    color += uAccent * rim * uActive * 0.55;

    float alpha = tex.a * uOpacity * (0.52 + 0.48 * uActive);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// Breakpoint-driven composition. Mobile is authored, not scaled down: a bigger
// card relative to the viewport, a far gentler bend, cheaper geometry.
function layoutFor(width) {
  if (width < 640) {
    return { key: "sm", bend: 0.8, heightRatio: 0.96, maxWidthRatio: 0.88, gapRatio: 0.11, segments: 12, compact: true, depth: 0.5 };
  }
  if (width < 1024) {
    return { key: "md", bend: 1.6, heightRatio: 0.94, maxWidthRatio: 0.56, gapRatio: 0.14, segments: 18, compact: true, depth: 0.75 };
  }
  return { key: "lg", bend: 2.2, heightRatio: 0.94, maxWidthRatio: 0.42, gapRatio: 0.15, segments: 24, compact: false, depth: 0.9 };
}

class Card {
  constructor({ gl, scene, geometry, texture, radius, index, accent }) {
    this.index = index;
    this.extra = 0;
    this.radius = radius;

    this.program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tMap: { value: texture },
        uAccent: { value: hexToRgb(accent) },
        uPlaneSize: { value: [1, 1] },
        uRadius: { value: radius },
        uActive: { value: 0 },
        uOpacity: { value: 1 },
        uTime: { value: index * 1.3 },
        uSpeed: { value: 0 },
      },
    });

    this.mesh = new Mesh(gl, { geometry, program: this.program });
    this.mesh.setParent(scene);
  }

  setLayout({ cardWidth, cardHeight, itemWidth, radius }) {
    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
    this.itemWidth = itemWidth;
    if (radius) this.radius = radius;
    this.x = itemWidth * this.index;
  }

  update({ scroll, total, bend, depth, viewportWidth, speed, time }) {
    const mesh = this.mesh;
    mesh.position.x = this.x - scroll - this.extra;

    // ── Circular bend ──────────────────────────────────────────────────
    const half = viewportWidth / 2;
    const B = Math.abs(bend);
    const x = mesh.position.x;

    if (B < 0.001) {
      mesh.position.y = 0;
      mesh.position.z = 0;
      mesh.rotation.z = 0;
    } else {
      const R = (half * half + B * B) / (2 * B);
      const effective = Math.min(Math.abs(x), half);
      const arc = R - Math.sqrt(Math.max(R * R - effective * effective, 0));
      const angle = Math.asin(Math.min(effective / R, 1));
      const sign = bend > 0 ? 1 : -1;
      mesh.position.y = -arc * sign;
      mesh.rotation.z = -Math.sign(x) * angle * sign;
      mesh.position.z = -arc * depth;
    }

    // ── Focus falloff ──────────────────────────────────────────────────
    const t = Math.min(Math.abs(x) / (this.itemWidth * 0.95), 1);
    const active = 1 - smoothstep(t);
    this.active = active;
    this.program.uniforms.uActive.value = lerp(
      this.program.uniforms.uActive.value,
      active,
      0.15
    );
    this.program.uniforms.uSpeed.value = speed;
    this.program.uniforms.uTime.value = time + this.index * 1.3;

    const scale = 0.88 + 0.12 * active;
    mesh.scale.x = this.cardWidth * scale;
    mesh.scale.y = this.cardHeight * scale;
    this.program.uniforms.uPlaneSize.value = [mesh.scale.x, mesh.scale.y];
    this.program.uniforms.uRadius.value = this.radius * mesh.scale.x;

    // ── Infinite wrap ──────────────────────────────────────────────────
    // Wrap on absolute position, not travel direction: at rest the row must
    // still be populated on BOTH sides of the focused card. The itemWidth
    // margin keeps a card from oscillating across the seam.
    const edge = total / 2 + this.itemWidth;
    if (x < -edge) this.extra -= total;
    else if (x > edge) this.extra += total;
  }

  destroy() {
    this.mesh.setParent(null);
    const gl = this.program.gl;
    gl.deleteProgram(this.program.program);
  }
}

export default class ExperienceGallery {
  constructor(container, options = {}) {
    this.container = container;
    this.items = options.items ?? [];
    this.bendScale = options.bend ?? 1;
    this.scrollSpeed = options.scrollSpeed ?? 2;
    this.scrollEase = options.scrollEase ?? 0.06;
    this.wheelAxis = options.wheelAxis ?? "x";
    // Auto-advance, in ms. `resumeDelay` is how long a human touch wins for.
    this.autoplay = options.autoplay ?? 4500;
    this.resumeDelay = options.resumeDelay ?? 6000;
    this.lastAdvance = 0;
    this.lastInteraction = -Infinity;
    this.accent = options.accent ?? "#ff4d00";
    this.onIndexChange = options.onIndexChange;

    this.scroll = { current: 0, target: 0, last: 0, position: 0 };
    this.direction = 1;
    this.speed = 0;
    this.time = 0;
    this.paused = false;
    this.destroyed = false;
    this.activeIndex = -1;
    this.dragging = false;

    this.onWheel = this.onWheel.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.update = this.update.bind(this);

    this.init(options.initialIndex ?? 0);
  }

  async init(initialIndex) {
    this.createRenderer();
    this.createCamera();
    this.scene = new Transform();

    await ensureFonts();
    if (this.destroyed) return;

    this.initialIndex = initialIndex;
    this.resize();
    this.createCards();
    this.resize();
    this.centerInitial();
    this.addEvents();
    this.lastAdvance = performance.now();
    this.raf = requestAnimationFrame(this.update);
  }

  createRenderer() {
    const isSmall = window.innerWidth < 768;
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.canvas.style.width = "100%";
    this.gl.canvas.style.height = "100%";
    this.gl.canvas.style.display = "block";
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl, { fov: 45 });
    this.camera.position.z = 20;
  }

  createCards() {
    this.layout = this.layout ?? layoutFor(window.innerWidth);
    const { compact, segments } = this.layout;
    this.geometry = new Plane(this.gl, {
      heightSegments: segments,
      widthSegments: segments,
    });

    // Painted once per breakpoint; the same texture instance is reused by the
    // card that owns it, so nothing is duplicated per frame.
    const quality = Math.min(window.devicePixelRatio || 1, 2);
    this.cards = this.items.map((item, index) => {
      const { canvas, radius } = paintCard(item, {
        index,
        width: compact ? 820 : 900,
        compact,
        quality,
      });
      const texture = new Texture(this.gl, {
        generateMipmaps: true,
        image: canvas,
      });
      this.textures = this.textures ?? [];
      this.textures.push(texture);
      return new Card({
        gl: this.gl,
        scene: this.scene,
        geometry: this.geometry,
        texture,
        radius,
        index,
        accent: this.accent,
      });
    });
  }

  /** Centre the starting card as soon as the container has a real width. */
  centerInitial() {
    if (this.centered || !this.itemWidth) return;
    this.centered = true;
    this.scroll.current = this.itemWidth * this.initialIndex;
    this.scroll.target = this.scroll.current;
    this.scroll.last = this.scroll.current;
    this.scroll.position = this.scroll.current;
  }

  /** Repaint every texture — only when the breakpoint actually changed. */
  repaintCards() {
    if (!this.cards) return;
    const { compact } = this.layout;
    const quality = Math.min(window.devicePixelRatio || 1, 2);
    this.cards.forEach((card, index) => {
      const { canvas, radius } = paintCard(this.items[index], {
        index,
        width: compact ? 820 : 900,
        compact,
        quality,
      });
      card.program.uniforms.tMap.value.image = canvas;
      card.program.uniforms.tMap.value.needsUpdate = true;
      card.radius = radius;
    });
  }

  resize() {
    if (this.destroyed || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    // The section is visibility:hidden between transitions — measuring then
    // would collapse the layout, so wait until it has a real box.
    if (!width || !height) return;

    this.screen = { width, height };
    this.renderer.setSize(width, height);
    this.camera.perspective({ aspect: width / height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const viewportHeight = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { width: viewportHeight * this.camera.aspect, height: viewportHeight };

    const nextLayout = layoutFor(width);
    const changed = this.layout && this.layout.key !== nextLayout.key;
    this.layout = nextLayout;
    if (changed) this.repaintCards();

    let cardHeight = this.viewport.height * nextLayout.heightRatio;
    let cardWidth = cardHeight * CARD_ASPECT;
    const maxWidth = this.viewport.width * nextLayout.maxWidthRatio;
    if (cardWidth > maxWidth) {
      cardWidth = maxWidth;
      cardHeight = cardWidth / CARD_ASPECT;
    }

    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
    this.itemWidth = cardWidth * (1 + nextLayout.gapRatio);
    this.total = this.itemWidth * Math.max(this.items.length, 1);
    this.bend = nextLayout.bend * this.bendScale;

    this.centerInitial();

    if (this.cards) {
      for (const card of this.cards) {
        card.setLayout({
          cardWidth,
          cardHeight,
          itemWidth: this.itemWidth,
          radius: card.radius ?? 0.062,
        });
      }
    }
  }

  // ── Input ─────────────────────────────────────────────────────────────
  markInteraction() {
    const now = performance.now();
    this.lastInteraction = now;
    this.lastAdvance = now;
  }

  onWheel(event) {
    if (!this.itemWidth) return;
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    const delta = this.wheelAxis === "both" && !horizontal ? event.deltaY : event.deltaX;
    if (!delta) return;
    // Vertical wheel is left to the page's section navigation on purpose.
    event.preventDefault();
    event.stopPropagation();
    this.markInteraction();
    this.scroll.target += delta * 0.012 * this.scrollSpeed * this.itemWidth;
    this.snapSoon();
  }

  onPointerDown(event) {
    if (!this.itemWidth) return;
    if (event.button !== undefined && event.button !== 0) return;
    this.markInteraction();
    this.dragging = true;
    this.dragMoved = 0;
    this.startX = event.clientX;
    this.scroll.position = this.scroll.target;
    this.container.setPointerCapture?.(event.pointerId);
    this.container.classList.add("is-dragging");
  }

  onPointerMove(event) {
    if (!this.dragging) return;
    this.markInteraction();
    const distance = (this.startX - event.clientX) * 0.02 * this.scrollSpeed;
    this.dragMoved = Math.abs(this.startX - event.clientX);
    this.scroll.target = this.scroll.position + distance * this.itemWidth;
  }

  onPointerUp(event) {
    if (!this.dragging) return;
    this.dragging = false;
    this.container.releasePointerCapture?.(event?.pointerId);
    this.container.classList.remove("is-dragging");
    this.snap();
  }

  // A horizontal drag must not also register as a vertical section swipe.
  onTouchEnd(event) {
    if (this.dragMoved > 12) event.stopPropagation();
  }

  onKeyDown(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") this.markInteraction();
    if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      this.step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      this.step(-1);
    }
  }

  step(offset) {
    if (!this.itemWidth) return;
    this.scroll.target = Math.round(this.scroll.target / this.itemWidth + offset) * this.itemWidth;
  }

  goTo(index) {
    if (!this.itemWidth) return;
    this.markInteraction();
    const current = Math.round(this.scroll.target / this.itemWidth);
    const length = this.items.length;
    // Travel the short way round the loop.
    let delta = (((index - current) % length) + length) % length;
    if (delta > length / 2) delta -= length;
    this.scroll.target = (current + delta) * this.itemWidth;
  }

  snapSoon() {
    clearTimeout(this.snapTimer);
    this.snapTimer = setTimeout(() => this.snap(), 140);
  }

  snap() {
    if (!this.itemWidth) return;
    this.scroll.target = Math.round(this.scroll.target / this.itemWidth) * this.itemWidth;
  }

  addEvents() {
    const el = this.container;
    el.addEventListener("wheel", this.onWheel, { passive: false });
    el.addEventListener("pointerdown", this.onPointerDown);
    el.addEventListener("pointermove", this.onPointerMove);
    el.addEventListener("pointerup", this.onPointerUp);
    el.addEventListener("pointercancel", this.onPointerUp);
    el.addEventListener("pointerleave", this.onPointerUp);
    el.addEventListener("touchend", this.onTouchEnd);
    el.addEventListener("keydown", this.onKeyDown);

    this.observer = new ResizeObserver(() => {
      cancelAnimationFrame(this.resizeRaf);
      this.resizeRaf = requestAnimationFrame(() => this.resize());
    });
    this.observer.observe(el);
  }

  setPaused(paused) {
    // Leaving the section and coming back should not fire a queued advance.
    if (this.paused && !paused) this.lastAdvance = performance.now();
    this.paused = paused;
  }

  update() {
    this.raf = requestAnimationFrame(this.update);
    if (this.paused || !this.cards || !this.viewport) return;

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scrollEase);
    this.direction = this.scroll.current > this.scroll.last ? 1 : -1;

    const velocity = Math.abs(this.scroll.current - this.scroll.last) / this.itemWidth;
    this.speed = lerp(this.speed, Math.min(velocity * 0.6, 0.09), 0.1);
    this.time += 0.02;

    for (const card of this.cards) {
      card.update({
        scroll: this.scroll.current,
        total: this.total,
        bend: this.bend,
        depth: this.layout.depth,
        viewportWidth: this.viewport.width,
        speed: this.speed,
        time: this.time,
      });
    }

    const focused = this.cards.reduce((best, card) =>
      Math.abs(card.mesh.position.x) < Math.abs(best.mesh.position.x) ? card : best
    );
    if (focused.index !== this.activeIndex) {
      this.activeIndex = focused.index;
      this.onIndexChange?.(focused.index);
    }

    // Auto-advance, unless a human is driving.
    if (this.autoplay && !this.dragging) {
      const now = performance.now();
      if (
        now - this.lastInteraction > this.resumeDelay &&
        now - this.lastAdvance > this.autoplay
      ) {
        this.lastAdvance = now;
        this.scroll.target =
          Math.round(this.scroll.target / this.itemWidth + 1) * this.itemWidth;
      }
    }

    this.scroll.last = this.scroll.current;
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.resizeRaf);
    clearTimeout(this.snapTimer);

    const el = this.container;
    el.removeEventListener("wheel", this.onWheel);
    el.removeEventListener("pointerdown", this.onPointerDown);
    el.removeEventListener("pointermove", this.onPointerMove);
    el.removeEventListener("pointerup", this.onPointerUp);
    el.removeEventListener("pointercancel", this.onPointerUp);
    el.removeEventListener("pointerleave", this.onPointerUp);
    el.removeEventListener("touchend", this.onTouchEnd);
    el.removeEventListener("keydown", this.onKeyDown);
    this.observer?.disconnect();

    this.cards?.forEach((card) => card.destroy());
    this.textures?.forEach((texture) => {
      this.gl.deleteTexture(texture.texture);
      texture.image = null;
    });

    if (this.gl?.canvas?.parentNode) {
      this.gl.canvas.parentNode.removeChild(this.gl.canvas);
    }
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();

    this.cards = null;
    this.textures = null;
    this.scene = null;
    this.renderer = null;
    this.gl = null;
  }
}
