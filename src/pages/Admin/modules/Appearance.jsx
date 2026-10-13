import { usePortfolio, THEME_PRESETS } from "../../../context/PortfolioContext";
import { Card, Field, ColorF, TI, Toggle, Btn } from "../ui";

const COLOR_ROWS = [
  { key: "void", label: "VOID — page background" },
  { key: "voidSoft", label: "VOID SOFT — panels" },
  { key: "orange", label: "ORANGE — primary brand" },
  { key: "ember", label: "EMBER — secondary brand" },
  { key: "amber", label: "AMBER — tertiary accent" },
  { key: "ink", label: "INK — primary text" },
  { key: "muted", label: "MUTED — secondary text" },
  { key: "dim", label: "DIM — tertiary text" },
  { key: "line", label: "LINE — borders" },
];

export default function Appearance() {
  const { theme, fx, stageTheme, stageFx, push } = usePortfolio();

  return (
    <div className="flex flex-col gap-4">
      <Card title="PRESET SCHEMES" sub="One click repaints every token. Fully editable after applying.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(THEME_PRESETS).map(([id, p]) => (
            <button
              key={id}
              type="button"
              onClick={() => { stageTheme({ ...p.tokens }); push(`${p.label} applied`); }}
              className="group rounded-xl border border-[#27272a] p-4 text-left transition-all hover:border-[#ff4d00]/60"
            >
              <div className="flex gap-1.5">
                {[p.tokens.void, p.tokens.orange, p.tokens.ember, p.tokens.amber, p.tokens.ink].map((c) => (
                  <span key={c} className="h-8 flex-1 rounded-md border border-white/10" style={{ background: c }} />
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] tracking-[0.25em] text-zinc-200 group-hover:text-white">{p.label.toUpperCase()}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card title="COLOR TOKENS" sub="Bound live to :root — the whole portfolio repaints as you pick.">
        <div className="grid gap-4 md:grid-cols-2">
          {COLOR_ROWS.map((row) => (
            <Field key={row.key} label={`${row.key.toUpperCase()} · ${row.label}`}>
              <ColorF value={theme[row.key]} onChange={(v) => stageTheme((t) => ({ ...t, [row.key]: v }))} />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="TYPOGRAPHY" sub="Display / body / mono stacks, spacing and weight.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="FONT DISPLAY STACK"><TI value={theme.fontDisplay} onChange={(e) => stageTheme((t) => ({ ...t, fontDisplay: e.target.value }))} /></Field>
          <Field label="FONT BODY STACK"><TI value={theme.fontBody} onChange={(e) => stageTheme((t) => ({ ...t, fontBody: e.target.value }))} /></Field>
          <Field label="FONT MONO STACK"><TI value={theme.fontMono} onChange={(e) => stageTheme((t) => ({ ...t, fontMono: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="DISPLAY LETTER-SPACING"><TI value={theme.letterSpacing} onChange={(e) => stageTheme((t) => ({ ...t, letterSpacing: e.target.value }))} /></Field>
            <Field label="DISPLAY WEIGHT"><TI type="number" min="100" max="900" step="100" value={theme.displayWeight} onChange={(e) => stageTheme((t) => ({ ...t, displayWeight: Number(e.target.value) }))} /></Field>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-[#27272a] p-5" style={{ background: theme.void }}>
          <p className="font-mono text-[9px] tracking-[0.4em]" style={{ color: theme.orange }}>LIVE TYPE SPECIMEN</p>
          <p style={{ fontFamily: theme.fontDisplay, letterSpacing: theme.letterSpacing, fontWeight: theme.displayWeight, color: theme.ink }} className="mt-2 text-4xl">CRAFTSMAN Aa 123</p>
          <p style={{ fontFamily: theme.fontMono, color: theme.muted }} className="mt-2 text-xs tracking-[0.3em]">JETBRAINS MONO LABEL — THE QUICK BROWN FOX</p>
        </div>
      </Card>

      <Card title="VISUAL FX" sub="Atmosphere layers over the portfolio.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Toggle checked={fx.cursorTrail} onChange={(v) => stageFx((f) => ({ ...f, cursorTrail: v }))} label="Custom cursor trail" />
            <Toggle checked={fx.grainEnabled} onChange={(v) => stageFx((f) => ({ ...f, grainEnabled: v }))} label="Film grain overlay" />
            <Toggle checked={fx.blobsEnabled} onChange={(v) => stageFx((f) => ({ ...f, blobsEnabled: v }))} label="Mesh gradient blobs" />
          </div>
          <div className="flex flex-col gap-4">
            <Field label={`NOISE OPACITY — ${fx.noiseOpacity}`}>
              <input type="range" min="0" max="0.25" step="0.005" value={fx.noiseOpacity} onChange={(e) => stageFx((f) => ({ ...f, noiseOpacity: Number(e.target.value) }))} className="w-full accent-[#ff4d00]" />
            </Field>
            <Field label={`GLOW / BLUR RADIUS — ${fx.glowRadius}px`}>
              <input type="range" min="0" max="200" step="5" value={fx.glowRadius} onChange={(e) => stageFx((f) => ({ ...f, glowRadius: Number(e.target.value) }))} className="w-full accent-[#ff4d00]" />
            </Field>
            <Field label={`BLOB OPACITY — ${fx.blobOpacity}`}>
              <input type="range" min="0" max="1" step="0.05" value={fx.blobOpacity} onChange={(e) => stageFx((f) => ({ ...f, blobOpacity: Number(e.target.value) }))} className="w-full accent-[#ff4d00]" />
            </Field>
          </div>
        </div>
        <div className="mt-4">
          <Btn onClick={() => { stageFx((f) => ({ ...f, noiseOpacity: 0.05, glowRadius: 100, blobOpacity: 1, cursorTrail: true, grainEnabled: true, blobsEnabled: true })); }}>RESET FX</Btn>
        </div>
      </Card>
    </div>
  );
}

