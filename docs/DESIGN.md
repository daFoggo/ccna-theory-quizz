# CCNATheory Design System

> Smart home IoT data-labeling platform. Clean, bright, modern. Built on shadcn/ui + Tailwind v4 + TanStack Start.

## Design Read

Reading this as: IoT energy data-labeling platform for technical operators and data annotators, with a clean/bright/minimal product language, leaning toward shadcn/ui + Tailwind v4 + Sail Away blue brand + Basil green eco accent.

## Dials

- **DESIGN_VARIANCE: 4** - Structured, predictable grid. Data needs clarity not chaos.
- **MOTION_INTENSITY: 3** - Mostly static. Subtle transitions only. No scroll hijack.
- **VISUAL_DENSITY: 5** - Moderate. IoT data needs breathing room but also information clarity.

## Color System

### Brand anchors
- **Sail Away** `#58ade0` - Primary brand blue. Energy, tech, water, trust.
- **Basil** `#8aa086` - Eco green. Sustainability, nature, ground.

### Semantic tokens (light)
| Token | Role | OKLCH |
|---|---|---|
| `--background` | Canvas | `0.998 0.002 250` near-white cool |
| `--foreground` | Text | `0.13 0 0` pure neutral dark |
| `--card` | Surface | `1 0 0` pure white |
| `--primary` | CTA buttons | `0.659 0.134 238` Homeworld blue |
| `--primary-foreground` | Text on primary | `1 0 0` white |
| `--secondary` | Secondary surface | `0.90 0.015 115` Harp warm neutral |
| `--muted` | Muted surface | `0.94 0.004 250` cool light gray |
| `--accent` | Hover surface | `0.91 0.05 240` pale blue |
| `--border` | Separators | `0.90 0.004 250` light cool gray |

### Chart palette (8 colors, max hue spread)
| # | Hue | Role | Source |
|---|---|---|---|
| chart-1 | 237 | Solar/energy | Sail Away `#58ade0` |
| chart-2 | 141 | Eco/grid | Basil `#8aa086` |
| chart-3 | 85 | Battery/electricity | Amber derived |
| chart-4 | 195 | Water | Teal derived |
| chart-5 | 300 | Humidity | Purple derived |
| chart-6 | 20 | Temperature | Coral derived |
| chart-7 | 136 | Ground/CO2 | Climbing Ivy `#576d4d` |
| chart-8 | 265 | Air/pressure | Indigo derived |

### Color rules
- One accent family locked: blue + green. No random colors in UI chrome.
- Chart colors are the ONLY multi-hue zone. UI stays blue/green/neutral.
- No warm beige backgrounds. No AI-purple gradients. No muddy pastels.
- Dark mode: invert lightness, keep hue identity. Primary brightens for visibility.

## Typography

| Role | Font | Usage |
|---|---|---|
| Heading | Space Grotesk Variable | Card titles, page headers, stat numbers |
| Body | Inter Variable | All UI text, form labels, body copy |
| Mono | Google Sans Code Variable | Data values, metrics, timestamps |
| Logo | Funnel Display Variable | Brand wordmark only |

### Scale
- Page title: `text-xl font-semibold`
- Card title: `text-base font-medium`
- Stat value: `text-2xl md:text-3xl font-semibold font-heading tracking-tight`
- Body: `text-sm`
- Meta/label: `text-xs text-muted-foreground`
- Data value: `font-mono text-sm`

## Shape System

**Shape Consistency Lock:** `rounded-xl` is the page standard.
- Cards: `rounded-xl` (shadcn default)
- Inputs: `rounded-lg` (shadcn default)
- Buttons: `rounded-lg` (shadcn default)
- Badges/pills: `rounded-full` (status indicators only)
- Icons: no radius

No mixing. No `rounded-[28px]` or custom radius overrides.

## Layout Principles

### Auth pages
- Split-screen: brand panel (left, 40%) + form panel (right, 60%)
- Brand panel: solid primary-tinted background, logo, tagline, subtle pattern
- Form panel: clean white, centered card, generous padding
- Mobile: brand panel collapses to a compact header strip
- No canvas animations. No pixel backgrounds. Clean and fast.

### Dashboard shell
- Header: slim `h-14` bar, brand left, actions right. No breadcrumbs clutter.
- Sidebar: `w-64` expanded, `w-16` collapsed. Icon + label nav.
- Content: max-width container with consistent `px-6 py-6` padding.
- No heavy chrome. Content breathes.

### Dashboard content
- Stats row: 4 compact stat cards in a responsive grid
- Charts: full-width cards with header + chart area
- Device grid: card per device with status indicator
- Labeling interface: split view with data preview + annotation panel
- Use `gap-4` or `gap-6` between cards. Never `space-y-*`.

## Component Patterns

### Stat card
```
Card(size="sm")
  CardHeader
    CardDescription(label)
    CardAction(icon, colored)
  CardContent
    stat value (font-heading, large)
    trend indicator (chart-1 up / chart-6 down)
```

### Device card
```
Card
  CardHeader
    CardTitle(device name)
    CardAction(status badge)
  CardContent
    sensor readings grid
    last-updated timestamp
```

### Chart card
```
Card
  CardHeader
    CardTitle
    CardDescription
    CardAction(tabs or filter)
  CardContent
    ChartContainer
```

## Motion

- Card hover: subtle `transition-colors` on border. No scale transforms.
- Page transitions: none (SPA, instant).
- Loading: Skeleton matching final layout shape. No spinners for content areas.
- Form submit: button shows `Spinner` + disabled state.
- Respect `prefers-reduced-motion` always.

## Anti-Slop Rules (from taste-skill)

1. No em-dashes in any copy. Use hyphens or restructure.
2. No 3-equal-card feature rows. Vary grid composition.
3. No AI-purple gradients. Blue + green only.
4. No fake screenshots or div-based mock UI.
5. No `window.addEventListener('scroll')`.
6. No `space-x-*` or `space-y-*`. Use `gap-*`.
7. No custom `z-index` on overlay components.
8. No manual `dark:` color overrides. Use semantic tokens.
9. No hand-rolled SVG icons. Use `@tabler/icons-react`.
10. No `window.confirm()`. Use `AlertDialog`.

## Architecture Compliance

- Feature-based architecture under `src/features/`
- Routes in `src/routes/` are orchestration layer
- TanStack Query/Router/Start/Form stack
- shadcn/ui primitives in `src/components/ui/`
- Layout components in `src/components/layout/`
- `@/*` alias for imports
- `@tabler/icons-react` for all icons
- `@tanstack/react-form` for forms (not react-hook-form)
- Route `staticData` contract: `getTitle`, `hideHeader`, `hideSidebar`, `pageContainerSize`, `pageHeader`
