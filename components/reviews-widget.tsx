"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Star, Quote, Play, ChevronLeft, ChevronRight } from "lucide-react"

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
    text: "Огромное спасибо команде Orient Auto. Обратились по рекомендации к Алихану — внимательнейший человек. Грамотно и по делу, всё сделали как обещали.",
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
    text: "Хороший сервис. Пригнали Golf в Екатеринбург, всё как договаривались. Спасибо Кириллу за работу и терпение.",
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

  // --- Слайдер: горизонтальный скролл со snap + стрелки + прогресс ---
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [progress, setProgress] = useState(0) // 0..1 позиция скролла
  const [pages, setPages] = useState(1)
  const [activePage, setActivePage] = useState(0)

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const left = el.scrollLeft
    setCanPrev(left > 4)
    setCanNext(left < max - 4)
    setProgress(max > 0 ? left / max : 0)
    // Пейджинг для точек: сколько «экранов» помещается
    const per = Math.max(1, Math.round(el.clientWidth / cardStep(el)))
    const total = Math.max(1, Math.ceil(el.children.length / per))
    setPages(total)
    setActivePage(Math.round((left / (max || 1)) * (total - 1)))
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    el.addEventListener("scroll", measure, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      el.removeEventListener("scroll", measure)
      window.removeEventListener("resize", measure)
    }
  }, [measure, reviews])

  // Ширина одного «шага» прокрутки (карточка + gap)
  const cardStep = (el: HTMLDivElement) => {
    const first = el.children[0] as HTMLElement | undefined
    if (!first) return el.clientWidth
    const gap = parseFloat(getComputedStyle(el).columnGap || "20") || 20
    return first.offsetWidth + gap
  }

  const scrollByCards = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    // Прокручиваем почти на видимую ширину (минус одна карточка для контекста)
    const step = cardStep(el)
    const amount = Math.max(step, el.clientWidth - step)
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  const goToPage = (p: number) => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    el.scrollTo({ left: (max * p) / Math.max(1, pages - 1), behavior: "smooth" })
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Сводный рейтинг */}
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 fill-current drop-shadow-[0_0_10px_rgba(250,204,21,0.35)]"
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

      {/* ==== Слайдер отзывов (клиент просил «листать») ==== */}
      <div className="relative">
        {/* Кромочные градиенты-затухания по бокам */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 z-10 bg-gradient-to-r from-[#1a2332] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 z-10 bg-gradient-to-l from-[#1a2332] to-transparent" />

        {/* Стрелки — десктоп */}
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          disabled={!canPrev}
          aria-label="Предыдущие отзывы"
          className={
            "hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full items-center justify-center border transition-all " +
            (canPrev
              ? "bg-[#0e1720]/90 border-[#c9a86e]/40 text-white hover:bg-[#c9a86e] hover:text-[#0e1720] hover:scale-110 shadow-lux"
              : "bg-[#0e1720]/40 border-white/5 text-white/20 cursor-not-allowed")
          }
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          disabled={!canNext}
          aria-label="Следующие отзывы"
          className={
            "hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-12 h-12 rounded-full items-center justify-center border transition-all " +
            (canNext
              ? "bg-[#0e1720]/90 border-[#c9a86e]/40 text-white hover:bg-[#c9a86e] hover:text-[#0e1720] hover:scale-110 shadow-lux"
              : "bg-[#0e1720]/40 border-white/5 text-white/20 cursor-not-allowed")
          }
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Лента карточек */}
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r) => (
            <ReviewCard key={r.id} r={r} onOpenVideo={setOpenVideo} />
          ))}
        </div>
      </div>

      {/* Прогресс-бар + точки */}
      <div className="mt-6 flex flex-col items-center gap-4">
        {/* Тонкая полоска прогресса */}
        <div className="relative w-40 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] transition-[width] duration-150"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>

        {/* Стрелки для мобилок + точки-страницы */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={!canPrev}
            aria-label="Предыдущие отзывы"
            className={
              "md:hidden w-10 h-10 rounded-full flex items-center justify-center border transition-all " +
              (canPrev
                ? "bg-[#0e1720] border-[#c9a86e]/40 text-white active:scale-95"
                : "bg-[#0e1720]/40 border-white/5 text-white/20")
            }
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`Страница отзывов ${i + 1}`}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === activePage ? "w-7 bg-[#c9a86e]" : "w-2 bg-white/20 hover:bg-white/40")
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={!canNext}
            aria-label="Следующие отзывы"
            className={
              "md:hidden w-10 h-10 rounded-full flex items-center justify-center border transition-all " +
              (canNext
                ? "bg-[#0e1720] border-[#c9a86e]/40 text-white active:scale-95"
                : "bg-[#0e1720]/40 border-white/5 text-white/20")
            }
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Модалка видео */}
      {openVideo && openVideo.videoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setOpenVideo(null)}
        >
          <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
              {openVideo.car && <span className="text-[#c9a86e] ml-2">· {openVideo.car}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Общая ширина карточки в ленте (snap + фикс. ширина под все брейкпоинты). */
const CARD_W =
  "snap-start shrink-0 w-[86vw] xs:w-[80vw] sm:w-[360px] md:w-[380px] lg:w-[400px]"

function ReviewCard({ r, onOpenVideo }: { r: Review; onOpenVideo: (r: Review) => void }) {
  const meta = SOURCE_META[r.source]

  if (r.type === "video" && r.videoUrl) {
    return (
      <article
        className={
          CARD_W +
          " group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-white/[0.06] hover:border-[#c9a86e]/40 shadow-lux shadow-lux-hover transition-all cursor-pointer"
        }
        onClick={() => onOpenVideo(r)}
      >
        <div className="relative aspect-[4/5] w-full">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720] via-[#0e1720]/30 to-[#0e1720]/40" />

          {/* Бейдж источника */}
          <SourceBadge meta={meta} className="absolute top-3 left-3 backdrop-blur-md" />

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
                  className={"w-3 h-3 " + (s <= r.rating ? "text-yellow-400 fill-current" : "text-white/25")}
                />
              ))}
            </div>
            <div className="text-white text-sm font-semibold leading-tight">{r.author}</div>
            {r.car && (
              <div className="text-[#c9a86e] text-xs mt-1 uppercase tracking-[0.2em] font-mono-num">{r.car}</div>
            )}
          </div>
        </div>
      </article>
    )
  }

  // Текстовая карточка — единая высота с видео (aspect у видео, min-h у текста)
  return (
    <article
      className={
        CARD_W +
        " group relative flex flex-col rounded-2xl bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-white/[0.06] hover:border-[#c9a86e]/40 shadow-lux shadow-lux-hover transition-all p-6 overflow-hidden"
      }
    >
      {/* Крупная декоративная кавычка на фоне */}
      <Quote
        className="pointer-events-none absolute -top-3 right-3 w-24 h-24 text-[#c9a86e]/[0.07] fill-current"
        strokeWidth={0}
      />
      {/* Верхний блик */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Шапка: аватар + имя + бейдж */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] font-bold text-lg flex-shrink-0 shadow-[0_0_18px_rgba(201,168,110,0.3)]">
            {r.author.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold leading-tight truncate">{r.author}</div>
            <div className="text-white/40 text-[11px] font-mono-num tracking-wider mt-0.5">{formatDate(r.date)}</div>
          </div>
        </div>
        <SourceBadge meta={meta} className="shrink-0" />
      </div>

      {/* Звёзды */}
      <div className="relative flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={"w-4 h-4 " + (s <= r.rating ? "text-yellow-400 fill-current" : "text-white/15")}
          />
        ))}
      </div>

      {/* Текст */}
      <p className="relative text-white/80 text-[14px] leading-relaxed flex-1">{r.text}</p>

      {r.car && (
        <div className="relative mt-4 pt-3 border-t border-white/[0.06] text-[10px] uppercase tracking-[0.3em] text-[#c9a86e]/80 font-mono-num">
          {r.car}
        </div>
      )}
    </article>
  )
}

function SourceBadge({
  meta,
  className = "",
}: {
  meta: { label: string; color: string; bg: string; short: string }
  className?: string
}) {
  return (
    <div
      className={
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-[0.15em] font-mono-num font-medium " +
        className
      }
      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}45` }}
    >
      <span
        className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[8px] font-bold"
        style={{ background: meta.color, color: "#000" }}
      >
        {meta.short}
      </span>
      {meta.label}
    </div>
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
