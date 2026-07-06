# Dynamic HTML5 Preview Strategy v2.0
## Engineering Presentation Engine

## Purpose

The Dynamic HTML5 Preview is an engineering presentation built from authentic production evidence.

It communicates engineering concepts through carefully composed HTML/CSS scenes inspired by real production screenshots.

The objective is not to reproduce another application's user interface.

The objective is to communicate engineering clearly while preserving complete technical authenticity.

## Core Philosophy

Every screenshot is considered reference material.

Every preview slide is considered an engineering presentation.

```text
Production Screenshot
        │
        ▼
Engineering Analysis
        │
        ▼
Information Extraction
        │
        ▼
HTML Engineering Composition
        │
        ▼
HUD
        │
        ▼
Motion
        │
        ▼
Final Dynamic Preview
```

The screenshot informs the slide. The screenshot does not dictate the slide.

## Engineering Fidelity

Everything technical remains authentic. Preserve: configuration values, status indicators, DNS records, service names, health states, architecture, relationships, workflow order, production evidence.

Nothing technical should be invented.

## Presentation Fidelity

The presentation is intentionally flexible. Slides may: redesign layouts, combine related panels, reorganize information, remove navigation, remove empty space, simplify containers, increase readability, improve hierarchy.

Slides should feel inspired by the original application — not constrained by it.

## HTML-First Rendering

The Dynamic Preview is now HTML-first. Screenshots are no longer the rendered output. Screenshots become design references used to build lightweight HTML compositions.

Example:

```text
Cloudflare Screenshot
        │
        ▼
Extract:
  • Header
  • Status
  • Metrics
  • DNS Records
  • Load Balancer
        │
        ▼
Render as native HTML
```

Advantages: perfect scaling, responsive layout, clean typography, consistent spacing, no cropping issues, small payload, smooth animation.

## Screenshot Usage

Screenshots remain essential. They serve as: engineering reference, visual reference, verification source, configuration source.

They are no longer the final rendered asset.

## One Slide — One Engineering Story

Each slide communicates exactly one engineering concept:

```text
01 // GLOBAL PLATFORM     Platform health, Operational telemetry, Deployment state
02 // DNS ARCHITECTURE    DNS records, Proxy routing, Load Balancer
03 // CACHE GOVERNANCE    Cache rules, TTL, Browser cache, Edge cache
```

The slide should present only the information required to communicate that concept.

## Cloudflare Visual Language

Slides should feel unmistakably inspired by Cloudflare. Use: Cloudflare typography hierarchy, Cloudflare spacing, Cloudflare card style, Cloudflare colors, Cloudflare iconography where appropriate, Cloudflare visual rhythm.

Do not attempt pixel-perfect reproduction. The objective is familiarity, not imitation.

## Information Hierarchy

Prioritize engineering information.

Example — show:

```text
DNS records
  www
  pages

Proxy Enabled

Load Balancer
  Status
```

Rather than reproducing: search bars, filters, edit buttons, navigation, account controls, help links, unused whitespace.

## Layout Freedom

Containers may be resized, merged, split, reordered, simplified — provided the engineering meaning remains unchanged.

The resulting layout should maximize clarity inside the fixed preview viewport.

## Motion Philosophy

Motion should enhance presentation, not imitate interaction.

Recommended: Ken Burns, gentle pan, subtle zoom, fade transitions.

Avoid: fake clicks, scrolling, simulated dashboards, excessive UI animation.

## HUD

The HUD remains consistent:

```text
02 // DNS ARCHITECTURE

STATUS      Active
RECORDS     2
PROXY       Enabled
ROUTING     Cloudflare
```

The HUD should complement — not duplicate — the slide.

## Relationship to the Live Preview

The Dynamic Preview communicates. The Live Preview demonstrates.

The Dynamic Preview answers: *What was engineered?*
The Live Preview answers: *How was it actually configured?*

The Live Preview remains the authoritative representation of the original interface.

## Engineering Presentation Notice

Every preview includes:

```text
ⓘ Engineering Presentation
Preview scenes may be cropped, rearranged, or enhanced for clarity while
preserving authentic engineering evidence. The "KEY VIDEO WALKTHROUGHS"
section contains the original interface and actual configurations.
```

This establishes expectations while reinforcing the authenticity of the engineering.

## Future Workflow

Every new project follows the same pipeline:

```text
Capture Production Screenshot
        │
        ▼
Identify Engineering Story
        │
        ▼
Extract Essential Information
        │
        ▼
Design HTML Composition
        │
        ▼
Apply Project Visual Language
        │
        ▼
Add HUD
        │
        ▼
Add Motion
        │
        ▼
Publish Dynamic Preview
```

## Final Design Principle

Build the presentation, not the application.

Or, more fundamentally:

> **Present authentic engineering through purpose-built compositions inspired by real production systems.**

---

### Note on v1 → v2.0

v1 ("Preserve the engineering, not the geometry") treated the screenshot itself — cropped, color-graded, composited — as the final rendered asset, fit into a fixed-ratio viewport via `object-fit: cover`. That approach surfaced a persistent class of bugs (crop-ratio math, edge clipping, alignment fighting Ken Burns motion) because raster images and a fixed-ratio box are fundamentally in tension when screenshot shapes vary widely between tools.

v2.0 resolves this at the architecture level: screenshots are reference material only. The rendered slide is native HTML/CSS, which reflows and scales without cropping. This removes the entire problem class rather than patching it slide-by-slide.
