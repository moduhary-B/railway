import type React from "react"
import "./globals.css"
import { Manrope, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ConsultationModalProvider } from "@/components/consultation-modal"
import CookieBanner from "@/components/CookieBanner"

console.log('=== LAYOUT ЗАГРУЖЕН ===');

// Тело / UI / цифры — Manrope: тёплый геометрический гротеск с отличной
// кириллицей и табличными фигурами. Один санс на весь интерфейс.
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

// Заголовки — Playfair Display: высококонтрастный редакционный сериф
// (luxury / fashion). Используется на ВЕСЬ заголовок целиком, а не как
// вставка в строку, — поэтому мешанины шрифтов в строке не возникает.
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
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
    <html lang="ru" suppressHydrationWarning className={`overflow-x-hidden ${playfair.variable}`}>
      <head>
        {/* Fail-safe: если через 3 секунды после загрузки страницы остаются
            элементы с inline opacity:0 (framer-motion не гидратировался,
            IntersectionObserver не сработал, есть prefers-reduced-motion),
            принудительно показываем их и сбрасываем transform. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  function reveal(){
    try {
      var nodes = document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].style.opacity = '1';
        nodes[i].style.transform = 'none';
        nodes[i].style.filter = 'none';
      }
    } catch(e) {}
  }
  if (document.readyState === 'complete') setTimeout(reveal, 3000);
  else window.addEventListener('load', function(){ setTimeout(reveal, 3000); });
})();
            `.trim(),
          }}
        />
        {/* Для пользователей без JS — сразу показываем всё */}
        <noscript>
          <style>{`
[style*="opacity:0"], [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }
          `}</style>
        </noscript>
      </head>
      <body className={`${manrope.className} overflow-x-hidden`}>
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
