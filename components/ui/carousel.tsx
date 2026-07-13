"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CarouselProps = {
  children: React.ReactNode
  className?: string
}

const CarouselContext = React.createContext<{
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} | null>(null)

function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error("useCarousel must be used within <Carousel>")
  return ctx
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ children, className }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(true)

    const updateScrollState = React.useCallback(() => {
      const el = scrollRef.current
      if (!el) return
      setCanScrollPrev(el.scrollLeft > 0)
      setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
    }, [])

    const scrollPrev = React.useCallback(() => {
      const el = scrollRef.current
      if (el) {
        el.scrollBy({ left: -el.clientWidth / 2, behavior: "smooth" })
        setTimeout(updateScrollState, 300)
      }
    }, [updateScrollState])

    const scrollNext = React.useCallback(() => {
      const el = scrollRef.current
      if (el) {
        el.scrollBy({ left: el.clientWidth / 2, behavior: "smooth" })
        setTimeout(updateScrollState, 300)
      }
    }, [updateScrollState])

    React.useEffect(() => {
      const el = scrollRef.current
      if (el) {
        el.addEventListener("scroll", updateScrollState, { passive: true })
        return () => el.removeEventListener("scroll", updateScrollState)
      }
    }, [updateScrollState])

    return (
      <CarouselContext.Provider value={{ scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
        <div ref={ref} className={`relative ${className ?? ""}`}>
          {children}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {children}
          </div>
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className }, ref) => (
    <div ref={ref} className={`flex ${className ?? ""}`}>
      {children}
    </div>
  )
)
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className }, ref) => (
    <div ref={ref} className={`snap-start shrink-0 ${className ?? ""}`}>
      {children}
    </div>
  )
)
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<HTMLButtonElement, { className?: string }>(
  ({ className }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel()
    return (
      <button
        ref={ref}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-30 ${className ?? ""}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, { className?: string }>(
  ({ className }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel()
    return (
      <button
        ref={ref}
        disabled={!canScrollNext}
        onClick={scrollNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-30 ${className ?? ""}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
