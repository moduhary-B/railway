"use client"

import Image from "next/image"
import { SiInstagram, SiTelegram, SiWhatsapp, SiYoutube } from "react-icons/si"
import { cn } from "@/lib/utils"

export type SocialNetwork = "max" | "whatsapp" | "telegram" | "youtube" | "instagram"

export interface SocialLink {
  network: SocialNetwork
  href: string
  label?: string
}

// Официальные URL мессенджеров/соцсетей Orient Auto (из правок клиента)
export const ORIENT_SOCIALS: Record<SocialNetwork, { href: string; label: string }> = {
  max: { href: "https://max.ru/id253401357515_biz", label: "MAX" },
  whatsapp: { href: "https://wa.me/79958689768", label: "WhatsApp" },
  telegram: { href: "https://t.me/al_orientauto", label: "Telegram" },
  youtube: { href: "https://youtube.com/@orientauto_ru?si=5clsE_vZHCv3Iawc", label: "YouTube" },
  instagram: {
    href: "https://www.instagram.com/orientauto.ru?igsh=MTc3c3k0Z2J0ZWRtOA==",
    label: "Instagram",
  },
}

// Ссылки на каналы/сообщества (не личные диалоги)
export const ORIENT_CHANNELS: Partial<Record<SocialNetwork, { href: string; label: string }>> = {
  telegram: { href: "https://t.me/orientauto_ru", label: "Telegram-канал" },
  max: { href: "https://max.ru/id253401357515_biz", label: "MAX-канал" },
}

// Ссылка на групповой чат менеджеров
export const ORIENT_CHAT_MAX = "https://max.ru/id253401357515_biz"
export const ORIENT_CHAT_TG = "https://t.me/orientauto_chat"

const BRAND_COLORS: Record<Exclude<SocialNetwork, "max" | "instagram">, string> = {
  whatsapp: "#25D366",
  telegram: "#26A5E4",
  youtube: "#FF0000",
}

interface SocialIconProps {
  network: SocialNetwork
  size?: number
  className?: string
  colored?: boolean
}

// Одна иконка без ссылки — для использования внутри собственных враперов
export function SocialIcon({ network, size = 24, className, colored = true }: SocialIconProps) {
  const iconStyle = colored && network in BRAND_COLORS ? { color: BRAND_COLORS[network as keyof typeof BRAND_COLORS] } : undefined

  switch (network) {
    case "max":
      return (
        <Image
          src="/icons/max-mark.svg"
          alt="MAX"
          width={size}
          height={size}
          className={cn("rounded-[22%]", className)}
          style={{ width: size, height: size }}
        />
      )
    case "whatsapp":
      return <SiWhatsapp size={size} className={className} style={iconStyle} />
    case "telegram":
      return <SiTelegram size={size} className={className} style={iconStyle} />
    case "youtube":
      return <SiYoutube size={size} className={className} style={iconStyle} />
    case "instagram":
      // Instagram — официальный SVG с бренд-градиентом (скачан с Wikimedia Commons)
      return colored ? (
        <Image
          src="/icons/instagram.svg"
          alt="Instagram"
          width={size}
          height={size}
          style={{ width: size, height: size }}
          className={className}
        />
      ) : (
        <SiInstagram size={size} className={className} />
      )
    default:
      return null
  }
}

// Ссылка-квадрат с бренд-иконкой (для рядов иконок в шапке / контактах / футере)
export function SocialLinkButton({
  network,
  href,
  label,
  size = 24,
  variant = "square",
}: SocialLink & { size?: number; variant?: "square" | "bare" }) {
  const shown = label ?? ORIENT_SOCIALS[network].label
  if (variant === "bare") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={shown}
        title={shown}
        className="text-white/80 hover:opacity-80 transition-opacity"
      >
        <SocialIcon network={network} size={size} />
      </a>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={shown}
      title={shown}
      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 flex items-center justify-center hover:border-[#c9a86e]/50 hover:scale-105 transition-all"
    >
      <SocialIcon network={network} size={size} />
    </a>
  )
}
