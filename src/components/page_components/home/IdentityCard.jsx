import { profile } from "../../../data/profile";

const AVATAR = `        .      .
       / \\    / \\
      /   \\__/   \\
     |  /\\    /\\  |
     | |  |  |  | |
     |  \\/    \\/  |
      \\    __    /
       \\ /    \\ /
        '      '     `;

const IdentityCard = () => (
  <section id="identity" className="term-reveal">
    <div className="mb-6 text-[#5cf6ff]">
      {profile.user}~/dev $ <span className="text-white">neofetch --retro</span>
    </div>

    <div className="term-box flex flex-col gap-8 border-[#1f4d1f] bg-[#070b07] p-6 md:flex-row">
      {/* ASCII avatar + palette */}
      <div className="flex shrink-0 flex-col items-center">
        <pre className="glow-soft select-none text-[10px] leading-[1.1] text-[#39ff7a]">{AVATAR}</pre>
        <div className="glow-soft mt-4 font-bold tracking-widest text-[#39ff7a]">
          {profile.user.toUpperCase()}@SYSTEM-01
        </div>
        <div className="mt-2 flex gap-1">
          {profile.swatches.map((c) => (
            <div
              key={c}
              className="h-4 w-4 border border-[#143614]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Key / value identity list */}
      <div className="grid w-full grid-cols-1 gap-x-12 gap-y-2 font-mono text-[14px] sm:grid-cols-2">
        {profile.neofetch.map((row) => (
          <div key={row.k}>
            <span className="text-[#39ff7a]">{row.k}:</span> {row.v}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-[#39ff7a]">Status:</span>
          <span className="glow-soft font-bold text-[#ffd24a]">{profile.status}</span>
        </div>
      </div>
    </div>
  </section>
);

export default IdentityCard;
