'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_THEME, isTheme, THEME_STORAGE_KEY, type Theme } from '@/lib/theme/theme-storage'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    return null
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME)

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    if (readStoredTheme()) {
      return
    }

    const query = window.matchMedia('(prefers-color-scheme: light)')

    function handleSystemChange(event: MediaQueryListEvent) {
      if (readStoredTheme()) {
        return
      }

      const systemTheme: Theme = event.matches ? 'light' : 'dark'
      applyTheme(systemTheme)
      setThemeState(systemTheme)
    }

    query.addEventListener('change', handleSystemChange)

    return () => query.removeEventListener('change', handleSystemChange)
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    applyTheme(nextTheme)
    setThemeState(nextTheme)

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {}
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [setTheme, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }

  return context
}
