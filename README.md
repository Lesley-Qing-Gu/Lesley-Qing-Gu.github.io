# Lesley Gu — Portfolio

Live at **[lesley-qing-gu.github.io](https://lesley-qing-gu.github.io/)**

An interactive, single-page portfolio built as one continuously-animated canvas rather than a stack of static pages. Six colored blocks — one per discipline — sit on a dotted canvas and morph between square, triangle, and circle. Clicking a block expands it into a full-screen, horizontally-scrolling case-study deck for that category.

## Highlights

- **Shape-morphing canvas** — every project block cross-fades between square/triangle/circle via a shared-point-count `clip-path`, driven by a floating toolbar (rect/ellipse/triangle tools, like a tiny design app).
- **Expand/collapse transition** — clicking a block grows it from its exact on-canvas position and shape into a full-screen detail view, and the reverse on close — not a generic modal fade.
- **Horizontal case-study decks** — each track (Web, UX/UI, Product, Graphic, Research, About) opens into a `scroll-snap` deck of slides: a hero (title, description, tech stack, cover image/video), then a gallery of screenshots, videos, YouTube embeds, or even a live embedded website.
- **Keyboard + trackpad navigation** — spacebar or wheel/trackpad advances one slide at a time (throttled so a single continuous scroll gesture can traverse several slides); reaching the end of a deck closes it automatically.
- **Dark mode** — toggle in the floating toolbar (sun/moon icon); re-themes the canvas, ruler, panels, and menus.
- **Lazy-loaded embeds** — YouTube videos, live website embeds, and PDF viewers only start loading once scrolled near, instead of all firing at once when a track opens.
- **Rainbow Layers panel & right-click menu** — Figma-style layer list and context menu for hiding/reordering tracks, plus an "AI projects only" filter.
- **About & Contact** — a pixel-art dialogue intro, bio with links, and a couple of personal-facet slides.

## Tech stack

- **React 18** + **Vite** — single component (`src/Portfolio.jsx`) driven by one `TRACKS` data array; no router, no external state library.
- **lucide-react** for icons.
- Plain CSS-in-JS (inline styles) throughout — no CSS framework.
- Media (screenshots, videos, PDFs) served as static files from `public/`, referenced by absolute path.

## Running locally

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Project structure

```
src/Portfolio.jsx   # the entire app: canvas, shape morphing, detail-view rendering, and all project data
public/             # per-project screenshots, videos, and PDFs
design.md           # internal design spec — data model, animation gotchas, and conventions for adding new projects
```

See `design.md` for the data model used to add a new project (basic 2-slide template vs. the richer gallery template) and a few animation/layout invariants that are easy to accidentally break.

## Deployment

The site deploys as a static build to the `gh-pages` branch of this repo (served via GitHub Pages). `main` holds the source.
