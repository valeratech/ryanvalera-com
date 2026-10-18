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
failover, canonical origin enforcement, and CI/CD publication of the website files
(the cache-purge workflow was retired in October 2026).

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
         ├── Pool: github-pages-primary    → valeratech.github.io  (Host: gh.ryanvalera.com)
         └── Pool: cloudflare-pages-secondary → pages.ryanvalera.com (Host: pages.ryanvalera.com)
```

Every control above the Load Balancer is evaluated at the edge and applies to
`ryanvalera.com` and `www.ryanvalera.com` only. A request that reaches an origin
directly bypasses all of it. The raw origin URLs are redirected (§5); the two origin
hostnames, `gh.ryanvalera.com` and `pages.ryanvalera.com`, are DNS only by design and
serve the site directly, byte-identical to the deployed artifact. Every page's
canonical link points at the apex (§5; ADR-007).

---

## 3. Origin Architecture and Load Balancing

Both origins serve byte-identical content from the same branch of the same
repository. Neither is a build artifact of the other; they deploy in parallel.

| | Primary | Secondary |
|---|---|---|
| Platform | GitHub Pages | Cloudflare Pages |
| Pool | `github-pages-primary` | `cloudflare-pages-secondary` |
| Origin address | `valeratech.github.io` | `pages.ryanvalera.com` |
| Custom domain (DNS only) | `gh.ryanvalera.com` | `pages.ryanvalera.com` |
| Host header sent by the Load Balancer | `gh.ryanvalera.com` (since 2026-10-08) | `pages.ryanvalera.com` |
| Pages project | — | `ryanvalera-com` |
| Default hostname | — | `ryanvalera-com.pages.dev` |
| Deployment | automatic on push to `main` | automatic on push to `main` |

### The Host-header asymmetry

This is the load-bearing detail of the whole routing design.

A single shared monitor performs health checks, but each pool endpoint overrides
the Host header it sends:

```text
github-pages-primary        →  Host: gh.ryanvalera.com   (since 2026-10-08; previously ryanvalera.com)
cloudflare-pages-secondary  →  Host: pages.ryanvalera.com
```

The override is necessary because Cloudflare Pages rejects a foreign Host header —
a request to the Pages origin carrying `Host: ryanvalera.com` returns `403`. The
secondary pool must therefore address its origin by the hostname that project is
actually configured to serve.

Two consequences follow, and both matter:

1. **Health checks and live failover are distinguishable by Host header from requests
   to the raw origin URLs** (`valeratech.github.io/ryanvalera-com/`, `*.pages.dev`).
   This is what makes canonical enforcement (§5) failover-safe. They are not
   distinguishable from browser requests to `gh.ryanvalera.com` or
   `pages.ryanvalera.com`: those public DNS-only hostnames carry the same Host.
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
Verify certs:     on (the origin certificate must be valid)
Health threshold: 1
Region:           Western North America
```

Body validation matters: a `200` alone would pass on an error page or a redirect
stub. Requiring known body content means an origin only counts as healthy when it
is actually serving the site.

### Current operating state (October 2026)

Both pools are Healthy. The GitHub Pages primary serves production; the Cloudflare
Pages secondary is Healthy on standby. The degraded state accepted earlier (GitHub
Pages primary Critical, no healthy standby) was superseded by the Owner on
2026-10-05 and remediated during the October 2026 repository audit (ADR-007).

As measured in October 2026:

```text
Load balancer:   ryanvalera.com — both pools Healthy
Primary pool:    github-pages-primary — Healthy, serving production
                 (a fresh unknown path at the apex answers 404, DYNAMIC: GitHub Pages)
Secondary pool:  cloudflare-pages-secondary — Healthy, standby
Fallback pool:   cloudflare-pages-secondary
GitHub Pages:    custom domain gh.ryanvalera.com; certificate issued; Enforce HTTPS on
Pool history:    2026-09-17 18:28:32 UTC github-pages Critical (expired certificate)
                 2026-10-08 20:03:25 UTC github-pages Healthy
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
edge; the Load Balancer is attached at the zone apex. The records, as measured in
October 2026:

- apex — the Load Balancer, proxied;
- `www` — `A 192.0.2.1`, proxied, a placeholder that exists only for the edge redirect to the apex;
- `gh` — `CNAME valeratech.github.io`, DNS only (GitHub Pages custom domain);
- `pages` — `CNAME ryanvalera-com.pages.dev`, DNS only (Cloudflare Pages custom domain);
- `_github-pages-challenge-valeratech` — TXT, GitHub domain verification, retained;
- mail — a null MX, a DMARC policy of `reject` and SPF `-all`.

### TLS

| Property | Value |
|---|---|
| Mode | Full (Strict) |
| TLS | 1.3 enabled, minimum 1.2 |
| Always Use HTTPS | on |
| Certificates | Origin: `gh.ryanvalera.com` (Let's Encrypt; CN and SAN `gh.ryanvalera.com`) valid to 2027-01-06; `pages.ryanvalera.com` (CN and SAN `pages.ryanvalera.com`) valid to 2026-11-17. Edge: Universal certificate (`*.ryanvalera.com` and the apex) valid to 2026-11-14, auto-renewing. Dates as measured in October 2026; no renewal of either origin certificate has been observed yet |

Full Strict requires a valid certificate at the origin. Cloudflare Pages provides one
without additional configuration. GitHub Pages validates its certificate through its
custom domain, so issuance and renewal fail while that domain is proxied: with
`ryanvalera.com` as GitHub's custom domain the certificate expired on 2026-09-17 and
the primary pool went Critical. The DNS-only custom domain `gh.ryanvalera.com`
restored issuance in October 2026; a renewal has not yet been observed.

### Canonical origin enforcement

Both origins are reachable directly, and a direct request receives none of the edge
controls in §2. The raw origin URLs are redirected; the origin hostnames are not:

| Direct URL | Behaviour | Mechanism |
|---|---|---|
| `valeratech.github.io/ryanvalera-com/` | `301` → `https://gh.ryanvalera.com/` | GitHub Pages custom-domain redirect |
| `ryanvalera-com.pages.dev` | `301` → `https://ryanvalera.com/` | Cloudflare Bulk Redirect, path and query preserved |
| `gh.ryanvalera.com` | serves the site directly (DNS only, by design) | GitHub Pages custom domain; Load Balancer primary origin |
| `pages.ryanvalera.com` | serves the site directly (DNS only, by design) | Cloudflare Pages custom domain; Load Balancer secondary origin |

Every page carries `<link rel="canonical">` pointing at its extensionless apex URL
(`/`, `/profile`, `/projects`, `/contact`, `/media`). Both origins answer those URLs
`200` with the exact page; GitHub Pages also answers the `.html` forms `200`, while
Cloudflare Pages answers them with a `308` to the extensionless URL.

Neither redirect affects failover, for the reason given in §3: the Load Balancer sends
`Host: gh.ryanvalera.com` to the GitHub Pages origin, which serves that custom domain
with `200`, and the Bulk Redirect matches only the raw `.pages.dev` hostname, which
failover never uses.

One implementation finding is worth recording here because it is not obvious: a
**zone-level Redirect Rule cannot reach Cloudflare Pages default-hostname traffic**.
Pages serves its own `*.pages.dev` hostname upstream of the zone rule engine, so a
zone rule scoped to that hostname never fires. An **account-level Bulk Redirect**
intercepts it correctly. See ADR-006.

---

## 6. Deployment and Cache Behaviour

```text
git push → main
   ├── GitHub Actions pages-website-only → allowlist build → GitHub Pages   (primary origin)
   └── Cloudflare Pages build of the same allowlist → dist/                 (secondary origin)
```

The two deployments run in parallel from the same allowlist build script
(`scripts/build-cloudflare-pages.sh`) and publish the same 36 website files. No
`page_build` event is involved and no deployment step purges the cache: the purge
workflow was removed on 2026-10-10. Before that, its `page_build` trigger could not
fire under the Actions publishing source, and its last runs failed authentication.


**History (removed workflow).** `deploy-and-purge.yml`, implemented in July 2026, was
designed to purge the edge cache after GitHub Pages builds: `/` and the four `.html`
documents by URL, and every `media.html?project=` variant by prefix. It was removed on
2026-10-10 in the October 2026 repository audit (ADR-007).

### Measured cache behaviour (October 2026)

- Extensionless page URLs such as `/projects` are not matched by the HTML cache rule
  and were not edge-cached (`cf-cache-status: DYNAMIC`).
- At the apex, with GitHub Pages serving, `.html` URLs such as `/profile.html` were
  answered `200` and were edge-cacheable (`MISS`, `max-age=600`). The `308` redirect
  to the extensionless URL is the Cloudflare Pages origin's behaviour.
- At the apex, `/` was answered `EXPIRED` (age 527) and `/profile.html` `MISS` (age 0),
  both with `cache-control: max-age=600`.

These are dated observations, not a guarantee of how long a page can be served stale.
No purge runs on deployment (above).

### Versioned assets

CSS, JS, and image references carry a `?v=` query string. Versioning and purging
solve the same staleness problem by different means: once an asset is versioned, a
change to it produces a new cache key and needs no purge. HTML documents are not
versioned, and no purge runs on deployment (above); `docs/cache-governance.md` describes
the manual purge.

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
| Email Address Obfuscation | Active | Cloudflare rewrites e-mail addresses in pages served through the proxy (`ryanvalera.com`); the DNS-only origin hostnames serve the contact page without the rewrite |
| HSTS | Deferred | pending sustained stability |
| Content-Security-Policy | Deferred | requires an asset source inventory |

These are edge controls for the zone; the Transform Rules are scoped to
`ryanvalera.com` and `www.ryanvalera.com`. The raw origin URLs redirect (§5):
`valeratech.github.io/ryanvalera-com/` to `https://gh.ryanvalera.com/` and
`ryanvalera-com.pages.dev` to the apex. The origin hostnames `gh.ryanvalera.com` and
`pages.ryanvalera.com`, the Load Balancer's primary and secondary origins, are not
redirected because the Load Balancer depends on them; both are DNS only and carry none
of these edge controls.

---

## 8. Availability and Failure Behaviour

| Failure | Behaviour |
|---|---|
| GitHub Pages unavailable | Health check fails body validation or status; Load Balancer steers to the secondary pool. Cloudflare Pages serves via `pages.ryanvalera.com`. |
| Cloudflare Pages unavailable | The GitHub Pages primary is Healthy and serves production (§3), so traffic stays on the primary; there is no standby until Cloudflare Pages recovers. |
| Both origins unavailable | Site is down. Cached content continues to serve at the edge until TTL expiry. |
| Cloudflare platform event | Site is unreachable. See §9. |
| Current state (October 2026) | Both pools Healthy; GitHub Pages serves production and Cloudflare Pages is on standby. See §3. |

Health-based routing is designed to be automatic when a healthy alternative exists,
and with both pools Healthy a standby is available again. Failover behaviour was
exercised during provisioning; the results are recorded in
`docs/runbooks/load-balancer.md`. A controlled failover proof of the restored
configuration is pending.

---

## 9. Operational Limitations

### Cloudflare is a shared control plane

DNS resolution, Load Balancer routing, WAF enforcement, canonical redirects, and
access to the Cloudflare Pages origin all depend on Cloudflare. A major Cloudflare
platform event affects all of them simultaneously.

**There is no Cloudflare-independent fallback.** Earlier revisions of this document
and of ADR-001/003 described the direct GitHub Pages URL as a genuine escape hatch
during a Cloudflare outage. That is no longer true: the URL now `301`-redirects to
`https://gh.ryanvalera.com/`. That hostname is DNS only, but its DNS is served by the
Cloudflare zone, so a Cloudflare DNS outage would leave the redirect target
unresolvable as well — reasoning from the configuration, not a measured outage.

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
│   ├── cache-governance.md     ← Cache policy, manual purge, versioning, purge history
│   ├── ci-cd.md                ← Deployment workflow and CI security gates
│   ├── analytics-baseline.md   ← Initial traffic and security observations
│   ├── media-preview.md        ← Media runtime design standards
│   ├── deferred-enhancements.md
│   ├── decisions/
│   │   ├── README.md
│   │   └── ADR-001.md … ADR-007.md
│   └── runbooks/
│       ├── README.md
│       ├── github-pages.md
│       ├── load-balancer.md
│       └── notifications.md
│
├── .github/
│   └── workflows/
│       ├── pages.yml               ← GitHub Pages publication (pages-website-only)
│       └── security-gates.yml
│
├── scripts/
│   ├── build-cloudflare-pages.sh   ← Allowlist build used by both deployments
│   └── cloudflare-pages-files.txt  ← The 36-path website allowlist
│
├── .gitattributes
├── .gitignore
└── README.md
```

---

## 11. Architecture Decision Records

| ADR | Decision | Status |
|---|---|---|
| ADR-001 | Cloudflare as shared control plane | Accepted — direct-reachability claim superseded by ADR-006; October 2026: the project URL now redirects to `https://gh.ryanvalera.com/` (ADR-007) |
| ADR-002 | Cloudflare Pages as secondary origin | Accepted — October 2026: its consequence "GitHub Pages remains independently reachable without Cloudflare" was contradicted from July 2026; GitHub Pages is now reachable directly, outside the Cloudflare proxy, through the DNS-only custom domain `gh.ryanvalera.com` (its DNS still served by Cloudflare), not the project URL (ADR-007) |
| ADR-003 | GitHub Pages as primary origin | Accepted — direct-reachability claim superseded by ADR-006; October 2026: GitHub's automatic certificate holds only while its custom domain is DNS only (ADR-007) |
| ADR-004 | Cloudflare Load Balancing | Accepted |
| ADR-005 | Cloudflare R2 as future media and artifact storage | Deferred — post-Milestone 6D |
| ADR-006 | Canonical origin enforcement vs. direct-reachability fallback | Accepted — October 2026: its premise that no uncontrolled direct-serve path remains is superseded by the DNS-only origin hostnames `gh.ryanvalera.com` and `pages.ryanvalera.com`; the canonical-origin policy stands (ADR-007) |
| ADR-007 | Dual-origin restoration (October 2026) | Accepted |

Full records in `docs/decisions/`.
