"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

// msg_9: заголовок "Сообщения" поднят выше, текст в плашках выровнен по центру,
// сообщение менеджера расположено справа, автомобили заменены на Honda StepWGN /
// Toyota Esquire, добавлена иконка MAX рядом с Telegram-иконкой внизу.
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
          <filter id="chat-shadow" x="0" y="0" width="580" height="600" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#c9a86e" floodOpacity="0.15" />
          </filter>
          <filter id="chat-msg-shadow" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#000000" floodOpacity="0.1" />
          </filter>
          <linearGradient id="chat-bg" x1="0" y1="0" x2="580" y2="510" gradientUnits="userSpaceOnUse">
            <stop stopColor="#232b3a" stopOpacity="0.98" />
            <stop offset="1" stopColor="#181f2a" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="chat-manager-bubble" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
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
          fill="url(#chat-bg)"
          stroke="#c9a86e"
          strokeWidth="2.5"
          filter="url(#chat-shadow)"
        />

        {/* Заголовок чата — поднят выше (y=75 вместо 100) */}
        <text
          x="290"
          y="75"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="600"
          opacity="0.95"
        >
          Чат с менеджером
        </text>

        {/* Статус онлайн — тоже поднят */}
        <circle cx="90" cy="110" r="8" fill="#22c55e">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="90" cy="110" r="12" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.3" />
        <text
          x="110"
          y="116"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="18"
          opacity="0.8"
        >
          Менеджер онлайн
        </text>

        {/* Декоративная линия */}
        <line x1="70" y1="135" x2="510" y2="135" stroke="#c9a86e" strokeWidth="1" opacity="0.2" />

        {/* Сообщение клиента — СЛЕВА, текст по центру плашки */}
        <g>
          <path
            d="M 166 175
               L 424 175
               Q 450 175 450 201
               L 450 245
               Q 450 271 424 271
               L 166 271
               Q 140 271 140 245
               L 140 201
               Q 140 175 166 175
               L 140 220
               L 124 220
               L 140 205
               Z"
            fill="#2a3441"
            filter="url(#chat-msg-shadow)"
          />
          <text
            x="160"
            y="212"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="20"
            opacity="0.9"
          >
            <tspan x="160" dy="0">Какую машину</tspan>
            <tspan x="160" dy="26">посоветуете для семьи?</tspan>
          </text>
          {/* Аватар клиента */}
          <circle cx="100" cy="223" r="24" fill="#c9a86e" />
          <text
            x="100"
            y="223"
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

        {/* Сообщение менеджера — СПРАВА (msg_9), c "хвостиком" справа-снизу */}
        <g>
          <path
            d="M 156 295
               L 414 295
               Q 440 295 440 321
               L 440 371
               Q 440 397 414 397
               L 156 397
               Q 130 397 130 371
               L 130 321
               Q 130 295 156 295
               Z
               M 440 340
               L 456 355
               L 440 355
               Z"
            fill="url(#chat-manager-bubble)"
            filter="url(#chat-msg-shadow)"
          />
          <text
            x="150"
            y="331"
            fill="#181f2a"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="19"
            fontWeight="600"
          >
            Рекомендую Honda StepWGN
          </text>
          <text
            x="150"
            y="363"
            fill="#181f2a"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="17"
            opacity="0.85"
          >
            или Toyota Esquire — расскажу
          </text>
          <text
            x="150"
            y="385"
            fill="#181f2a"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="17"
            opacity="0.85"
          >
            детали!
          </text>
          {/* Аватар менеджера — справа */}
          <circle cx="480" cy="346" r="24" fill="#ffffff" />
          <text
            x="480"
            y="346"
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

        {/* Индикатор печати менеджера — тоже справа */}
        <g>
          <path
            d="M 350 415
               L 424 415
               Q 440 415 440 431
               L 440 445
               Q 440 461 424 461
               L 350 461
               Q 334 461 334 445
               L 334 431
               Q 334 415 350 415
               Z"
            fill="#2a3441"
            opacity="0.7"
            filter="url(#chat-msg-shadow)"
          />
          <text
            x="387"
            y="446"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="22"
            opacity="0.85"
            letterSpacing="2"
            fontWeight="500"
          >
            {typingDots}
          </text>
          {/* Аватар справа */}
          <circle cx="480" cy="438" r="20" fill="#ffffff" />
          <text
            x="480"
            y="438"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#c9a86e"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="15"
            fontWeight="600"
          >
            М
          </text>
        </g>

        {/* Иконки MAX + Telegram внизу справа (msg_9: "к круглешку иконку ТГ, добавить иконку МАКС") */}
        <foreignObject x="360" y="475" width="150" height="60">
          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <Image
              src="/icons/max-mark.svg"
              alt="MAX"
              width={54}
              height={54}
              style={{ borderRadius: 16 }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="25" fill="#26A5E4" />
              <path d="M32.934,34.375c0.423-1.298,2.405-14.234,2.65-16.783c0.074-0.772-0.17-1.285-0.648-1.514c-0.578-0.278-1.434-0.139-2.427,0.219c-1.362,0.491-18.774,7.884-19.78,8.312c-0.954,0.405-1.856,0.847-1.856,1.487c0,0.45,0.267,0.703,1.003,0.966c0.766,0.273,2.695,0.858,3.834,1.172c1.097,0.303,2.346,0.04,3.046-0.395c0.742-0.461,9.305-6.191,9.92-6.693c0.614-0.502,1.104,0.141,0.602,0.644c-0.502,0.502-6.38,6.207-7.155,6.997c-0.941,0.959-0.273,1.953,0.358,2.351c0.721,0.454,5.906,3.932,6.687,4.49c0.781,0.558,1.573,0.811,2.298,0.811C32.191,36.439,32.573,35.484,32.934,34.375z" fill="#ffffff" />
            </svg>
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}
