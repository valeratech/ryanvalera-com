# Analytics Baseline

## Overview

This document establishes the analytics baseline for `ryanvalera.com` during its first 24 hours of operation under full Cloudflare proxy configuration. Data was captured on June 20, 2026 (PDT) from the Cloudflare Analytics and Security dashboards.

This baseline serves as the reference point for evaluating traffic growth, cache performance improvement, and security event trends over time.

---

## Observation Period

```text
Period:   Previous 24 hours
Date:     June 20, 2026
Timezone: PDT (UTC-7)
Source:   Cloudflare Analytics → Traffic + Security tabs
```

---

## Traffic Baseline

### Request Volume

| Metric | Value |
|---|---|
| Total Requests | 3,410 |
| Cached Requests | 61 |
| Uncached Requests | 3,350 |
| Cache Hit Ratio | ~1.8% |

### Bandwidth

| Metric | Value |
|---|---|
| Total Bandwidth | 13.69 MB |
| Cached Bandwidth | 3.61 MB |
| Uncached Bandwidth | 10.08 MB |
| Bandwidth Cache Ratio | ~26% |

### Unique Visitors

| Metric | Value |
|---|---|
| Total Unique Visitors | 90 |
| Maximum per Hour | 17 |
| Minimum per Hour | 1 |

### Traffic by Country

| Country | Requests | % of Total |
|---|---|---|
| Netherlands | 2,898 | 85% |
| United States | 409 | 12% |
| Germany | 21 | <1% |
| Singapore | 19 | <1% |
| Switzerland | 16 | <1% |

---

## Security Baseline

### Request Disposition

| Disposition | Count |
|---|---|
| Total Requests | 3,380 |
| Mitigated by Cloudflare | 49 |
| Served by Cloudflare Edge | 1,530 |
| Served by Origin (GitHub Pages) | 1,800 |

### Security Events — First 24 Hours

**49 requests blocked via Cloudflare Managed Rules**

| IP Address | Country | Pattern | Notes |
|---|---|---|---|
| 45.148.10.244 | Netherlands | Recurring, sequential | Known scanning range |
| 45.148.10.67 | Netherlands | Recurring, sequential | Same /24 subnet |
| 45.148.10.62 | Netherlands | Recurring, sequential | Same /24 subnet |
| 154.58.229.20 | United States | High-volume burst at 06:28 PDT | Automated tooling pattern |

### Traffic Analysis — Netherlands Anomaly

85% of total request volume originated from the Netherlands, which is inconsistent with the expected audience for a San Diego-based Healthcare Imaging IT portfolio. This pattern is characteristic of automated scanning infrastructure — not organic human traffic.

The three blocking IPs (`45.148.10.62`, `.67`, `.244`) are all within the same `/24` subnet (`45.148.10.0/24`). Coordinated scanning across multiple IPs within the same subnet is a common technique used to distribute request volume and avoid per-IP rate limiting thresholds. This is standard behavior observed against newly proxied or newly registered domains.

**Key observation:** Despite 2,898 requests from Netherlands IPs, only 49 were blocked. The remainder passed through Cloudflare's edge — either served from cache or forwarded to origin. This is expected behavior: Bot Fight Mode and Managed Rules block known malicious signatures, but general scanning traffic from IPs without established bad reputation passes through until it triggers a specific rule.

**Action taken:** None required at this stage. The blocking controls are functioning correctly. Monitor for continued escalation or changes in attack pattern over the next 7 days.

### Free Tier Managed Rules Observation

The Security Events tab shows "Managed rules" as the blocking service despite the WAF Managed Ruleset appearing unavailable in the WAF configuration UI. This indicates Cloudflare applies a baseline level of managed rule enforcement at the free tier — the full configurable ruleset with custom sensitivity and action settings requires Pro, but foundational protection is active regardless of plan level.

---

## HTTP Protocol Distribution

| Protocol | Requests |
|---|---|
| HTTP/1.1 | 1,740 |
| HTTP/2 | 1,520 |
| HTTP/3 | 125 |

HTTP/3 (QUIC) is active and serving a small percentage of requests — consistent with Cloudflare advertising `alt-svc: h3=":443"` in all responses.

---

## Cache Performance Assessment

The 1.8% cache hit ratio is expected and appropriate at this baseline stage for two reasons:

**1. Cache rule scope is limited to `/assets/`**
HTML pages (`/`, `/profile.html`) are currently uncached per the governance decision in `docs/cache-governance.md`. The majority of requests are for HTML, which passes through to origin on every request.

**2. Cache warming is still in progress**
The static asset cache rule (1 month edge TTL) was applied within the observation period. Edge nodes across Cloudflare's global network populate cache independently — a node in Amsterdam will not have the same cached content as the LAX node until it receives its first request for that asset.

**Expected improvement after Load Balancer activation:**
Once Cloudflare Pages is added as a secondary origin and the Load Balancer is active, cache behavior will be evaluated across both origins. A realistic target for a fully cached static site is >80% cache hit ratio on repeat visits.

---

## Weekly Review Checklist

Run this review every 7 days from the Cloudflare Analytics dashboard:

### Traffic

```text
Location: Analytics & Logs → Traffic

□ Total requests — trending up, down, or stable?
□ Cache hit ratio — improving toward target (>80% for assets)?
□ Bandwidth saved — cached vs uncached ratio
□ Unique visitors — organic growth indicator
□ Top countries — any new anomalous sources?
```

### Security

```text
Location: Security → Analytics → Events

□ Total mitigated requests — stable or escalating?
□ New IPs or subnets appearing in block events?
□ Bot Fight Mode events — any change in bot traffic volume?
□ Rate limiting events — any legitimate users hitting thresholds?
□ Any new countries appearing as top threat sources?
```

### Cache

```text
Location: Analytics & Logs → Traffic → Requests tab

□ cf-cache-status: HIT ratio for /assets/* improving?
□ Any BYPASS or DYNAMIC status on assets that should be cached?
□ After any deployment: confirm manual purge executed for changed files
```

### Origin Health (once Load Balancer is active)

```text
Location: Traffic → Load Balancing

□ Primary origin (GitHub Pages) health check: passing?
□ Secondary origin (Cloudflare Pages) health check: passing?
□ Any failover events in the past 7 days?
□ Traffic distribution between origins: expected split?
```

---

## Metrics to Track Over Time

| Metric | Baseline (Day 1) | Target |
|---|---|---|
| Cache hit ratio | 1.8% | >80% (assets) |
| Security events / day | 49 | Monitor for escalation |
| Unique visitors / day | 90 | Organic growth |
| Origin requests / day | 1,800 | Decrease as cache warms |
| Bandwidth saved | 26% | >60% (as cache warms) |

---

## Related Documentation

- `docs/cloudflare.md` — Full Cloudflare configuration reference
- `docs/cache-governance.md` — Cache policy and purge procedures
- `docs/architecture.md` — Platform architecture overview