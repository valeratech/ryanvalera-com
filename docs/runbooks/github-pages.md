# GitHub Pages Deployment Runbook

## Overview

This runbook documents the GitHub Pages deployment for `ryanvalera-com`, including activation, validation, and incident response procedures.

---

## Deployment Details

| Property | Value |
|---|---|
| Repository | `github.com/valeratech/ryanvalera-com` |
| Branch | `main` |
| Source | GitHub Actions (`pages-website-only`): the published artifact is `dist/`, built from the 36-path allowlist (`scripts/cloudflare-pages-files.txt`) |
| Live URL | `https://gh.ryanvalera.com/` (the project URL `https://valeratech.github.io/ryanvalera-com/` answers `301` to it) |
| Custom Domain | `gh.ryanvalera.com` (DNS check successful; Enforce HTTPS on); `ryanvalera.com` is verified for GitHub Pages at the account level (the challenge TXT record is retained) |
| Deployment Model | Automatic on push to `main` |
| Build Step | `bash scripts/build-cloudflare-pages.sh` in the `pages-website-only` workflow |

---

## Activation

GitHub Pages was activated via:

```text
Repository Settings → Pages → Build and deployment
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

*June 2026 activation record.* Since October 2026 the publishing source is GitHub Actions (`pages-website-only`), not a branch.

First deployment completed automatically within approximately 60 seconds of activation.

---

## Deployment Flow

```text
git push → main
      ↓
GitHub Actions: pages-website-only
      ↓
bash scripts/build-cloudflare-pages.sh → dist/ (36 website files)
      ↓
upload-pages-artifact → deploy-pages
      ↓
Files live at https://gh.ryanvalera.com/
```

The `pages-website-only` workflow builds and deploys the site. The purge workflow this runbook once announced for a later milestone was implemented in July 2026 and removed on 2026-10-10. Cloudflare Pages builds the same allowlist independently.

---

## Validation Checklist (June 2026, historical)

Kept as the June 2026 record; it has not been re-verified for the current pages:

- [ ] `index.html` renders correctly (fonts, colors, layout)
- [ ] Landing page keyboard navigation works (arrow keys, Enter, Esc)
- [ ] Locked card shake + tooltip behavior works
- [ ] "Enter System" navigates to `profile.html` — historical label: as of October 2026 the landing's buttons read "Professional Dossier" (to `profile.html`) and "Engineering Portal" (to `projects.html`)
- [ ] "Return to Professional Select" navigates back to `index.html`
- [ ] `profile.html` renders correctly (two-column layout, portrait, panels)
- [ ] Healthcare imaging perimeter art renders in page margins
- [ ] Portrait rail renders with hex texture and corner brackets
- [ ] All Quick Links resolve (GitHub, LinkedIn, Email)
- [ ] No 404 errors in DevTools Console
- [ ] No CSS or JS errors in DevTools Console
- [ ] HTTPS enforced (no mixed content warnings)

---

## Initial Validation Results

**Date:** June 2026
**URL:** `https://valeratech.github.io/ryanvalera-com/`
**Result:** All validation checks passed on first deployment

---

## Incident Response

### Site Not Loading

1. Confirm `main` branch has a valid `index.html` at repo root
2. Check GitHub Pages status at `githubstatus.com`
3. Check deployment status at `github.com/valeratech/ryanvalera-com/actions`
4. If the deployment failed, check the `pages-website-only` run in the Actions tab for build errors: the allowlist build fails closed before `deploy-pages`, so the previous deployment stays live
5. If GitHub Pages is down, the Load Balancer is designed to fail over to the secondary origin (Cloudflare Pages): Milestone 6D (load balancing) is complete and both pools are Healthy; a controlled failover proof is still pending

---

### Deployment Not Reflecting Latest Changes

1. Confirm `git push` completed successfully with no errors
2. Wait 60–120 seconds — GitHub Pages deployments are not always instant
3. Hard refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) to bypass cache
4. Check the latest `pages-website-only` run in the Actions tab (environment `github-pages`) for its deployment time
5. If still stale, check that run for a queued or failed deployment

---

### Custom Domain Not Resolving

Cloudflare DNS is authoritative for the zone, and GitHub Pages' custom domain is `gh.ryanvalera.com`:

1. Confirm the `gh` record exists in Cloudflare DNS as `CNAME valeratech.github.io` and is DNS only (not proxied): a proxied custom domain blocks GitHub's certificate issuance and renewal (GitHub's certificate expired on 2026-09-17 while its custom domain was proxied)
2. Confirm the custom domain `gh.ryanvalera.com` is set in GitHub Pages settings
3. Allow up to 24 hours for DNS propagation
4. Verify with `nslookup gh.ryanvalera.com` or `dig gh.ryanvalera.com`
5. Confirm the HTTPS certificate has provisioned (GitHub Pages issues and renews it automatically only while `gh` is DNS only)

---

## Related Documentation

- `docs/architecture.md` — Full platform architecture
- `docs/decisions/ADR-003.md` — Why GitHub Pages was selected as primary origin
- Response procedure for a GitHub Pages outage — planned, not yet written (see `docs/runbooks/README.md`)
