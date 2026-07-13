"use client"

// ============================================================
// reviews-variants — варианты блока «Отзывы наших клиентов»
// для форка /ideal-two. Клиент (msg_17, msg_25) прислал два
// референса и просил листать отзывы целыми экранами.
//
//   ВАРИАНТ 1 — Editorial Grid   (по референсу msg_25)
//   ВАРИАНТ 2 — Mosaic Video       (по референсу msg_17)
//
// Дизайн-токены взяты из globals.css: тёмный фон #0e1720/#1a2332,
// золото #c9a86e/#d4b876, kicker, shadow-lux, section-index.
// ============================================================

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import {
  type Review,
  useReviews,
  SourceLogo,
  SOURCE_META,
  Stars,
  ReviewModal,
  formatDate,
  initials,
} from "@/components/reviews-shared"

/* Общий «шапочный» рейтинг для всех трёх вариантов. */
function RatingHeader({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex flex-col items-center mb-10 md:mb-14">
      <span className="kicker kicker--center mb-5">Реальные оценки · 2ГИС · Яндекс · YouTube</span>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s}>
              <Star4 />
            </span>
          ))}
        </div>
        <span className="text-white text-3xl md:text-4xl font-extrabold tabular-nums">
          {rating.toFixed(1).replace(".", ",")}
          <span className="text-white/30 text-xl font-light"> / 5</span>
        </span>
      </div>
      <p className="text-white/45 text-xs tracking-[0.2em] uppercase">
        на основе {count} реальных оценок
      </p>
    </div>
  )
}

/* lucide Star импортируется в shared, но здесь нужна крупная версия. */
import { Star as Star4Icon } from "lucide-react"
function Star4() {
  return (
    <Star4Icon className="w-7 h-7 md:w-8 md:h-8 text-yellow-400 fill-current drop-shadow-[0_0_12px_rgba(250,204,21,0.4)]" />
  )
}

/* Общий разделитель между вариантами — как у Павла в HowWeWork. */
export function VariantDivider({ title }: { title: string }) {
  return (
    <div className="w-full bg-[#0e1720] py-7 text-center relative">
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,80vw)] h-px bg-gradient-to-r from-transparent via-[#c9a86e]/40 to-transparent" />
      <span className="relative inline-block bg-[#0e1720] px-5 section-index">{title}</span>
    </div>
  )
}

/* ============================================================
   ВАРИАНТ 1 — EDITORIAL GRID  (референс msg_25)
   Чистая сетка 3 колонки. Листание страницами по 6 карточек,
   снизу точки-пагинация + стрелки. Большая декоративная
   кавычка, рамка-контейнер, паттерн лого в фоне.
   ============================================================ */
export function ReviewsVariantGrid({ apiUrl }: { apiUrl?: string }) {
  const { reviews, aggregate } = useReviews(apiUrl)
  const [open, setOpen] = useState<Review | null>(null)
  const [page, setPage] = useState(0)

  // 6 карточек на страницу (3×2 на десктопе, 2×3 на планшете, 1 колонка моб)
  const PER = 6
  const pages = Math.max(1, Math.ceil(reviews.length / PER))
  const safePage = Math.min(page, pages - 1)

  const slice = reviews.slice(safePage * PER, safePage * PER + PER)

  return (
    <div data-review-variant="grid" className="w-full max-w-[1400px] mx-auto px-4">
      <RatingHeader rating={aggregate.rating} count={aggregate.count} />

      <div className="relative rounded-[32px] border border-[#c9a86e]/12 bg-gradient-to-b from-white/[0.03] to-transparent p-5 md:p-9 overflow-hidden shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)]">
        {/* паттерн лого в фоне (msg_23) */}
        <Image
          src="/logo-orient.png"
          alt=""
          aria-hidden
          width={520}
          height={520}
          className="pointer-events-none select-none absolute -right-24 -bottom-24 w-[320px] md:w-[460px] opacity-[0.035] rotate-[-8deg]"
        />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {slice.map((r, i) => (
            <GridCard key={r.id} r={r} index={i} onOpen={() => setOpen(r)} />
          ))}
        </div>

        {/* пагинация */}
        {pages > 1 && (
          <div className="relative flex items-center justify-center gap-5 mt-9">
            <PagerArrow
              dir="prev"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            />
            <div className="flex items-center gap-2.5">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Страница ${i + 1}`}
                  className={
                    "h-2.5 rounded-full transition-all duration-300 " +
                    (i === safePage
                      ? "w-8 bg-gradient-to-r from-[#c9a86e] to-[#d4b876]"
                      : "w-2.5 bg-white/20 hover:bg-white/40")
                  }
                />
              ))}
            </div>
            <PagerArrow
              dir="next"
              disabled={safePage >= pages - 1}
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            />
          </div>
        )}
      </div>

      {open && <ReviewModal r={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

function GridCard({ r, index, onOpen }: { r: Review; index: number; onOpen: () => void }) {
  const isVideo = r.type === "video" && r.videoUrl
  const isLong = (r.text?.length ?? 0) > 150

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-white/[0.06] hover:border-[#c9a86e]/40 shadow-lux shadow-lux-hover transition-all p-5 overflow-hidden min-h-[280px]"
    >
      {/* верхний блик + площадка отзыва */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <SourceWatermark source={r.source} />

      {/* шапка */}
      <div className="relative flex items-center gap-3 mb-4 pr-14">
        {isVideo ? (
          <span className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
            <Image src={r.poster!} alt={r.author} fill className="object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <PlayBadgeBadge />
              </span>
            </span>
          </span>
        ) : (
          <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] font-extrabold text-sm shrink-0 shadow-[0_6px_18px_-6px_rgba(201,168,110,0.6)]">
            {initials(r.author)}
          </span>
        )}
        <div className="min-w-0">
          <div className="text-white text-[15px] font-bold leading-tight truncate">{r.author}</div>
          <div className="mt-1 text-white/40 text-[11px] tracking-wide">{formatDate(r.date)}</div>
        </div>
      </div>

      <Stars rating={r.rating} className="mb-3" />

      {r.car && (
        <div className="inline-flex self-start items-center gap-1.5 mb-2 px-2.5 py-1 rounded-md bg-[#c9a86e]/10 border border-[#c9a86e]/20">
          <span className="w-1 h-1 rounded-full bg-[#c9a86e]" />
          <span className="text-[#c9a86e] text-[11px] font-bold tracking-wide uppercase">{r.car}</span>
        </div>
      )}

      <p className="relative text-white/75 text-[13.5px] leading-relaxed flex-1">
        {r.text}
        {isVideo && (
          <span className="block mt-1 text-[#c9a86e]/80 text-xs">▶ Видеоинтервью с клиентом</span>
        )}
      </p>

      {isLong && (
        <button
          onClick={onOpen}
          className="mt-3 self-start text-[#c9a86e] hover:text-[#d4b876] text-[13px] font-medium inline-flex items-center gap-1 transition-colors"
        >
          Читать полностью <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </motion.article>
  )
}

function SourceWatermark({ source }: { source: Review["source"] }) {
  if (source === "youtube") {
    return (
      <div className="pointer-events-none absolute right-3 top-3 opacity-25 [&>span]:!shadow-none">
        <SourceLogo source={source} size={62} />
      </div>
    )
  }

  const sourceIcon = source === "yandex" ? "/icons/yandex.svg" : "/icons/2gis-mark.png"
  return (
    <div
      role="img"
      aria-label={SOURCE_META[source].label}
      className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 rotate-[12deg] bg-contain bg-center bg-no-repeat opacity-50"
      style={{
        backgroundImage: `url(${sourceIcon})`,
        WebkitMaskImage: "linear-gradient(to top right, transparent 4%, rgba(0,0,0,0.45) 46%, #000 84%)",
        maskImage: "linear-gradient(to top right, transparent 4%, rgba(0,0,0,0.45) 46%, #000 84%)",
      }}
    />
  )
}

function PlayBadgeBadge() {
  return <span className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-white ml-0.5" />
}

function PagerArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next"
  disabled: boolean
  onClick: () => void
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Предыдущие" : "Следующие"}
      className={
        "w-11 h-11 rounded-full flex items-center justify-center border transition-all " +
        (disabled
          ? "bg-[#0e1720]/40 border-white/5 text-white/20 cursor-not-allowed"
          : "bg-[#0e1720] border-[#c9a86e]/40 text-white hover:bg-[#c9a86e] hover:text-[#0e1720] hover:scale-105 active:scale-95")
      }
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}

/* ============================================================
   ВАРИАНТ 2 — FIXED VIDEO GRID  (референс msg_17)
   На каждом экране четыре равные текстовые карточки и вертикальное
   видео. Две строки боковых колонок точно совпадают с высотой видео.
   ============================================================ */

type ReviewScreen = {
  video?: Review
  left: Review[]
  right: Review[]
}

function buildFixedScreens(reviews: Review[]): ReviewScreen[] {
  const videos = reviews.filter((review) => review.type === "video" && review.videoUrl)
  const texts = reviews.filter((review) => review.type === "text")
  const screenCount = Math.max(videos.length, Math.ceil(texts.length / 4), 1)

  return Array.from({ length: screenCount }, (_, screenIndex) => {
    const screenReviews: Review[] = []
    const targetCount = Math.min(4, texts.length)
    for (let offset = 0; offset < targetCount; offset += 1) {
      screenReviews.push(texts[(screenIndex * 4 + offset) % texts.length])
    }
    return {
      video: videos.length ? videos[screenIndex % videos.length] : undefined,
      left: screenReviews.slice(0, 2),
      right: screenReviews.slice(2, 4),
    }
  })
}

export function ReviewsVariantHero({ apiUrl }: { apiUrl?: string }) {
  const { reviews, aggregate } = useReviews(apiUrl)
  const [open, setOpen] = useState<Review | null>(null)
  const [page, setPage] = useState(0)
  const screens = buildFixedScreens(reviews)
  const safePage = Math.min(page, screens.length - 1)
  const screen = screens[safePage]
  const currentPoster = screen.video?.poster
  const nextPoster = screens[(safePage + 1) % screens.length]?.video?.poster

  useEffect(() => {
    const posters = [currentPoster, nextPoster]
    posters.forEach((poster) => {
      if (!poster) return
      const image = new window.Image()
      image.src = poster
    })
  }, [currentPoster, nextPoster])

  const go = (nextPage: number) => {
    setPage((nextPage + screens.length) % screens.length)
  }

  return (
    <div
      data-review-variant="mosaic-dark"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-[#c9a86e]/15 bg-[#080d15] py-12 shadow-[0_35px_100px_-55px_rgba(0,0,0,0.95)] md:py-16"
    >
      <Image
        src="/logo-orient.png"
        alt=""
        aria-hidden
        width={620}
        height={620}
        className="pointer-events-none absolute -left-40 top-1/2 w-[420px] -translate-y-1/2 rotate-[10deg] select-none opacity-[0.028] md:w-[580px]"
      />
      <Image
        src="/logo-orient.png"
        alt=""
        aria-hidden
        width={520}
        height={520}
        className="pointer-events-none absolute -right-44 -top-32 hidden w-[480px] -rotate-[12deg] select-none opacity-[0.018] lg:block"
      />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a86e]/45 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1500px] px-4 md:px-7 xl:px-10">
        <RatingHeader rating={aggregate.rating} count={aggregate.count} />

        <div className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] lg:gap-6 xl:gap-8">
          <ReviewColumn
            key={`left-${safePage}`}
            reviews={screen.left}
            position="left"
            onOpen={setOpen}
          />

          {screen.video && (
            <VideoReviewCard
              key={`video-${safePage}-${screen.video.id}`}
              review={screen.video}
              onOpen={() => setOpen(screen.video!)}
            />
          )}

          <ReviewColumn
            key={`right-${safePage}`}
            reviews={screen.right}
            position="right"
            onOpen={setOpen}
          />
        </div>

        {screens.length > 1 && (
          <ScreenPager
            page={safePage}
            count={screens.length}
            onPrev={() => go(safePage - 1)}
            onNext={() => go(safePage + 1)}
            onSelect={go}
          />
        )}
      </div>

      {open && <ReviewModal r={open} onClose={() => setOpen(null)} />}
    </div>
  )
}

function ReviewColumn({
  reviews,
  position,
  onOpen,
}: {
  reviews: Review[]
  position: "left" | "right"
  onOpen: (review: Review) => void
}) {
  return (
    <div
      className={
        "order-2 grid min-w-0 gap-4 self-stretch lg:h-full lg:grid-rows-2 " +
        (position === "right" ? " md:order-3 lg:order-3" : " md:order-2 lg:order-1")
      }
    >
      {reviews.map((review, index) => (
        <TextReviewCard
          key={review.id}
          review={review}
          delay={(position === "left" ? index : index + 2) * 0.06}
          onOpen={() => onOpen(review)}
        />
      ))}
    </div>
  )
}

function ReviewCardContent({
  review,
  onOpen,
}: {
  review: Review
  onOpen?: () => void
}) {
  const isLong = (review.text?.length ?? 0) > 150

  return (
    <>
      <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <SourceWatermark source={review.source} />

      <div className="relative mb-4 min-w-0 pr-20">
        <div className="truncate text-[15px] font-extrabold leading-tight text-white">{review.author}</div>
        <div className="mt-1 text-[11px] text-white/40">{formatDate(review.date)}</div>
      </div>

      <Stars rating={review.rating} className="mb-3" />

      {review.car && (
        <div className="mb-3 inline-flex items-center border-l-2 border-[#c9a86e] pl-2.5 text-[11px] font-bold uppercase text-[#c9a86e]">
          {review.car}
        </div>
      )}

      <p
        className="relative line-clamp-4 flex-1 overflow-hidden text-[13.5px] leading-relaxed text-white/70"
      >
        {review.text}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#c9a86e] transition-colors hover:text-[#e8c98a]"
        >
          Читать полностью <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </>
  )
}

function TextReviewCard({
  review,
  delay,
  onOpen,
}: {
  review: Review
  delay: number
  onOpen: () => void
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className="group relative flex h-full min-h-[280px] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.075] bg-gradient-to-br from-[#1a2332] to-[#0e1720] p-5 text-white shadow-lux transition-colors hover:border-[#c9a86e]/40 lg:min-h-0"
    >
      <ReviewCardContent review={review} onOpen={onOpen} />
    </motion.article>
  )
}

function VideoReviewCard({
  review,
  onOpen,
}: {
  review: Review
  onOpen: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: 0.12 }}
      className="group relative order-1 mx-auto aspect-[9/16] w-full max-w-[330px] overflow-hidden rounded-2xl border border-[#c9a86e]/25 bg-[#080c12] text-left shadow-[0_30px_75px_-30px_rgba(0,0,0,0.95)] transition-[border-color,box-shadow] duration-300 hover:border-[#c9a86e]/65 hover:shadow-[0_34px_85px_-30px_rgba(201,168,110,0.32)] md:col-span-2 md:max-w-[350px] lg:order-2 lg:col-span-1 lg:max-w-none"
    >
      <Image
        src={review.poster!}
        alt={review.author}
        fill
        priority
        unoptimized
        sizes="(min-width: 1024px) 320px, 350px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080c12]/95 via-transparent to-black/20" />

      <div className="absolute left-4 top-4 flex items-center gap-2">
        <SourceLogo source={review.source} size={34} />
        <span className="rounded bg-black/55 px-2.5 py-1.5 text-[10px] font-semibold uppercase text-white backdrop-blur-sm">
          Видео-отзыв
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c9a86e] group-hover:text-[#0e1720] md:h-16 md:w-16">
          <Play className="ml-1 h-6 w-6 fill-current" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 md:p-5">
        <Stars rating={review.rating} className="mb-2" />
        <div className="text-sm font-extrabold leading-tight text-white md:text-base">{review.author}</div>
        {review.car && <div className="mt-1 text-xs font-semibold uppercase text-[#d7b879]">{review.car}</div>}
      </div>
    </motion.button>
  )
}

function ScreenPager({
  page,
  count,
  onPrev,
  onNext,
  onSelect,
}: {
  page: number
  count: number
  onPrev: () => void
  onNext: () => void
  onSelect: (page: number) => void
}) {
  return (
    <div className="relative mt-9 flex items-center justify-center gap-4 md:mt-10 md:gap-6">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Предыдущий экран отзывов"
        title="Предыдущий экран"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9a86e]/35 bg-[#111927] text-white transition-all hover:bg-[#c9a86e] hover:text-[#0e1720] active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden text-xs font-bold tabular-nums text-white/45 sm:block">
          {String(page + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Экран отзывов ${index + 1}`}
              className={
                "h-2 rounded-full transition-all duration-300 " +
                (index === page ? "w-8 bg-[#c9a86e]" : "w-2 bg-white/20 hover:bg-white/40")
              }
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label="Следующий экран отзывов"
        title="Следующий экран"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9a86e]/35 bg-[#111927] text-white transition-all hover:bg-[#c9a86e] hover:text-[#0e1720] active:scale-95"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
