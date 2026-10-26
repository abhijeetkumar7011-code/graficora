"use client";

import { useId } from "react";

// Original, illustrated mockup covers — no stock photos, no third-party brands.
// Swap any of these for real work by adding `image: "/work/file.jpg"` in lib/content.js.

const F = { fontFamily: "var(--font-display), sans-serif" };

const Spark = ({ x, y, s = 1, o = 0.9 }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
    fill="#fff"
    opacity={o}
  />
);

const Grad = ({ id, c, x2 = 1, y2 = 1 }) => (
  <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
    {c.map((col, i) => (
      <stop key={i} offset={i / (c.length - 1)} stopColor={col} />
    ))}
  </linearGradient>
);

/* 1 — Coffee brand */
function Coffee({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#3b0764", "#be185d", "#fb923c"]} />
        <Grad id={`${u}cup`} c={["#fff7ed", "#fdba74"]} x2={0} />
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      <circle cx="330" cy="40" r="130" fill="#fff" opacity=".07" />
      <circle cx="50" cy="290" r="110" fill="#fff" opacity=".06" />
      <text x="376" y="44" textAnchor="end" style={F} fontSize="15" fontWeight="800" letterSpacing="5" fill="#fff">NOVA COFFEE</text>
      <text x="376" y="60" textAnchor="end" style={F} fontSize="8.5" letterSpacing="3" fill="#fff" opacity=".7">ROASTED DAILY · EST. 2026</text>

      {/* beans */}
      {[[330, 235, 25], [356, 205, -35], [60, 200, 40], [88, 240, -20]].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="13" ry="8" fill="#3b1d0c" />
          <path d={`M${x - 11} ${y} Q${x} ${y - 6} ${x + 11} ${y}`} stroke="#8a5530" strokeWidth="1.6" fill="none" />
        </g>
      ))}

      <ellipse cx="200" cy="252" rx="112" ry="14" fill="#000" opacity=".25" />
      <g className="animate-float-slow">
        {/* steam */}
        {[[172, 0], [200, 8], [228, 2]].map(([x, d], i) => (
          <path
            key={i}
            d={`M${x} 112 C${x - 14} 92 ${x + 14} 82 ${x} 60 C${x - 8} 48 ${x + 6} 40 ${x} 30`}
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity={0.55 - i * 0.08}
            transform={`translate(0 ${d})`}
          />
        ))}
        <path d="M268 150 C318 144 318 208 255 204" stroke="#fff7ed" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M128 128 H272 C272 200 246 238 200 238 C154 238 128 200 128 128 Z" fill={`url(#${u}cup)`} />
        <ellipse cx="200" cy="128" rx="72" ry="13" fill="#fed7aa" />
        <ellipse cx="200" cy="128" rx="62" ry="9.5" fill="#4a2511" />
        <path d="M200 131 c-9 -4 -10 -10 -4 -11 c3 0 4 2 4 3 c0 -1 1 -3 4 -3 c6 1 5 7 -4 11z" fill="#f5deb3" opacity=".85" />
        <circle cx="200" cy="188" r="25" fill="#be185d" />
        <text x="200" y="198" textAnchor="middle" style={F} fontSize="28" fontWeight="900" fill="#fff">N</text>
      </g>
      <ellipse cx="200" cy="244" rx="104" ry="12" fill="#fff" opacity=".92" />
      <Spark x={92} y={96} s={1.1} />
      <Spark x={318} y={110} s={0.8} o={0.7} />
    </>
  );
}

/* 2 — Fitness social campaign */
function Fitness({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#1e1b4b", "#9d174d", "#f43f5e"]} />
        <Grad id={`${u}ph`} c={["#8b5cf6", "#ec4899", "#fb923c"]} />
        <filter id={`${u}blur`}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-40 + i * 90} y="-20" width="30" height="360" fill="#fff" opacity=".04" transform="rotate(18 200 150)" />
      ))}
      <text x="14" y="178" style={F} fontSize="120" fontWeight="900" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="2">PULSE</text>

      <polyline points="0,210 95,210 120,210 140,142 166,264 192,172 212,210 400,210" fill="none" stroke="#fbbf24" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" filter={`url(#${u}blur)`} opacity=".8" />
      <polyline points="0,210 95,210 120,210 140,142 166,264 192,172 212,210 400,210" fill="none" stroke="#fde68a" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

      {/* dumbbell */}
      <g transform="rotate(-24 90 90)" className="animate-float">
        <rect x="42" y="84" width="110" height="12" rx="6" fill="#e5e7eb" />
        <rect x="30" y="60" width="18" height="60" rx="6" fill="#fbbf24" />
        <rect x="146" y="60" width="18" height="60" rx="6" fill="#fbbf24" />
        <rect x="16" y="70" width="14" height="40" rx="5" fill="#f59e0b" />
        <rect x="164" y="70" width="14" height="40" rx="5" fill="#f59e0b" />
      </g>

      {/* social card */}
      <g transform="rotate(-7 300 120)">
        <rect x="222" y="40" width="148" height="158" rx="18" fill="#000" opacity=".25" transform="translate(6 8)" />
        <rect x="222" y="40" width="148" height="158" rx="18" fill="#fff" />
        <rect x="234" y="52" width="124" height="74" rx="11" fill={`url(#${u}ph)`} />
        <path d="M296 112 c-22 -14 -26 -30 -14 -36 c7 -3 12 2 14 6 c2 -4 7 -9 14 -6 c12 6 8 22 -14 36z" fill="#fff" opacity=".95" />
        <text x="234" y="154" style={F} fontSize="21" fontWeight="900" fill="#be123c">30 DAY</text>
        <text x="234" y="168" style={F} fontSize="9.5" fontWeight="700" letterSpacing="2" fill="#111">CHALLENGE</text>
        <rect x="234" y="176" width="52" height="14" rx="7" fill="#111" />
        <text x="260" y="186" textAnchor="middle" style={F} fontSize="7.5" fontWeight="800" fill="#fff">JOIN NOW</text>
      </g>
      <Spark x={52} y={228} s={1.2} />
      <Spark x={368} y={250} s={0.9} o={0.7} />
    </>
  );
}

/* 3 — Skincare packaging */
function Skincare({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#0c4a6e", "#4f46e5", "#a78bfa"]} />
        <Grad id={`${u}glass`} c={["#ffffff55", "#ffffff14"]} />
        <Grad id={`${u}liq`} c={["#f0abfc", "#c084fc"]} x2={0} />
        <Grad id={`${u}jar`} c={["#fdf4ff", "#e9d5ff"]} />
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      <circle cx="90" cy="60" r="90" fill="#fff" opacity=".07" />
      <circle cx="350" cy="260" r="120" fill="#f0abfc" opacity=".13" />
      {/* leaves */}
      <path d="M40 270 C20 220 60 190 100 200 C100 240 80 268 40 270Z" fill="#34d399" opacity=".5" />
      <path d="M360 90 C330 60 350 20 390 20 C396 56 386 82 360 90Z" fill="#6ee7b7" opacity=".45" />
      <ellipse cx="205" cy="262" rx="150" ry="12" fill="#000" opacity=".22" />

      {/* dropper bottle */}
      <g className="animate-float-slow">
        <ellipse cx="155" cy="52" rx="16" ry="22" fill="#f9a8d4" />
        <rect x="140" y="68" width="30" height="46" rx="8" fill="#fff" />
        <rect x="108" y="110" width="94" height="150" rx="20" fill={`url(#${u}glass)`} stroke="#fff" strokeOpacity=".65" strokeWidth="2" />
        <rect x="112" y="170" width="86" height="86" rx="16" fill={`url(#${u}liq)`} opacity=".9" />
        <rect x="120" y="180" width="70" height="54" rx="6" fill="#fff" opacity=".96" />
        <text x="155" y="203" textAnchor="middle" style={F} fontSize="12" fontWeight="900" letterSpacing="2" fill="#4f46e5">AURORA</text>
        <text x="155" y="216" textAnchor="middle" style={F} fontSize="6" letterSpacing="1.6" fill="#6b7280">GLOW SERUM</text>
        <circle cx="155" cy="226" r="3" fill="#c084fc" />
        <rect x="118" y="120" width="8" height="48" rx="4" fill="#fff" opacity=".5" />
      </g>

      {/* jar */}
      <g className="animate-float">
        <rect x="236" y="170" width="112" height="84" rx="18" fill={`url(#${u}jar)`} />
        <rect x="230" y="142" width="124" height="36" rx="12" fill="#c4b5fd" />
        <rect x="230" y="142" width="124" height="10" rx="5" fill="#fff" opacity=".4" />
        <text x="292" y="210" textAnchor="middle" style={F} fontSize="14" fontWeight="900" letterSpacing="3" fill="#4f46e5">AURORA</text>
        <text x="292" y="226" textAnchor="middle" style={F} fontSize="7" letterSpacing="2" fill="#6b7280">NIGHT CREAM</text>
        <circle cx="292" cy="240" r="3.4" fill="#c084fc" />
      </g>
      <Spark x={60} y={110} s={1.2} />
      <Spark x={252} y={60} s={0.9} />
      <Spark x={372} y={170} s={0.7} o={0.7} />
    </>
  );
}

/* 4 — Tech event poster */
function Poster({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#022c22", "#0e7490", "#1e1b4b"]} />
        <Grad id={`${u}p2`} c={["#f472b6", "#fb923c"]} />
        <radialGradient id={`${u}planet`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#6ee7b7" />
          <stop offset="1" stopColor="#0891b2" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      {Array.from({ length: 28 }).map((_, i) => (
        <circle key={i} cx={(i * 97) % 400} cy={(i * 53) % 300} r={(i % 3) * 0.6 + 0.6} fill="#fff" opacity={0.35 + (i % 4) * 0.15} />
      ))}

      {/* back poster */}
      <g transform="rotate(10 270 150)">
        <rect x="212" y="40" width="130" height="200" rx="9" fill={`url(#${u}p2)`} />
        <text x="226" y="86" style={F} fontSize="22" fontWeight="900" fill="#fff">2026</text>
        <rect x="226" y="198" width="70" height="5" rx="2.5" fill="#fff" opacity=".7" />
        <rect x="226" y="210" width="46" height="5" rx="2.5" fill="#fff" opacity=".5" />
      </g>

      {/* front poster */}
      <g transform="rotate(-6 160 150)" className="animate-float-slow">
        <rect x="86" y="26" width="148" height="226" rx="9" fill="#000" opacity=".3" transform="translate(7 9)" />
        <rect x="86" y="26" width="148" height="226" rx="9" fill="#020617" stroke="#fff" strokeOpacity=".15" />
        <ellipse cx="160" cy="104" rx="56" ry="21" fill="none" stroke="#22d3ee" strokeWidth="1.6" transform="rotate(-22 160 104)" />
        <ellipse cx="160" cy="104" rx="40" ry="14" fill="none" stroke="#34d399" strokeWidth="1.4" transform="rotate(-22 160 104)" />
        <circle cx="160" cy="104" r="18" fill={`url(#${u}planet)`} />
        <circle cx="209" cy="88" r="4.5" fill="#fff" />
        <circle cx="116" cy="124" r="3" fill="#fbbf24" />
        <text x="102" y="182" style={F} fontSize="36" fontWeight="900" fill="#fff">ORBIT</text>
        <text x="102" y="199" style={F} fontSize="8.5" letterSpacing="3" fill="#67e8f9">TECH SUMMIT 2026</text>
        <rect x="102" y="212" width="90" height="1.5" fill="#fff" opacity=".25" />
        <text x="102" y="228" style={F} fontSize="7" letterSpacing="1.6" fill="#fff" opacity=".7">NOV 14 · NEW DELHI</text>
      </g>
      <Spark x={50} y={60} s={1} />
      <Spark x={360} y={266} s={0.9} o={0.7} />
    </>
  );
}

/* 5 — Studio identity (stationery) */
function Mono({ x, y, s = 1, a = "#111", b = "#be185d" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-15" y="-22" width="9" height="44" fill={a} />
      <polygon points="-6,1 14,-22 27,-22 5,3" fill={b} />
      <polygon points="-2,-2 27,22 14,22 -6,5" fill={a} />
    </g>
  );
}

function Studio({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#7c2d12", "#be185d", "#6d28d9"]} />
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      <circle cx="320" cy="50" r="120" fill="#fff" opacity=".07" />
      <circle cx="60" cy="270" r="100" fill="#fff" opacity=".06" />

      {/* letterhead */}
      <g transform="rotate(-9 150 150)">
        <rect x="64" y="34" width="176" height="232" rx="6" fill="#000" opacity=".25" transform="translate(6 8)" />
        <rect x="64" y="34" width="176" height="232" rx="6" fill="#fffaf5" />
        <Mono x={96} y={74} s={0.9} />
        <text x="122" y="70" style={F} fontSize="15" fontWeight="900" letterSpacing="3" fill="#111">KALA</text>
        <text x="122" y="82" style={F} fontSize="6" letterSpacing="2.4" fill="#9a3412">STUDIO</text>
        {[120, 136, 152, 168, 184].map((y, i) => (
          <rect key={y} x="84" y={y} width={i % 2 ? 110 : 132} height="4" rx="2" fill="#e5e7eb" />
        ))}
        <rect x="84" y="226" width="56" height="4" rx="2" fill="#be185d" opacity=".7" />
      </g>

      {/* business card */}
      <g transform="rotate(11 280 200)" className="animate-float-slow">
        <rect x="204" y="148" width="152" height="94" rx="9" fill="#000" opacity=".3" transform="translate(5 7)" />
        <rect x="204" y="148" width="152" height="94" rx="9" fill="#111827" />
        <Mono x={246} y={195} s={1.15} a="#fbbf24" b="#fb7185" />
        <rect x="280" y="176" width="62" height="5" rx="2.5" fill="#fff" opacity=".85" />
        <rect x="280" y="190" width="44" height="3.5" rx="1.75" fill="#fff" opacity=".45" />
        <rect x="280" y="200" width="52" height="3.5" rx="1.75" fill="#fff" opacity=".45" />
        <rect x="280" y="218" width="36" height="3.5" rx="1.75" fill="#fbbf24" />
      </g>
      <Spark x={366} y={44} s={1} />
      <Spark x={34} y={190} s={0.8} o={0.7} />
    </>
  );
}

/* 6 — Juice label */
function Juice({ u }) {
  const wedges = Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return [Math.cos(a) * 62, Math.sin(a) * 62];
  });
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#365314", "#ca8a04", "#ea580c"]} />
        <Grad id={`${u}glass`} c={["#fb923c", "#ea580c"]} x2={0} />
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      <circle cx="80" cy="50" r="110" fill="#fff" opacity=".08" />

      {/* citrus slice */}
      <g transform="translate(290 128)" className="animate-float">
        <circle r="86" fill="#f97316" />
        <circle r="78" fill="#fde68a" />
        <circle r="70" fill="#fde047" />
        {wedges.map(([x, y], i) => (
          <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" />
        ))}
        <circle r="9" fill="#fff7ed" />
        {wedges.map(([x, y], i) => (
          <circle key={i} cx={x * 0.55} cy={y * 0.55} r="3" fill="#fff" opacity=".6" />
        ))}
      </g>

      <ellipse cx="160" cy="268" rx="70" ry="9" fill="#000" opacity=".25" />
      {/* bottle */}
      <g className="animate-float-slow">
        <rect x="136" y="26" width="48" height="16" rx="4" fill="#365314" />
        <rect x="142" y="40" width="36" height="42" rx="6" fill={`url(#${u}glass)`} />
        <rect x="118" y="76" width="84" height="190" rx="32" fill={`url(#${u}glass)`} stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
        <rect x="126" y="128" width="68" height="92" rx="8" fill="#fff7ed" />
        <circle cx="160" cy="154" r="13" fill="#fde047" />
        <path d="M147 154 H173 M160 141 V167" stroke="#f97316" strokeWidth="1.6" />
        <text x="160" y="190" textAnchor="middle" style={F} fontSize="22" fontWeight="900" letterSpacing="2" fill="#ea580c">ZEST</text>
        <text x="160" y="204" textAnchor="middle" style={F} fontSize="6.5" letterSpacing="2" fill="#365314">COLD-PRESSED</text>
        <rect x="132" y="90" width="9" height="30" rx="4.5" fill="#fff" opacity=".4" />
      </g>
      {[[240, 232, 6], [268, 250, 4], [346, 236, 5]].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r * 1.6} C${x + r} ${y - r * 0.4} ${x + r} ${y + r} ${x} ${y + r} C${x - r} ${y + r} ${x - r} ${y - r * 0.4} ${x} ${y - r * 1.6}Z`} fill="#fde047" opacity=".9" />
      ))}
      <Spark x={50} y={150} s={1} />
    </>
  );
}

/* 7 — 3D packaging mockup (isometric box) */
function Box3D({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#020617", "#1e1b4b", "#0e7490"]} />
        <Grad id={`${u}top`} c={["#f0abfc", "#a78bfa"]} />
        <Grad id={`${u}left`} c={["#7c3aed", "#4c1d95"]} x2={0} />
        <Grad id={`${u}right`} c={["#0891b2", "#164e63"]} x2={0} />
        <radialGradient id={`${u}sph`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".35" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#0e7490" />
        </radialGradient>
        <radialGradient id={`${u}sph2`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".4" stopColor="#f472b6" />
          <stop offset="1" stopColor="#9d174d" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      {/* perspective floor grid */}
      <g stroke="#67e8f9" strokeOpacity=".28" strokeWidth="1">
        {[-6, -4, -2, 0, 2, 4, 6].map((i) => (
          <line key={i} x1={200 + i * 14} y1="226" x2={200 + i * 70} y2="300" />
        ))}
        {[232, 244, 260, 282].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>
      <ellipse cx="208" cy="246" rx="108" ry="14" fill="#000" opacity=".4" />

      <g className="animate-float-slow">
        {/* faces */}
        <polygon points="122,115 217,170 217,240 122,185" fill={`url(#${u}left)`} />
        <polygon points="217,170 295,125 295,195 217,240" fill={`url(#${u}right)`} />
        <polygon points="200,70 295,125 217,170 122,115" fill={`url(#${u}top)`} />
        {/* top gloss + lid line */}
        <polygon points="200,70 240,93 168,134 122,115" fill="#fff" opacity=".22" />
        <polyline points="122,115 217,170 295,125" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" />
        {/* left face branding (skewed to iso plane) */}
        <g transform="matrix(0.866 0.5 0 1 122 115)">
          <text x="14" y="40" style={F} fontSize="27" fontWeight="900" letterSpacing="4" fill="#fff">AERO</text>
          <text x="15" y="55" style={F} fontSize="8" letterSpacing="3" fill="#e9d5ff">WIRELESS · PRO</text>
          <rect x="15" y="60" width="30" height="3" rx="1.5" fill="#67e8f9" />
        </g>
        {/* right face detail */}
        <g transform="matrix(0.866 -0.5 0 1 217 170)">
          <circle cx="45" cy="32" r="17" fill="none" stroke="#a5f3fc" strokeWidth="2.5" />
          <circle cx="45" cy="32" r="8" fill="#a5f3fc" opacity=".85" />
          <rect x="22" y="58" width="46" height="3" rx="1.5" fill="#fff" opacity=".5" />
        </g>
        {/* edge highlights */}
        <line x1="217" y1="170" x2="217" y2="240" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" />
      </g>

      {/* floating spheres */}
      <g className="animate-float">
        <circle cx="76" cy="96" r="22" fill={`url(#${u}sph)`} />
        <ellipse cx="76" cy="236" rx="18" ry="4" fill="#000" opacity=".3" />
      </g>
      <g className="animate-float-slow">
        <circle cx="338" cy="70" r="14" fill={`url(#${u}sph2)`} />
        <circle cx="352" cy="205" r="9" fill={`url(#${u}sph)`} />
      </g>
      {/* wireframe cage corner */}
      <g stroke="#a5f3fc" strokeOpacity=".55" strokeWidth="1" fill="none">
        <polyline points="30,40 30,28 42,28" />
        <polyline points="370,40 370,28 358,28" />
        <polyline points="30,262 30,274 42,274" />
        <polyline points="370,262 370,274 358,274" />
      </g>
      <text x="30" y="20" style={F} fontSize="7.5" letterSpacing="3" fill="#a5f3fc" opacity=".8">3D · RENDER 4K</text>
      <Spark x={310} y={150} s={0.9} />
    </>
  );
}

/* 8 — Low-poly island scene */
function Lowpoly({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#312e81", "#be185d", "#fdba74"]} x2={0} />
        <radialGradient id={`${u}sun`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff7ed" />
          <stop offset=".5" stopColor="#fde68a" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      <circle cx="292" cy="112" r="72" fill={`url(#${u}sun)`} opacity=".9">
        <animate attributeName="r" values="68;78;68" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="292" cy="112" r="26" fill="#fff7ed" />

      {/* clouds (faceted) */}
      <g opacity=".85">
        <polygon points="40,70 70,56 104,62 124,76 96,84 58,84" fill="#fbcfe8" />
        <polygon points="70,56 104,62 96,84 80,70" fill="#fff" opacity=".6" />
        <polygon points="250,40 276,30 306,36 322,48 296,54 262,54" fill="#fde7f3" opacity=".8" />
      </g>

      {/* far range */}
      <polygon points="0,182 52,126 96,160 150,100 206,170 262,136 318,172 370,128 400,152 400,230 0,230" fill="#7c3aed" />
      <polygon points="52,126 96,160 70,182 30,170" fill="#8b5cf6" />
      <polygon points="150,100 206,170 160,176 124,150" fill="#6d28d9" />
      <polygon points="262,136 318,172 280,184 236,166" fill="#8b5cf6" />
      <polygon points="370,128 400,152 400,190 352,170" fill="#6d28d9" />

      {/* main peak, faceted */}
      <polygon points="96,252 200,92 306,252" fill="#9d174d" />
      <polygon points="200,92 306,252 220,252 196,170" fill="#f472b6" />
      <polygon points="200,92 96,252 150,252 196,170" fill="#be185d" />
      <polygon points="200,92 178,128 200,138 224,126" fill="#fff1f2" />
      <polygon points="178,128 200,138 192,152 170,146" fill="#fbcfe8" />
      {/* side hills */}
      <polygon points="0,254 62,196 128,254" fill="#c026d3" />
      <polygon points="62,196 128,254 70,254" fill="#e879f9" />
      <polygon points="270,254 330,200 400,254" fill="#a21caf" />
      <polygon points="330,200 400,254 340,254" fill="#d946ef" />

      {/* water */}
      <rect y="250" width="400" height="50" fill="#1e3a8a" />
      <polygon points="0,250 400,250 400,262 0,262" fill="#2563eb" opacity=".7" />
      {[[30, 266, 80], [140, 274, 110], [270, 268, 90], [330, 284, 60], [60, 288, 70]].map(([x, y, w], i) => (
        <polygon key={i} points={`${x},${y} ${x + w},${y} ${x + w - 10},${y + 5} ${x + 8},${y + 5}`} fill="#93c5fd" opacity=".45" />
      ))}

      {/* tiny low-poly tree + birds */}
      <polygon points="214,250 224,222 234,250" fill="#fde047" />
      <polygon points="224,222 234,250 226,250" fill="#facc15" />
      <g stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".85">
        <path d="M110 70 l8 6 l8 -6">
          <animateTransform attributeName="transform" type="translate" values="0 0;12 -4;0 0" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M138 86 l6 5 l6 -5">
          <animateTransform attributeName="transform" type="translate" values="0 0;-10 -3;0 0" dur="4s" repeatCount="indefinite" />
        </path>
      </g>
      <text x="22" y="30" style={F} fontSize="8" letterSpacing="3" fill="#fff" opacity=".8">LOW-POLY · ENVIRONMENT</text>
    </>
  );
}

/* 9 — Video edit: timeline editor */
function Film({ u }) {
  const wave = Array.from({ length: 58 }).map((_, i) => 4 + Math.abs(Math.sin(i * 0.9) * 8 + Math.cos(i * 2.1) * 5));
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#1e1b4b", "#7c2d12", "#f97316"]} />
        <Grad id={`${u}sky`} c={["#fb923c", "#f472b6", "#6366f1"]} x2={0} />
        <clipPath id={`${u}clip`}>
          <rect x="34" y="50" width="332" height="126" rx="8" />
        </clipPath>
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      <circle cx="360" cy="30" r="110" fill="#fff" opacity=".06" />

      {/* editor window */}
      <rect x="20" y="22" width="360" height="258" rx="14" fill="#0b1020" opacity=".92" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={36 + i * 12} cy="36" r="3.4" fill={["#f87171", "#fbbf24", "#4ade80"][i]} />
      ))}
      <text x="364" y="39" textAnchor="end" style={F} fontSize="7.5" letterSpacing="2" fill="#94a3b8">WANDERLUST_v3.PRPROJ</text>

      {/* preview */}
      <g clipPath={`url(#${u}clip)`}>
        <rect x="34" y="50" width="332" height="126" fill={`url(#${u}sky)`} />
        <circle cx="270" cy="96" r="22" fill="#fff7ed" opacity=".95" />
        <polygon points="34,176 90,104 140,150 190,92 262,176" fill="#312e81" />
        <polygon points="190,92 262,176 214,176 186,128" fill="#4338ca" />
        <polygon points="150,176 232,120 330,176" fill="#1e1b4b" />
        <polygon points="232,120 330,176 262,176" fill="#312e81" />
        <rect x="34" y="150" width="332" height="26" fill="#0f172a" opacity=".5" />
      </g>
      <circle cx="200" cy="113" r="22" fill="#fff" opacity=".22" />
      <circle cx="200" cy="113" r="16" fill="#fff" />
      <polygon points="195,105 195,121 209,113" fill="#be185d" />
      <text x="44" y="68" style={F} fontSize="8" fontWeight="800" letterSpacing="2" fill="#fff">● REC  00:01:24:08</text>

      {/* timeline */}
      <g>
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={40 + i * 13.8} y1="190" x2={40 + i * 13.8} y2={i % 4 === 0 ? 198 : 194} stroke="#64748b" strokeWidth="1" />
        ))}
        <rect x="40" y="202" width="86" height="22" rx="4" fill="#f97316" />
        <rect x="130" y="202" width="62" height="22" rx="4" fill="#ec4899" />
        <rect x="196" y="202" width="104" height="22" rx="4" fill="#8b5cf6" />
        <rect x="304" y="202" width="58" height="22" rx="4" fill="#06b6d4" />
        <rect x="40" y="228" width="322" height="38" rx="4" fill="#0f172a" stroke="#334155" />
        {wave.map((h, i) => (
          <rect key={i} x={44 + i * 5.5} y={247 - h / 2} width="3" height={h} rx="1.5" fill="#34d399" opacity=".9" />
        ))}
        {/* playhead */}
        <g>
          <line x1="0" y1="186" x2="0" y2="268" stroke="#fff" strokeWidth="2" />
          <polygon points="-5,182 5,182 0,190" fill="#fff" />
          <animateTransform attributeName="transform" type="translate" values="60 0;350 0;60 0" dur="9s" repeatCount="indefinite" />
        </g>
      </g>
    </>
  );
}

/* 10 — Vertical reel edit */
function Reel({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#0f172a", "#7e22ce", "#ec4899"]} />
        <Grad id={`${u}scr`} c={["#f59e0b", "#ef4444", "#a21caf"]} />
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      {/* beat rings */}
      {[44, 74, 108].map((r, i) => (
        <circle key={r} cx="200" cy="150" r={r} fill="none" stroke="#f9a8d4" strokeOpacity=".35" strokeWidth="1.5">
          <animate attributeName="r" values={`${r};${r + 18};${r}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values=".45;.05;.45" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* equalizer bars, left and right */}
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <rect x={26 + i * 12} y="190" width="7" height="30" rx="3.5" fill="#fbcfe8" opacity=".85">
            <animate attributeName="height" values={`${12 + (i % 3) * 10};${52 - (i % 4) * 6};${12 + (i % 3) * 10}`} dur={`${0.9 + (i % 4) * 0.25}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${238 - (12 + (i % 3) * 10)};${238 - (52 - (i % 4) * 6)};${238 - (12 + (i % 3) * 10)}`} dur={`${0.9 + (i % 4) * 0.25}s`} repeatCount="indefinite" />
          </rect>
          <rect x={290 + i * 12} y="190" width="7" height="30" rx="3.5" fill="#fde68a" opacity=".85">
            <animate attributeName="height" values={`${40 - (i % 3) * 8};${14 + (i % 4) * 9};${40 - (i % 3) * 8}`} dur={`${1 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${238 - (40 - (i % 3) * 8)};${238 - (14 + (i % 4) * 9)};${238 - (40 - (i % 3) * 8)}`} dur={`${1 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
          </rect>
        </g>
      ))}

      {/* phone */}
      <g className="animate-float-slow">
        <rect x="136" y="16" width="128" height="268" rx="24" fill="#000" opacity=".35" transform="translate(5 8)" />
        <rect x="136" y="16" width="128" height="268" rx="24" fill="#0b0b14" />
        <rect x="142" y="22" width="116" height="256" rx="19" fill={`url(#${u}scr)`} />
        <rect x="178" y="26" width="44" height="9" rx="4.5" fill="#0b0b14" />
        {/* progress */}
        <rect x="150" y="44" width="100" height="3" rx="1.5" fill="#fff" opacity=".35" />
        <rect x="150" y="44" width="46" height="3" rx="1.5" fill="#fff">
          <animate attributeName="width" values="6;100;6" dur="7s" repeatCount="indefinite" />
        </rect>
        {/* subject */}
        <circle cx="200" cy="116" r="30" fill="#fff" opacity=".18" />
        <circle cx="200" cy="108" r="12" fill="#fff" opacity=".9" />
        <path d="M176 148 c0 -22 48 -22 48 0" fill="#fff" opacity=".9" />
        {/* caption */}
        <rect x="156" y="174" width="88" height="22" rx="6" fill="#facc15" />
        <text x="200" y="190" textAnchor="middle" style={F} fontSize="14" fontWeight="900" fill="#111">WAIT FOR</text>
        <text x="200" y="216" textAnchor="middle" style={F} fontSize="26" fontWeight="900" fill="#fff">IT!</text>
        {/* side icons */}
        {[[246, 130], [246, 160], [246, 190]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" fill="#fff" opacity=".9" />
        ))}
        <path d="M246 133 c-5 -4 -7 -8 -3 -9 c2 0 3 1 3 2 c0 -1 1 -2 3 -2 c4 1 2 5 -3 9z" fill="#e11d48" />
        <rect x="150" y="248" width="60" height="5" rx="2.5" fill="#fff" opacity=".85" />
        <rect x="150" y="258" width="38" height="4" rx="2" fill="#fff" opacity=".55" />
      </g>
      <Spark x={92} y={78} s={1.1} />
      <Spark x={330} y={62} s={0.9} />
      <text x="26" y="34" style={F} fontSize="8" letterSpacing="3" fill="#fff" opacity=".8">9:16 · BEAT-SYNCED</text>
    </>
  );
}

/* 11 — Motion: logo reveal */
function Reveal({ u }) {
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#1e1b4b", "#4c1d95", "#be185d"]} />
        <Grad id={`${u}mark`} c={["#fbbf24", "#fb7185", "#a78bfa"]} />
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      <g stroke="#fff" strokeOpacity=".07">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="300" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 50} x2="400" y2={i * 50} />
        ))}
      </g>

      {/* orbits */}
      <g>
        <circle cx="200" cy="140" r="104" fill="none" stroke="#fff" strokeOpacity=".25" strokeDasharray="3 7" />
        <circle cx="200" cy="140" r="74" fill="none" stroke="#f9a8d4" strokeOpacity=".5" strokeWidth="1.5" />
        <g>
          <circle cx="304" cy="140" r="9" fill="#fbbf24" />
          <rect x="196" y="30" width="8" height="8" fill="#67e8f9" />
          <animateTransform attributeName="transform" type="rotate" from="0 200 140" to="360 200 140" dur="14s" repeatCount="indefinite" />
        </g>
        <g>
          <circle cx="126" cy="140" r="6" fill="#fff" />
          <polygon points="200,66 206,76 194,76" fill="#fb7185" />
          <animateTransform attributeName="transform" type="rotate" from="360 200 140" to="0 200 140" dur="9s" repeatCount="indefinite" />
        </g>
      </g>

      {/* mark */}
      <g>
        <g>
          <rect x="164" y="104" width="72" height="72" rx="20" fill={`url(#${u}mark)`} />
          <rect x="164" y="104" width="72" height="72" rx="20" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
          <circle cx="200" cy="140" r="17" fill="none" stroke="#fff" strokeWidth="7" />
          <circle cx="217" cy="122" r="5" fill="#fff" />
          <animateTransform attributeName="transform" type="scale" additive="sum" values="1;1.08;1" dur="3s" repeatCount="indefinite" />
        </g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="3s" repeatCount="indefinite" />
      </g>
      <text x="200" y="224" textAnchor="middle" style={F} fontSize="15" fontWeight="900" letterSpacing="9" fill="#fff">ORBIT</text>

      {/* keyframe timeline */}
      <rect x="40" y="258" width="320" height="2" rx="1" fill="#fff" opacity=".25" />
      {[60, 120, 180, 250, 330].map((x, i) => (
        <rect key={x} x={x - 4} y="254" width="8" height="8" fill="#fbbf24" transform={`rotate(45 ${x} 258)`} opacity={0.5 + i * 0.1} />
      ))}
      <circle cy="258" r="4.5" fill="#fff">
        <animate attributeName="cx" values="40;360;40" dur="6s" repeatCount="indefinite" />
      </circle>
      <text x="24" y="30" style={F} fontSize="8" letterSpacing="3" fill="#fff" opacity=".8">LOGO STING · 00:04</text>
    </>
  );
}

/* 12 — Motion: kinetic typography */
function Kinetic({ u }) {
  const slide = (from, to, dur) => (
    <animate
      attributeName="x"
      values={`${from};${to};${from}`}
      keyTimes="0;.5;1"
      dur={dur}
      repeatCount="indefinite"
      calcMode="spline"
      keySplines=".7 0 .3 1;.7 0 .3 1"
    />
  );
  return (
    <>
      <defs>
        <Grad id={`${u}bg`} c={["#fde047", "#fb7185", "#a855f7"]} />
      </defs>
      <rect width="400" height="300" fill={`url(#${u}bg)`} />
      <circle cx="338" cy="58" r="44" fill="#fff" opacity=".25" />
      <circle cx="60" cy="262" r="62" fill="#111827" opacity=".12" />

      <text x="22" y="108" style={F} fontSize="86" fontWeight="900" letterSpacing="-2" fill="#111827">
        MOVE
        {slide(22, 70, "4s")}
      </text>
      <text x="60" y="186" style={F} fontSize="86" fontWeight="900" letterSpacing="-2" fill="none" stroke="#fff" strokeWidth="2.5">
        FEEL
        {slide(60, 14, "4s")}
      </text>
      <text x="22" y="264" style={F} fontSize="86" fontWeight="900" letterSpacing="-2" fill="#fff">
        FLOW
        {slide(22, 90, "4s")}
      </text>

      <g>
        <polygon points="0,-12 3.5,-3.5 12,0 3.5,3.5 0,12 -3.5,3.5 -12,0 -3.5,-3.5" fill="#fff">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="6s" repeatCount="indefinite" additive="sum" />
        </polygon>
        <animateTransform attributeName="transform" type="translate" values="350 140;350 150;350 140" dur="3s" repeatCount="indefinite" />
      </g>
      <rect x="22" y="18" width="92" height="16" rx="8" fill="#111827" />
      <text x="68" y="29.5" textAnchor="middle" style={F} fontSize="7.5" fontWeight="800" letterSpacing="2" fill="#fff">KINETIC TYPE</text>
    </>
  );
}

const ARTS = {
  coffee: Coffee,
  fitness: Fitness,
  skincare: Skincare,
  poster: Poster,
  studio: Studio,
  juice: Juice,
  box3d: Box3D,
  lowpoly: Lowpoly,
  film: Film,
  reel: Reel,
  reveal: Reveal,
  kinetic: Kinetic,
};

export default function ProjectArt({ art, className = "" }) {
  const u = useId().replace(/:/g, "");
  const Art = ARTS[art] || Coffee;
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`${art} project preview`}
    >
      <Art u={u} />
    </svg>
  );
}
