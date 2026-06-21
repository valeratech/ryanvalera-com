# ryanvalera-com

Personal portfolio platform for Ryan Valera — Healthcare Imaging IT Engineer.

**Live site:** [ryanvalera.com](https://ryanvalera.com)

---

## What This Repository Is

This repository serves two distinct purposes:

**1. The portfolio site itself**
A static two-page site presenting Ryan Valera's Healthcare Imaging IT engineering background — DICOM systems, PACS architecture, Linux administration, clinical interoperability, and infrastructure operations.

**2. A Cloudflare platform engineering demonstration**
The infrastructure supporting the site demonstrates real-world Cloudflare platform engineering: DNS, SSL/TLS, CDN edge caching, WAF, bot protection, rate limiting, Load Balancing with multi-origin failover, Transform Rules, and operational documentation. The site is the payload. The infrastructure is the project.

---

## Architecture

```text
Visitor
    ↓
Cloudflare (DNS / Proxy / SSL / WAF / Cache / Load Balancer)
    ├── Primary:   GitHub Pages (valeratech.github.io)
    └── Secondary: Cloudflare Pages (pages.ryanvalera.com)
```

Both origins serve identical content from this repository. Cloudflare Load Balancing performs health checks every 60 seconds and automatically fails over to the secondary origin if the primary becomes unhealthy.

---

## Site Structure

```text
ryanvalera-com/
├── index.html              ← Landing page (Professional Select character screen)
├── profile.html            ← Professional dossier (Healthcare Imaging IT Engineer)
├── CNAME                   ← Custom domain configuration for GitHub Pages
│
├── assets/
│   ├── css/
│   │   ├── variables.css   ← Design tokens
│   │   ├── styles.css      ← Landing page styles
│   │   └── profile.css     ← Dossier styles
│   ├── js/
│   │   └── landing.js      ← Landing page interactivity
│   └── images/
│       └── ryan-valera-profile.png
│
└── docs/
    ├── architecture.md         ← Full platform architecture
    ├── cloudflare.md           ← Cloudflare configuration reference
    ├── cache-governance.md     ← Cache policy and CI/CD invalidation roadmap
    ├── analytics-baseline.md   ← First 24-hour traffic and security observations
    ├── deferred-enhancements.md ← Phase 3 UX polish and R2 future phase
    ├── decisions/
    │   ├── ADR-001.md  ← Cloudflare as shared control plane
    │   ├── ADR-002.md  ← Cloudflare Pages as secondary origin
    │   ├── ADR-003.md  ← GitHub Pages as primary origin
    │   ├── ADR-004.md  ← Why Load Balancing was implemented
    │   └── ADR-005.md  ← Cloudflare R2 future phase
    └── runbooks/
        ├── github-pages.md     ← GitHub Pages deployment runbook
        └── load-balancer.md    ← Load Balancer configuration and failover test results
```

---

## Cloudflare Platform Components

| Component | Status | Notes |
|---|---|---|
| DNS (Authoritative) | ✅ Active | curt.ns / georgia.ns.cloudflare.com |
| Proxy / CDN | ✅ Active | Orange cloud, LAX edge |
| SSL/TLS Full Strict | ✅ Active | TLS 1.3, min TLS 1.2 |
| Always Use HTTPS | ✅ Active | |
| Transform Rules | ✅ Active | Fingerprint removal + security headers |
| Cache Rules | ✅ Active | /assets/* — 1 month edge, 7 day browser |
| Bot Fight Mode | ✅ Active | |
| Block AI Bots | ✅ Active | |
| Rate Limiting | ✅ Active | 40 req/10s, Block |
| WAF Managed Rules | ⚠️ Free tier | Baseline protection active |
| Load Balancing | ✅ Active | Failover steering, 60s health checks |
| Health Monitor | ✅ Active | HTTPS GET /, 200-OK + body validation |
| Cloudflare Pages | ✅ Active | Secondary failover origin |
| HSTS | ⏳ Deferred | Enable after full stability confirmed |
| Content-Security-Policy | ⏳ Deferred | Requires asset source inventory |
| GitHub Actions CI/CD | ⏳ Planned | Milestone 6E |
| Cloudflare R2 | ⏳ Future | media.ryanvalera.com — post Milestone 6D |

---

## Deployment

The site deploys automatically on every push to `main`:

```text
git push → main
    ↓
GitHub Pages (primary origin) — automatic
    ↓
Cloudflare Pages (secondary origin) — automatic
    ↓
Cloudflare cache purge — manual (CI/CD automation planned)
```

**Live URLs:**
```text
https://ryanvalera.com          ← Production (Load Balancer)
https://valeratech.github.io/ryanvalera-com/  ← GitHub Pages direct
https://ryanvalera-com.pages.dev              ← Cloudflare Pages direct
https://pages.ryanvalera.com                  ← Cloudflare Pages custom domain
```

---

## Documentation

| Document | Description |
|---|---|
| `docs/architecture.md` | Full platform architecture and component table |
| `docs/cloudflare.md` | Cloudflare configuration reference (all 6B settings) |
| `docs/cache-governance.md` | Cache policy, purge procedures, CI/CD roadmap |
| `docs/analytics-baseline.md` | First 24-hour traffic and security observations |
| `docs/runbooks/load-balancer.md` | Load Balancer provisioning and failover test results |
| `docs/runbooks/github-pages.md` | GitHub Pages deployment runbook |
| `docs/decisions/ADR-001 through 005` | Architecture decision records |

---

## Certifications

- CompTIA Security+
- Cloudflare Accredited Configuration Engineer
- CompTIA CySA+ (Cybersecurity Analyst)
- Blue Team Level 1 (BTL1)
- Red Sift Elite Sifter Implementation Expert (DMARC)
- Red Sift Elite Sifter Solutions Expert (Email Security)