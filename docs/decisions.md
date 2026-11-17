# Decisions

This document captures the main decisions behind the current assessment version of BlockEstate.

## Scope

BlockEstate is presented as a focused Next.js prototype, not as a complete blockchain real estate platform.

For this assessment, I chose to make the scope more honest: a user can explore real estate investment opportunities, open a property detail page, and preview fractional ownership. The blockchain investment idea is still part of the product direction, but the implementation does not pretend to handle real financial or legal infrastructure.

## Routing

Property detail pages live under `/properties/[id]`.

This keeps the route model aligned with the domain:

```txt
/properties
/properties/[id]
```

The decision is mainly about clarity and ownership. A property detail page belongs inside the properties route segment, not under a separate singular `/property` route.

## Property Detail Page

The property detail UI lives directly in `app/properties/[id]/page.tsx`.

I did not keep a separate `PropertyDetail` component because it was not adding meaningful reuse or separation. The component was small, route-specific, and only existed to support that page.

If the detail page grows later, it may make sense to extract specific sections. For now, keeping the page local makes the ownership clearer and avoids unnecessary abstraction.

## Server and Client Boundaries

Pages stay as server components unless they need client-side state or browser APIs.

That is the default mental model I want this project to follow with the App Router. Static pages and listing pages should not become client components without a specific reason.

## Data Placement

Static display data lives in `data/` files instead of being built directly inside page components.

Examples:

```txt
data/about.ts
data/properties.ts
```

This keeps page files focused on rendering and composition. It also makes the static records easier to review, reuse, or replace later if the project moves toward a real data source.

## Wallet Integration

The wallet integration is intentionally light.

The app connects to MetaMask through the injected browser provider:

```ts
window.ethereum.request({ method: 'eth_requestAccounts' })
```

That request only asks MetaMask for permission to read the user's public wallet address. It does not create transactions, sign messages, mint tokens, interact with smart contracts, or charge gas.

For this assessment, I did not add `wagmi`, `ethers`, or a blockchain SDK because the product does not yet need contract reads/writes. Wallet state is kept in `providers/wallet-provider.tsx`, while small wallet-specific helpers live under `lib/wallet/`.

Disconnecting the wallet only clears local application state. MetaMask does not provide a universal programmatic disconnect API, so the UI should not imply that the site revoked permissions inside the extension.

## Font Assets

Font files live in `public/fonts/` instead of inside `app/`.

The `app/` directory should mostly communicate routes, layouts, and rendering ownership. Keeping font binaries under `public/fonts/` makes the static asset boundary more obvious, while `app/layout.tsx` still owns how those fonts are loaded through `next/font/local`.

## Shared Code

Route-only helpers stay local until there is real reuse.

For example, `getPropertyById` is local to `app/properties/[id]/page.tsx` because it currently exists only to support that route. Moving it into a generic `utils` file would make the code look more organized without actually improving the architecture.

The same rule applies to shared helpers. The `cn` helper is only used by the base UI components, so it lives in `components/ui/utils.ts` instead of a generic `lib/utils.ts` file. If the project later needs shared formatters, wallet helpers, or validation logic, those should be grouped by concern, such as `lib/formatters/`, `lib/wallet/`, or `lib/validation/`, rather than collected in a catch-all utility file.

## Design System Tokens

Brand colors live as Tailwind tokens (`brand`, `success`, `surface.{base,elevated}`) in `tailwind.config.ts` instead of arbitrary hex values across files.

This started as duplication: `#3B82F6` showed up in 30+ files. After the first design iteration, the indirection paid off, since changing the brand colour or surface tone now happens in one place.

The tokens are intentionally narrow. Anything outside the `brand` / `success` / `surface` set still uses Tailwind's default palette (`gray`, `emerald`, `white`) so the project does not invent a parallel design system for primitives that already exist.

## Theming

The app ships a light and a dark theme, switched by the toggle in the navbar.

Tailwind runs in `darkMode: ['class']`, so the theme is a `dark` class on `<html>`. Everything else is CSS variables declared in `app/globals.css`: `:root` holds the light values, `.dark` overrides them.

The design used to be dark-only, with `text-white`, `text-gray-400` and `bg-white/5` written directly into components. Those are now semantic tokens, so a component does not know which theme it renders in:

```txt
text-foreground          strong text
text-foreground-soft     secondary text
text-foreground-muted    supporting copy
text-foreground-subtle   labels and meta
bg-surface-base          page background
bg-surface-elevated      raised sections, menus, dialogs, toasts
bg-overlay/5             alpha fills, borders, dividers and rings
```

`overlay` is a single channel (`--overlay`) that is white in dark mode and near-black in light mode, so `border-overlay/10` keeps the same visual weight in both themes instead of needing a `dark:` variant per element.

Literal colors stay where the surface underneath does not change with the theme: `text-white` on a `bg-brand` button, and the badges that sit on top of a property photo. Status colors (emerald, amber, red) keep a `dark:` variant because the accessible tint differs per theme.

`providers/theme-provider.tsx` owns the state and persists the choice in `localStorage`. With nothing stored, the app follows `prefers-color-scheme` and falls back to dark, and it keeps following system changes until the user picks a theme explicitly.

The theme is applied before paint by the small inline script in `lib/theme/theme-storage.ts`, which `app/layout.tsx` renders in `<head>`. Without it the first frame would render in the default theme and flash. That is also why `<html>` carries `suppressHydrationWarning`: the script mutates the element before React hydrates.

## Blocks Pattern

Page-level composed sections live in `components/blocks/`:

```txt
components/blocks/
  hero-banner.tsx
  featured-properties.tsx
  how-it-works.tsx
  manifesto.tsx
  vision-mission.tsx
  footer.tsx
```

Pages stay thin, mostly composing blocks. Blocks are server components by default; client behaviour is pushed down into smaller leaf components when needed (the marquee in the hero, the `FractionalOwnershipSlider`).

## Tooling

The project has a basic validation workflow:

```bash
npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
```

That gives the assessment a clear quality baseline. A reviewer can quickly verify formatting, lint rules, TypeScript validity, and production build health.

The project currently uses `.eslintrc.json` instead of ESLint flat config because the flat config caused compatibility issues during `next build` in this setup. The simpler configuration is less trendy, but it is more stable for this repository right now.
