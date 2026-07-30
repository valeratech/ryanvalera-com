# ryanvalera-com

Personal portfolio platform for Ryan Valera — Cybersecurity & Infrastructure Engineer.

**Live site:** [ryanvalera.com](https://ryanvalera.com)
**Current release:** v1.5.0

---

## What This Repository Is

This repository serves two distinct purposes:

**1. The portfolio platform itself**
A five-page engineering platform presenting Ryan Valera's work across cybersecurity operations, cloud and network infrastructure, and platform engineering. The focus is security operations and defensive engineering — SOC tooling, detection engineering, and DFIR investigation — built on a foundation of infrastructure engineering: Linux administration, DNS and email security, networking, and Cloudflare platform operations. Healthcare imaging IT (DICOM, PACS, interoperability) appears as one infrastructure domain among these, not the headline.

**2. A Cloudflare platform engineering demonstration**
The infrastructure supporting the site demonstrates real-world Cloudflare platform engineering: DNS, SSL/TLS, CDN edge caching, WAF, bot protection, rate limiting, Load Balancing with multi-origin failover, Transform Rules, cache governance, Bulk Redirects, and operational documentation. The site is the payload. The infrastructure is the project.

---

## Architecture

```text
Visitor
    ↓
Cloudflare (DNS / Proxy / SSL / WAF / Cache / Load Balancer)
    ├── Primary:   GitHub Pages (valeratech.github.io)
    └── Secondary: Cloudflare Pages (pages.ryanvalera.com)
```

Both origins serve identical content from this repository. Cloudflare Load Balancing performs health checks and automatically fails over to the secondary origin if the primary becomes unhealthy. Both origins enforce canonical redirection to `ryanvalera.com` so the edge control plane is never bypassed (see ADR-006).

---

## Site Structure

```text
ryanvalera-com/
├── index.html              ← Landing page (SYSTEM SELECT)
├── profile.html            ← Professional dossier
├── projects.html           ← Engineering portal (project card grid)
├── media.html              ← Project media runtime (per-project engineering previews)
├── contact.html            ← Contact module
├── CNAME                   ← Custom domain configuration for GitHub Pages
├── favicon.ico             ← Multi-resolution browser icon (16/32/48)
├── site.webmanifest        ← Web app manifest (theme + install metadata)
├── .gitleaks.toml          ← Secret-scan configuration (value allowlist, never paths)
│
├── .github/workflows/
│   ├── deploy-and-purge.yml    ← Cloudflare cache purge on successful Pages build
│   └── security-gates.yml      ← Blocking: full-history secret scan + image metadata
│
├── assets/
│   ├── css/
│   │   ├── variables.css   ← Design tokens
│   │   ├── styles.css      ← Landing page styles
│   │   ├── profile.css     ← Professional dossier styles
│   │   ├── projects.css    ← Engineering portal styles
│   │   ├── media.css       ← Media runtime + per-project artboard styles
│   │   └── contact.css     ← Contact module styles
│   ├── js/
│   │   ├── landing.js      ← Landing page HUD streaming and card materialization
│   │   ├── profile.js      ← Profile page panel reveals and portrait digitization
│   │   ├── projects.js     ← Engineering portal card interactions and streaming
│   │   ├── media.js        ← Media runtime engine (shared scene factory + per-project scenes)
│   │   └── contact.js      ← Contact module streaming and sequential reveal
│   └── images/
│       ├── ryan-valera-profile.webp                          ← Full portrait (profile page)
│       ├── ryan-valera-profile-cropped.webp                  ← Waist-up portrait (landing card)
│       ├── engineering-cybersec-portal-background.webp       ← Landing portal card artwork
│       ├── cloudflare-github-pages-background.webp           ← Cloudflare project card artwork
│       ├── cybersecurity-investigations-background.webp      ← Cybersecurity project card artwork
│       ├── microsoft-sentinel-defender-background.webp       ← Sentinel & Defender XDR card artwork
│       ├── linux-infrastructure-background.webp              ← Linux Infrastructure card artwork
│       ├── penetration-testing-background.webp               ← Penetration Testing card artwork
│       ├── ai-engineering-validation-platform-background.webp ← AIVP card artwork
│       ├── file-triage-orchestration-api-background.webp     ← File Triage API card artwork
│       ├── aws-reliability-layer-background.webp             ← AWS project card artwork
│       ├── orthanc-background.webp                           ← Orthanc project card artwork
│       ├── favicon-16.png                                    ← Browser tab icon (16px, transparent)
│       ├── favicon-32.png                                    ← Browser tab icon (32px, transparent)
│       ├── apple-touch-icon.png                              ← iOS home screen icon (180px)
│       ├── icon-192.png                                      ← Android / PWA icon (192px)
│       └── icon-512.png                                      ← PWA splash icon (512px)
│
└── docs/
    ├── architecture.md
    ├── cloudflare.md
    ├── cache-governance.md
    ├── ci-cd.md
    ├── analytics-baseline.md
    ├── media-preview.md
    ├── deferred-enhancements.md
    ├── decisions/
    │   ├── README.md   ← Index
    │   ├── ADR-001.md  ← Cloudflare as shared control plane
    │   ├── ADR-002.md  ← Cloudflare Pages as secondary origin
    │   ├── ADR-003.md  ← GitHub Pages as primary origin
    │   ├── ADR-004.md  ← Why Load Balancing was implemented
    │   ├── ADR-005.md  ← Cloudflare R2 Engineering Media Layer
    │   └── ADR-006.md  ← Canonical origin enforcement
    └── runbooks/
        ├── README.md   ← Index
        ├── github-pages.md
        ├── load-balancer.md
        └── notifications.md
```

---

## Platform Navigation

```text
SYSTEM SELECT (index.html)
        │
        ├─────────────────────────┐
        │                         │
        ▼                         ▼
PROFESSIONAL DOSSIER        ENGINEERING PORTAL
(profile.html)              (projects.html)
        │                         │
        ▼                         ▼
CONTACT MODULE              PROJECT MEDIA
(contact.html)              (media.html?project=…)
```

---

## Engineering Projects

The Engineering Portal presents nine active projects plus three reserved slots, laid out as a 3×4 grid. Each card links either to a project media runtime (an interactive, per-project engineering preview) or directly to its repository.

| Card | Project | Focus | Stack | Link |
|------|---------|-------|-------|------|
| 01 | Cloudflare Platform | Platform engineering | Cloudflare, GitHub Pages, GitHub Actions | [ryanvalera-com](https://github.com/valeratech/ryanvalera-com) |
| 02 | Cybersecurity Investigations | DFIR / blue-team | Splunk, Elastic, Sentinel, Zeek, Suricata, Volatility | [cybersecurity-investigations-portfolio](https://github.com/valeratech/cybersecurity-investigations-portfolio) |
| 03 | Microsoft Sentinel & Defender XDR | Security operations | Defender for Endpoint, Defender XDR, Sentinel, Log Analytics, KQL | [defender-sentinel-soc-lab](https://github.com/valeratech/defender-sentinel-soc-lab) |
| 04 | Linux Infrastructure | Platform engineering | nginx, Apache, PHP-FPM, VMware lab, isolated build environment | [linux-infrastructure-portfolio](https://github.com/valeratech/linux-infrastructure-portfolio) |
| 05 | Penetration Testing | Offensive security | Reconnaissance, enumeration, exploitation, privilege escalation, MITRE ATT&CK | [penetration-testing-portfolio](https://github.com/valeratech/penetration-testing-portfolio) |
| 06 | AI Engineering Validation Platform | AI tooling | Gradio, Claude Haiku 4.5 (builder), GPT-4.1 mini (reviewer) | github.com/valeratech |
| 07 | File Triage Orchestration API | Backend / orchestration | FastAPI, SQLAlchemy 2.x, Pydantic v2, SQLite, pytest | github.com/valeratech |
| 08 | AWS Reliability Layer | Cloud reliability | AWS Lambda, EventBridge, CloudWatch, SNS, S3, Budgets | github.com/valeratech |
| 09 | Orthanc + Mirth Connect | Healthcare infrastructure | Orthanc PACS, Mirth Connect, DICOM, HL7, PostgreSQL | [healthcare-imaging-lab](https://github.com/valeratech/healthcare-imaging-lab) |

Linux Infrastructure is an index repository rather than a single build: it holds the
shared conventions its child projects are held to. Its media runtime therefore shows
**representative configuration previews**, marked as such in the runtime chrome, and is
replaced with captured evidence as child projects publish. See `docs/media-preview.md`.

---

## Cloudflare Platform Components

| Component | Status | Notes |
|---|---|---|
| DNS (Authoritative) | ✅ Active | Cloudflare nameservers |
| Proxy / CDN | ✅ Active | Orange cloud, LAX edge |
| SSL/TLS Full Strict | ✅ Active | TLS 1.3, min TLS 1.2 |
| Always Use HTTPS | ✅ Active | |
| Transform Rules | ✅ Active | Fingerprint removal + security headers |
| Cache Rules | ✅ Active | Static Assets (/assets/* — 1 month edge, 7 day browser) + HTML Revalidation (10 min) |
| Cache Purge Automation | ✅ Active | GitHub Actions — versioned assets + automated HTML purge |
| Security Gates (CI) | ✅ Blocking | gitleaks full-history scan + image metadata + tracked-secret check |
| Bot Fight Mode | ✅ Active | |
| Block AI Bots | ✅ Active | |
| Rate Limiting | ✅ Active | 40 req/10s, Block |
| WAF Managed Rules | ⚠️ Free tier | Baseline protection active |
| Load Balancing | ✅ Active | Multi-origin failover, health checks, body validation |
| Health Monitor | ✅ Active | HTTPS GET /, 200-OK + body validation |
| Cloudflare Pages | ✅ Active | Secondary failover origin |
| Bulk Redirects | ✅ Active | Canonical origin enforcement (ADR-006) |
| HSTS | ⏳ Deferred | Enable after full stability confirmed |
| Content-Security-Policy | ⏳ Deferred | Requires asset source inventory |
| Cloudflare R2 | ⏳ Future | media.ryanvalera.com — engineering media layer |

---

## Roadmap

**Completed**

- CI/CD + cache governance (GitHub Actions, versioned assets, automated purge)
- Blocking security gates — full-history secret scan, image metadata, environment files
- Engineering Portal — nine active projects plus three reserved slots (3×4 grid)
- Project media runtime (`media.html`) — shared scene engine with per-project previews
- Canonical origin enforcement (ADR-006) — both origins redirect to canonical
- Favicon and web app manifest across all five pages
- WebP artwork conversion — eager portal payload reduced from 14.76 MB to ~2.0 MB
- Penetration Testing media runtime — nine scenes closing on defensive analysis
- Microsoft Sentinel & Defender XDR media runtime — four scenes
- Linux Infrastructure media runtime — four representative configuration previews

**Current**

- Cloudflare R2 Engineering Media Layer
- Mobile rendering pass across all pages — payload and tap targets done, layout pass outstanding

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
page_build event → GitHub Actions (deploy-and-purge.yml)
    ↓
Cloudflare cache purge — automatic (HTML documents + media prefix)
```

**Live URLs:**
```text
https://ryanvalera.com                          ← Production (Load Balancer)
https://valeratech.github.io/ryanvalera-com/    ← GitHub Pages direct (301 → canonical)
https://ryanvalera-com.pages.dev                ← Cloudflare Pages direct (301 → canonical)
https://pages.ryanvalera.com                    ← Cloudflare Pages custom domain (LB secondary)
```

---

## Documentation

| Document | Description |
|---|---|
| `docs/architecture.md` | Full platform architecture and component table |
| `docs/cloudflare.md` | Cloudflare configuration reference |
| `docs/cache-governance.md` | Cache policy, purge procedures, versioning discipline |
| `docs/ci-cd.md` | Deployment workflow, purge automation, and blocking security gates |
| `docs/analytics-baseline.md` | First 24-hour traffic and security observations |
| `docs/media-preview.md` | Media runtime design and per-project preview standards |
| `docs/runbooks/load-balancer.md` | Load Balancer provisioning and failover test results |
| `docs/runbooks/github-pages.md` | GitHub Pages deployment runbook |
| `docs/runbooks/notifications.md` | Cloudflare notifications and alerting runbook |
| `docs/decisions/ADR-001 through 006` | Architecture decision records |

---

## Certifications

- Security Blue Team BTL1 (Blue Team Level 1)
- CompTIA CySA+ (Cybersecurity Analyst)
- CompTIA Security+
- Cloudflare Accredited Configuration Engineer
- Red Sift Elite Sifter — Implementation Expert (DMARC)
- Red Sift Elite Sifter — Solutions Expert (Email Security)
