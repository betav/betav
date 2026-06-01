import React, { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { LANGUAGES } from '../lib/config.js'

export default function LanguageSwitcher() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm text-silver hover:text-gold transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-40 glass rounded-lg border border-gold/20 shadow-xl min-w-[130px] py-1 overflow-hidden">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gold/10 ${
                  l.code === lang ? 'text-gold font-semibold' : 'text-silver'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
