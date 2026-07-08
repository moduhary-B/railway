import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string
  size?: "sm" | "md" | "lg"
  bordered?: boolean
  bgVariant?: "default" | "alt" | "transparent"
  containerClassName?: string
  patterned?: boolean
}

// Единая обёртка секции — одинаковые вертикальные отступы, опциональная рамка,
// чередующийся фон (alt) для шахматного визуального разделения, паттерн из лого.
export function Section({
  id,
  size = "md",
  bordered = false,
  bgVariant = "default",
  patterned = false,
  containerClassName,
  className,
  children,
  ...rest
}: SectionProps) {
  const padY = size === "sm" ? "py-12 md:py-16" : size === "lg" ? "py-24 md:py-32" : "py-16 md:py-24"
  const bg =
    bgVariant === "alt"
      ? "bg-[#0e1720]"
      : bgVariant === "transparent"
        ? "bg-transparent"
        : "bg-[#0a0f1a]"
  return (
    <section
      id={id}
      className={cn("relative w-full", bg, padY, patterned && "orient-glow", className)}
      {...rest}
    >
      <div
        className={cn(
          "container mx-auto px-4",
          bordered &&
            "rounded-2xl border border-[#c9a86e]/15 bg-gradient-to-br from-[#0e1720]/60 to-[#0a0f1a]/60 p-6 md:p-10",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
