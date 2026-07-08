// Национальные паттерны для карточек каталога (msg_7:
// "придумать какой фон можно использовать для шапок, чтобы он
// ассоциировался со страной"). Узнаваемые силуэты + повторяющийся
// геометрический паттерн, не абстракция.

interface Props {
  kind: "sakura" | "lanterns" | "meander"
  color: string
}

export default function CountryPattern({ kind, color }: Props) {
  if (kind === "sakura") {
    // Япония — гора Фудзи как большой силуэт + тории (ворота) в углу +
    // мелкий паттерн волн Хокусая (сэйгайха)
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          {/* Волны сэйгайха — традиционный японский паттерн */}
          <pattern id="jp-waves" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M0 10 A10 10 0 0 1 20 10"
              fill="none"
              stroke={color}
              strokeWidth="0.6"
              opacity="0.6"
            />
          </pattern>
        </defs>
        {/* Фон волн внизу */}
        <rect x="0" y="140" width="300" height="60" fill="url(#jp-waves)" />

        {/* Гора Фудзи — крупный симметричный силуэт справа */}
        <g opacity="0.9">
          <path
            d="M 130 140 L 200 55 L 210 55 L 220 40 L 235 55 L 245 55 L 315 140 Z"
            fill={color}
            opacity="0.45"
          />
          {/* Снежная шапка */}
          <path
            d="M 180 90 L 200 55 L 210 55 L 220 40 L 235 55 L 245 55 L 265 90 L 240 82 L 220 90 L 200 82 Z"
            fill="#ffffff"
            opacity="0.25"
          />
        </g>

        {/* Тории (красные ворота) в левом верхнем углу */}
        <g transform="translate(30 30)" opacity="0.7">
          <rect x="0" y="0" width="60" height="4" fill={color} />
          <rect x="-4" y="4" width="68" height="3" fill={color} />
          <rect x="8" y="7" width="4" height="42" fill={color} />
          <rect x="48" y="7" width="4" height="42" fill={color} />
          <rect x="8" y="18" width="44" height="3" fill={color} />
        </g>

        {/* Иероглиф 日 (солнце/Япония) стилизованный, декоративный */}
        <g transform="translate(240 155)" opacity="0.5">
          <circle cx="0" cy="0" r="8" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill={color} />
        </g>
      </svg>
    )
  }

  if (kind === "lanterns") {
    // Китай — силуэт пагоды + фонарики + мелкий паттерн облаков
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          {/* Китайский облачный паттерн */}
          <pattern id="cn-clouds" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M8 20 Q4 20 4 16 Q4 12 8 12 Q8 8 12 8 Q16 8 16 12 Q20 12 20 16 Q20 20 16 20 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="300" height="200" fill="url(#cn-clouds)" />

        {/* Силуэт пагоды справа */}
        <g transform="translate(200 40)" opacity="0.55">
          {/* Крыши пагоды — 4 яруса */}
          {[0, 30, 55, 78].map((y, i) => {
            const w = 46 - i * 6
            return (
              <g key={i} transform={`translate(0 ${y})`}>
                {/* Загнутая крыша */}
                <path
                  d={`M ${-w} 0 Q ${-w - 4} -6 ${-w + 3} -8 L ${w - 3} -8 Q ${w + 4} -6 ${w} 0 Z`}
                  fill={color}
                />
                {/* Тело яруса */}
                <rect x={-w + 8} y="0" width={(w - 8) * 2} height="12" fill={color} opacity="0.6" />
              </g>
            )
          })}
          {/* Шпиль сверху */}
          <line x1="0" y1="-18" x2="0" y2="-6" stroke={color} strokeWidth="1.5" />
          <circle cx="0" cy="-20" r="2.5" fill={color} />
        </g>

        {/* Красные фонарики висят слева */}
        <g opacity="0.75">
          {[
            [40, 40, 14],
            [90, 30, 10],
            [50, 90, 12],
          ].map(([cx, cy, r], i) => (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              {/* Верёвочка */}
              <line x1="0" y1={-r - 12} x2="0" y2={-r - 2} stroke={color} strokeWidth="0.7" />
              {/* Верхняя крышечка */}
              <rect x={-r * 0.5} y={-r - 2} width={r} height="2" fill={color} />
              {/* Тело фонарика */}
              <ellipse cx="0" cy="0" rx={r * 0.9} ry={r} fill={color} opacity="0.85" />
              {/* Вертикальные полоски */}
              <line x1={-r * 0.4} y1={-r * 0.9} x2={-r * 0.4} y2={r * 0.9} stroke="#0e1720" strokeWidth="0.6" opacity="0.5" />
              <line x1="0" y1={-r} x2="0" y2={r} stroke="#0e1720" strokeWidth="0.7" opacity="0.5" />
              <line x1={r * 0.4} y1={-r * 0.9} x2={r * 0.4} y2={r * 0.9} stroke="#0e1720" strokeWidth="0.6" opacity="0.5" />
              {/* Кисточка снизу */}
              <line x1="0" y1={r + 1} x2="0" y2={r + 6} stroke={color} strokeWidth="0.7" />
            </g>
          ))}
        </g>
      </svg>
    )
  }

  // Корея — силуэт традиционного дворца/ханок + меандр + трёхточка
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
      viewBox="0 0 300 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {/* Меандр корейский */}
        <pattern id="kr-meander" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M0 12 L8 12 L8 4 L16 4 L16 16 L4 16 L4 20 L20 20 L20 8 L12 8"
            fill="none"
            stroke={color}
            strokeWidth="0.7"
            strokeLinecap="square"
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="300" height="200" fill="url(#kr-meander)" />

      {/* Силуэт ханок (традиционный корейский дом) с загнутой крышей */}
      <g transform="translate(200 100)" opacity="0.6">
        {/* Крыша с загнутыми краями */}
        <path
          d="M -60 0 Q -70 -6 -60 -10 L -20 -30 L 20 -30 L 60 -10 Q 70 -6 60 0 Z"
          fill={color}
        />
        {/* Гребень */}
        <rect x="-58" y="-2" width="116" height="3" fill={color} opacity="0.7" />
        {/* Опоры */}
        <rect x="-45" y="0" width="3" height="28" fill={color} opacity="0.85" />
        <rect x="0" y="0" width="3" height="28" fill={color} opacity="0.85" />
        <rect x="42" y="0" width="3" height="28" fill={color} opacity="0.85" />
        {/* Пол/фундамент */}
        <rect x="-55" y="28" width="110" height="4" fill={color} opacity="0.7" />
      </g>

      {/* Тэгык (тхэгык) — символ инь-ян из корейского флага, упрощённый */}
      <g transform="translate(50 45)" opacity="0.65">
        <circle r="14" fill="none" stroke={color} strokeWidth="1.2" />
        <path
          d={`M 0 -14 A 14 14 0 0 1 0 14 A 7 7 0 0 1 0 0 A 7 7 0 0 0 0 -14 Z`}
          fill={color}
          opacity="0.55"
        />
      </g>
    </svg>
  )
}
