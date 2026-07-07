"use client"

import { useState, useEffect } from "react"

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#151515] border-t border-[#c9a86e]/30 p-4 shadow-lg text-white">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/80 text-center sm:text-left">
          Мы используем cookie для улучшения работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием.
        </p>
        <button
          onClick={acceptCookies}
          className="whitespace-nowrap px-6 py-2 bg-[#c9a86e] text-black font-medium rounded-md hover:bg-[#d4b876] transition-colors"
        >
          Хорошо
        </button>
      </div>
    </div>
  )
}
