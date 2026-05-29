# Viewlytics Design System & Branding v2

Welcome to the **Viewlytics Design System & Branding v2** reference manual. This document serves as the absolute source of truth for all typography, color palettes, spacing tokens, component classes, animation guidelines, and brand guidelines for Viewlytics.

---

## 1. Visual Direction & Brand Personality

Viewlytics is a premium analytics platform built for creators, media companies, and digital producers. The branding system is designed to evoke a sleek, modern, editorial, and cinematic dashboard aesthetic.

*   **Primary Mood**: Premium Dark SaaS, minimal, clean, high-contrast, editorial.
*   **Key Descriptors**: Creator-focused, analytical, precise, modern, intelligent.
*   **UX Principle**: Users must understand platform value and absorb analytics data in under 3 seconds.

---

## 2. Color System & Design Tokens

Viewlytics uses a **dark-first design system**. All components reference CSS tokens via `var(--vl-*)` variables. Light mode overrides are defined automatically at the document root under the `:not(.dark)` condition.

### 2.1 Backgrounds & Surfaces
| Token Name | Dark Mode Value (Default) | Light Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `--vl-bg-primary` | `#06070A` | `#F6F7F9` | Main application background |
| `--vl-bg-secondary` | `#0B0D12` | `#ECEEF2` | Page section containers / Sidebar |
| `--vl-bg-surface` | `#11141B` | `#FFFFFF` | Cards, dashboard boxes, inner surfaces |
| `--vl-bg-elevated` | `#181C25` | `#FFFFFF` | Popovers, dropdown menus, modals |
| `--vl-bg-overlay` | `rgba(0, 0, 0, 0.6)` | `rgba(0, 0, 0, 0.3)` | Modal backdrops |

### 2.2 Borders
| Token Name | Dark Mode Value | Light Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `--vl-border` | `rgba(255, 255, 255, 0.06)` | `rgba(0, 0, 0, 0.08)` | Default borders |
| `--vl-border-hover` | `rgba(255, 255, 255, 0.12)` | `rgba(0, 0, 0, 0.15)` | Hover state borders |
| `--vl-border-active` | `rgba(255, 255, 255, 0.18)` | `rgba(0, 0, 0, 0.22)` | Selected or active state borders |
| `--vl-border-focus` | `rgba(255, 59, 48, 0.4)` | `rgba(255, 59, 48, 0.4)` | Focus outlines |

### 2.3 Typography Colors
| Token Name | Dark Mode Value | Light Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `--vl-text-primary` | `#F5F7FA` | `#0F1117` | Main headings and body text |
| `--vl-text-secondary` | `#98A2B3` | `#667085` | Subtitles, descriptive labels, secondary info |
| `--vl-text-tertiary` | `#667085` | `#98A2B3` | Micro-captions, timestamps, inactive text |
| `--vl-text-disabled` | `#475467` | `#D0D5DD` | Disabled inputs or button text |
| `--vl-text-inverse` | `#06070A` | `#F5F7FA` | Text on brand colors (e.g. primary buttons) |

### 2.4 Accents & Semantics
Viewlytics relies heavily on a vibrant **Brand Red** as its primary visual identity accent, alongside **Cyan** and **Purple** secondary accents.
*   **Brand Red (Primary Accent)**:
    *   Dark Mode: `--vl-red: #FF3B30` | Hover: `#FF5147` | Active: `#E6352B`
    *   Light Mode: `--vl-red: #FF3B30` | Hover: `#E6352B` | Active: `#CC2F27`
*   **Cyan Accent (Secondary)**:
    *   Dark Mode: `--vl-cyan: #00C2FF` | Hover: `#33CEFF`
    *   Light Mode: `--vl-cyan: #0091D5` | Hover: `#007AB8`
*   **Purple Accent (Tertiary)**:
    *   Dark Mode: `--vl-purple: #7C5CFF` | Hover: `#917AFF`
    *   Light Mode: `--vl-purple: #6B47FF` | Hover: `#5A3AE6`
*   **Success Green**: `--vl-success` (Dark: `#22C55E` | Light: `#16A34A`)
*   **Warning Amber**: `--vl-warning` (Dark: `#F59E0B` | Light: `#D97706`)
*   **Danger Red**: `--vl-danger` (Dark: `#FF3B30` | Light: `#EF4444`)

---

## 3. Typography Scale

The font hierarchy is built around satoshi (headings) and Inter (body content).

*   **Families**:
    *   `--font-sans`: Satoshi/Inter for standard readability.
    *   `--font-heading`: Satoshi for elegant headings.
    *   `--font-mono`: Geist Mono for numbers and analytical parameters.
*   **Sizing**:
    *   `--text-xs` (12px), `--text-sm` (13px) for badges and metadata.
    *   `--text-base` (14px) for dashboard grid layouts and descriptive copy.
    *   `--text-lg` (18px), `--text-xl` (20px), `--text-2xl` (24px) for card titles and section titles.
    *   `--text-3xl` to `--text-7xl` (30px to 72px) for page hero statements and key metrics.

---

## 4. Layout, Shadows & Rounding System

*   **Spacing**: Built on a `4px` base unit. All margins, padding, and gaps use variables from `--space-1` (`4px`) up to `--space-32` (`128px`).
*   **Rounding Scale**:
    *   `--radius-sm` (`6px`) - small badges and status controls.
    *   `--radius-md` (`8px`) - inputs, small lists, buttons.
    *   `--radius-lg` (`12px`) - inner components.
    *   `--radius-xl` (`16px`) to `--radius-3xl` (`24px`) - primary dashboard cards, hero grid items, preview modules.
*   **Shadows**: Dark mode cards use heavy, custom-opacity shadows to offset elements against deep navy backgrounds (`--shadow-md`, `--shadow-lg`, `--shadow-xl`).
*   **Glow Effects**: Used exclusively to highlight premium items on hover.
    *   `--shadow-glow-red` | `--shadow-glow-cyan` | `--shadow-glow-purple`

---

## 5. UI Components System

All UI elements must utilize the centralized utility classes defined in `src/styles/components/`:

### 5.1 Buttons (`buttons.css`)
*   `.vl-btn`: Base button styling (flexbox, transitions, text sizing).
*   `.vl-btn-primary`: Styled with `--vl-gradient-brand` (Red to coral).
*   `.vl-btn-secondary`: Transparent surface with a clean border.
*   `.vl-btn-ghost`: Plain background, color highlights on hover.
*   `.vl-btn-danger`: Styled with `--vl-danger` soft/solid.

### 5.2 Cards (`cards.css`)
*   `.vl-card-dashboard`: Standard container for dashboard metrics, graphs, charts, and tables. Has an elegant dark background with subtle border highlights.

### 5.3 Badges (`badges.css`)
*   `.vl-badge`: Base badge class.
*   `.vl-badge-success` / `.vl-badge-danger` / `.vl-badge-warning` / `.vl-badge-info`: Color-coordinated status badges.

---

## 6. Animation System

All micro-interactions and initial entrance triggers should reuse the standard keyframes in `animations.css`:

*   **Transitions**: Use `vl-transition-fast` (`150ms`) or `vl-transition` (`250ms`) for standard hover effects.
*   **Entrances**:
    *   `.vl-animate-fade-in` - generic page entrance.
    *   `.vl-animate-slide-up` - standard card/content entry animation.
*   **State indicators**:
    *   `.vl-animate-pulse-glow` - live stream pulsing.
    *   `.vl-animate-float` - decorative illustrations floating.
    *   `.vl-animate-shimmer` - loading skeleton animations.

---

## 7. Official Logo Rules

The official Viewlytics Logo combining the stylized `V`, growth arrow, and play button represents creator growth and analytics intelligence.

### 7.1 Logo Variations
1.  **Horizontal Logo (`variant="full"`)**: Renders full brand text with icon. Used for desktop navbar, footers, and official landing pages.
2.  **Compact Logo (`variant="compact"`)**: Renders shorthand text. Used for smaller responsive devices.
3.  **Icon-Only Logo (`variant="icon"`)**: Renders the SVG symbol. Used for favicons, avatar placeholders, and app icons.

### 7.2 Theme-Aware SVG Specs
To preserve high-quality vectors and seamless color rendering without layout shifts, the Logo components resolve theme variables directly through JavaScript:
```tsx
const { isDark } = useTheme();
const textColor = isDark ? '#F5F7FA' : '#1a1c21';   /* --vl-text-primary */
const accentColor = '#FF3B30';                       /* --vl-red (stays consistent) */
```

### 7.3 Forbidden Modifications
*   **Do NOT** replace the brand colors with old gradients (e.g. orange gradients, cyan gradients on elements meant to be brand red).
*   **Do NOT** modify SVG path coordinates manually without confirming proportions.
*   **Do NOT** wrap logo rendering in raw custom Tailwind styles that override its semantic color rules.
