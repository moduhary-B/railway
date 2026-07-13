interface Props {
  kind: "sakura" | "lanterns" | "meander"
  color: string
}

export default function CountryPattern({ kind, color }: Props) {
  if (kind === "sakura") {
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.44] pointer-events-none"
        viewBox="0 0 480 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern id="jp-seigaiha" width="32" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 16 A16 16 0 0 1 32 16" fill="none" stroke={color} strokeWidth="1" opacity="0.55" />
            <path d="M8 16 A8 8 0 0 1 24 16" fill="none" stroke={color} strokeWidth="0.8" opacity="0.35" />
          </pattern>
        </defs>

        <circle cx="358" cy="69" r="53" fill="#bc002d" opacity="0.62" />
        <circle cx="358" cy="69" r="61" fill="none" stroke={color} strokeWidth="1" opacity="0.13" />

        <g transform="translate(303 25) scale(0.95)" fill="none" stroke={color} strokeLinecap="square">
          <path d="M0 7 Q58 18 116 7" strokeWidth="7" opacity="0.88" />
          <path d="M7 20 Q58 25 109 20" strokeWidth="4" opacity="0.78" />
          <path d="M22 22 V115 M94 22 V115" strokeWidth="6" opacity="0.84" />
          <path d="M21 46 H95" strokeWidth="4" opacity="0.7" />
          <path d="M16 115 H29 M87 115 H101" strokeWidth="5" opacity="0.65" />
        </g>

        <rect x="0" y="137" width="480" height="63" fill="url(#jp-seigaiha)" opacity="0.8" />
        <path d="M0 171 Q80 152 160 171 T320 171 T480 171" fill="none" stroke={color} strokeWidth="1.2" opacity="0.22" />
      </svg>
    )
  }

  if (kind === "lanterns") {
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.42] pointer-events-none"
        viewBox="0 0 480 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern id="cn-lattice" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M17 0 L34 17 L17 34 L0 17 Z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.2" />
            <circle cx="17" cy="17" r="3" fill="none" stroke={color} strokeWidth="0.7" opacity="0.25" />
          </pattern>
          <linearGradient id="cn-disc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.26" />
            <stop offset="1" stopColor={color} stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <rect x="235" width="245" height="200" fill="url(#cn-lattice)" />
        <circle cx="350" cy="87" r="69" fill="url(#cn-disc)" />
        <circle cx="350" cy="87" r="55" fill="none" stroke={color} strokeWidth="1" opacity="0.22" />

        <g transform="translate(350 29)" fill={color}>
          <path d="M-64 27 Q-73 20 -59 15 Q-24 21 0 0 Q24 21 59 15 Q73 20 64 27 Z" opacity="0.7" />
          <rect x="-43" y="27" width="86" height="12" rx="2" opacity="0.42" />
          <path d="M-54 61 Q-62 55 -50 50 Q-20 55 0 38 Q20 55 50 50 Q62 55 54 61 Z" opacity="0.65" />
          <rect x="-35" y="61" width="70" height="12" rx="2" opacity="0.4" />
          <path d="M-43 92 Q-50 87 -39 82 Q-16 86 0 72 Q16 86 39 82 Q50 87 43 92 Z" opacity="0.6" />
          <rect x="-27" y="92" width="54" height="15" rx="2" opacity="0.38" />
          <rect x="-4" y="-10" width="8" height="12" opacity="0.6" />
          <path d="M-34 107 H34 L25 125 H-25 Z" opacity="0.36" />
        </g>

        <g transform="translate(272 28)" stroke={color} fill="none">
          <path d="M0 -28 V-13" strokeWidth="1.2" opacity="0.7" />
          <rect x="-12" y="-13" width="24" height="3" fill={color} stroke="none" opacity="0.7" />
          <path d="M-17 -8 Q0 -19 17 -8 V17 Q0 29 -17 17 Z" fill={color} stroke="none" opacity="0.55" />
          <path d="M-8 -6 V18 M0 -9 V22 M8 -6 V18" stroke="#0e1720" strokeWidth="1" opacity="0.5" />
          <path d="M0 24 V34 M-4 34 L0 39 L4 34" strokeWidth="1" opacity="0.7" />
        </g>

        <g fill="none" stroke={color} strokeWidth="1.1" opacity="0.5">
          <path d="M235 143 H278 Q288 143 288 133 Q288 124 299 124 H324" />
          <path d="M260 161 H302 Q312 161 312 151 H346" />
          <path d="M401 151 H438 Q449 151 449 140 H480" />
        </g>
      </svg>
    )
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.48] pointer-events-none"
      viewBox="0 0 480 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id="kr-changho" width="36" height="36" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="34" height="34" fill="none" stroke={color} strokeWidth="0.7" opacity="0.17" />
          <path d="M18 1 V35 M1 18 H35 M7 7 L29 29 M29 7 L7 29" fill="none" stroke={color} strokeWidth="0.55" opacity="0.2" />
        </pattern>
        <radialGradient id="kr-halo">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="245" width="235" height="200" fill="url(#kr-changho)" />
      <circle cx="360" cy="92" r="82" fill="url(#kr-halo)" />

      <g transform="translate(360 88)" opacity="0.72">
        <circle r="49" fill="#f4f5f7" opacity="0.08" />
        <path d="M0 -45 A45 45 0 0 1 0 45 A22.5 22.5 0 0 1 0 0 A22.5 22.5 0 0 0 0 -45 Z" fill="#cd2e3a" opacity="0.82" />
        <path d="M0 45 A45 45 0 0 1 0 -45 A22.5 22.5 0 0 1 0 0 A22.5 22.5 0 0 0 0 45 Z" fill={color} opacity="0.9" />
        <circle r="45" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.22" />
      </g>

      {/* Четыре триграммы флага Республики Корея, симметрично вокруг тхэгыка. */}
      <g transform="translate(305 35) rotate(-30)" stroke="#eef1f5" strokeWidth="3.5" opacity="0.4">
        <line x1="-13" y1="-8" x2="13" y2="-8" />
        <line x1="-13" y1="0" x2="13" y2="0" />
        <line x1="-13" y1="8" x2="13" y2="8" />
      </g>
      <g transform="translate(415 35) rotate(30)" stroke="#eef1f5" strokeWidth="3.5" opacity="0.38">
        <line x1="-13" y1="-8" x2="-2" y2="-8" /><line x1="2" y1="-8" x2="13" y2="-8" />
        <line x1="-13" y1="0" x2="13" y2="0" />
        <line x1="-13" y1="8" x2="-2" y2="8" /><line x1="2" y1="8" x2="13" y2="8" />
      </g>
      <g transform="translate(305 137) rotate(30)" stroke="#eef1f5" strokeWidth="3.5" opacity="0.36">
        <line x1="-13" y1="-8" x2="13" y2="-8" />
        <line x1="-13" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="13" y2="0" />
        <line x1="-13" y1="8" x2="13" y2="8" />
      </g>
      <g transform="translate(415 137) rotate(-30)" stroke="#eef1f5" strokeWidth="3.5" opacity="0.34">
        <line x1="-13" y1="-8" x2="-2" y2="-8" /><line x1="2" y1="-8" x2="13" y2="-8" />
        <line x1="-13" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="13" y2="0" />
        <line x1="-13" y1="8" x2="-2" y2="8" /><line x1="2" y1="8" x2="13" y2="8" />
      </g>

      <path
        d="M238 171 Q252 158 278 160 Q315 135 351 150 Q382 131 415 149 Q446 142 480 158 V200 H238 Z"
        fill={color}
        opacity="0.13"
      />
      <path d="M248 171 Q285 149 321 161 Q360 143 397 159 Q438 146 480 161" fill="none" stroke={color} strokeWidth="1.3" opacity="0.4" />
    </svg>
  )
}
