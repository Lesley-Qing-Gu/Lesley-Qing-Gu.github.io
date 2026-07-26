# Portfolio Design Spec

Single-file React app (`src/Portfolio.jsx`). This doc records how it works and why, so future edits don't accidentally break something that was already fixed once. It also defines the **rich-project template** (piloted on CLIMBLOG) to reuse for future case studies.

## 1. Data model

Everything is driven by one array, `TRACKS`, each entry a discipline/category:

```js
{
  id, label, short, cover, color,
  isAbout?: true,       // special-cased: renders the About/Contact layout instead of projects
  projects: [ ...Project ]
}
```

- `label` — full name shown in the small top-left tag and layers panel (e.g. "WEB DESIGN & DEV").
- `short` — used for the T-tool overlay label on the block.
- `cover` — no longer used for the single-line cover title (kept for reference/rollback); the cover renders `label` directly, single line, stretched.
- `color` — the track's block/background color.

### Project (basic)

```js
{ name, desc, bg, gh?, ai? }
```

Rendered as the **standard 2-slide template**: giant title slide (`t${pi}`) + placeholder info slide (`c${pi}` — "PROJECT IMAGE" box + generic paragraph). This is the fallback for any project without a `gallery` field.

### Project (rich — the ClimbLog template)

Add these fields and the project automatically switches to the richer multi-slide layout:

```js
{
  name, desc, bg, gh, ai, live,
  why,                 // longer, user-centered paragraph — the "why this exists" narrative
  image,                // hero screenshot, path under /public
  stack: [...],         // tech pills
  gallery: [
    { type:"image"|"video", src, poster?, title, desc },
    ...
  ]
}
```

Rendering rule (in the `active.projects.flatMap` block): **`proj.gallery` truthy → rich layout**, else → standard layout. This is the single branch point — don't duplicate project-type checks elsewhere.

Rich layout slide sequence:
1. **Hero slide** (`h${pi}`) — left column: name (moderate size, not full-bleed) + `why` paragraph + stack pills + "Visit Site" link. Right: `image`, rounded corners, no shadow. AI/GH badges top-right (see §5).
2. **Gallery slides** (`g${pi}-0`, `g${pi}-2`, ...) — `gallery` array is chunked **2 items per slide**, 2-column grid. Each item: media (rounded corners, **no shadow**) + title + description.
   - Do not put all 4+ items on one slide — tested and rejected, too cramped to read.
   - **Chunk starts must be computed from `proj.gallery.length`** (`Array.from({length:Math.ceil(gallery.length/2)},(_,gi)=>gi*2)`), never hardcoded as `[0,2]`. A hardcoded `[0,2]` assumes every gallery has exactly 3-4 items; for a 1-item gallery (OUTSEA) or 2-item gallery (PAPERBULLET) it produces a second chunk that's `gallery.slice(2,4)` = an empty array, which still renders as a real (blank) slide — this was a real bug, fixed once already. If a project's gallery isn't a multiple of 2, don't pad it to make the chunking "work" — fix the chunking, not the data.
   - **A chunk with exactly one item** (`chunk.length===1`, e.g. the trailing item of an odd-length gallery, or any single-item gallery like OUTSEA) renders **enlarged and centered** — single grid column (`maxWidth:900` instead of `1300`, `gridTemplateColumns:"1fr"`), taller media (`maxHeight:"72vh"` vs `"55vh"`), bigger title/desc text. Don't leave a lone item squeezed into half of a 2-column grid with dead space next to it.
   - Videos: `autoPlay loop muted playsInline`, no controls. **Must be H.264, not HEVC** — HEVC won't play in Chrome/Firefox. Convert with:
     ```
     ffmpeg -i in.mp4 -c:v libx264 -crf 23 -preset medium -an -movflags +faststart -vf "scale=-2:960" out.mp4
     ```
     This has bitten every batch of assets added so far (ClimbLog, then again with PaperBullet/OutSea) — screen recordings from macOS default to HEVC. Check codec with `ffprobe -select_streams v:0 -show_entries stream=codec_name ...` before wiring up a new gallery video, don't assume a fresh recording is already H.264.
   - Before using any screen recording, scrub it for personal/sensitive content (file pickers, desktop, personal filenames) — caught exactly this once on the ClimbLog hold-detection clip.

### Assets

Real media (screenshots/videos) live in `public/<project>/...` and are referenced by absolute path (`/climblog/home.png`), not imported — simplest for binary assets served as-is by Vite.

## 2. Shape morphing (square / triangle / circle)

All three shapes are sampled to the **same point count** (`SHAPE_PTS = 60`) so `clip-path: polygon(...)` can cross-fade between any pair via a normal CSS transition — this is what makes the square→triangle→circle→square loop smooth instead of snapping.

- `edgePoints()` — samples straight-edged shapes (square, triangle) proportionally along each edge. **Do not** go back to angle/ray-based sampling for these — it chamfers corners because no sample lands exactly on a vertex (this was a real bug, fixed once already).
- `superellipsePoint()` — smooth curve for the rounded-square↔circle spectrum (`RADIUS_CLIPS`, indexed by `MR = [0,10,26,42,50]`).
- Both straight-edged shapes are wound **clockwise starting near the top** — must match, or mid-morph frames visibly twist.
- `triShape` (boolean) overrides the radius spectrum when true; `morph` (0-4) drives the radius spectrum otherwise. Selecting Rect/Ellipse tools resets `triShape` false.

The **detail-view open/close overlay** (`ovStyle`) uses the *same* `shapeClip` so the expand/collapse animation starts from whatever shape the clicked block currently is — not always a rectangle. Its clip-path transition is deliberately short (0.2s) and offset (delayed on collapse) relative to the 0.65s box-resize transition, so the shape "unfolds" quickly near the start of the transition rather than warping the whole way through a resizing box (also a fixed bug — animating clip-path at the same duration as the box resize produces a jagged intermediate shape).

## 3. Layout invariant: `box-sizing: border-box`

There's a global `<style>{"*,*::before,*::after{box-sizing:border-box}"}</style>`. **Do not remove this.** Every full-bleed slide uses `width:"100vw"` *and* `padding`; without border-box, padding adds on top of the 100vw, so every slide silently becomes ~8-12% wider than the viewport, which desyncs `scroll-snap` positions across the entire site (not just one project — this broke wheel-scroll navigation globally when it slipped in). Slides also set `width` and `minWidth` to the same value together — both are needed (`minWidth` alone lets `flexShrink:0` + oversized content win and grow the slide past 100vw).

Any new full-width slide must:
- set `width:"100vw", minWidth:"100vw", flexShrink:0, overflow:"hidden"`
- never rely on intrinsic content size (a raw `<img>` at native resolution) without a `maxWidth`/`objectFit:"contain"` cap — same class of overflow bug, fixed twice (cover title, ClimbLog hero image).

## 4. Detail-view navigation

- Horizontal `overflowX:auto` + `scroll-snap-type:x mandatory` container (`.hscroll`), native scrollbar hidden via `::-webkit-scrollbar{display:none}` + `scrollbarWidth:"none"`.
- **Mouse wheel → horizontal scroll**: `onWheel` accumulates `deltaY` and makes a decision (advance one slide, or close if already at the end) every **~140ms** while events keep arriving — this is a **throttle**, not a debounce. That distinction matters and was the source of a real bug:
  - A pure *debounce* (reset the timer on every event, decide once after the whole gesture goes quiet) was tried first. It correctly avoided double-firing on a trackpad's momentum tail, but it also meant **one continuous scroll gesture, however long or fast, only ever advanced exactly one slide** — the whole gesture (plus its momentum tail) collapsed into a single decision. Users scrolling continuously toward the end never actually reached it, so "scroll past the end to close" appeared broken even though the close logic itself was fine.
  - The fix: only start a new timer if one **isn't already pending** (`if(wheelTimer.current)return`) instead of clearing/resetting it on every event. New events during the wait just keep accumulating into `wheelAccum`. This means a sustained scroll fires a fresh decision roughly every ~140ms + a short 320ms post-decision lock, walking through multiple slides for one continuous gesture and correctly reaching/closing at the end (verified: one held scroll gesture over ~3.8s successfully traversed 7 slides and triggered close).
  - Trade-off accepted: a single quick swipe's momentum tail can now occasionally advance 2 slides instead of 1 (vs. the old debounce's clean 1-slide-per-swipe). This is preferable to the alternative (continuous scrolling never reaching the end at all) — don't "fix" this by going back to clearTimeout-based debounce without re-solving the multi-slide-traversal problem some other way.
- **Reaching the last slide and scrolling further (`deltaY>0` at `maxIndex`) calls `close()` — "scroll past the end to close."** This is universal: it applies to every track's detail view (all project tracks *and* About), not just the one being edited at any given time — `onWheel`/`maxIndex` are computed live off `scrollRef`/`active.projects.length`, not hardcoded per track. Verified by opening each of the 6 tracks, jumping to its last slide, and confirming one more wheel-tick closes it — **and** by holding one continuous scroll gesture from slide 0 all the way to close. **Any new track or new slide type must not break this** — it only requires the new slide to be a real child of `.hscroll` with the others (don't render it in a separate portal/fixed layer, or `maxIndex` won't include it and the close-at-end will fire one slide too early).
- `onCover` tracks whether the horizontal scroll is still on slide 0 (the track cover) — the top-left "WEB DESIGN & DEV" tag is hidden there (redundant with the giant cover title) and fades in once you scroll past it.
- The **"SCROLL →" hint** appears **only once**, bottom-right of the track cover slide (slide 0). It was previously duplicated on every project title slide — consolidated to one occurrence; don't re-add it per-project.

## 5. Recurring UI conventions

- **AI/GH badges**: always grouped together in one flex row, `position:absolute, top:28, right:80`. Never position the AI badge independently on the left — it collides with the fixed top-left track-name tag (fixed bug).
- **`sub` text color** (secondary/description text): `dk ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)"` — raised from an earlier low-contrast 0.35/0.4; keep it at this brightness or higher.
- **Media treatment**: hero image gets `borderRadius:12`; gallery media gets `borderRadius:16`. **No `boxShadow` anywhere in the detail view** — removed deliberately for a flatter look.
- `isDark(color)` decides `fg`/`sub` per-slide from the project's own `bg`, not the track color — each project section can have its own background shade.
- Pagination ("01 / 06") bottom-left on every project slide, `active.projects.length` denominator.

## 6. AI-projects filter

Independent of shape/tool selection — `aiOnly` boolean toggled by the robot icon (first item in the bottom toolbar, separated from the shape tools). When on:
- Track blocks dim to 0.25 opacity unless `track.projects.some(p => p.ai)`.
- Individual project slides dim to 0.25 unless `proj.ai`.
- Tag a project `ai:true` only if it genuinely integrates an AI/ML feature (computer vision, LLM generation, etc.) — not just "written with AI assistance." (ClimbLog and the protein-bar branding project currently qualify.)

## 7. About track (`isAbout:true`)

Special-cased inside the same `.hscroll` container as every other track (see §4 — this is what keeps auto-close working for it too). Current slide sequence, in order:

1. Cover — shared with every track, giant "ABOUT & CONTACT" title.
2. `about1` — full-bleed `<img>` (`/public/about/about1.png`), `objectFit:"cover"`.
3. `about2` — full-bleed `<img>` (`/public/about/about2.png`), `objectFit:"cover"`.
4. `bio` — tags (#UX Engineer etc.) + `why`-style intro paragraph + education lines (MSc then BSc) + contact links (Email/GitHub/LinkedIn/Instagram/Letterboxd).
5. `pacman` — the `<PacMan>` widget, its own dedicated slide (not squeezed onto the bio slide — tried that, too cramped).

If about1/about2 get swapped for new images, keep them as their own dedicated full-bleed slides (don't merge into the bio slide) — matches the "one idea per screen" pattern used everywhere else.

### PacMan widget

Recreated from a screenshot of an older site (no source CSS/JS was available, so this is a reconstruction, not a port). Key facts if it needs tweaking again:
- `pacRectPoint(d,w,h)` walks a plain rectangle perimeter clockwise from top-left; returns `{x,y}` (no `dir`/rotation — the token doesn't rotate).
- The token itself is **not** a classic circular Pac-Man with a chomping mouth — it's a small rounded octagon (`clip-path: polygon(...)`), solid color, no animation besides moving. (An earlier version drew an actual mouth-wedge circle; the real reference screenshot showed a plain rounded token, so that was wrong and was replaced.)
- Dots line the perimeter only (not scattered inside); a dot is "eaten" (opacity 0) once the token's current lap position has passed it, and all dots reset at the start of each lap.
- Corner labels (`WEB DESIGN` / `POSTER` / `UI/UX` / `FILM CURATION`) and a center CTA card ("AVAILABLE FOR FREELANCE" + EMAIL + INSTAGRAM buttons, real `mailto:`/Instagram links) are both required parts of the widget, not optional decoration — the center card was missing in the first pass and had to be added back after comparing against a real screenshot.
- Rendered large/landscape (`w=900,h=480` by default) since it now has its own full slide — don't shrink it back down to fit alongside other content.

## 8. Adding a new rich project (checklist)

1. Gather real screenshots + short muted H.264 screen recordings (see §1 codec note). Scrub for personal info.
2. Copy assets into `public/<slug>/`.
3. Add a project object with `image`, `stack`, `why`, `gallery` (2-4 items) — see the CLIMBLOG entry as the reference example.
4. If it's a genuine AI project, set `ai:true`.
5. Run the dev server and click through: cover → hero → each gallery page → confirm auto-close at the end, confirm wheel scroll feels right, confirm no layout overflow (slide widths should measure exactly 1440px-equivalent, i.e. one clean viewport per slide — this is the single most common regression class in this file).
