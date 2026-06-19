# Deferred Enhancements

Items captured here are intentionally deferred until after GitHub Pages and Cloudflare deployment milestones are complete. None of these block the infrastructure work.

---

## Phase 3 — Interactive UI Transitions

**Status:** Deferred — post-infrastructure
**Complexity:** Easy to Moderate
**Hosting compatibility:** Fully compatible with GitHub Pages and Cloudflare Pages (CSS/JS only, no server required)

### Candidate Effects

#### Landing Page (index.html)

| Effect | Complexity | Notes |
|---|---|---|
| Active card glow + subtle scale on focus | Easy | CSS transition on `.card-active:focus` |
| Arrow key card focus shift with visual feedback | Easy | Already mostly built in `landing.js` |
| Locked card shake on Enter/click | Already built | No additional work needed |
| Enter System fade/scan transition before navigation | Moderate | Short 300–600ms CSS animation + JS delay before `window.location.href` |

#### Profile Page (profile.html)

| Effect | Complexity | Notes |
|---|---|---|
| Dossier fade-in on load | Easy | CSS `@keyframes` on body or `.dossier-shell` |
| Panel staggered reveal on load | Easy–Moderate | CSS animation-delay per panel, or Intersection Observer |
| Subtle HUD pulse on system status indicator | Easy | CSS keyframe pulse on `.status-dot` |

---

## Implementation Guidelines (When Ready)

- Maximum transition duration: 300–600ms
- No transitions longer than 600ms — recruiter experience must remain fast
- All animations must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

- No JavaScript animation frameworks required — CSS transitions and `@keyframes` are sufficient
- No React, no GSAP, no external animation libraries for v1
- Keyboard accessibility must be maintained throughout — transitions cannot block focus or navigation
- All effects must be skippable via normal browser behavior (Escape, Tab, direct URL navigation)

---

## Phase 3 — Additional Visual Polish

**Status:** Deferred — post-infrastructure

| Item | Notes |
|---|---|
| Landing page active card sizing refinement | Active card could be slightly larger relative to locked cards |
| Header circuit trace decoration strengthening | More defined flanking lines either side of "PROFESSIONAL SELECT" |
| Locked card detailing | Lock icon, inner border, more defined shape |
| Additional healthcare imaging perimeter art | More DICOM motifs, extend coverage further down the page |
| Healthcare-themed background enhancements | Reference image provided — blue/cyan hex medical nodes, 5–10% opacity |
| Portrait rail background texture refinement | Currently hex tile pattern at 0.15 opacity — may want to adjust after full polish |

---

## Decision

All Phase 3 items are explicitly deferred until:

```text
✅ GitHub Pages live (complete)
⏳ Cloudflare DNS + custom domain
⏳ Cloudflare Pages secondary origin
⏳ Cloudflare Load Balancer configured
⏳ WAF, rate limiting, bot protection active
⏳ Infrastructure documentation complete
```

The site's primary value proposition is the infrastructure architecture it runs on, not the animations. Phase 3 polish adds credibility to the frontend story but does not materially affect the infrastructure demonstration.