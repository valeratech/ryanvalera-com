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
| DNS | Cloudflare authoritative; production records proxied |
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

There are no Cache Response Rules. Measured cache behaviour and the purge design are in
[`docs/cache-governance.md`](./cache-governance.md).

### Redirects

- **Bulk Redirect** rule `pages_dev_canonical_rule` uses the list `pages_dev_canonical`
  (one entry): `ryanvalera-com.pages.dev` → `301 https://ryanvalera.com/`. It is
  account-level because zone rules cannot reach `*.pages.dev` traffic (ADR-006).
- There are no zone Redirect Rules.
- The GitHub Pages raw origin is redirected by GitHub's own custom-domain handling:
  `valeratech.github.io/ryanvalera-com/` → `301 http://ryanvalera.com/` (see §6).

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
| Email Address Obfuscation | On — Cloudflare rewrites e-mail addresses in served pages |
| Replace insecure JavaScript libraries | On |
| Continuous script monitoring, hotlink protection, leaked-credential detection | Off |
| Rate limiting | One rule, "General pages and Assets Path": 40 requests per 10 seconds per IP, block for 10 seconds. **Not currently effective** (see §6) |

---

## 4. Load Balancing

```text
Load balancer:   ryanvalera.com (proxied)
Pools, in priority order:
  1. github-pages-primary        endpoint valeratech.github.io    Host: ryanvalera.com
  2. cloudflare-pages-secondary  endpoint pages.ryanvalera.com    Host: pages.ryanvalera.com
Fallback pool:   cloudflare-pages-secondary
Proximity steering: disabled on both pools

Monitor "HTTPS Health Check" (shared by both pools):
  HTTPS GET / on port 443, certificate verification on
  interval 60 s, timeout 5 s, 2 retries
  expected 200, body must contain "Ryan Valera", follow redirects off
```

**Current operating state (accepted).** The Cloudflare load balancer is presently
operating in a degraded redundancy state. The GitHub Pages primary is Critical because
its TLS health check fails under the current custom-domain configuration ("TLS untrusted
certificate error"; GitHub's Pages settings show the certificate request failing and
Enforce HTTPS unavailable). The Cloudflare Pages secondary is Healthy and currently
serves production. This state is intentionally accepted by the Owner. There is no
healthy standby while it remains in effect. Restoring dual-origin health is an optional
post-audit improvement. The provisioning record is
[`docs/runbooks/load-balancer.md`](./runbooks/load-balancer.md).

---

## 5. Cloudflare Pages

Project `ryanvalera-com`, production branch `main`, automatic deployments on push.
Domains: `pages.ryanvalera.com` (the load balancer's secondary origin) and
`ryanvalera-com.pages.dev` (redirected to canonical, §2). Each deployment also keeps its
own preview address under `ryanvalera-com.pages.dev`.

---

## 6. Known Open Findings (post-audit)

1. **Rate limiting is not effective.** The rule compares the request path with patterns
   that begin with the hostname (`ryanvalera.com/*`). Request paths never contain the
   hostname, so the rule does not match. A correction (for example a path pattern of
   `/*`) is scheduled after the audit.
2. **Purge trigger coupling.** The purge workflow follows GitHub Pages builds;
   Cloudflare Pages, which serves production, does not trigger it. Measured cache
   behaviour limits the effect (see `docs/cache-governance.md`).
3. **Unknown paths and `robots.txt`.** With no top-level `404.html`, Cloudflare Pages
   answers unknown paths with the landing page and status `200`, including
   `/robots.txt`, which is also edge-cached. The AI crawler policy is therefore not
   published in `robots.txt`. A 404 page and a `robots.txt` are planned.
4. **GitHub Pages certificate.** Certificate provisioning for `ryanvalera.com` is
   failing under the current configuration. As a result the primary pool is Critical,
   and GitHub's raw-origin redirect targets `http://ryanvalera.com/`; browsers and
   Always Use HTTPS then upgrade to HTTPS. Restoring dual-origin health is optional.
