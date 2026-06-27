# Cloudflare Notifications Runbook

Operational runbook for Cloudflare native notifications configured for ryanvalera.com.

---

## Overview

Cloudflare Notifications provide operational awareness of the Cloudflare edge and origin-routing layer. All alerts are delivered via email to the account owner.

```text
Cloudflare observes the Cloudflare edge and origin-routing layer.
AWS independently validates DNS, DNSSEC, TLS, and domain health from outside the Cloudflare control plane.
```

**Delivery method:** Email (valeraryan@gmail.com)
**Configuration location:** Cloudflare Dashboard → (Manage Account) → Notifications

---

## Configured Alerts

### 1. Load Balancer Health Alert

| Field | Value |
|---|---|
| Product | Load Balancing |
| Event | Health status change |
| Pools monitored | `github-pages-primary`, `cloudflare-pages-secondary` |
| Include future pools | Yes |
| Health status trigger | Becomes either healthy or unhealthy |
| Event source trigger | Health status change in either pool or origin |
| Delivery | Email |

**What it means:** Fires when any origin or pool changes health state in either direction. A pool becoming unhealthy indicates active or impending failover. A pool recovering to healthy indicates failover resolution.

**When you receive one:**
1. Check Load Balancing analytics: Cloudflare Dashboard → Traffic → Load Balancing
2. Confirm which pool or origin triggered the event
3. If primary (`github-pages-primary`) is unhealthy, verify GitHub Pages status at https://www.githubstatus.com
4. If secondary (`cloudflare-pages-secondary`) is unhealthy, verify Cloudflare Pages status at https://www.cloudflarestatus.com
5. No manual intervention required if failover is automatic and secondary is healthy

---

### 2. Load Balancer Pool Enablement

| Field | Value |
|---|---|
| Product | Load Balancing |
| Event | Pool Enablement |
| Pools monitored | All pools (including future pools) |
| Notification trigger | Load Balancing pool enabled / disabled |
| Delivery | Email |

**What it means:** Fires when a pool is administratively enabled or disabled. This reflects deliberate configuration changes, not health-based failover.

**When you receive one:**
- If expected: confirms a deliberate administrative action
- If unexpected: investigate whether an unauthorized change occurred in the dashboard

---

### 3. Universal SSL Alert

| Field | Value |
|---|---|
| Product | SSL/TLS |
| Event | Universal SSL Alert |
| Scope | Zone-wide (ryanvalera.com) |
| Triggers | Certificate validation, issuance, renewal, expiration |
| Delivery | Email |

**What it means:** Fires on any certificate lifecycle event for the Universal SSL certificate covering ryanvalera.com. Cloudflare manages Universal SSL automatically — no manual renewal is required under normal operation.

**When you receive one:**
- **Issued / Renewed:** Informational. No action required.
- **Validation pending:** Monitor for resolution. Typically resolves within minutes.
- **Expiration / Failed:** Investigate immediately. Navigate to Cloudflare Dashboard → SSL/TLS → Edge Certificates and review certificate status. Refer to [Cloudflare SSL troubleshooting](https://developers.cloudflare.com/ssl/troubleshooting/general-ssl-errors/).

---

### 4. HTTP DDoS Attack Alert

| Field | Value |
|---|---|
| Product | DDoS Protection |
| Event | HTTP DDoS Attack Alert |
| Threshold | >100 requests per second mitigated |
| Scope | Account-wide |
| Delivery | Email |

**What it means:** Fires when Cloudflare detects and mitigates an HTTP-layer DDoS attack exceeding 100 requests per second. Cloudflare mitigates automatically — no manual intervention is required to stop the attack.

**When you receive one:**
1. Navigate to Cloudflare Dashboard → Security → Events to review mitigated traffic
2. Confirm site availability at https://ryanvalera.com
3. Review WAF and Rate Limiting analytics for correlated events
4. No action required if mitigation is active and site is available

---

### 5. Cloudflare Incident Alert

| Field | Value |
|---|---|
| Product | Cloudflare Status |
| Event | Incident Alert |
| Incident impact filter | Major, Critical |
| Affected components | All components |
| Delivery | Email |

**What it means:** Fires when Cloudflare declares a Major or Critical platform incident. Minor incidents are excluded to reduce noise. A Major or Critical incident may affect edge availability, DNS resolution, Load Balancing, or SSL/TLS — all of which directly impact ryanvalera.com.

**When you receive one:**
1. Check https://www.cloudflarestatus.com for incident details and affected regions
2. Correlate against Load Balancer Health Alerts — a pool health change concurrent with a Cloudflare incident is likely platform-caused, not origin-caused
3. No origin-side action required during active Cloudflare incidents
4. Monitor for incident resolution notification

---

### 6. Usage Based Billing — Load Balancing

| Field | Value |
|---|---|
| Product | Billing |
| Event | Usage Based Billing |
| Monitored product | Load Balancing |
| Threshold | 50,000 DNS queries |
| Delivery | Email |

**What it means:** Fires when Load Balancing DNS query usage exceeds 50,000 queries in the billing period. The Load Balancing plan includes 500,000 DNS queries per month. Normal portfolio traffic runs well under 10,000 queries/month. This threshold provides early warning at 10% of plan capacity.

**When you receive one:**
1. Navigate to Cloudflare Dashboard → Analytics → DNS to review query volume
2. Investigate for traffic anomalies, bot activity, or misconfigured clients generating excessive DNS queries
3. If query volume is legitimate and growing, review Load Balancing plan limits
4. If query volume appears anomalous, review WAF and Rate Limiting for correlated bot or scraper activity

---

## Alert Summary

| Alert | Product | Trigger | Delivery |
|---|---|---|---|
| Load Balancer Health Alert | Load Balancing | Pool or origin health change (either direction) | Email |
| Load Balancer Pool Enablement | Load Balancing | Pool enabled or disabled | Email |
| Universal SSL Alert | SSL/TLS | Certificate lifecycle event | Email |
| HTTP DDoS Attack Alert | DDoS Protection | >100 rps mitigated attack | Email |
| Cloudflare Incident Alert | Cloudflare Status | Major or Critical platform incident | Email |
| Usage Based Billing | Billing | LB DNS queries exceed 50,000 | Email |

---

## Plan Eligibility Notes

Alert availability is plan-dependent. The following alerts were evaluated and determined ineligible on the current Free + Load Balancing add-on plan:

| Alert | Minimum Plan Required | Status |
|---|---|---|
| Security Events Alert (WAF) | Business | Not configured |
| Advanced Security Events Alert (WAF) | Enterprise | Not configured |
| Bot Detection Alert | Enterprise | Not configured |

WAF-level security event alerting is available through the AWS Reliability Layer as an independent external validation layer.

---

## Maintenance Procedures

**After any Load Balancer configuration change:**
- Use the **Test** action on Load Balancer Health Alert and Pool Enablement alerts to confirm delivery

**After any SSL/TLS configuration change:**
- Verify Universal SSL certificate status in Dashboard → SSL/TLS → Edge Certificates

**To temporarily suppress alerts during planned maintenance:**
- Use the **Mute** action on individual alerts in Dashboard → Notifications
- Re-enable after maintenance is complete

**To add a notification recipient:**
- Edit each alert individually and add the additional email address

---

## References

- [Cloudflare Notifications documentation](https://developers.cloudflare.com/notifications/)
- [Available Notifications by plan](https://developers.cloudflare.com/notifications/notification-available/)
- [Load Balancing health monitor notifications](https://developers.cloudflare.com/load-balancing/reference/migration-guides/health-monitor-notifications/)
- [Cloudflare System Status](https://www.cloudflarestatus.com)
- [GitHub Status](https://www.githubstatus.com)