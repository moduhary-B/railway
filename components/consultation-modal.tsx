"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ModalContextValue = {
  open: (source?: string) => void
  close: () => void
  isOpen: boolean
}

const ConsultationModalContext = createContext<ModalContextValue | null>(null)

export function useConsultationModal() {
  const ctx = useContext(ConsultationModalContext)
  if (!ctx) {
    throw new Error("useConsultationModal must be used within <ConsultationModalProvider>")
  }
  return ctx
}

export function ConsultationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState<string | undefined>(undefined)

  const open = useCallback((src?: string) => {
    setSource(src)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen])

  return (
    <ConsultationModalContext.Provider value={value}>
      {children}
      <ConsultationDialog isOpen={isOpen} onOpenChange={setIsOpen} source={source} />
    </ConsultationModalContext.Provider>
  )
}

function ConsultationDialog({
  isOpen,
  onOpenChange,
  source,
}: {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  source?: string
}) {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setError(null)
    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: source ?? "" }),
      })
      setIsSubmitted(true)
      setFormData({ name: "", phone: "", message: "" })
      setTimeout(() => {
        setIsSubmitted(false)
        onOpenChange(false)
      }, 2500)
    } catch (err) {
      setError("Ошибка отправки. Попробуйте позже.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-[#0e1720] to-[#0a0f1a] border-[#c9a86e]/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-light text-center">
            Оставьте заявку на подбор
          </DialogTitle>
          <DialogDescription className="text-white/60 text-center">
            Наши специалисты свяжутся с вами в течение 15 минут
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-10 text-center text-green-400 text-lg font-semibold">
            Спасибо за заявку! Скоро свяжемся.
          </div>
        ) : (
          <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              required
              className="w-full p-3 bg-[#0a0f1a] border border-[#c9a86e]/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a86e] transition-colors"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ваш телефон"
              required
              className="w-full p-3 bg-[#0a0f1a] border border-[#c9a86e]/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a86e] transition-colors"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Ваш комментарий (необязательно)"
              rows={3}
              className="w-full p-3 bg-[#0a0f1a] border border-[#c9a86e]/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a86e] transition-colors resize-none"
            />
            <div className="flex items-start gap-2 text-xs text-white/50">
              <input type="checkbox" required className="mt-0.5" defaultChecked />
              <span>
                Я согласен на обработку персональных данных и принимаю{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  className="text-[#c9a86e] hover:text-[#d4b876] underline underline-offset-2"
                >
                  политику конфиденциальности
                </a>
              </span>
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold p-3 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? "Отправка…" : "ОТПРАВИТЬ ЗАЯВКУ"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
