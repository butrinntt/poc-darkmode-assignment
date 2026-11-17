import { Menu, X } from 'lucide-react'
import { AuthActions } from '@/components/navigation/auth-actions'
import { NavigationLinks } from '@/components/navigation/navigation-links'
import { ThemeToggle } from '@/components/navigation/theme-toggle'

type MobileNavigationProps = {
  isOpen: boolean
  onClose: () => void
  onOpenChange: (isOpen: boolean) => void
  onSignIn: () => void
  pathname: string
}

export function MobileNavigation({
  isOpen,
  onClose,
  onOpenChange,
  onSignIn,
  pathname,
}: MobileNavigationProps) {
  return (
    <div className="flex items-center gap-1.5 md:hidden">
      <ThemeToggle />
      <button
        type="button"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        className="rounded-md p-2 text-foreground-soft transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/60"
        onClick={() => onOpenChange(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-14 border-t border-overlay/10 bg-surface-elevated/95 px-4 pb-4 pt-3 shadow-lg backdrop-blur-lg">
          <div className="space-y-1">
            <NavigationLinks pathname={pathname} variant="mobile" onNavigate={onClose} />
          </div>
          <AuthActions
            variant="mobile"
            onSignIn={() => {
              onClose()
              onSignIn()
            }}
            onSignedOut={onClose}
          />
        </div>
      ) : null}
    </div>
  )
}
