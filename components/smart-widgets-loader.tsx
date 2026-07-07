"use client"

import { useEffect } from "react"

// Загружает external SmartWidgets loader только на клиенте, чтобы не было
// hydration mismatch от сырого <script> в JSX.
export default function SmartWidgetsLoader() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (document.querySelector('script[data-smartwidgets="1"]')) return
    const s = document.createElement("script")
    s.src = "https://res.smartwidgets.ru/app.js"
    s.defer = true
    s.setAttribute("data-smartwidgets", "1")
    document.body.appendChild(s)
  }, [])
  return null
}
