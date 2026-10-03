# Architecture

Reference for the deployed `ryanvalera.com` platform.

**Scope.** This document describes the platform as it currently runs in production.
It is not a history: the reasoning behind each decision, and the points where a
decision was later revised, live in the Architecture Decision Records under
`docs/decisions/`. Where a section rests on a decision that was superseded, it
links to the ADR that superseded it rather than restating the original position.

---

## 1. Platform Overview

`ryanvalera.com` is a five-page static portfolio deployed behind Cloudflare across
two independent origins. The site content is deliberately lightweight; the
engineering interest is in the platform carrying it — DNS, TLS, edge caching, WAF,
bot mitigation, rate limiting, multi-origin load balancing with health-checked
failover, canonical origin enforcement, and CI/CD cache invalidation.

The site is the payload. The infrastructure is the project.

---

## 2. Production Request Flow

```text
Visitor
   ↓
Cloudflare edge
   ├── DNS (authoritative)
   ├── SSL/TLS (Full Strict)
   ├── WAF · Bot Fight Mode · Rate Limiting
   ├── Cache Rules (static assets / HTML revalidation)
   ├── Transform Rules (response headers)
   ├── Bulk Redirects (canonical origin enforcement)
   └── Load Balancer — pools in priority order, health-checked (proximity steering disabled)
         ├── Pool: github-pages-primary    → valeratech.github.io
         └── Pool: cloudflare-pages-secondary → pages.ryanvalera.com
```

Every control above the Load Balancer is evaluated at the edge and keyed to
`ryanvalera.com`. A request that reaches an origin directly bypasses all of it —
which is why both direct origin URLs are redirected to canonical (§5).

---

## 3. Origin Architecture and Load Balancing

Both origins serve byte-identical content from the same branch of the same
repository. Neither is a build artifact of the other; they deploy in parallel.

| | Primary | Secondary |
|---|---|---|
| Platform | GitHub Pages | Cloudflare Pages |
| Pool | `github-pages-primary` | `cloudflare-pages-secondary` |
| Origin address | `valeratech.github.io` | `pages.ryanvalera.com` |
| Pages project | — | `ryanvalera-com` |
| Default hostname | — | `ryanvalera-com.pages.dev` |
| Deployment | automatic on push to `main` | automatic on push to `main` |

### The Host-header asymmetry

This is the load-bearing detail of the whole routing design.

A single shared monitor performs health checks, but each pool endpoint overrides
the Host header it sends:

```text
github-pages-primary        →  Host: ryanvalera.com
cloudflare-pages-secondary  →  Host: pages.ryanvalera.com
```

The override is necessary because Cloudflare Pages rejects a foreign Host header —
a request to the Pages origin carrying `Host: ryanvalera.com` returns `403`. The
secondary pool must therefore address its origin by the hostname that project is
actually configured to serve.

Two consequences follow, and both matter:

1. **Health checks and live failover are distinguishable from browser traffic by
   Host header alone.** This is what makes canonical enforcement (§5) failover-safe.
2. **A redirect scoped to a raw origin hostname cannot intersect failover traffic**,
   because failover never uses those hostnames.

### Health monitor

```text
Type:             HTTPS GET /
Port:             443
Interval:         60s
Timeout:          5s
Retries:          2
Expected code:    200
Response body:    must contain "Ryan Valera"
Follow redirects: off
```

Body validation matters: a `200` alone would pass on an error page or a redirect
stub. Requiring known body content means an origin only counts as healthy when it
is actually serving the site.

### Current operating state (accepted, October 2026)

The Cloudflare load balancer is presently operating in a degraded redundancy state.
The GitHub Pages primary is Critical because its TLS health check fails under the
current custom-domain configuration. The Cloudflare Pages secondary is Healthy and
currently serves production.

This state is intentionally accepted by the Owner. There is no healthy standby while
it remains in effect. Restoring dual-origin health is an optional post-audit
improvement.

As measured in October 2026:

```text
Load balancer:   ryanvalera.com — Degraded, 1 of 2 pools available
Primary pool:    github-pages-primary — Critical ("TLS untrusted certificate error")
Secondary pool:  cloudflare-pages-secondary — Healthy, serving production
Fallback pool:   cloudflare-pages-secondary
GitHub Pages:    certificate request for ryanvalera.com failing; Enforce HTTPS unavailable
```

---

## 4. Application Pages and Media Runtime

| Page | Purpose |
|---|---|
| `index.html` | Landing — system select |
| `profile.html` | Professional dossier |
| `projects.html` | Engineering portal — nine active cards plus three reserved slots (3×4) |
| `media.html` | Project media runtime |
| `contact.html` | Contact module |

### Media runtime

`media.html` is a single template driven by a `?project=<slug>` query parameter
that selects an entry from a `PROJECTS` registry in `assets/js/media.js`. There is
no per-project HTML file.

Interactive previews are built on one shared scene engine,
`createScenePreview(previewBodyEl, scenes, renderScene, intervalMs)`, which owns
scene cycling, crossfade, Ken Burns motion, HUD rendering, dot pagination, and the
Signal Acquisition interference sequence. A project supplies only a scene array and
a render function; it does not reimplement any engine behaviour.

Current runtime coverage:

| Project | Slug | Scenes | Interval |
|---|---|---|---|
| Cloudflare Platform | `cloudflare` | 7 | 5200ms |
| Cybersecurity Investigations | `cyber` | 8 | 5200ms |
| Microsoft Sentinel & Defender XDR | `sentinel` | 4 | 7600ms |
| Linux Infrastructure | `linux` | 4 | 7600ms |
| Penetration Testing | `pentest` | 9 | 6200ms |
| AI Engineering Validation Platform | `aivp` | 3 | 5200ms |
| AWS Reliability Layer | `aws` | 3 | 5200ms |
| Orthanc + Mirth Connect | `orthanc` | 4 | 5200ms |
| File Triage Orchestration API | `fastapi` | — | static preview |

The `linux` runtime is the one set built from **representative** configuration rather
than captured evidence — that repository is an index of conventions, and no child
project has published verified configuration yet. Every slide in it carries a preview
marker in its chrome and reports `Evidence: Representative` in the HUD. See
`docs/media-preview.md` for the standard this follows.

Scene artwork is native HTML and CSS, not raster images. Each project namespaces
its artboard classes with its own prefix (`cf-`, `or-`, `aws-`, `aiv-`, `cyi-`,
`sen-`, `pte-`, `lnx-`) so compositions cannot collide; the engine shell itself stays
shared and unprefixed by design.

---

## 5. DNS, TLS, and Canonicalization

### DNS

Cloudflare is authoritative. Proxied records route production traffic through the
edge; the Load Balancer is attached at the zone apex.

### TLS

| Property | Value |
|---|---|
| Mode | Full (Strict) |
| TLS | 1.3 enabled, minimum 1.2 |
| Always Use HTTPS | on |
| Certificates | Cloudflare Pages presents a valid certificate; GitHub Pages certificate provisioning for `ryanvalera.com` is currently failing (§3) |

Full Strict requires a valid certificate at the origin. Cloudflare Pages provides one
without additional configuration; GitHub Pages currently does not for this custom
domain, which is why the primary pool fails its health check (§3).

### Canonical origin enforcement

Both origins are reachable directly, and a direct request receives none of the edge
controls in §2. Both are therefore redirected to canonical:

| Direct URL | Behaviour | Mechanism |
|---|---|---|
| `valeratech.github.io/ryanvalera-com/` | `301` → `http://ryanvalera.com/` (measured October 2026; upgraded to HTTPS by the browser or by Always Use HTTPS) | GitHub Pages custom-domain redirect (Host-aware) |
| `ryanvalera-com.pages.dev` | `301` → `https://ryanvalera.com/` | Cloudflare Bulk Redirect, path and query preserved |

Neither redirect affects failover, for the reason given in §3: the GitHub Pages
redirect is Host-aware and returns `200` to Load Balancer traffic carrying
`Host: ryanvalera.com`, while the Bulk Redirect matches only the raw `.pages.dev`
hostname, which failover never uses. While the GitHub Pages certificate issue
persists (§3), the primary's health check fails at TLS, before any redirect logic is
reached.

One implementation finding is worth recording here because it is not obvious: a
**zone-level Redirect Rule cannot reach Cloudflare Pages default-hostname traffic**.
Pages serves its own `*.pages.dev` hostname upstream of the zone rule engine, so a
zone rule scoped to that hostname never fires. An **account-level Bulk Redirect**
intercepts it correctly. See ADR-006.

---

## 6. Deployment and Cache Invalidation

```text
git push → main
   ├── GitHub Pages builds and publishes      (primary origin)
   └── Cloudflare Pages builds and publishes  (secondary origin)
                 ↓
        page_build event
                 ↓
   .github/workflows/deploy-and-purge.yml
                 ↓
        Cloudflare cache purge
```

`deploy-and-purge.yml` triggers on `page_build` and gates on
`github.event.build.status == 'built'`, so the purge runs only after content is
actually live at origin rather than racing a fixed delay after push.
`workflow_dispatch` is also enabled for manual runs.

**Known open finding (control coupling).** The purge is triggered by the GitHub Pages
build, but production is currently served by Cloudflare Pages (§3), whose deployments
do not trigger it. The two events can diverge: in October 2026 a push produced a
Cloudflare Pages deployment with no GitHub Pages build and no purge. Measured cache
behaviour bounds the effect (below); aligning the purge trigger with the serving
deployment path is post-audit work.

The purge is two API calls, because the Cloudflare API accepts one purge mode per
request:

1. **Files** — `/`, `index.html`, `profile.html`, `projects.html` and `contact.html`.
2. **Prefix** — `media.html`, which invalidates every `?project=` variant in one
   call. A file purge on bare `media.html` would not touch the query-string
   variants, since Cloudflare caches by full URL.

Root `/` stays in the file list and is never used as a prefix — a prefix of `/`
would purge the entire zone.

Both calls fail the workflow on a non-`200` response or a body without
`"success": true`.

### Measured cache behaviour (October 2026)

- Extensionless page URLs such as `/projects` are not matched by the HTML cache rule
  and were not edge-cached (`cf-cache-status: DYNAMIC`).
- `.html` URLs are answered by Cloudflare Pages with a `308` redirect to the
  extensionless URL; those redirects were not served from cache (`BYPASS`).
- `/` is cached for 10 minutes and is the first entry in the purge.

Under the measured configuration, a missed purge can leave at most the root page
stale, for up to 10 minutes. A change to the cache rules changes this analysis.

### Versioned assets

CSS, JS, and image references carry a `?v=` query string. Versioning and purging
solve the same staleness problem by different means: once an asset is versioned, a
change to it produces a new cache key and needs no purge. The purge workflow
therefore covers HTML documents, which are not versioned.

One exception: browsers request `/favicon.ico` at the bare path and ignore any query
string, so a favicon change requires a targeted purge of that URL rather than a
version bump.

---

## 7. Security Controls

| Control | State | Notes |
|---|---|---|
| SSL/TLS Full (Strict) | Active | TLS 1.3, minimum 1.2 |
| Always Use HTTPS | Active | |
| WAF Managed Rules | Free tier | Cloudflare managed ruleset, always active |
| Bot Fight Mode | Active | |
| Browser Integrity Check | Active | |
| AI crawler policy | Partial | training crawlers Disallow; search and agent crawlers Allow; AI Labyrinth on; not published in `robots.txt` (open finding) |
| Rate Limiting | Not effective | rule configured (40 requests / 10 s per IP, block 10 s); its match condition does not match request paths; correction scheduled post-audit |
| Transform Rules | Active | fingerprint removal, security headers; scoped to `ryanvalera.com` and `www.ryanvalera.com` |
| Email Address Obfuscation | Active | Cloudflare rewrites e-mail addresses in served pages |
| HSTS | Deferred | pending sustained stability |
| Content-Security-Policy | Deferred | requires an asset source inventory |

These are edge controls for the zone; the Transform Rules are scoped to
`ryanvalera.com` and `www.ryanvalera.com`. Both raw origin hostnames redirect to
canonical (§5). `pages.ryanvalera.com`, the Load Balancer's secondary origin
hostname, is not redirected because failover depends on it.

---

## 8. Availability and Failure Behaviour

| Failure | Behaviour |
|---|---|
| GitHub Pages unavailable | Health check fails body validation or status; Load Balancer steers to the secondary pool. Cloudflare Pages serves via `pages.ryanvalera.com`. |
| Cloudflare Pages unavailable | If the GitHub Pages primary is healthy, traffic stays on or returns to the primary and the secondary is withdrawn. In the current accepted degraded state the primary is already Critical (§3), so loss of Cloudflare Pages leaves no healthy origin and the site would be down. |
| Both origins unavailable | Site is down. Cached content continues to serve at the edge until TTL expiry. |
| Cloudflare platform event | Site is unreachable. See §9. |
| Current state (accepted, October 2026) | GitHub Pages pool Critical; Cloudflare Pages serves production. If Cloudflare Pages became unavailable now, no healthy pool would remain and the site would be down. See §3. |

Health-based routing is automatic when a healthy alternative exists. In the current
accepted degraded state there is no healthy standby, so loss of the Cloudflare Pages
origin would not fail over successfully. Failover behaviour was exercised during
provisioning; the results are recorded in `docs/runbooks/load-balancer.md`.

---

## 9. Operational Limitations

### Cloudflare is a shared control plane

DNS resolution, Load Balancer routing, WAF enforcement, canonical redirects, and
access to the Cloudflare Pages origin all depend on Cloudflare. A major Cloudflare
platform event affects all of them simultaneously.

**There is no Cloudflare-independent fallback.** Earlier revisions of this document
and of ADR-001/003 described the direct GitHub Pages URL as a genuine escape hatch
during a Cloudflare outage. That is no longer true: the URL now `301`-redirects to
`ryanvalera.com`, which resolves through Cloudflare, so during a Cloudflare outage
the redirect target is itself unreachable.

This is an accepted trade-off, not an oversight. Canonical origin enforcement was
chosen deliberately over provider-independent redundancy, on the grounds that the
project exists to demonstrate Cloudflare platform engineering. The reasoning and
the supersession are recorded in ADR-006, with dated annotations added to ADR-001
and ADR-003.

### WAF coverage

Managed WAF rules run at free-tier scope. Baseline protection is active; full
managed rulesets are not.

---

## 10. Repository Structure

```text
ryanvalera-com/
│
├── index.html                  ← Landing page
├── profile.html                ← Professional dossier
├── projects.html               ← Engineering portal
├── media.html                  ← Project media runtime
├── contact.html                ← Contact module
├── favicon.ico                 ← Multi-resolution browser icon
├── site.webmanifest            ← Web app manifest
├── CNAME                       ← Custom domain for GitHub Pages
├── .gitleaks.toml              ← Secret-scan configuration
│
├── assets/
│   ├── css/
│   │   ├── variables.css       ← Design tokens
│   │   ├── styles.css          ← Landing
│   │   ├── profile.css         ← Dossier
│   │   ├── projects.css        ← Engineering portal
│   │   ├── media.css           ← Media runtime + per-project artboards
│   │   └── contact.css         ← Contact module
│   ├── js/
│   │   ├── landing.js
│   │   ├── profile.js
│   │   ├── projects.js
│   │   ├── media.js            ← Shared scene engine + per-project scenes
│   │   └── contact.js
│   └── images/                 ← Portraits, card artwork, icon set
│
├── docs/
│   ├── architecture.md         ← This document
│   ├── cloudflare.md           ← Cloudflare configuration reference
│   ├── cache-governance.md     ← Cache policy, purge procedure, versioning
│   ├── ci-cd.md                ← Deployment and purge automation
│   ├── analytics-baseline.md   ← Initial traffic and security observations
│   ├── media-preview.md        ← Media runtime design standards
│   ├── deferred-enhancements.md
│   ├── decisions/
│   │   ├── README.md
│   │   └── ADR-001.md … ADR-006.md
│   └── runbooks/
│       ├── README.md
│       ├── github-pages.md
│       ├── load-balancer.md
│       └── notifications.md
│
├── .github/
│   └── workflows/
│       ├── deploy-and-purge.yml
│       └── security-gates.yml
│
├── .gitignore
└── README.md
```

---

## 11. Architecture Decision Records

| ADR | Decision | Status |
|---|---|---|
| ADR-001 | Cloudflare as shared control plane | Accepted — direct-reachability claim superseded by ADR-006 |
| ADR-002 | Cloudflare Pages as secondary origin | Accepted |
| ADR-003 | GitHub Pages as primary origin | Accepted — direct-reachability claim superseded by ADR-006 |
| ADR-004 | Cloudflare Load Balancing | Accepted |
| ADR-005 | Cloudflare R2 as future media and artifact storage | Accepted |
| ADR-006 | Canonical origin enforcement vs. direct-reachability fallback | Accepted |

Full records in `docs/decisions/`.
