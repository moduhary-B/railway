"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star, Quote, Play } from "lucide-react"

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
  /** Для type=video — URL YouTube-видео либо MP4 */
  videoUrl?: string
  /** Превью для видео-отзыва */
  poster?: string
  type: "text" | "video"
}

// Мок-данные — заменяются API. Формат ровно как ждёт виджет.
const MOCK_REVIEWS: Review[] = [
  {
    id: "m1",
    source: "yandex",
    author: "Ксения Мирясова",
    car: "Toyota Alphard",
    rating: 5,
    date: "2026-05-28",
    type: "text",
    text: "Большое спасибо за помощь с подбором и покупкой нашей машины! Учли все наши пожелания и помогли выбрать хороший вариант. Всё прозрачно, честно и быстро.",
  },
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
    id: "m3",
    source: "2gis",
    author: "Наталья Сапрыга",
    car: "Honda Freed",
    rating: 5,
    date: "2026-04-29",
    type: "text",
    text: "Огромное спасибо команде Orient Auto. Обратились по рекомендации к Алихану — внимательнейший человек. Грамотно и по делу.",
  },
  {
    id: "m4",
    source: "2gis",
    author: "Дмитрий Ковалёв",
    car: "Honda Vezel",
    rating: 5,
    date: "2026-04-12",
    type: "text",
    text: "Заказывал через ребят Honda Vezel. Прислали кучу вариантов на выбор с аукциона, всё разжевали. Спокойно, без давления, без спешки.",
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
    id: "m7",
    source: "2gis",
    author: "Игорь Прохоров",
    car: "Kia Mohave",
    rating: 5,
    date: "2026-02-24",
    type: "text",
    text: "Второй раз обращаюсь. В прошлый раз брал у них жене, сейчас взял себе. Знают своё дело, есть уверенность что не подведут.",
  },
  {
    id: "m8",
    source: "yandex",
    author: "Эдуард Скворцов",
    car: "Volkswagen Golf Alltrack",
    rating: 5,
    date: "2026-02-08",
    type: "text",
    text: "Хороший сервис. Пригнали Golf в Екатеринбург, всё как договаривались. Спасибо Кириллу за работу.",
  },
]

interface Props {
  /**
   * URL API-эндпоинта — { rating, count, reviews[] }.
   * Обновляется на бэке раз в день.
   */
  apiUrl?: string
}

const SOURCE_META: Record<ReviewSource, { label: string; color: string; bg: string; short: string }> = {
  "2gis": { label: "2ГИС", color: "#22c55e", bg: "#22c55e15", short: "2ГИС" },
  yandex: { label: "Яндекс", color: "#eab308", bg: "#eab30815", short: "Я" },
  youtube: { label: "YouTube", color: "#ef4444", bg: "#ef444415", short: "YT" },
}

export default function ReviewsWidget({ apiUrl }: Props) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [aggregate, setAggregate] = useState({ rating: 4.9, count: 143 })
  const [openVideo, setOpenVideo] = useState<Review | null>(null)

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

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Сводный рейтинг */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-7 h-7 text-yellow-400 fill-current drop-shadow-[0_0_10px_rgba(250,204,21,0.35)]"
              />
            ))}
          </div>
          <span className="font-mono-num text-white text-2xl font-light">
            {aggregate.rating.toFixed(1)} <span className="text-white/40 text-lg">/ 5</span>
          </span>
        </div>
        <p className="text-white/50 text-xs font-mono-num tracking-[0.3em] uppercase">
          На основе {aggregate.count} оценок · 2ГИС · Яндекс · YouTube
        </p>
      </div>

      {/* Masonry-стиль: карточки разной высоты, микс текст/видео */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
        {reviews.map((r) => (
          <ReviewCard key={r.id} r={r} onOpenVideo={setOpenVideo} />
        ))}
      </div>

      {/* Модалка видео */}
      {openVideo && openVideo.videoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setOpenVideo(null)}
        >
          <div
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenVideo(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
            >
              Закрыть ✕
            </button>
            <video
              src={openVideo.videoUrl}
              controls
              autoPlay
              className="w-full rounded-2xl bg-black aspect-[9/16] shadow-2xl"
              poster={openVideo.poster}
            />
            <div className="text-white/90 mt-3 text-center text-sm">
              <span className="font-medium">{openVideo.author}</span>
              {openVideo.car && (
                <span className="text-[#c9a86e] ml-2">· {openVideo.car}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ r, onOpenVideo }: { r: Review; onOpenVideo: (r: Review) => void }) {
  const meta = SOURCE_META[r.source]

  if (r.type === "video" && r.videoUrl) {
    return (
      <article
        className="group relative mb-5 break-inside-avoid rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-white/[0.06] hover:border-[#c9a86e]/40 shadow-lux shadow-lux-hover transition-all cursor-pointer"
        onClick={() => onOpenVideo(r)}
      >
        <div className="relative aspect-[9/16] w-full">
          {r.poster ? (
            <Image
              src={r.poster}
              alt={r.author}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-black/60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/95 via-transparent to-[#0e1720]/40" />

          {/* Бейдж источника в углу */}
          <div
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.15em] font-mono-num font-medium backdrop-blur-md"
            style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}50` }}
          >
            <span
              className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[8px] font-bold"
              style={{ background: meta.color, color: "#000" }}
            >
              {meta.short}
            </span>
            {meta.label}
          </div>

          {/* Play в центре */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl group-hover:bg-[#c9a86e] group-hover:scale-110 transition-all">
              <Play className="w-6 h-6 text-white ml-1 group-hover:text-[#0e1720] transition-colors" />
            </div>
          </div>

          {/* Низ карточки */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={
                    "w-3 h-3 " +
                    (s <= r.rating ? "text-yellow-400 fill-current" : "text-white/25")
                  }
                />
              ))}
            </div>
            <div className="text-white text-sm font-medium leading-tight">{r.author}</div>
            {r.car && (
              <div className="text-[#c9a86e] text-xs mt-1 uppercase tracking-[0.2em] font-mono-num">
                {r.car}
              </div>
            )}
          </div>
        </div>
      </article>
    )
  }

  // Текстовая карточка
  return (
    <article className="relative mb-5 break-inside-avoid rounded-2xl bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-white/[0.06] hover:border-[#c9a86e]/40 shadow-lux shadow-lux-hover transition-all p-6">
      {/* Бейдж источника в углу */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] font-semibold flex-shrink-0">
            {r.author.charAt(0)}
          </div>
          <div>
            <div className="text-white text-sm font-medium leading-tight">{r.author}</div>
            <div className="text-white/40 text-[11px] font-mono-num tracking-wider mt-0.5">
              {formatDate(r.date)}
            </div>
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.15em] font-mono-num font-medium"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40` }}
        >
          <span
            className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[8px] font-bold"
            style={{ background: meta.color, color: "#000" }}
          >
            {meta.short}
          </span>
          {meta.label}
        </div>
      </div>

      {/* Звёзды */}
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={
              "w-3.5 h-3.5 " +
              (s <= r.rating ? "text-yellow-400 fill-current" : "text-white/15")
            }
          />
        ))}
      </div>

      <Quote className="w-5 h-5 text-[#c9a86e]/30 mb-2" />
      <p className="text-white/75 text-[13.5px] leading-relaxed">{r.text}</p>

      {r.car && (
        <div className="mt-4 pt-3 border-t border-white/[0.05] text-[10px] uppercase tracking-[0.3em] text-[#c9a86e]/70 font-mono-num">
          {r.car}
        </div>
      )}
    </article>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
  } catch {
    return iso
  }
}
