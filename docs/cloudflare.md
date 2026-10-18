# Cloudflare Configuration Reference

Configuration of the `ryanvalera.com` zone as measured in the October 2026 repository
audit (dashboard captures and live response headers). Changes made after that date are
not reflected until this document is updated. Account and zone identifiers are
intentionally omitted. Notification and alert procedures are in
[`docs/runbooks/notifications.md`](./runbooks/notifications.md).

---

## 1. Zone and TLS

| Setting | Value |
|---|---|
| DNS | Cloudflare authoritative; the apex (load balancer) and `www` (a redirect-only `A` record) proxied; `gh` and `pages`, the origin hostnames, DNS only by design |
| SSL/TLS encryption mode | Full (strict) |
| Edge certificate | Universal SSL for `ryanvalera.com` and `*.ryanvalera.com` (managed, auto-renewing) |
| Always Use HTTPS | On |
| Minimum TLS version | 1.2 |
| TLS 1.3 | On |
| Automatic HTTPS Rewrites | On |
| Opportunistic Encryption | On |
| HSTS | Not enabled (deferred) |

---

## 2. Rules

### Response header Transform Rules

Both rules match the hostnames `ryanvalera.com` and `www.ryanvalera.com`.

1. **Remove Origin Fingerprinting Headers** — removes origin headers including `via`,
   `x-cache`, `x-cache-hits` and `x-fastly-request-id`.
2. **Add Security Headers** — sets `Permissions-Policy` (geolocation, microphone and
   camera disabled) and `Referrer-Policy: strict-origin-when-cross-origin`.

Served responses on `ryanvalera.com` carry `Permissions-Policy`, `Referrer-Policy`,
`X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN`. No
`Content-Security-Policy` or `Strict-Transport-Security` header is sent (both deferred).
All Managed Transforms are off.

### Cache Rules

| Order | Rule | Match | Edge TTL | Browser TTL |
|---|---|---|---|---|
| 1 | Static Assets Cache | URI path contains `/assets/` | 1 month, origin headers ignored | 7 days |
| 2 | HTML Revalidation | URI path ends with `.html`, or equals `/` | 10 minutes, origin headers ignored | 10 minutes |

There are no Cache Response Rules. Measured cache behaviour, the manual purge procedure
and the retired purge workflow's history are in
[`docs/cache-governance.md`](./cache-governance.md).

### Redirects

- **Bulk Redirect** rule `pages_dev_canonical_rule` uses the list `pages_dev_canonical`
  (one entry): `ryanvalera-com.pages.dev` → `301 https://ryanvalera.com/`. It is
  account-level because zone rules cannot reach `*.pages.dev` traffic (ADR-006).
  Dashboard location (Owner-reported, observed on 2026-10-06; not re-verified since):
  account home sidebar → Delivery & performance → Bulk redirects, listed with Load
  Balancing and Web tag management.
- One zone Redirect Rule, `STAGE7 www to apex 301`: when the host is
  `www.ryanvalera.com`, a `301` to `https://ryanvalera.com` plus the request path, query
  string preserved. Measured: `www.ryanvalera.com` answers `301` to
  `https://ryanvalera.com/`.
- The GitHub Pages raw origin is redirected by GitHub's own custom-domain handling:
  `valeratech.github.io/ryanvalera-com/` → `301 https://gh.ryanvalera.com/`.

No URL Rewrite, Configuration, Origin, Request Header Transform or Compression rules are
configured.

---

## 3. Security

| Control | State |
|---|---|
| Cloudflare managed ruleset (WAF, free plan) | Always active |
| Custom WAF rules | None |
| Bot Fight Mode | On |
| Browser Integrity Check | On |
| AI Labyrinth | On |
| AI crawler policy | Search: Allow. Agent: Allow. Training: Disallow. Bot Preference Sync: on (see §6) |
| Email Address Obfuscation | On — Cloudflare rewrites e-mail addresses in pages served through the proxy (`ryanvalera.com`); the DNS-only origin hostnames serve pages without the rewrite |
| Replace insecure JavaScript libraries | On |
| Continuous script monitoring, hotlink protection, leaked-credential detection | Off |
| Rate limiting | One rule, "General pages and Assets Path": 40 requests per 10 seconds per IP, block for 10 seconds. **Not currently effective** (see §6) |

---

## 4. Load Balancing

```text
Load balancer:   ryanvalera.com (proxied)
Pools, in priority order:
  1. github-pages-primary        endpoint valeratech.github.io    Host: gh.ryanvalera.com (since 2026-10-08)
  2. cloudflare-pages-secondary  endpoint pages.ryanvalera.com    Host: pages.ryanvalera.com
Fallback pool:   cloudflare-pages-secondary
Proximity steering: disabled on both pools

Monitor "HTTPS Health Check" (shared by both pools):
  HTTPS GET / on port 443, certificate verification on
  interval 60 s, timeout 5 s, 2 retries
  expected 200, body must contain "Ryan Valera", follow redirects off
```

**Current operating state (October 2026).** Both pools are Healthy: the GitHub Pages
primary serves production (a fresh unknown path at the apex answers `404`, `DYNAMIC`,
from GitHub Pages) and the Cloudflare Pages secondary is Healthy on standby. The
degraded state accepted earlier was superseded by the Owner on 2026-10-05 and
remediated during the October 2026 repository audit (ADR-007). The provisioning record
is [`docs/runbooks/load-balancer.md`](./runbooks/load-balancer.md).

---

## 5. Cloudflare Pages

Project `ryanvalera-com`, production branch `main`, automatic deployments on push.
Build command `bash scripts/build-cloudflare-pages.sh`, output directory `dist`: the
36-file allowlist, website files only. Domains: `pages.ryanvalera.com` (the load
balancer's secondary origin; a DNS-only custom domain) and `ryanvalera-com.pages.dev`
(redirected to canonical, §2). Each deployment also keeps its own preview address under
`ryanvalera-com.pages.dev`; older deployments were pruned during the audit so that only
website-only deployments remain.

Dashboard location (Owner-reported, observed on 2026-10-06; not re-verified since):
account home → Compute → Workers & Pages.

---

## 6. Known Open Findings (post-audit)

1. **Rate limiting is not effective.** The rule compares the request path with patterns
   that begin with the hostname (`ryanvalera.com/*`). Request paths never contain the
   hostname, so the rule does not match. A correction (for example a path pattern of
   `/*`) is scheduled after the audit.
2. **Unknown paths and `robots.txt`.** The answer to an unknown path depends on the
   serving origin. With GitHub Pages serving, a fresh unknown path at the apex answered
   GitHub's `404` (`DYNAMIC`) in October 2026. On 2026-10-11 the apex answered
   `/robots.txt` with a `404` through the edge, cache-associated (`MISS`,
   `max-age=14400`), not the landing page; that `404` is not a robots policy, and it
   differs from the GitHub origin's direct answer (a `404` from GitHub without
   `cf-cache-status` or `cache-control`). The Cloudflare Pages origin answers unknown
   paths with the landing page and status `200` (on 2026-10-11 its `/robots.txt` answer
   was a `200` with a body the size of `index.html`); by design that answer would reach
   the apex only if the load balancer steered to Cloudflare Pages, and failover itself
   still awaits a controlled proof. The repository has no `robots.txt`, so the AI
   crawler policy is not published there. These are dated observations,
   not a guarantee. A `robots.txt` is planned; a top-level `404.html` waits for the
   failover proof, because it would replace the Cloudflare Pages answer that tells
   the two origins apart.
