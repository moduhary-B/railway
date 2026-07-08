import type React from "react"
import "./globals.css"
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConsultationModalProvider } from "@/components/consultation-modal"
import CookieBanner from "@/components/CookieBanner"

console.log('=== LAYOUT ЗАГРУЖЕН ===');

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

// Редакционный сериф — для акцентных заголовков ("Азии", "работаем", "команда")
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
})

// Моно — только для цифр (счётчики, статистика, номера шагов)
const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata = {
  title: "Авто из Китая, Кореи и Японии - Orient Auto",
  description:
    "Автомобили из Азии с гарантией качества. Прямой импортер. Более 1000 довольных клиентов. Создаем прозрачные и удобные условия для Вас.",
  generator: 'turov',
  icons: {
    icon: "/logo-orient.png",
    shortcut: "/logo-orient.png"
  }
}

// Next 15 требует отдельного экспорта viewport (не в metadata)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // Пользователь должен иметь возможность зумить (a11y) — не отключаем масштабирование
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={`overflow-x-hidden ${cormorant.variable} ${jbMono.variable}`}>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ConsultationModalProvider>
            {children}
            <CookieBanner />
          </ConsultationModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
