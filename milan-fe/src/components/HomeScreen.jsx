const NODES = [
  { cx: 780, cy: 180, r: 4 }, { cx: 300, cy: 250, r: 3 },
  { cx: 1100, cy: 320, r: 5 }, { cx: 200, cy: 480, r: 3 },
  { cx: 950, cy: 500, r: 4 }, { cx: 480, cy: 150, r: 3 },
  { cx: 1250, cy: 200, r: 4 }, { cx: 150, cy: 350, r: 3 },
  { cx: 1050, cy: 150, r: 3 }, { cx: 600, cy: 500, r: 4 },
  { cx: 350, cy: 420, r: 3 }, { cx: 1180, cy: 460, r: 3 },
]

const LINES = [
  [0,1],[0,2],[0,4],[1,3],[1,10],[2,6],[2,4],[3,7],[4,9],[5,0],
  [5,1],[6,11],[7,10],[8,6],[8,2],[9,10],[11,4],
]

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  cx: 80 + (i * 53) % 1300,
  cy: 80 + (i * 79) % 520,
  r: 1.2 + (i % 3) * 0.8,
  delay: (i * 0.4) % 6,
  dur: 3 + (i % 4),
}))

export default function HomeScreen() {
  return (
    <div className="home-wallpaper">
      <svg className="wallpaper-svg" viewBox="0 0 1440 680" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Central orb glow */}
          <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.95" />
            <stop offset="35%"  stopColor="#7c3aed" stopOpacity="0.7" />
            <stop offset="70%"  stopColor="#4f46e5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          {/* Outer halo */}
          <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
          {/* Pink glow */}
          <radialGradient id="pinkGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ec4899" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </radialGradient>
          {/* Node glow filter */}
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Orb glow filter */}
          <filter id="orbGlow">
            <feGaussianBlur stdDeviation="18" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Line gradient */}
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0" />
            <stop offset="50%"  stopColor="#a78bfa" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Background halos ── */}
        <ellipse cx="720" cy="340" rx="520" ry="320" fill="url(#haloGrad)" opacity="0.6" />
        <ellipse cx="200" cy="150" rx="280" ry="200" fill="url(#pinkGrad)" opacity="0.7" />
        <ellipse cx="1300" cy="560" rx="260" ry="200" fill="url(#pinkGrad)" opacity="0.5" />

        {/* ── Grid lines ── */}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`v${i}`}
            x1={i * 84} y1="0" x2={i * 84} y2="680"
            stroke="rgba(124,58,237,0.06)" strokeWidth="1" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`h${i}`}
            x1="0" y1={i * 76} x2="1440" y2={i * 76}
            stroke="rgba(124,58,237,0.06)" strokeWidth="1" />
        ))}

        {/* ── Connection lines between nodes ── */}
        {LINES.map(([a, b], i) => (
          <line key={i}
            x1={NODES[a].cx} y1={NODES[a].cy}
            x2={NODES[b].cx} y2={NODES[b].cy}
            stroke="url(#lineGrad)" strokeWidth="1"
            opacity="0.45">
            <animate attributeName="opacity"
              values="0.2;0.55;0.2" dur={`${4 + (i % 4)}s`}
              begin={`${i * 0.35}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* ── Floating particles ── */}
        {PARTICLES.map(p => (
          <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r}
            fill="#a78bfa" opacity="0.35">
            <animate attributeName="opacity"
              values="0.1;0.55;0.1" dur={`${p.dur}s`}
              begin={`${p.delay}s`} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0,-12; 0,0" dur={`${p.dur + 1}s`}
              begin={`${p.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ── Network nodes ── */}
        {NODES.map((n, i) => (
          <g key={i} filter="url(#nodeGlow)">
            <circle cx={n.cx} cy={n.cy} r={n.r * 3.5}
              fill={i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#06b6d4' : '#ec4899'}
              opacity="0.12" />
            <circle cx={n.cx} cy={n.cy} r={n.r}
              fill={i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#22d3ee' : '#f472b6'}>
              <animate attributeName="r"
                values={`${n.r};${n.r * 1.6};${n.r}`} dur={`${3 + (i % 3)}s`}
                begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ── Central AI orb ── */}
        {/* Outer pulse rings */}
        <circle cx="720" cy="320" r="140" fill="none"
          stroke="#7c3aed" strokeWidth="0.8" opacity="0.2">
          <animate attributeName="r" values="140;180;140" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="720" cy="320" r="110" fill="none"
          stroke="#06b6d4" strokeWidth="0.8" opacity="0.25">
          <animate attributeName="r" values="110;155;110" dur="4s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="4s" begin="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="720" cy="320" r="80" fill="none"
          stroke="#ec4899" strokeWidth="0.8" opacity="0.2">
          <animate attributeName="r" values="80;130;80" dur="4s" begin="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" begin="2s" repeatCount="indefinite" />
        </circle>

        {/* Halo glow */}
        <circle cx="720" cy="320" r="90" fill="url(#orbGrad)" filter="url(#orbGlow)" opacity="0.6" />

        {/* Orbiting ring 1 */}
        <ellipse cx="720" cy="320" rx="68" ry="22"
          fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5"
          style={{ transformOrigin: '720px 320px' }}>
          <animateTransform attributeName="transform" type="rotate"
            values="0 720 320;360 720 320" dur="6s" repeatCount="indefinite" />
        </ellipse>

        {/* Orbiting ring 2 */}
        <ellipse cx="720" cy="320" rx="68" ry="22"
          fill="none" stroke="#06b6d4" strokeWidth="1.2" opacity="0.4"
          style={{ transformOrigin: '720px 320px' }}>
          <animateTransform attributeName="transform" type="rotate"
            values="60 720 320;420 720 320" dur="9s" repeatCount="indefinite" />
        </ellipse>

        {/* Core orb */}
        <circle cx="720" cy="320" r="36" fill="url(#orbGrad)" filter="url(#orbGlow)" />
        <circle cx="720" cy="320" r="28"
          fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" />
        <circle cx="720" cy="320" r="18" fill="#7c3aed" opacity="0.9" />
        <circle cx="712" cy="312" r="6" fill="white" opacity="0.25" />

        {/* Orbiting dot 1 */}
        <circle r="5" fill="#a78bfa" filter="url(#nodeGlow)">
          <animateMotion dur="6s" repeatCount="indefinite">
            <mpath href="#orbit1" />
          </animateMotion>
        </circle>
        <ellipse id="orbit1" cx="720" cy="320" rx="68" ry="22"
          fill="none" style={{ display: 'none' }}>
          <animateTransform attributeName="transform" type="rotate"
            values="0 720 320;360 720 320" dur="6s" repeatCount="indefinite" />
        </ellipse>

        {/* Orbiting dot 2 */}
        <circle r="4" fill="#22d3ee" filter="url(#nodeGlow)">
          <animateMotion dur="9s" repeatCount="indefinite" begin="3s">
            <mpath href="#orbit2" />
          </animateMotion>
        </circle>
        <ellipse id="orbit2" cx="720" cy="320" rx="68" ry="22"
          fill="none" style={{ display: 'none' }}>
          <animateTransform attributeName="transform" type="rotate"
            values="60 720 320;420 720 320" dur="9s" repeatCount="indefinite" />
        </ellipse>

        {/* ── Brand label ── */}
        <text x="720" y="420" textAnchor="middle"
          fontFamily="Poppins, sans-serif" fontSize="13" fontWeight="600"
          fill="#a78bfa" opacity="0.6" letterSpacing="6">
          AEGIS · AI · AGENT
        </text>
        <text x="720" y="442" textAnchor="middle"
          fontFamily="Poppins, sans-serif" fontSize="10" fontWeight="400"
          fill="#64748b" letterSpacing="3">
          SECURITY LOG INTELLIGENCE
        </text>
      </svg>
    </div>
  )
}
