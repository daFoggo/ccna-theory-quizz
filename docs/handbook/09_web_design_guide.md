# Design System Rules

This is the canonical source for project-level visual design, spacing, color, typography, and dashboard page layout rules. Do not duplicate these rules in other handbook pages. Link here instead.

For product-level UX principles such as hierarchy, feedback, Hick's Law, Jakob's Law, and form behavior, see `10_ux_principles.md`.

## Source Inputs

- shadcn/base-nova theming: color and radius tokens are semantic CSS variables such as `background`, `foreground`, `primary`, `border`, `ring`, and `radius`. shadcn does not define a project spacing hierarchy for us.
- Catppuccin palette: Latte for light mode, Macchiato for dark mode. Lavender is the project accent. Token mapping follows the Catppuccin Style Guide (`https://catppuccin.com/palette/`).
- Supabase dashboard pattern: full-width shell, centered content container, responsive horizontal padding.
- Flat, dashed layout system: dashed `BorderGrid` for section separators and layout panes, and `BorderPanel` for standalone boxed surfaces.

## Scope

- Treat `src/components/ui/*` as upstream shadcn primitives. Do not change those files for app spacing or color unless the project intentionally forks the primitive.
- Apply these rules to `src/components/common/*`, `src/components/layout/*`, feature components, and routes.
- Dense surfaces may stay compact when density is the point: tables, calendars, sidebars, editor toolbars, icon toolbars, breadcrumbs, and inline metadata.

## Color & Theming

The project uses the Catppuccin palette with Lavender as the single accent color. Token values live in `src/styles.css` and map to shadcn semantic tokens via the `@theme inline` block.

### Flavor Selection

| Mode | Catppuccin flavor | Use |
| --- | --- | --- |
| Light | Latte | `:root` |
| Dark | Macchiato | `.dark` |

Lavender is the project primary on both flavors. Do not introduce a second accent. Color consistency lock: once Lavender is chosen for primary, ring, chart-1, and sidebar accents, the same hue family appears across every surface.

### Token Mapping (Catppuccin Style Guide)

Map shadcn semantic tokens to Catppuccin roles as follows. Light values come from Latte, dark values from Macchiato.

| shadcn token | Catppuccin role | Light (Latte) | Dark (Macchiato) |
| --- | --- | --- | --- |
| `--background` | Base | `oklch(0.95 0.013 264)` | `oklch(0.28 0.04 277)` |
| `--card` | Base / Mantle | `oklch(0.95 0.013 264)` | `oklch(0.24 0.04 277)` |
| `--popover` | Base / Surface1 | `oklch(0.95 0.013 264)` | `oklch(0.38 0.045 277)` |
| `--secondary` / `--muted` / `--accent` | Mantle / Surface0 | `oklch(0.92 0.013 264)` | `oklch(0.32 0.04 277)` |
| `--border` | Crust / translucent | `oklch(0.89 0.012 265)` | `oklch(0.82 0.04 277 / 12%)` |
| `--input` | Crust / translucent | `oklch(0.86 0.013 265)` | `oklch(0.82 0.04 277 / 16%)` |
| `--ring` | Lavender (darkened) | `oklch(0.55 0.19 276)` | `oklch(0.77 0.12 293)` |
| `--primary` | Lavender (darkened) | `oklch(0.55 0.19 276)` | `oklch(0.77 0.12 293)` |
| `--primary-foreground` | Base | `oklch(0.95 0.013 264)` | `oklch(0.28 0.04 277)` |
| `--foreground` | Text | `oklch(0.39 0.029 271)` | `oklch(0.82 0.04 277)` |
| `--muted-foreground` | Subtext0 | `oklch(0.49 0.022 269)` | `oklch(0.69 0.04 277)` |
| `--destructive` | Red | `oklch(0.57 0.24 27)` | `oklch(0.73 0.13 354)` |
| `--sidebar` | secondary / Crust | `oklch(0.92 0.013 264)` | `oklch(0.22 0.03 277)` |

### Chart Palette

Charts use a Lavender-anchored diversified palette. All eight chart slots spread across hue 25–322 for maximum distinguishability while keeping Lavender as the anchor.

| Slot | Light (Latte) | Dark (Macchiato) | Semantic use |
| --- | --- | --- | --- |
| `--chart-1` | `oklch(0.62 0.19 276)` | `oklch(0.74 0.15 286)` | Primary series, online status, Lavender |
| `--chart-2` | `oklch(0.56 0.22 322)` | `oklch(0.66 0.17 322)` | Secondary series, Mauve |
| `--chart-3` | `oklch(0.81 0.14 80)` | `oklch(0.81 0.12 90)` | Warning, Yellow |
| `--chart-4` | `oklch(0.78 0.14 55)` | `oklch(0.78 0.13 50)` | Warm series, Peach |
| `--chart-5` | `oklch(0.65 0.16 143)` | `oklch(0.70 0.13 143)` | Success series, Green |
| `--chart-6` | `oklch(0.63 0.14 195)` | `oklch(0.70 0.12 195)` | Cool series, Teal |
| `--chart-7` | `oklch(0.64 0.22 25)` | `oklch(0.70 0.16 25)` | Error / offline, Red |
| `--chart-8` | `oklch(0.59 0.21 259)` | `oklch(0.69 0.19 258)` | Cool complement, Blue |

Do not scatter chart hues outside this family. Status dots map to: online `chart-1`, warning `chart-3`, offline `chart-7`.

### Color Rules

- Never hardcode raw hex, `oklch()`, `hsl()`, or `rgb()` in components. Always use semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc).
- `bg-white`, `bg-black`, `text-white`, `text-black` are banned. Use `bg-background`, `bg-foreground`, `text-foreground`, `text-background`.
- One accent (Lavender) per project. Do not fluctuate between warm and cool accents.
- No pure `#000` or `#fff`. The Catppuccin Base values are off-black and off-white.
- `--radius: 0` is intentional. The project uses sharp corners. Do not add rounded corners to custom containers unless matching a shadcn primitive that owns its radius.

## Surface System

The project uses a flat, dashed border-grid layout system instead of typical card-based layouts. This produces a clean, blueprints-like aesthetic that keeps data dense and readable.

### Dashed Border-Grids (BorderGrid)

Use dashed border-grids to structure pages into responsive columns and cells.

#### Grid Construction

A border-grid is built from two border layers:

1. **Container** owns the top + left edges: `border-t border-l border-dashed border-border`.
2. **Each cell** owns its bottom + right edges: `border-b border-r border-dashed border-border`.

This produces a clean, non-overlapping dashed grid for any column count without per-column `nth-child` overrides. Do not use solid card containers.

### Boxed Dashed Sections (BorderPanel)

For standalone sections or forms, use the `BorderPanel` component which draws a boxed area with dashed borders. Inside the panel, an optional header is divided from the body by a dashed border.

### Surface Fill Pattern (sub-cells)

When a layout cell contains interactive sub-cells (device tiles, list items, rows), use a subtle fill + hover bump:

| State | Fill | Border | Icon |
| --- | --- | --- | --- |
| Default | `bg-secondary/50` (subtle, keeps hierarchy) | `border-border` dashed | `text-muted-foreground` |
| Hover | `bg-secondary` (full opacity) | `border-primary/40` accent | `text-primary` |
| Active / selected | `bg-secondary` or `bg-secondary/60` | `border-primary/30` | `text-primary` |

Never fill every sub-cell with full `bg-secondary` by default. Never leave sub-cells fully transparent. Apply the hover bump with `group/*` + `transition-colors`.

### Reusable Primitives

| Primitive | Purpose |
| --- | --- |
| `BorderGrid` | Multi-cell dashed section separator (2/3/4 cols responsive) |
| `BorderGridCell` | Section cell with `colSpan`, `pad`, `tone` |
| `BorderSectionHeader` | Title + description + actions inside a section cell |
| `BorderPanel` | Single boxed dashed panel for sections/settings |
| `BorderPanelHeader` | Header for a `BorderPanel` |
| `BorderList` | Vertical divider list with dashed/solid dividers |
| `BorderListItem` | List row with border divider |

### Solid vs Dashed Rule

All layout container boundaries, panels, sections, and grids must use dashed borders. Solid borders should only be used on interactive inputs, status indicators, badges, and default shadcn primitives (like popovers and select dropdown menus).

## Font Size Hierarchy

The project enforces a strict font-size hierarchy. Do not default to `text-xs` for content that should be readable.

| Tailwind | Use |
| --- | --- |
| `text-3xl` | Large stat numbers, hero metrics |
| `text-2xl` | Reading cells, secondary metrics |
| `text-xl` | Page-level titles in detail views |
| `text-lg` | Email subjects, prominent single titles |
| `text-base` | Section titles, card titles, default body when unstyled. `font-heading font-semibold` for titles. |
| `text-sm` | Body copy, descriptions, list item primary text, dialog body |
| `text-xs` | **Only** for uppercase labels, badges, timestamps, tags, helper text, metadata. Never for primary content. |

If a text element has no size class, it inherits `text-base` from the base layer. That is correct for body copy. Do not add `text-sm` to body paragraphs unless density requires it.

## Tokens

The project uses Tailwind's 4px base scale. Prefer Tailwind tokens over arbitrary values.

| Value | Tailwind | Use |
| --- | --- | --- |
| 2px | `0.5` | Rare optical nudges only |
| 4px | `1` | Label-to-input, tight helper text, tiny internal rhythm |
| 8px | `2` | Icon-to-text, compact item gaps, button vertical padding |
| 12px | `3` | Compact horizontal padding, compact card rows |
| 16px | `4` | Field-to-field gaps, default content gaps |
| 24px | `6` | Card/container padding, related block gaps, route padding at tablet |
| 32px | `8` | Section gaps inside a dashboard page |
| 40px | `10` | Desktop container side padding |
| 48px+ | `12+` | Large section separation and page-level breathing room |

Avoid arbitrary spacing, sizing, font sizes, and z-indexes. Exceptions must be layout constraints that Tailwind does not express well, such as `calc(...)` viewport math or a documented fixed content width.

## Padding Rules

- Text controls should have more horizontal padding than vertical padding.
- Preferred ratios are 2:1 or close to it: `px-4 py-2`, `px-6 py-3`, `px-3 py-2` for compact controls.
- Avoid `p-2` on custom button-like or chip-like controls with text. Equal padding is acceptable for square icon buttons and very dense table/calendar cells.
- Cards and major content containers default to `p-6` when they own real page content. Compact cards or rows can use `px-3 py-2` or `px-4 py-3`.

## Proximity Rules

Spacing communicates relationship. Internal spacing must be less than or equal to the external spacing that separates the component from neighboring components.

| Relationship | Preferred spacing |
| --- | --- |
| Label -> input | 4-8px |
| Icon -> text | 8px |
| Field -> field | 16px |
| Related row -> related row | 12-16px |
| Card/block -> card/block | 24-32px |
| Section -> section | 32-48px |

As UI goes deeper, margins shrink: page spacing is largest, section spacing is smaller, card spacing is smaller again, and inline spacing is the smallest.

## Dashboard Page Container

Dashboard layout uses three layers:

1. Page shell: full width. Sidebar, app header, borders, and background are not max-width constrained.
2. Content container: centered with `mx-auto`, responsive side padding, and an optional max width.
3. Page content: cards, forms, tables, and feature UI following the spacing rules above.

Use `AppPageContainer` for dashboard routes:

```tsx
<AppPageContainer size="default">
  <Outlet />
</AppPageContainer>
```

Container sizes:

| Size | Max width | Use |
| --- | --- | --- |
| `small` | `max-w-192` / 768px | Narrow settings/forms |
| `default` | `max-w-300` / 1200px | Normal dashboard pages |
| `large` | `max-w-400` / 1600px | Wide analytics/table-heavy pages |
| `full` | none | Deliberately full-width dense tools |

Default container rhythm is `px-4 py-6 lg:px-6 xl:px-10` with a `gap-8` vertical stack.

Dashboard content routes should not repeat a page title when the app shell already provides sidebar navigation and breadcrumbs. Use local headings only for sections inside the page.

## Component Composition

- Prefer `flex flex-col gap-*` over `space-y-*` for component layout.
- Use `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, and `EmptyContent` for main empty states.
- Use compact helper text only in compact spaces where full empty composition would harm layout.
- Icons inside shadcn controls should usually rely on control styling. Use `data-icon` and avoid manual size classes unless the icon is outside a controlled primitive.
- Icon-only buttons require `aria-label` or screen-reader text.
- Do not remove focus rings.

## Review Checklist

### Spacing

- Is every spacing value on the Tailwind 4px scale unless explicitly justified?
- Are custom text controls using horizontal padding greater than vertical padding?
- Is internal spacing smaller than the external spacing around the component?
- Do page sections use 32-48px separation instead of a flat small gap everywhere?
- Does a dashboard route use `AppPageContainer` instead of hand-rolled route padding/max-width?
- Has the route avoided a duplicate title when breadcrumbs/sidebar already identify the page?
- Are compact exceptions limited to dense UI surfaces?

### Color

- Are all colors using semantic tokens (`bg-background`, `text-foreground`, `border-border`), never raw hex/oklch/hsl/rgb?
- Is `bg-white` / `bg-black` / `text-white` / `text-black` absent from app code?
- Is Lavender the only accent color used for primary, ring, chart-1, and sidebar accents?
- Do charts use only the `--chart-1` through `--chart-8` slots, no scattered hues?
- Do status dots map to `chart-1` (online), `chart-3` (warning), `chart-7` (offline)?
- Are app components relying on shadcn/base-nova semantic color/radius tokens instead of raw values?

### Surface System

- Are major page regions and sections structured using `BorderGrid` / `BorderGridCell` or `BorderPanel` (dashed)?
- Does the grid container own `border-t border-l` and each cell own `border-b border-r` (no `nth-child` resets)?
- Are interactive sub-cells using `bg-secondary/50` default + `bg-secondary` hover, and not transparent?
- Does hover add `border-primary/40` + `text-primary` accent via `group/*` + `transition-colors`?
- Are dashed borders consistently used for layout containers, panels, and separating lines?

### Typography

- Is `text-xs` used only for uppercase labels, badges, timestamps, tags, and helper text?
- Is primary content (titles, body, list items) at `text-base` or `text-sm`, never `text-xs`?
- Are section and card titles using `font-heading font-semibold` at `text-base` or larger?
