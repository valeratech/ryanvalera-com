# Cloudflare Configuration Reference

## Overview

This document describes the Cloudflare configuration applied to `ryanvalera.com`. It covers SSL/TLS, security headers, cache rules, WAF, bot protection, and rate limiting. Configuration was applied incrementally across Milestone 6B.

---

## Zone Details

| Property | Value |
|---|---|
| Domain | `ryanvalera.com` |
| Nameservers | `curt.ns.cloudflare.com`, `georgia.ns.cloudflare.com` |
| Plan | Free |
| Proxy Status | Proxied (orange cloud) |

---

## 6B-1 — SSL/TLS

### Encryption Mode

```text
Mode: Full (Strict)
```

Cloudflare validates the origin certificate on both legs of the connection:

```text
Visitor ↔ Cloudflare: TLS (Cloudflare edge certificate, Google Trust Services)
Cloudflare ↔ GitHub Pages: TLS (origin certificate, Let's Encrypt)
```

Both origins (GitHub Pages and Cloudflare Pages) present valid certificates natively, satisfying Full Strict without additional configuration.

### Edge Certificates Settings

| Setting | Value |
|---|---|
| Always Use HTTPS | On |
| HTTP Strict Transport Security (HSTS) | Deferred — see note |
| Minimum TLS Version | TLS 1.2 |
| Opportunistic Encryption | On |
| TLS 1.3 | On |
| Automatic HTTPS Rewrites | On |

### HSTS Note

HSTS is deliberately deferred. Once a browser receives an HSTS header, it caches the policy for the full `max-age` duration. If HTTPS ever needs to be temporarily disabled — during a certificate issue, origin migration, or domain transfer — visitors whose browsers have cached the policy will receive hard errors with no workaround except waiting for expiry or manually clearing browser state. Enable only when HTTPS is confirmed permanent and stable.

### Verification

```bash
curl -v --head https://ryanvalera.com
```

Confirmed:
- TLSv1.3 active
- Certificate: `CN=ryanvalera.com`, issuer: Google Trust Services (Cloudflare edge)
- HTTP/2 active
- HTTP/3 (QUIC) advertised via `alt-svc`

---

## 6B-2 — Transform Rules

Two Transform Rules applied via:
```text
Rules → Transform Rules → Modify Response Headers
```

### Rule 1 — Remove Origin Fingerprinting Headers

**Expression:**
```text
(http.host eq "ryanvalera.com") or (http.host eq "www.ryanvalera.com")
```

**Headers removed:**

| Header | Reason |
|---|---|
| `x-github-request-id` | Reveals GitHub Pages as hosting platform |
| `x-fastly-request-id` | Reveals Fastly as GitHub's CDN provider |
| `x-served-by` | Reveals specific Fastly cache node |
| `x-cache` | Reveals Fastly cache hit/miss state |
| `x-cache-hits` | Reveals Fastly internal cache metrics |
| `x-timer` | Reveals Fastly internal timing data |
| `via` | Reveals `1.1 varnish` — Fastly/Varnish fingerprint |
| `x-proxy-cache` | Reveals internal proxy cache state |

### Rule 2 — Add Security Headers

**Expression:**
```text
(http.host eq "ryanvalera.com") or (http.host eq "www.ryanvalera.com")
```

**Headers added:**

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking via iframe embedding |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer data sent to external sites |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disables unused browser APIs |

### Deferred Headers

| Header | Reason for Deferral |
|---|---|
| `Strict-Transport-Security` | Deferred — see HSTS note above |
| `Content-Security-Policy` | Requires full asset source inventory first. Google Fonts CDN must be explicitly whitelisted. Wrong CSP silently breaks the site. |

### Verification

```bash
curl -I https://ryanvalera.com
```

Confirmed present:
```text
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
referrer-policy: strict-origin-when-cross-origin
permissions-policy: geolocation=(), microphone=(), camera=()
```

Confirmed absent:
```text
x-github-request-id
x-fastly-request-id
x-served-by
x-cache
x-cache-hits
x-timer
via
x-proxy-cache
```

---

## 6B-3 — Cache Rules

### Rule — Static Assets Cache

```text
Name:        Static Assets Cache
Match:       URI Path contains /assets/
Eligibility: Eligible for cache
Edge TTL:    1 month (ignores origin Cache-Control)
Browser TTL: 7 days (overrides origin Cache-Control)
Status:      Active
```

### HTML Caching

HTML pages (`/`, `/profile.html`) are not covered by a cache rule. GitHub Pages' default `cache-control: max-age=600` (10 minutes) is currently respected. This is intentional during active development to ensure content updates are visible quickly without manual purge operations.

A future rule will extend HTML TTL once the site stabilizes:

```text
Edge TTL:    4 hours
Browser TTL: 1 hour
```

### Verification

```bash
curl -I https://ryanvalera.com/assets/css/profile.css
curl -I https://ryanvalera.com/assets/images/ryan-valera-profile.png
```

Confirmed:
```text
cf-cache-status: HIT
cache-control: max-age=604800   (7 days)
age: [seconds in cache]
```

### Cache Governance

Cache purge procedures, TTL roadmap, and CI/CD invalidation plan are documented in `docs/cache-governance.md`.

---

## 6B-4 — Security Controls

### Bot Protection

| Control | Status | Notes |
|---|---|---|
| Block AI Bots | Enabled | Blocks AI training crawlers (GPTBot, CCBot, etc.) |
| Bot Fight Mode | Enabled | Detects and challenges automated bot traffic |

### WAF Managed Rules

| Control | Status | Notes |
|---|---|---|
| Cloudflare Managed Ruleset | Unavailable | Requires Pro plan upgrade |
| OWASP Core Ruleset | Unavailable | Requires Pro plan upgrade |

**Free tier note:** WAF Managed Rules require a Cloudflare Pro plan ($20/month). On the free tier, bot protection (Bot Fight Mode + Block AI Bots) and rate limiting provide the primary automated threat defense. Custom WAF rules (0/5 used) remain available for specific rule-based filtering if needed. For a static site without forms, databases, or server-side code, the free tier controls are sufficient for the current phase.

### Rate Limiting

| Property | Value |
|---|---|
| Rule name | General pages and Assets Path |
| Match | `URI Path wildcard ryanvalera.com/*` |
| Characteristic | IP |
| Threshold | 40 requests per 10 seconds |
| Action | Block |
| Duration | 10 seconds |
| Status | Active |

**Free tier note:** The Managed Challenge action (preferred for initial deployment) is unavailable on the free tier. Block is the only available action. The threshold of 40 requests per 10 seconds is sufficiently conservative that legitimate visitors — who generate roughly 10–20 total requests browsing the full portfolio — will not be affected under any normal usage pattern.

**Upgrade path:** On Cloudflare Pro, rate limiting gains:
- Managed Challenge action (preferred over hard Block)
- Longer time windows (60 seconds, 10 minutes, 1 hour)
- Per-rule analytics

---

## Deferred Configuration

| Item | Status | Reason |
|---|---|---|
| HSTS | Deferred | Enable after HTTPS confirmed permanently stable |
| Content-Security-Policy | Deferred | Requires asset source inventory; wrong CSP breaks site |
| WAF Managed Ruleset | Plan limitation | Requires Pro upgrade |
| HTML cache rule | Deferred | Enable after active development phase completes |
| Cloudflare Pages secondary origin | Milestone 6D | Load balancer not yet configured |
| Load Balancer | Milestone 6D | Pending |

---

## Rule Evaluation Order

Cloudflare evaluates rules top-to-bottom and stops at the first match (short-circuit evaluation). This applies across all rule types — WAF custom rules, Transform Rules, Cache Rules, and Rate Limiting.

**The governing principle:**

```text
Most specific rules first
Most general rules last
```

**Practical example for this project (Pro tier with two rate limiting rules):**

```text
Rule 1 (first):  ryanvalera.com/assets/*  → 40 req / 10s  ← more specific
Rule 2 (second): ryanvalera.com/*         → 20 req / 10s  ← more general
```

A request to `/assets/css/styles.css` matches Rule 1 first, applies the 40-request threshold, and stops. Rule 2 is never evaluated for that request.

If the order were reversed, `/assets/*` requests would incorrectly receive the tighter 20-request threshold because `/*` catches everything including assets — the more specific rule would never be reached.

**On the free tier:** This is currently a non-issue since only one combined rule exists. When upgrading to Pro and splitting into separate rules, place the `/assets/*` rule above the `/*` rule in the evaluation order.

**This principle applies universally across:**

```text
WAF Custom Rules      → block specific paths before general catch-all rules
Transform Rules       → apply specific header modifications before broad ones
Cache Rules           → match specific asset paths before general caching rules
Rate Limiting Rules   → apply specific thresholds before general thresholds
```

---

## Related Documentation

- `docs/architecture.md` — Full platform architecture
- `docs/cache-governance.md` — Cache policy, purge procedures, CI/CD invalidation roadmap
- `docs/decisions/ADR-001.md` — Cloudflare as shared control plane
- `docs/decisions/ADR-002.md` — Cloudflare Pages as secondary origin
- `docs/decisions/ADR-004.md` — Why Cloudflare Load Balancing was implemented