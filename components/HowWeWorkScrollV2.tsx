"use client"

// «Как мы работаем» — ВЕРСИЯ 2 (эксперимент, живёт рядом с v1).
// Без фиксации блока: обычный вертикальный зигзаг-таймлайн, всё завязано
// на скролл. Центральная ось с бегущей точкой-прогрессом; шаги появляются
// слева/справа по мере доскролла (новые изначально скрыты); текущий шаг
// (ближайший к центру экрана) крупнее и выделен, пройденные — приглушены.

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

export interface WorkStep {
  step: string
  title: string
  description: string
  Icon: LucideIcon
}

export default function HowWeWorkScrollV2({ steps }: { steps: WorkStep[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  // Прогресс заполнения оси 0..1 (по положению блока в вьюпорте).
  const [fill, setFill] = useState(0)
  // Индекс «текущего» шага — ближайшего к центру экрана.
  const [current, setCurrent] = useState(0)
  // Какие шаги уже показались (появились при доскролле). Изначально виден
  // только первый — остальные «проявляются», когда доезжают до нижней зоны.
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    steps.map((_, i) => i === 0)
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    let raf = 0

    const compute = () => {
      raf = 0
      const vh = window.innerHeight
      const centerY = vh / 2

      // Прогресс оси: 0 когда верх блока у центра экрана, 1 когда низ у центра.
      const rect = section.getBoundingClientRect()
      const denom = rect.height
      const f = Math.min(1, Math.max(0, (centerY - rect.top) / denom))
      setFill(f)

      // Определяем текущий шаг + реавил уже видимых.
      let nearest = 0
      let nearestDist = Infinity
      const nextRevealed: boolean[] = []
      itemRefs.current.forEach((el, i) => {
        if (!el) {
          nextRevealed[i] = revealed[i]
          return
        }
        const r = el.getBoundingClientRect()
        const mid = r.top + r.height / 2
        const dist = Math.abs(mid - centerY)
        if (dist < nearestDist) {
          nearestDist = dist
          nearest = i
        }
        // Показываем шаг, когда его центр поднялся выше 88% высоты экрана.
        nextRevealed[i] = revealed[i] || mid < vh * 0.88
      })
      setCurrent(nearest)
      if (nextRevealed.some((v, i) => v !== revealed[i])) setRevealed(nextRevealed)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length])

  return (
    <section className="w-full bg-gradient-to-b from-[#0e1720] to-[#1a2332] relative overflow-hidden">
      {/* Мягкое свечение по краям (без класса orient-glow) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[4%] w-[38vw] h-[38vw] rounded-full bg-[#c9a86e]/[0.06] blur-[130px]" />
        <div className="absolute bottom-[6%] right-[4%] w-[34vw] h-[34vw] rounded-full bg-[#c9a86e]/[0.05] blur-[130px]" />
      </div>

      <div className="container relative mx-auto px-4 max-w-5xl py-16 md:py-24">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-center text-white/40 mb-6">
            <span className="section-index">06 / ПРОЦЕСС · V2</span>
            <span className="section-index font-mono-num">
              {String(current + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex justify-center mb-4">
            <span className="kicker kicker--center">Всего {steps.length} шагов</span>
          </div>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
            Как мы <span className="text-[#c9a86e] font-extrabold">работаем</span>
          </h2>
        </div>

        {/* Таймлайн */}
        <div ref={sectionRef} className="relative">
          {/* Центральная ось (десктоп — по центру, мобилка — слева) */}
          <div className="absolute md:left-1/2 left-5 top-0 bottom-0 md:-translate-x-1/2 w-px bg-white/[0.08]" />
          {/* Заполненная часть оси + бегущая точка-прогресс */}
          <div
            className="absolute md:left-1/2 left-5 top-0 md:-translate-x-1/2 w-px bg-gradient-to-b from-[#c9a86e] to-[#d4b876]"
            style={{ height: `${fill * 100}%` }}
          >
            {/* Точка-прогресс на конце заполненной оси */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#c9a86e] shadow-[0_0_0_5px_rgba(201,168,110,0.18),0_0_22px_rgba(201,168,110,0.6)]">
              <div className="absolute inset-0 rounded-full bg-[#c9a86e] animate-ping opacity-40" />
            </div>
          </div>

          <div className="space-y-16 md:space-y-24 py-4">
            {steps.map((s, i) => {
              const Icon = s.Icon
              const isCurrent = i === current
              const isPast = i < current
              const show = revealed[i]
              const left = i % 2 === 0 // чётные слева, нечётные справа (десктоп)
              return (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-0"
                >
                  {/* Узел на оси */}
                  <div className="absolute md:static md:col-start-2 md:row-start-1 left-5 md:left-auto -translate-x-1/2 md:translate-x-0 top-6 md:top-auto z-20 flex justify-center">
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.15 : 1,
                        opacity: show ? 1 : 0.3,
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={
                        "w-11 h-11 rounded-2xl flex items-center justify-center border transition-colors duration-500 " +
                        (isCurrent
                          ? "bg-gradient-to-br from-[#c9a86e] to-[#d4b876] text-[#0e1720] border-transparent shadow-[0_0_26px_rgba(201,168,110,0.5)]"
                          : isPast
                          ? "bg-[#c9a86e]/15 text-[#c9a86e]/70 border-[#c9a86e]/25"
                          : "bg-white/[0.04] text-white/40 border-white/10")
                      }
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  </div>

                  {/* Карточка шага — слева или справа от оси */}
                  <motion.div
                    animate={{
                      opacity: show ? (isCurrent ? 1 : isPast ? 0.55 : 0.85) : 0,
                      x: show ? 0 : left ? -40 : 40,
                      y: show ? 0 : 24,
                      scale: isCurrent ? 1 : 0.965,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                    className={
                      "pl-16 md:pl-0 md:row-start-1 " +
                      (left
                        ? "md:col-start-1 md:pr-12 md:text-right"
                        : "md:col-start-3 md:pl-12")
                    }
                  >
                    <div
                      className={
                        "relative inline-block w-full rounded-3xl border p-6 lg:p-7 transition-colors duration-500 " +
                        (isCurrent
                          ? "border-[#c9a86e]/45 bg-gradient-to-br from-[#20304a] to-[#0e1720] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85),0_0_50px_-14px_rgba(201,168,110,0.28)]"
                          : "border-white/[0.08] bg-white/[0.02]")
                      }
                    >
                      <div
                        className={
                          "flex items-center gap-3 mb-2.5 " +
                          (left ? "md:justify-end" : "")
                        }
                      >
                        <span className="text-[#c9a86e]/80 text-[11px] uppercase tracking-[0.35em] font-mono-num">
                          Шаг {s.step.padStart(2, "0")}
                        </span>
                      </div>
                      <h3
                        className={
                          "text-white font-semibold mb-2.5 leading-tight transition-all duration-500 " +
                          (isCurrent ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl")
                        }
                      >
                        {s.title}
                      </h3>
                      <p className="text-white/60 text-[15px] leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
