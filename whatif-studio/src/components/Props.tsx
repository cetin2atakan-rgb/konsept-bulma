import React from "react";

// Hand-held props, drawn upright around the hand centre (0,0).
export const Prop: React.FC<{ name: string; frame: number }> = ({ name, frame }) => {
  switch (name) {
    case "phone":
      return (<g transform="translate(-4,-46)">
        <rect x={-26} y={-44} width={52} height={92} rx={10} fill="#222" />
        <rect x={-21} y={-36} width={42} height={72} rx={5} fill="#7fd1ff" opacity={0.85 + Math.sin(frame / 6) * 0.1} />
        <rect x={-14} y={-26} width={28} height={6} rx={3} fill="#fff" opacity={0.8} /><rect x={-14} y={-14} width={20} height={6} rx={3} fill="#fff" opacity={0.6} />
      </g>);
    case "paper":
      return (<g transform="translate(6,-50) rotate(-6)">
        <rect x={-34} y={-46} width={68} height={90} rx={4} fill="#fffdf6" stroke="#d9d2c3" strokeWidth={3} />
        {[-28, -14, 0, 14].map((y) => <rect key={y} x={-24} y={y} width={y === 14 ? 30 : 48} height={5} rx={2} fill="#b8b2a6" />)}
      </g>);
    case "newspaper":
      return (<g transform="translate(10,-40) rotate(-4)">
        <rect x={-60} y={-50} width={120} height={84} fill="#efe9db" stroke="#bdb4a3" strokeWidth={3} />
        <rect x={-50} y={-42} width={100} height={14} fill="#3a3a3a" />
        {[-20, -8, 4, 16].map((y) => <g key={y}><rect x={-50} y={y} width={44} height={5} fill="#9e9789" /><rect x={6} y={y} width={44} height={5} fill="#9e9789" /></g>)}
      </g>);
    case "coffee":
      return (<g transform="translate(4,-30)">
        {[0, 1].map((i) => <path key={i} d={`M ${-6 + i * 12} -42 q 8 -12 0 -24 q -8 -12 0 -24`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.35 + 0.25 * Math.sin(frame / 8 + i * 2)} strokeLinecap="round" transform={`translate(0,${-((frame * 0.6 + i * 10) % 14)})`} />)}
        <path d="M -24 -34 L 24 -34 L 18 24 L -18 24 Z" fill="#fffaf0" stroke="#c9b79c" strokeWidth={3} />
        <rect x={-25} y={-10} width={50} height={14} fill="#c0392b" />
      </g>);
    case "sandwich":
      return (<g transform="translate(6,-26)">
        <path d="M -40 -6 Q 0 -40 40 -6 Z" fill="#e9c46a" /><rect x={-42} y={-8} width={84} height={8} rx={4} fill="#7bd389" />
        <rect x={-40} y={0} width={80} height={8} rx={3} fill="#e76f51" /><path d="M -40 8 L 40 8 Q 40 22 0 22 Q -40 22 -40 8 Z" fill="#e9c46a" />
      </g>);
    case "burger":
      return (<g transform="translate(6,-30)">
        <path d="M -38 -4 Q 0 -44 38 -4 Z" fill="#d4a24c" /><rect x={-40} y={-6} width={80} height={10} rx={5} fill="#6b3e26" />
        <rect x={-42} y={4} width={84} height={6} rx={3} fill="#7bd389" /><rect x={-38} y={10} width={76} height={12} rx={6} fill="#d4a24c" />
      </g>);
    case "money":
      return (<g transform="translate(14,-30) rotate(-10)">
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 6},${-i * 6})`}><rect x={-46} y={-24} width={92} height={48} rx={5} fill="#86c06c" stroke="#4f7d3c" strokeWidth={3} /><circle r={13} fill="#d8f0c8" /></g>)}
      </g>);
    case "letter":
      return (<g transform="translate(8,-30) rotate(-8)">
        <rect x={-44} y={-28} width={88} height={56} rx={4} fill="#fffaf0" stroke="#c9b79c" strokeWidth={3} />
        <path d="M -44 -28 L 0 6 L 44 -28" stroke="#c9b79c" strokeWidth={3} fill="none" /><circle cx={0} cy={6} r={8} fill="#c0392b" />
      </g>);
    case "soda":
      return (<g transform="translate(2,-40)">
        <path d="M -9 -50 L 9 -50 L 9 -30 Q 20 -16 18 8 L 18 40 Q 0 48 -18 40 L -18 8 Q -20 -16 -9 -30 Z" fill="#4a7c59" opacity={0.85} />
        <rect x={-18} y={0} width={36} height={18} fill="#e63946" /><rect x={-10} y={-56} width={20} height={8} rx={2} fill="#bbb" />
      </g>);
    case "key":
      return (<g transform="translate(10,-14) rotate(-30)"><circle r={14} fill="none" stroke="#e9c46a" strokeWidth={8} /><rect x={12} y={-4} width={44} height={8} fill="#e9c46a" /><rect x={44} y={4} width={6} height={12} fill="#e9c46a" /></g>);
    case "flower":
      return (<g transform="translate(0,-60)"><line x1={0} y1={0} x2={0} y2={60} stroke="#4f7d3c" strokeWidth={6} />
        {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 14} cy={Math.sin((a * Math.PI) / 180) * 14} r={12} fill="#ff8fab" />)}<circle r={9} fill="#ffd166" /></g>);
    case "ticket":
      return (<g transform="translate(10,-24) rotate(-12)"><rect x={-44} y={-22} width={88} height={44} rx={6} fill="#f4d35e" stroke="#b08900" strokeWidth={3} /><line x1={20} y1={-22} x2={20} y2={22} stroke="#b08900" strokeWidth={3} strokeDasharray="5 5" /></g>);
    case "map":
      return (<g transform="translate(10,-40)"><path d="M -54 -36 L -18 -44 L 18 -36 L 54 -44 L 54 36 L 18 44 L -18 36 L -54 44 Z" fill="#f1e3c4" stroke="#b9a37a" strokeWidth={3} />
        <path d="M -40 20 Q -10 -20 30 0" stroke="#e63946" strokeWidth={4} strokeDasharray="6 6" fill="none" /><circle cx={30} cy={0} r={6} fill="#e63946" /></g>);
    case "bag":
      return (<g transform="translate(0,24)"><path d="M -16 -20 Q 0 -44 16 -20" stroke="#6d4c41" strokeWidth={6} fill="none" /><rect x={-36} y={-20} width={72} height={70} rx={8} fill="#c49a6c" /></g>);
    default:
      return null;
  }
};
