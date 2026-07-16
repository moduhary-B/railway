"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { MessageCircle, X } from "lucide-react"
import { useConsultationModal } from "@/components/consultation-modal"
import { SocialIcon } from "@/components/social-icons"

const socialLinks = [
  {
    label: "ТГ канал",
    detail: "Новости и поставки",
    href: "https://t.me/orientauto_ru",
    color: "#26A5E4",
    icon: <SocialIcon network="telegram" size={23} />,
  },
  {
    label: "Instagram",
    detail: "Автомобили и команда",
    href: "https://www.instagram.com/orientauto.ru?igsh=MTc3c3k0Z2J0ZWRtOA==",
    color: "#d6249f",
    icon: <SocialIcon network="instagram" size={23} />,
  },
  {
    label: "MAX",
    detail: "Канал компании",
    href: "https://max.ru/id253401357515_biz",
    color: "#7357ff",
    icon: <SocialIcon network="max" size={23} />,
  },
  {
    label: "YouTube",
    detail: "Видео и обзоры",
    href: "https://youtube.com/@orientauto_ru?si=5clsE_vZHCv3Iawc",
    color: "#FF0000",
    icon: <SocialIcon network="youtube" size={23} />,
  },
  {
    label: "2ГИС",
    detail: "Карточка компании",
    href: "https://2gis.ru/vladivostok/geo/70000001093566771",
    color: "#19AA1E",
    icon: <Image src="/icons/2gis-mark.png" alt="" width={25} height={25} className="rounded-md" />,
  },
  {
    label: "Яндекс Карты",
    detail: "Отзывы и маршрут",
    href: "https://yandex.ru/maps/org/orient_auto/107743912077/?ll=131.957171%2C43.098351&z=17",
    color: "#FC3F1D",
    icon: <Image src="/icons/yandex.svg" alt="" width={25} height={25} />,
  },
]

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

  if (!mounted) return null

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 md:bottom-8 md:right-8 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {expanded && (
        <div
          className="w-[min(18rem,calc(100vw-2rem))] rounded-2xl bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/30 shadow-2xl backdrop-blur-md p-3.5 sm:p-4 max-h-[calc(100dvh-6.5rem-env(safe-area-inset-bottom))] md:max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-bottom-2 duration-300"
          role="dialog"
          aria-label="Социальные сети Orient Auto"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a86e]/70 font-mono-num">Orient Auto</span>
              <span className="text-white text-base font-medium">Наши соц. сети</span>
            </div>
            <button
              type="button"
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
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] shrink-0">
                <MessageCircle className="w-4 h-4" />
              </span>
              <span className="flex-1 text-left">
                <span className="block text-white text-sm font-medium">Оставить заявку</span>
                <span className="block text-white/50 text-[11px]">Ответим за 15 минут</span>
              </span>
            </button>

            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] transition-all group focus-lux"
                style={{ borderLeftColor: item.color, borderLeftWidth: 2 }}
              >
                <span className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </span>
                <span className="flex-1 text-left">
                  <span className="block text-white text-sm font-medium">{item.label}</span>
                  <span className="block text-white/50 text-[11px]">{item.detail}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {hintVisible && !expanded && (
          <button
            type="button"
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
          onClick={() => setExpanded((value) => !value)}
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] text-[#0e1720] shadow-[0_10px_30px_-8px_rgba(201,168,110,0.6)] hover:shadow-[0_15px_40px_-8px_rgba(201,168,110,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center focus-lux"
        >
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
