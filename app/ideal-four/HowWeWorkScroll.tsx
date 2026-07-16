"use client"

// Блок «Как мы работаем» со scroll-pin эффектом (по просьбе клиента).
// Десктоп: секция «прилипает» на весь экран, шаги сменяют друг друга по мере
// прокрутки (сам сайт визуально стоит), активная карточка чередуется
// лево/право (зигзаг). После последнего шага страница листается дальше.
// Мобилка: отдельный компактный sticky-pin, шаги также меняются по скроллу.
//
// ВАЖНО: компонент самодостаточный и легко откатывается — в page.tsx он
// подключается одной строкой, прежний статичный вариант сохранён в git.

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

export interface WorkStep {
  step: string
  title: string
  description: string
  Icon: LucideIcon
}

export default function HowWeWorkScroll({ steps }: { steps: WorkStep[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const mobileWrapRef = useRef<HTMLDivElement>(null)
  // Дробная позиция колоды (0..N-1) — плавно догоняет цель по скроллу (lerp),
  // поэтому карточки перетекают маслянисто, а не прыгают по шагам.
  const [pos, setPos] = useState(0)
  const [progress, setProgress] = useState(0)
  // Фаза пина: 'before' | 'pinned' | 'after'. fixed вместо sticky —
  // sticky ломается от overflow у предков, fixed от него не зависит.
  const [phase, setPhase] = useState<"before" | "pinned" | "after">("before")
  const [mobileProgress, setMobileProgress] = useState(0)
  const [mobileActive, setMobileActive] = useState(0)
  const [mobilePhase, setMobilePhase] = useState<"before" | "pinned" | "after">("before")

  // Непрерывный rAF-цикл: каждый кадр читаем скролл → целевую позицию, и
  // сглаживаем к ней текущую (экспоненциальный lerp). Это даёт инерцию и
  // «маслянистое» перетекание карточек вместо ступенек.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    let cur = 0 // текущая (сглаженная) позиция
    let target = 0 // целевая позиция из скролла
    let listening = false
    const desktopQuery = window.matchMedia("(min-width: 1024px)")
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const stopAnimation = () => {
      if (!raf) return
      cancelAnimationFrame(raf)
      raf = 0
    }

    const tick = () => {
      const distance = target - cur

      if (Math.abs(distance) < 0.0005) {
        cur = target
        setPos(cur)
        raf = 0
        return
      }

      cur += distance * 0.11
      setPos(cur)
      raf = requestAnimationFrame(tick)
    }

    const moveToTarget = (immediate = false) => {
      if (immediate || reducedMotionQuery.matches) {
        stopAnimation()
        cur = target
        setPos(cur)
        return
      }

      if (!raf) raf = requestAnimationFrame(tick)
    }

    const readTarget = (immediate = false) => {
      if (!desktopQuery.matches) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = el.offsetHeight - vh
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      const p = total > 0 ? scrolled / total : 0
      setProgress(p)
      if (rect.top > 0) setPhase("before")
      else if (-rect.top >= total) setPhase("after")
      else setPhase("pinned")
      // СНАП к ключевым кадрам: цель округляем до ближайшего целого шага.
      // Между двумя состояниями «зависнуть» нельзя — цель всегда целая, а
      // плавность даёт lerp ниже (cur мягко доезжает до цели).
      const rawStep = p * (steps.length - 1)
      target = Math.max(0, Math.min(steps.length - 1, Math.round(rawStep)))
      moveToTarget(immediate)
    }

    const onScroll = () => readTarget()
    const addViewportListeners = () => {
      if (listening) return
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)
      listening = true
    }

    const removeViewportListeners = () => {
      if (!listening) return
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      listening = false
    }

    const syncViewportMode = () => {
      if (desktopQuery.matches) {
        addViewportListeners()
        readTarget(true)
        return
      }

      removeViewportListeners()
      stopAnimation()
      cur = 0
      target = 0
      setPos(0)
      setProgress(0)
      setPhase("before")
    }

    const syncMotionPreference = () => {
      if (reducedMotionQuery.matches) moveToTarget(true)
      else readTarget()
    }

    desktopQuery.addEventListener("change", syncViewportMode)
    reducedMotionQuery.addEventListener("change", syncMotionPreference)
    syncViewportMode()

    return () => {
      removeViewportListeners()
      stopAnimation()
      desktopQuery.removeEventListener("change", syncViewportMode)
      reducedMotionQuery.removeEventListener("change", syncMotionPreference)
    }
  }, [steps.length])

  useEffect(() => {
    const el = mobileWrapRef.current
    if (!el) return

    const mobileQuery = window.matchMedia("(max-width: 1023px)")
    let raf = 0
    let listening = false

    const readMobileProgress = () => {
      raf = 0
      if (!mobileQuery.matches) return

      const stickyTop = 60
      const viewportHeight = Math.max(1, window.innerHeight - stickyTop)
      const rect = el.getBoundingClientRect()
      const total = Math.max(1, el.offsetHeight - viewportHeight)
      const scrolled = Math.min(Math.max(stickyTop - rect.top, 0), total)
      const nextProgress = scrolled / total
      const nextActive = Math.min(
        steps.length - 1,
        Math.floor(nextProgress * steps.length),
      )

      if (rect.top > stickyTop) setMobilePhase("before")
      else if (stickyTop - rect.top >= total) setMobilePhase("after")
      else setMobilePhase("pinned")
      setMobileProgress(nextProgress)
      setMobileActive(Math.max(0, nextActive))
    }

    const requestRead = () => {
      if (!raf) raf = requestAnimationFrame(readMobileProgress)
    }

    const addListeners = () => {
      if (listening) return
      window.addEventListener("scroll", requestRead, { passive: true })
      window.addEventListener("resize", requestRead)
      listening = true
    }

    const removeListeners = () => {
      if (!listening) return
      window.removeEventListener("scroll", requestRead)
      window.removeEventListener("resize", requestRead)
      listening = false
    }

    const syncMode = () => {
      if (mobileQuery.matches) {
        addListeners()
        requestRead()
      } else {
        removeListeners()
        if (raf) cancelAnimationFrame(raf)
        raf = 0
        setMobilePhase("before")
      }
    }

    mobileQuery.addEventListener("change", syncMode)
    syncMode()

    return () => {
      removeListeners()
      if (raf) cancelAnimationFrame(raf)
      mobileQuery.removeEventListener("change", syncMode)
    }
  }, [steps.length])

  // Высота враппера: 100vh на сам пин + по ~38vh скролла на каждый доп. шаг.
  // Меньше vh на шаг = меньше надо крутить (быстрее сменяются кадры).
  const wrapHeight = `${100 + (steps.length - 1) * 38}vh`
  const railScale = 0.04 + progress * 0.96
  const active = Math.max(0, Math.min(steps.length - 1, Math.round(pos)))

  const cur = steps[active] // для крупного номера шага поверх фото
  const mobileCur = steps[mobileActive]
  const MobileStepIcon = mobileCur.Icon
  const mobileWrapHeight = `${100 + (steps.length - 1) * 52}svh`

  return (
    <section className="ideal4-process w-full overflow-x-clip">
      {/* ==================== ДЕСКТОП: scroll-pin ==================== */}
      <div ref={wrapRef} className="relative hidden lg:block" style={{ height: wrapHeight }}>
        {/* Контент фиксируется на весь экран во время фазы pinned (position:
            fixed → не зависит от overflow предков, в отличие от sticky).
            До/после — прижат к верху/низу спейсера. */}
        <div
          className={
            "left-0 right-0 h-screen overflow-hidden flex flex-col justify-center " +
            // Собственный непрозрачный фон → во время пина панель полностью
            // перекрывает то, что скроллится позади (фон визуально неподвижен).
            // ВАЖНО: НЕ используем класс .orient-glow — он задаёт position:relative
            // и (из-за порядка в CSS) перебивает position:fixed, ломая фиксацию.
            // Свечение делаем дочерними div-ами ниже.
            "ideal4-process-panel " +
            (phase === "pinned"
              ? "fixed top-0 z-30"
              : phase === "after"
              ? "absolute bottom-0"
              : "absolute top-0")
          }
        >
          {/* Декоративное свечение (замена orient-glow, без position:relative) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-[22%] left-[42%] -translate-x-1/2 w-[34vw] h-[34vw] max-w-[540px] max-h-[540px] rounded-full bg-[#c9a86e]/[0.065] blur-[130px]" />
            <div className="absolute bottom-[18%] left-[8%] w-[30vw] h-[30vw] max-w-[480px] max-h-[480px] rounded-full bg-[#c9a86e]/[0.045] blur-[130px]" />
          </div>

          <div className="container relative mx-auto px-4 max-w-6xl w-full">
            {/* Заголовок — виден на всём протяжении пина */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 text-center"
            >
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
            </motion.div>

            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] items-center gap-14">
              {/* Левая колонка: фото + вертикальная шкала прогресса */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-stretch gap-8"
              >
                <div className="relative flex min-h-[350px] flex-1 items-center justify-center overflow-visible py-4">
                  <div className="pointer-events-none absolute left-[48%] top-[45%] h-52 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a86e]/[0.085] blur-[90px]" />
                  <div className="pointer-events-none absolute bottom-[16%] left-[48%] h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-2xl" />
                  <div className="pointer-events-none absolute bottom-[19%] left-[48%] h-px w-[52%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c9a86e]/45 to-transparent" />
                  <div className="relative z-[2] w-[118%] max-w-none -translate-x-[5%] -translate-y-2">
                    <Image
                      src="/kiak5.webp"
                      alt="Kia K5"
                      width={900}
                      height={600}
                      className="h-auto w-full scale-x-[-1] object-contain drop-shadow-[0_26px_23px_rgba(0,0,0,0.48)]"
                      priority={false}
                    />
                  </div>
                  <div className="absolute bottom-3 left-1 z-[3] flex items-end gap-2">
                    <span className="font-mono-num text-5xl font-extrabold leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                      {cur.step.padStart(2, "0")}
                    </span>
                    <span className="mb-1 font-mono-num text-xs text-white/45">
                      / {String(steps.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Вертикальная шкала прогресса */}
                <div className="relative z-10 h-[300px] w-px shrink-0 self-center overflow-hidden rounded-full bg-white/[0.075]">
                  <motion.div
                    className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-[#c9a86e] to-[#d4b876] origin-top"
                    style={{ scaleY: railScale, height: "100%" }}
                  />
                </div>
              </motion.div>

              {/* Правая колонка: 3D-колода карточек. Всегда видно предыдущую →
                  текущую → следующую. БЕЗ мерцания: (1) все карточки постоянно
                  в DOM (никаких return null → нет монтирования/размонтирования);
                  (2) НЕТ filter:blur и backdrop-blur — на 3D-слоях они моргают
                  в браузере; затенение делаем тёмным оверлеем + прозрачностью;
                  (3) дальние карточки не доходят до opacity 0, а прячутся за
                  ближними по z-index. Плавность — lerp по дробной позиции. */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-[460px]"
                style={{
                  perspective: "1600px",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {steps.map((s, i) => {
                    const StepIcon = s.Icon
                    const offset = i - pos // 0 = в фокусе; ± = выше/ниже
                    const abs = Math.min(Math.abs(offset), 3)
                    // Геометрия колоды (всё непрерывно по offset — нет прыжков)
                    const y = offset * 132 // вертикальный разнос, px
                    const z = -abs * 160 // вглубь
                    const rotX = Math.max(-30, Math.min(30, -offset * 11)) // наклон
                    const scale = Math.max(0.7, 1 - abs * 0.09)
                    // Прозрачность самой карточки держим высокой (не мерцает),
                    // «уводим вдаль» затемняющим оверлеем ниже.
                    const cardOpacity = Math.max(0.08, 1 - abs * 0.35)
                    const shade = Math.min(0.84, abs * 0.55) // тёмный оверлей
                    const isActive = abs < 0.5
                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-[48%] w-[92%] max-w-md"
                        style={{
                          zIndex: 100 - Math.round(abs * 10),
                          transform: `translate3d(-50%, -50%, 0) translateY(${y}px) translateZ(${z}px) rotateX(${rotX}deg) scale(${scale})`,
                          opacity: cardOpacity,
                          transformStyle: "preserve-3d",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <div
                          className={
                            "relative rounded-[26px] border p-8 " +
                            (isActive
                              ? "border-[#c9a86e]/45 bg-gradient-to-br from-[#20304a] to-[#0e1720] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(201,168,110,0.15),0_0_60px_-10px_rgba(201,168,110,0.25)]"
                              : "border-white/[0.08] bg-gradient-to-br from-[#182234] to-[#0e1720] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]")
                          }
                        >
                          {/* Затемняющий оверлей для дальних карточек (вместо
                              blur — не мерцает). Плавно исчезает у активной. */}
                          <div
                            className="pointer-events-none absolute inset-0 rounded-[26px] bg-[#0a0f1a]"
                            style={{ opacity: shade }}
                          />
                          {/* Верхний блик */}
                          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                          <div className="relative mb-5 flex items-center">
                            <div className="flex items-center gap-4">
                              <div
                                className={
                                  "w-14 h-14 rounded-2xl flex items-center justify-center " +
                                  (isActive
                                    ? "bg-gradient-to-br from-[#c9a86e] to-[#d4b876] text-[#0e1720] shadow-[0_0_28px_rgba(201,168,110,0.45)]"
                                    : "bg-white/[0.06] text-[#c9a86e]")
                                }
                              >
                                <StepIcon className="w-6 h-6" />
                              </div>
                              <span className="text-[#c9a86e]/80 text-[11px] uppercase tracking-[0.35em] font-mono-num">
                                Шаг {s.step.padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                          <h3 className="relative text-white text-2xl lg:text-3xl font-semibold mb-4 leading-tight">
                            {s.title}
                          </h3>
                          <p className="relative text-white/60 text-[15px] leading-relaxed">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Точки-прогресс шагов */}
              <div className="col-span-full flex justify-center gap-2.5 mt-8">
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

      {/* ==================== МОБИЛКА: тот же scroll-pin, компактная компоновка ==================== */}
      <div ref={mobileWrapRef} className="relative lg:hidden" style={{ height: mobileWrapHeight }}>
        <div
          className={
            "left-0 right-0 flex h-[calc(100svh-60px)] flex-col overflow-hidden bg-gradient-to-b from-[#0e1720] to-[#1a2332] " +
            (mobilePhase === "pinned"
              ? "fixed top-[60px] z-30"
              : mobilePhase === "after"
                ? "absolute bottom-0"
                : "absolute top-0")
          }
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[35%] h-64 w-64 -translate-x-1/2 rounded-full bg-[#c9a86e]/10 blur-[90px]" />
          </div>

          <div className="container relative mx-auto flex h-full w-full flex-col px-4 py-4">
            <div className="mb-3 flex shrink-0 items-center justify-between text-white/40">
              <span className="section-index">06 / ПРОЦЕСС</span>
              <span className="section-index font-mono-num">
                {String(mobileActive + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
            </div>

            <div className="shrink-0 text-center">
              <div className="mb-2 flex justify-center">
                <span className="kicker kicker--center">Всего {steps.length} шагов</span>
              </div>
              <h2 className="text-3xl font-light leading-[1.05] text-white sm:text-4xl">
                Как мы <span className="font-extrabold text-[#c9a86e]">работаем</span>
              </h2>
            </div>

            <div className="relative mx-auto mt-4 min-h-0 w-full max-w-md flex-1">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileActive}
                  initial={{ opacity: 0, x: 48, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -48, scale: 0.985 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col overflow-visible"
                >
              <div className="relative min-h-[150px] flex-[0.95] overflow-visible">
                <div className="pointer-events-none absolute left-1/2 top-[48%] z-[1] h-36 w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a86e]/10 blur-[65px]" />
                <div className="pointer-events-none absolute bottom-[13%] left-1/2 z-[1] h-5 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-lg" />
                <div className="pointer-events-none absolute bottom-[15%] left-1/2 z-[1] h-px w-[68%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c9a86e]/50 to-transparent" />
                <Image
                  src="/kiak5.webp"
                  alt="Kia K5"
                  fill
                  sizes="(max-width: 1023px) 100vw, 0px"
                  className="z-[2] scale-[1.08] object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.5)]"
                />
                <div className="absolute inset-x-1 bottom-0 z-[4] flex items-end justify-between">
                  <div>
                    <span className="font-mono-num text-[10px] uppercase tracking-[0.28em] text-[#d9bd83]">
                      Текущий этап
                    </span>
                    <div className="mt-1 font-mono-num text-5xl font-extrabold leading-none text-white drop-shadow-lg">
                      {mobileCur.step.padStart(2, "0")}
                    </div>
                  </div>
                  <span className="font-mono-num text-xs text-white/55">
                    / {String(steps.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="relative flex flex-[1.05] flex-col px-1 pb-2 pt-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a86e]/50 to-transparent" />
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c9a86e] to-[#d4b876] text-[#0e1720] shadow-[0_0_26px_rgba(201,168,110,0.35)]">
                    <MobileStepIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono-num text-[10px] uppercase tracking-[0.28em] text-[#c9a86e]/75">
                      Шаг {mobileCur.step.padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold leading-tight text-white">
                      {mobileCur.title}
                    </h3>
                  </div>
                </div>

                <p className="relative mt-4 text-sm leading-relaxed text-white/65">
                  {mobileCur.description}
                </p>

                <div className="mt-auto border-t border-white/[0.07] pt-4">
                  <span className="font-mono-num text-[9px] uppercase tracking-[0.18em] text-white/30">
                    {mobileActive < steps.length - 1
                      ? `Далее · ${steps[mobileActive + 1].title}`
                      : "Последний этап · автомобиль ваш"}
                  </span>
                </div>
              </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mx-auto mt-4 w-full max-w-md shrink-0">
              <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] transition-[width] duration-150"
                  style={{ width: `${Math.max(4, mobileProgress * 100)}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === mobileActive ? "w-6 bg-[#c9a86e]" : "w-1.5 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono-num text-[9px] uppercase tracking-[0.18em] text-white/35">
                  Листайте вниз
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
