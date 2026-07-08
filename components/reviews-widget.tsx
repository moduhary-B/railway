"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export type ReviewSource = "all" | "2gis" | "yandex"

export interface Review {
  id: string
  source: Exclude<ReviewSource, "all">
  author: string
  car?: string
  rating: number // 1-5
  date: string // ISO
  text: string
}

// Мок-данные — будут заменены API-ответом.
// Формат ровно такой же, как ожидает виджет: массив Review + агрегация rating.
const MOCK_REVIEWS: Review[] = [
  {
    id: "m1",
    source: "2gis",
    author: "Ксения Мирясова",
    car: "Toyota Alphard",
    rating: 5,
    date: "2026-05-28",
    text: "Большое спасибо за помощь с подбором и покупкой нашей машины! Учли все наши пожелания и помогли выбрать хороший вариант. Всё прозрачно, честно и быстро.",
  },
  {
    id: "m2",
    source: "yandex",
    author: "Юлия Шпак-Чуй",
    car: "Kia K5",
    rating: 5,
    date: "2026-05-15",
    text: "Хочу выразить искреннюю благодарность компании Orient Auto, и в особенности менеджеру Алихану. Благодаря его чёткой работе получила именно то, что хотела.",
  },
  {
    id: "m3",
    source: "yandex",
    author: "Наталья Сапрыга",
    car: "Honda Freed",
    rating: 5,
    date: "2026-04-29",
    text: "Огромное спасибо команде Orient Auto. Обратились по рекомендации к Алихану — внимательнейший человек. Грамотно и по делу.",
  },
  {
    id: "m4",
    source: "2gis",
    author: "Дмитрий Ковалёв",
    car: "Honda Vezel",
    rating: 5,
    date: "2026-04-12",
    text: "Заказывал через ребят Honda Vezel. Прислали кучу вариантов на выбор с аукциона, всё разжевали. Спокойно, без давления, без спешки. Порадовало.",
  },
  {
    id: "m5",
    source: "2gis",
    author: "Алексей Ноздрин",
    car: "Nissan Note",
    rating: 5,
    date: "2026-03-30",
    text: "Работал с командой Orient Auto. Ребята работают на совесть, всё чётко по срокам, машина пришла даже раньше обещанного, документы в порядке.",
  },
  {
    id: "m6",
    source: "yandex",
    author: "Рузиль Хабибуллин",
    car: "Hyundai Santa Fe TM",
    rating: 5,
    date: "2026-03-18",
    text: "Взял Hyundai Santa Fe. Всё прошло гладко: подбор, торги, доставка. Даже мелкие моменты по СБКТС решили за меня — спасибо!",
  },
  {
    id: "m7",
    source: "2gis",
    author: "Игорь Прохоров",
    car: "Kia Mohave",
    rating: 5,
    date: "2026-02-24",
    text: "Второй раз обращаюсь. В прошлый раз брал у них жене, сейчас взял себе. Знают своё дело, есть уверенность в том, что не подведут.",
  },
  {
    id: "m8",
    source: "yandex",
    author: "Эдуард Скворцов",
    car: "Volkswagen Golf Alltrack",
    rating: 5,
    date: "2026-02-08",
    text: "Хороший сервис. Пригнали Golf в Екатеринбург, всё как договаривались. Спасибо Кириллу за работу.",
  },
]

interface Props {
  /**
   * URL API-эндпоинта, возвращающего { rating: number, count: number, reviews: Review[] }.
   * Если не указан — используются мок-данные.
   * Пример: /api/reviews  (клиент напишет позже, обновляется раз в день)
   */
  apiUrl?: string
}

/**
 * Виджет отзывов Orient Auto (msg_17 + msg_25).
 *
 * Data flow:
 *   - Если apiUrl задан — делает fetch, ожидает ответ формата {rating, count, reviews[]}.
 *   - При ошибке или отсутствии apiUrl — fallback на MOCK_REVIEWS.
 *
 * UI:
 *   - Крупный рейтинг сверху (звёзды + 4.9/5).
 *   - Вкладки Все / 2ГИС / Яндекс с оценкой каждой.
 *   - Лента карточек с pagination + arrow navigation.
 */
export default function ReviewsWidget({ apiUrl }: Props) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [aggregate, setAggregate] = useState({ rating: 4.9, count: 143 })
  const [loading, setLoading] = useState(false)
  const [activeSource, setActiveSource] = useState<ReviewSource>("all")
  const [page, setPage] = useState(0)

  // Fetch раз при монтировании (клиент планирует обновлять на бэке раз в день).
  useEffect(() => {
    if (!apiUrl) return
    let cancelled = false
    setLoading(true)
    fetch(apiUrl)
      .then((r) => r.json())
      .then((data: { rating: number; count: number; reviews: Review[] }) => {
        if (cancelled) return
        if (Array.isArray(data?.reviews) && data.reviews.length) {
          setReviews(data.reviews)
          setAggregate({ rating: data.rating ?? 4.9, count: data.count ?? data.reviews.length })
        }
      })
      .catch(() => {
        /* fallback: mock */
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [apiUrl])

  const filtered = useMemo(
    () => (activeSource === "all" ? reviews : reviews.filter((r) => r.source === activeSource)),
    [reviews, activeSource],
  )

  const perPage = 3
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages - 1)
  const shown = filtered.slice(currentPage * perPage, currentPage * perPage + perPage)

  useEffect(() => {
    setPage(0)
  }, [activeSource])

  const sourceRating = (src: Exclude<ReviewSource, "all">) => {
    const list = reviews.filter((r) => r.source === src)
    if (!list.length) return 0
    return list.reduce((s, r) => s + r.rating, 0) / list.length
  }

  const tabs: { key: ReviewSource; label: string; rating?: number }[] = [
    { key: "all", label: "Все отзывы", rating: aggregate.rating },
    { key: "2gis", label: "2ГИС", rating: sourceRating("2gis") },
    { key: "yandex", label: "Яндекс", rating: sourceRating("yandex") },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Сводный рейтинг */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-8 h-8 text-yellow-400 fill-current drop-shadow-[0_0_10px_rgba(250,204,21,0.35)]"
              />
            ))}
          </div>
          <span className="font-mono-num text-white text-2xl font-light">
            {aggregate.rating.toFixed(1)} <span className="text-white/40 text-lg">/ 5</span>
          </span>
        </div>
        <p className="text-white/50 text-sm font-mono-num tracking-wider">
          На основе {aggregate.count} оценок
        </p>
      </div>

      {/* Вкладки источников */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((t) => {
          const active = activeSource === t.key
          return (
            <button
              key={t.key}
              onClick={() => setActiveSource(t.key)}
              className={
                "group inline-flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 focus-lux " +
                (active
                  ? "bg-gradient-to-r from-[#c9a86e] to-[#d4b876] text-[#0e1720] shadow-lg"
                  : "bg-white/[0.03] text-white/70 border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]")
              }
            >
              <span className="text-sm font-medium">{t.label}</span>
              {t.rating ? (
                <span
                  className={
                    "font-mono-num text-xs " +
                    (active ? "text-[#0e1720]/70" : "text-[#c9a86e]")
                  }
                >
                  {t.rating.toFixed(1)}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Карточки отзывов */}
      {loading ? (
        <div className="text-center py-16 text-white/40 text-sm font-mono-num">Загрузка отзывов…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 min-h-[280px]">
            {shown.map((r) => (
              <article
                key={r.id}
                className="group relative bg-gradient-to-br from-[#1a2332]/60 to-[#0e1720]/60 border border-white/[0.06] hover:border-[#c9a86e]/40 rounded-2xl p-6 backdrop-blur-sm shadow-lux shadow-lux-hover transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a86e]/70 to-[#d4b876]/70 flex items-center justify-center text-[#0e1720] font-semibold">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium leading-tight">{r.author}</div>
                      <div className="text-white/40 text-[11px] font-mono-num tracking-wider mt-0.5">
                        {formatDate(r.date)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={
                      "text-[9px] uppercase tracking-[0.25em] font-mono-num px-2 py-1 rounded-full border " +
                      (r.source === "2gis"
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
                        : "text-yellow-300 border-yellow-500/30 bg-yellow-500/5")
                    }
                  >
                    {r.source === "2gis" ? "2ГИС" : "Яндекс"}
                  </span>
                </div>
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
                <p className="text-white/70 text-[13px] leading-relaxed line-clamp-5">{r.text}</p>
                {r.car ? (
                  <div className="mt-4 pt-3 border-t border-white/[0.05] text-[10px] uppercase tracking-[0.3em] text-[#c9a86e]/70 font-mono-num">
                    {r.car}
                  </div>
                ) : null}
              </article>
            ))}
            {shown.length === 0 && (
              <div className="col-span-full text-center py-16 text-white/40 text-sm">
                Нет отзывов в этом источнике
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                aria-label="Предыдущая страница"
                className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-[#c9a86e]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center focus-lux"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <div className="flex items-center gap-2 font-mono-num text-sm">
                <span className="text-white">{String(currentPage + 1).padStart(2, "0")}</span>
                <span className="text-white/30">/</span>
                <span className="text-white/50">{String(totalPages).padStart(2, "0")}</span>
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                aria-label="Следующая страница"
                className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-[#c9a86e]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center focus-lux"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </>
      )}
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
