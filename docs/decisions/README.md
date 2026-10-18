# Architecture Decision Records

Decisions affecting this platform's design are recorded here. The records are point-in-time: a later change to what a record states is noted as a dated entry below, never by rewriting the record (ADR-003 and ADR-004 only had a broken runbook reference corrected).

- ADR-001 — Cloudflare as shared control plane (accepted trade-off). October 2026: the project URL `valeratech.github.io/ryanvalera-com/` now redirects to `https://gh.ryanvalera.com/`, not to `https://ryanvalera.com/` as its July 2026 annotation records (ADR-007).
- ADR-002 — Why Cloudflare Pages was selected as secondary origin. October 2026: its consequence that GitHub Pages "remains independently reachable without Cloudflare" was contradicted from July 2026; GitHub Pages is reachable directly again, outside the Cloudflare proxy, through the DNS-only custom domain `gh.ryanvalera.com` (its DNS still served by Cloudflare), not the project URL (ADR-007).
- ADR-003 — Why GitHub Pages was selected as primary origin. October 2026: GitHub's automatic certificate holds only while its custom domain is DNS only (ADR-007).
- ADR-004 — Why Cloudflare Load Balancing was implemented
- ADR-005 — R2 Engineering Media Layer
- ADR-006 — Canonical origin enforcement vs. direct-reachability fallback (accepted). October 2026: its premise that no uncontrolled direct-serve path remains is superseded by the DNS-only origin hostnames `gh.ryanvalera.com` and `pages.ryanvalera.com`; the canonical-origin policy stands (ADR-007).
- ADR-007 — Dual-origin restoration (October 2026)
