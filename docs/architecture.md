# Architecture

## Overview

`ryanvalera-com` is a static portfolio platform deployed across GitHub Pages and Cloudflare infrastructure. The website itself is intentionally lightweight — a two-page static site serving as a payload for demonstrating real-world infrastructure engineering concepts including DNS administration, SSL/TLS, CDN edge caching, WAF, rate limiting, load balancing, origin failover, and CI/CD automation.

---

## Current Architecture (Milestone 6A)

```text
Visitor
   ↓
GitHub Pages
https://valeratech.github.io/ryanvalera-com/
```

---

## Target Architecture (Milestone 6D)

```text
Visitor
   ↓
Cloudflare
   ├── DNS (Authoritative)
   ├── SSL/TLS (Full Strict)
   ├── CDN (Edge Cache)
   ├── WAF (Managed Rules)
   ├── Rate Limiting
   ├── Bot Protection
   └── Load Balancer
         ├── Origin 1: GitHub Pages (Primary)
         └── Origin 2: Cloudflare Pages (Secondary)
```

---

## Components

### Static Site

| File | Purpose |
|---|---|
| `index.html` | Landing page — Professional Select character screen |
| `profile.html` | Professional dossier — Healthcare Imaging IT Engineer |
| `assets/css/variables.css` | Shared design tokens |
| `assets/css/styles.css` | Landing page styles |
| `assets/css/profile.css` | Dossier page styles |
| `assets/js/landing.js` | Landing page interactivity |
| `assets/images/ryan-valera-profile.png` | Portrait — transparent PNG |

---

### GitHub Pages (Primary Origin)

| Property | Value |
|---|---|
| Repository | `github.com/valeratech/ryanvalera-com` |
| Branch | `main` |
| Root | `/` (repo root) |
| Live URL | `https://valeratech.github.io/ryanvalera-com/` |
| Custom Domain | `ryanvalera.com` (pending Cloudflare DNS) |
| HTTPS | Enforced by GitHub Pages |
| Deployment | Automatic on push to `main` |

---

### Cloudflare Pages (Secondary Origin — Planned)

| Property | Value |
|---|---|
| Project | `ryanvalera-pages` |
| Source | Same GitHub repository (`valeratech/ryanvalera-com`) |
| Branch | `main` |
| Build | None required (static site) |
| URL | `https://ryanvalera-pages.pages.dev` (pending) |
| Purpose | Failover origin for Cloudflare Load Balancer |

---

### Cloudflare Load Balancer (Planned)

| Property | Value |
|---|---|
| Primary Pool | GitHub Pages |
| Secondary Pool | Cloudflare Pages |
| Steering | Failover |
| Health Checks | HTTPS GET `/` — status code, response time |
| Interval | 60 seconds |

---

### DNS (Planned)

| Record | Type | Value |
|---|---|---|
| `ryanvalera.com` | A / CNAME | GitHub Pages / Cloudflare LB |
| `www.ryanvalera.com` | CNAME | `ryanvalera.com` |

---

### SSL/TLS (Planned)

| Property | Value |
|---|---|
| Mode | Full (Strict) |
| HSTS | Enabled |
| Minimum TLS | 1.3 |
| Always Use HTTPS | Enabled |

Both origins (GitHub Pages and Cloudflare Pages) present valid HTTPS certificates natively, satisfying Full Strict mode without requiring additional certificate configuration.

See `docs/decisions/ADR-002.md` for the rationale behind origin selection.

---

## Known Limitations

### Cloudflare as Shared Control Plane

Cloudflare serves as the shared front door and control plane for DNS resolution, Load Balancer routing, WAF enforcement, and access to the Cloudflare Pages origin. A major Cloudflare platform event could affect all of these simultaneously.

GitHub Pages remains independently reachable if Cloudflare DNS is bypassed directly via the `valeratech.github.io/ryanvalera-com/` URL.

This trade-off is accepted and documented. The goal of this project is to demonstrate Cloudflare platform engineering, not to build cross-provider redundancy.

See `docs/decisions/ADR-001.md`.

---

## Deployment Model

```text
git push → main
      ↓
GitHub Pages
      ↓
Automatic deployment (no build step required)
      ↓
Live at ryanvalera.com (via Cloudflare DNS)
```

Cloudflare Pages deploys in parallel from the same branch automatically once connected.

---

## Repository Structure

```text
ryanvalera-com/
│
├── index.html              ← Landing page
├── profile.html            ← Professional dossier
│
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── styles.css
│   │   └── profile.css
│   ├── js/
│   │   └── landing.js
│   ├── images/
│   │   └── ryan-valera-profile.png
│   └── fonts/              ← Reserved (Google Fonts via CDN currently)
│
├── docs/
│   ├── architecture.md     ← This document
│   ├── cloudflare.md       ← Cloudflare configuration reference
│   ├── ci-cd.md            ← Deployment pipeline documentation
│   ├── runbooks/
│   │   ├── github-pages.md
│   │   ├── origin-failure.md
│   │   ├── pages-failure.md
│   │   ├── cloudflare-failure.md
│   │   ├── failed-deployment.md
│   │   ├── dns-incident.md
│   │   └── failover-test.md
│   └── decisions/
│       ├── ADR-001.md
│       ├── ADR-002.md
│       ├── ADR-003.md
│       └── ADR-004.md
│
├── .github/
│   └── workflows/          ← CI/CD workflows (planned)
│
├── .gitignore
└── README.md
```
