# ryanvalera-com

Personal portfolio platform for Ryan Valera — Cybersecurity & Infrastructure Engineer.

**Live site:** [ryanvalera.com](https://ryanvalera.com)
**State:** production deploys automatically from `main`. What is live at any moment is established by the deployment records for a specific commit (GitHub Actions and Cloudflare Pages), not by a version label in this file. The most recent release tag is `v1.2.0` (2026-07-03); later changes are untagged.

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
    ├── Primary pool:   GitHub Pages (valeratech.github.io)      ← currently Critical (see below)
    └── Secondary pool: Cloudflare Pages (pages.ryanvalera.com)  ← currently serving production
```

Both origins serve identical content from this repository. Cloudflare Load Balancing health-checks both origins and sends traffic to the first healthy pool in priority order.

**Current operating state (accepted).** The Cloudflare load balancer is operating in a degraded redundancy state. The GitHub Pages primary is Critical because its TLS health check fails under the current custom-domain configuration. The Cloudflare Pages secondary is Healthy and currently serves production. This state is intentionally accepted by the Owner; there is no healthy standby while it remains in effect. Restoring dual-origin health is an optional future improvement (`docs/architecture.md` §3).

Both raw origin hostnames redirect to `ryanvalera.com`, so the edge controls are not bypassed through them (see ADR-006).

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
│   ├── deploy-and-purge.yml    ← Cloudflare cache purge after a successful GitHub Pages build
│   └── security-gates.yml      ← CI gates: full-history secret scan, image metadata, tracked secrets
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
│       ├── ryan-valera-profile-cropped.webp                  ← Waist-up portrait (desktop Landing card, >=901px)
│       ├── ryan-valera-profile-landing-mobile.webp           ← Mobile Landing card portrait (<=900px)
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

Abridged: the `.gitkeep` placeholders in `assets/fonts/`, `assets/images/` and `assets/js/` are not shown.

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

Configuration as measured in the October 2026 repository audit; `docs/cloudflare.md` has the detail.

| Component | Status | Notes |
|---|---|---|
| DNS (Authoritative) | ✅ Active | Cloudflare nameservers |
| Proxy / CDN | ✅ Active | Proxied (orange cloud) |
| SSL/TLS | ✅ Active | Full (strict); TLS 1.3 on; minimum TLS 1.2 |
| Always Use HTTPS | ✅ Active | |
| Transform Rules | ✅ Active | Two response-header rules for `ryanvalera.com` and `www.ryanvalera.com`: origin-fingerprint removal and security headers |
| Cache Rules | ✅ Active | Static assets (`/assets/`): 1 month edge, 7 days browser. HTML (`.html` paths and `/`): 10 minutes edge, 10 minutes browser |
| Cache Purge Automation | ⚠️ Active, known gap | Purges `/`, the four `.html` documents and the `media.html` prefix after each GitHub Pages build. Cloudflare Pages, which currently serves production, does not trigger it (open finding; post-audit) |
| Security Gates (CI) | ✅ Active, not required | Run on every push and pull request: gitleaks over the full Git history, image metadata, tracked secret files. Not a required status check: `main` has no branch protection or rulesets |
| Bot Fight Mode | ✅ Active | |
| AI crawler policy | ⚠️ Partial | AI training crawlers: Disallow. AI search and agent crawlers: Allow. AI Labyrinth on. Bot Preference Sync is on, but `/robots.txt` currently returns the landing page, so the policy is not published there (open finding; post-audit) |
| Rate Limiting | ⚠️ Not effective | A rule is configured (40 requests / 10 s per IP, block 10 s), but its match condition does not match request paths, so it is not currently enforcing; correction scheduled post-audit |
| WAF Managed Rules | ⚠️ Free tier | Cloudflare managed ruleset, always active |
| Load Balancing | ⚠️ Degraded (accepted) | GitHub Pages primary Critical (TLS health check); Cloudflare Pages secondary Healthy and serving; no healthy standby (see Architecture) |
| Health Monitor | ✅ Active | HTTPS GET `/`; expects `200` and the body text "Ryan Valera"; 60 s interval |
| Cloudflare Pages | ✅ Active, serving | Secondary origin; currently serves production |
| Bulk Redirects | ✅ Active | `ryanvalera-com.pages.dev` → `https://ryanvalera.com/` (ADR-006) |
| Email Address Obfuscation | ✅ Active | Cloudflare rewrites e-mail addresses in served pages |
| HSTS | ⏳ Deferred | Enable after full stability confirmed |
| Content-Security-Policy | ⏳ Deferred | Requires asset source inventory |
| Cloudflare R2 | ⏳ Future | media.ryanvalera.com — engineering media layer |

---

## Roadmap

**Completed**

- CI/CD + cache governance (GitHub Actions, versioned assets, automated purge)
- Security gates in CI — full-history secret scan, image metadata, environment files (run on every push; not a required check)
- Engineering Portal — nine active projects plus three reserved slots (3×4 grid)
- Project media runtime (`media.html`) — shared scene engine with per-project previews
- Canonical origin enforcement (ADR-006) — both raw origin hostnames redirect to canonical
- Favicon and web app manifest across all five pages
- WebP artwork conversion (July 2026) — the images the Engineering Portal references went from 14.77 MB to 1.58 MB; the whole image directory from 17.53 MB to 2.05 MB
- Penetration Testing media runtime — nine scenes closing on defensive analysis
- Microsoft Sentinel & Defender XDR media runtime — four scenes
- Linux Infrastructure media runtime — four representative configuration previews
- Phone layout releases (September 2026) — header and footer controls, Engineering Portal cards, and the media runtime's phone presentation
- Repository audit (October 2026) — documentation corrected to the measured configuration

**Current**

- Cloudflare R2 Engineering Media Layer
- Mobile review of the remaining pages — status to be confirmed in the post-audit review

**Next (post-audit)**

- Rate-limiting rule correction
- 404 page and `robots.txt`
- Cache purge aligned with the serving origin
- CI gate hardening and runner pinning
- Cybersecurity Investigations preview rebuild
- Optional: restore dual-origin health

---

## Deployment

The site deploys automatically on every push to `main`:

```text
git push → main
    ├── GitHub Pages (primary origin) builds and publishes
    │       ↓
    │   page_build event → GitHub Actions (deploy-and-purge.yml)
    │       ↓
    │   Cloudflare cache purge (HTML documents + media prefix)
    └── Cloudflare Pages (secondary origin, currently serving production) builds and publishes
```

The cache purge follows the GitHub Pages build. Cloudflare Pages deployments do not trigger it, and the two can diverge. Measured cache behaviour limits the effect (see `docs/cache-governance.md`); aligning the purge with the serving origin is post-audit work.

**Live URLs:**
```text
https://ryanvalera.com                          ← Production (Load Balancer)
https://valeratech.github.io/ryanvalera-com/    ← GitHub Pages direct (301 → http://ryanvalera.com/, then upgraded to HTTPS)
https://ryanvalera-com.pages.dev                ← Cloudflare Pages direct (301 → canonical)
https://pages.ryanvalera.com                    ← Cloudflare Pages custom domain (LB secondary origin; currently serving)
```

---

## Documentation

| Document | Description |
|---|---|
| `docs/architecture.md` | Full platform architecture and component table |
| `docs/cloudflare.md` | Cloudflare configuration reference (measured October 2026) |
| `docs/cache-governance.md` | Cache policy, purge procedures, versioning discipline |
| `docs/ci-cd.md` | Deployment workflow, purge automation, and CI security gates |
| `docs/analytics-baseline.md` | First 24-hour traffic and security observations |
| `docs/media-preview.md` | Media runtime design, per-project preview standards, and phone presentation |
| `docs/deferred-enhancements.md` | Deferred UX enhancements |
| `docs/runbooks/load-balancer.md` | Load Balancer provisioning, failover test results, and current operating state |
| `docs/runbooks/github-pages.md` | GitHub Pages deployment runbook |
| `docs/runbooks/notifications.md` | Cloudflare notifications and alerting runbook |
| `docs/runbooks/README.md` | Runbook index |
| `docs/decisions/ADR-001 through 006` | Architecture decision records (point-in-time) |

---

## Certifications

- Security Blue Team BTL1 (Blue Team Level 1)
- CompTIA CySA+ (Cybersecurity Analyst)
- CompTIA Security+
- Cloudflare Accredited Configuration Engineer
- Red Sift Elite Sifter — Implementation Expert (DMARC)
- Red Sift Elite Sifter — Solutions Expert (Email Security)
