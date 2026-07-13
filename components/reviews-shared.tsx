"use client"

// ============================================================
// reviews-shared — общие типы, мок-данные и переиспользуемые
// хелперы для трёх вариантов блока отзывов в /ideal-two.
// Вынесено отдельно, чтобы варианты не дублировали код и мок-данные.
// (В /ideal эти же данные сидят внутри reviews-widget.tsx.)
// ============================================================

import Image from "next/image"
import { SiYoutube } from "react-icons/si"
import { Star, ChevronRight, X, Play } from "lucide-react"
import { useEffect, useState } from "react"

export type ReviewSource = "2gis" | "yandex" | "youtube"

export interface Review {
  id: string
  source: ReviewSource
  author: string
  car?: string
  rating: number // 1-5
  date: string // ISO
  /** Только для type=text */
  text?: string
  /** Для type=video — URL видео (MOV/MP4) */
  videoUrl?: string
  /** Превью для видео-отзыва */
  poster?: string
  type: "text" | "video"
}

// Мок-данные — те же, что и в reviews-widget.tsx (заменяются /api/reviews).
export const MOCK_REVIEWS: Review[] = [
  {
    id: "m2",
    source: "youtube",
    author: "Юлия из Приморского края",
    car: "Lexus NX",
    rating: 5,
    date: "2026-05-15",
    type: "video",
    videoUrl: "/v-rev/o1.MOV",
    poster: "/v-rev/previews/prew1.PNG",
  },
  {
    id: "m1",
    source: "yandex",
    author: "Ксения Мирясова",
    car: "Toyota Alphard",
    rating: 5,
    date: "2026-05-28",
    type: "text",
    text: "Большое спасибо за помощь с подбором и покупкой нашей машины! Учли все наши пожелания и помогли выбрать хороший вариант. Всё прозрачно, честно и быстро. Менеджер был на связи на каждом этапе, объяснял все нюансы по растаможке и доставке. Рекомендую всем, кто хочет пригнать авто без головной боли.",
  },
  {
    id: "m3",
    source: "2gis",
    author: "Наталья Сапрыга",
    car: "Honda Freed",
    rating: 5,
    date: "2026-04-29",
    type: "text",
    text: "Огромное спасибо команде Orient Auto. Обратились по рекомендации к Алихану — внимательнейший человек. Грамотно и по делу, всё сделали как обещали, машина пришла в идеальном состоянии.",
  },
  {
    id: "m5",
    source: "youtube",
    author: "Алексей из Екатеринбурга",
    car: "Nissan Note",
    rating: 5,
    date: "2026-03-30",
    type: "video",
    videoUrl: "/v-rev/o2.MOV",
    poster: "/v-rev/previews/prew2.PNG",
  },
  {
    id: "m4",
    source: "2gis",
    author: "Дмитрий Ковалёв",
    car: "Honda Vezel",
    rating: 5,
    date: "2026-04-12",
    type: "text",
    text: "Заказывал через ребят Honda Vezel. Прислали кучу вариантов на выбор с аукциона, всё разжевали. Спокойно, без давления, без спешки. Отдельное спасибо за помощь с постановкой на учёт.",
  },
  {
    id: "m6",
    source: "yandex",
    author: "Рузиль Хабибуллин",
    car: "Hyundai Santa Fe TM",
    rating: 5,
    date: "2026-03-18",
    type: "text",
    text: "Взял Hyundai Santa Fe. Всё прошло гладко: подбор, торги, доставка. Даже мелкие моменты по СБКТС решили за меня — спасибо!",
  },
  {
    id: "m9",
    source: "youtube",
    author: "Семья Титовых",
    car: "Toyota Voxy",
    rating: 5,
    date: "2026-03-05",
    type: "video",
    videoUrl: "/v-rev/o3.MOV",
    poster: "/v-rev/previews/prew3.PNG",
  },
  {
    id: "m7",
    source: "2gis",
    author: "Игорь Прохоров",
    car: "Kia Mohave",
    rating: 5,
    date: "2026-02-24",
    type: "text",
    text: "Второй раз обращаюсь. В прошлый раз брал у них жене, сейчас взял себе. Знают своё дело, есть уверенность что не подведут. Всё чётко по срокам.",
  },
  {
    id: "m8",
    source: "yandex",
    author: "Эдуард Скворцов",
    car: "Volkswagen Golf Alltrack",
    rating: 5,
    date: "2026-02-08",
    type: "text",
    text: "Хороший сервис. Пригнали Golf в Екатеринбург, всё как договаривались. Спасибо Кириллу за работу и терпение, отвечал на вопросы даже поздно вечером.",
  },
  {
    id: "m10",
    source: "2gis",
    author: "Александр Панов",
    car: "Toyota Harrier",
    rating: 5,
    date: "2026-01-21",
    type: "text",
    text: "Обратился по совету друзей и не пожалел. Машину нашли быстро, присылали отчёты с каждого этапа и заранее объяснили все платежи. Toyota пришла именно в том состоянии, которое было указано в аукционном листе. Команде Orient Auto спасибо за спокойную и понятную работу.",
  },
  {
    id: "m11",
    source: "yandex",
    author: "Ольга Чернова",
    car: "Mazda CX-5",
    rating: 5,
    date: "2026-01-09",
    type: "text",
    text: "Первый раз заказывала автомобиль из Японии и переживала за весь процесс. Менеджер всегда был на связи, подробно отвечал на вопросы и присылал фото. Машиной очень довольна.",
  },
  {
    id: "m12",
    source: "2gis",
    author: "Сергей Лапин",
    car: "Kia Sportage",
    rating: 5,
    date: "2025-12-18",
    type: "text",
    text: "Всё по договору и без неожиданных доплат. Автомобиль доставили в оговорённый срок, документы подготовили заранее. Рекомендую.",
  },
  {
    id: "m13",
    source: "yandex",
    author: "Марина Волкова",
    car: "Toyota Raize",
    rating: 5,
    date: "2025-12-03",
    type: "text",
    text: "Спасибо команде за отличный автомобиль. Все этапы были понятными, менеджер регулярно присылал отчёты и всегда оставался на связи.",
  },
  {
    id: "m14",
    source: "2gis",
    author: "Андрей Серов",
    car: "Honda Stepwgn",
    rating: 5,
    date: "2025-11-19",
    type: "text",
    text: "Выбирали семейный автомобиль и остановились на Honda Stepwgn. Ребята помогли разобраться в комплектациях, подобрали хороший вариант и организовали доставку до нашего города. Результатом довольны.",
  },
  {
    id: "m15",
    source: "yandex",
    author: "Владимир Ким",
    car: "Subaru Forester",
    rating: 5,
    date: "2025-11-02",
    type: "text",
    text: "Машина пришла без сюрпризов, полностью соответствует аукционному листу. Отдельно отмечу прозрачный расчёт и постоянную связь с менеджером.",
  },
]

export const SOURCE_META: Record<ReviewSource, { label: string; color: string }> = {
  "2gis": { label: "2ГИС", color: "#19aa1e" },
  yandex: { label: "Яндекс", color: "#fc3f1d" },
  youtube: { label: "YouTube", color: "#ff0000" },
}

/** Аватар-лого источника — официальные бренд-иконки. */
export function SourceLogo({ source, size = 44 }: { source: ReviewSource; size?: number }) {
  const box = { width: size, height: size }
  if (source === "yandex") {
    return (
      <span className="relative block rounded-full overflow-hidden shrink-0 shadow-[0_0_14px_rgba(252,63,29,0.35)]" style={box}>
        <Image
          src="/icons/yandex.svg"
          alt="Яндекс"
          width={size}
          height={size}
          loading="eager"
          unoptimized
          style={box}
        />
      </span>
    )
  }
  if (source === "2gis") {
    return (
      <span
        className="block rounded-[26%] overflow-hidden shrink-0 shadow-[0_0_14px_rgba(25,170,30,0.35)]"
        style={box}
      >
        <Image
          src="/icons/2gis-mark.png"
          alt="2ГИС"
          width={size}
          height={size}
          loading="eager"
          unoptimized
          className="object-cover"
          style={box}
        />
      </span>
    )
  }
  return (
    <span
      className="flex items-center justify-center rounded-full bg-white shrink-0 shadow-[0_0_14px_rgba(255,0,0,0.3)]"
      style={box}
    >
      <SiYoutube size={size * 0.62} color="#ff0000" />
    </span>
  )
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={"flex gap-0.5 " + className}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={"w-4 h-4 " + (s <= rating ? "text-yellow-400 fill-current" : "text-white/15")}
        />
      ))}
    </div>
  )
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
  } catch {
    return iso
  }
}

/** Инициалы из имени для аватарки-плейсхолдера (вариант 1, editorial). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + (parts[1][0] ?? "")).toUpperCase()
}

/** Хук загрузки данных из API — опциональный, мок по умолчанию. */
export function useReviews(apiUrl?: string) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [aggregate, setAggregate] = useState({ rating: 4.9, count: 143 })

  useEffect(() => {
    if (!apiUrl) return
    let cancelled = false
    fetch(apiUrl)
      .then((r) => r.json())
      .then((data: { rating: number; count: number; reviews: Review[] }) => {
        if (cancelled) return
        if (Array.isArray(data?.reviews) && data.reviews.length) {
          setReviews(data.reviews)
          setAggregate({ rating: data.rating ?? 4.9, count: data.count ?? data.reviews.length })
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [apiUrl])

  return { reviews, aggregate }
}

/** Универсальная модалка: видео ИЛИ полный текст. Общая для всех вариантов. */
export function ReviewModal({ r, onClose }: { r: Review; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className={"relative w-full " + (r.type === "video" ? "max-w-md" : "max-w-lg")}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute -top-11 right-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {r.type === "video" && r.videoUrl ? (
          <>
            <video
              src={r.videoUrl}
              controls
              autoPlay
              className="w-full rounded-2xl bg-black aspect-[9/16] shadow-2xl"
              poster={r.poster}
            />
            <div className="text-white/90 mt-3 text-center text-sm">
              <span className="font-medium">{r.author}</span>
              {r.car && <span className="text-[#c9a86e] ml-2">· {r.car}</span>}
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-[#1e293a] to-[#0e1720] border border-[#c9a86e]/20 p-7 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <SourceLogo source={r.source} size={48} />
              <div>
                <div className="text-white text-base font-semibold leading-tight">{r.author}</div>
                <div className="text-white/40 text-[11px] tracking-wider mt-0.5">
                  {SOURCE_META[r.source].label} · {formatDate(r.date)}
                </div>
              </div>
            </div>
            <Stars rating={r.rating} />
            {r.car && <div className="mt-3 text-[#c9a86e] text-sm font-bold tracking-wide">{r.car}</div>}
            <p className="mt-3 text-white/85 text-[15px] leading-relaxed">{r.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/** «Читать полностью» / мини-стрелка — используется в карточках. */
export function ReadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative mt-3 self-start inline-flex items-center gap-1.5 text-[#c9a86e] hover:text-[#e8c98a] text-[13px] font-medium transition-colors"
    >
      Читать полностью
      <ChevronRight className="w-4 h-4" />
    </button>
  )
}

/** Иконка Play в кружке — для видео-карточек. */
export function PlayBadge({ className = "" }: { className?: string }) {
  return (
    <div className={"w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl transition-all " + className}>
      <Play className="w-6 h-6 text-white ml-1" />
    </div>
  )
}
