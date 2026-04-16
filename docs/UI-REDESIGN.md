# Smart Trees — UI redesign summary

## Before / after

| Area | Before | After |
|------|--------|--------|
| **Palette** | Forest green + stone grays | Primary deep blue (#202b5a), deep green (#0d322f), accent blue (#126bb2), teal (#0c857d), white |
| **Home** | Simple gradient hero, plain cards | Full-bleed cover image hero with gradient overlay, organic blobs, glass-style step cards, featured trees with hover lift |
| **Navbar** | Text-only “Smart Trees” | Logo + text in glass-style nav (backdrop blur, light border) |
| **Tree directory** | Basic search + select, plain cards | Search bar + filter chips, glass cards with hover lift and image zoom |
| **Tree detail (QR)** | Minimal header, flat sections | Clear hierarchy, glass panels for fact/benefits/donation, loading spinner |
| **Donation modal** | Solid white modal | Glass modal (backdrop blur, soft border), teal amount chips, clear success state |
| **Admin** | Stone/forest colors | Slate + primary/teal accents, improved spacing and button styles |

## Asset placement

- **Logo**: `public/images/logo.png` — used in the public navbar inside a white rounded container.
- **Cover**: `public/images/cover.png` — used as the home hero background with a gradient overlay.

If either file is missing, the app still works (nav shows text only; hero uses gradient only).

## Reusable styles (Tailwind)

- **Buttons**: `btn-primary`, `btn-secondary`, `btn-ghost`
- **Cards**: `card`, `card-glass`, `glass-panel`
- **Form**: `input`, `chip`, `chip-active`
- **Layout**: `section-container`, `glass-nav`
- **Background**: `organic-blob`, `eco-pattern` (optional)
- **Animation**: `animate-fade-in`, `animate-fade-in-up`

## Accessibility & performance

- Semantic HTML and ARIA where needed (e.g. dialog, alerts).
- Sufficient contrast for primary text and CTAs.
- Images use Next.js `Image` with appropriate `sizes` for responsive loading.
- No new heavy libraries; animations use CSS only.
