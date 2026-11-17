'use client'

import { Moon, Sun } from 'lucide-react'
import { cn } from '@/components/ui/utils'
import { useTheme } from '@/providers/theme-provider'

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-overlay/10 bg-overlay/[0.04] text-foreground-muted backdrop-blur-md transition-colors hover:border-overlay/25 hover:bg-overlay/[0.08] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/60',
        className,
      )}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  )
}
