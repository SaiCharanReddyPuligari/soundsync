'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative h-8 w-16 rounded-full p-1 transition-colors duration-200",
        "bg-white/10 backdrop-blur-md",
        "hover:bg-white/20"
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          "absolute inset-y-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br",
          "transition-all duration-200",
          isDark 
            ? "translate-x-8 from-[rgb(213,159,255)] to-[rgb(117,215,245)]" 
            : "from-amber-200 to-yellow-400"
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-white" />
        ) : (
          <Sun className="h-4 w-4 text-white" />
        )}
      </span>
    </button>
  )
}

