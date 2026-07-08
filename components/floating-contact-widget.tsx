"use client"

import { useEffect, useState } from "react"
import { X, MessageCircle } from "lucide-react"
import { useConsultationModal } from "@/components/consultation-modal"
import { SocialIcon, ORIENT_SOCIALS } from "@/components/social-icons"

// Плавающий виджет обратной связи в правом нижнем углу — msg_11
// (клиент прислал 5 референсов таких значков). Появляется после скролла на 250 px,
// разворачивается по клику: подпись "Задать вопрос" + меню каналов связи.
// Подпись автоматически скрывается через 6 секунд после первого показа,
// чтобы не мешать чтению.
export default function FloatingContactWidget() {
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)
  const consultation = useConsultationModal()

  useEffect(() => {
    setMounted(true)
    const hintTimer = setTimeout(() => setHintVisible(false), 8000)
    return () => clearTimeout(hintTimer)
  }, [])

  // Виджет всегда виден после первичного рендера (msg_11 — клиент хочет
  // чтобы его было видно везде, как в референсах).
  if (!mounted) return null

  return (
    <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3">
      {/* Развёрнутое меню */}
      {expanded && (
        <div
          className="w-64 md:w-72 rounded-2xl bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/30 shadow-2xl backdrop-blur-md p-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          role="dialog"
          aria-label="Способы связи"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a86e]/70 font-mono-num">Связаться</span>
              <span className="text-white text-base font-medium">Выберите канал</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Закрыть"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setExpanded(false)
                consultation.open("floating-widget")
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#c9a86e]/15 to-[#d4b876]/15 border border-[#c9a86e]/40 hover:border-[#c9a86e]/80 hover:from-[#c9a86e]/25 hover:to-[#d4b876]/25 transition-all group focus-lux"
            >
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720]">
                <MessageCircle className="w-4 h-4" />
              </span>
              <div className="flex-1 text-left">
                <div className="text-white text-sm font-medium">Оставить заявку</div>
                <div className="text-white/50 text-[11px]">Ответим за 15 минут</div>
              </div>
            </button>
            {[
              { net: "max" as const, href: ORIENT_SOCIALS.max.href, color: "#5E3FE3" },
              { net: "whatsapp" as const, href: ORIENT_SOCIALS.whatsapp.href, color: "#25D366" },
              { net: "telegram" as const, href: ORIENT_SOCIALS.telegram.href, color: "#26A5E4" },
            ].map((c) => (
              <a
                key={c.net}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all group focus-lux"
                style={{ borderLeftColor: c.color, borderLeftWidth: 2 }}
              >
                <span className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center">
                  <SocialIcon network={c.net} size={20} />
                </span>
                <div className="flex-1 text-left">
                  <div className="text-white text-sm font-medium">{ORIENT_SOCIALS[c.net].label}</div>
                  <div className="text-white/50 text-[11px]">Написать в мессенджер</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка + текстовая подсказка */}
      <div className="flex items-center gap-3">
        {hintVisible && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="hidden sm:inline-flex bg-[#1a2332]/90 backdrop-blur-md border border-[#c9a86e]/30 text-white text-sm px-4 py-2 rounded-full shadow-lg hover:border-[#c9a86e]/60 transition-colors animate-in fade-in slide-in-from-right-2 duration-500"
          >
            Задать вопрос
          </button>
        )}
        <button
          type="button"
          aria-label={expanded ? "Свернуть виджет связи" : "Открыть виджет связи"}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] text-[#0e1720] shadow-[0_10px_30px_-8px_rgba(201,168,110,0.6)] hover:shadow-[0_15px_40px_-8px_rgba(201,168,110,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center focus-lux"
        >
          {/* Пульсирующее свечение когда свёрнут */}
          {!expanded && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#c9a86e]/40 animate-ping opacity-50" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0a0f1a] shadow-lg" />
            </>
          )}
          {expanded ? <X className="w-6 h-6 relative z-10" /> : <MessageCircle className="w-6 h-6 md:w-7 md:h-7 relative z-10" />}
        </button>
      </div>
    </div>
  )
}
