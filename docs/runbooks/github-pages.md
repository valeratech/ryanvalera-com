# GitHub Pages Deployment Runbook

## Overview

This runbook documents the GitHub Pages deployment for `ryanvalera-com`, including activation, validation, and incident response procedures.

---

## Deployment Details

| Property | Value |
|---|---|
| Repository | `github.com/valeratech/ryanvalera-com` |
| Branch | `main` |
| Root | `/` (repo root) |
| Live URL | `https://valeratech.github.io/ryanvalera-com/` |
| Custom Domain | `ryanvalera.com` (pending — Cloudflare DNS) |
| Deployment Model | Automatic on push to `main` |
| Build Step | None — static site served directly from repo root |

---

## Activation

GitHub Pages was activated via:

```text
Repository Settings → Pages → Build and deployment
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

First deployment completed automatically within approximately 60 seconds of activation.

---

## Deployment Flow

```text
git push → main
      ↓
GitHub detects push
      ↓
GitHub Pages builds (no build step — static files served directly)
      ↓
Files live at https://valeratech.github.io/ryanvalera-com/
```

No GitHub Actions workflow is required for basic GitHub Pages deployment from the `main` branch. A CI/CD workflow will be added in a later milestone to support cache purging and Cloudflare Pages sync.

---

## Validation Checklist

Run after every significant deployment:

- [ ] `index.html` renders correctly (fonts, colors, layout)
- [ ] Landing page keyboard navigation works (arrow keys, Enter, Esc)
- [ ] Locked card shake + tooltip behavior works
- [ ] "Enter System" navigates to `profile.html`
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
4. If Pages deployment failed, check for build errors in the Pages settings
5. If Pages is down, the site remains accessible via the secondary origin (Cloudflare Pages) once Milestone 6D is complete

---

### Deployment Not Reflecting Latest Changes

1. Confirm `git push` completed successfully with no errors
2. Wait 60–120 seconds — GitHub Pages deployments are not always instant
3. Hard refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) to bypass cache
4. Check deployment timestamp in Settings → Pages
5. If still stale, check for a queued or failed deployment in the Pages settings

---

### Custom Domain Not Resolving

This scenario applies after Cloudflare DNS is configured (Milestone 6A):

1. Confirm CNAME record exists in Cloudflare DNS pointing `ryanvalera.com` to `valeratech.github.io`
2. Confirm custom domain is set in GitHub Pages settings
3. Allow up to 24 hours for DNS propagation
4. Verify with `nslookup ryanvalera.com` or `dig ryanvalera.com`
5. Confirm HTTPS certificate has provisioned (GitHub Pages handles this automatically once DNS resolves)

---

## Related Documentation

- `docs/architecture.md` — Full platform architecture
- `docs/decisions/ADR-003.md` — Why GitHub Pages was selected as primary origin
- `docs/runbooks/origin-failure.md` — Response procedure for GitHub Pages outage
