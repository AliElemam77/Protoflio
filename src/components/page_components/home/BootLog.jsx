import { profile } from "../../../data/profile";

const lines = [
  "Initializing BIOS version 1.0.0-phosphor...",
  `Loading kernel 5.14.0-${profile.host}...`,
  `Mounting developer_assets: /dev/sda1 on /home/${profile.user}`,
  "Establishing neural handshake...",
  "Displaying identity_v1.0.sh",
];

const BootLog = () => (
  <div className="boot-log space-y-0.5 font-mono text-[11px] text-[#1c7a3c]">
    {lines.map((line, i) => (
      <div key={i} className="boot-line">
        [ <span className="text-[#39ff7a]">ok</span> ] {line}
      </div>
    ))}
  </div>
);

export default BootLog;
