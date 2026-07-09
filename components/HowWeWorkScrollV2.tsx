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
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]) // узлы на оси
  // Прогресс заполнения оси 0..1 (по положению блока в вьюпорте).
  const [fill, setFill] = useState(0)
  // Геометрия оси в px относительно контейнера таймлайна: центр первого узла
  // (top) и расстояние до центра последнего (span). Полоска и точка живут
  // строго между первым и последним шагом.
  const [axis, setAxis] = useState({ top: 0, span: 0 })
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
    let curFill = 0 // сглаженное заполнение оси
    let targetFill = 0 // целевое (из скролла)
    let running = true

    // Дискретные величины (текущий шаг, реавил) читаем сразу при скролле —
    // им сглаживание не нужно.
    const readDiscrete = () => {
      const vh = window.innerHeight
      const centerY = vh / 2
      const sRect = section.getBoundingClientRect()

      // Ось строго между центрами первого и последнего узлов.
      const first = nodeRefs.current[0]
      const last = nodeRefs.current[steps.length - 1]
      if (first && last) {
        const fr = first.getBoundingClientRect()
        const lr = last.getBoundingClientRect()
        const topPx = fr.top + fr.height / 2 - sRect.top // отн. контейнера
        const bottomPx = lr.top + lr.height / 2 - sRect.top
        setAxis({ top: topPx, span: Math.max(1, bottomPx - topPx) })

        // Прогресс: 0 когда центр экрана у первого узла, 1 — у последнего.
        const firstMid = fr.top + fr.height / 2
        const lastMid = lr.top + lr.height / 2
        const denom = Math.max(1, lastMid - firstMid)
        targetFill = Math.min(1, Math.max(0, (centerY - firstMid) / denom))
      }

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
        nextRevealed[i] = revealed[i] || mid < vh * 0.88
      })
      setCurrent(nearest)
      if (nextRevealed.some((v, i) => v !== revealed[i])) setRevealed(nextRevealed)
    }

    // Непрерывный lerp только для точки-прогресса → плавное, сглаженное
    // движение вместо рывков за колесом.
    const tick = () => {
      if (!running) return
      curFill += (targetFill - curFill) * 0.1
      if (Math.abs(targetFill - curFill) < 0.0004) curFill = targetFill
      setFill(curFill)
      raf = requestAnimationFrame(tick)
    }

    const onScroll = () => readDiscrete()
    readDiscrete()
    curFill = targetFill // без рывка на первом кадре
    setFill(curFill)
    raf = requestAnimationFrame(tick)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      running = false
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

      <div className="container relative mx-auto px-4 max-w-5xl py-8 md:py-10">
        {/* Заголовок */}
        <div className="text-center mb-5 md:mb-6">
          <div className="flex justify-between items-center text-white/40 mb-5">
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
          {/* Центральная ось: строго от центра первого узла до центра
              последнего (top/span в px), а не по всей высоте контейнера. */}
          <div
            className="absolute md:left-1/2 left-5 md:-translate-x-1/2 w-px bg-white/[0.08]"
            style={{ top: `${axis.top}px`, height: `${axis.span}px` }}
          />
          {/* Заполненная часть оси + бегущая точка-прогресс */}
          <div
            className="absolute md:left-1/2 left-5 md:-translate-x-1/2 w-px bg-gradient-to-b from-[#c9a86e] to-[#d4b876]"
            style={{ top: `${axis.top}px`, height: `${fill * axis.span}px` }}
          >
            {/* Точка-прогресс на конце заполненной оси */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#c9a86e] shadow-[0_0_0_5px_rgba(201,168,110,0.18),0_0_22px_rgba(201,168,110,0.6)]">
              <div className="absolute inset-0 rounded-full bg-[#c9a86e] animate-ping opacity-40" />
            </div>
          </div>

          <div className="space-y-2.5 md:space-y-3 py-1">
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
                  <div
                    ref={(el) => {
                      nodeRefs.current[i] = el
                    }}
                    className="absolute md:static md:col-start-2 md:row-start-1 left-5 md:left-auto -translate-x-1/2 md:translate-x-0 top-5 md:top-auto z-20 flex justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.35 : 1,
                        opacity: show ? 1 : 0.3,
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={
                        "rounded-full flex items-center justify-center transition-colors duration-500 " +
                        (isCurrent
                          ? "w-4 h-4 bg-[#c9a86e] shadow-[0_0_0_5px_rgba(201,168,110,0.18),0_0_18px_rgba(201,168,110,0.6)]"
                          : isPast
                          ? "w-3 h-3 bg-[#c9a86e]/60"
                          : "w-3 h-3 bg-white/20 ring-2 ring-[#0e1720]")
                      }
                    />
                    {/* прячем узел за точкой-прогрессом, чтобы не спорили */}
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
                      "pl-14 md:pl-0 md:row-start-1 " +
                      (left
                        ? "md:col-start-1 md:pr-12"
                        : "md:col-start-3 md:pl-12")
                    }
                  >
                    <div
                      className={
                        "group/card relative w-full overflow-hidden rounded-2xl border px-6 py-5 transition-colors duration-500 " +
                        (isCurrent
                          ? "border-[#c9a86e]/45 bg-gradient-to-br from-[#20304a] to-[#0e1720] shadow-[0_24px_60px_-25px_rgba(0,0,0,0.85),0_0_44px_-14px_rgba(201,168,110,0.28)]"
                          : "border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-white/[0.01]")
                      }
                    >
                      {/* Крупный номер-«ватермарка» на фоне — заполняет пустоту */}
                      <span
                        className={
                          "pointer-events-none absolute -top-4 font-mono-num font-extrabold leading-none select-none transition-colors duration-500 " +
                          (left ? "right-4" : "right-4") + " " +
                          (isCurrent ? "text-[#c9a86e]/[0.14]" : "text-white/[0.05]")
                        }
                        style={{ fontSize: "5.5rem" }}
                      >
                        {s.step.padStart(2, "0")}
                      </span>
                      {/* Верхний блик по краю карточки */}
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <div
                        className={
                          "relative flex items-start gap-4 " +
                          (left ? "md:flex-row-reverse md:text-right" : "")
                        }
                      >
                        {/* Иконка внутри карточки */}
                        <div
                          className={
                            "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border transition-colors duration-500 " +
                            (isCurrent
                              ? "bg-gradient-to-br from-[#c9a86e] to-[#d4b876] text-[#0e1720] border-transparent shadow-[0_0_22px_rgba(201,168,110,0.4)]"
                              : "bg-white/[0.05] text-[#c9a86e]/80 border-white/10")
                          }
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className={"mb-1 " + (left ? "md:text-right" : "")}>
                            <span className="text-[#c9a86e]/80 text-[10px] uppercase tracking-[0.35em] font-mono-num">
                              Шаг {s.step.padStart(2, "0")}
                            </span>
                          </div>
                          <h3
                            className={
                              "text-white font-semibold mb-1.5 leading-tight transition-all duration-500 " +
                              (isCurrent ? "text-xl lg:text-2xl" : "text-lg lg:text-xl")
                            }
                          >
                            {s.title}
                          </h3>
                          <p className="text-white/55 text-sm leading-relaxed">
                            {s.description}
                          </p>
                        </div>
                      </div>
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
