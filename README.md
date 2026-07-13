# Advanced Portfolio — CSS Grid & Modern Layouts (Week 5)

## 📌 Project Overview

This is a redesign of my personal portfolio focused on advanced CSS techniques:
**CSS Grid** for structural layout, **Flexbox** for component-level alignment,
**CSS custom properties** for a runtime theme system, **CSS animations** for
polish, and the **BEM naming methodology** for maintainable, collision-free
class names.

Goals for this iteration:
- Replace ad-hoc positioning with a real Grid-based layout system
- Add a working multi-theme switcher (3 themes) driven entirely by CSS variables
- Introduce motion (entrance animations, hover states, scroll reveal) without
  hurting performance or accessibility
- Organize CSS into clear responsibility layers instead of one large file

## 🚀 Setup Instructions

1. Clone or download this repository.
2. Replace `assets/harsh.jpg` with your own photo (falls back to a placeholder
   automatically if missing, via the image's `onerror` handler).
3. Open `index.html` directly in a browser, **or** serve it locally for the
   most accurate results:
   ```bash
   python3 -m http.server 8080
   # then visit http://localhost:8080
   ```
4. No build step, no dependencies — pure HTML/CSS/JS.
5. To deploy on GitHub Pages: push to a repo, then enable Pages on the `main`
   branch in **Settings → Pages**. Keep the folder structure exactly as-is
   (`css/`, `js/` as relative paths) to avoid the 404-on-assets issue from the
   Week 4 deployment.

## 🗂️ Code Structure

```
index.html               → semantic markup, BEM class names throughout
css/
  main.css                → design tokens (:root variables), reset,
                             typography, and all BEM component styling
  layout.css               → CSS Grid & Flexbox structural rules,
                             mobile-first media queries
  animations.css            → @keyframes, entrance animations,
                             hover/focus micro-interactions
js/
  theme-switcher.js         → theme cycling, mobile nav toggle,
                             scroll-reveal (IntersectionObserver),
                             data-driven form validation
screenshots/               → visual documentation (see below)
README.md
```

CSS is deliberately split by **responsibility, not by page section**:
`main.css` owns *what things look like* (color, type, component skins),
`layout.css` owns *where things sit* (Grid/Flexbox/breakpoints), and
`animations.css` owns *how things move*. This mirrors a lightweight SMACSS-style
separation and keeps each file independently scannable.

## 🧱 Technical Details

### CSS Grid
- `.hero__grid`, `.about__grid`, `.skills__grid`, `.projects__grid` all use
  `display: grid`. Skills and Projects use
  `grid-template-columns: repeat(auto-fit, minmax(Npx, 1fr))` so the number of
  columns adapts automatically to viewport width with zero media queries.
- The gallery uses explicit `grid-template-columns: repeat(4, 1fr)` with
  `grid-auto-rows` and spanning classes (`gallery__item--wide`,
  `gallery__item--tall`) to create an asymmetric, magazine-style mosaic.

### Flexbox
- The nav bar (`.nav`) uses Flexbox for logo / links / theme-button
  alignment, and the mobile dropdown (`.nav__list`) switches from `column` to
  `row` at the tablet breakpoint.
- `.hero__actions` and `.project-card__tags` use `flex-wrap` so buttons/tags
  reflow gracefully on narrow screens.

### CSS Variables & Theming
- All colors, spacing, radii, and shadows are custom properties on `:root`.
- Two alternate themes (`sunset`, `midnight`) are declared as
  `[data-theme="..."]` overrides of the same variable set — no component CSS
  needs to know which theme is active.
- `theme-switcher.js` cycles through themes, toggles the `data-theme`
  attribute on `<html>`, and persists the choice in `localStorage`.

### Animations & Motion
- Entrance animations (`fadeInUp`, `fadeIn`) run once on load with staggered
  `animation-delay` via `nth-child` selectors.
- Gallery images and the bio card use `IntersectionObserver` to add
  `.is-visible` only once they scroll into view (`reveal` class in
  `animations.css`).
- `prefers-reduced-motion: reduce` is respected globally — all animations and
  smooth scrolling collapse to near-instant for users who've opted out.

### BEM Methodology
Every component follows `block__element--modifier`, e.g.
`.project-card__media`, `.gallery__item--wide`, `.btn--primary`. No nested
descendant selectors are used for styling logic, which keeps specificity flat
and predictable.

### JavaScript Architecture
- `"use strict"` + `IS_DEV` flag gate debug logging.
- Form validation uses a **data-driven rules pattern** (`FIELD_RULES`
  object mapping field name → validator + message), so adding a new field
  means adding one object entry, not new conditional branches.
- All DOM queries are null-checked before use; features degrade gracefully
  (e.g. no `IntersectionObserver` → reveal elements just render visible).

## ⚡ Performance Notes
- Fonts are loaded via `rel="preconnect"` + a single Google Fonts request with
  only the weights actually used (300–700).
- Gallery/project images use `loading="lazy"`.
- Animations use `transform`/`opacity` (compositor-friendly) rather than
  animating `top`/`left`/`width` where possible.
- No external CSS/JS frameworks — total custom CSS is ~14 KB unminified
  across three files, easily minifiable for production.

## 🖼️ Visual Documentation

Screenshots live in `/screenshots`. To capture them yourself in under two
minutes:
1. Open `index.html` in Chrome or Firefox.
2. Open DevTools → toggle device toolbar (Ctrl+Shift+M) for mobile views.
3. Capture: full desktop view, mobile nav open, each of the 3 themes, and the
   contact form showing a validation error.
4. Save into `screenshots/` as `desktop.png`, `mobile-nav.png`,
   `theme-sunset.png`, `theme-midnight.png`, `form-validation.png`.

## ✅ Testing Evidence

Manually verified:
| Test | Result |
|---|---|
| Grid layout collapses to single column below 768px | ✅ Pass |
| Nav toggle opens/closes mobile menu, updates `aria-expanded` | ✅ Pass |
| Theme cycles Lavender → Sunset → Midnight → Lavender and persists on reload | ✅ Pass |
| Empty/invalid form fields show inline errors with shake animation | ✅ Pass |
| Valid form submission shows success message and resets fields | ✅ Pass |
| `prefers-reduced-motion` disables entrance/scroll animations | ✅ Pass |
| Skip-link, focus-visible outlines, and alt text present on all images | ✅ Pass |
| Missing `assets/harsh.jpg` falls back to placeholder via `onerror` | ✅ Pass |

Recommended cross-browser spot check before final submission: Chrome,
Firefox, and Edge (per course tip to use Firefox DevTools for Grid
debugging — the Firefox Grid Inspector is genuinely the best tool for
verifying `auto-fit`/`minmax` track sizing).

## 🔗 Links
- GitHub: https://github.com/harsh11m
- Related project: [Velora Kitchen](https://github.com/harsh11m/velora-kitchen-restaurant-website)
