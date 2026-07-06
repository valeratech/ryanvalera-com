/* ═══════════════════════════════════════════════════════
   media.js — R2 Engineering Media Layer
   v2 Cloudflare Engineering Presentation Engine
═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const NAME_DELAY = 44;
    const FAST_DELAY = 4;
    const POST_NAME_PAUSE = 80;
    const PANEL_OPEN_MS = 380;
    const INTRO_TICK_DELAY = FAST_DELAY * 2;
    const INTRO_CHARS_PER_TICK = 9;

    const CLOUDFLARE_AUTHOR_INTRO = `Load balancers, APIs, and pipelines, oh my!

Yes, Tin Man, instead of wild animals lurking in the forest, the deepest corners of the Internet hide malicious actors typing 300 WPM, targeting entities from major enterprises to hobbyists just trying to share pictures of their beloved cats. Their infrastructure remains shrouded across the globe, ready to wreak havoc and trigger a "Hello, World!" (pardon the pun) of operational apocalypse, complete with deflating 500 errors.

Introducing Cloudflare! From a personal engineering standpoint, Cloudflare remains one of the most effective and personally enjoyable platforms available, adding layers of out-of-the-box security, many of which are available on the free plan, to help mitigate these threats. Furthermore, its UI and documentation feature one of the most intuitive layouts, in my opinion, providing a truly seamless administrative experience.

Ah yes, this project engineering space. This was initially meant to be two separate, important personal projects. First, a front-end portfolio website, in this case my beloved website, ryanvalera.com (no, not about cats), to showcase my work experience, skill sets, and technical projects. Second, to showcase my Cloudflare knowledge base from both production and personal experience.

Although both GitHub Pages and Cloudflare Pages are serverless, multi-tenant architectures that already provide some degree of redundancy, this architecture still implements Cloudflare Load Balancing, including steering policies and failover. This may be overkill for a static portfolio site, but it was a cheap and easy way to demonstrate Cloudflare Load Balancing with a two-origin architecture for a setup cost of about five bucks. During the planning phase, I felt these two projects were simply too closely related, from cache busting and API-driven cache purging all the way to the website content itself, which Cloudflare Pages hosts as the secondary origin.

Throughout the build, I implemented and validated a broad range of Cloudflare services, including DNS, CDN, SSL/TLS, Cache Rules, Cache Reserve strategies, Cache Purging via API, Load Balancing, Health Checks, Origin Steering Policies, WAF, Bot Fight Mode, Response Header Transform Rules, GitHub Actions CI/CD automation, Analytics, and Cloudflare Pages integration. The result is less about any single feature and more about how these services work together to create a cohesive, resilient platform.

As with all of my projects, documentation accompanies the implementation and serves as a knowledge base and future learning reference. I hope you enjoy exploring it as much as I enjoyed building and testing it!`;

    const PROJECTS = {
        cloudflare: {
            title: 'CLOUDFLARE PLATFORM',
            githubUrl: 'https://github.com/valeratech/ryanvalera-com',
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: CLOUDFLARE_AUTHOR_INTRO
        },
        orthanc: {
            title: 'ORTHANC + MIRTH CONNECT',
            githubUrl: 'https://github.com/valeratech/healthcare-imaging-lab',
            githubLabel: 'VIEW GITHUB REPOSITORY'
        },
        aws: {
            title: 'AWS RELIABILITY LAYER',
            githubUrl: 'https://github.com/valeratech',
            githubLabel: 'VIEW GITHUB PROFILE'
        },
        fastapi: {
            title: 'HEALTHCARE IMAGING DEVICE API',
            githubUrl: 'https://github.com/valeratech/healthcare-imaging-device-api',
            githubLabel: 'VIEW GITHUB REPOSITORY'
        },
        aivp: {
            title: 'AI ENGINEERING VALIDATION PLATFORM',
            githubUrl: 'https://github.com/valeratech',
            githubLabel: 'VIEW GITHUB PROFILE'
        }
    };

    const BADGE_TEXT = '[ PROJECT MEDIA PAGE ]';
    const SUB_TEXT = 'Media, previews, and insights behind the build';

    const AUTHOR_INTRO_PLACEHOLDER = 'Welcome to the early stages of this platform. This space will soon feature a formal introduction detailing the core motivations behind this project and the specific challenges it was built to solve. The goal is to provide a clear window into the engineering philosophy driving the architecture, moving beyond standard implementations to showcase a practical, production-ready environment.\n\nThe approach taken throughout this development focuses heavily on robust design patterns, automation, and modern infrastructure standards. Future updates will break down the design decisions made along the way—from streamlining deployment pipelines to implementing rigid security controls—offering a comprehensive look at how disparate technologies were integrated into a cohesive, scalable solution.\n\nUltimately, this project serves as both a live proof of concept and a continuous learning playground. Check back soon for a firsthand breakdown of the key takeaways, unexpected engineering hurdles, and practical insights gained from building and managing this environment from the ground up.';

    const PANEL_IDS = ['author-panel', 'preview-panel', 'videos-panel', 'links-panel'];
    const PANEL_STAGGER = 140;
    const RIGHT_COLUMN_OPEN_DONE_MS = (PANEL_STAGGER * (PANEL_IDS.length - 1)) + PANEL_OPEN_MS + 80;
    const FOOTER_ITEMS = [
        'footer-item-0', 'footer-div-0',
        'footer-item-1', 'footer-div-1',
        'footer-item-2', 'footer-div-2',
        'footer-item-3'
    ];
    const FOOTER_STAGGER = 120;

    function streamText(el, text, charDelay, onComplete, charsPerTick) {
        if (!el) return;
        const step = charsPerTick || 1;
        let index = 0;
        el.textContent = '';
        const timer = setInterval(() => {
            index += step;
            el.textContent = text.slice(0, index);
            if (index >= text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, charDelay);
    }

    function reserveIntroHeight(el, fullText) {
        if (!el) return;
        el.style.minHeight = '';
        el.textContent = fullText;
        const measured = el.scrollHeight;
        el.textContent = '';
        el.style.minHeight = measured + 'px';
        void el.offsetHeight;
    }

    function materializePanels() {
        PANEL_IDS.forEach((id, i) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.classList.add('panel-materialized');
            }, i * PANEL_STAGGER);
        });
    }

    function revealFooter() {
        const footerEl = document.getElementById('media-footer');
        if (footerEl) footerEl.classList.add('footer-visible');
        FOOTER_ITEMS.forEach((id, i) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.classList.add('item-visible');
            }, i * FOOTER_STAGGER);
        });
    }

    function initAutoplayToggle(onToggle) {
        const btn = document.getElementById('autoplay-toggle');
        const stateEl = document.getElementById('autoplay-state');
        const iconEl = document.getElementById('autoplay-icon');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOn = btn.getAttribute('aria-pressed') === 'true';
            const next = !isOn;
            btn.setAttribute('aria-pressed', String(next));
            if (stateEl) stateEl.textContent = next ? 'ON' : 'OFF';
            if (iconEl) iconEl.textContent = next ? '\u25B6' : '\u23F8';
            if (onToggle) onToggle(next);
        });
    }

    function hudMarkup(title, rows) {
        return '<aside class="cf-hud" aria-label="Slide metadata">' +
            '<div class="cf-hud-title">' + title + '</div>' +
            rows.map((row) => '<div class="cf-hud-row"><span>' + row[0] + '</span><span>' + row[1] + '</span></div>').join('') +
            '</aside>';
    }

    const CF_SCENES = [
        {
            title: '01 // GLOBAL PLATFORM',
            motion: 'zoom-in',
            hud: [['Status','Active'], ['Zone','ryanvalera.com'], ['DNS','Full'], ['Platform','Production']],
            body: `
                <div class="cf-artboard">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">Overview</div>
                            <h2 class="cf-artboard-title">ryanvalera.com</h2>
                            <p class="cf-artboard-subtitle">Production Cloudflare zone processing traffic through DNS, caching, analytics, and edge controls.</p>
                        </div>
                        <div class="cf-ui-pill"><span class="cf-ui-dot"></span> DNS Setup: Full</div>
                    </header>
                    <div class="cf-global-grid">
                        <section class="cf-ui-panel cf-global-main">
                            <div class="cf-ui-panel-title"><span>Operational Telemetry</span><span class="cf-ui-pill"><span class="cf-ui-dot"></span> Live</span></div>
                            <div class="cf-global-metrics">
                                <div class="cf-ui-metric"><span>Unique Visitors</span><strong>67</strong><div class="cf-line"></div></div>
                                <div class="cf-ui-metric"><span>Total Requests</span><strong>4.91k</strong><div class="cf-line"></div></div>
                                <div class="cf-ui-metric"><span>Percent Cached</span><strong>69.72%</strong><div class="cf-line"></div></div>
                                <div class="cf-ui-metric"><span>Data Cached</span><strong>45 MB</strong><div class="cf-line"></div></div>
                            </div>
                        </section>
                        <aside class="cf-ui-panel cf-edge-card">
                            <div class="cf-ui-panel-title">Platform State</div>
                            <div class="cf-edge-flow">
                                <div class="cf-edge-node">Visitor</div><div class="cf-edge-arrow">→</div><div class="cf-edge-node">Cloudflare Edge</div>
                            </div>
                            <div class="cf-global-status">
                                <div class="cf-ui-metric"><span>Zone</span><strong>ryanvalera.com</strong></div>
                                <div class="cf-ui-metric"><span>Plan</span><strong>Free</strong></div>
                                <div class="cf-ui-metric"><span>AI Bots</span><strong>Blocked</strong></div>
                                <div class="cf-ui-metric"><span>Mode</span><strong>Production</strong></div>
                            </div>
                        </aside>
                    </div>
                </div>`
        },
        {
            title: '02 // DNS ARCHITECTURE',
            motion: 'zoom-in',
            hud: [['Status','Active'], ['Records','2'], ['Proxy','Enabled'], ['Routing','Cloudflare']],
            body: `
                <div class="cf-artboard">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">DNS</div>
                            <h2 class="cf-artboard-title">DNS Architecture</h2>
                            <p class="cf-artboard-subtitle">Authoritative DNS routes production traffic through Cloudflare while preserving GitHub Pages and Cloudflare Pages origin targets.</p>
                        </div>
                        <div class="cf-ui-pill"><span class="cf-ui-dot"></span> DNS Setup: Full</div>
                    </header>
                    <div class="cf-dns-grid">
                        <article class="cf-ui-panel cf-dns-record">
                            <div class="cf-record-top"><span class="cf-record-type">CNAME</span><span class="cf-ui-pill"><span class="cf-ui-dot"></span> Proxied</span></div>
                            <div class="cf-record-name">pages.ryanvalera.com</div>
                            <div class="cf-record-target">ryanvalera-com.pages.dev</div>
                        </article>
                        <article class="cf-ui-panel cf-dns-record">
                            <div class="cf-record-top"><span class="cf-record-type">CNAME</span><span class="cf-ui-pill"><span class="cf-ui-dot"></span> Proxied</span></div>
                            <div class="cf-record-name">www.ryanvalera.com</div>
                            <div class="cf-record-target">valeratech.github.io</div>
                        </article>
                    </div>
                    <section class="cf-ui-panel cf-lb-strip">
                        <strong>Load Balancing and Spectrum Records</strong>
                        <span style="color:#52616f">LB → ryanvalera.com</span>
                        <span class="cf-ui-pill"><span class="cf-ui-dot"></span> Cloudflare Routing</span>
                    </section>
                </div>`
        },
        {
            title: '03 // CACHE GOVERNANCE',
            motion: 'zoom-in',
            hud: [['Status','Active'], ['Rules','2'], ['Edge Cache','Enabled'], ['Browser TTL','Managed']],
            body: `
                <div class="cf-artboard">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">Rules</div>
                            <h2 class="cf-artboard-title">Cache Governance</h2>
                            <p class="cf-artboard-subtitle">Production cache policies define how static assets and HTML documents are cached, revalidated, and served through the edge.</p>
                        </div>
                        <div class="cf-ui-pill"><span class="cf-ui-dot"></span> 2 active</div>
                    </header>
                    <div class="cf-cache-rules">
                        <article class="cf-ui-panel cf-rule-card">
                            <div class="cf-rule-name">Static Assets Cache</div>
                            <div class="cf-rule-section"><span>Match</span><strong>URI Path contains /assets/</strong></div>
                            <div class="cf-rule-section"><span>Action</span><div class="cf-action-list"><em>Browser TTL</em><em>Eligible for cache</em><em>Edge TTL</em></div></div>
                            <div class="cf-ui-pill"><span class="cf-ui-dot"></span> Active</div>
                        </article>
                        <article class="cf-ui-panel cf-rule-card">
                            <div class="cf-rule-name">HTML Revalidation</div>
                            <div class="cf-rule-section"><span>Match</span><strong>URI Path ends with .html, URI Path equals /</strong></div>
                            <div class="cf-rule-section"><span>Action</span><div class="cf-action-list"><em>Browser TTL</em><em>Eligible for cache</em><em>Edge TTL</em></div></div>
                            <div class="cf-ui-pill"><span class="cf-ui-dot"></span> Active</div>
                        </article>
                    </div>
                    <section class="cf-ui-panel cf-response-strip"><strong style="color:#111827">Cache Response Rules</strong> — No Cache Response Rules created.</section>
                </div>`
        },
        {
            title: '04 // LOAD BALANCER',
            motion: 'zoom-in',
            hud: [['Status','Healthy'], ['Pools','2'], ['Endpoints','2 / 2'], ['Steering','Proximity']],
            body: `
                <div class="cf-artboard">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">Traffic</div>
                            <h2 class="cf-artboard-title">Load Balancer</h2>
                            <p class="cf-artboard-subtitle">Production traffic is distributed across healthy origins with automatic failover and proximity steering.</p>
                        </div>
                        <div class="cf-ui-pill"><span class="cf-ui-dot"></span> Healthy</div>
                    </header>
                    <div class="cf-lb-grid">
                        <section class="cf-ui-panel cf-lb-summary">
                            <div class="cf-ui-panel-title"><span>Load Balancer Summary</span><span class="cf-ui-pill"><span class="cf-ui-dot"></span> Active</span></div>
                            <div class="cf-lb-metric-row">
                                <div class="cf-lb-metric"><span>Hostname</span><strong>ryanvalera.com</strong></div>
                                <div class="cf-lb-metric"><span>Available Pools</span><strong>2 of 2</strong></div>
                                <div class="cf-lb-metric"><span>Endpoints</span><strong>2 of 2</strong></div>
                            </div>
                        </section>
                        <section class="cf-routes">
                            <article class="cf-ui-panel cf-origin-card">
                                <div class="cf-origin-label"><strong>Primary Origin</strong><span class="cf-ui-pill"><span class="cf-ui-dot"></span> Healthy</span></div>
                                <div class="cf-origin-type">GitHub Pages</div>
                                <div class="cf-origin-target"><span>Endpoint</span><strong>valeratech.github.io</strong></div>
                            </article>
                            <article class="cf-ui-panel cf-origin-card">
                                <div class="cf-origin-label"><strong>Secondary Origin</strong><span class="cf-ui-pill"><span class="cf-ui-dot"></span> Healthy</span></div>
                                <div class="cf-origin-type">Cloudflare Pages</div>
                                <div class="cf-origin-target"><span>Endpoint</span><strong>pages.ryanvalera.com</strong></div>
                            </article>
                        </section>
                        <aside class="cf-ui-panel cf-path">
                            <div class="cf-ui-panel-title">Traffic Sequence</div>
                            <div style="color:#64748b;font-size:.7rem">Simplified request path through Cloudflare routing controls.</div>
                            <div class="cf-flow">
                                <div class="cf-flow-node"><strong>HTTP Request</strong><span>Visitor request enters Cloudflare</span></div><div class="cf-flow-arrow">↓</div>
                                <div class="cf-flow-node"><strong>Rules Layer</strong><span>WAF, cache, redirect, and header controls</span></div><div class="cf-flow-arrow">↓</div>
                                <div class="cf-flow-node highlight"><strong>Load Balancing</strong><span>Healthy pool selected using proximity steering</span></div><div class="cf-flow-arrow">↓</div>
                                <div class="cf-flow-node"><strong>Origin Server</strong><span>GitHub Pages or Cloudflare Pages</span></div>
                            </div>
                        </aside>
                    </div>
                </div>`
        },
        {
            title: '05 // CI/CD AUTOMATION',
            motion: 'zoom-in',
            hud: [['Status','Succeeded'], ['Workflow','GitHub Actions'], ['Purge','Completed'], ['Validation','Passed']],
            body: `
                <div class="cf-artboard github">
                    <header class="gh-header">
                        <div><div class="gh-back">← Purge Cloudflare Cache</div><h2 class="gh-title"><span class="gh-check">✓</span> Purge Cloudflare Cache #4</h2><div class="gh-meta">Workflow run completed successfully in 2s</div></div>
                        <div class="gh-status"><span class="gh-check">✓</span> Succeeded</div>
                    </header>
                    <div class="gh-grid">
                        <section class="gh-panel gh-workflow">
                            <div class="gh-workflow-title"><strong>Automation Pipeline</strong><span class="gh-badge">Succeeded</span></div>
                            <div class="gh-pipeline">
                                <div class="gh-step"><div class="gh-step-icon">✓</div><div><strong>Set up job</strong><span>Runner initialized and workflow prepared</span></div><div class="gh-duration">0s</div></div>
                                <div class="gh-step"><div class="gh-step-icon">✓</div><div><strong>Purge HTML documents from Cloudflare cache</strong><span>Cloudflare API request completed successfully</span></div><div class="gh-duration">0s</div></div>
                                <div class="gh-step"><div class="gh-step-icon">✓</div><div><strong>Confirm site responds after purge</strong><span>Post-purge site validation completed</span></div><div class="gh-duration">0s</div></div>
                                <div class="gh-step"><div class="gh-step-icon">✓</div><div><strong>Complete job</strong><span>Cleanup completed; no orphan processes</span></div><div class="gh-duration">0s</div></div>
                            </div>
                            <div class="cf-callout"><strong>Cloudflare Integration</strong><span>Cache invalidation is automated through GitHub Actions rather than performed manually through the dashboard.</span></div>
                        </section>
                        <section class="gh-panel gh-log-panel">
                            <div class="gh-log-head"><span>Run evidence</span><span class="gh-badge">Green run</span></div>
                            <div class="gh-log-body">
                                <div class="gh-log-line"><span>1</span><code>Current runner version: '2.335.1'</code></div>
                                <div class="gh-log-line"><span>2</span><code>Complete job name: purge</code></div>
                                <div class="gh-log-line"><span>3</span><code>Run response=$(curl -s -w "%{http_code}" -X POST ...)</code></div>
                                <div class="gh-log-line"><span>4</span><code>{ "success": true, "errors": [], "messages": [], "result": <span class="gh-masked">"***"</span> }</code></div>
                                <div class="gh-log-line"><span>5</span><code>site returned HTTP 403</code></div>
                                <div class="gh-log-line"><span>6</span><code class="gh-success">Purge succeeded; validation completed with expected protection behavior.</code></div>
                            </div>
                        </section>
                    </div>
                </div>`
        },
        {
            title: '06 // SECURITY LAYER',
            motion: 'zoom-in',
            hud: [['SSL/TLS','Full Strict'], ['WAF','Running'], ['Bots','Protected'], ['Edge','Secured']],
            body: `
                <div class="cf-artboard">
                    <header class="cf-artboard-header">
                        <div><div class="cf-artboard-eyebrow">Security</div><h2 class="cf-artboard-title">Security Layer</h2><p class="cf-artboard-subtitle">Edge encryption, application protection, and bot mitigation presented as a unified security posture.</p></div>
                        <div class="cf-ui-pill"><span class="cf-ui-dot"></span> Full (Strict)</div>
                    </header>
                    <div class="cf-security-grid">
                        <section class="cf-ui-panel cf-ssl-card">
                            <div class="cf-ui-panel-title">SSL/TLS Encryption</div>
                            <div class="cf-ssl-flow"><div class="cf-ssl-node">Browser</div><div class="cf-ssl-arrow">🔒 →</div><div class="cf-ssl-node">Cloudflare</div><div class="cf-ssl-arrow">🔒 →</div><div class="cf-ssl-node">Origin</div></div>
                            <div class="cf-security-metrics"><div><span>Mode</span><strong>Full (Strict)</strong></div><div><span>TLS 1.3</span><strong>Enabled</strong></div><div><span>Certificates</span><strong>Valid</strong></div></div>
                            <div class="cf-callout"><strong>Traffic Encryption</strong><span>Visitors and origin communications are protected with end-to-end TLS.</span></div>
                        </section>
                        <section class="cf-ui-panel cf-edge-list">
                            <div class="cf-ui-panel-title">Edge Protection</div>
                            <div class="cf-sec-item"><span>Web Application Firewall</span><span class="cf-state">Running</span></div>
                            <div class="cf-sec-item"><span>Bot Protection</span><span class="cf-state">Running</span></div>
                            <div class="cf-sec-item"><span>DDoS Protection</span><span class="cf-state">Running</span></div>
                            <div class="cf-sec-item"><span>Security Monitoring</span><span class="cf-state">Active</span></div>
                        </section>
                    </div>
                </div>`
        },
        {
            title: '07 // LIVE PLATFORM',
            motion: 'zoom-out',
            hud: [['Status','Production'], ['Hosting','Cloudflare'], ['Projects','5'], ['Result','Operational']],
            body: `
                <div class="cf-artboard portal">
                    <div class="cf-portal-top">
                        <div><div class="cf-return">← Return to Professional Profile</div><h2 class="cf-portal-title">Engineering Portal</h2><div class="cf-kicker">Featured Projects · Infrastructure · Healthcare Imaging</div></div>
                        <div class="cf-system">System Status <span>Operational</span></div>
                    </div>
                    <div class="cf-portal-grid">
                        <article class="cf-project-card feature">
                            <div class="cf-orbit"></div><div class="cf-brand"><span class="cf-cloud">☁</span> Cloudflare</div><div class="cf-github">GitHub Actions</div>
                            <div class="cf-icons"><div class="cf-icon">DNS</div><div class="cf-icon">LB</div><div class="cf-icon">R2</div><div class="cf-icon">WAF</div><div class="cf-icon">CI</div><div class="cf-icon">API</div><div class="cf-icon">OPS</div></div>
                            <p class="cf-desc">Cloudflare edge platform with global load balancing, DNS governance, cache strategy, security controls, and operational automation for ryanvalera.com.</p><span class="cf-cta">View Engineering ›</span>
                        </article>
                        <article class="cf-project-card"><div class="cf-mini-visual"></div><div class="cf-card-title">Orthanc + Mirth</div><p class="cf-card-sub">Healthcare imaging workflow with PACS, DICOM, HL7, and integration engineering.</p></article>
                        <article class="cf-project-card"><div class="cf-mini-visual"></div><div class="cf-card-title">AWS Reliability Layer</div><p class="cf-card-sub">Serverless monitoring and notification architecture for availability workflows.</p></article>
                        <article class="cf-project-card"><div class="cf-mini-visual"></div><div class="cf-card-title">FastAPI Inventory</div><p class="cf-card-sub">Healthcare imaging device API with lifecycle and maintenance tracking.</p></article>
                        <article class="cf-project-card"><div class="cf-mini-visual"></div><div class="cf-card-title">AI Validation Platform</div><p class="cf-card-sub">Multi-agent engineering review workflow for code, security, and documentation checks.</p></article>
                        <article class="cf-project-card cf-pending">Pending Initialization<br>/ Project Slot Reserved</article>
                    </div>
                    <div class="cf-portal-footer">System Select / Professional Dossier / Engineering Portal / Contact</div>
                </div>`
        }
    ];

    const CF_SCENE_INTERVAL_MS = 5200;

    function renderCloudflareScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    function glitchOverlayMarkup(sizeClass) {
        return '<div class="cf-glitch-fx ' + sizeClass + '">' +
            '<div class="cf-glitch-fx__tear cf-glitch-fx__tear--1"></div>' +
            '<div class="cf-glitch-fx__tear cf-glitch-fx__tear--2"></div>' +
            '<div class="cf-glitch-fx__tear cf-glitch-fx__tear--3"></div>' +
            '<div class="cf-glitch-fx__rgb cf-glitch-fx__rgb--r"></div>' +
            '<div class="cf-glitch-fx__rgb cf-glitch-fx__rgb--b"></div>' +
            '<div class="cf-glitch-fx__noise"></div>' +
            '</div>';
    }

    function bandOverlayMarkup(sizeClass) {
        return '<div class="cf-glitch-fx ' + sizeClass + '">' +
            '<div class="cf-glitch-fx__band"></div>' +
            '</div>';
    }

    function initCloudflarePreview(previewBodyEl) {
        if (!previewBodyEl) return null;

        previewBodyEl.classList.add('has-live-preview');
        previewBodyEl.innerHTML =
            '<div class="cf-preview-engine">' +
            CF_SCENES.map(renderCloudflareScene).join('') +
            glitchOverlayMarkup('cf-glitch-fx--major') +
            bandOverlayMarkup('cf-glitch-fx--minor') +
            '<div class="cf-engine-dots" role="tablist" aria-label="Preview scenes">' +
            CF_SCENES.map((scene, i) =>
                '<button type="button" class="cf-engine-dot' + (i === 0 ? ' is-active' : '') + '" data-scene="' + i + '" aria-label="Scene ' + (i + 1) + ': ' + scene.title + '"></button>'
            ).join('') +
            '</div>' +
            '</div>';

        // The notice must live OUTSIDE previewBodyEl: that element is
        // overflow:hidden with the scene engine absolutely positioned
        // inset:0 over it. Positioned descendants always paint above
        // static-flow content in the same stacking context regardless
        // of DOM order, so appending the note inside previewBodyEl (as
        // in the original bundle) rendered it invisible, hidden behind
        // the opaque scene layer. Inserting it as a caption right after
        // the whole .preview-window avoids the stacking context entirely.
        const windowEl = previewBodyEl.closest('.preview-window');
        if (windowEl && !windowEl.nextElementSibling?.classList.contains('cf-engineering-note')) {
            windowEl.insertAdjacentHTML('afterend',
                '<p class="cf-engineering-note"><strong>\u24d8 Engineering Presentation</strong> — Preview scenes may be cropped, rearranged, or enhanced for clarity while preserving authentic engineering evidence. The "KEY VIDEO WALKTHROUGHS" section contains the original interface and actual configurations.</p>');
        }

        const sceneEls = Array.from(previewBodyEl.querySelectorAll('.cf-engine-scene'));
        const dotEls = Array.from(previewBodyEl.querySelectorAll('.cf-engine-dot'));
        let sceneIndex = 0;
        let timer = null;

        function replayMotion(sceneEl) {
            if (reducedMotion || !sceneEl) return;
            const inner = sceneEl.querySelector('.cf-engine-inner');
            if (!inner) return;
            const name = sceneEl.dataset.motion === 'zoom-out' ? 'cf-engine-zoomout' : 'cf-engine-kenburns';
            // Duration is tied directly to CF_SCENE_INTERVAL_MS rather than
            // a second hardcoded number, so the zoom can't finish early and
            // sit frozen before the next transition fires (or drift out of
            // sync with the interval the way focalPoint/frameAlign did).
            inner.style.animation = 'none';
            void inner.offsetHeight;
            inner.style.animation = name + ' ' + CF_SCENE_INTERVAL_MS + 'ms ease-out forwards';
        }

        function showScene(index) {
            sceneEls[sceneIndex].classList.remove('is-visible');
            dotEls[sceneIndex].classList.remove('is-active');
            sceneIndex = (index + sceneEls.length) % sceneEls.length;
            sceneEls[sceneIndex].classList.add('is-visible');
            dotEls[sceneIndex].classList.add('is-active');
            replayMotion(sceneEls[sceneIndex]);
        }

        function advance() {
            showScene(sceneIndex + 1);
        }

        function stopCycle() {
            if (timer) clearInterval(timer);
            timer = null;
        }

        function startCycle() {
            stopCycle();
            if (reducedMotion) return;
            timer = setInterval(advance, CF_SCENE_INTERVAL_MS);
        }

        dotEls.forEach((dot) => {
            dot.addEventListener('click', () => {
                showScene(Number(dot.dataset.scene));
                if (timer) startCycle();
            });
        });

        replayMotion(sceneEls[0]);
        startCycle();

        // ── Signal Acquisition Sequence ────────────────
        // Two total effects, both locked: "Major" fires once, at a fixed
        // point, after the right column's full panel materialize sequence
        // completes — do not change its timing or visuals. "Minor" reuses
        // the simple sweep band and fires repeatedly — once every random
        // 6-12s gap — for as long as autoplay is on.
        const majorFxEl = previewBodyEl.querySelector('.cf-glitch-fx--major');
        const minorFxEl = previewBodyEl.querySelector('.cf-glitch-fx--minor');
        const GLITCH_DURATION_MS = 650;
        const MINOR_DURATION_MS = 3600;
        let bootGlitchFired = false;
        let minorLoopTimer = null;

        function fireGlitch(el, duration) {
            if (!el || reducedMotion) return;
            const dur = duration || GLITCH_DURATION_MS;
            el.classList.remove('is-active');
            void el.offsetHeight;
            el.classList.add('is-active');
            setTimeout(() => el.classList.remove('is-active'), dur);
        }

        function armMinorGlitch() {
            const randomDelay = 6000 + Math.random() * 6000;
            minorLoopTimer = setTimeout(() => {
                fireGlitch(minorFxEl, MINOR_DURATION_MS);
                armMinorGlitch();
            }, randomDelay);
        }

        function startMinorLoop() {
            stopMinorLoop();
            if (reducedMotion) return;
            armMinorGlitch();
        }

        function stopMinorLoop() {
            if (minorLoopTimer) clearTimeout(minorLoopTimer);
            minorLoopTimer = null;
        }

        function fireBootInterference() {
            if (bootGlitchFired || reducedMotion) return;
            bootGlitchFired = true;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fireGlitch(majorFxEl);
                    startMinorLoop();
                });
            });
        }

        return {
            start: startCycle,
            stop: stopCycle,
            fireBootInterference: fireBootInterference,
            startMinorLoop: startMinorLoop,
            stopMinorLoop: stopMinorLoop
        };
    }

    function getProjectSlug() {
        const params = new URLSearchParams(window.location.search);
        return params.get('project');
    }

    window.addEventListener('DOMContentLoaded', () => {
        const slug = getProjectSlug();
        const project = PROJECTS[slug];

        const titleEl = document.getElementById('media-title');
        const badgeEl = document.getElementById('media-badge');
        const subEl = document.getElementById('media-sub');
        const introEl = document.getElementById('author-intro-text');
        const githubLink = document.getElementById('link-github');
        const githubLabelEl = document.getElementById('link-github-label');
        const previewTitleEl = document.getElementById('preview-window-title');
        const previewBodyEl = document.querySelector('#preview-panel .preview-window-body');
        let cfPreviewController = null;

        if (!project) {
            if (titleEl) titleEl.textContent = 'PROJECT NOT FOUND';
            if (badgeEl) badgeEl.textContent = BADGE_TEXT;
            if (subEl) subEl.textContent = SUB_TEXT;
            if (introEl) introEl.textContent = 'This project media page could not be found. Return to the Engineering Portal to select a project.';
            if (githubLink) githubLink.style.display = 'none';
            materializePanels();
            revealFooter();
            initAutoplayToggle();
            return;
        }

        document.title = 'Ryan Valera — ' + project.title + ' Media';

        const authorIntroText = project.authorIntro || AUTHOR_INTRO_PLACEHOLDER;

        if (githubLink) githubLink.href = project.githubUrl;
        if (githubLabelEl) githubLabelEl.textContent = project.githubLabel;
        if (previewTitleEl) previewTitleEl.textContent = project.title;

        if (slug === 'cloudflare') {
            cfPreviewController = initCloudflarePreview(previewBodyEl);
        }

        function handleAutoplayToggle(isOn) {
            if (!cfPreviewController) return;
            if (isOn) {
                cfPreviewController.start();
                if (cfPreviewController.startMinorLoop) cfPreviewController.startMinorLoop();
            } else {
                cfPreviewController.stop();
                if (cfPreviewController.stopMinorLoop) cfPreviewController.stopMinorLoop();
            }
        }

        if (reducedMotion) {
            if (titleEl) titleEl.textContent = project.title;
            if (badgeEl) badgeEl.textContent = BADGE_TEXT;
            if (subEl) subEl.textContent = SUB_TEXT;
            if (introEl) introEl.textContent = authorIntroText;
            materializePanels();
            revealFooter();
            initAutoplayToggle(handleAutoplayToggle);
            return;
        }

        streamText(titleEl, project.title, NAME_DELAY, () => {
            setTimeout(() => {
                streamText(badgeEl, BADGE_TEXT, FAST_DELAY);
                streamText(subEl, SUB_TEXT, FAST_DELAY, () => {
                    setTimeout(() => {
                        reserveIntroHeight(introEl, authorIntroText);
                        materializePanels();
                        if (cfPreviewController && cfPreviewController.fireBootInterference) {
                            setTimeout(() => {
                                cfPreviewController.fireBootInterference();
                            }, RIGHT_COLUMN_OPEN_DONE_MS);
                        }
                        setTimeout(() => {
                            streamText(introEl, authorIntroText, INTRO_TICK_DELAY, null, INTRO_CHARS_PER_TICK);
                        }, PANEL_OPEN_MS);
                        setTimeout(revealFooter, PANEL_IDS.length * PANEL_STAGGER + 300);
                    }, 120);
                });
            }, POST_NAME_PAUSE);
        });

        initAutoplayToggle(handleAutoplayToggle);
    });
})();
