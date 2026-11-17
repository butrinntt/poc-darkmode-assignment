export const THEME_STORAGE_KEY = 'blockestate-theme'

export type Theme = 'light' | 'dark'

export const DEFAULT_THEME: Theme = 'dark'

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

export const themeInitScript = `(function(){try{var stored=window.localStorage.getItem('${THEME_STORAGE_KEY}');var theme=stored==='light'||stored==='dark'?stored:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'${DEFAULT_THEME}');var root=document.documentElement;root.classList.toggle('dark',theme==='dark');root.style.colorScheme=theme;}catch(error){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}})();`
