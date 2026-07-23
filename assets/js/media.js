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
    const STATUS_LABEL_DELAY = 77; // ms/char — matches profile dossier status stream
    const STATUS_POST_PAUSE  = 80; // ms pause before dot + value fade in

    const CLOUDFLARE_AUTHOR_INTRO = `Load balancers, APIs, and pipelines, oh my!

Yes, Tin Man, instead of wild animals lurking in the forest, the deepest corners of the Internet hide malicious actors typing 300 WPM, targeting entities from major enterprises to hobbyists just trying to share pictures of their beloved cats. Their infrastructure remains shrouded across the globe, ready to wreak havoc and trigger a "Hello, World!" (pardon the pun) of operational apocalypse, complete with deflating 500 errors.

Introducing Cloudflare! From a personal engineering standpoint, Cloudflare remains one of the most effective and personally enjoyable platforms available, adding layers of out-of-the-box security, many of which are available on the free plan, to help mitigate these threats. Furthermore, its UI and documentation feature one of the most intuitive layouts, in my opinion, providing a truly seamless administrative experience.

Ah yes, this project engineering space. This was initially meant to be two separate, important personal projects. First, a front-end portfolio website, in this case my beloved website, ryanvalera.com (no, not about cats), to showcase my work experience, skill sets, and technical projects. Second, to showcase my Cloudflare knowledge base from both production and personal experience.

Although both GitHub Pages and Cloudflare Pages are serverless, multi-tenant architectures that already provide some degree of redundancy, this architecture still implements Cloudflare Load Balancing, including steering policies and failover. This may be overkill for a static portfolio site, but it was a cheap and easy way to demonstrate Cloudflare Load Balancing with a two-origin architecture for a setup cost of about five bucks. During the planning phase, I felt these two projects were simply too closely related, from cache busting and API-driven cache purging all the way to the website content itself, which Cloudflare Pages hosts as the secondary origin.

Throughout the build, I implemented and validated a broad range of Cloudflare services, including DNS, CDN, SSL/TLS, Cache Rules, Cache Reserve strategies, Cache Purging via API, Load Balancing, Health Checks, Origin Steering Policies, WAF, Bot Fight Mode, Response Header Transform Rules, GitHub Actions CI/CD automation, Analytics, and Cloudflare Pages integration. The result is less about any single feature and more about how these services work together to create a cohesive, resilient platform.

As with all of my projects, documentation accompanies the implementation and serves as a knowledge base and future learning reference. I hope you enjoy exploring it as much as I enjoyed building and testing it!`;

    const ORTHANC_AUTHOR_INTRO = `During my career, I've administered plenty of Application Layer 7 protocols traversing between endpoints. Whether it's analyzing HTTP request logs, tracing SMTP EHLO handshakes and DMARC failures, or auditing SSH key exchanges, none have earned my respect quite like DICOM. Having a networking and infrastructure background, I naturally gravitated toward the protocol side of the standard. Association negotiation, presentation contexts, transfer syntaxes, and the client/server relationship between SCUs and SCPs felt immediately familiar, right before DICOM politely reminded me that I had only scratched the surface: the sheer number of info panels I've added to my personal DICOM Confluence page is a testament to that.

In terms of raw metadata, structure, and domain-specific design, it operates on an entirely different level; some of those headers contain more metadata than a tax return, yet they remain remarkably well organized. Pair DICOM with HL7, and you begin to see how patient registration, orders, modality worklists, image acquisition, storage, reporting, and interoperability come together to form a complete healthcare imaging workflow.

What keeps me invested is the discipline this standard demands from its infrastructure. Imaging environments depend on absolute data integrity; from accession numbers to metadata modules, even a minor timestamp discrepancy can halt a study. That makes the back-end architecture a first-class engineering concern rather than plumbing, and it is exactly the kind of constraint that makes a platform worth building carefully.

This Engineering space focuses on building a realistic healthcare imaging environment from the infrastructure outward, starting with a two-node Orthanc architecture. Deploying a production-style PACS platform on VMware Workstation to replicate a live datacenter environment, while validating associations, analyzing packet captures, and integrating PostgreSQL, has become part of my daily routine as I build practical experience across the DICOM standard, imaging workflows, and interoperability. The goal isn't just to run Orthanc; it's to understand how each layer works together before expanding into Modality Worklists and HL7 integration through Mirth Connect. The more time I spend with it, the more respect I have for the engineering that went into designing a standard that has remained the foundation of medical imaging for decades.

To conclude, I hope it saves another engineer hours of digging through the standard, minimizes configuration troubleshooting, and ultimately convinces you that DICOM is an incredibly fascinating engineering achievement.`;

    const AWS_AUTHOR_INTRO = `What could be more important than having your application monitor itself? Having someone else monitor it.

That's exactly what this project is about. While the production platform already provides excellent monitoring and alerting capabilities, this AWS serverless environment serves as an independent reliability layer for ryanvalera.com, continuously validating DNS, DNSSEC, TLS certificates, deployments, and overall site health from the outside looking in. Yes... my own website gets audited too. Trust... but verify.

Building this project has also been a great excuse to spend more time with AWS's serverless ecosystem. By combining Lambda, EventBridge, CloudWatch, SNS, S3, IAM, and AWS Budgets, the goal is to create a lightweight operational platform that focuses on observability, automation, and reliability without becoming an operational burden itself.

Moving on to the objective of this engineering space, this project is focused on building an independent operational layer around a live production platform. That includes scheduled health checks, deployment validation, structured alerting, incident documentation, historical event tracking, and cloud cost governance. The production website continues to do what it does best, while AWS quietly stands off to the side asking, "Can you hear me now?"

One of the primary design goals from the beginning was keeping operational costs almost invisible. Everything is built around managed serverless services, event-driven execution, and least-privilege access, allowing the platform to remain inexpensive while still demonstrating modern reliability engineering practices. It's proof that useful operational tooling doesn't require a fleet of EC2 instances or a surprise bill at the end of the month.

Like the rest of my projects, this environment will continue to evolve as additional automation, monitoring scenarios, and operational workflows are added. Every decision, runbook, and architectural change will be documented along the way because good engineering is only half the job. Being able to explain, reproduce, and improve it is the other half.`;

    const AIVP_AUTHOR_INTRO = `Looks like you beat me to the first commit. I'm still bootstrapping this repository and putting the architecture through its paces. Documentation, screenshots, and configuration notes will start appearing as the project comes to life. Until then, I'm busy arguing with an "AI Engineering Validation Platform" about whether my folder structure deserves an 87 or an 88.
    
Unlike my other Author Introductions (and yes, I genuinely wrote all of them, with only a little editorial help from entities that shall remain nameless), this one was actually brokered by GPT-5.5 and Claude Sonnet 5 using, well, exactly the logic this project runs on. If that sounds like a Catch-22, that's because it absolutely is.

Ryan Valera is an Infrastructure and Security Engineer with a background in Linux platforms, automation, enterprise networking, and defensive engineering. As projects became larger and technical design reviews increasingly involved multiple AI models, manually bouncing architecture, documentation, and implementation ideas between them quickly became more tedious than useful. Eventually the obvious question became, "Why am I doing this by hand?" That question ultimately became IT Forge.

IT Forge is an AI engineering validation platform that generates technical artifacts through a structured build, validate, revise, and converge workflow. Claude Haiku 4.5 currently serves as the Builder while GPT-4.1 mini occupies the Reviewer chair, iterating until both agree the artifact is ready for production or the configured round limit politely ends the debate.

The reviewer lineup is intentionally modular. Gemini 3.1 Pro is already being considered for a future seat at the table because two opinions are useful and three create a proper architecture review committee. As for Grok, it was considered briefly, about as long as checking your work email on a Sunday before deciding that maybe tomorrow is fine.

When he's not refereeing AI model disagreements, Ryan is usually building security laboratories, engineering cloud infrastructure, documenting platform architectures, or explaining why the configuration is almost always the real culprit.`;

    const FASTAPI_AUTHOR_INTRO = `Coming to the engineering ring, weighing in at millions of lines of community code... the undisputed heavyweight champion of automation... Python!

Long before the LLM revolution, nothing helped me automate repetitive tasks quite like Python. Whether it was processing files, building DNS tooling, or "automating the boring stuff" (wink wink), it quickly became one of my favorite languages for turning an idea into a working solution.

One of the things Python helped me appreciate was what actually happens behind an API. APIs are everywhere (The Force...), quietly moving data between applications, always there even if you don't immediately see them. Building with FastAPI was a great opportunity to get hands-on with the software engineering behind those interactions while learning modern API design, backend architecture, and the technologies that power so many of the applications we use every day.

Rather than building another generic CRUD application, I wanted this project to solve a realistic healthcare problem. The API models healthcare imaging modalities, equipment, and the operational relationships surrounding them, including vendors, maintenance records, and equipment lifecycle management. It became an enjoyable way to combine Python engineering with my growing interest in healthcare imaging, interoperability, and infrastructure design.

This project also introduced me to a different style of software engineering. Infrastructure engineering often revolves around servers, networking, and operational tooling. Backend engineering shifts that focus toward clean architecture, data modeling, API design, validation, testing, and maintainable code. Working between those two worlds has been both challenging and incredibly rewarding.

This also brings me to my coding style throughout the project. Much of the overall structure and development philosophy was inspired by Eric Roby's excellent FastAPI course. While parts of the course have naturally evolved alongside the Python ecosystem, I made a conscious effort to adopt current best practices, replace deprecated approaches where appropriate, and understand why those changes were made instead of simply copying code.

Like all of my engineering projects, documentation grows alongside the implementation. Every architectural decision, API resource, and design choice is documented as the project evolves. My goal isn't simply to build a working API. It's to build one that's well documented, maintainable, and something another engineer could confidently pick up, understand, and extend.`;

    const FILETRIAGE_AUTHOR_INTRO = `You caught this one mid-build. The repository is being bootstrapped right now, and the engineering documentation will land alongside the first working endpoints.
    
Here's what's taking shape: a metadata-only file triage and orchestration API. Files are submitted, fingerprinted through a streaming SHA-256 intake (large uploads never get buffered whole in memory), and deduplicated by hash with submission counts tracked per sample. Analyses walk a strictly enforced state machine — Queued to Running to Complete or Failed, with every illegal transition rejected — behind a 202-and-poll lifecycle, and verdicts stay locked behind a 409 until the analysis actually finishes. FastAPI, SQLAlchemy 2.x, Pydantic v2, SQLite, and a pytest suite that tests the state machine as a pure function, no HTTP required.

The design goal is simple: prove the orchestration patterns that real triage pipelines rely on — idempotent intake, dedupe, lifecycle state, and gated results — in a codebase small enough to read in one sitting. No payloads are stored, which means the most dangerous thing in this repository is my commit message grammar.

Check back soon; the architecture document and the first case studies are next in the queue.`;

    const CYBER_AUTHOR_INTRO = `Every alert tells a story. The real work is figuring out what actually happened before that story turns into an absolute disaster.

This portfolio is where I document that process. It is a growing collection of hands-on blue-team investigations completed across CyberDefenders, Hack The Box, SANS CyberRange, and Security Blue Team labs. The focus here is on DFIR, SIEM-based threat hunting, and deep-dives into memory, disk, and network forensics. Each case follows a structured workflow built around clear objectives, meticulous evidence collection, detection logic, and a timeline that actually holds up under scrutiny.

The methodology is deliberately repeatable. I triage the artifacts, build and refine detection logic using Splunk SPL, KQL in Microsoft Sentinel and Defender XDR, Sigma, Zeek, and Suricata, correlate events between sources, and reconstruct the attacker's path from initial access to exfiltration. Every finding is mapped to MITRE ATT&CK and anchored to concrete evidence, because "the logs looked weird" has never held up in a technical write-up.

Coming from an infrastructure, DNS, and email-security background, I approach these cases the way I approach systems. Once you understand how the pieces are supposed to fit together, the anomalies tend to announce themselves.

Every dataset here is lab-generated or fully sanitized, meaning no real victims were harmed and no actual ransom notes were paid in the making of this portfolio. If these write-ups save someone else a few hours of squinting at a packet capture, or prove that incident response is equal parts detective work and stubborn patience, then they've done their job.`;

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
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: ORTHANC_AUTHOR_INTRO
        },
        aws: {
            title: 'AWS RELIABILITY LAYER',
            githubUrl: 'https://github.com/valeratech',
            githubLabel: 'VIEW GITHUB PROFILE',
            authorIntro: AWS_AUTHOR_INTRO
        },
        fastapi: {
            title: 'FILE TRIAGE ORCHESTRATION API',
            githubUrl: 'https://github.com/valeratech',
            githubLabel: 'VIEW GITHUB PROFILE',
            authorIntro: FILETRIAGE_AUTHOR_INTRO
        },
        aivp: {
            title: 'AI ENGINEERING VALIDATION PLATFORM',
            githubUrl: 'https://github.com/valeratech',
            githubLabel: 'VIEW GITHUB PROFILE',
            authorIntro: AIVP_AUTHOR_INTRO
        },
        cyber: {
            title: 'CYBERSECURITY INVESTIGATIONS',
            githubUrl: 'https://github.com/valeratech/cybersecurity-investigations-portfolio',
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: CYBER_AUTHOR_INTRO
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

    /* ── System Status materialize ──────────────────── */
    function materializeSystemStatus() {
        const statusEl = document.getElementById('system-status');
        if (!statusEl) return;
        const labelEl = statusEl.querySelector('.status-label');
        const dotEl   = statusEl.querySelector('.status-dot');
        const valueEl = statusEl.querySelector('.status-value');
        statusEl.classList.add('status-label-done');
        if (labelEl) labelEl.textContent = '';
        streamText(labelEl, 'System Status', STATUS_LABEL_DELAY, () => {
            setTimeout(() => {
                if (dotEl) dotEl.classList.add('visible');
                if (valueEl) valueEl.classList.add('visible');
                // Border draw fires after the dot/value fade-in completes
                setTimeout(() => {
                    statusEl.classList.add('border-draw');
                }, 2400);
            }, STATUS_POST_PAUSE);
        });
    }

    function showSystemStatusInstant() {
        const statusEl = document.getElementById('system-status');
        if (!statusEl) return;
        const labelEl = statusEl.querySelector('.status-label');
        if (labelEl) labelEl.textContent = 'System Status';
        statusEl.classList.add('status-label-done');
        statusEl.classList.add('border-draw');
        const dotEl   = statusEl.querySelector('.status-dot');
        const valueEl = statusEl.querySelector('.status-value');
        if (dotEl) dotEl.classList.add('visible');
        if (valueEl) valueEl.classList.add('visible');
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

    // ── Orthanc + Mirth Connect scenes ────────────────────
    // Phase 1: Slides 1-4 (Virtual Imaging Lab, Platform Services, Orthanc
    // Explorer, REST API). Remaining slides land in later project phases.
    // Artboard classes are "or-" prefixed so they can never collide with
    // Cloudflare's "cf-" artboards or a future project's artboards sharing
    // this same engine — the engine shell itself (cf-engine-scene,
    // cf-engine-inner, cf-hud, cf-glitch-fx, etc.) is intentionally NOT
    // reprefixed per project, since it's the one truly shared system.
    const ORTHANC_SCENE_INTERVAL_MS = 5200;

    function renderOrthancScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    const ORTHANC_SCENES = [
        {
            title: '01 // VIRTUAL IMAGING LAB',
            motion: 'zoom-in',
            hud: [['Status','Phase 1'],['Platform','VMware'],['Nodes','2'],['Network','Segmented']],
            body: `
<div class="or-vm-art"><div class="or-vm-top"><strong>VMware Workstation Pro · Healthcare Imaging Lab</strong><span>Phase 1 status: <span class="or-complete">Core DICOM Infrastructure Complete</span></span></div><div class="or-vm-stage"><section class="or-vm-node"><div class="or-node-title"><span class="or-stack-icon"></span><span>orthanc-primary</span></div><div class="or-vm-action"><span class="or-play"></span>Power on this virtual machine</div><div class="or-vm-action"><span class="or-gear"></span>Edit virtual machine settings</div><div class="or-vm-section"><div class="or-section-head"><span class="or-chev"></span>Devices</div><div class="or-device-table"><span class="or-devico"></span><span>Memory</span><strong>4 GB</strong><span class="or-devico or-cpu"></span><span>Processors</span><strong>2</strong><span class="or-devico or-disk"></span><span>Hard Disk (SCSI)</span><strong>40 GB</strong><span class="or-devico"></span><span>CD/DVD (SATA)</span><strong>Using file</strong><span class="or-devico or-net"></span><span>Network Adapter</span><strong>NAT</strong><span class="or-devico or-net"></span><span>Network Adapter 2</span><strong>Custom (VMnet2)</strong></div></div><div class="or-vm-section"><div class="or-section-head"><span class="or-chev"></span>Description</div><div class="or-desc-text"><p>Primary Orthanc DICOM server for the Healthcare Imaging Lab.</p><p><b>Role:</b></p><ul><li>Primary PACS archive</li><li>DICOM Storage SCP</li><li>REST API endpoint</li><li>PostgreSQL index backend</li></ul><p><b>Environment:</b><br>Ubuntu 24.04.4 LTS<br>Orthanc 1.12.2<br>AE Title: ORTHANC-PRIMARY<br>DICOM: 4242 · REST API: 8042</p></div></div></section><aside class="or-vm-center"><div class="or-center-label">Segmented virtual networks</div><div class="or-net-line"></div><div class="or-net-card"><small>Management</small><strong>VMnet8</strong><span>NAT administration path</span></div><div class="or-net-card"><small>PACS Segment</small><strong>VMnet2</strong><span>Isolated DICOM network</span></div><div class="or-net-line"></div></aside><section class="or-vm-node"><div class="or-node-title"><span class="or-stack-icon"></span><span>orthanc-secondary</span></div><div class="or-vm-action"><span class="or-play"></span>Power on this virtual machine</div><div class="or-vm-action"><span class="or-gear"></span>Edit virtual machine settings</div><div class="or-vm-section"><div class="or-section-head"><span class="or-chev"></span>Devices</div><div class="or-device-table"><span class="or-devico"></span><span>Memory</span><strong>4 GB</strong><span class="or-devico or-cpu"></span><span>Processors</span><strong>2</strong><span class="or-devico or-disk"></span><span>Hard Disk (SCSI)</span><strong>40 GB</strong><span class="or-devico"></span><span>CD/DVD (SATA)</span><strong>Using file</strong><span class="or-devico or-net"></span><span>Network Adapter</span><strong>Custom (VMnet8)</strong><span class="or-devico or-net"></span><span>Network Adapter 2</span><strong>Custom (VMnet2)</strong></div></div><div class="or-vm-section"><div class="or-section-head"><span class="or-chev"></span>Description</div><div class="or-desc-text"><p>Secondary Orthanc DICOM server for the Healthcare Imaging Lab.</p><p><b>Role:</b></p><ul><li>Secondary PACS archive</li><li>Peer archive</li><li>DICOM Storage SCP</li><li>REST API endpoint</li></ul><p><b>Environment:</b><br>Ubuntu 24.04.4 LTS<br>Orthanc 1.12.2<br>AE Title: ORTHANC-SCNDRY<br>Display: ORTHANC-SECONDARY</p></div></div></section></div></div>
            `
        },
        {
            title: '02 // PLATFORM SERVICES',
            motion: 'zoom-in',
            hud: [['Status','Running'],['Host','Ubuntu'],['Service','Orthanc'],['Init','systemd']],
            body: `
<div class="or-term-art"><section class="or-term-window"><div class="or-term-title"><div class="or-term-plus"></div><div class="or-term-title-text">valeratech@orthanc-primary: ~ — ssh valeratech@192.168.175.128</div><div class="or-term-icons"><span>▢</span><span>☰</span><span>×</span></div></div><div class="or-term-body"><span class="or-prompt">valeratech@orthanc-primary</span>:~$ sudo systemctl status orthanc\n● orthanc.service - Orthanc DICOM server\n     Loaded: loaded (/usr/lib/systemd/system/orthanc.service; <span class="or-green">enabled</span>; preset: enabled)\n     Active: <span class="or-green">active (running)</span> since Tue 2026-07-07 20:18:42 PDT; 14min ago\n       Docs: https://orthanc.uclouvain.be/book/\n   Main PID: 703 (Orthanc)\n      Tasks: 18 (limit: 4558)\n     Memory: 92.4M\n        CPU: 2.1s\n     CGroup: /system.slice/orthanc.service\n             └─703 /usr/sbin/Orthanc --logdir=/var/log/orthanc /etc/orthanc\n\nJul 07 orthanc-primary Orthanc[703]: HTTP server listening on port: 8042\nJul 07 orthanc-primary Orthanc[703]: DICOM server listening on port: 4242\nJul 07 orthanc-primary Orthanc[703]: PostgreSQL index plugin initialized</div></section></div>
            `
        },
        {
            title: '03 // ORTHANC EXPLORER',
            motion: 'zoom-in',
            hud: [['Status','Reachable'],['Node','Primary'],['Query','Prepared'],['Data','Placeholder']],
            body: `
<div class="or-explorer-art"><section class="or-explorer-page"><div class="or-logo-area"><div class="or-logo">ORT<span class="or-h">H</span>ANC</div></div><div class="or-form"><div class="or-label">Patient ID:</div><div class="or-input or-empty">&nbsp;</div><div class="or-label">Patient Name:</div><div class="or-input or-empty">&nbsp;</div><div class="or-label">Accession Number:</div><div class="or-input or-empty">&nbsp;</div><div class="or-label">Study Description:</div><div class="or-input">CT CHEST</div><div class="or-label">Labels:</div><div class="or-input">PHASE-2 PREVIEW</div><div class="or-label">Study Date:</div><div class="or-input or-date">Any date</div></div><div class="or-button-row"><div class="or-btn or-blue">All patients</div><div class="or-btn or-blue">All studies</div><div class="or-btn or-yellow">Do lookup</div></div></section></div>
            `
        },
        {
            title: '04 // REST API',
            motion: 'zoom-in',
            hud: [['Endpoint','/system'],['Status','Available'],['Backend','PostgreSQL'],['Data','No PHI']],
            body: `
<div class="or-api-art"><div class="or-browser-bar"><div>← → ↻</div><div class="or-address">🛡 http://192.168.175.128:8042/system</div><div class="or-zoom">90% ☆ ☰</div></div><div class="or-tabs"><div class="or-tab or-active">JSON</div><div>Raw Data</div><div>Headers</div></div><div class="or-tools">Save&nbsp;&nbsp; Copy&nbsp;&nbsp; Collapse All&nbsp;&nbsp; Expand All&nbsp;&nbsp; ◇ Filter JSON</div><section class="or-json-view"><div class="or-row"><span class="or-key">ApiVersion:</span><span class="or-value or-green">22</span></div><div class="or-row"><span class="or-key">CheckRevisions:</span><span class="or-value or-green">false</span></div><div class="or-row"><span class="or-key">DatabaseBackendPlugin:</span><span class="or-value or-pink">"/usr/lib/orthanc/libOrthancPostgreSQLIndex.so.5.0"</span></div><div class="or-row"><span class="or-key">DatabaseServerIdentifier:</span><span class="or-value or-gray"><span class="or-redact">REDACTED</span></span></div><div class="or-row"><span class="or-key">DatabaseVersion:</span><span class="or-value or-green">6</span></div><div class="or-row"><span class="or-key">DicomAet:</span><span class="or-value or-pink">"ORTHANC-PRIMARY"</span></div><div class="or-row"><span class="or-key">DicomPort:</span><span class="or-value or-green">4242</span></div><div class="or-row"><span class="or-key">HasLabels:</span><span class="or-value or-green">true</span></div><div class="or-row"><span class="or-key">HttpPort:</span><span class="or-value or-green">8042</span></div><div class="or-row"><span class="or-key">IngestTranscoding:</span><span class="or-value or-pink">""</span></div><div class="or-row"><span class="or-key">IsHttpServerSecure:</span><span class="or-value or-green">true</span></div><div class="or-row"><span class="or-key">MainDicomTags:</span><span></span></div><div class="or-nested"><div class="or-row"><span class="or-key">Instance:</span><span class="or-value or-pink">"0008,0012;0008,0013;0008,0018;0020,0012..."</span></div><div class="or-row"><span class="or-key">Patient:</span><span class="or-value or-pink">"0010,0010;0010,0020;0010,0030;0010,0040"</span></div><div class="or-row"><span class="or-key">Series:</span><span class="or-value or-pink">"0008,0021;0008,0031;0008,0060;0020,000e..."</span></div><div class="or-row"><span class="or-key">Study:</span><span class="or-value or-pink">"0008,0020;0008,0030;0008,0050;0008,1030..."</span></div></div><div class="or-row"><span class="or-key">MaximumStorageMode:</span><span class="or-value or-pink">"Recycle"</span></div><div class="or-row"><span class="or-key">Name:</span><span class="or-value or-pink">"ORTHANC-PRIMARY"</span></div><div class="or-row"><span class="or-key">OverwriteInstances:</span><span class="or-value or-green">false</span></div><div class="or-row"><span class="or-key">PluginsEnabled:</span><span class="or-value or-green">true</span></div><div class="or-row or-highlight"><span class="or-key">StorageCompression:</span><span class="or-value or-green">false</span></div><div class="or-row"><span class="or-key">UserMetadata:</span><span class="or-value or-gray">{}</span></div><div class="or-row"><span class="or-key">Version:</span><span class="or-value or-pink">"1.12.2"</span></div></section><aside class="or-summary"><div class="or-summary-head">REST API /system</div><div class="or-summary-grid"><div class="or-summary-cell"><span>Node</span><strong>ORTHANC-PRIMARY</strong></div><div class="or-summary-cell"><span>Version</span><strong>1.12.2</strong></div><div class="or-summary-cell"><span>DICOM</span><strong>4242</strong></div><div class="or-summary-cell"><span>REST</span><strong>8042</strong></div><div class="or-summary-cell"><span>Database</span><strong>PostgreSQL</strong></div><div class="or-summary-cell"><span>Identifier</span><strong>Redacted</strong></div></div></aside></div>
            `
        }
    ];

    // ── AWS Reliability Layer scenes ──────────────────────
    // Placeholder architecture preview: this project is earlier-stage than
    // Cloudflare/Orthanc, so the content itself is honestly framed as
    // "Placeholder"/"Planned" rather than fabricating real production
    // data that doesn't exist yet — that's authentic to where the project
    // actually stands, not a content gap to paper over.
    const AWS_SCENE_INTERVAL_MS = 5200;

    function renderAwsScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    const AWS_SCENES = [
        {
            title: '01 // RELIABILITY LAYER',
            motion: 'zoom-in',
            hud: [['Status','Planned'], ['Runtime','Serverless'], ['Checks','External'], ['Target','ryanvalera.com']],
            body: `
                <div class="aws-artboard">
                    <div class="aws-topbar">
                        <div class="aws-brand"><span>aws</span><span class="aws-smile">&#8994;</span><span>Reliability Layer</span></div>
                        <div class="aws-region">us-west-2 &middot; placeholder architecture</div>
                    </div>
                    <div class="aws-layout">
                        <aside class="aws-sidebar">
                            <div class="aws-side-title">Services</div>
                            <div class="aws-side-item aws-active">Reliability Overview</div>
                            <div class="aws-side-item">Lambda</div>
                            <div class="aws-side-item">EventBridge</div>
                            <div class="aws-side-item">CloudWatch</div>
                            <div class="aws-side-item">SNS</div>
                            <div class="aws-side-item">S3</div>
                            <div class="aws-side-item">Budgets</div>
                        </aside>
                        <main class="aws-main">
                            <div class="aws-title-row">
                                <div>
                                    <div class="aws-eyebrow">Independent validation for ryanvalera.com</div>
                                    <h1 class="aws-title">Reliability Overview</h1>
                                    <p class="aws-sub">Serverless health checks validate DNS, TLS, deployments, and site availability from outside the production platform.</p>
                                </div>
                                <div class="aws-status-pill"><span class="aws-status-dot"></span> Placeholder</div>
                            </div>
                            <div class="aws-cards">
                                <div class="aws-card"><span>DNS</span><strong>Planned</strong></div>
                                <div class="aws-card"><span>TLS</span><strong>Planned</strong></div>
                                <div class="aws-card"><span>Health Checks</span><strong>Scheduled</strong></div>
                                <div class="aws-card"><span>Alerts</span><strong>SNS</strong></div>
                            </div>
                            <section class="aws-arch">
                                <div class="aws-arch-title">Event-driven validation workflow</div>
                                <div class="aws-flow">
                                    <div class="aws-service"><div class="aws-service-icon">EB</div><strong>EventBridge</strong><span>scheduled trigger</span></div>
                                    <div class="aws-arrow">&rarr;</div>
                                    <div class="aws-service"><div class="aws-service-icon">&lambda;</div><strong>Lambda</strong><span>external health check</span></div>
                                    <div class="aws-arrow">&rarr;</div>
                                    <div class="aws-service"><div class="aws-service-icon">CW</div><strong>CloudWatch</strong><span>metrics + alarms</span></div>
                                    <div class="aws-arrow">&rarr;</div>
                                    <div class="aws-service"><div class="aws-service-icon">SNS</div><strong>Notification</strong><span>alert delivery</span></div>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            `
        },
        {
            title: '02 // COST GOVERNANCE',
            motion: 'zoom-in',
            hud: [['Status','Guarded'], ['Compute','Lambda'], ['Budget','$0\u20133'], ['Logs','Short TTL']],
            body: `
                <div class="aws-artboard">
                    <div class="aws-topbar">
                        <div class="aws-brand"><span>aws</span><span class="aws-smile">&#8994;</span><span>Cost Governance</span></div>
                        <div class="aws-region">budgets &middot; logs &middot; retention</div>
                    </div>
                    <div class="aws-layout">
                        <aside class="aws-sidebar">
                            <div class="aws-side-title">Operations</div>
                            <div class="aws-side-item">Health Checks</div>
                            <div class="aws-side-item aws-active">Cost Governance</div>
                            <div class="aws-side-item">Log Retention</div>
                            <div class="aws-side-item">IAM Guardrails</div>
                        </aside>
                        <main class="aws-main">
                            <div class="aws-title-row">
                                <div>
                                    <div class="aws-eyebrow">Low-cost operations design</div>
                                    <h1 class="aws-title">Budget Guardrails</h1>
                                    <p class="aws-sub">Event-driven execution, minimal storage, short log retention, and billing visibility keep the reliability layer intentionally small.</p>
                                </div>
                                <div class="aws-status-pill"><span class="aws-status-dot"></span> Cost Controlled</div>
                            </div>
                            <div class="aws-cost-grid">
                                <section class="aws-table">
                                    <div class="aws-table-head"><div>Service</div><div>Strategy</div><div>Status</div></div>
                                    <div class="aws-table-row"><div>AWS Lambda</div><div>short runtime</div><div class="aws-ok">Free tier</div></div>
                                    <div class="aws-table-row"><div>EventBridge</div><div>scheduled only</div><div class="aws-ok">Minimal</div></div>
                                    <div class="aws-table-row"><div>CloudWatch</div><div>short retention</div><div class="aws-warn">Watch logs</div></div>
                                    <div class="aws-table-row"><div>S3</div><div>small artifacts</div><div class="aws-ok">Minimal</div></div>
                                    <div class="aws-table-row"><div>AWS Budgets</div><div>alert threshold</div><div class="aws-ok">Enabled</div></div>
                                </section>
                                <aside class="aws-budget-card">
                                    <div class="aws-summary-head">Monthly Estimate</div>
                                    <div class="aws-budget-ring"><div class="aws-budget-inner"><strong>$0&ndash;3</strong><span>expected</span></div></div>
                                    <p class="aws-sub">Useful operational tooling does not require a fleet of EC2 instances or a surprise bill.</p>
                                </aside>
                            </div>
                        </main>
                    </div>
                </div>
            `
        },
        {
            title: '03 // INCIDENT FLOW',
            motion: 'zoom-out',
            hud: [['Status','Documented'], ['Alerts','SNS'], ['Evidence','S3'], ['Response','Runbook']],
            body: `
                <div class="aws-artboard">
                    <div class="aws-topbar">
                        <div class="aws-brand"><span>aws</span><span class="aws-smile">&#8994;</span><span>Incident Operations</span></div>
                        <div class="aws-region">runbooks &middot; evidence &middot; notifications</div>
                    </div>
                    <div class="aws-layout">
                        <aside class="aws-sidebar">
                            <div class="aws-side-title">Incident Flow</div>
                            <div class="aws-side-item">Detection</div>
                            <div class="aws-side-item">Alerting</div>
                            <div class="aws-side-item aws-active">Runbooks</div>
                            <div class="aws-side-item">Evidence Archive</div>
                        </aside>
                        <main class="aws-main">
                            <div class="aws-title-row">
                                <div>
                                    <div class="aws-eyebrow">Placeholder operational workflow</div>
                                    <h1 class="aws-title">Alert to Runbook</h1>
                                    <p class="aws-sub">Failures generate structured alerts, incident records, and documentation-driven response workflows.</p>
                                </div>
                                <div class="aws-status-pill"><span class="aws-status-dot"></span> Documented</div>
                            </div>
                            <div class="aws-incident-panel">
                                <section class="aws-log-panel">
                                    <div class="aws-panel-head">Event Timeline</div>
                                    <div class="aws-log-body">
                                        <div class="aws-log-line"><span class="aws-time">00:00</span><span>EventBridge starts validation</span></div>
                                        <div class="aws-log-line"><span class="aws-time">00:02</span><span>Lambda checks ryanvalera.com</span></div>
                                        <div class="aws-log-line"><span class="aws-time">00:04</span><span>CloudWatch records status</span></div>
                                        <div class="aws-log-line"><span class="aws-time">00:05</span><span>SNS notification prepared</span></div>
                                        <div class="aws-log-line"><span class="aws-time">00:06</span><span>S3 incident artifact archived</span></div>
                                    </div>
                                </section>
                                <section class="aws-runbook-panel">
                                    <div class="aws-panel-head">Runbook Checklist</div>
                                    <div class="aws-runbook-body">
                                        <div class="aws-step"><span class="aws-num">1</span><div><strong>Confirm external failure</strong><br><small>Validate from outside production platform</small></div><span class="aws-ok">Ready</span></div>
                                        <div class="aws-step"><span class="aws-num">2</span><div><strong>Review Cloudflare state</strong><br><small>DNS, TLS, cache, load balancer</small></div><span class="aws-ok">Ready</span></div>
                                        <div class="aws-step"><span class="aws-num">3</span><div><strong>Archive incident evidence</strong><br><small>Logs, timestamps, response data</small></div><span class="aws-ok">Ready</span></div>
                                        <div class="aws-step"><span class="aws-num">4</span><div><strong>Document recovery</strong><br><small>Record timeline and resolution</small></div><span class="aws-ok">Ready</span></div>
                                    </div>
                                </section>
                            </div>
                        </main>
                    </div>
                </div>
            `
        }
    ];

    // ── AI Engineering Validation Platform (IT Forge) scenes ──
    // No live screenshot exists — this is a local desktop app, still
    // pre-repo ("still bootstrapping this repository" per the author
    // intro). Scenes mirror the app's REAL 3-tab structure (1 · Build,
    // 2 · Review Loop, 3 · Final Artifact) and real specifics pulled
    // from app.py/README (actual model strings, actual pricing, actual
    // convergence logic) rather than generic filler — same "Placeholder"
    // honesty as AWS, grounded in real engineering facts wherever the
    // source code actually specifies them.
    const AIVP_SCENE_INTERVAL_MS = 5200;

    function renderAivpScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    const AIVP_SCENES = [
        {
            title: '01 // BUILD',
            motion: 'zoom-in',
            hud: [['Status','Bootstrapping'], ['Builder','Claude Haiku 4.5'], ['Rounds','Max 3'], ['UI','Gradio Blocks']],
            body: `
                <div class="aiv-artboard">
                    <div class="aiv-topbar"><div class="aiv-brand">IT FORGE</div><div class="aiv-tagline">Build &rarr; Validate &rarr; Converge</div></div>
                    <div class="aiv-tabs">
                        <div class="aiv-tab aiv-active">1 &middot; Build</div>
                        <div class="aiv-tab">2 &middot; Review Loop</div>
                        <div class="aiv-tab">3 &middot; Final Artifact</div>
                    </div>
                    <div class="aiv-body">
                        <div class="aiv-row">
                            <div class="aiv-field"><label>Artifact Type</label><div class="aiv-select">Infrastructure Config</div></div>
                            <div class="aiv-field"><label>Validator Model (OpenAI)</label><div class="aiv-select">gpt-4.1-mini</div></div>
                        </div>
                        <div class="aiv-row">
                            <div class="aiv-field aiv-narrow"><label>Max Rounds</label><div class="aiv-select">3</div></div>
                            <div class="aiv-field"><label>Convergence Threshold (score &ge; N + APPROVE &rarr; lock)</label><div class="aiv-select">85</div></div>
                        </div>
                        <div class="aiv-field"><label>Task Description</label><div class="aiv-textarea">Generate a hardened Nginx reverse proxy config for a Gradio app behind TLS termination, with rate limiting and security headers.</div></div>
                        <div class="aiv-btn-row">
                            <div class="aiv-btn aiv-ghost">&#128161; Load Example for Selected Type</div>
                            <div class="aiv-btn aiv-primary">&#9881;&#65039; Generate &amp; Converge</div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '02 // REVIEW LOOP',
            motion: 'zoom-in',
            hud: [['Status','Iterating'], ['Validator','GPT-4.1-mini'], ['Gate','Score + Verdict'], ['Round','2 of 3']],
            body: `
                <div class="aiv-artboard">
                    <div class="aiv-topbar"><div class="aiv-brand">IT FORGE</div><div class="aiv-tagline">Build &rarr; Validate &rarr; Converge</div></div>
                    <div class="aiv-tabs">
                        <div class="aiv-tab">1 &middot; Build</div>
                        <div class="aiv-tab aiv-active">2 &middot; Review Loop</div>
                        <div class="aiv-tab">3 &middot; Final Artifact</div>
                    </div>
                    <div class="aiv-body">
                        <div class="aiv-round-card">
                            <div class="aiv-round-head"><strong>Round 1</strong><span class="aiv-verdict aiv-revise">REVISE</span></div>
                            <div class="aiv-json-row"><span class="aiv-key">score:</span><span class="aiv-val">72</span></div>
                            <div class="aiv-json-row"><span class="aiv-key">required_changes:</span><span class="aiv-val">Add rate limiting zone; missing HSTS header</span></div>
                        </div>
                        <div class="aiv-round-card">
                            <div class="aiv-round-head"><strong>Round 2</strong><span class="aiv-verdict aiv-pending">EVALUATING&hellip;</span></div>
                            <div class="aiv-json-row"><span class="aiv-key">score:</span><span class="aiv-val">&mdash;</span></div>
                            <div class="aiv-json-row"><span class="aiv-key">assumptions:</span><span class="aiv-val">TLS termination handled upstream</span></div>
                            <div class="aiv-json-row"><span class="aiv-key">risks:</span><span class="aiv-val">Rate limit threshold not load-tested</span></div>
                        </div>
                        <div class="aiv-gate-note">Convergence requires <strong>score &ge; threshold AND verdict == APPROVE</strong> — score alone does not lock the artifact.</div>
                    </div>
                </div>
            `
        },
        {
            title: '03 // FINAL ARTIFACT',
            motion: 'zoom-out',
            hud: [['Status','Locked'], ['Verdict','APPROVE'], ['Exports','.txt + .json'], ['Cost','< $0.01']],
            body: `
                <div class="aiv-artboard">
                    <div class="aiv-topbar"><div class="aiv-brand">IT FORGE</div><div class="aiv-tagline">Build &rarr; Validate &rarr; Converge</div></div>
                    <div class="aiv-tabs">
                        <div class="aiv-tab">1 &middot; Build</div>
                        <div class="aiv-tab">2 &middot; Review Loop</div>
                        <div class="aiv-tab aiv-active">3 &middot; Final Artifact</div>
                    </div>
                    <div class="aiv-body">
                        <div class="aiv-lock-banner"><span class="aiv-verdict aiv-approve">APPROVE</span> Artifact locked after 3 rounds &middot; final score 91</div>
                        <div class="aiv-final-card">nginx.conf &mdash; hardened reverse proxy, TLS termination assumed upstream, rate-limited, HSTS + security headers applied.</div>
                        <div class="aiv-btn-row">
                            <div class="aiv-btn aiv-ghost">&#11015;&#65039; Download Artifact (.txt)</div>
                            <div class="aiv-btn aiv-ghost">&#11015;&#65039; Download Session Log (.json)</div>
                        </div>
                        <div class="aiv-cost-note">Typical run cost: &lt; $0.01 (3 rounds, default token caps, gpt-4.1-mini validator)</div>
                    </div>
                </div>
            `
        }
    ];

    // ── Healthcare Imaging Device API (FastAPI) scenes ────────
    // Phase v1.3 bundle: API Overview, REST Contract, Swagger UI. Reuses
    // the shared engine shell verbatim; artboard classes are "fapi-"
    // prefixed (5th per-project prefix alongside cf-/or-/aws-/aiv-).
    // Slide 3 (Swagger UI) keeps a white/default Swagger-style shell per
    // the bundle's v1.3 note, with the JSON example-value panel staying
    // dark to match Swagger UI's own actual presentation convention.
    const FASTAPI_SCENE_INTERVAL_MS = 5200;

    function renderFastapiScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    const FASTAPI_SCENES = [
        {
            title: '01 // API OVERVIEW',
            motion: 'zoom-in',
            hud: [['Status','v1.2'], ['Framework','FastAPI'], ['Domain','Imaging'], ['Tests','46 Passing']],
            body: `
                <div class="fapi-artboard">
                    <div class="fapi-topbar">
                        <div class="fapi-brand"><div class="fapi-brand-mark">API</div><div>Healthcare Imaging Device API</div></div>
                        <div class="fapi-version-pill">FastAPI &middot; Python 3.12+</div>
                    </div>
                    <div class="fapi-layout">
                        <aside class="fapi-sidebar">
                            <div class="fapi-side-title">Resources</div>
                            <div class="fapi-side-item fapi-active">Overview</div>
                            <div class="fapi-side-item">Devices</div>
                            <div class="fapi-side-item">Maintenance</div>
                            <div class="fapi-side-item">Vendors</div>
                            <div class="fapi-side-item">Tests</div>
                        </aside>
                        <main class="fapi-main">
                            <div class="fapi-title-row">
                                <div>
                                    <div class="fapi-eyebrow">Python backend engineering</div>
                                    <h1 class="fapi-title">Imaging Inventory API</h1>
                                    <p class="fapi-sub">A focused FastAPI project for managing healthcare imaging equipment, vendors, and maintenance history without dragging DICOM, PACS, or HL7 into every conversation. They get enough attention already.</p>
                                </div>
                                <div class="fapi-status-pill"><span class="fapi-status-dot"></span> 46 Tests Passing</div>
                            </div>
                            <div class="fapi-cards">
                                <div class="fapi-card"><span>Devices</span><strong>CRUD</strong></div>
                                <div class="fapi-card"><span>Vendors</span><strong>Relational</strong></div>
                                <div class="fapi-card"><span>Maintenance</span><strong>History</strong></div>
                                <div class="fapi-card"><span>Database</span><strong>SQLite</strong></div>
                            </div>
                            <section class="fapi-endpoint-panel">
                                <div class="fapi-panel-head">Current API Resources</div>
                                <div class="fapi-endpoint-list">
                                    <div class="fapi-endpoint"><div class="fapi-method fapi-get">GET</div><div class="fapi-path">/devices?modality=CT</div><div class="fapi-resource">filtered inventory</div></div>
                                    <div class="fapi-endpoint"><div class="fapi-method fapi-post">POST</div><div class="fapi-path">/devices</div><div class="fapi-resource">create device</div></div>
                                    <div class="fapi-endpoint"><div class="fapi-method fapi-get">GET</div><div class="fapi-path">/vendors</div><div class="fapi-resource">service vendors</div></div>
                                    <div class="fapi-endpoint"><div class="fapi-method fapi-get">GET</div><div class="fapi-path">/maintenance?device_id=1</div><div class="fapi-resource">service history</div></div>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            `
        },
        {
            title: '02 // REST CONTRACT',
            motion: 'zoom-in',
            hud: [['Resource','Devices'], ['Models','Pydantic'], ['Routes','CRUD'], ['Deletes','Guarded']],
            body: `
                <div class="fapi-artboard">
                    <div class="fapi-topbar">
                        <div class="fapi-brand"><div class="fapi-brand-mark">&#402;</div><div>OpenAPI Resource Explorer</div></div>
                        <div class="fapi-version-pill">Swagger-style Runtime</div>
                    </div>
                    <div class="fapi-layout">
                        <aside class="fapi-sidebar">
                            <div class="fapi-side-title">Endpoints</div>
                            <div class="fapi-side-item fapi-active">Devices</div>
                            <div class="fapi-side-item">Maintenance</div>
                            <div class="fapi-side-item">Vendors</div>
                            <div class="fapi-side-item">Validation</div>
                        </aside>
                        <main class="fapi-main">
                            <div class="fapi-title-row">
                                <div>
                                    <div class="fapi-eyebrow">Request and response modeling</div>
                                    <h1 class="fapi-title">Devices Resource</h1>
                                    <p class="fapi-sub">Explicit response models, Pydantic validation, and filtered GET endpoints create a clear API contract for imaging equipment inventory workflows.</p>
                                </div>
                                <div class="fapi-status-pill"><span class="fapi-status-dot"></span> Response Model</div>
                            </div>
                            <div class="fapi-swagger-grid">
                                <section class="fapi-endpoint-panel">
                                    <div class="fapi-panel-head">Devices Endpoints</div>
                                    <div class="fapi-endpoint-list">
                                        <div class="fapi-endpoint"><div class="fapi-method fapi-get">GET</div><div class="fapi-path">/devices</div><div class="fapi-resource">list devices</div></div>
                                        <div class="fapi-endpoint"><div class="fapi-method fapi-get">GET</div><div class="fapi-path">/devices/{id}</div><div class="fapi-resource">read one</div></div>
                                        <div class="fapi-endpoint"><div class="fapi-method fapi-post">POST</div><div class="fapi-path">/devices</div><div class="fapi-resource">create</div></div>
                                        <div class="fapi-endpoint"><div class="fapi-method fapi-put">PUT</div><div class="fapi-path">/devices/{id}</div><div class="fapi-resource">update</div></div>
                                        <div class="fapi-endpoint"><div class="fapi-method fapi-delete">DELETE</div><div class="fapi-path">/devices/{id}</div><div class="fapi-resource">guarded delete</div></div>
                                    </div>
                                </section>
                                <section class="fapi-code-panel">
                                    <div class="fapi-code-head"><span>Example Device JSON</span><span>200 OK</span></div>
                                    <div class="fapi-code-body">{
  <span class="fapi-json-key">"asset_tag"</span>: <span class="fapi-json-val">"RAD-CT-001"</span>,
  <span class="fapi-json-key">"manufacturer"</span>: <span class="fapi-json-val">"Siemens"</span>,
  <span class="fapi-json-key">"model"</span>: <span class="fapi-json-val">"SOMATOM Force"</span>,
  <span class="fapi-json-key">"modality"</span>: <span class="fapi-json-val">"CT"</span>,
  <span class="fapi-json-key">"status"</span>: <span class="fapi-json-val">"Operational"</span>,
  <span class="fapi-json-key">"vendor_id"</span>: <span class="fapi-json-num">1</span>
}</div>
                                </section>
                            </div>
                        </main>
                    </div>
                </div>
            `
        },
        {
            title: '03 // SWAGGER UI',
            motion: 'zoom-out',
            hud: [['Docs','OpenAPI'], ['Resource','Devices'], ['Response','200 OK'], ['Tests','46 Passing']],
            body: `
                <div class="fapi-swagger-artboard">
                    <div class="fapi-swagger-shell">
                        <div class="fapi-swagger-header">
                            <div class="fapi-swagger-title"><span class="fapi-braces">{}</span><span>Swagger UI</span><span class="fapi-oas">OAS 3.1</span><span class="fapi-openapi">openapi</span></div>
                            <div class="fapi-auth">Authorize &#128274;</div>
                        </div>
                        <div class="fapi-swagger-content">
                            <div class="fapi-sw-row"><div class="fapi-method fapi-get">GET</div><div class="fapi-sw-path">/devices</div><div class="fapi-chev">&rsaquo;</div></div>
                            <div class="fapi-sw-row fapi-expanded">
                                <div class="fapi-sw-row-head"><div class="fapi-method fapi-get">GET</div><div class="fapi-sw-path">/devices/{id}</div><div class="fapi-chev">&#8964;</div></div>
                                <div class="fapi-swagger-body">
                                    <div>
                                        <div class="fapi-params-title">Parameters <button class="fapi-try">Try it out</button></div>
                                        <div class="fapi-param-grid">
                                            <div><strong>Name</strong><br><br><strong>id <span class="fapi-required">* required</span></strong><br><span style="color:#38bdf8">integer</span> (path)</div>
                                            <div><strong>Description</strong><br><br>The ID of the device<br>to retrieve</div>
                                        </div>
                                        <input class="fapi-input-box" value="1" />
                                    </div>
                                    <div>
                                        <div class="fapi-response-head"><div class="fapi-resp-title">Responses</div><div class="fapi-content-type">application/json</div></div>
                                        <div class="fapi-success"><span class="fapi-status-200">200</span><strong>Successful Response</strong></div>
                                        <div class="fapi-example-box">
                                            <div class="fapi-example-title">Example Value</div>
                                            <div class="fapi-json"><span class="fapi-ln">1</span>{
<span class="fapi-ln">2</span>  <span class="fapi-k">"id"</span>: <span class="fapi-num">1</span>,
<span class="fapi-ln">3</span>  <span class="fapi-k">"asset_tag"</span>: <span class="fapi-v">"RAD-CT-001"</span>,
<span class="fapi-ln">4</span>  <span class="fapi-k">"manufacturer"</span>: <span class="fapi-v">"Siemens"</span>,
<span class="fapi-ln">5</span>  <span class="fapi-k">"model"</span>: <span class="fapi-v">"SOMATOM Force"</span>,
<span class="fapi-ln">6</span>  <span class="fapi-k">"modality"</span>: <span class="fapi-v">"CT"</span>,
<span class="fapi-ln">7</span>  <span class="fapi-k">"location"</span>: <span class="fapi-v">"Radiology Room 3"</span>,
<span class="fapi-ln">8</span>  <span class="fapi-k">"status"</span>: <span class="fapi-v">"Operational"</span>,
<span class="fapi-ln">9</span>  <span class="fapi-k">"last_service"</span>: <span class="fapi-v">"2026-03-15"</span>
<span class="fapi-ln">10</span>}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fapi-sw-row"><div class="fapi-method fapi-post">POST</div><div class="fapi-sw-path">/devices</div><div class="fapi-chev">&rsaquo;</div></div>
                            <div class="fapi-sw-row"><div class="fapi-method fapi-put">PUT</div><div class="fapi-sw-path">/devices/{id}</div><div class="fapi-chev">&rsaquo;</div></div>
                            <div class="fapi-sw-row"><div class="fapi-method fapi-delete">DELETE</div><div class="fapi-sw-path">/devices/{id}</div><div class="fapi-chev">&rsaquo;</div></div>
                            <div class="fapi-swagger-footer">
                                <div class="fapi-schema-box">Schemas: Device &middot; Vendor &middot; MaintenanceRecord</div>
                                <div class="fapi-schema-box">Validation: 46 tests passing &middot; 0 warnings</div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    ];

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

    // ── Shared scene engine ──────────────────────────────
    // Everything below is project-agnostic: positioning, crossfade,
    // Ken Burns motion, HUD, dot pagination, and the Signal Acquisition
    // Sequence are identical regardless of which project's artboards are
    // inside. Only `scenes` (data) and `renderScene` (markup builder for
    // that project's artboards) differ per project — everything else is
    // one implementation, not one-per-project. New projects add a scene
    // array + a render function and call this; they don't reimplement
    // scene cycling or the interference effect from scratch.
    function createScenePreview(previewBodyEl, scenes, renderScene, intervalMs) {
        if (!previewBodyEl) return null;

        previewBodyEl.classList.add('has-live-preview');
        previewBodyEl.innerHTML =
            '<div class="cf-preview-engine">' +
            scenes.map(renderScene).join('') +
            glitchOverlayMarkup('cf-glitch-fx--major') +
            bandOverlayMarkup('cf-glitch-fx--minor') +
            '<div class="cf-engine-dots" role="tablist" aria-label="Preview scenes">' +
            scenes.map((scene, i) =>
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
            // Duration is tied directly to intervalMs rather than a second
            // hardcoded number, so the zoom can't finish early and sit
            // frozen before the next transition fires (or drift out of
            // sync with the interval the way focalPoint/frameAlign did).
            inner.style.animation = 'none';
            void inner.offsetHeight;
            inner.style.animation = name + ' ' + intervalMs + 'ms ease-out forwards';
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
            timer = setInterval(advance, intervalMs);
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

    function initCloudflarePreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, CF_SCENES, renderCloudflareScene, CF_SCENE_INTERVAL_MS);
    }

    function initOrthancPreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, ORTHANC_SCENES, renderOrthancScene, ORTHANC_SCENE_INTERVAL_MS);
    }

    function initAwsPreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, AWS_SCENES, renderAwsScene, AWS_SCENE_INTERVAL_MS);
    }

    function initAivpPreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, AIVP_SCENES, renderAivpScene, AIVP_SCENE_INTERVAL_MS);
    }

    function initFastapiPreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, FASTAPI_SCENES, renderFastapiScene, FASTAPI_SCENE_INTERVAL_MS);
    }

    // ── Cybersecurity Investigations scenes ───────────────
    // Artboards are "cyi-" prefixed so they never collide with other
    // projects sharing this engine. The shared engine (cf-engine-*,
    // cf-hud, cf-glitch-fx) provides scene cycling, HUD, dot pagination,
    // Ken Burns motion, and the Signal Acquisition interference sequence
    // automatically — this project only supplies scene data + a renderer.
    const CYBER_SCENE_INTERVAL_MS = 5200;

    function renderCyberScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    const CYBER_SCENES = [
        {
            title: '01 // CASE BOARD',
            motion: 'zoom-in',
            hud: [['Scope','DFIR'], ['Cases','10'], ['Evidence','Documented'], ['Time','UTC']],
            body: `
<div class="cyi-artboard"><div class="cyi-topbar"><div class="cyi-brand"><div class="cyi-brand-mark">IR</div><div>Cybersecurity Investigations Portfolio</div></div><div class="cyi-badge">CyberRange Case Library</div></div><main class="cyi-main"><div class="cyi-title-row"><div><div class="cyi-eyebrow">Structured DFIR documentation</div><h1 class="cyi-title">Investigation Case Board</h1><p class="cyi-sub">Cyber range investigations covering network forensics, endpoint artifacts, memory analysis, SIEM triage, malware behavior, lateral movement, credential access, and ransomware activity.</p></div><div class="cyi-pill">● 10 Cases</div></div><div class="cyi-cards"><div class="cyi-card"><span>Network</span><strong>PCAP / Zeek</strong></div><div class="cyi-card"><span>Endpoint</span><strong>Sysmon</strong></div><div class="cyi-card"><span>Memory</span><strong>Volatility</strong></div><div class="cyi-card"><span>SIEM</span><strong>Elastic / Splunk</strong></div></div><div class="cyi-casegrid"><div><b>001 Macro Malware</b><span>Data exfiltration, PCAP analysis</span></div><div><b>003 HR Webshell</b><span>AD enum, LSASS dump, SMB exfil</span></div><div><b>004 Office RTF</b><span>Equation Editor, PowerShell, C2</span></div><div><b>006 Memory Forensics</b><span>WMI → PowerShell → LSASS dump</span></div><div><b>008 SSH Abuse</b><span>Elastic SIEM auth hunting</span></div><div><b>010 TeamCity APT</b><span>Lateral movement, ransomware</span></div></div></main></div>
`
        },
        {
            title: '02 // WIRESHARK',
            motion: 'zoom-in',
            hud: [['Evidence','PCAP'], ['Protocols','DNS/HTTP'], ['View','Packet'], ['Analysis','Streams']],
            body: `
<div class="cyi-artboard"><div class="cyi-topbar"><div class="cyi-brand"><div class="cyi-brand-mark">WS</div><div>Wireshark Packet Inspection</div></div><div class="cyi-badge">DNS · HTTP · TCP Streams</div></div><main class="cyi-main"><div class="cyi-title-row"><div><div class="cyi-eyebrow">Network forensics interface</div><h1 class="cyi-title">Wireshark Protocol Review</h1><p class="cyi-sub">Packet-level investigation reconstructs DNS answers, web requests, TCP conversations, redirects, payload transfers, and suspicious client-server activity.</p></div><div class="cyi-pill">● Active View</div></div><div class="cyi-wireshark"><div class="cyi-wtop">Wireshark <span>case-network.pcap</span></div><div class="cyi-wmenu">File Edit View Go Capture Analyze Statistics Telephony Tools Help</div><div class="cyi-filter">dns || http || tcp.stream eq 12</div><div class="cyi-pkt cyi-head"><b>No.</b><b>Time</b><b>Source</b><b>Destination</b><b>Protocol</b><b>Info</b></div><div class="cyi-pkt"><span>343</span><span>65.142</span><span>192.168.0.21</span><span>174.129.249.228</span><span>TCP</span><span>46555 → 80 [ACK]</span></div><div class="cyi-pkt"><span>344</span><span>65.142</span><span>192.168.0.21</span><span>174.129.249.228</span><span>HTTP</span><span>GET /clients/flash/application.swf</span></div><div class="cyi-pkt cyi-active"><span>349</span><span>65.276</span><span>192.168.0.1</span><span>192.168.0.21</span><span>DNS</span><span>Standard query response A cdn0.nflximg.com</span></div><div class="cyi-pkt"><span>353</span><span>65.298</span><span>192.168.0.21</span><span>63.80.242.48</span><span>HTTP</span><span>GET /us/r10000/main.bin</span></div><pre class="cyi-details">Frame 349: 489 bytes on wire
Ethernet II · IPv4 · UDP · Domain Name System
Queries: cdn0.nflximg.com type A, class IN
Answers: 4 · Additional RRs: 9</pre></div></main></div>
`
        },
        {
            title: '03 // NMAP RECON',
            motion: 'zoom-in',
            hud: [['Tool','Nmap'], ['Ports','5 Open'], ['Focus','Services'], ['Next','Logs']],
            body: `
<div class="cyi-artboard"><div class="cyi-topbar"><div class="cyi-brand"><div class="cyi-brand-mark">NM</div><div>Nmap Service Enumeration</div></div><div class="cyi-badge">CLI · Recon · Version Detection</div></div><main class="cyi-main"><div class="cyi-title-row"><div><div class="cyi-eyebrow">Service discovery and hypothesis building</div><h1 class="cyi-title">CLI Reconnaissance</h1><p class="cyi-sub">Nmap output provides the starting map for follow-up testing, service fingerprinting, protocol review, and targeted evidence collection.</p></div><div class="cyi-pill">● Active View</div></div><pre class="cyi-term"><span class="cyi-prompt">analyst@lab</span>:~$ <span class="cyi-cmd">sudo nmap -sV -sC -O -Pn 10.129.212.200</span>
Starting Nmap 7.94SVN at 2025-06-02 23:40 CDT
Nmap scan report for 10.129.212.200
Host is up (0.16s latency).
Not shown: 995 closed tcp ports (reset)

PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3
110/tcp  open  pop3    Dovecot pop3d
143/tcp  open  imap    Dovecot imapd
993/tcp  open  ssl/imap Dovecot imapd
995/tcp  open  ssl/pop3 Dovecot pop3d

|_pop3-capabilities: STLS CAPA AUTH-RESP-CODE PIPELINING
| ssl-cert: Subject: commonName=NIXHARD
| Not valid before: 2021-11-10T01:30:25
|_Not valid after:  2031-11-08T01:30:25</pre></main></div>
`
        },
        {
            title: '04 // NETCAT SESSION',
            motion: 'zoom-in',
            hud: [['Mode','Lab'], ['Port','4444'], ['Identity','Validated'], ['Purpose','Triage']],
            body: `
<div class="cyi-artboard"><div class="cyi-topbar"><div class="cyi-brand"><div class="cyi-brand-mark">NC</div><div>Reverse Shell Handling</div></div><div class="cyi-badge">Netcat · TTY · Post-Exploitation Awareness</div></div><main class="cyi-main"><div class="cyi-title-row"><div><div class="cyi-eyebrow">Controlled lab shell demonstration</div><h1 class="cyi-title">Netcat Session Review</h1><p class="cyi-sub">Reverse shell handling is represented as analyst awareness, session validation, identity checks, and careful documentation rather than glamorized exploitation.</p></div><div class="cyi-pill">● Active View</div></div><div class="cyi-twoterms"><pre class="cyi-term"><span class="cyi-prompt">analyst@kali</span>:~$ <span class="cyi-cmd">nc -lvnp 4444</span>
listening on [any] 4444 ...

<span class="cyi-ok">connect to [10.10.14.22] from [10.10.3.115] 49821</span>
$ whoami
iis apppool\defaultapppool
$ hostname
HR-WEB01
$ ipconfig
IPv4 Address : 10.10.3.115</pre><pre class="cyi-term"><span class="cyi-ok">[1]</span> Confirm process owner
<span class="cyi-ok">[2]</span> Capture hostname and interface
<span class="cyi-ok">[3]</span> Record source/destination tuple
<span class="cyi-warn">[4]</span> Preserve volatile evidence
<span class="cyi-warn">[5]</span> Avoid destructive commands
<span class="cyi-bad">[6]</span> Escalate containment decision

<span class="cyi-muted">Session is documented as evidence, not treated as a production action.</span></pre></div></main></div>
`
        },
        {
            title: '05 // SURICATA IDS',
            motion: 'zoom-in',
            hud: [['Source','eve.json'], ['Signal','Webshell'], ['Follow-up','PCAP'], ['IOCs','Defanged']],
            body: `
<div class="cyi-artboard"><div class="cyi-topbar"><div class="cyi-brand"><div class="cyi-brand-mark">SU</div><div>Suricata IDS Alert Review</div></div><div class="cyi-badge">Signatures · Flow · Evidence</div></div><main class="cyi-main"><div class="cyi-title-row"><div><div class="cyi-eyebrow">Network detection engineering</div><h1 class="cyi-title">Suricata Alert Queue</h1><p class="cyi-sub">IDS alerts are triaged against packet evidence, source context, signatures, categories, severities, and follow-up validation in Zeek or Wireshark.</p></div><div class="cyi-pill">● Active View</div></div><div class="cyi-twoterms"><div class="cyi-alerttable"><div class="cyi-log cyi-head"><b>Time</b><b>Source</b><b>Signature</b><b>Severity</b></div><div class="cyi-log"><span>13:42:11</span><span>3[.]68[.]76[.]39</span><span>ET WEB_SERVER Webshell Activity</span><span class="cyi-sev">High</span></div><div class="cyi-log"><span>13:45:02</span><span>52[.]59[.]195[.]223</span><span>Cobalt Strike Beacon Pattern</span><span class="cyi-sev">High</span></div><div class="cyi-log"><span>14:03:18</span><span>10[.]10[.]11[.]216</span><span>SMB Data Transfer Spike</span><span>Med</span></div><div class="cyi-log"><span>14:09:42</span><span>10[.]10[.]3[.]115</span><span>Suspicious Upload Transaction</span><span class="cyi-sev">High</span></div></div><pre class="cyi-term"><span class="cyi-prompt">$</span> <span class="cyi-cmd">jq 'select(.event_type=="alert")' eve.json</span>
[
  "10.10.3.115",
  "52.59.195.223",
  "Cobalt Strike beacon pattern"
]

<span class="cyi-bad">ALERT</span> ET WEB_SERVER Webshell Activity
<span class="cyi-warn">ACTION</span> pivot to packet stream and HTTP body</pre></div></main></div>
`
        },
        {
            title: '06 // ELASTIC SIEM',
            motion: 'zoom-in',
            hud: [['Tool','Elastic'], ['Query','KQL'], ['Signal','SSH Abuse'], ['Outcome','Correlated']],
            body: `
<div class="cyi-artboard"><div class="cyi-topbar"><div class="cyi-brand"><div class="cyi-brand-mark">EL</div><div>Elastic SIEM Auth Hunt</div></div><div class="cyi-badge">KQL · GeoIP · Alerts</div></div><main class="cyi-main"><div class="cyi-title-row"><div><div class="cyi-eyebrow">Authentication abuse investigation</div><h1 class="cyi-title">Elastic Discover</h1><p class="cyi-sub">Elastic SIEM analysis correlates failed SSH attempts, successful authentication, endpoint alerts, and source geography to reconstruct authentication abuse.</p></div><div class="cyi-pill">● Active View</div></div><div class="cyi-elastic"><div class="cyi-etop">elastic <span>Discover</span></div><div class="cyi-kql">event.dataset: "system.auth" AND user.name: "admin" AND event.outcome: "failure"</div><div class="cyi-hist"><i style="height:38%"></i><i style="height:65%"></i><i style="height:50%"></i><i style="height:82%"></i><i style="height:44%"></i><i style="height:74%"></i><i style="height:57%"></i><i style="height:91%"></i></div><div class="cyi-alertcards"><div><b>Brute force threshold exceeded</b><span>Repeated failed SSH logins against administrative usernames</span></div><div><b>Successful authentication after failures</b><span>Key-based authentication observed after repeated failures</span></div><div><b>Post-exploitation alert</b><span>Suspicious process execution on EC2AMAZ-PARMDQI</span></div></div></div></main></div>
`
        },
        {
            title: '07 // SPLUNK',
            motion: 'zoom-in',
            hud: [['Tool','Splunk'], ['Search','SPL'], ['Signal','Privilege'], ['Source','secure']],
            body: `
<div class="cyi-artboard"><div class="cyi-topbar"><div class="cyi-brand"><div class="cyi-brand-mark">SP</div><div>Splunk Correlation Dashboard</div></div><div class="cyi-badge">SPL · Sysmon · Fortigate · Suricata</div></div><main class="cyi-main"><div class="cyi-title-row"><div><div class="cyi-eyebrow">Endpoint + network correlation</div><h1 class="cyi-title">Splunk Search Review</h1><p class="cyi-sub">Splunk searches correlate abnormal process execution, authentication events, Fortigate UTM traffic, Suricata detections, and threat intelligence enrichment.</p></div><div class="cyi-pill">● Active View</div></div><div class="cyi-splunk"><div class="cyi-stop">splunk <span>Authentication App for Splunk</span></div><div class="cyi-ssearch">index=* host=* source=/var/log/secure visudo OR usermod</div><div class="cyi-hist cyi-orange"><i style="height:42%"></i><i style="height:66%"></i><i style="height:34%"></i><i style="height:91%"></i><i style="height:55%"></i><i style="height:76%"></i></div><div class="cyi-srows"><div><b>22:57:30</b><span>usermod add user to wheel group</span><em>secure</em></div><div><b>22:57:30</b><span>visudo sudoers modification</span><em>secure</em></div><div><b>22:57:59</b><span>sudo session opened</span><em>secure</em></div><div><b>23:01:42</b><span>ssh successful auth after failures</span><em>auth</em></div></div></div></main></div>
`
        },
        {
            title: '08 // FINAL REPORTING',
            motion: 'zoom-out',
            hud: [['Framework','MITRE'], ['Output','Reports'], ['Evidence','Registered'], ['Result','Findings']],
            body: `
<div class="cyi-artboard"><div class="cyi-topbar"><div class="cyi-brand"><div class="cyi-brand-mark">RPT</div><div>Incident Reconstruction &amp; Reporting</div></div><div class="cyi-badge">MITRE · IOCs · Final Reports</div></div><main class="cyi-main"><div class="cyi-title-row"><div><div class="cyi-eyebrow">Evidence to final findings</div><h1 class="cyi-title">Investigation Report</h1><p class="cyi-sub">Each investigation converts raw artifacts into a structured timeline, impact assessment, MITRE mapping, IOCs, assumptions, limitations, and final findings.</p></div><div class="cyi-pill">● Active View</div></div><div class="cyi-twoterms"><div class="cyi-report"><h3>Final Investigation Report</h3><div><b>Executive Summary</b><span>Initial access, execution, impact</span></div><div><b>Credential Access</b><span>Dumping techniques and LOLBins</span></div><div><b>Network Evidence</b><span>PCAP, IDS, SIEM correlation</span></div><div><b>Evidence Register</b><span>Logs, artifacts, confidence</span></div></div><div class="cyi-mitre"><div><b>Initial Access</b><span>Exploit / phishing path</span></div><div><b>Execution</b><span>PowerShell / LOLBins</span></div><div><b>Credential Access</b><span>LSASS dump</span></div><div><b>Lateral Movement</b><span>WMIC / SMB</span></div><div><b>Defense Evasion</b><span>Security controls disabled</span></div><div><b>Impact</b><span>Ransomware behavior</span></div></div></div></main></div>
`
        }
    ];

    function initCyberPreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, CYBER_SCENES, renderCyberScene, CYBER_SCENE_INTERVAL_MS);
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
        let previewController = null;

        if (!project) {
            if (titleEl) titleEl.textContent = 'PROJECT NOT FOUND';
            if (badgeEl) badgeEl.textContent = BADGE_TEXT;
            if (subEl) subEl.textContent = SUB_TEXT;
            if (introEl) introEl.textContent = 'This project media page could not be found. Return to the Engineering Portal to select a project.';
            if (githubLink) githubLink.style.display = 'none';
            materializePanels();
            revealFooter();
            if (reducedMotion) { showSystemStatusInstant(); } else { materializeSystemStatus(); }
            initAutoplayToggle();
            return;
        }

        document.title = 'Ryan Valera — ' + project.title + ' Media';

        const authorIntroText = project.authorIntro || AUTHOR_INTRO_PLACEHOLDER;

        if (githubLink) githubLink.href = project.githubUrl;
        if (githubLabelEl) githubLabelEl.textContent = project.githubLabel;
        if (previewTitleEl) previewTitleEl.textContent = project.title;

        if (slug === 'cloudflare') {
            previewController = initCloudflarePreview(previewBodyEl);
        } else if (slug === 'orthanc') {
            previewController = initOrthancPreview(previewBodyEl);
        } else if (slug === 'aws') {
            previewController = initAwsPreview(previewBodyEl);
        } else if (slug === 'aivp') {
            previewController = initAivpPreview(previewBodyEl);
        } else if (slug === 'cyber') {
            previewController = initCyberPreview(previewBodyEl);
        }

        function handleAutoplayToggle(isOn) {
            if (!previewController) return;
            if (isOn) {
                previewController.start();
                if (previewController.startMinorLoop) previewController.startMinorLoop();
            } else {
                previewController.stop();
                if (previewController.stopMinorLoop) previewController.stopMinorLoop();
            }
        }

        if (reducedMotion) {
            if (titleEl) titleEl.textContent = project.title;
            if (badgeEl) badgeEl.textContent = BADGE_TEXT;
            if (subEl) subEl.textContent = SUB_TEXT;
            if (introEl) introEl.textContent = authorIntroText;
            materializePanels();
            revealFooter();
            showSystemStatusInstant();
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
                        if (previewController && previewController.fireBootInterference) {
                            setTimeout(() => {
                                previewController.fireBootInterference();
                            }, RIGHT_COLUMN_OPEN_DONE_MS);
                        }
                        setTimeout(() => {
                            streamText(introEl, authorIntroText, INTRO_TICK_DELAY, null, INTRO_CHARS_PER_TICK);
                        }, PANEL_OPEN_MS);
                        setTimeout(revealFooter, PANEL_IDS.length * PANEL_STAGGER + 300);
                        setTimeout(materializeSystemStatus, PANEL_IDS.length * PANEL_STAGGER + 300);
                    }, 120);
                });
            }, POST_NAME_PAUSE);
        });

        initAutoplayToggle(handleAutoplayToggle);
    });
})();
