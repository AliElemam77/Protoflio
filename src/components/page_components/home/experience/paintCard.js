// Paints one experience card onto a 2D canvas, which is then uploaded as a
// WebGL texture. Doing the typography here (rather than in the shader) keeps
// Cabinet Grotesk / Satoshi / JetBrains Mono crisp and lets the card read as a
// real editorial panel instead of a label floating under an image.

const DISPLAY = '"Cabinet Grotesk", "Satoshi", system-ui, sans-serif';
const BODY = '"Satoshi", system-ui, -apple-system, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const ACCENTS = ["#ff4d00", "#ff8c00", "#b22222"];

// Card proportions — a tall editorial panel, not a landscape slide.
export const CARD_ASPECT = 0.76;

/** Wait for the display fonts so the canvas never bakes a fallback face. */
export async function ensureFonts() {
  if (!document.fonts) return;
  await Promise.all([
    document.fonts.load('900 160px "Cabinet Grotesk"'),
    document.fonts.load('700 64px "Cabinet Grotesk"'),
    document.fonts.load('400 28px "Satoshi"'),
    document.fonts.load('400 20px "JetBrains Mono"'),
    document.fonts.load('500 20px "JetBrains Mono"'),
  ]).catch(() => {});
  await document.fonts.ready.catch(() => {});
}

/** Letter-spaced text, drawn per glyph so tracking works in every browser. */
function tracked(ctx, text, x, y, spacing) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + spacing;
  }
  return cursor - spacing - x;
}

function trackedWidth(ctx, text, spacing) {
  let w = 0;
  for (const char of text) w += ctx.measureText(char).width + spacing;
  return w - spacing;
}

/** Greedy word wrap. Returns at most `maxLines` lines, last one ellipsised. */
function wrap(ctx, text, maxWidth, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);

  if (lines.length === maxLines) {
    let last = lines[maxLines - 1];
    if (ctx.measureText(last).width > maxWidth) {
      while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) {
        last = last.slice(0, -1);
      }
      lines[maxLines - 1] = `${last.trimEnd()}…`;
    }
  }
  return lines;
}

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * @returns {{canvas: HTMLCanvasElement, radius: number}} radius is in logical
 * card units (0..1 of card width) so the shader can match the corner rounding.
 */
export function paintCard(item, { index, width, compact = false, quality = 2 }) {
  const W = width;
  const H = Math.round(W / CARD_ASPECT);
  const s = W / 900; // every measurement below is authored against a 900px card

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * quality);
  canvas.height = Math.round(H * quality);

  const ctx = canvas.getContext("2d");
  ctx.scale(quality, quality);
  ctx.textBaseline = "alphabetic";

  const accent = ACCENTS[index % ACCENTS.length];
  const pad = Math.round((compact ? 66 : 74) * s);
  const radius = Math.round(56 * s);
  const inner = W - pad * 2;

  // ── Panel ─────────────────────────────────────────────────────────────
  roundedRectPath(ctx, 0, 0, W, H, radius);
  ctx.save();
  ctx.clip();

  const base = ctx.createLinearGradient(0, 0, W * 0.6, H);
  base.addColorStop(0, "#151515");
  base.addColorStop(0.55, "#101010");
  base.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // accent bloom in the top-left corner, echoing the page's mesh blobs
  const bloom = ctx.createRadialGradient(W * 0.1, H * 0.05, 0, W * 0.1, H * 0.05, W * 0.95);
  bloom.addColorStop(0, `${accent}40`);
  bloom.addColorStop(0.45, `${accent}12`);
  bloom.addColorStop(1, "#00000000");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  ctx.save();
  roundedRectPath(ctx, 0.5, 0.5, W - 1, H - 1, radius);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = Math.max(1, 1.5 * s);
  ctx.stroke();
  ctx.restore();

  // ── Top row: index · status ───────────────────────────────────────────
  let y = pad + 22 * s;
  ctx.font = `500 ${Math.round(22 * s)}px ${MONO}`;
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  tracked(ctx, String(index + 1).padStart(2, "0"), pad, y, 7 * s);

  if (item.current) {
    const label = "PRESENT";
    ctx.font = `500 ${Math.round(19 * s)}px ${MONO}`;
    const tw = trackedWidth(ctx, label, 6 * s);
    const pillW = tw + 46 * s;
    const pillH = 46 * s;
    const pillX = W - pad - pillW;
    const pillY = y - 30 * s;
    roundedRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = `${accent}22`;
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1, 1.4 * s);
    ctx.stroke();
    ctx.fillStyle = accent;
    tracked(ctx, label, pillX + 23 * s, y, 6 * s);
  }

  // ── Year ──────────────────────────────────────────────────────────────
  const isYear = /^\d{4}$/.test(item.year);
  const yearSize = Math.round((isYear ? (compact ? 172 : 186) : 84) * s);
  ctx.font = `900 ${yearSize}px ${DISPLAY}`;
  ctx.fillStyle = "#ffffff";
  y += yearSize * 0.92 + 46 * s;
  ctx.fillText(item.year, pad - yearSize * 0.045, y);

  // ── Role ──────────────────────────────────────────────────────────────
  let roleSize = Math.round((compact ? 68 : 74) * s);
  ctx.font = `900 ${roleSize}px ${DISPLAY}`;
  let roleLines = wrap(ctx, item.role.toUpperCase(), inner, 3);
  while (roleLines.length > 2 && roleSize > 40 * s) {
    roleSize = Math.round(roleSize * 0.88);
    ctx.font = `900 ${roleSize}px ${DISPLAY}`;
    roleLines = wrap(ctx, item.role.toUpperCase(), inner, 3);
  }
  y += 34 * s;
  for (const line of roleLines.slice(0, 3)) {
    y += roleSize * 0.9;
    ctx.fillText(line, pad, y);
  }

  // ── Hairline ──────────────────────────────────────────────────────────
  y += 46 * s;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(pad, y, inner, Math.max(1, 1.2 * s));

  // ── Company · period ──────────────────────────────────────────────────
  // The employer is the headline of a career card, so it gets display type at
  // accent colour — shrunk to fit rather than clipped for long institution names.
  let compSize = Math.round((compact ? 42 : 48) * s);
  ctx.font = `900 ${compSize}px ${DISPLAY}`;
  let compLines = wrap(ctx, item.company.toUpperCase(), inner, 2);
  while (compLines.length > 1 && compSize > 26 * s) {
    compSize = Math.round(compSize * 0.88);
    ctx.font = `900 ${compSize}px ${DISPLAY}`;
    compLines = wrap(ctx, item.company.toUpperCase(), inner, 2);
  }
  ctx.fillStyle = accent;
  y += 34 * s;
  for (const line of compLines) {
    y += compSize * 0.92;
    ctx.fillText(line, pad, y);
  }

  y += 34 * s;
  ctx.font = `400 ${Math.round(20 * s)}px ${MONO}`;
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  tracked(ctx, item.period.toUpperCase(), pad, y, 4.5 * s);

  // ── Description ───────────────────────────────────────────────────────
  const bodySize = Math.round((compact ? 29 : 28) * s);
  ctx.font = `400 ${bodySize}px ${BODY}`;
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  const descLines = wrap(ctx, item.description, inner, compact ? 4 : 5);
  y += 26 * s;
  for (const line of descLines) {
    y += bodySize * 1.55;
    ctx.fillText(line, pad, y);
  }

  // ── Skill pills, pinned to the bottom ─────────────────────────────────
  if (item.skills?.length) {
    const pillFont = Math.round(19 * s);
    const pillH = Math.round(50 * s);
    const gap = 12 * s;
    ctx.font = `500 ${pillFont}px ${MONO}`;

    const rows = [[]];
    let rowW = 0;
    for (const skill of item.skills.slice(0, 6)) {
      const w = trackedWidth(ctx, skill.toUpperCase(), 4 * s) + 42 * s;
      if (rowW + w > inner && rows[rows.length - 1].length) {
        rows.push([]);
        rowW = 0;
      }
      if (rows.length > 2) break;
      rows[rows.length - 1].push({ skill, w });
      rowW += w + gap;
    }

    let py = H - pad - rows.length * pillH - (rows.length - 1) * gap;
    for (const row of rows) {
      let px = pad;
      for (const { skill, w } of row) {
        roundedRectPath(ctx, px, py, w, pillH, pillH / 2);
        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.lineWidth = Math.max(1, 1.2 * s);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.62)";
        tracked(ctx, skill.toUpperCase(), px + 21 * s, py + pillH * 0.63, 4 * s);
        px += w + gap;
      }
      py += pillH + gap;
    }
  }

  return { canvas, radius: radius / W };
}
