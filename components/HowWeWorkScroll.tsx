"use client"

// Блок «Как мы работаем» со scroll-pin эффектом (по просьбе клиента).
// Десктоп: секция «прилипает» на весь экран, шаги сменяют друг друга по мере
// прокрутки (сам сайт визуально стоит), активная карточка чередуется
// лево/право (зигзаг). После последнего шага страница листается дальше.
// Мобилка: обычный вертикальный список (pin на тач-экранах капризен).
//
// ВАЖНО: компонент самодостаточный и легко откатывается — в page.tsx он
// подключается одной строкой, прежний статичный вариант сохранён в git.

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { LucideIcon } from "lucide-react"

export interface WorkStep {
  step: string
  title: string
  description: string
  Icon: LucideIcon
}

export default function HowWeWorkScroll({ steps }: { steps: WorkStep[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  // progress 0..1 внутри враппера. Начальное значение детерминировано (0),
  // поэтому SSR и первый клиентский кадр совпадают — hydration mismatch нет.
  const [progress, setProgress] = useState(0)

  // Прямой расчёт прогресса по скроллу (без framer useScroll, который не
  // цеплялся к ref). wrapRef всегда в DOM → getBoundingClientRect работает.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    const compute = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Пин активен, пока верх враппера ушёл вверх, а низ ещё не достиг низа
      // экрана. Диапазон прокрутки внутри пина = (высота враппера - 1 экран).
      const total = el.offsetHeight - vh
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      const p = total > 0 ? scrolled / total : 0
      setProgress(p)
      const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length - 1e-6)))
      setActive((prev) => {
        if (idx !== prev) setDir(idx > prev ? 1 : -1)
        return idx
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [steps.length])

  // Высота враппера: 100vh на сам пин + по ~62vh скролла на каждый доп. шаг.
  const wrapHeight = `${100 + (steps.length - 1) * 62}vh`
  const railScale = 0.04 + progress * 0.96

  const cur = steps[active]
  const CurIcon = cur.Icon
  // Зигзаг: чётный активный шаг — карточка ближе к правому краю,
  // нечётный — к левому. Плюс въезд по X в сторону движения.
  const alignRight = active % 2 === 0

  return (
    <section className="w-full bg-gradient-to-b from-[#0e1720] to-[#1a2332] orient-glow">
      {/* ==================== ДЕСКТОП: scroll-pin ==================== */}
      <div ref={wrapRef} className="relative hidden lg:block" style={{ height: wrapHeight }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div className="container mx-auto px-4 max-w-6xl w-full">
            {/* Заголовок — виден на всём протяжении пина */}
            <div className="text-center mb-10">
              <div className="flex justify-between items-center text-white/40 mb-6">
                <span className="section-index">06 / ПРОЦЕСС</span>
                <span className="section-index font-mono-num">
                  {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-center mb-4">
                <span className="kicker kicker--center">Всего {steps.length} шагов</span>
              </div>
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
                Как мы{" "}
                <span className="text-[#c9a86e] font-extrabold">работаем</span>
              </h2>
            </div>

            <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] gap-12 items-center">
              {/* Левая колонка: фото + вертикальная шкала прогресса */}
              <div className="flex items-stretch gap-5">
                <div className="relative flex-1">
                  <div className="absolute inset-x-10 bottom-2 h-24 bg-[#c9a86e]/25 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] shadow-lux">
                    <Image
                      src="/p/r1.jpg"
                      alt="Пример автомобиля из наших доставок (заглушка — клиент пришлёт вырезку Kia K5 2024)"
                      width={1000}
                      height={640}
                      className="w-full h-auto object-cover"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    {/* Крупный номер активного шага поверх фото */}
                    <div className="absolute left-5 bottom-4 flex items-end gap-2">
                      <span className="font-mono-num text-white text-6xl font-extrabold leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                        {cur.step.padStart(2, "0")}
                      </span>
                      <span className="text-white/50 text-sm mb-1.5 font-mono-num">
                        / {String(steps.length).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Вертикальная шкала прогресса */}
                <div className="relative w-1 rounded-full bg-white/[0.06] overflow-hidden self-stretch">
                  <motion.div
                    className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-[#c9a86e] to-[#d4b876] origin-top"
                    style={{ scaleY: railScale, height: "100%" }}
                  />
                </div>
              </div>

              {/* Правая колонка: активная карточка (зигзаг лево/право) */}
              <div className="relative min-h-[320px] flex items-center">
                <div className={`w-full flex ${alignRight ? "justify-end" : "justify-start"}`}>
                  <AnimatePresence mode="popLayout" custom={dir}>
                    <motion.div
                      key={active}
                      custom={dir}
                      initial={{ opacity: 0, x: dir * 60, filter: "blur(6px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: dir * -60, filter: "blur(6px)" }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="w-[88%] max-w-md"
                    >
                      <div className="relative rounded-3xl border border-[#c9a86e]/25 bg-gradient-to-br from-[#1a2332]/90 to-[#0e1720]/90 backdrop-blur-sm shadow-lux p-8">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] shadow-[0_0_24px_rgba(201,168,110,0.35)]">
                            <CurIcon className="w-6 h-6" />
                          </div>
                          <span className="text-[#c9a86e]/80 text-[11px] uppercase tracking-[0.35em] font-mono-num">
                            Шаг {cur.step.padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="text-white text-2xl lg:text-3xl font-semibold mb-4 leading-tight">
                          {cur.title}
                        </h3>
                        <p className="text-white/60 text-[15px] leading-relaxed">
                          {cur.description}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Точки-прогресс шагов */}
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-2.5">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-400 ${
                        i === active
                          ? "w-8 bg-[#c9a86e]"
                          : i < active
                          ? "w-1.5 bg-[#c9a86e]/50"
                          : "w-1.5 bg-white/15"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== МОБИЛКА: обычный список ==================== */}
      <div className="lg:hidden py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex justify-between items-center text-white/40 mb-6">
              <span className="section-index">06 / ПРОЦЕСС</span>
              <span className="section-index font-mono-num">{steps.length} SHAGOV</span>
            </div>
            <div className="flex justify-center mb-4">
              <span className="kicker kicker--center">Всего {steps.length} шагов</span>
            </div>
            <h2 className="text-white text-4xl font-light leading-[1.05]">
              Как мы <span className="text-[#c9a86e] font-extrabold">работаем</span>
            </h2>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-[#c9a86e]/0 via-[#c9a86e]/40 to-[#c9a86e]/0"
            />
            <div className="space-y-5">
              {steps.map((item, idx) => {
                const Icon = item.Icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-14"
                  >
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] shadow-[0_0_0_5px_rgba(10,15,26,1),0_0_18px_rgba(201,168,110,0.35)] z-10">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="rounded-2xl border border-[#c9a86e]/12 bg-white/[0.02] p-5">
                      <span className="text-[#c9a86e]/70 text-[10px] uppercase tracking-[0.35em] font-mono-num">
                        Шаг 0{item.step}
                      </span>
                      <h3 className="text-white text-lg font-semibold mt-1.5 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-white/55 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
