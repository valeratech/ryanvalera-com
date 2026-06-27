# ryanvalera-com

Production portfolio platform demonstrating Healthcare Imaging IT and Cloudflare platform engineering.

**Live site:** [ryanvalera.com](https://ryanvalera.com)
**Current release:** v1.0.0

First complete public release. The website is considered feature-complete; future releases expand engineering evidence through Cloudflare operations, AWS reliability projects, and Healthcare Imaging initiatives.

---

## What This Repository Is

This repository serves two distinct purposes:

**1. The portfolio site itself**
A static two-page site presenting Ryan Valera's Healthcare Imaging IT engineering background — DICOM systems, PACS architecture, Linux administration, clinical interoperability, and infrastructure operations.

**2. A Cloudflare platform engineering demonstration**
The infrastructure supporting the site demonstrates real-world Cloudflare platform engineering: DNS, SSL/TLS, CDN edge caching, WAF, bot protection, rate limiting, Load Balancing with multi-origin failover, Transform Rules, and operational documentation. The site is the payload. The infrastructure is the project.

---

## Design Philosophy

This repository intentionally separates three complementary artifacts:

| Artifact | Purpose |
|---|---|
| Website | Introduces the engineer and demonstrates operational capability |
| Repositories | Provide implementation details and engineering evidence |
| Resume | Documents professional experience and employment history |

The website complements the resume rather than duplicating it, allowing each artifact to communicate what it does best.

---

## Architecture

```text
Visitor
    ↓
Cloudflare (DNS / Proxy / SSL / WAF / Cache / Load Balancer)
    ├── Primary:   GitHub Pages (valeratech.github.io)
    └── Secondary: Cloudflare Pages (pages.ryanvalera.com)
```

Both origins deploy identical content from this repository. Cloudflare Load Balancing continuously validates origin health and automatically fails over to the secondary origin if the primary becomes unavailable.

---

## Site Structure

```text
ryanvalera-com/
├── index.html              ← Landing page (Professional Select / operator entry)
├── profile.html            ← Professional dossier (Healthcare Imaging IT Engineer)
├── CNAME                   ← Custom domain configuration for GitHub Pages
│
├── assets/
│   ├── css/
│   │   ├── variables.css   ← Design tokens
│   │   ├── styles.css      ← Landing page styles
│   │   └── profile.css     ← Dossier styles
│   ├── js/
│   │   ├── landing.js      ← Landing page HUD streaming and card materialization
│   │   └── profile.js      ← Profile page initialization, panel reveals, portrait digitization
│   └── images/
│       ├── ryan-valera-profile.png          ← Full portrait (profile page)
│       └── ryan-valera-profile-cropped.png  ← Waist-up portrait (landing card)
│
└── docs/
    ├── architecture.md
    ├── cloudflare.md
    ├── cache-governance.md
    ├── analytics-baseline.md
    ├── deferred-enhancements.md
    ├── decisions/
    │   ├── ADR-001.md  ← Cloudflare as shared control plane
    │   ├── ADR-002.md  ← Cloudflare Pages as secondary origin
    │   ├── ADR-003.md  ← GitHub Pages as primary origin
    │   ├── ADR-004.md  ← Why Load Balancing was implemented
    │   └── ADR-005.md  ← Cloudflare R2 future phase
    └── runbooks/
        ├── github-pages.md
        └── load-balancer.md
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
| Cloudflare R2 | ⏳ Future | media.ryanvalera.com |

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
Cloudflare cache purge — manual (CI/CD automation planned, Milestone 6E)
```

**Live URLs:**
```text
https://ryanvalera.com                        ← Production (Load Balancer)
https://valeratech.github.io/ryanvalera-com/ ← GitHub Pages direct
https://ryanvalera-com.pages.dev             ← Cloudflare Pages direct
https://pages.ryanvalera.com                 ← Cloudflare Pages custom domain
```

---

## Documentation

| Document | Description |
|---|---|
| `docs/architecture.md` | Full platform architecture and component table |
| `docs/cloudflare.md` | Cloudflare configuration reference |
| `docs/cache-governance.md` | Cache policy, purge procedures, CI/CD roadmap |
| `docs/analytics-baseline.md` | First 24-hour traffic and security observations |
| `docs/deferred-enhancements.md` | Deferred infrastructure and portfolio enhancements |
| `docs/runbooks/load-balancer.md` | Load Balancer provisioning and failover test results |
| `docs/runbooks/github-pages.md` | GitHub Pages deployment runbook |
| `docs/decisions/ADR-001 through 005` | Architecture decision records |

---

## Roadmap

### v1.1
- AWS Reliability Layer repository

### v1.2
- AWS DNS & Certificate Health Platform repository

### v1.3
- Additional Healthcare Imaging engineering projects

### Long-term
- CDIP
- CIIP

---

## Certifications

- CompTIA Security+
- Cloudflare Accredited Configuration Engineer
- CompTIA CySA+ (Cybersecurity Analyst)
- Red Sift Elite Sifter Implementation Expert (DMARC)
- Red Sift Elite Sifter Solutions Expert (Email Security)
- SIIM Member
- HIMSS Member
