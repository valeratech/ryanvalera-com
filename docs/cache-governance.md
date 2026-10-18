# Cache Governance

## Overview

This document explains how Cloudflare caching interacts with the site's deployments, the current cache configuration, and the manual purge procedures. No purge runs on deployment: the purge workflow was removed on 2026-10-10, and its history is recorded below.

---

## How Cloudflare Caching Works With GitHub Pages

Cloudflare does not automatically detect GitHub Pages deployments. There is no webhook, signal, or integration between GitHub Pages and Cloudflare's cache layer. When you push a commit to `main` and GitHub Pages deploys updated files, Cloudflare's edge nodes are not notified. Cached copies of your assets remain at the edge until one of the following occurs:

```text
1. TTL expires         → Cloudflare re-fetches from origin automatically
2. Manual purge        → You explicitly clear cached content via dashboard or API
3. Cache rule change   → New rule triggers re-evaluation of cached objects
4. New asset path      → Browser requests a URL Cloudflare has never cached
```

This means a visitor hitting `ryanvalera.com/assets/css/styles.css` immediately after a deployment may receive the previous version of the file until the edge TTL expires or a purge is triggered.

GitHub Pages serves production and Cloudflare Pages is the standby (see `docs/architecture.md` §3). Neither deployment notifies Cloudflare's zone cache.

---

## Current Cache Configuration

### Phase: Active Development

During active development, cache durations are kept conservative to ensure updates are visible quickly without requiring manual purges after every commit.

| Asset Type | URI Pattern | Edge TTL | Browser TTL | Rationale |
|---|---|---|---|---|
| CSS / JS / Images | `/assets/*` | 1 month | 1 week | Static assets rarely change mid-session; long TTL reduces origin load |
| HTML | `/`, `*.html` | 10 min (origin headers ignored) | 10 min | Conservative during active iteration; extensionless page URLs are not matched |

**Current cache rules:**

```text
Rule name:   Static Assets Cache   (runs first)
Match:       URI Path contains /assets/
Edge TTL:    1 month (2592000 seconds), origin cache-control ignored
Browser TTL: 1 week (604800 seconds)

Rule name:   HTML Revalidation
Match:       URI Path ends with .html, or URI Path equals /
Edge TTL:    10 minutes, origin cache-control ignored
Browser TTL: 10 minutes
```

### HTML Caching

The HTML Revalidation rule caches `.html` paths and `/` for 10 minutes at the edge and sets a 10-minute browser lifetime, overriding origin headers. Ten minutes keeps page updates visible quickly during active development.

Measured behaviour (October 2026, with GitHub Pages serving production):

- Extensionless page URLs such as `/projects` are not matched by the rule and were not edge-cached (`cf-cache-status: DYNAMIC`, 2026-10-11).
- `.html` URLs are answered `200` at the apex and are edge-cacheable: `/profile.html` was answered `MISS` (age 0) with `cache-control: max-age=600`. The `308` redirect to the extensionless URL is the Cloudflare Pages origin's behaviour.
- `/` was answered `EXPIRED` (age 527) with `cache-control: max-age=600`.

These are dated observations, not a guarantee of how long a page can be served stale.

Once the site stabilizes and commits become less frequent, HTML TTLs can be extended. For now the 10-minute HTML configuration is kept, and it is not lengthened without a separate measurement. The trade-off: no purge runs on deployment, so a longer HTML edge TTL would lengthen the time an updated page can be served from the edge cache — on the rule-covered paths `/` and `.html`; the extensionless canonical URLs were answered `DYNAMIC` on 2026-10-11.

---

## Cache Validation

After any deployment, confirm cache behavior with:

```bash
# Run each twice — first request may MISS, second should HIT
curl -I https://ryanvalera.com/assets/css/styles.css
curl -I https://ryanvalera.com/assets/css/profile.css
curl -I https://ryanvalera.com/assets/images/ryan-valera-profile.webp
```

Expected progression:

```text
First request:  cf-cache-status: MISS  → fetched from GitHub Pages origin
Second request: cf-cache-status: HIT   → served from Cloudflare edge
```

If `cf-cache-status` remains `DYNAMIC`, the cache rule is not matching. Check:

```text
1. URI path pattern matches correctly (/assets/ vs /assets)
2. Cache eligibility is set to "Eligible for cache"
3. Edge TTL override is enabled
4. Allow a few minutes for rule propagation
```

---

## Manual Cache Purge Procedures

### Available Purge Methods (Plan Tier Reference)

Cloudflare's `purge_cache` API supports five purge modes: `purge_everything`, `files` (exact single-file/URL purge), `prefixes`, `hosts`, and `tags` (the last requires Cache-Tag response headers, not currently in use on this site). Only one mode may be used per API call — they cannot be combined in a single request.

**As of April 2025, all five purge modes are available on every Cloudflare plan tier, including Free.** Prior to that date, Purge by Prefix and Purge by Tag were Enterprise-only; this is no longer the case. ([Cloudflare changelog, April 1, 2025](https://developers.cloudflare.com/changelog/post/2025-04-01-purge-for-all/)) This matters directly for this project: `media.html`'s purge strategy (below) relies on Purge by Prefix, which would not have been usable on this zone's plan tier before that change.

---

### Purge Everything (Nuclear Option)

Use when a major deployment has changed multiple files and you need all cached content refreshed immediately.

Dashboard path as recorded in this document (historical: not re-verified in the October 2026 repository audit; confirm it against the current dashboard before use):

```text
Cloudflare Dashboard
→ ryanvalera.com
→ Caching
→ Configuration
→ Purge Cache
→ Purge Everything
```

Or via API:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything": true}'
```

**Warning:** Purge Everything clears all cached assets across all Cloudflare edge nodes globally. The next requests for every asset will hit origin directly until the cache is rebuilt. On a low-traffic site this is fine. On a high-traffic site, this creates a temporary origin load spike.

---

### Purge Specific Files

Use after a deployment when visitors should receive the current HTML without waiting for the cached copy to expire. Under the HTML rule, `/` and the `.html` paths are edge-cached with a 10-minute edge TTL; the extensionless page URLs are outside the rule and were answered `DYNAMIC`, not edge-cached, on 2026-10-11. These are the rule settings and a dated observation, not a freshness guarantee.

Dashboard path as recorded in this document (historical: not re-verified in the October 2026 repository audit; confirm it against the current dashboard before use):

```text
Cloudflare Dashboard
→ ryanvalera.com
→ Caching
→ Configuration
→ Purge Cache
→ Custom Purge
→ Enter specific URLs
```

Purge target — HTML documents only:

```text
https://ryanvalera.com/
https://ryanvalera.com/index.html
https://ryanvalera.com/profile.html
https://ryanvalera.com/projects.html
https://ryanvalera.com/contact.html
```

Plus a separate prefix purge for `media.html`, covering every `?project=` variant in one call:

```text
ryanvalera.com/media.html
```

**media.html note:** Cloudflare caches by full URL including the query string, so `media.html?project=aivp` is a distinct cache key from bare `media.html`. A prefix purge on `media.html` invalidates any URL starting with that string regardless of query string — covering all current and future `?project=` variants in a single call, with no per-project list to maintain. See "Available Purge Methods" above for plan-tier availability. This is a *separate API call* from the exact-file purge above — the Cloudflare API accepts one purge mode per request, not a mix.

Or via API — two calls, since `files` and `prefixes` can't be combined in one request:

```bash
# Exact-file purge: / plus the four static documents
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      "https://ryanvalera.com/",
      "https://ryanvalera.com/index.html",
      "https://ryanvalera.com/profile.html",
      "https://ryanvalera.com/projects.html",
      "https://ryanvalera.com/contact.html"
    ]
  }'

# Prefix purge for media.html — catches every ?project= variant.
# Note: no scheme here — see "URL scheme handling" below.
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "prefixes": [
      "ryanvalera.com/media.html"
    ]
  }'
```

**Why CSS/JS assets are not purged under normal deployments:** Assets are referenced with a per-asset `?v=` version query string (from `?v=1.0.0` to `?v=1.7.7`). Bumping an asset's version produces a new URL, which is a new cache key — Cloudflare and browsers treat it as content they've never seen, regardless of what's cached under the old version string. The old cached copy simply becomes unreferenced and ages out on its own; purging it accomplishes nothing a version bump hasn't already accomplished.

**Exception — emergency asset purge:** If an asset needs to be corrected *without* a version bump (e.g., a rollback, or a same-version hotfix), purge that specific asset URL manually using the same Custom Purge flow above. This is a deliberate exception for out-of-band correction, not part of the standard deployment path.

---

### URL Scheme Handling in Purge Requests

Cloudflare's `files` purge requires complete URLs, scheme included (`https://ryanvalera.com/index.html`). Its **prefix** purge is the opposite — it explicitly rejects a scheme in the prefix value:

```json
{"code":1119,"message":"URI scheme provided in prefix https://ryanvalera.com/media.html. URI schemes must not be provided."}
```


---

## CI/CD-Based Cache Invalidation

**Status: retired.** The purge workflow, `.github/workflows/deploy-and-purge.yml`, was removed on 2026-10-10; no purge runs on deployment. Before that, its `page_build` trigger could not fire under the Actions publishing source, and its last runs failed authentication.

### History

Automated cache invalidation was planned for Milestone 6E: a purge step in GitHub Actions after every successful deployment, so that no one had to remember a manual purge. It was implemented in July 2026 as `deploy-and-purge.yml`, which purged `/` and the four `.html` documents by URL, and every `media.html?project=` variant by prefix, after GitHub Pages builds. It was removed on 2026-10-10 in the October 2026 repository audit (ADR-007). This account replaces the original plan, its workflow examples and its description of the workflow's URL handling.


---

## Cache TTL Roadmap

Future work, not a current implementation. The later phases assume an automated purge on every deployment; that purge was implemented in July 2026 and removed on 2026-10-10, so those phases are not implemented (see the no-purge trade-off under "HTML Caching" above).

```text
Current (Active Development)
  HTML:   10 minutes edge / 10 minutes browser (.html paths and /)
  Assets: 1 month edge / 1 week browser

Phase: Site Stable, CI/CD Purge Active  (not implemented; the automated purge it assumes no longer exists)
  HTML:   1 hour edge / 30 minutes browser
  Assets: 1 month edge / 1 week browser
  Purge:  Automated via GitHub Actions on every deployment

Phase: Long-term Production  (not implemented; it assumes the same automated purge)
  HTML:   4 hours edge / 1 hour browser
  Assets: 1 year edge / 1 month browser (with versioned filenames)
  Purge:  Automated + versioned asset paths as cache-busting strategy
```

---

## Related Documentation

- `docs/architecture.md` — Full platform architecture
- `docs/cloudflare.md` — Cloudflare configuration reference
- `docs/decisions/ADR-004.md` — Why Cloudflare Load Balancing was implemented
