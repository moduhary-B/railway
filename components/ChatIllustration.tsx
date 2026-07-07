"use client"

import { useState, useEffect } from "react"

export default function ChatIllustration() {
  const [typingDots, setTypingDots] = useState("...")

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingDots((prev) => {
        if (prev === "...") return "."
        if (prev === ".") return ".."
        return "..."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center w-full min-h-[560px] max-w-2xl">
      <svg
        width="580"
        height="600"
        viewBox="0 0 580 510"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          <filter id="shadow2" x="0" y="0" width="580" height="600" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#c9a86e" floodOpacity="0.15" />
          </filter>
          <filter id="messageShadow" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#000000" floodOpacity="0.1" />
          </filter>
          <linearGradient id="chatBg" x1="0" y1="0" x2="580" y2="510" gradientUnits="userSpaceOnUse">
            <stop stopColor="#232b3a" stopOpacity="0.98" />
            <stop offset="1" stopColor="#181f2a" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="managerBubble" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop stopColor="#d4af7a" />
            <stop offset="1" stopColor="#c9a86e" />
          </linearGradient>
        </defs>

        {/* Основной фон чата */}
        <rect
          x="50"
          y="30"
          width="480"
          height="470"
          rx="36"
          fill="url(#chatBg)"
          stroke="#c9a86e"
          strokeWidth="2.5"
          filter="url(#shadow2)"
        />

        {/* Заголовок чата */}
        <text
          x="290"
          y="100"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="600"
          opacity="0.95"
        >
          Чат с менеджером
        </text>

        {/* Статус онлайн */}
        <circle cx="90" cy="140" r="8" fill="#22c55e">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="90" cy="140" r="12" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.3" />
        <text
          x="110"
          y="146"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="18"
          opacity="0.8"
        >
          Менеджер онлайн
        </text>

        {/* Декоративная линия с отступом */}
        <line x1="70" y1="165" x2="510" y2="165" stroke="#c9a86e" strokeWidth="1" opacity="0.2" />

        {/* Сообщение клиента */}
        <g>
          {/* Форма сообщения клиента - 3 скругленных угла + 1 заостренный */}
          <path
            d="M 166 225 
               L 454 225 
               Q 480 225 480 251 
               L 480 279 
               Q 480 305 454 305 
               L 166 305 
               Q 140 305 140 279 
               L 140 251 
               Q 140 225 166 225 
               L 140 265 
               L 124 265 
               L 140 251 
               Z"
            fill="#2a3441"
            filter="url(#messageShadow)"
          />

          <text
            x="160"
            y="250"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="20"
            opacity="0.9"
          >
            <tspan x="160" dy="0">
              Какую машину
            </tspan>
            <tspan x="160" dy="24">
              посоветуете для семьи?
            </tspan>
          </text>

          {/* Аватар клиента с увеличенным отступом */}
          <circle cx="100" cy="265" r="24" fill="#c9a86e" />
          <text
            x="100"
            y="265"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#181f2a"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="18"
            fontWeight="600"
          >
            К
          </text>
        </g>

        {/* Сообщение менеджера */}
        <g>
          {/* Форма сообщения менеджера - 3 скругленных угла + 1 заостренный */}
          <path
            d="M 166 335 
               L 474 335 
               Q 500 335 500 361 
               L 500 399 
               Q 500 425 474 425 
               L 166 425 
               Q 140 425 140 399 
               L 140 361 
               Q 140 335 166 335 
               L 140 380 
               L 124 380 
               L 140 361 
               Z"
            fill="url(#managerBubble)"
            filter="url(#messageShadow)"
          />

          <text
            x="160"
            y="365"
            fill="#181f2a"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="20"
            fontWeight="600"
          >
            Рекомендую Toyota Alphard
          </text>
          <text
            x="160"
            y="395"
            fill="#181f2a"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="17"
            opacity="0.8"
          >
            или Honda Odyssey — расскажу детали!
          </text>

          {/* Аватар менеджера с увеличенным отступом */}
          <circle cx="100" cy="380" r="24" fill="#ffffff" />
          <text
            x="100"
            y="380"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#c9a86e"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="18"
            fontWeight="600"
          >
            М
          </text>
        </g>

        {/* Индикатор печати */}
        <g>
          {/* Форма индикатора печати - 3 скругленных угла + 1 заостренный */}
          <path
            d="M 166 435 
               L 240 435 
               Q 266 435 266 451 
               L 266 451 
               Q 266 467 240 467 
               L 166 467 
               Q 140 467 140 451 
               L 140 451 
               Q 140 435 166 435 
               L 140 451 
               L 124 451 
               L 140 451 
               Z"
            fill="#2a3441"
            opacity="0.7"
            filter="url(#messageShadow)"
          />

          <text
            x="203"
            y="453"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="20"
            opacity="0.8"
            letterSpacing="2"
            fontWeight="500"
          >
            {typingDots}
          </text>

          {/* Аватар для индикатора печати с увеличенным отступом */}
          <circle cx="100" cy="451" r="24" fill="#ffffff" />
          <text
            x="100"
            y="451"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#c9a86e"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="18"
            fontWeight="600"
          >
            М
          </text>
        </g>

        {/* Кнопка Telegram — теперь иконка ниже и поверх нижней границы блока */}
        <g>
          <foreignObject x="400" y="470" width="100" height="60">
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'100%'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="25" fill="#c9a86e"/>
                <path d="M32.934,34.375c0.423-1.298,2.405-14.234,2.65-16.783c0.074-0.772-0.17-1.285-0.648-1.514c-0.578-0.278-1.434-0.139-2.427,0.219c-1.362,0.491-18.774,7.884-19.78,8.312c-0.954,0.405-1.856,0.847-1.856,1.487c0,0.45,0.267,0.703,1.003,0.966c0.766,0.273,2.695,0.858,3.834,1.172c1.097,0.303,2.346,0.04,3.046-0.395c0.742-0.461,9.305-6.191,9.92-6.693c0.614-0.502,1.104,0.141,0.602,0.644c-0.502,0.502-6.38,6.207-7.155,6.997c-0.941,0.959-0.273,1.953,0.358,2.351c0.721,0.454,5.906,3.932,6.687,4.49c0.781,0.558,1.573,0.811,2.298,0.811C32.191,36.439,32.573,35.484,32.934,34.375z" fill="#181f2a"/>
              </svg>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  )
}
