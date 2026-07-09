"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { SiYoutube } from "react-icons/si"
import { Star, Play, ChevronLeft, ChevronRight, X } from "lucide-react"

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
]

interface Props {
  /**
   * URL API-эндпоинта — { rating, count, reviews[] }.
   * Обновляется на бэке раз в день.
   */
  apiUrl?: string
}

const SOURCE_META: Record<ReviewSource, { label: string; color: string }> = {
  "2gis": { label: "2ГИС", color: "#19aa1e" },
  yandex: { label: "Яндекс", color: "#fc3f1d" },
  youtube: { label: "YouTube", color: "#ff0000" },
}

/** Аватар-лого источника — официальные бренд-иконки (App Store / Wikimedia / react-icons). */
function SourceLogo({ source, size = 44 }: { source: ReviewSource; size?: number }) {
  const box = { width: size, height: size }
  if (source === "yandex") {
    return (
      <span className="relative block rounded-full overflow-hidden shrink-0 shadow-[0_0_14px_rgba(252,63,29,0.35)]" style={box}>
        <Image src="/icons/yandex.svg" alt="Яндекс" width={size} height={size} style={box} />
      </span>
    )
  }
  if (source === "2gis") {
    // Официальный знак 2ГИС во всю ячейку (у него своя скруглённая рамка-квадрат)
    return (
      <span
        className="block rounded-[26%] overflow-hidden shrink-0 shadow-[0_0_14px_rgba(25,170,30,0.35)]"
        style={box}
      >
        <Image src="/icons/2gis-mark.png" alt="2ГИС" width={size} height={size} className="object-cover" style={box} />
      </span>
    )
  }
  // youtube — красный кружок с официальным глифом
  return (
    <span
      className="flex items-center justify-center rounded-full bg-white shrink-0 shadow-[0_0_14px_rgba(255,0,0,0.3)]"
      style={box}
    >
      <SiYoutube size={size * 0.62} color="#ff0000" />
    </span>
  )
}

export default function ReviewsWidget({ apiUrl }: Props) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [aggregate, setAggregate] = useState({ rating: 4.9, count: 143 })
  const [openReview, setOpenReview] = useState<Review | null>(null)

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

  // --- Слайдер: горизонтальный скролл со snap + стрелки + прогресс (msg_17: «листать») ---
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [progress, setProgress] = useState(0)

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const left = el.scrollLeft
    setCanPrev(left > 4)
    setCanNext(left < max - 4)
    setProgress(max > 0 ? left / max : 0)
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

  const cardStep = (el: HTMLDivElement) => {
    const first = el.children[0] as HTMLElement | undefined
    if (!first) return el.clientWidth
    const gap = parseFloat(getComputedStyle(el).columnGap || "20") || 20
    return first.offsetWidth + gap
  }

  const scrollByCards = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    const step = cardStep(el)
    const amount = Math.max(step, el.clientWidth - step)
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* ==== Единый контейнер-рамка (msg_9/10: блок «собран», без пустоты) ==== */}
      <div className="relative rounded-[28px] border border-[#c9a86e]/15 bg-gradient-to-b from-white/[0.04] to-transparent p-5 md:p-8 overflow-hidden shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)]">
        {/* Водяной знак-лого в фоне (msg_23: паттерн лого) */}
        <Image
          src="/logo-orient.png"
          alt=""
          width={420}
          height={420}
          aria-hidden
          className="pointer-events-none select-none absolute -right-16 -bottom-16 w-[280px] md:w-[420px] opacity-[0.04] rotate-[-8deg]"
        />

        {/* Сводный рейтинг + источники */}
        <div className="relative text-center mb-7 md:mb-9">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 fill-current drop-shadow-[0_0_10px_rgba(250,204,21,0.35)]"
                />
              ))}
            </div>
            <span className="font-mono-num text-white text-2xl md:text-3xl font-light">
              {aggregate.rating.toFixed(1)} <span className="text-white/40 text-lg">/ 5</span>
            </span>
          </div>
          {/* Источники — реальные лого (msg_16: 2ГИС → Яндекс, без Вл.ру; + YouTube) */}
          <div className="flex items-center justify-center gap-5 md:gap-7">
            <SourcePill source="2gis" />
            <span className="w-px h-5 bg-white/10" />
            <SourcePill source="yandex" />
            <span className="w-px h-5 bg-white/10" />
            <SourcePill source="youtube" />
          </div>
          <p className="text-white/40 text-[11px] font-mono-num tracking-[0.25em] uppercase mt-3">
            На основе {aggregate.count} реальных оценок
          </p>
        </div>

        {/* ==== Лента отзывов ==== */}
        <div className="relative">
          {/* Кромочные градиенты-затухания (msg_19: границы уходят в градиент) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-14 z-10 bg-gradient-to-r from-[#141d28] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-14 z-10 bg-gradient-to-l from-[#141d28] to-transparent" />

          {/* Стрелки — десктоп */}
          <SliderArrow dir="left" onClick={() => scrollByCards(-1)} disabled={!canPrev} />
          <SliderArrow dir="right" onClick={() => scrollByCards(1)} disabled={!canNext} />

          {/* Лента карточек */}
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth items-stretch [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((r) => (
              <ReviewCard key={r.id} r={r} onOpen={setOpenReview} />
            ))}
          </div>
        </div>

        {/* Прогресс + мобильные стрелки */}
        <div className="relative mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={!canPrev}
            aria-label="Предыдущие отзывы"
            className={
              "md:hidden w-10 h-10 rounded-full flex items-center justify-center border transition-all " +
              (canPrev ? "bg-[#0e1720] border-[#c9a86e]/40 text-white active:scale-95" : "bg-[#0e1720]/40 border-white/5 text-white/20")
            }
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative w-40 md:w-56 h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] transition-[width] duration-150"
              style={{ width: `${Math.max(14, progress * 100)}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={!canNext}
            aria-label="Следующие отзывы"
            className={
              "md:hidden w-10 h-10 rounded-full flex items-center justify-center border transition-all " +
              (canNext ? "bg-[#0e1720] border-[#c9a86e]/40 text-white active:scale-95" : "bg-[#0e1720]/40 border-white/5 text-white/20")
            }
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Универсальная модалка: видео ИЛИ полный текст */}
      {openReview && <ReviewModal r={openReview} onClose={() => setOpenReview(null)} />}
    </div>
  )
}

/** Компактный лейбл источника с лого — для строки под рейтингом. */
function SourcePill({ source }: { source: ReviewSource }) {
  const meta = SOURCE_META[source]
  return (
    <span className="inline-flex items-center gap-2">
      <SourceLogo source={source} size={22} />
      <span className="text-white/75 text-sm font-medium">{meta.label}</span>
    </span>
  )
}

function SliderArrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right"
  onClick: () => void
  disabled: boolean
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Предыдущие отзывы" : "Следующие отзывы"}
      className={
        "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full items-center justify-center border transition-all " +
        (dir === "left" ? "left-0 -translate-x-1/2 " : "right-0 translate-x-1/2 ") +
        (disabled
          ? "bg-[#0e1720]/40 border-white/5 text-white/20 cursor-not-allowed"
          : "bg-[#0e1720]/90 border-[#c9a86e]/40 text-white hover:bg-[#c9a86e] hover:text-[#0e1720] hover:scale-110 shadow-lux")
      }
    >
      <Icon className="w-6 h-6" />
    </button>
  )
}

/** Фикс-высота ленты — все карточки одной высоты, разной ширины. */
const CARD_H = "h-[380px] md:h-[400px]"
const CARD_W_TEXT = "w-[86vw] xs:w-[78vw] sm:w-[350px] md:w-[360px]"
const CARD_W_VIDEO = "w-[86vw] xs:w-[78vw] sm:w-[300px] md:w-[320px]"

function ReviewCard({ r, onOpen }: { r: Review; onOpen: (r: Review) => void }) {
  const meta = SOURCE_META[r.source]

  // ---- Видео-карточка ----
  if (r.type === "video" && r.videoUrl) {
    return (
      <article
        className={
          "snap-start shrink-0 " + CARD_W_VIDEO + " " + CARD_H +
          " group relative rounded-2xl overflow-hidden bg-black border border-white/[0.06] hover:border-[#c9a86e]/40 shadow-lux shadow-lux-hover transition-all cursor-pointer"
        }
        onClick={() => onOpen(r)}
      >
        {r.poster ? (
          <Image src={r.poster} alt={r.author} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 bg-black/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720] via-[#0e1720]/25 to-[#0e1720]/40" />

        {/* Лого-источник + метка ВИДЕО */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <SourceLogo source={r.source} size={34} />
          <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.15em] font-mono-num border border-white/15">
            Видео
          </span>
        </div>

        {/* Play по центру */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl group-hover:bg-[#c9a86e] group-hover:scale-110 transition-all">
            <Play className="w-6 h-6 text-white ml-1 group-hover:text-[#0e1720] transition-colors" />
          </div>
        </div>

        {/* Низ */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <Stars rating={r.rating} />
          <div className="text-white text-sm font-semibold leading-tight mt-2">{r.author}</div>
          {r.car && (
            <div className="text-[#c9a86e] text-xs mt-1 uppercase tracking-[0.18em] font-mono-num">{r.car}</div>
          )}
        </div>
      </article>
    )
  }

  // ---- Текстовая карточка ----
  const isLong = (r.text?.length ?? 0) > 190
  return (
    <article
      className={
        "snap-start shrink-0 " + CARD_W_TEXT + " " + CARD_H +
        " group relative flex flex-col rounded-2xl bg-gradient-to-br from-[#1e293a] to-[#0e1720] border border-white/[0.06] hover:border-[#c9a86e]/40 shadow-lux shadow-lux-hover transition-all p-6 overflow-hidden"
      }
    >
      {/* Верхний блик */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Тонкая кавычка-акцент в углу (за контентом, не мешает тексту) */}
      <span className="pointer-events-none absolute -top-1 right-3 text-[70px] leading-none font-serif text-[#c9a86e]/[0.10] select-none z-0">
        &rdquo;
      </span>

      {/* Шапка: лого-источник + имя + дата */}
      <div className="relative flex items-center gap-3 mb-3">
        <SourceLogo source={r.source} size={44} />
        <div className="min-w-0">
          <div className="text-white text-[15px] font-semibold leading-tight truncate">{r.author}</div>
          <div className="text-white/40 text-[11px] font-mono-num tracking-wider mt-0.5">
            {SOURCE_META[r.source].label} · {formatDate(r.date)}
          </div>
        </div>
      </div>

      <Stars rating={r.rating} />

      {/* Модель авто — акцент (msg_25) */}
      {r.car && (
        <div className="relative mt-3 mb-2 text-[#c9a86e] text-sm font-bold tracking-wide">{r.car}</div>
      )}

      {/* Текст с обрезкой */}
      <p className="relative text-white/80 text-[13.5px] leading-relaxed flex-1 overflow-hidden">
        {r.text}
      </p>
      {/* Плавное затухание низа текста, если длинный */}
      {isLong && (
        <div className="pointer-events-none absolute inset-x-6 bottom-14 h-10 bg-gradient-to-t from-[#0e1720] to-transparent" />
      )}

      {isLong ? (
        <button
          type="button"
          onClick={() => onOpen(r)}
          className="relative mt-3 self-start inline-flex items-center gap-1.5 text-[#c9a86e] hover:text-[#e8c98a] text-[13px] font-medium transition-colors"
        >
          Читать полностью
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="relative mt-3 h-[1px]" style={{ color: meta.color }} />
      )}
    </article>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={"w-4 h-4 " + (s <= rating ? "text-yellow-400 fill-current" : "text-white/15")} />
      ))}
    </div>
  )
}

function ReviewModal({ r, onClose }: { r: Review; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={onClose}>
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
                <div className="text-white/40 text-[11px] font-mono-num tracking-wider mt-0.5">
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

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
  } catch {
    return iso
  }
}
