"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// Отдельный компонент для /ideal форка — построен на flex/CSS, а не на SVG-path.
// Все аватары одного размера (36 px), плашки вертикально выровнены,
// сообщение менеджера справа, автомобили Honda StepWGN / Toyota Esquire,
// внизу справа два круглых значка MAX + Telegram (msg_9).
export default function ChatIllustrationIdeal() {
  const [dots, setDots] = useState(".")
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."))
    }, 500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full max-w-[460px] mx-auto">
      <div className="relative rounded-[28px] p-6 md:p-7 bg-gradient-to-br from-[#232b3a] to-[#181f2a] border border-[#c9a86e]/25 shadow-lux">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
          <div className="relative">
            <span className="block w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">Чат с менеджером</div>
            <div className="text-white/50 text-xs">Менеджер онлайн · отвечает за минуту</div>
          </div>
        </div>

        {/* Сообщения */}
        <div className="pt-5 space-y-3">
          {/* Клиент — слева */}
          <div className="flex items-end gap-2">
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#c9a86e] flex items-center justify-center text-[#181f2a] font-semibold text-sm">
              К
            </div>
            <div className="max-w-[75%] rounded-2xl rounded-bl-md bg-[#2a3441] px-4 py-3 text-white/90 text-[15px] leading-snug">
              Какую машину посоветуете для семьи?
            </div>
          </div>

          {/* Менеджер — справа, золотой */}
          <div className="flex items-end justify-end gap-2">
            <div className="max-w-[75%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#d4b876] to-[#c9a86e] px-4 py-3 text-[#181f2a] text-[15px] leading-snug font-medium shadow-md">
              Рекомендую{" "}
              <span className="font-semibold whitespace-nowrap">Honda StepWGN</span> или{" "}
              <span className="font-semibold whitespace-nowrap">Toyota Esquire</span> — расскажу детали!
            </div>
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#c9a86e] font-semibold text-sm shadow-sm">
              М
            </div>
          </div>

          {/* Печатает — справа */}
          <div className="flex items-end justify-end gap-2">
            <div className="min-w-[70px] rounded-2xl rounded-br-md bg-[#2a3441] px-4 py-3 text-white/60 text-lg leading-none tracking-[3px] font-mono-num">
              {dots}
            </div>
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#c9a86e] font-semibold text-sm shadow-sm">
              М
            </div>
          </div>
        </div>

        {/* Иконки MAX + Telegram снизу справа — обе кликабельны, идентичные обёртки */}
        <div className="mt-6 pt-4 border-t border-white/[0.05] flex justify-end items-center gap-3">
          <span className="text-white/40 text-xs uppercase tracking-[0.25em] font-mono-num mr-2">
            через
          </span>
          <a
            href="https://max.ru/join/KGMDARU6jZYZPJfs54YSA7tfnt3W8xzc0shptRANxVc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Открыть чат в MAX"
            className="group w-11 h-11 rounded-xl bg-[#0e1720] border border-white/10 flex items-center justify-center shadow-lg overflow-hidden hover:border-[#5E3FE3]/60 transition-colors focus-lux"
          >
            <Image
              src="/icons/max-mark.svg"
              alt=""
              width={44}
              height={44}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          </a>
          <a
            href="https://t.me/orientauto_chat"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Открыть чат в Telegram"
            className="group w-11 h-11 rounded-xl bg-[#26A5E4] border border-white/10 flex items-center justify-center shadow-lg overflow-hidden hover:brightness-110 transition-all focus-lux"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff" className="group-hover:scale-110 transition-transform">
              <path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931L23.86 3.821c.328-1.497-.541-2.082-1.527-1.715L1.126 10.44c-1.463.564-1.445 1.373-.253 1.741l5.516 1.721 12.808-8.062c.603-.398 1.152-.178.7.22z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
