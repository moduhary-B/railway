// Национальные паттерны для карточек каталога (msg_7:
// "придумать какой фон можно использовать для шапок, чтобы он
// ассоциировался со страной"). Все SVG собственные, но простые
// геометрические — не рисование иконок брендов.

interface Props {
  kind: "sakura" | "lanterns" | "meander"
  color: string
}

export default function CountryPattern({ kind, color }: Props) {
  if (kind === "sakura") {
    // Япония — тонкие абстрактные лепестки сакуры
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <g fill={color}>
          {[
            [40, 30], [110, 20], [190, 50], [260, 30],
            [70, 100], [160, 120], [230, 90],
            [30, 160], [130, 170], [220, 170],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx} ${cy}) rotate(${i * 33})`}>
              {[0, 72, 144, 216, 288].map((rot) => (
                <ellipse
                  key={rot}
                  cx="0"
                  cy="-8"
                  rx="4"
                  ry="8"
                  transform={`rotate(${rot})`}
                />
              ))}
              <circle r="2.5" fill={color} opacity="0.6" />
            </g>
          ))}
        </g>
      </svg>
    )
  }

  if (kind === "lanterns") {
    // Китай — стилизованные круги-фонарики с косыми линиями (шёлк)
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.13] pointer-events-none"
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern id="china-lines" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <line x1="0" y1="14" x2="14" y2="0" stroke={color} strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="300" height="200" fill="url(#china-lines)" />
        {[
          [40, 40, 22], [110, 25, 15], [200, 55, 26],
          [270, 30, 12], [70, 130, 18], [180, 145, 24], [260, 130, 14],
        ].map(([cx, cy, r], i) => (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <circle r={r} fill="none" stroke={color} strokeWidth="1.2" opacity="0.9" />
            <circle r={r * 0.55} fill={color} opacity="0.25" />
            <line x1="0" y1={-r - 8} x2="0" y2={-r} stroke={color} strokeWidth="0.8" opacity="0.6" />
          </g>
        ))}
      </svg>
    )
  }

  // Корея — меандр / прямоугольные геометрические линии
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.14] pointer-events-none"
      viewBox="0 0 300 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id="korea-meander" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M0 15 L10 15 L10 5 L20 5 L20 20 L5 20 L5 25 L25 25 L25 10 L15 10"
            fill="none"
            stroke={color}
            strokeWidth="1.1"
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="300" height="200" fill="url(#korea-meander)" />
      {/* Крупный трёхточечный акцент — намёк на трёхмерный узор корейского декора */}
      <g fill={color} opacity="0.35">
        <circle cx="240" cy="40" r="6" />
        <circle cx="255" cy="55" r="4" />
        <circle cx="225" cy="55" r="4" />
      </g>
    </svg>
  )
}
