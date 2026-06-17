# ryanvalera-com

Personal portfolio platform for Ryan Valera — Infrastructure Engineer specializing in Healthcare Imaging IT, Platform Operations, and Cloudflare Infrastructure.

GitHub: https://github.com/valeratech

This repository serves two purposes:

1. **The website itself** — a static, two-page portfolio site (`index.html` character select landing, `profile.html` professional dossier).
2. **A Cloudflare platform engineering demonstration** — the documentation in `docs/` describes the infrastructure, traffic engineering, security configuration, and operational runbooks built around this site.

The website is intentionally lightweight and stateless. The infrastructure supporting it — DNS, SSL/TLS, WAF, rate limiting, Cloudflare Load Balancing across GitHub Pages and Cloudflare Pages origins, CI/CD, and operational documentation — is the actual subject of the project.

## Site Structure

```text
index.html      → landing / character select screen
profile.html    → professional dossier page
assets/         → CSS, JS, images, fonts
docs/           → infrastructure documentation (architecture, runbooks, ADRs)
```

## Hosting

```text
Repository:      github.com/valeratech/ryanvalera-com
Dev URL:          valeratech.github.io/ryanvalera-com/
Production URL:   ryanvalera.com (via Cloudflare DNS, once configured)
```

The repository name is intentionally decoupled from the hosting mechanism. GitHub Pages, Cloudflare Pages, and the eventual custom domain are configured independently of this repo's name.

## Status

Site build in progress. Infrastructure phases tracked separately in `docs/`.

## Documentation

See `docs/architecture.md` for the full platform architecture once available.
