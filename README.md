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
    ├── Primary pool:   GitHub Pages (valeratech.github.io, Host gh.ryanvalera.com)  ← Healthy; serving production
    └── Secondary pool: Cloudflare Pages (pages.ryanvalera.com)                      ← Healthy; standby
```

Both origins serve identical content from this repository. Cloudflare Load Balancing health-checks both origins and sends traffic to the first healthy pool in priority order.

**Current operating state (October 2026).** Both pools are Healthy: the GitHub Pages primary serves production and the Cloudflare Pages secondary is Healthy on standby. The degraded state accepted earlier (one origin Critical, no healthy standby) was superseded by the Owner on 2026-10-05 and remediated during the October 2026 repository audit (ADR-007). Failover to the secondary is designed behaviour; a controlled failover proof is still pending (`docs/architecture.md` §3 and §8).

The raw origin URLs redirect: `ryanvalera-com.pages.dev` answers 301 to `https://ryanvalera.com/` (Bulk Redirect) and `valeratech.github.io/ryanvalera-com/` answers 301 to `https://gh.ryanvalera.com/`. The origin hostnames `gh.ryanvalera.com` and `pages.ryanvalera.com` are DNS only by design: they serve the site directly, without the Cloudflare edge controls, which apply to `ryanvalera.com` and `www.ryanvalera.com` only. Every page's canonical link points at its extensionless URL on the apex, `https://ryanvalera.com` (see ADR-006 and ADR-007).

---

## Site Structure

```text
ryanvalera-com/
├── index.html              ← Landing page (SYSTEM SELECT)
├── profile.html            ← Professional dossier
├── projects.html           ← Engineering portal (project card grid)
├── media.html              ← Project media runtime (per-project engineering previews)
├── contact.html            ← Contact module
├── favicon.ico             ← Multi-resolution browser icon (16/32/48)
├── site.webmanifest        ← Web app manifest (theme + install metadata)
├── .gitleaks.toml          ← Secret-scan configuration (value allowlist, never paths)
│
├── .github/workflows/
│   ├── pages.yml               ← GitHub Pages publication (pages-website-only): allowlist build, website files only
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
    │   ├── ADR-006.md  ← Canonical origin enforcement
    │   └── ADR-007.md  ← Dual-origin restoration (October 2026)
    └── runbooks/
        ├── README.md   ← Index
        ├── github-pages.md
        ├── load-balancer.md
        └── notifications.md
```

Abridged: the tree leaves out the `.gitkeep` placeholders in `assets/fonts/`, `assets/images/` and `assets/js/`; `scripts/build-cloudflare-pages.sh` and `scripts/cloudflare-pages-files.txt` (the 36-path allowlist both deployments build from); `.gitattributes`, `.gitignore` and this README.

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
| Proxy / CDN | ✅ Active | Proxied (orange cloud) for the apex (load balancer) and `www`; `gh.ryanvalera.com` and `pages.ryanvalera.com` are DNS only by design, so their traffic does not pass the proxy |
| SSL/TLS | ✅ Active | Full (strict); TLS 1.3 on; minimum TLS 1.2 |
| Always Use HTTPS | ✅ Active | |
| Transform Rules | ✅ Active | Two response-header rules for `ryanvalera.com` and `www.ryanvalera.com`: origin-fingerprint removal and security headers |
| Cache Rules | ✅ Active | Static assets (`/assets/`): 1 month edge, 7 days browser. HTML (`.html` paths and `/`): 10 minutes edge, 10 minutes browser |
| Cache Purge Automation | Retired | The purge workflow was removed on 2026-10-10; no purge runs on deployment. The cache rules above and `?v=` asset versions remain; on 2026-10-11 the extensionless page URLs (`/profile`, `/projects`, `/contact`, `/media`) were answered `DYNAMIC` at the apex, not edge-cached (a dated observation). Manual purge: `docs/cache-governance.md` |
| Security Gates (CI) | ✅ Active, not required | Run on every push and pull request: gitleaks over the full Git history, image metadata, tracked secret files. Not a required status check: `main` has no branch protection or rulesets |
| Bot Fight Mode | ✅ Active | |
| AI crawler policy | ⚠️ Partial | AI training crawlers: Disallow. AI search and agent crawlers: Allow. AI Labyrinth on. Bot Preference Sync is on, but the repository publishes no `robots.txt`: on 2026-10-11 the apex answered `/robots.txt` with a 404 from the edge (cache-associated), which is neither a robots policy nor the GitHub origin's direct answer, so the policy is not published there (open finding; post-audit) |
| Rate Limiting | ⚠️ Not effective | A rule is configured (40 requests / 10 s per IP, block 10 s), but its match condition does not match request paths, so it is not currently enforcing; correction scheduled post-audit |
| WAF Managed Rules | ⚠️ Free tier | Cloudflare managed ruleset, always active |
| Load Balancing | ✅ Active | Both pools Healthy: GitHub Pages primary serving production, Cloudflare Pages secondary Healthy on standby (see Architecture) |
| Health Monitor | ✅ Active | HTTPS GET `/`; expects `200` and the body text "Ryan Valera"; 60 s interval; verifies the origin certificate (the setting under which the GitHub pool went Critical on 2026-09-17); 5 s timeout, 2 retries |
| Cloudflare Pages | ✅ Active, standby | Secondary origin, Healthy on standby; `pages.ryanvalera.com` is a DNS-only custom domain |
| Bulk Redirects | ✅ Active | `ryanvalera-com.pages.dev` → `https://ryanvalera.com/` (ADR-006) |
| Email Address Obfuscation | ✅ Active | Cloudflare rewrites e-mail addresses in pages served through the proxy (`ryanvalera.com`); the DNS-only origin hostnames serve the contact page without the rewrite |
| HSTS | ⏳ Deferred | Enable after full stability confirmed |
| Content-Security-Policy | ⏳ Deferred | Requires asset source inventory |
| Cloudflare R2 | ⏳ Deferred | media.ryanvalera.com — engineering media layer (post-Milestone 6D; ADR-005) |

---

## Roadmap

**Completed**

- CI/CD + cache governance (GitHub Actions, versioned assets, automated purge) — the automated purge was removed on 2026-10-10 (repository audit)
- Security gates in CI — full-history secret scan, image metadata, environment files (run on every push; not a required check)
- Engineering Portal — nine active projects plus three reserved slots (3×4 grid)
- Project media runtime (`media.html`) — shared scene engine with per-project previews
- Canonical origin enforcement (ADR-006) — both raw origin hostnames redirect to canonical; since October 2026 `valeratech.github.io/ryanvalera-com/` redirects to `https://gh.ryanvalera.com/`, `ryanvalera-com.pages.dev` still redirects to the apex, and the origin hostnames `gh.ryanvalera.com` and `pages.ryanvalera.com` serve directly by design (ADR-007)
- Favicon and web app manifest across all five pages
- WebP artwork conversion (July 2026) — the images the Engineering Portal references went from 14.77 MB to 1.58 MB; the whole image directory from 17.53 MB to 2.05 MB
- Penetration Testing media runtime — nine scenes closing on defensive analysis
- Microsoft Sentinel & Defender XDR media runtime — four scenes
- Linux Infrastructure media runtime — four representative configuration previews
- Phone layout releases (September 2026) — header and footer controls, Engineering Portal cards, and the media runtime's phone presentation
- Repository audit (October 2026) — only website files published on both origins (allowlist build); `www` redirected to the apex at the edge; GitHub Pages given its own DNS-only origin hostname, `gh.ryanvalera.com`, with its own certificate; load-balancer health restored; `pages.ryanvalera.com` made DNS only; the purge workflow retired, extensionless canonical tags added and the repository `CNAME` file removed; documentation revised, its failover statements awaiting the failover proof

**Current**

- ~~Cloudflare R2 Engineering Media Layer~~ — deferred (post-Milestone 6D; ADR-005), not current work
- Mobile review of the remaining pages — status to be confirmed in the post-audit review

**Next (post-audit)**

- Rate-limiting rule correction
- 404 page and `robots.txt` — no top-level `404.html` until the failover proof is accepted: a 404 page would replace the Cloudflare Pages answer to unknown paths (200 with the landing page) that tells the two origins apart
- CI gate hardening and runner pinning
- Cybersecurity Investigations preview rebuild

---

## Deployment

The site deploys automatically on every push to `main`:

```text
git push → main
    ├── GitHub Actions: pages-website-only (primary origin)
    │       allowlist build (scripts/build-cloudflare-pages.sh) → Pages artifact of 36 files → deploy → https://gh.ryanvalera.com/
    ├── Cloudflare Pages build (secondary origin, on standby): the same script → dist/ → https://pages.ryanvalera.com/
    └── GitHub Actions: security-gates
```

Both builds print the same content manifest. No deployment step purges the cache.


**Live URLs:**
```text
https://ryanvalera.com                          ← Production (Load Balancer)
https://gh.ryanvalera.com                       ← GitHub Pages custom domain (LB primary origin; DNS only; Enforce HTTPS on; Let's Encrypt certificate valid to 2027-01-06 as measured in October 2026)
https://valeratech.github.io/ryanvalera-com/    ← GitHub Pages direct (301 → https://gh.ryanvalera.com/)
https://ryanvalera-com.pages.dev                ← Cloudflare Pages direct (301 → canonical)
https://pages.ryanvalera.com                    ← Cloudflare Pages custom domain (LB secondary origin; DNS only; on standby)
```

---

## Documentation

| Document | Description |
|---|---|
| `docs/architecture.md` | Full platform architecture and component table |
| `docs/cloudflare.md` | Cloudflare configuration reference (measured October 2026) |
| `docs/cache-governance.md` | Cache policy, manual purge procedures, versioning discipline, and the retired purge workflow's history |
| `docs/ci-cd.md` | Deployment workflow (pages-website-only), validation, and CI security gates |
| `docs/analytics-baseline.md` | First 24-hour traffic and security observations |
| `docs/media-preview.md` | Media runtime design, per-project preview standards, and phone presentation |
| `docs/deferred-enhancements.md` | Deferred UX enhancements |
| `docs/runbooks/load-balancer.md` | Load Balancer provisioning, failover test results, and current operating state |
| `docs/runbooks/github-pages.md` | GitHub Pages deployment runbook |
| `docs/runbooks/notifications.md` | Cloudflare notifications and alerting runbook |
| `docs/runbooks/README.md` | Runbook index |
| `docs/decisions/ADR-001 through 007` | Architecture decision records (point-in-time) |

---

## Certifications

- Security Blue Team BTL1 (Blue Team Level 1)
- CompTIA CySA+ (Cybersecurity Analyst)
- CompTIA Security+
- Cloudflare Accredited Configuration Engineer
- Red Sift Elite Sifter — Implementation Expert (DMARC)
- Red Sift Elite Sifter — Solutions Expert (Email Security)
