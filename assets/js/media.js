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

Throughout the build, I implemented and validated a broad range of Cloudflare services, including DNS, CDN, SSL/TLS, Cache Rules, Cache Purging via API, Load Balancing, Health Checks, Origin Steering Policies, WAF, Bot Fight Mode, Response Header Transform Rules, GitHub Actions CI/CD automation, Analytics, and Cloudflare Pages integration. The result is less about any single feature and more about how these services work together to create a cohesive, resilient platform.

As with all of my projects, documentation accompanies the implementation and serves as a knowledge base and future learning reference. I hope you enjoy exploring it as much as I enjoyed building and testing it!`;

    const HEALTHCARE_AUTHOR_INTRO = `From my studies, I've learned that healthcare IT is where everything I've worked on, from networks and servers to email and security, meets data that has to be both exact and private. This engineering space is a growing healthcare IT and security portfolio: clinical systems, patient-data flows, access control, and isolated networks, with DICOM, PACS, HL7, HIPAA, access management, and network segmentation on the map. It starts with one project, a two-node Orthanc PACS lab, and the standard at its heart deserves a proper introduction.

During my career, I've administered plenty of Application Layer 7 protocols traversing between endpoints. Whether it's analyzing HTTP request logs, tracing SMTP EHLO handshakes and DMARC failures, or auditing SSH key exchanges, none have earned my respect quite like DICOM. Having a networking and infrastructure background, I naturally gravitated toward the protocol side of the standard. Association negotiation, presentation contexts, transfer syntaxes, and the client/server relationship between SCUs and SCPs felt immediately familiar, right before DICOM politely reminded me that I had only scratched the surface: the sheer number of info panels I've added to my personal DICOM Confluence page is a testament to that.

In terms of raw metadata, structure, and domain-specific design, it operates on an entirely different level; some of those headers contain more metadata than a tax return, yet they remain remarkably well organized. Pair DICOM with HL7, and you begin to see how patient registration, orders, modality worklists, image acquisition, storage, reporting, and interoperability come together to form a complete healthcare imaging workflow.

What keeps me invested is the discipline this standard demands from its infrastructure. Imaging environments depend on absolute data integrity; from accession numbers to metadata modules, even a minor timestamp discrepancy can halt a study. That makes the back-end architecture a first-class engineering concern rather than plumbing, and it is exactly the kind of constraint that makes a platform worth building carefully.

The featured implementation, and the first project in this space, builds a realistic healthcare imaging environment from the infrastructure outward, starting with a two-node Orthanc architecture. Deploying a production-style PACS platform on VMware Workstation to replicate a live datacenter environment, while validating associations, analyzing packet captures, and integrating PostgreSQL, has become part of my daily routine as I build practical experience across the DICOM standard, imaging workflows, and interoperability. The goal isn't just to run Orthanc; it's to understand how each layer works together before expanding into Modality Worklists and HL7 integration through Mirth Connect. The more time I spend with it, the more respect I have for the engineering that went into designing a standard that has remained the foundation of medical imaging for decades.

Worklists and Mirth Connect are still planned, not built, and so are security hardening of the lab with TLS, a reverse proxy, and role-based access, and a HIPAA safeguard mapping that walks through each technical safeguard and records how the lab addresses it. Everything runs in an isolated lab on publicly available, anonymized datasets; no real patient data is used at any point.

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


    const FILETRIAGE_AUTHOR_INTRO = `You caught this one mid-build. The repository is being bootstrapped right now, and the engineering documentation will land alongside the first working endpoints.
    
Here's what's taking shape: a metadata-only file triage and orchestration API. Files are submitted, fingerprinted through a streaming SHA-256 intake (large uploads never get buffered whole in memory), and deduplicated by hash with submission counts tracked per sample. Analyses walk a strictly enforced state machine — Queued to Running to Complete or Failed, with every illegal transition rejected — behind a 202-and-poll lifecycle, and verdicts stay locked behind a 409 until the analysis actually finishes. FastAPI, SQLAlchemy 2.x, Pydantic v2, SQLite, and a pytest suite that tests the state machine as a pure function, no HTTP required.

The design goal is simple: prove the orchestration patterns that real triage pipelines rely on — idempotent intake, dedupe, lifecycle state, and gated results — in a codebase small enough to read in one sitting. No payloads are stored, which means the most dangerous thing in this repository is my commit message grammar.

Check back soon; the architecture document and the first case studies are next in the queue.`;

    const CYBER_AUTHOR_INTRO = `Every incident tells a story. The investigator's job is to make sure the evidence tells the same one.

I've spent years in what I would consider a security operations role, even if my title didn't always say cybersecurity. Supporting production infrastructure for regulated organizations meant security wasn't a separate responsibility. It was simply part of the job. Investigating suspicious activity, hardening Linux systems, and securing DNS and email for banking and insurance clients built the foundation that led me here.

This repository represents the part of cybersecurity I enjoy the most: the investigation. Along the way I discovered that Windows is perfectly capable of storing the same answer in seventeen different places, and Eric Zimmerman's tools somehow know where every one of them lives. Disk forensics may have cost me a few hairs, but it gave me a new appreciation for how much evidence modern operating systems leave behind.

Over the years I've worked through CyberDefenders, Security Blue Team, SANS Cyber Ranges, Hack The Box, and just about every acronym the industry has managed to invent. Every platform does something well and every platform has its weaknesses, but together they add up to more than any single course or certification could.

Every investigation here follows the same philosophy. Start with the evidence. Build the timeline. Validate assumptions. Correlate the artifacts. Develop detections. Map the findings to MITRE ATT&CK. Repeat. The objective has never been to race to the answer. It's to understand why the answer is correct. That's why you'll see Splunk SPL, Sigma, Zeek, Suricata, memory analysis, packet captures, and whatever other clues the case decides to leave behind.

One lesson keeps showing up regardless of platform: attackers are remarkably consistent. Obfuscation and masquerading appear everywhere. Phishing, credential harvesting, business email compromise, and unpatched public-facing applications remain the most successful ways in because they still work. The malware changes and the tooling evolves, but the objective rarely does: blend in, avoid detection, accomplish the mission.

Every dataset here is lab-generated or fully sanitized. That means zero active incidents, zero production data, and no real victims were harmed in the making of this lab (and no, we didn't pay any actual ransoms). If these investigations save someone a few hours staring at a packet capture, wondering why a process tree doesn't make sense, or trying to remember which of Eric Zimmerman's forty-seven utilities they're supposed to run next, then this repository did exactly what I hoped.`;

    const SENTINEL_AUTHOR_INTRO = `Dear Microsoft,

We've been through a lot together. At one point during this project, your security ecosystem had me as crisscrossed as the crossed lockpicks on the Penetration Testing project sitting right next door. I lost track of how many portals I had open, which settings had moved, which licensing tier unlocked which feature, and whether I was configuring Microsoft Defender, Microsoft Sentinel, Azure, Microsoft Entra, or all of them at the same time. I'm still not entirely convinced they're different places.

Once the initial confusion settled, though, the bigger picture started to emerge. What you've built is genuinely impressive. I set out to build and demonstrate an EDR lab, but Defender XDR with Microsoft Sentinel stretches far beyond endpoint telemetry. Identity, cloud resources, SIEM, analytics, threat intelligence, compliance, automation, attack simulation, vulnerability management, and incident response all converge into one interconnected ecosystem. I eventually realized this wasn't a technology stack at all but a dependency web, and somewhere along the way I learned what a directed acyclic graph was, mostly by confirming this isn't one. Everything depends on something else, everything feeds something else, and understanding those relationships is just as important as learning the individual products themselves.

I say this with the utmost respect and just a touch of sadness: this project happened right in the middle of Microsoft's portal consolidation, with features migrating between Azure and the unified Defender portal while the documentation raced to keep up. That certainly kept things interesting, to say the least. More than once I found myself wondering whether a setting had moved, been renamed, or simply decided to take the afternoon off. Fortunately, every unexpected detour became another page of documentation, and by the end of the lab I had accumulated enough notes to navigate the ecosystem without needing a trail of browser tabs.

Then there was the challenge of generating enough telemetry to build meaningful detections without accidentally generating an equally meaningful Azure bill. Unfortunately, the $200 Azure credit sat on a billing profile my lab's spend never touched, so every experiment came with a small reminder that security engineering and cost engineering occasionally have very different goals. If you're relying entirely on the free Sentinel trial, you'll quickly learn that the clock starts ticking almost immediately. If you have a Visual Studio subscription, developer benefits, or a generous employer footing the bill, know that I'm only slightly jealous.

What surprised me most wasn't any feature but how the pieces connect. Telemetry becomes investigations, investigations become incidents, incidents become analytics and automation. Less a set of separate products than one platform.

Which brings me to the lesson this repository runs on: a portal summary is not observed endpoint state, and configured does not automatically mean effective.

Far too much to absorb in one pass; it would take another tenant to cover the rest. Some projects end when the documentation is written. This one started there.

So, my dearest Microsoft, in all seriousness, thank you for building one of the richest cybersecurity ecosystems I've worked with. Next time, though, maybe leave the navigation menu alone for at least 30 days... preferably the duration of the free trial.`;

    const PENTEST_AUTHOR_INTRO = `The focus of this project has always been Blue Team, Security Operations, and Incident Response. The objective isn't to become a penetration tester, and I have no current desire to. It's to understand attacks from the inside so investigations become more effective, detections become more intuitive, and defensive decisions become better informed. Although the crossed lockpicks and skull are by far the coolest artwork on my website, I still wield and wear the Blue Shield.

That said, the experience was genuinely enjoyable and valuable, even if I don't foresee pursuing penetration testing as a career path. Setting up remote code execution through a reverse shell is still one of the most satisfying things I've done in IT—eat your heart out, load balancing and XDR. Working through reconnaissance, enumeration, initial access, and privilege escalation from the attacker's perspective builds a stronger instinct for recognizing those same behaviors in logs, telemetry, and alerts.

One of the biggest surprises during my first penetration test was how familiar the investigative process felt. Progress rarely came from a single clever command. It came from validating assumptions, reading output carefully, and following the evidence wherever it led, remarkably similar to troubleshooting production Linux infrastructure, only in reverse, where attention to detail still matters more than finding a shortcut.

I've seen my fair share of WordPress sites attacked and, even worse, compromised, so many of the activities in this repository felt surprisingly familiar. Again, what changed was seeing them from the other side. Utilities like WhatWeb, Gobuster, Searchsploit, and Metasploit demonstrated just how much information can be gathered before an exploit is ever attempted. That experience gave me a much deeper appreciation for the reconnaissance, brute-force attempts, vulnerability scans, and other activity that regularly appears across production Linux servers and Cloudflare analytics. Every investigation here intentionally ends from the defender's perspective by documenting the telemetry generated, the detection opportunity it creates, and the control that breaks the attack chain.

And yes, despite my first penetration test beginning with an "easy" target, it still managed to provide plenty of humbling moments. Cue the privilege escalation. That's the lesson worth keeping: good engineering rewards patience over shortcuts. As always, documented and packaged into GitHub. Happy pentesting.`;

    const LINUX_AUTHOR_INTRO = `One of the first skill sets I picked up, and the one that has given me the most value in my career, was Red Hat Enterprise Linux and how to administer it. I once held the RHCSA, one of the hardest certification exams I've taken and one of the best, because it is entirely hands-on configuration rather than multiple choice (thank goodness for man pages). Along the way I came to admire what Linus Torvalds started in 1991 as a student in his room at his mother's home in Helsinki, and what has since become the foundation much of today's infrastructure runs on.

This Linux Infrastructure engineering space is a growing portfolio hub where I rebuild, by hand, the services, applications, tooling and automation I have had the privilege to work with in production and in the lab, such as the nginx and Apache defaults and best practices that hosting control panels like Plesk set up for you. The work is designed to expose the request paths, trust boundaries, failure modes, and configuration decisions that control panels normally abstract away, while documenting the reasoning behind each implementation rather than presenting configuration files without context. None of it reproduces any company's actual configuration: it is built from personal projects, application documentation, and open-source best practices.

Current projects are developed in a private VMware Workstation Pro lab, using host-only networks for isolated lab traffic and separate NAT management connectivity where configured. They use synthetic hostnames, disposable credentials, and a security-first publication workflow. The active build is secure-mail-platform, a hand-built mail platform that also appears in my Email Authentication & Security space. A hand-built nginx, Apache, and PHP-FPM hosting stack is scaffolded and comes next, with future projects planned across automation, container orchestration, observability, identity, networking, storage, and related Linux platform components (I wish there were more hours in a day and days in a week). The preview remains pending until a project has verified configurations, validation results, and sanitized engineering evidence ready for publication from its repository.

The penguin is concept art and has survived manual validation, but I'm still not sure about this concept, so don't judge it too hard: predict-then-verify has still not been applied to it.`;

    const EMAIL_AUTHOR_INTRO = `Social engineering, BEC and phishing: the bane of every organization, and phishing is still one of the most common ways in. Your favorite employee opens an email that appears to come from a trusted coworker, vendor or confidant > clicks the link > enters a password, runs the installer, or simply approves the payment > HELLO WORLD! One action, and the slide toward lost money or exposed customer data has begun. Get ready for another round of security awareness training.

Email administration has many faces. As an Email Security engineer focused on authentication, I had the privilege of working with most of them, and none more than SPF, DKIM and DMARC: taking client domains from DMARC p=none all the way to p=reject without breaking legitimate mail. Beyond authentication: backend configuration, routing, filtering, TLS and MTA-STS, monitoring, mail clients, you name it. SMTP (and, I suppose, IMAP; ah, the good old days of configuring Outlook) is one of the most satisfying protocols to work with, along with the services built around it.

Those services face two directions, and outbound and inbound mail administration are fundamentally different jobs. One is proving who may send as your domain: only authorized senders on the organization's behalf, delivered where it should land, nothing malicious leaving. The other is trusting nothing that arrives: keeping malicious mail out of the inbox and, when something slips through, making sure nothing harmful follows, down to the human follow-up (the reply, the approved payment, the shared password).

This engineering space is where I rebuild that experience in my own labs and work through the gaps beyond what production asked of me. It covers the platforms, services and reporting tools I've worked with, from Red Sift and Google Workspace in production to Microsoft 365 in the lab. As with most things in security and infrastructure, layered defense is the point, and these labs are designed to show it. It starts at the foundation: a mail platform being built from digital bricks and mortar in an isolated lab, with Postfix, Dovecot, rspamd, Roundcube, BIND and a private CA, and SPF, DKIM and DMARC to be verified by cases that must fail as well as cases that must pass.

That platform, secure-mail-platform, is in progress, and because it's a Linux build, you may also see it listed in my Linux Infrastructure hub. A Red Sift DMARC reporting lab and Microsoft Defender for Office 365 and Google Workspace demos are currently planned, with more to come.

The envelope on this card is concept art: a synthetic SMTP session and abbreviated headers on reserved example names, not a captured message. These concept cards take a lot of creative thinking, shooooooo.`;

    const PROJECTS = {
        cloudflare: {
            title: 'CLOUDFLARE PLATFORM',
            githubUrl: 'https://github.com/valeratech/ryanvalera-com',
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: CLOUDFLARE_AUTHOR_INTRO
        },
        sentinel: {
            title: 'MICROSOFT SENTINEL & DEFENDER XDR',
            githubUrl: 'https://github.com/valeratech/defender-sentinel-soc-lab',
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: SENTINEL_AUTHOR_INTRO
        },
        linux: {
            title: 'LINUX INFRASTRUCTURE',
            githubUrl: 'https://github.com/valeratech/linux-infrastructure-portfolio',
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: LINUX_AUTHOR_INTRO
        },
        healthcare: {
            title: 'HEALTHCARE IT & SECURITY',
            githubUrl: 'https://github.com/valeratech/healthcare-imaging-lab',
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: HEALTHCARE_AUTHOR_INTRO
        },
        email: {
            title: 'EMAIL AUTHENTICATION & SECURITY',
            githubUrl: 'https://github.com/valeratech/email-authentication-security',
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: EMAIL_AUTHOR_INTRO
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
        },
        pentest: {
            title: 'PENETRATION TESTING',
            githubUrl: 'https://github.com/valeratech/penetration-testing-portfolio',
            githubLabel: 'VIEW GITHUB REPOSITORY',
            authorIntro: PENTEST_AUTHOR_INTRO
        }
    };

    // Renamed project keys. An old address (?project=orthanc) still opens its
    // project, and the address bar is rewritten to the current key.
    const PROJECT_ALIASES = { orthanc: 'healthcare' };

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

    function materializePanels(ids) {
        (ids || PANEL_IDS).forEach((id, i) => {
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

    // Header text boxes carry a streamed span and an aria-hidden reserve span
    // (slice C): the stream is the accessible text, the reserve holds the final
    // string so phone mode can lay the box out at its final height before the
    // first character streams (media.css stacks them in one grid cell). On the
    // desktop path the reserve is display:none, so nothing changes there.
    function streamTarget(el) { return el ? (el.querySelector('.media-stream') || el) : null; }
    function setReserve(el, text) { const r = el && el.querySelector('.media-reserve'); if (r) r.textContent = text; }

    const ENGINEERING_NOTE_HTML = '<p class="cf-engineering-note"><strong>\u24d8 Engineering Presentation</strong> — Preview scenes may be cropped, rearranged, or enhanced for clarity while preserving authentic engineering evidence. The "KEY VIDEO WALKTHROUGHS" section is reserved for recordings of the original interface and actual configurations.</p>';

    function markPendingPreview() {
        const panel = document.getElementById('preview-panel');
        const placeholder = document.querySelector('#preview-panel .preview-placeholder-text');
        if (panel) panel.classList.add('is-null-preview');
        if (placeholder) placeholder.textContent = 'PREVIEW PENDING INITIALIZATION';
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
            hud: [['Zone','ryanvalera.com'], ['Plan','Free'], ['DNS','Full setup'], ['Telemetry','30 days']],
            body: `
                <div class="cf-artboard"><div class="cf-stage">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">Overview</div>
                            <h2 class="cf-artboard-title">ryanvalera.com</h2>
                            <p class="cf-artboard-subtitle">Production Cloudflare zone processing traffic through DNS, caching, analytics, and edge controls.</p>
                        </div>
                        <div class="cf-head-side">
                            <div class="cf-ui-pill"><span class="cf-ui-dot"></span> DNS Setup: Full</div>
                            <div class="cf-ui-tag">30 days to 21 Nov 2026</div>
                        </div>
                    </header>
                    <div class="cf-split">
                        <section class="cf-rail cf-tiles">
                            <div class="cf-ui-metric"><span>Unique Visitors</span><strong>1.67k</strong></div>
                            <div class="cf-ui-metric"><span>Total Requests</span><strong>32.19k</strong></div>
                            <div class="cf-ui-metric"><span>Data Served</span><strong>236 MB</strong></div>
                            <div class="cf-ui-metric"><span>Data Cached</span><strong>39 MB</strong></div>
                            <div class="cf-ui-metric is-wide"><div><span>Percent Cached</span><strong>16.66%</strong></div><div class="cf-meter"><i style="width:16.66%"></i></div></div>
                        </section>
                        <div class="cf-main">
                            <section class="cf-ui-panel">
                                <div class="cf-ui-panel-title"><span>Requests by status</span><span class="cf-ui-tag">Top status: 404 Not Found, 17.66k</span></div>
                                <div class="cf-mix-bar"><i class="cf-s2xx" style="flex:3460"></i><i class="cf-s3xx" style="flex:8540"></i><i class="cf-s4xx" style="flex:19930"></i><i class="cf-s5xx" style="flex:280"></i></div>
                                <div class="cf-mix-legend"><span class="cf-s2xx">2xx 3.46k</span><span class="cf-s3xx">3xx 8.54k</span><span class="cf-s4xx">4xx 19.93k</span><span class="cf-s5xx">5xx 280</span></div>
                            </section>
                            <section class="cf-ui-panel">
                                <div class="cf-ui-panel-title"><span>Busiest edge locations</span><span class="cf-ui-tag">requests served</span></div>
                                <div class="cf-bars">
                                    <div class="cf-bar-row"><span>Paris</span><div><i style="width:100.0%"></i></div><b>6.55k</b></div>
                                    <div class="cf-bar-row"><span>Amsterdam</span><div><i style="width:55.6%"></i></div><b>3.64k</b></div>
                                    <div class="cf-bar-row"><span>São Paulo</span><div><i style="width:45.2%"></i></div><b>2.96k</b></div>
                                    <div class="cf-bar-row"><span>Singapore</span><div><i style="width:39.8%"></i></div><b>2.61k</b></div>
                                    <div class="cf-bar-row"><span>Frankfurt</span><div><i style="width:34.0%"></i></div><b>2.23k</b></div>
                                    <div class="cf-bar-row"><span>Ashburn</span><div><i style="width:24.1%"></i></div><b>1.58k</b></div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div></div>`
        },
        {
            title: '02 // DNS ARCHITECTURE',
            motion: 'zoom-in',
            hud: [['Records','9'], ['Proxied','Apex · www'], ['Origin hosts','DNS only'], ['Mail','Null MX']],
            body: `
                <div class="cf-artboard"><div class="cf-stage">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">DNS</div>
                            <h2 class="cf-artboard-title">DNS Architecture</h2>
                            <p class="cf-artboard-subtitle">The apex is a load balancer, www exists only to redirect, and the origin hostnames stay DNS only.</p>
                        </div>
                        <div class="cf-head-side">
                            <div class="cf-ui-pill"><span class="cf-ui-dot"></span> DNS Setup: Full</div>
                            <div class="cf-ui-tag">Captured 21 Nov 2026</div>
                        </div>
                    </header>
                    <div class="cf-split">
                        <section class="cf-rail">
                            <div class="cf-ui-panel">
                                <div class="cf-ui-panel-title"><span>Where each name leads</span></div>
                                <div class="cf-paths">
                                    <div class="cf-path-row"><span class="cf-node is-name">ryanvalera.com</span><span class="cf-arrow">→</span><span class="cf-node is-edge">load balancer</span><span class="cf-arrow">→</span><span class="cf-node">2 pools</span></div>
                                    <div class="cf-path-row"><span class="cf-node is-name">www</span><span class="cf-arrow">→</span><span class="cf-node is-edge">301 at the edge</span><span class="cf-arrow">→</span><span class="cf-node is-name">ryanvalera.com</span></div>
                                    <div class="cf-path-row"><span class="cf-node is-name">gh</span><span class="cf-node is-name">pages</span><span class="cf-arrow">→</span><span class="cf-node">origin hostnames</span></div>
                                </div>
                            </div>
                        </section>
                        <div class="cf-main">
                            <section class="cf-ui-panel cf-dns-table">
                                <div class="cf-dns-row cf-dns-head"><span>Type</span><span>Name</span><span>Content</span><span>Proxy</span></div>
                                <div class="cf-dns-row"><span class="cf-record-type">LB</span><div><div class="cf-record-name">ryanvalera.com</div><div class="cf-record-role">Production hostname</div></div><div class="cf-record-target">2 pools</div><span class="cf-ui-pill is-proxied">Proxied</span></div>
                                <div class="cf-dns-row"><span class="cf-record-type">A</span><div><div class="cf-record-name">www.ryanvalera.com</div><div class="cf-record-role">Redirect placeholder</div></div><div class="cf-record-target">192.0.2.1</div><span class="cf-ui-pill is-proxied">Proxied</span></div>
                                <div class="cf-dns-row"><span class="cf-record-type">CNAME</span><div><div class="cf-record-name">gh.ryanvalera.com</div><div class="cf-record-role">Primary origin hostname</div></div><div class="cf-record-target">valeratech.github.io</div><span class="cf-ui-pill is-dnsonly">DNS only</span></div>
                                <div class="cf-dns-row"><span class="cf-record-type">CNAME</span><div><div class="cf-record-name">pages.ryanvalera.com</div><div class="cf-record-role">Secondary origin hostname</div></div><div class="cf-record-target">ryanvalera-com.pages.dev</div><span class="cf-ui-pill is-dnsonly">DNS only</span></div>
                            </section>
                            <section class="cf-ui-panel">
                                <div class="cf-ui-panel-title"><span>Mail lockdown</span><span class="cf-ui-tag">9 records: A and 2 CNAME above, 5 mail, 1 verification</span></div>
                                <div class="cf-chip-row"><em>null MX</em><em>SPF -all</em><em>DMARC p=reject</em><em>DKIM revoked</em></div>
                            </section>
                        </div>
                    </div>
                </div></div>`
        },
        {
            title: '03 // CACHE GOVERNANCE',
            motion: 'zoom-in',
            hud: [['Rules','2 active'], ['Response rules','None'], ['Assets edge TTL','1 month'], ['HTML edge TTL','10 min']],
            body: `
                <div class="cf-artboard"><div class="cf-stage">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">Caching</div>
                            <h2 class="cf-artboard-title">Cache Governance</h2>
                            <p class="cf-artboard-subtitle">Two cache rules set what the edge may store and the TTLs it is given. No deploy step purges.</p>
                        </div>
                        <div class="cf-head-side">
                            <div class="cf-ui-pill"><span class="cf-ui-dot"></span> 2 active</div>
                            <div class="cf-ui-tag">Captured 21 Nov 2026</div>
                        </div>
                    </header>
                    <div class="cf-split">
                        <section class="cf-rail">
                            <div class="cf-ui-panel">
                                <div class="cf-ui-panel-title"><span>On deploy</span><span class="cf-ui-tag">no purge</span></div>
                                <p class="cf-note">A changed asset ships under a new <code>?v=</code> version, so its URL changes. HTML is left to its rule: 10-minute TTLs, as configured.</p>
                                <div class="cf-strip"><span>Cache Response Rules</span><strong>None created</strong></div>
                            </div>
                        </section>
                        <div class="cf-main">
                            <article class="cf-ui-panel">
                                <div class="cf-rule-name"><span class="cf-rule-order">1</span>Static Assets Cache<span class="cf-ui-pill"><span class="cf-ui-dot"></span> Active</span></div>
                                <div class="cf-rule-section"><span>Match</span><strong>URI Path contains /assets/</strong></div>
                                <div class="cf-rule-section"><span>Action</span><div class="cf-chip-row"><em>Eligible for cache</em><em>Edge TTL 1 month</em><em>Browser TTL 7 days</em></div></div>
                            </article>
                            <article class="cf-ui-panel">
                                <div class="cf-rule-name"><span class="cf-rule-order">2</span>HTML Revalidation<span class="cf-ui-pill"><span class="cf-ui-dot"></span> Active</span></div>
                                <div class="cf-rule-section"><span>Match</span><strong>URI Path ends with .html, URI Path equals /</strong></div>
                                <div class="cf-rule-section"><span>Action</span><div class="cf-chip-row"><em>Eligible for cache</em><em>Edge TTL 10 min</em><em>Browser TTL 10 min</em></div></div>
                            </article>
                        </div>
                    </div>
                </div></div>`
        },
        {
            title: '04 // LOAD BALANCER',
            motion: 'zoom-in',
            hud: [['Status','Healthy'], ['Steering','Off'], ['Pools','2 of 2'], ['Endpoints','2 of 2']],
            body: `
                <div class="cf-artboard"><div class="cf-stage">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">Traffic</div>
                            <h2 class="cf-artboard-title">Load Balancer</h2>
                            <p class="cf-artboard-subtitle">One load balancer, two static origins. Steering is off, so pools are tried in failover order.</p>
                        </div>
                        <div class="cf-head-side">
                            <div class="cf-ui-pill"><span class="cf-ui-dot"></span> Healthy</div>
                            <div class="cf-ui-tag">Captured 21 Nov 2026</div>
                        </div>
                    </header>
                    <div class="cf-split">
                        <section class="cf-rail">
                            <div class="cf-ui-panel">
                                <div class="cf-ui-panel-title"><span>ryanvalera.com</span><span class="cf-ui-tag">Public load balancer</span></div>
                                <div class="cf-tiles">
                                    <div class="cf-ui-metric"><span>Pools</span><strong>2 of 2</strong></div>
                                    <div class="cf-ui-metric"><span>Endpoints</span><strong>2 of 2</strong></div>
                                    <div class="cf-ui-metric is-wide"><div><span>Traffic steering</span><strong>Off: failover order</strong></div></div>
                                </div>
                            </div>
                        </section>
                        <div class="cf-main">
                            <div class="cf-origin-row">
                                <article class="cf-ui-panel">
                                    <div class="cf-origin-label"><strong>GitHub Pages</strong><span class="cf-ui-pill"><span class="cf-ui-dot"></span> Healthy</span></div>
                                    <div class="cf-origin-type">1 · github-pages-primary</div>
                                    <div class="cf-kv"><span>Endpoint</span><strong>valeratech.github.io</strong><span>Host</span><strong>gh.ryanvalera.com</strong></div>
                                </article>
                                <article class="cf-ui-panel">
                                    <div class="cf-origin-label"><strong>Cloudflare Pages</strong><span class="cf-ui-pill"><span class="cf-ui-dot"></span> Healthy</span></div>
                                    <div class="cf-origin-type">2 · cloudflare-pages-secondary</div>
                                    <div class="cf-kv"><span>Endpoint</span><strong>pages.ryanvalera.com</strong><span>Host</span><strong>pages.ryanvalera.com</strong></div>
                                </article>
                            </div>
                            <section class="cf-ui-panel">
                                <div class="cf-origin-label"><strong>Monitor: HTTPS Health Check</strong><span class="cf-ui-tag">both pools</span></div>
                                <p class="cf-note">GET / every 60 s. Healthy means a 200 with the expected text in the body.</p>
                            </section>
                            <section class="cf-ui-panel">
                                <div class="cf-path-row"><span class="cf-node">Request</span><span class="cf-arrow">→</span><span class="cf-node">Edge rules</span><span class="cf-arrow">→</span><span class="cf-node is-edge">Load balancer</span><span class="cf-arrow">→</span><span class="cf-node">Pool 1, else pool 2</span></div>
                                <p class="cf-note cf-note-small">Failover order is configured. A controlled failover and failback test is still open.</p>
                            </section>
                        </div>
                    </div>
                </div></div>`
        },
        {
            title: '05 // CI/CD AUTOMATION',
            motion: 'zoom-in',
            hud: [['Trigger','Push to main'], ['Deploy purge','None'], ['Gates','Secrets · EXIF · env'], ['Origin builds','2']],
            body: `
                <div class="cf-artboard github"><div class="cf-stage">
                    <header class="gh-header">
                        <div>
                            <div class="gh-back">← valeratech/ryanvalera-com · Actions</div>
                            <h2 class="gh-title">Push to main</h2>
                            <div class="gh-meta">One push builds both origins from the same allowlist and runs the security gates.</div>
                        </div>
                        <div class="cf-ui-tag">Captured 21 Nov 2026</div>
                    </header>
                    <div class="cf-split">
                        <section class="cf-rail">
                            <div class="gh-panel gh-workflow">
                                <div class="gh-workflow-title"><strong>On every push</strong><span class="gh-badge">2 workflows</span></div>
                                <div class="gh-pipeline">
                                    <div class="gh-step"><div class="gh-step-icon">1</div><strong>pages-website-only / build</strong><span>allowlist: 38</span></div>
                                    <div class="gh-step"><div class="gh-step-icon">2</div><strong>pages-website-only / deploy</strong><span>GitHub Pages</span></div>
                                    <div class="gh-step"><div class="gh-step-icon">3</div><strong>security-gates</strong><span>3 checks</span></div>
                                    <div class="gh-step is-pages"><div class="gh-step-icon">☁</div><strong>Cloudflare Pages build</strong><span>allowlist: 38</span></div>
                                </div>
                            </div>
                        </section>
                        <div class="cf-main">
                            <section class="gh-panel gh-log-panel">
                                <div class="gh-log-head"><span>Cloudflare Pages: production deployments</span><span class="gh-badge">Latest 5 succeeded</span></div>
                                <div class="gh-log-body">
                                    <div class="gh-log-line"><span>✓</span><b>db05a0c</b><code>feat(portal): reorder the project cards and match the Profile list</code></div>
                                    <div class="gh-log-line"><span>✓</span><b>ff43f6d</b><code>feat(portal): add the Email Authentication and Security card and media page</code></div>
                                    <div class="gh-log-line"><span>✓</span><b>722ea73</b><code>feat(portal): make the Orthanc card the Healthcare IT and Security hub</code></div>
                                    <div class="gh-log-line"><span>✓</span><b>39c5c05</b><code>feat(profile): raise and darken the portrait rail skyline</code></div>
                                    <div class="gh-log-line"><span>✓</span><b>433fbb3</b><code>feat(profile): replace the portrait rail graphics with a skyline background</code></div>
                                </div>
                            </section>
                            <div class="cf-callout"><strong>No purge on deploy</strong><span>Assets carry ?v= versions; the HTML rule is set to 10-minute TTLs. The purge workflow was retired on 10 Oct 2026.</span></div>
                            <p class="cf-note cf-note-small">Gates: gitleaks on full history, image metadata, environment files.<br>Pages workflow: ubuntu-24.04 runner, actions pinned to commit SHAs.</p>
                        </div>
                    </div>
                </div></div>`
        },
        {
            title: '06 // SECURITY LAYER',
            motion: 'zoom-in',
            hud: [['SSL/TLS','Full (strict)'], ['WAF','Managed ruleset'], ['Bots','Fight Mode on'], ['Min TLS','1.2']],
            body: `
                <div class="cf-artboard"><div class="cf-stage">
                    <header class="cf-artboard-header">
                        <div>
                            <div class="cf-artboard-eyebrow">Security</div>
                            <h2 class="cf-artboard-title">Security Layer</h2>
                            <p class="cf-artboard-subtitle">TLS on both hops, Cloudflare's managed protection at the edge, and two response-header rules.</p>
                        </div>
                        <div class="cf-head-side">
                            <div class="cf-ui-pill"><span class="cf-ui-dot"></span> Full (strict)</div>
                            <div class="cf-ui-tag">Captured 21 Nov 2026</div>
                        </div>
                    </header>
                    <div class="cf-split">
                        <section class="cf-rail">
                            <div class="cf-ui-panel">
                                <div class="cf-ssl-flow"><span class="cf-ssl-node">Browser</span><span class="cf-ssl-arrow">🔒 →</span><span class="cf-ssl-node">Cloudflare</span><span class="cf-ssl-arrow">🔒 →</span><span class="cf-ssl-node">Origin</span></div>
                                <div class="cf-security-metrics">
                                    <div><span>TLS 1.3</span><strong>On</strong></div>
                                    <div><span>Minimum TLS</span><strong>1.2</strong></div>
                                    <div><span>Always Use HTTPS</span><strong>On</strong></div>
                                    <div><span>Edge certificate</span><strong>Universal</strong></div>
                                </div>
                            </div>
                        </section>
                        <div class="cf-main">
                            <div class="cf-sec-row">
                                <section class="cf-ui-panel cf-sec-list">
                                    <div class="cf-ui-panel-title"><span>Edge protection</span><span class="cf-ui-tag">Free plan</span></div>
                                    <div class="cf-sec-item"><span>Managed ruleset</span><span class="cf-state">Always active</span></div>
                                    <div class="cf-sec-item"><span>DDoS protection</span><span class="cf-state">Always active</span></div>
                                    <div class="cf-sec-item"><span>Bot Fight Mode</span><span class="cf-state">On</span></div>
                                    <div class="cf-sec-item"><span>Browser Integrity Check</span><span class="cf-state">On</span></div>
                                </section>
                                <section class="cf-ui-panel cf-sec-list">
                                    <div class="cf-ui-panel-title"><span>Uninvited requests</span><span class="cf-ui-tag">30 days</span></div>
                                    <div class="cf-probe"><span>/.env.development</span><b>280</b></div>
                                    <div class="cf-probe"><span>/secrets.yml</span><b>250</b></div>
                                    <div class="cf-probe"><span>/.env</span><b>210</b></div>
                                    <div class="cf-probe"><span>/static/.env</span><b>200</b></div>
                                </section>
                            </div>
                            <section class="cf-ui-panel cf-sec-list">
                                <div class="cf-ui-panel-title"><span>Response header rules</span><span class="cf-ui-tag">2 active</span></div>
                                <div class="cf-sec-item"><span>Add Security Headers<small>Permissions-Policy, Referrer-Policy</small></span><span class="cf-state">Active</span></div>
                                <div class="cf-sec-item"><span>Remove Origin Fingerprinting Headers<small>via, x-cache, x-cache-hits, x-fastly-request-id</small></span><span class="cf-state">Active</span></div>
                            </section>
                        </div>
                    </div>
                </div></div>`
        },
        {
            title: '07 // LIVE PLATFORM',
            motion: 'zoom-out',
            hud: [['Site','ryanvalera.com'], ['Projects','10 active'], ['Slots','2 reserved'], ['Build allowlist','38 files']],
            body: `
                <div class="cf-artboard portal"><div class="cf-stage">
                    <div class="cf-split">
                        <section class="cf-rail cf-portal-head">
                            <div class="cf-return">← Return to Professional Dossier</div>
                            <h2 class="cf-portal-title">Engineering<br>Portal</h2>
                            <div class="cf-kicker">Security Operations<br>Infrastructure<br>Automation</div>
                            <div><span class="cf-system">System Status <span>Operational</span></span></div>
                            <p class="cf-portal-caption">Five pages, 38 files in the build allowlist, two origins behind one hostname.</p>
                        </section>
                        <div class="cf-main">
                            <div class="cf-portal-grid">
                                <article class="cf-project-card is-current"><span class="cf-card-no">01</span><div><div class="cf-card-title">Cloudflare Platform</div><div class="cf-here">You are here</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">02</span><div><div class="cf-card-title">Email Authentication &amp; Security</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">03</span><div><div class="cf-card-title">Linux Infrastructure</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">04</span><div><div class="cf-card-title">Cybersecurity Investigations</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">05</span><div><div class="cf-card-title">Microsoft Sentinel &amp; Defender XDR</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">06</span><div><div class="cf-card-title">Penetration Testing</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">07</span><div><div class="cf-card-title">File Triage Orchestration API</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">08</span><div><div class="cf-card-title">AI Engineering Validation Platform</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">09</span><div><div class="cf-card-title">AWS Reliability Layer</div></div></article>
                                <article class="cf-project-card"><span class="cf-card-no">10</span><div><div class="cf-card-title">Healthcare IT &amp; Security</div></div></article>
                                <article class="cf-pending">Pending initialization<br>// Project slot reserved</article>
                                <article class="cf-pending">Pending initialization<br>// Project slot reserved</article>
                            </div>
                            <div class="cf-portal-footer"><span class="cf-ui-tag">Captured 21 Nov 2026</span></div>
                        </div>
                    </div>
                </div></div>`
        }
    ];

    const CF_SCENE_INTERVAL_MS = 5200;

    function renderCloudflareScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    // ── Healthcare IT & Security: Orthanc lab scenes ──────
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
<div class="or-term-art"><section class="or-term-window"><div class="or-term-title"><div class="or-term-plus"></div><div class="or-term-title-text">valeratech@orthanc-primary: ~ — ssh valeratech@orthanc-primary</div><div class="or-term-icons"><span>▢</span><span>☰</span><span>×</span></div></div><div class="or-term-body"><span class="or-prompt">valeratech@orthanc-primary</span>:~$ sudo systemctl status orthanc\n● orthanc.service - Orthanc DICOM server\n     Loaded: loaded (/usr/lib/systemd/system/orthanc.service; <span class="or-green">enabled</span>; preset: enabled)\n     Active: <span class="or-green">active (running)</span> since Tue 2026-07-07 20:18:42 PDT; 14min ago\n       Docs: https://orthanc.uclouvain.be/book/\n   Main PID: 703 (Orthanc)\n      Tasks: 18 (limit: 4558)\n     Memory: 92.4M\n        CPU: 2.1s\n     CGroup: /system.slice/orthanc.service\n             └─703 /usr/sbin/Orthanc --logdir=/var/log/orthanc /etc/orthanc\n\nJul 07 orthanc-primary Orthanc[703]: HTTP server listening on port: 8042\nJul 07 orthanc-primary Orthanc[703]: DICOM server listening on port: 4242\nJul 07 orthanc-primary Orthanc[703]: PostgreSQL index plugin initialized</div></section></div>
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
<div class="or-api-art"><div class="or-browser-bar"><div>← → ↻</div><div class="or-address">🛡 http://orthanc-primary:8042/system</div><div class="or-zoom">90% ☆ ☰</div></div><div class="or-tabs"><div class="or-tab or-active">JSON</div><div>Raw Data</div><div>Headers</div></div><div class="or-tools">Save&nbsp;&nbsp; Copy&nbsp;&nbsp; Collapse All&nbsp;&nbsp; Expand All&nbsp;&nbsp; ◇ Filter JSON</div><section class="or-json-view"><div class="or-row"><span class="or-key">ApiVersion:</span><span class="or-value or-green">22</span></div><div class="or-row"><span class="or-key">CheckRevisions:</span><span class="or-value or-green">false</span></div><div class="or-row"><span class="or-key">DatabaseBackendPlugin:</span><span class="or-value or-pink">"/usr/lib/orthanc/libOrthancPostgreSQLIndex.so.5.0"</span></div><div class="or-row"><span class="or-key">DatabaseServerIdentifier:</span><span class="or-value or-gray"><span class="or-redact">REDACTED</span></span></div><div class="or-row"><span class="or-key">DatabaseVersion:</span><span class="or-value or-green">6</span></div><div class="or-row"><span class="or-key">DicomAet:</span><span class="or-value or-pink">"ORTHANC-PRIMARY"</span></div><div class="or-row"><span class="or-key">DicomPort:</span><span class="or-value or-green">4242</span></div><div class="or-row"><span class="or-key">HasLabels:</span><span class="or-value or-green">true</span></div><div class="or-row"><span class="or-key">HttpPort:</span><span class="or-value or-green">8042</span></div><div class="or-row"><span class="or-key">IngestTranscoding:</span><span class="or-value or-pink">""</span></div><div class="or-row"><span class="or-key">IsHttpServerSecure:</span><span class="or-value or-green">true</span></div><div class="or-row"><span class="or-key">MainDicomTags:</span><span></span></div><div class="or-nested"><div class="or-row"><span class="or-key">Instance:</span><span class="or-value or-pink">"0008,0012;0008,0013;0008,0018;0020,0012..."</span></div><div class="or-row"><span class="or-key">Patient:</span><span class="or-value or-pink">"0010,0010;0010,0020;0010,0030;0010,0040"</span></div><div class="or-row"><span class="or-key">Series:</span><span class="or-value or-pink">"0008,0021;0008,0031;0008,0060;0020,000e..."</span></div><div class="or-row"><span class="or-key">Study:</span><span class="or-value or-pink">"0008,0020;0008,0030;0008,0050;0008,1030..."</span></div></div><div class="or-row"><span class="or-key">MaximumStorageMode:</span><span class="or-value or-pink">"Recycle"</span></div><div class="or-row"><span class="or-key">Name:</span><span class="or-value or-pink">"ORTHANC-PRIMARY"</span></div><div class="or-row"><span class="or-key">OverwriteInstances:</span><span class="or-value or-green">false</span></div><div class="or-row"><span class="or-key">PluginsEnabled:</span><span class="or-value or-green">true</span></div><div class="or-row or-highlight"><span class="or-key">StorageCompression:</span><span class="or-value or-green">false</span></div><div class="or-row"><span class="or-key">UserMetadata:</span><span class="or-value or-gray">{}</span></div><div class="or-row"><span class="or-key">Version:</span><span class="or-value or-pink">"1.12.2"</span></div></section><aside class="or-summary"><div class="or-summary-head">REST API /system</div><div class="or-summary-grid"><div class="or-summary-cell"><span>Node</span><strong>ORTHANC-PRIMARY</strong></div><div class="or-summary-cell"><span>Version</span><strong>1.12.2</strong></div><div class="or-summary-cell"><span>DICOM</span><strong>4242</strong></div><div class="or-summary-cell"><span>REST</span><strong>8042</strong></div><div class="or-summary-cell"><span>Database</span><strong>PostgreSQL</strong></div><div class="or-summary-cell"><span>Identifier</span><strong>Redacted</strong></div></div></aside></div>
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


    // ── Microsoft Sentinel & Defender XDR scenes ──────────
    const SENTINEL_SCENE_INTERVAL_MS = 7600;

    // Scene values are transcribed from the public lab record
    // (valeratech/defender-sentinel-soc-lab); every other word is
    // interface wording. See docs/media-preview.md, Evidence Tier.
    const SENTINEL_SCENES = [
        {
            title: '01 // DEFENDER TO SENTINEL',
            motion: 'zoom-in',
            hud: [['Lab','04'], ['Built','2026-07-19'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 04</span><h2 class="sen-title">Sentinel Workspace: Deployment and the Defender Pipeline</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-sen">
            <div class="sen-winbar"><i></i><b>Microsoft Sentinel</b><span>Validation</span><em>The lab is proven only if a live event travels the full pipeline. It does.</em></div>
            <div class="sen-body">
                <div class="sen-flow"><span class="sen-node">Endpoint (LAB-WIN11-01 — Lab 03 sensor)</span><span class="sen-edge">detection test →</span><span class="sen-node">Defender for Endpoint (EDR alert)</span><span class="sen-edge">→</span><span class="sen-node">Defender XDR (incident correlation)</span><span class="sen-edge">connector, ~2 min, forward-only →</span><span class="sen-node is-end">Microsoft Sentinel (SecurityIncident, ProviderName: Microsoft XDR)</span><span class="sen-k">✅</span></div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c01 is-h"><span>Check</span><span>Method</span><span></span><span>Result</span></div>
                    <div class="sen-tr sen-c01"><span>Sentinel enabled</span><span>Trial banner</span><span class="sen-k">✅</span><span>2026-07-19 → 2026-08-19, 10 GB/day free</span></div>
                    <div class="sen-tr sen-c01"><span>Connector connected</span><span>Data connectors / Defender portal SIEM workspaces</span><span class="sen-k">✅</span><span>Connected, Primary</span></div>
                    <div class="sen-tr sen-c01"><span>Cost-safe — raw events NOT streaming</span><span>DeviceEvents in Sentinel Logs</span><span class="sen-k">✅</span><span>table absent (query fails to resolve) — raw streaming off, billed path not running</span></div>
                    <div class="sen-tr sen-c01"><span>Pipeline — event reaches Sentinel</span><span>Detection test → SecurityIncident in Sentinel</span><span class="sen-k">✅</span><span>"Execution incident on one endpoint", ProviderName: Microsoft XDR</span></div>
                </div>
                <div class="sen-strip">
                    <span>The sync latency</span>
                    <span>Detection test → Defender alert (Lab 03 measure) <b>~2 min</b></span>
                    <span>Defender alert → Sentinel SecurityIncident <b>~2 min</b></span>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/04-sentinel-workspace/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>Every arrow is measured; every stage is proven from a single live event.</span></p>
                <p class="sen-f"><span class="sen-chip is-not">Limit</span><span>The Defender XDR connector is a forward stream — it syncs incidents created after connection, not history.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '02 // ENDPOINT ONBOARDING',
            motion: 'zoom-in',
            hud: [['Lab','03'], ['Built','2026-07-18'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 03</span><h2 class="sen-title">Endpoint Onboarding and First Alerts</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-mde">
            <div class="sen-winbar"><i></i><b>Defender for Endpoint</b><span>Validation</span><em>Every row below was observed, not assumed.</em></div>
            <div class="sen-body">
                <div class="sen-tbl">
                    <div class="sen-tr sen-c02 is-h"><span>Check</span><span>Method</span><span>Expected</span><span></span><span>Result</span></div>
                    <div class="sen-tr sen-c02"><span>Device in inventory</span><span>Defender → Assets → Devices</span><span>Appears after onboard</span><span class="sen-k">✅</span><span>LAB-WIN11-01, AAD-joined, Workstation</span></div>
                    <div class="sen-tr sen-c02"><span>Detection→alert→incident</span><span>Run detection test, watch Incidents</span><span>Alert, correlated to an incident</span><span class="sen-k">✅</span><span>"Suspicious PowerShell command line" (Medium), grouped into "Execution incident on one endpoint"</span></div>
                    <div class="sen-tr sen-c02"><span>ATT&amp;CK mapping</span><span>Incident → alert summary</span><span>A technique, Defender-assigned</span><span class="sen-k">✅</span><span>T1059.001 PowerShell (Execution)</span></div>
                    <div class="sen-tr sen-c02"><span>Remediation actions logged</span><span>Action center → History</span><span>(expected ≥1)</span><span class="sen-k">⚠️</span><span>"No actions found" — investigation ran, nothing was remediable.</span></div>
                </div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c02b is-h"><span>Latency</span><span>Vendor number</span><span>Measured</span></div>
                    <div class="sen-tr sen-c02b"><span>Onboard → device in inventory</span><span>5–30 min (local-script onboarding guide); ~10 min (guide 3)</span><span>~2 min</span></div>
                    <div class="sen-tr sen-c02b"><span>Onboard → first telemetry ingested</span><span>not stated</span><span>~3.5 min</span></div>
                    <div class="sen-tr sen-c02b"><span>Detection test → alert visible</span><span>"a few minutes"</span><span>~2 min</span></div>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/03-endpoint-onboarding/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>Every measured latency is at or under the vendor floor.</span></p>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>No automated attack disruption fired — correct for a Medium synthetic test; the platform chose not to contain.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '03 // ASR AUDIT VS BLOCK',
            motion: 'zoom-in',
            hud: [['Lab','06'], ['Detection','DET-002'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 06</span><h2 class="sen-title">Attack Surface Reduction Rules</h2><span class="sen-tag">🔨 Built, documentation in progress</span></header>
        <section class="sen-win is-hunt">
            <div class="sen-winbar"><i></i><b>Advanced hunting</b><span>ASR rule activity — audit vs block — Lab 06</span><em>Same rule, same trigger, one state change, opposite outcome</em></div>
            <div class="sen-body">
                <div class="sen-term"><div class="sen-l">DeviceEvents</div><div class="sen-l">| where DeviceName startswith "lab-win11"</div><div class="sen-l">| where ActionType startswith "Asr"</div><div class="sen-l">| where Timestamp &gt; ago(30d)</div><div class="sen-l">| extend State = iff(ActionType endswith "Blocked", "BLOCKED", "audited")</div><div class="sen-l">| summarize Count = count() by State, bin(Timestamp, 1d)</div><div class="sen-l">| order by Timestamp asc</div></div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c03 is-h"><span></span><span>Audit run</span><span>Block run</span></div>
                    <div class="sen-tr sen-c03"><span>Invoke-CimMethod ReturnValue</span><span class="sen-m">0 (success)</span><span class="sen-m">2 (access denied)</span></div>
                    <div class="sen-tr sen-c03"><span>User-visible</span><span class="sen-m">nothing (silent)</span><span class="sen-m">block notification</span></div>
                    <div class="sen-tr sen-c03"><span>Local event (Defender Operational log)</span><span class="sen-m">1122 (audited)</span><span class="sen-m">1121 (blocked)</span></div>
                    <div class="sen-tr sen-c03"><span>Cloud ActionType (DeviceEvents)</span><span class="sen-m">AsrPsexecWmiChildProcessAudited</span><span class="sen-m">AsrPsexecWmiChildProcessBlocked</span></div>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/06-attack-surface-reduction/</code><code>DET-002-asr-wmi-process-creation.md</code><code>asr-audit-vs-block.kql</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>Always split on the suffix — it is the state.</span></p>
                <p class="sen-f"><span class="sen-chip is-not">Limit</span><span>Verify ASR activity in Advanced hunting, not the ASR report.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '04 // PREVENTION AND AIR',
            motion: 'zoom-in',
            hud: [['Lab','22'], ['Built','2026-08-10'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 22</span><h2 class="sen-title">Endpoint Prevention and Automated Investigation: What Audit Mode Did Not Audit</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-mde">
            <div class="sen-winbar"><i></i><b>Defender for Endpoint</b><span>Phase A — endpoint prevention, measured at the endpoint</span></div>
            <div class="sen-body">
                <div class="sen-note">Two files were downloaded to the same machine, the same way, minutes apart.</div>
                <div class="sen-cols sen-g04">
                    <div class="sen-pane">
                        <div class="sen-pane-h">The configuration read</div>
                        <div class="sen-term"><div class="sen-l">PUAProtection            : 2      # audit, not block</div><div class="sen-l">DisableRealtimeMonitoring: False</div><div class="sen-l">MAPSReporting            : 2</div><div class="sen-l">SubmitSamplesConsent     : 1</div></div>
                    </div>
                    <div class="sen-pane"><div class="sen-pane-h">The PUA download</div><div class="sen-note">no threat object on the device</div><div class="sen-note">no event 1116 (malware detected)</div><div class="sen-note">no event 1117 (action taken)</div><div class="sen-note">no toast</div></div>
                    <div class="sen-pane"><div class="sen-pane-h">The positive control that makes it conclusive</div><div class="sen-note">immediate Threats found toast</div><div class="sen-note">1116 and 1117</div><div class="sen-note">threat object Virus:DOS/EICAR_Test_File, SeverityID 5, IsActive False</div><div class="sen-note">file removed from disk</div></div>
                </div>
                <div class="sen-pane-h">The cloud reached a verdict the endpoint never reached</div>
                <div class="sen-note">The investigation&#39;s Evidence tab lists the PUA artefact as f_000045, verdict Malicious, remediation status Pending approval, first seen 5:19 PM. Its detection origin is a log step — Find recently created or modified executable files — not an alert. f_000045 is an Edge cache filename. The entity carries no original filename on any surface.</div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/22-endpoint-prevention-and-air/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-not">Finding</span><span>Audit mode&#39;s entire deliverable is the audit trail. There was no audit trail.</span></p>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>Two engines, one file, opposite records: local silence, cloud verdict of Malicious.</span></p>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>An auditing control that silently fails produces exactly the same evidence as an environment with nothing to audit.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '05 // INGESTION AND COST',
            motion: 'zoom-in',
            hud: [['Labs','08 + 07'], ['Usage read','2026-07-29'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 08</span><h2 class="sen-title">Entra ID and Azure Activity Connectors</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-sen">
            <div class="sen-winbar"><i></i><b>Microsoft Sentinel</b><span>The connector-tiers model</span><em>"connected is not flowing"</em></div>
            <div class="sen-body">
                <div class="sen-tbl">
                    <div class="sen-tr sen-c05 is-h"><span>Tier</span><span>Example</span><span>Config needed</span></div>
                    <div class="sen-tr sen-c05"><span>Same platform</span><span>Defender XDR (Lab 04)</span><span>~none — auto-connected</span></div>
                    <div class="sen-tr sen-c05"><span>Your resource, external disk</span><span>Windows events / AMA (Lab 07)</span><span>Agent + DCR</span></div>
                    <div class="sen-tr sen-c05"><span>Separate service with its own logging</span><span>Azure Activity, Entra ID (Lab 08)</span><span>Reconfigure that service to export (diagnostic setting / policy) + licensing</span></div>
                </div>
                <div class="sen-pane-h">Lab 07 · Windows Security Events via AMA · ✅ Built, documented, validated · Validation</div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c05b is-h"><span>Check</span><span>Query</span><span></span><span>Result</span></div>
                    <div class="sen-tr sen-c05b"><span>Agent alive</span><span class="sen-m">Heartbeat | where TimeGenerated &gt; ago(30m)</span><span class="sen-k">✅</span><span>10 heartbeats, SCAgentChannel: Direct</span></div>
                    <div class="sen-tr sen-c05b"><span>Events landing</span><span class="sen-m">SecurityEvent | where TimeGenerated &gt; ago(30m)</span><span class="sen-k">✅</span><span>rows present — EventID 4688 (process creation), 4673 (privileged service)</span></div>
                    <div class="sen-tr sen-c05b"><span>Which table</span><span>(the above)</span><span class="sen-k">✅</span><span>SecurityEvent, not WindowsEvent — confirms the direct-AMA path</span></div>
                </div>
                <div class="sen-note">A Usage | where IsBillable == true query on 2026-07-29 returned three: SigninLogs, AuditLogs, IdentityInfo.</div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/08-entra-azure-activity-connectors/</code><code>labs/07-windows-security-events/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>This also establishes that SecurityAlert and SecurityIncident are free — the entire Defender XDR → Sentinel path built in Lab 04 costs nothing to carry.</span></p>
                <p class="sen-f"><span class="sen-chip is-not">Corrected</span><span>The error was conflating workspace-resident with billable.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '06 // DETECTION COVERAGE',
            motion: 'zoom-in',
            hud: [['Detections specified','5'], ['Validated (proven to fire)','4'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Docs</span><h2 class="sen-title">ATT&amp;CK Coverage</h2><span class="sen-tag">Lab record · 2026-09-02</span></header>
        <section class="sen-win is-att">
            <div class="sen-winbar"><i></i><b>ATT&amp;CK Coverage</b><span>Derived from detection spec frontmatter in detections/.</span><em>GENERATED by scripts/build-attack-matrix.py</em></div>
            <div class="sen-body">
                <div class="sen-strip">
                    <span>Summary</span>
                    <span>Detections specified <b>5</b></span>
                    <span>Active (not retired) <b>5</b></span>
                    <span>Validated (proven to fire) <b>4</b></span>
                    <span>Unvalidated <b>1</b></span>
                </div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c06a is-h"><span>Tactic</span><span>Techniques</span><span>Detections</span><span>State</span></div>
                    <div class="sen-tr sen-c06a"><span>Execution (TA0002)</span><span class="sen-m">T1047, T1059.001</span><span class="sen-m">DET-001, DET-002</span><span>COVERED (2/2)</span></div>
                    <div class="sen-tr sen-c06a"><span>Credential Access (TA0006)</span><span class="sen-m">T1110</span><span class="sen-m">DET-004, DET-005</span><span>PARTIAL (1/2)</span></div>
                    <div class="sen-tr sen-c06a"><span>Collection (TA0009)</span><span class="sen-m">T1114.003</span><span class="sen-m">DET-003</span><span>COVERED (1/1)</span></div>
                </div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c06b is-h"><span>ID</span><span>Name</span><span>Platform</span><span>Type</span><span>Severity</span><span>Status</span><span>Validated</span></div>
                    <div class="sen-tr sen-c06b"><span class="sen-m">DET-001</span><span>Suspicious PowerShell command line (EDR detection test)</span><span>defender-xdr</span><span>ml</span><span>medium</span><span>active</span><span>yes</span></div>
                    <div class="sen-tr sen-c06b"><span class="sen-m">DET-002</span><span>ASR — process creation via PSExec/WMI (audit and block observed)</span><span>defender-xdr</span><span>custom-detection</span><span>medium</span><span>active</span><span>yes</span></div>
                    <div class="sen-tr sen-c06b"><span class="sen-m">DET-003</span><span>Inbox forwarding/redirect rule created (authored alert policy)</span><span>defender-xdr</span><span>alert-policy</span><span>medium</span><span>active</span><span>yes</span></div>
                    <div class="sen-tr sen-c06b"><span class="sen-m">DET-004</span><span>Failed Entra sign-in burst (authored scheduled rule)</span><span>sentinel</span><span>scheduled-analytics</span><span>low</span><span>active</span><span>yes</span></div>
                    <div class="sen-tr sen-c06b"><span class="sen-m">DET-005</span><span>Brute force attack against Azure Portal (Microsoft template, enabled)</span><span>sentinel</span><span>scheduled-analytics</span><span>medium</span><span>active</span><span>no</span></div>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>attack-coverage.md</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-obs">COVERED</span><span>means every rule mapped to that tactic has been proven to fire on a known-true event (validated: true).</span></p>
                <p class="sen-f"><span class="sen-chip is-rec">PARTIAL</span><span>means some have.</span></p>
                <p class="sen-f"><span class="sen-chip is-not">CLAIMED</span><span>means none have. The distinction is the point of this table: an unvalidated rule is a hypothesis, not coverage.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '07 // NRT RULE SEMANTICS',
            motion: 'zoom-in',
            hud: [['Lab','21'], ['Built','2026-08-10'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 21</span><h2 class="sen-title">NRT Execution Semantics: The Hour That Never Holds an Hour</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-sen">
            <div class="sen-winbar"><i></i><b>Sentinel analytics rules</b><span>Validation — the two controls</span><em>Two controls, one account, one clock hour, eight qualifying failures.</em></div>
            <div class="sen-body">
                <div class="sen-facts">
                    <span>Rule <b>LAB-NRT-4625-Window-Test</b></span>
                    <span>Type <b>NRT query rule, Custom Content, Medium, Credential Access</b></span>
                    <span>Parameters <b>baseline = 1; threshold = 2 — deliberately reduced from the guide&#39;s 5/3</b></span>
                </div>
                <div class="sen-cols sen-g07">
                    <div class="sen-pane">
                        <div class="sen-pane-h">Control A — distributed, expect no alert</div>
                        <div class="sen-tr sen-c07a is-h"><span>#</span><span>TimeGenerated</span><span>Gap</span></div>
                        <div class="sen-tr sen-c07a"><span>1</span><span class="sen-m">13:03:59</span><span class="sen-m">—</span></div>
                        <div class="sen-tr sen-c07a"><span>2</span><span class="sen-m">13:06:39</span><span class="sen-m">160 s</span></div>
                        <div class="sen-tr sen-c07a"><span>3</span><span class="sen-m">13:08:21</span><span class="sen-m">102 s</span></div>
                        <div class="sen-tr sen-c07a"><span>4</span><span class="sen-m">13:09:41</span><span class="sen-m">80 s</span></div>
                        <div class="sen-note">All gaps exceed the one-minute evaluation width. Result: no alert.</div>
                    </div>
                    <div class="sen-pane">
                        <div class="sen-pane-h">Control B — concentrated, expect an alert</div>
                        <div class="sen-tr sen-c07b is-h"><span>TimeGenerated</span><span>_TimeReceived</span><span>ingestion_time()</span></div>
                        <div class="sen-tr sen-c07b"><span class="sen-m">13:19:10</span><span class="sen-m">13:19:37</span><span class="sen-m">13:19:47</span></div>
                        <div class="sen-tr sen-c07b"><span class="sen-m">13:19:28</span><span class="sen-m">13:19:57</span><span class="sen-m">13:20:03</span></div>
                        <div class="sen-tr sen-c07b"><span class="sen-m">13:19:35</span><span class="sen-m">13:19:57</span><span class="sen-m">13:20:03</span></div>
                        <div class="sen-tr sen-c07b"><span class="sen-m">13:19:35</span><span class="sen-m">13:19:57</span><span class="sen-m">13:20:03</span></div>
                        <div class="sen-note">Alert fired at 13:22:30, provider ASI NRT Alerts, Medium</div>
                    </div>
                </div>
                <div class="sen-q"><em>ExtendedProperties</em><code>TimeGenerated: 13:00:00   Account: -&#92;nosuchuser   CountFailedLogins: 4   Anomaly: 1</code></div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/21-nrt-execution-semantics/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>If the bin accumulated state across executions, the count would read 8. It reads 4.</span></p>
                <p class="sen-f"><span class="sen-chip is-not">Finding</span><span>bin(TimeGenerated, 1h) is decorative. It names a bucket that never holds more than one minute of ingested data — and the authoring surface conceals this, because pre-save validation runs the query against seven days of Log Analytics history and returns a satisfying green row.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '08 // AUTOMATION + PLAYBOOKS',
            motion: 'zoom-in',
            hud: [['Labs','18 + 19'], ['Detection','DET-004'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 18</span><h2 class="sen-title">Sentinel Automation Rules: Two Doors, One Trigger, and a Duplicate Only the Audit Log Saw</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-auto">
            <div class="sen-winbar"><i></i><b>Automation rules</b><span>Validation</span><em>Trigger: 7 failed labuser sign-ins to portal.azure.com, 2026-08-06 11:00 PDT.</em></div>
            <div class="sen-body">
                <div class="sen-tbl">
                    <div class="sen-tr sen-c08 is-h"><span>Check</span><span>Method</span><span>Expected</span><span></span><span>Result</span></div>
                    <div class="sen-tr sen-c08"><span>Both rules fire on one incident</span><span>Incident 23 row</span><span>tag AND owner set</span><span class="sen-k">✅</span><span>Tags: auto-tagged-ruleA, Assigned to: analyst</span></div>
                    <div class="sen-tr sen-c08"><span>Serial order</span><span>Activities audit log</span><span>A (Order 1) before B (Order 2)</span><span class="sen-k">✅</span><span>A 18:12:25.140Z, B 18:12:27.983Z</span></div>
                    <div class="sen-tr sen-c08"><span>Automation latency</span><span>creation → last automation write</span><span>seconds</span><span class="sen-k">✅</span><span>created 18:12:16Z, done 18:12:27Z (~11 s)</span></div>
                </div>
                <div class="sen-pane-h">Lab 19 · Sentinel Playbooks: A Permission Checked Before Anything Ran, and a Credential in Three Places · ✅ Built, documented, validated</div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c08"><span>Rule creation without grant 4</span><span>Azure Activity log, Update Automation Rules, JSON tab</span><span>Rule creates</span><span class="sen-k">❌</span><span>ARM BadRequest — missing required permissions for Microsoft Sentinel on the playbook resource</span></div>
                    <div class="sen-tr sen-c08"><span>Rule creation with grant 4</span><span>Identical form, resubmitted</span><span>Rule creates</span><span class="sen-k">✅</span><span>Created</span></div>
                    <div class="sen-tr sen-c08"><span>Playbook executed</span><span>Overview → Runs last 24 hours</span><span>1 successful</span><span class="sen-k">✅</span><span>1 successful, 0 failed; run 11:57:47 PDT, 5.05 s</span></div>
                    <div class="sen-tr sen-c08"><span>Remediation durable</span><span>New password chosen</span><span>—</span><span class="sen-k">❌</span><span>the old value was accepted as the new password</span></div>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/18-sentinel-automation-rules/</code><code>labs/19-sentinel-playbooks/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>Correct outcome, phantom write, visible only where no one looks.</span></p>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>Withheld → refused; granted → ran.</span></p>
                <p class="sen-f"><span class="sen-chip is-not">Finding</span><span>An operator auditing "what did automation do to this incident" and filtering on Automated loses exactly the row that mattered (row 146).</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '09 // INVESTIGATE + REMEDIATE',
            motion: 'zoom-in',
            hud: [['Labs','17 + 13'], ['Stored as','Benign Positive'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 17</span><h2 class="sen-title">Incident Investigation: the Trap, the Audit Trail, and the Role That Wasn&#39;t There Yet</h2><span class="sen-tag">🔨 Built, documentation in progress</span></header>
        <section class="sen-win is-xdr">
            <div class="sen-winbar"><i></i><b>Defender portal</b><span>Validation · Microsoft Sentinel Responder</span><em>Informational, expected activity — Security testing</em></div>
            <div class="sen-body">
                <div class="sen-tbl">
                    <div class="sen-tr sen-c09a is-h"><span>Check</span><span>Method</span><span>Expected</span><span></span><span>Result</span></div>
                    <div class="sen-tr sen-c09a"><span>Role effect (read)</span><span>Same queue, role active</span><span>Sentinel rows appear</span><span class="sen-k">✅</span><span>5 → 22 within ~2 min of activation</span></div>
                    <div class="sen-tr sen-c09a"><span>Role effect (write)</span><span>Manage incident under active role</span><span>Pane opens, write saves</span><span class="sen-k">✅</span><span>On the second read (T+12 h, fresh token); refused on the first (§6)</span></div>
                    <div class="sen-tr sen-c09a"><span>Role expiry</span><span>Analyst surfaces post-window</span><span>Everything retracts</span><span class="sen-k">✅</span><span>Queue 22 → 5, nav collapsed, no revocation step performed</span></div>
                </div>
                <div class="sen-pane-h">Lab 13 · Explorer Investigation and Defender-Native Remediation · ✅ Built, documented, validated · The controlled comparison</div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c09 is-h"><span></span><span></span><span>AIR — investigate</span><span></span><span>Soft delete — remediate</span></div>
                    <div class="sen-tr sen-c09"><span>Investigations page</span><span class="sen-k">✅</span><span class="sen-m">f6ab8e</span><span class="sen-k">✅</span><span class="sen-m">56687b</span></div>
                    <div class="sen-tr sen-c09"><span>Action Center</span><span class="sen-k">❌</span><span class="sen-m">absent from both tabs</span><span class="sen-k">✅</span><span class="sen-m">History</span></div>
                    <div class="sen-tr sen-c09"><span>Approval ID</span><span></span><span class="sen-m">none</span><span></span><span class="sen-m">6570a3</span></div>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/17-incident-investigation/</code><code>labs/13-explorer-air-remediation/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-not">Corrected</span><span>The error message described the cache, not the identity.</span></p>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>The Approval ID is an identifier, not a gate — the action executed and was retroactively stamped approved by its own submitter.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '10 // OFFICE 365 POLICIES',
            motion: 'zoom-in',
            hud: [['Lab','12'], ['Built','2026-08-01'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 12</span><h2 class="sen-title">Defender for Office 365 Threat Policies</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-mdo">
            <div class="sen-winbar"><i></i><b>Defender for Office 365</b><span>The discriminator</span><em>X-MS-Exchange-AtpMessageProperties — present on both Sales messages, absent from both controls.</em></div>
            <div class="sen-body">
                <div class="sen-tbl">
                    <div class="sen-tr sen-c10 is-h"><span>Message</span><span>Policy path</span><span>ATP marker</span><span>Explorer Additional actions</span><span>Latency</span></div>
                    <div class="sen-tr sen-c10"><span class="sen-m">Lab12-DD-01</span><span>SA-Sales-DynamicDelivery</span><span>SA</span><span>Dynamic delivery-Success</span><span class="sen-m">3.249 s</span></div>
                    <div class="sen-tr sen-c10"><span class="sen-m">Lab12-DD-02</span><span>SA-Sales-DynamicDelivery</span><span>SA</span><span>Dynamic delivery-Success</span><span class="sen-m">3.454 s</span></div>
                    <div class="sen-tr sen-c10"><span class="sen-m">Lab12-CTRL-01</span><span>Built-in protection</span><span>absent</span><span>--</span><span class="sen-m">23.834 s</span></div>
                    <div class="sen-tr sen-c10"><span class="sen-m">Lab12-CTRL-02</span><span>Built-in protection</span><span>absent</span><span>--</span><span class="sen-m">4.360 s</span></div>
                </div>
                <div class="sen-pane-h">One policy, three cmdlets, three answers</div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c10b is-h"><span>Cmdlet</span><span>Returns</span></div>
                    <div class="sen-tr sen-c10b"><span class="sen-m">Get-SafeAttachmentRule</span><span>nothing</span></div>
                    <div class="sen-tr sen-c10b"><span class="sen-m">Get-SafeAttachmentPolicy</span><span>Built-In Protection Policy — Block, Enable True, IsDefault: False</span></div>
                    <div class="sen-tr sen-c10b"><span class="sen-m">Get-ATPBuiltInProtectionRule</span><span>the rule, State: Enabled, all scoping fields empty</span></div>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/12-mdo-threat-policies/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>An analyst inheriting this tenant would find every configuration surface saying attachments are protected, and would be wrong.</span></p>
                <p class="sen-f"><span class="sen-chip is-not">not established</span><span>The portal note beside the toggle offers a candidate explanation: enabled only for paid Defender for Office 365 tenants. This tenant is on trial.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '11 // EDISCOVERY + DLP',
            motion: 'zoom-in',
            hud: [['Labs','23 + 14'], ['Audit read','19 records'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 23</span><h2 class="sen-title">Purview Audit and eDiscovery: Two Data Planes, and the File Neither One Reports</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-pur">
            <div class="sen-winbar"><i></i><b>Microsoft Purview</b><span>Phase B — three files, one keyword, one search</span><em>Two came back.</em></div>
            <div class="sen-body">
                <div class="sen-tbl">
                    <div class="sen-tr sen-c11 is-h"><span>File</span><span>Type</span><span>Keyword location</span><span>Pre-upload validation</span></div>
                    <div class="sen-tr sen-c11"><span class="sen-m">mod94-positive.docx</span><span>Word 2007+</span><span>Body text</span><span>docProps/core.xml empty — no title/author/keyword leakage</span></div>
                    <div class="sen-tr sen-c11"><span class="sen-m">mod94-negA.png</span><span>PNG 900×220 RGB</span><span>Rendered pixels only</span><span>No tEXt/iTXt/zTXt chunks; literal string absent from file bytes</span></div>
                    <div class="sen-tr sen-c11"><span class="sen-m">mod94-negB.labx</span><span>Plain ASCII, renamed extension</span><span>Body text</span><span>Content trivially readable; extension unrecognised</span></div>
                </div>
                <div class="sen-q"><em>Search</em><code>Query: ((ZARQON-MOD94-CTRL))</code></div>
                <div class="sen-note">The plain .docx returned, as designed. The image-only PNG returned. The plain-ASCII file with an unrecognised extension did not.</div>
                <div class="sen-pane-h">Lab 14 · Purview DLP: a US Financial Policy in Simulation · ✅ Built, documented, validated · Predictions</div>
                <div class="sen-tbl">
                    <div class="sen-tr sen-c11b"><span class="sen-m">P4</span><span>Purview role groups have no members; everything runs on GA</span><span class="sen-k">✅</span><span>CONFIRMED — 70 groups, zero members</span></div>
                    <div class="sen-tr sen-c11b"><span class="sen-m">P-D1</span><span>Existing matches persist after the file is deleted (report = historical record)</span><span class="sen-k">✅</span><span>CONFIRMED — both matches unchanged 2 min post-delete</span></div>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/23-purview-audit-and-ediscovery/</code><code>labs/14-purview-dlp-simulation/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-not">Finding</span><span>Three surfaces, three zeros, and a readable file sitting in the searched location containing the exact term.</span></p>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>At 07:25 both matches persisted unchanged — the report is a historical record, not a live-state view (P-D1); for two minutes it claimed a match on content that no longer existed, with no annotation.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '12 // THREAT INTEL + HUNTING',
            motion: 'zoom-out',
            hud: [['Labs','25 + 26'], ['Revoked','2026-08-16'], ['Basis','Lab record']],
            body: `
<div class="sen-artboard">
    <div class="sen-stage">
        <header class="sen-head"><span class="sen-case">Lab 25</span><h2 class="sen-title">Threat Intelligence: An Indicator Nothing Was Joined To</h2><span class="sen-tag">✅ Built, documented, validated</span></header>
        <section class="sen-win is-ti">
            <div class="sen-winbar"><i></i><b>Intel management</b><span>Measurements</span><em>no rule in this workspace referenced a TI table at all.</em></div>
            <div class="sen-body">
                <div class="sen-cols sen-g12">
                    <div class="sen-pane">
                        <div class="sen-pane-h">Where it landed, and the billing flag</div>
                        <div class="sen-term"><div class="sen-l">ThreatIntelIndicators | where TimeGenerated &gt; ago(2h)</div><div class="sen-l">| project _IsBillable, _BilledSize, ObservableValue, Type</div><div class="sen-l">→ True, 786, "ti-lab-test.invalid", ThreatIntelIndicators</div></div>
                        <div class="sen-pane-h">The chain, and where it breaks</div>
                        <div class="sen-tr sen-c12a is-h"><span>Link</span><span></span><span>State</span></div>
                        <div class="sen-tr sen-c12a"><span>Indicator exists, unrevoked, in window</span><span class="sen-k">✅</span><span></span></div>
                        <div class="sen-tr sen-c12a"><span>An analytics rule matches its type</span><span class="sen-k">❌</span><span>zero rules reference a TI table</span></div>
                        <div class="sen-tr sen-c12a"><span>The log table is ingested</span><span></span><span>n/a</span></div>
                        <div class="sen-tr sen-c12a"><span>The rule is enabled</span><span></span><span>n/a</span></div>
                    </div>
                    <div class="sen-pane">
                        <div class="sen-pane-h">Lab 26 · Hunts, Queries and Bookmarks: A Documented Path That Routes to the Wrong Store · ✅ Built, documented, validated</div>
                        <div class="sen-pane-h">DET-004 fired</div>
                        <div class="sen-tr sen-c12b is-h"><span>Field</span><span>Value</span></div>
                        <div class="sen-tr sen-c12b"><span>Incident</span><span>LAB-Bruteforce: 6 failed sign-ins to Azure Portal, ID 28</span></div>
                        <div class="sen-tr sen-c12b"><span>Created</span><span>2026-08-15T03:37:29.5Z</span></div>
                        <div class="sen-tr sen-c12b"><span>Last activity</span><span>2026-08-15T03:29:32.821Z</span></div>
                        <div class="sen-tr sen-c12b"><span>End to end</span><span>just under 8 minutes on a 5-minute schedule</span></div>
                        <div class="sen-note">View results routes to Advanced hunting from the main Queries tab and from inside a hunt.</div>
                    </div>
                </div>
            </div>
        </section>
        <div class="sen-low">
            <aside class="sen-find">
                <div class="sen-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>labs/25-threat-intelligence-indicators/</code><code>labs/26-hunts-queries-bookmarks/</code></span>
                </div>
                <p class="sen-f"><span class="sen-chip is-rec">Record</span><span>TI in the workspace is a reference dataset — a lookup that analytics rules join against — not another telemetry stream you monitor.</span></p>
                <p class="sen-f"><span class="sen-chip is-not">Open</span><span>Six reported sign-in attempts produced six rows carrying three distinct timestamps, each duplicated at identical millisecond precision. Open against the committed record.</span></p>
            </aside>
        </div>
    </div>
</div>`
        }
    ];

    function renderSentinelScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
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
    // Local-environment test seam, shared by the controller hook below and
    // the slice D forced-fallback switch (behaviour-neutral refactor).
    function isLocalEnvironment() {
        return window.location.protocol === 'file:' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
    }
    function exposeMediaControllerForTests(controller) {
        const params = new URLSearchParams(window.location.search);
        if (!isLocalEnvironment() || params.get('controllerTest') !== '1') return;
        Object.defineProperty(window, '__mediaPreviewController', {
            value: controller,
            writable: false,
            enumerable: false,
            configurable: true
        });
    }

    // ── Logical artboard (slice B) ────────────────────────
    // At the phone breakpoint the engine is laid out at the canonical
    // design width (--media-artboard-design-width, consumed by the CSS
    // rule for [data-artboard-mode="logical"]) and scaled as one unit to
    // the preview body. Above the breakpoint the attribute is absent and
    // the desktop layout is untouched. No width is named here: the scale
    // is the body width over the engine's laid-out width, so the CSS
    // token stays the single source.
    // Phone mode (slice C): one condition shared with media.css, text for text.
    const PHONE_LAYOUT_QUERY = '(max-width: 800px), (orientation: landscape) and (max-width: 1000px) and (max-height: 500px) and (pointer: coarse)';

    // Pinned-block metrics (slice C). The sticky offsets and the landscape cap
    // in media.css read the real height of the return-link band and the real
    // offset of the preview window's title bar, measured here, so no box size
    // is guessed in CSS. Harmless above the phone breakpoint (unused there).
    function installPinnedBlockMetrics() {
        const root = document.documentElement;
        const link = document.querySelector('.media-header .return-link');
        const windowEl = document.querySelector('#preview-panel .preview-window');
        const chromeEl = windowEl && windowEl.querySelector('.preview-window-chrome');
        if (!link || !windowEl || !chromeEl) return;
        function measure() {
            root.style.setProperty('--media-link-band', link.offsetHeight + 'px');
            root.style.setProperty('--media-chrome-offset', Math.round(chromeEl.getBoundingClientRect().bottom - windowEl.getBoundingClientRect().top) + 'px');
        }
        if (typeof ResizeObserver === 'function') {
            const ro = new ResizeObserver(measure); ro.observe(link); ro.observe(chromeEl);
        } else {
            window.addEventListener('resize', measure);
        }
        measure();
    }

    function installLogicalArtboard(previewBodyEl, engineEl) {
        if (!engineEl || typeof window.matchMedia !== 'function') return;
        const mq = window.matchMedia(PHONE_LAYOUT_QUERY);
        const isolated = () => document.documentElement.hasAttribute('data-media-isolation');

        function updateScale() {
            if (!engineEl.hasAttribute('data-artboard-mode')) return;
            const bodyWidth = previewBodyEl.clientWidth;
            const designWidth = engineEl.offsetWidth;   // layout width; transforms do not affect it
            if (!bodyWidth || !designWidth) return;
            if (isolated()) {
                // Slice D: while isolated the body is the whole window, and the
                // artboard is contained, centred and letterboxed inside it
                // (transfer 6.6). The height is the width over the locked 1.9:1
                // aspect (Owner Q9), the same ratio the logical-mode CSS uses.
                const bodyHeight = previewBodyEl.clientHeight;
                const designHeight = designWidth / 1.9;
                const scale = bodyHeight ? Math.min(bodyWidth / designWidth, bodyHeight / designHeight) : bodyWidth / designWidth;
                engineEl.style.setProperty('--artboard-scale', scale.toFixed(5));
                engineEl.style.setProperty('--artboard-offset-x', ((bodyWidth - designWidth * scale) / 2).toFixed(2) + 'px');
                engineEl.style.setProperty('--artboard-offset-y', ((bodyHeight - designHeight * scale) / 2).toFixed(2) + 'px');
                return;
            }
            engineEl.style.setProperty('--artboard-scale', (bodyWidth / designWidth).toFixed(5));
            engineEl.style.removeProperty('--artboard-offset-x');
            engineEl.style.removeProperty('--artboard-offset-y');
        }

        function apply() {
            // Slice D (Option A): an active session keeps the logical layout
            // whatever the viewport does; only phone mode decides otherwise.
            if (mq.matches || isolated()) {
                engineEl.setAttribute('data-artboard-mode', 'logical');
                updateScale();
            } else {
                engineEl.removeAttribute('data-artboard-mode');
                engineEl.style.removeProperty('--artboard-scale');
                engineEl.style.removeProperty('--artboard-offset-x');
                engineEl.style.removeProperty('--artboard-offset-y');
            }
        }

        if (typeof ResizeObserver === 'function') {
            new ResizeObserver(updateScale).observe(previewBodyEl);
        } else {
            window.addEventListener('resize', updateScale);
        }
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', apply);
        else if (typeof mq.addListener === 'function') mq.addListener(apply);
        document.addEventListener('media:isolation', apply);   // slice D: session entry / exit
        apply();
    }

    // ── Slice D: phone overlay fade, Full Screen control, isolation ──
    // Owner Q2 (overlay fades after 3000ms idle, tap reveals), Q5 option (b)
    // (an actual portrait→landscape rotation isolates automatically, the
    // way back returns to the pinned layout), Q6 (phones only), Q8 (native
    // fullscreen where the browser really supports it, CSS fallback
    // otherwise). Runs only for a mounted preview runtime: the null-runtime
    // route passes no controller and gets nothing. Everything the
    // stylesheet needs is published as attributes this code owns:
    //   html[data-fs-eligible="1"]   runtime ∧ phone mode ∧ (pointer: coarse)
    //   html[data-media-isolation]   "css" | "native" while a session is active
    //   #preview-panel[data-overlay] "visible" | "hidden" (the phone overlay)
    // Exit paths (transfer 6.7): the Exit control, Esc, Back (popstate), a
    // fullscreenchange that ends native fullscreen, and a settled
    // landscape→portrait rotation. Exits are idempotent.
    function installSliceD(controller, previewBodyEl) {
        if (!controller || !previewBodyEl || typeof window.matchMedia !== 'function') return;
        const root = document.documentElement;
        const panel = document.getElementById('preview-panel');
        const fsBtn = document.getElementById('fullscreen-toggle');
        const fsLabel = document.getElementById('fullscreen-label');
        const controls = panel && panel.querySelector('.preview-controls');
        if (!panel || !fsBtn || !controls) return;
        const phoneMq = window.matchMedia(PHONE_LAYOUT_QUERY);
        const coarseMq = window.matchMedia('(pointer: coarse)');
        const landscapeMq = window.matchMedia('(orientation: landscape)');
        const IDLE_MS = 3000;     // Q2: idle interval before the overlay fades
        const SETTLE_MS = 600;    // diagnostic only: a rotation the viewport has not followed yet
        const onMq = (mq, fn) => {
            if (typeof mq.addEventListener === 'function') mq.addEventListener('change', fn);
            else if (typeof mq.addListener === 'function') mq.addListener(fn);
        };

        // ── eligibility: recomputed whenever phone mode or the primary pointer changes ──
        function eligible() { return phoneMq.matches && coarseMq.matches; }
        function updateEligibility() {
            if (eligible()) root.setAttribute('data-fs-eligible', '1');
            else root.removeAttribute('data-fs-eligible');
        }

        // ── session state ──
        let state = 'NORMAL';   // NORMAL | CSS_AUTO | CSS_TAP | NATIVE_PENDING | NATIVE
        let guard = false;      // an exit while still landscape: no automatic re-entry until portrait settles
        let historyEntry = false, ignoreNextPop = false;
        let savedScrollY = 0, previousFocus = null, inerted = [];
        const isCss = () => state === 'CSS_AUTO' || state === 'CSS_TAP';
        const active = () => state !== 'NORMAL' && state !== 'NATIVE_PENDING';

        // ── overlay fade (Q2): the phone layout, and any active session ──
        let idleTimer = null, overlayHidden = false, swallowClick = false;
        function overlayActive() { return phoneMq.matches || active(); }
        function focusInsideOverlay() {
            const a = document.activeElement;
            return !!a && (controls.contains(a) || !!(a.closest && a.closest('.cf-engine-dots')));
        }
        function armIdle() { clearTimeout(idleTimer); idleTimer = setTimeout(hideOverlay, IDLE_MS); }
        function showOverlay() {
            if (!overlayActive()) return;
            panel.setAttribute('data-overlay', 'visible');
            overlayHidden = false;
            armIdle();
        }
        // D2-C4: only keyboard-driven focus holds the overlay. Focus placed by
        // a touch tap, or by the bound entry/exit focus moves, must not defeat
        // the idle fade; the last genuine input decides (keydown / pointerdown).
        let keyboardModality = false;
        document.addEventListener('pointerdown', () => { keyboardModality = false; }, true);
        function hideOverlay() {
            idleTimer = null;
            if (!overlayActive()) return;
            const focused = focusInsideOverlay();
            if (focused && keyboardModality) { armIdle(); return; }   // keyboard focus holds the overlay
            panel.setAttribute('data-overlay', 'hidden');
            overlayHidden = true;
            // Focus safety: never leave focus on a control that has just become
            // hidden and unfocusable; the next key press reveals the overlay and
            // Tab re-enters the preview's normal focus order.
            if (focused && document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur();
        }
        function applyOverlayMode() {
            if (overlayActive()) { if (!panel.hasAttribute('data-overlay')) showOverlay(); }
            else { clearTimeout(idleTimer); idleTimer = null; panel.removeAttribute('data-overlay'); overlayHidden = false; }
        }
        // The first tap while hidden reveals the overlay and nothing else: the
        // click that follows it is swallowed in the capture phase so it cannot
        // reach a dot, AUTOPLAY, Full Screen or the scene.
        panel.addEventListener('pointerdown', () => {
            if (!overlayActive()) return;
            if (overlayHidden) swallowClick = true;
            showOverlay();
        }, true);
        panel.addEventListener('click', (e) => {
            if (swallowClick) { swallowClick = false; e.stopPropagation(); e.preventDefault(); }
        }, true);
        // D2-C3: key input anywhere on the page reveals the hidden overlay.
        // The controls stay visibility:hidden (never tabbable) while hidden;
        // the reveal runs in the capture phase, before the browser moves
        // focus, so the Tab that reveals them also reaches them in the
        // normal preview focus order. Inert when the overlay is not in use.
        document.addEventListener('keydown', () => { keyboardModality = true; showOverlay(); }, true);
        panel.addEventListener('focusin', () => showOverlay());
        panel.addEventListener('focusout', () => { if (overlayActive() && !overlayHidden) armIdle(); });

        // ── orientation: order-independent; a rotation the viewport has not
        //    followed stays pending and completes whenever they agree ──
        function deviceOrientation() {
            const so = window.screen && window.screen.orientation;
            if (so && typeof so.type === 'string') return so.type.indexOf('landscape') === 0 ? 'landscape' : 'portrait';
            return landscapeMq.matches ? 'landscape' : 'portrait';
        }
        function viewportOrientation() { return landscapeMq.matches ? 'landscape' : 'portrait'; }
        let processed = deviceOrientation();   // the last orientation the page has acted on
        let mismatchTimer = null, evalQueued = false;
        function clearMismatch() {
            if (mismatchTimer) { clearTimeout(mismatchTimer); mismatchTimer = null; }
            root.removeAttribute('data-orientation-mismatch');
        }
        function scheduleEvaluate() {
            if (evalQueued) return;
            evalQueued = true;
            window.requestAnimationFrame(() => { evalQueued = false; evaluate(); });
        }
        function evaluate() {
            updateEligibility();
            applyOverlayMode();
            const observed = deviceOrientation();
            if (observed === processed) { clearMismatch(); return; }
            if (viewportOrientation() !== observed) {
                if (!mismatchTimer) mismatchTimer = setTimeout(() => {
                    mismatchTimer = null;
                    root.setAttribute('data-orientation-mismatch', observed);   // diagnostic; the transition is NOT consumed
                }, SETTLE_MS);
                return;
            }
            clearMismatch();
            processed = observed;
            onSettled(observed);
        }
        function onSettled(orientation) {
            if (orientation === 'portrait') {
                guard = false;                          // portrait observed: the guard re-arms
                if (active()) exitSession('portrait');  // any session returns to the pinned portrait layout
                return;
            }
            if (state === 'NORMAL' && eligible() && !guard) enterCss('auto');   // never requestFullscreen() here
        }

        // ── sessions ──
        function forcedFallback() {   // localhost-only test switch; inert elsewhere
            return isLocalEnvironment() && new URLSearchParams(window.location.search).get('fsFallback') === '1';
        }
        function nativeAvailable() {
            return !forcedFallback() && !!document.fullscreenEnabled && typeof panel.requestFullscreen === 'function';
        }
        function setControl(exit) {
            fsBtn.setAttribute('aria-pressed', exit ? 'true' : 'false');
            fsBtn.setAttribute('aria-label', exit ? 'Exit full screen' : 'Full screen');
            if (fsLabel) fsLabel.textContent = exit ? 'EXIT' : 'FULL SCREEN';
        }
        function focusQuietly(el) {
            if (!el || typeof el.focus !== 'function') return;
            try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
        }
        function applyInert() {   // background focus containment: every sibling along the ancestor chain
            inerted = [];
            let node = panel;
            while (node && node !== document.body && node.parentElement) {
                const parent = node.parentElement;
                for (const sib of parent.children) {
                    if (sib !== node && sib.tagName !== 'SCRIPT' && !sib.inert) { sib.inert = true; inerted.push(sib); }
                }
                node = parent;
            }
        }
        function removeInert() { inerted.forEach(el => { el.inert = false; }); inerted = []; }
        function notifyIsolation() { document.dispatchEvent(new CustomEvent('media:isolation')); }
        function beginSession(kind) {
            root.setAttribute('data-media-isolation', kind);
            savedScrollY = window.scrollY || window.pageYOffset || 0;
            previousFocus = document.activeElement;
            applyInert();
            notifyIsolation();
            setControl(true);
            showOverlay();
            focusQuietly(fsBtn);
        }
        function enterCss(origin) {
            if (state !== 'NORMAL') return;
            state = origin === 'auto' ? 'CSS_AUTO' : 'CSS_TAP';
            try { window.history.pushState({ mediaIsolation: true }, ''); historyEntry = true; } catch (e) { historyEntry = false; }
            beginSession('css');
        }
        function enterNative() {
            if (state !== 'NORMAL') return;
            state = 'NATIVE_PENDING';
            let request;
            try { request = panel.requestFullscreen(); } catch (e) { request = Promise.reject(e); }
            Promise.resolve(request).catch(() => {
                if (state === 'NATIVE_PENDING') { state = 'NORMAL'; enterCss('tap'); }   // Q8: fallback
            });
        }
        function exitSession(reason) {
            if (!active()) return;   // idempotent
            if (state === 'NATIVE') {
                if (document.fullscreenElement === panel && typeof document.exitFullscreen === 'function') {
                    // fullscreenchange finishes a successful exit. D2-C2: a
                    // rejected exit is reconciled from the observed state: if
                    // the panel is still fullscreen the native session stays
                    // and the refusal is surfaced (a measured divergence);
                    // if the browser left fullscreen anyway, the exit completes.
                    let request;
                    try { request = document.exitFullscreen(); } catch (err) { request = Promise.reject(err); }
                    Promise.resolve(request).catch(() => {
                        if (document.fullscreenElement === panel) root.setAttribute('data-native-exit-refused', reason);
                        else finishExit(reason);
                    });
                } else {
                    finishExit(reason);
                }
                return;
            }
            finishExit(reason);
        }
        function finishExit(reason) {
            if (!active()) return;   // idempotent: Esc, the control and fullscreenchange cannot double-exit
            const wasCss = isCss();
            state = 'NORMAL';
            // D2-C1: the observed device orientation decides, so an exit made
            // while a rotation to landscape is still settling is guarded too.
            guard = deviceOrientation() === 'landscape';
            root.removeAttribute('data-native-exit-refused');
            root.removeAttribute('data-media-isolation');
            removeInert();
            notifyIsolation();
            setControl(false);
            if (wasCss && reason !== 'popstate' && historyEntry && window.history.state && window.history.state.mediaIsolation) {
                ignoreNextPop = true;
                window.history.back();   // consume the session's entry: one Back later leaves the page normally
            }
            historyEntry = false;
            window.scrollTo(0, savedScrollY);
            updateEligibility();
            applyOverlayMode();
            focusQuietly(root.hasAttribute('data-fs-eligible') ? fsBtn : previousFocus);
            previousFocus = null;
        }

        // ── exit paths ──
        fsBtn.addEventListener('click', () => {
            if (state === 'NATIVE_PENDING') return;
            if (state === 'NORMAL') { if (nativeAvailable()) enterNative(); else enterCss('tap'); }
            else exitSession('button');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape' && e.key !== 'Esc') return;
            if (isCss()) { e.preventDefault(); exitSession('esc'); }
            else if (state === 'NATIVE' && document.fullscreenElement === panel) exitSession('esc');
        });
        window.addEventListener('popstate', (e) => {
            if (ignoreNextPop) { ignoreNextPop = false; return; }
            if (isCss()) { historyEntry = false; finishExit('popstate'); return; }
            if (e.state && e.state.mediaIsolation) { ignoreNextPop = true; window.history.back(); }   // Forward into a stale entry bounces
        });
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement === panel) {
                if (state !== 'NATIVE') { state = 'NATIVE'; beginSession('native'); }
            } else if (state === 'NATIVE') {
                finishExit('native-exit');   // browser-owned Esc, platform Back, app switch: reconciled here
            }
        });
        document.addEventListener('fullscreenerror', () => {
            if (state === 'NATIVE_PENDING') { state = 'NORMAL'; enterCss('tap'); }
        });

        // ── triggers ──
        onMq(phoneMq, scheduleEvaluate);
        onMq(coarseMq, scheduleEvaluate);
        onMq(landscapeMq, scheduleEvaluate);
        if (window.screen && window.screen.orientation && typeof window.screen.orientation.addEventListener === 'function') {
            window.screen.orientation.addEventListener('change', scheduleEvaluate);
        }
        window.addEventListener('resize', scheduleEvaluate);
        updateEligibility();
        applyOverlayMode();
    }

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
            windowEl.insertAdjacentHTML('afterend', ENGINEERING_NOTE_HTML);
        }
        // Slice C: phone mode shows the note in the scrolling notes slot under
        // the header (the panel copy is display:none there, and the slot is
        // display:none on desktop, so one copy is in the accessibility tree).
        const notesSlot = document.getElementById('media-notes');
        if (notesSlot && !notesSlot.querySelector('.cf-engineering-note')) {
            notesSlot.insertAdjacentHTML('beforeend', ENGINEERING_NOTE_HTML);
        }

        // Slice B: the dot band is a player control, not scene content. It
        // moves beside the engine (same absolute placement relative to the
        // preview body, so the desktop layout is unchanged) and is never
        // scaled with the artboard.
        const engineEl = previewBodyEl.querySelector('.cf-preview-engine');
        const dotsBox = engineEl.querySelector('.cf-engine-dots');
        if (dotsBox) previewBodyEl.appendChild(dotsBox);
        installLogicalArtboard(previewBodyEl, engineEl);

        const sceneEls = Array.from(previewBodyEl.querySelectorAll('.cf-engine-scene'));
        const dotEls = Array.from(previewBodyEl.querySelectorAll('.cf-engine-dot'));
        let sceneIndex = 0;
        let timer = null;

        // Scene-change notification. Every mutation path routes through
        // showScene(), which notifies once at the end — after the active
        // scene, dot and motion state have all settled. Subscribers must
        // never need to know how a visible scene is classed or where the
        // HUD is nested; that coupling is what this replaces.
        const sceneChangeListeners = new Set();

        function getSceneState() {
            const scene = scenes[sceneIndex];
            return {
                index: sceneIndex,
                count: scenes.length,
                title: scene.title,
                // copied pairs — a subscriber must not be able to mutate
                // the PROJECTS registry through the state object
                hud: (scene.hud || []).map(([label, value]) => [label, value])
            };
        }

        function notifySceneChange() {
            const state = getSceneState();
            // iterate a snapshot so a listener may unsubscribe during notify
            Array.from(sceneChangeListeners).forEach((fn) => fn(state));
        }

        function onSceneChange(listener, options) {
            if (typeof listener !== 'function') {
                throw new TypeError('Scene-change listener must be a function.');
            }
            const emitCurrent = !options || options.emitCurrent !== false;
            sceneChangeListeners.add(listener);
            if (emitCurrent) {
                // The listener is registered before the initial emission, and
                // the unsubscribe is not returned until after it. If that
                // emission throws, onSceneChange unwinds and the caller never
                // receives the unsubscribe -- leaving a listener registered
                // with no way to remove it. Remove it here and rethrow, so the
                // caller still sees the error but the registry stays clean.
                try {
                    listener(getSceneState());
                } catch (err) {
                    sceneChangeListeners.delete(listener);
                    throw err;
                }
            }
            let active = true;
            return function unsubscribe() {
                if (!active) return;
                active = false;
                sceneChangeListeners.delete(listener);
            };
        }

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
            const nextIndex = (index + sceneEls.length) % sceneEls.length;
            const changed = nextIndex !== sceneIndex;
            sceneEls[sceneIndex].classList.remove('is-visible');
            dotEls[sceneIndex].classList.remove('is-active');
            sceneIndex = nextIndex;
            sceneEls[sceneIndex].classList.add('is-visible');
            dotEls[sceneIndex].classList.add('is-active');
            replayMotion(sceneEls[sceneIndex]);
            // The event is onSceneChange, so re-selecting the already active
            // scene does not notify. Its motion still replays — that is the
            // existing active-dot behaviour and is deliberately unchanged —
            // but subscribers are not told about an unchanged state, which
            // would otherwise cause pointless viewer resets.
            if (changed) notifySceneChange();
        }

        function nextScene() {
            showScene(sceneIndex + 1);
        }

        function previousScene() {
            showScene(sceneIndex - 1);
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
            showScene: showScene,
            nextScene: nextScene,
            previousScene: previousScene,
            getSceneIndex: function () { return sceneIndex; },
            getSceneCount: function () { return scenes.length; },
            getCurrentScene: getSceneState,
            onSceneChange: onSceneChange,
            fireBootInterference: fireBootInterference,
            startMinorLoop: startMinorLoop,
            stopMinorLoop: stopMinorLoop
        };
    }

    function initCloudflarePreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, CF_SCENES, renderCloudflareScene, CF_SCENE_INTERVAL_MS);
    }

    function initSentinelPreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, SENTINEL_SCENES, renderSentinelScene, SENTINEL_SCENE_INTERVAL_MS);
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



    // ── Penetration Testing Engineering scenes ────────────
    // "pte-" namespacing keeps the artboard isolated while the shared
    // presentation engine supplies scene cycling, HUD, pagination, and
    // interference effects. Published evidence remains defanged.
    const PENTEST_SCENE_INTERVAL_MS = 6200;

    function renderPentestScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    const PENTEST_SCENES = [
        {
            title: '01 // RECONNAISSANCE',
            motion: 'zoom-in',
            hud: [['Phase','Recon'], ['Tool','Nmap 7.95'], ['Ports','22 · 80'], ['Result','2 Services']],
            body: `
<div class="pte-artboard">
    <div class="pte-parrot-panel">
        <div class="pte-desktop-bar">
            <div class="pte-app-name"><span class="pte-parrot-mark">P</span><strong>Terminal</strong></div>
            <div class="pte-desktop-center">nibbles_initial_scan — valeratech@parrot</div>
            <div class="pte-desktop-status"><span>ENG</span><span>13:46</span><span>▣</span></div>
        </div>
        <div class="pte-terminal-tabs">
            <div class="pte-tab is-active"><span>▣</span> Recon / Initial Service Scan</div>
            <div class="pte-window-controls"><i></i><i></i><i></i></div>
        </div>
        <div class="pte-terminal-body">
            <div class="pte-command"><span class="pte-prompt">$</span> <span class="pte-cmd">nmap -sV --open -oA nibbles_initial_scan 10[.]129[.]126[.]245</span></div>
            <div class="pte-gap"></div>
            <div>Starting Nmap 7.95 ( <span class="pte-link">hxxps://nmap[.]org</span> ) at 2026-07-26 13:46 EDT</div>
            <div>Nmap scan report for <span class="pte-target">10[.]129[.]126[.]245</span></div>
            <div>Host is up (<span class="pte-value">0.14s latency</span>).</div>
            <div class="pte-gap"></div>
            <div class="pte-port-head"><b>PORT</b><b>STATE</b><b>SERVICE</b><b>VERSION</b></div>
            <div class="pte-port-row"><span>22/tcp</span><span class="pte-open">open</span><span>ssh</span><span>OpenSSH 7.2p2 Ubuntu 4ubuntu2.2</span></div>
            <div class="pte-port-row"><span>80/tcp</span><span class="pte-open">open</span><span>http</span><span>Apache httpd 2.4.18 ((Ubuntu))</span></div>
            <div class="pte-gap"></div>
            <div>Nmap done: 1 IP address (1 host up) scanned in <span class="pte-value">11.35 seconds</span></div>
            <div class="pte-cursor-line"><span class="pte-prompt">$</span><span class="pte-cursor"></span></div>
        </div>
        <aside class="pte-recon-summary">
            <div class="pte-summary-label">RECON RESULT</div>
            <strong>Attack Surface Identified</strong>
            <div class="pte-summary-grid">
                <div><span>22/TCP</span><b>SSH</b><small>OpenSSH 7.2p2</small></div>
                <div><span>80/TCP</span><b>HTTP</b><small>Apache 2.4.18</small></div>
            </div>
            <p>Next action: enumerate the web service and validate exposed application paths.</p>
        </aside>
    </div>
</div>`
        },
        {
            title: '02 // WEB FOOTPRINTING',
            motion: 'pan-left',
            hud: [['Phase','Enumeration'], ['Tool','Gobuster'], ['Paths','9 Found'], ['Signal','Admin UI']],
            body: `
<div class="pte-artboard">
    <div class="pte-parrot-panel">
        <div class="pte-desktop-bar">
            <div class="pte-app-name"><span class="pte-parrot-mark">P</span><strong>Terminal</strong></div>
            <div class="pte-desktop-center">gobuster_web_enum — valeratech@parrot</div>
            <div class="pte-desktop-status"><span>ENG</span><span>14:18</span><span>▣</span></div>
        </div>
        <div class="pte-terminal-tabs">
            <div class="pte-tab is-active"><span>▣</span> Web Footprinting / Directory Enumeration</div>
            <div class="pte-window-controls"><i></i><i></i><i></i></div>
        </div>
        <div class="pte-terminal-body pte-gobuster-body">
            <div class="pte-command pte-command-wrap"><span class="pte-prompt">$</span> <span class="pte-cmd">gobuster dir -u <span class="pte-target">hxxp://10[.]129[.]129[.]43/nibbleblog/</span> \\</span><br><span class="pte-command-indent">--wordlist /usr/share/seclists/Discovery/Web-Content/common.txt</span></div>
            <div class="pte-gap"></div>
            <div class="pte-tool-banner">Gobuster directory enumeration</div>
            <div class="pte-result-row pte-result-denied"><span>/.htaccess</span><span>Status: <b>403</b></span></div>
            <div class="pte-result-row pte-result-denied"><span>/.htpasswd</span><span>Status: <b>403</b></span></div>
            <div class="pte-result-row pte-result-file"><span>/README</span><span>Status: <b>200</b> <em>[Size: 4628]</em></span></div>
            <div class="pte-result-row pte-result-redirect"><span>/admin</span><span>Status: <b>301</b></span></div>
            <div class="pte-result-row pte-result-hit"><span>/admin.php</span><span>Status: <b>200</b> <em>[Size: 1401]</em></span></div>
            <div class="pte-result-row pte-result-redirect"><span>/content</span><span>Status: <b>301</b></span></div>
            <div class="pte-result-row pte-result-hit"><span>/index.php</span><span>Status: <b>200</b> <em>[Size: 2987]</em></span></div>
            <div class="pte-result-row pte-result-redirect"><span>/plugins</span><span>Status: <b>301</b></span></div>
            <div class="pte-result-row pte-result-redirect"><span>/themes</span><span>Status: <b>301</b></span></div>
            <div class="pte-cursor-line"><span class="pte-prompt">$</span><span class="pte-cursor"></span></div>
        </div>
        <aside class="pte-recon-summary pte-web-summary">
            <div class="pte-summary-label">ENUMERATION RESULT</div>
            <strong>Application Surface Expanded</strong>
            <div class="pte-summary-grid">
                <div><span>200 OK</span><b>3 Paths</b><small>README · admin.php · index.php</small></div>
                <div><span>301 REDIRECT</span><b>4 Paths</b><small>admin · content · plugins · themes</small></div>
            </div>
            <p>Primary lead: validate the exposed administration endpoint and identify the application version from public files.</p>
        </aside>
    </div>
</div>`
        },
        {
            title: '03 // INITIAL ACCESS',
            motion: 'zoom-out',
            hud: [['Phase','Initial Access'], ['Tool','curl · xmllint'], ['Artifacts','2 XML Files'], ['Identity','admin']],
            body: `
<div class="pte-artboard">
    <div class="pte-parrot-panel">
        <div class="pte-desktop-bar">
            <div class="pte-app-name"><span class="pte-parrot-mark">P</span><strong>Terminal</strong></div>
            <div class="pte-desktop-center">xml_credential_discovery — valeratech@parrot</div>
            <div class="pte-desktop-status"><span>ENG</span><span>14:37</span><span>▣</span></div>
        </div>
        <div class="pte-terminal-tabs">
            <div class="pte-tab is-active"><span>▣</span> Initial Access / Exposed XML Discovery</div>
            <div class="pte-window-controls"><i></i><i></i><i></i></div>
        </div>
        <div class="pte-terminal-body pte-xml-body">
            <div class="pte-command pte-command-wrap"><span class="pte-prompt">$</span> <span class="pte-cmd">curl -s <span class="pte-target">hxxp://10[.]129[.]129[.]43/nibbleblog/content/private/users.xml</span> \</span><br><span class="pte-command-indent">| xmllint --format -</span></div>
            <div class="pte-xml-block">
                <div><span class="pte-xml-meta">&lt;?xml version="1.0" encoding="UTF-8" standalone="yes"?&gt;</span></div>
                <div><span class="pte-xml-tag">&lt;users&gt;</span></div>
                <div class="pte-xml-indent"><span class="pte-xml-tag">&lt;user</span> <span class="pte-xml-attr">username=</span><span class="pte-xml-string">"admin"</span><span class="pte-xml-tag">&gt;</span></div>
                <div class="pte-xml-indent-2"><span class="pte-xml-tag">&lt;id</span> <span class="pte-xml-attr">type=</span><span class="pte-xml-string">"integer"</span><span class="pte-xml-tag">&gt;</span><span class="pte-xml-value">0</span><span class="pte-xml-tag">&lt;/id&gt;</span></div>
                <div class="pte-xml-indent-2"><span class="pte-xml-tag">&lt;session_fail_count</span> <span class="pte-xml-attr">type=</span><span class="pte-xml-string">"integer"</span><span class="pte-xml-tag">&gt;</span><span class="pte-xml-value">0</span><span class="pte-xml-tag">&lt;/session_fail_count&gt;</span></div>
                <div class="pte-xml-indent-2"><span class="pte-xml-tag">&lt;session_date</span> <span class="pte-xml-attr">type=</span><span class="pte-xml-string">"integer"</span><span class="pte-xml-tag">&gt;</span><span class="pte-xml-value">1514544131</span><span class="pte-xml-tag">&lt;/session_date&gt;</span></div>
                <div class="pte-xml-indent"><span class="pte-xml-tag">&lt;/user&gt;</span></div>
                <div><span class="pte-xml-tag">&lt;/users&gt;</span></div>
            </div>
            <div class="pte-command pte-command-wrap pte-command-second"><span class="pte-prompt">$</span> <span class="pte-cmd">curl -s <span class="pte-target">hxxp://10[.]129[.]129[.]43/nibbleblog/content/private/config.xml</span> \</span><br><span class="pte-command-indent">| xmllint --format - | grep -i 'name\|slogan\|title'</span></div>
            <div class="pte-xml-block pte-xml-block--compact">
                <div><span class="pte-xml-tag">&lt;name</span> <span class="pte-xml-attr">type=</span><span class="pte-xml-string">"string"</span><span class="pte-xml-tag">&gt;</span><span class="pte-xml-value">Nibbles</span><span class="pte-xml-tag">&lt;/name&gt;</span></div>
                <div><span class="pte-xml-tag">&lt;slogan</span> <span class="pte-xml-attr">type=</span><span class="pte-xml-string">"string"</span><span class="pte-xml-tag">&gt;</span><span class="pte-xml-value">Yum yum</span><span class="pte-xml-tag">&lt;/slogan&gt;</span></div>
                <div><span class="pte-xml-tag">&lt;seo_site_title</span> <span class="pte-xml-attr">type=</span><span class="pte-xml-string">"string"</span><span class="pte-xml-tag">&gt;</span><span class="pte-xml-value">Nibbles - Yum yum</span><span class="pte-xml-tag">&lt;/seo_site_title&gt;</span></div>
            </div>
            <div class="pte-cursor-line"><span class="pte-prompt">$</span><span class="pte-cursor"></span></div>
        </div>
        <aside class="pte-recon-summary pte-xml-summary">
            <div class="pte-summary-label">DISCOVERY RESULT</div>
            <strong>Administrative Identity Exposed</strong>
            <div class="pte-summary-grid">
                <div><span>USER RECORD</span><b>admin</b><small>users.xml</small></div>
                <div><span>APPLICATION</span><b>Nibbles</b><small>config.xml</small></div>
            </div>
            <p>Exposed private XML confirms the administrative username and application identity, creating the next authentication lead.</p>
        </aside>
    </div>
</div>`
        },
        {
            title: '04 // ADMIN AUTHENTICATION',
            motion: 'pan-right',
            hud: [['Phase','Initial Access'], ['Target','Admin Portal'], ['Identity','admin'], ['State','Credentials Entered']],
            body: `
<div class="pte-artboard pte-browser-artboard">
    <div class="pte-parrot-panel">
        <div class="pte-desktop-bar">
            <div class="pte-app-name"><span class="pte-firefox-mark" aria-hidden="true"></span><strong>Firefox</strong></div>
            <div class="pte-desktop-center">Nibbleblog administration — valeratech@parrot</div>
            <div class="pte-desktop-status"><span>ENG</span><span>14:41</span><span>▣</span></div>
        </div>
        <div class="pte-browser-tabs">
            <div class="pte-browser-tab is-active"><span class="pte-tab-favicon">N</span><span>Initial Access / Admin Login</span><b>×</b></div>
            <button class="pte-new-tab" type="button" tabindex="-1" aria-hidden="true">+</button>
            <div class="pte-window-controls"><i></i><i></i><i></i></div>
        </div>
        <div class="pte-browser-toolbar">
            <div class="pte-browser-nav"><span>←</span><span>→</span><span>↻</span></div>
            <div class="pte-address-bar"><span class="pte-address-status">ⓘ</span><span>10[.]129[.]129[.]43/nibbleblog/admin.php</span></div>
            <div class="pte-browser-menu">⋮</div>
        </div>
        <div class="pte-browser-page">
            <section class="pte-login-card" aria-label="Nibbleblog administration sign in">
                <h2>Sign in to Nibbleblog admin area</h2>
                <form class="pte-login-form">
                    <label>
                        <span class="pte-sr-only">Username</span>
                        <input type="text" value="admin" readonly aria-label="Username">
                    </label>
                    <label>
                        <span class="pte-sr-only">Password</span>
                        <input type="text" value="*******" readonly aria-label="Masked password">
                    </label>
                    <div class="pte-login-actions">
                        <label class="pte-remember"><input type="checkbox" tabindex="-1"><span>Remember me</span></label>
                        <button type="button" tabindex="-1">Login</button>
                    </div>
                    <a href="#" tabindex="-1">← Back to blog</a>
                </form>
            </section>
        </div>
        <aside class="pte-recon-summary pte-login-summary">
            <div class="pte-summary-label">AUTHENTICATION TARGET</div>
            <strong>Administrative Portal Reached</strong>
            <div class="pte-summary-grid">
                <div><span>USERNAME</span><b>admin</b><small>Recovered from users.xml</small></div>
                <div><span>PASSWORD</span><b>•••••••</b><small>Masked in presentation</small></div>
            </div>
            <p>The discovered administrative identity is staged against the exposed Nibbleblog login endpoint.</p>
        </aside>
    </div>
</div>`
        },
        {
            title: '05 // PLUGIN UPLOAD',
            motion: 'zoom-in',
            hud: [['Phase','Initial Access'], ['Surface','My Image Plugin'], ['Errors','6 PHP Warnings'], ['Signal','GD Failure']],
            body: `
<div class="pte-artboard pte-browser-artboard pte-plugin-artboard">
    <div class="pte-parrot-panel">
        <div class="pte-desktop-bar">
            <div class="pte-app-name"><span class="pte-firefox-mark" aria-hidden="true"></span><strong>Firefox</strong></div>
            <div class="pte-desktop-center">Nibbleblog plugins — valeratech@parrot</div>
            <div class="pte-desktop-status"><span>ENG</span><span>14:49</span><span>▣</span></div>
        </div>
        <div class="pte-browser-tabs">
            <div class="pte-browser-tab is-active"><span class="pte-tab-favicon">N</span><span>Initial Access / Plugin Upload</span><b>×</b></div>
            <button class="pte-new-tab" type="button" tabindex="-1" aria-hidden="true">+</button>
            <div class="pte-window-controls"><i></i><i></i><i></i></div>
        </div>
        <div class="pte-browser-toolbar">
            <div class="pte-browser-nav"><span>←</span><span>→</span><span>↻</span></div>
            <div class="pte-address-bar"><span class="pte-address-status">ⓘ</span><span>10[.]129[.]129[.]43/nibbleblog/admin.php?controller=plugins&amp;action=config&amp;plugin=my_image</span></div>
            <div class="pte-browser-menu">⋮</div>
        </div>
        <div class="pte-plugin-page">
            <section class="pte-php-warning-stack" aria-label="PHP image-processing warnings">
                <div><b>Warning:</b> imagesx() expects parameter 1 to be resource, boolean given in <span>/var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php</span> on line <strong>26</strong></div>
                <div><b>Warning:</b> imagesy() expects parameter 1 to be resource, boolean given in <span>/var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php</span> on line <strong>27</strong></div>
                <div><b>Warning:</b> imagecreatetruecolor(): Invalid image dimensions in <span>/var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php</span> on line <strong>117</strong></div>
                <div><b>Warning:</b> imagecopyresampled() expects parameter 1 to be resource, boolean given in <span>/var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php</span> on line <strong>118</strong></div>
                <div><b>Warning:</b> imagejpeg() expects parameter 1 to be resource, boolean given in <span>/var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php</span> on line <strong>43</strong></div>
                <div><b>Warning:</b> imagedestroy() expects parameter 1 to be resource, boolean given in <span>/var/www/html/nibbleblog/admin/kernel/helpers/resize.class.php</span> on line <strong>80</strong></div>
            </section>
            <section class="pte-nibble-admin" aria-label="Nibbleblog My image plugin configuration">
                <nav class="pte-nibble-sidebar">
                    <a>▣ <span>Publish</span></a><a>◯ <span>Comments</span></a><a>▰ <span>Manage</span></a><a>⚙ <span>Settings</span></a><a>▧ <span>Themes</span></a><a class="is-active">▰ <span>Plugins</span></a>
                </nav>
                <div class="pte-plugin-main">
                    <header><h2>♞ nibbleblog - Plugins :: My image</h2><div><span>◔ Dashboard</span><span>◆ View Blog</span><span>↪ Log out</span></div></header>
                    <div class="pte-plugin-form">
                        <label><span>Title</span><input value="My image" readonly></label>
                        <label><span>Position</span><select tabindex="-1"><option>4</option></select></label>
                        <label><span>Caption</span><input value="" readonly></label>
                        <div class="pte-file-control"><button type="button" tabindex="-1">Browse...</button><span>No file selected.</span></div>
                        <button class="pte-save-button" type="button" tabindex="-1">Save changes</button>
                    </div>
                </div>
            </section>
        </div>
        <aside class="pte-recon-summary pte-warning-summary">
            <div class="pte-summary-label">APPLICATION SIGNAL</div>
            <strong>Image Processing Failed</strong>
            <div class="pte-summary-grid">
                <div><span>COMPONENT</span><b>resize.class.php</b><small>Six warnings exposed</small></div>
                <div><span>FAILURE</span><b>Invalid resource</b><small>GD image pipeline</small></div>
            </div>
            <p>The plugin view remains available, but verbose PHP output exposes internal paths and confirms the upload workflow reached server-side image handling.</p>
        </aside>
    </div>
</div>`
        },
        {
            title: '06 // UPLOAD VERIFICATION',
            motion: 'pan-left',
            hud: [['Phase','Initial Access'], ['Surface','Directory Index'], ['Path','private/plugins'], ['Lead','my_image/']],
            body: `
<div class="pte-artboard pte-browser-artboard pte-directory-artboard">
    <div class="pte-parrot-panel">
        <div class="pte-desktop-bar">
            <div class="pte-app-name"><span class="pte-firefox-mark" aria-hidden="true"></span><strong>Firefox</strong></div>
            <div class="pte-desktop-center">Apache directory index — valeratech@parrot</div>
            <div class="pte-desktop-status"><span>ENG</span><span>14:53</span><span>▣</span></div>
        </div>
        <div class="pte-browser-tabs">
            <div class="pte-browser-tab is-active"><span class="pte-tab-favicon">A</span><span>Initial Access / Upload Verification</span><b>×</b></div>
            <button class="pte-new-tab" type="button" tabindex="-1" aria-hidden="true">+</button>
            <div class="pte-window-controls"><i></i><i></i><i></i></div>
        </div>
        <div class="pte-browser-toolbar">
            <div class="pte-browser-nav"><span>←</span><span>→</span><span>↻</span></div>
            <div class="pte-address-bar"><span class="pte-address-status">ⓘ</span><span>10[.]129[.]129[.]194/nibbleblog/content/private/plugins/</span></div>
            <div class="pte-browser-menu">⋮</div>
        </div>
        <div class="pte-directory-page">
            <section class="pte-apache-index" aria-label="Apache directory listing">
                <h1>Index of /nibbleblog/content/private/plugins</h1>
                <div class="pte-directory-table" role="table" aria-label="Directory contents">
                    <div class="pte-directory-row pte-directory-head" role="row"><a>Name</a><a>Last modified</a><a>Size</a><a>Description</a></div>
                    <div class="pte-directory-rule"></div>
                    <div class="pte-directory-row" role="row"><a><span class="pte-parent-icon">↩</span> Parent Directory</a><span></span><span>-</span><span></span></div>
                    <div class="pte-directory-row" role="row"><a><span class="pte-folder-icon">▰</span> categories/</a><span>2017-12-10 23:27</span><span>-</span><span></span></div>
                    <div class="pte-directory-row" role="row"><a><span class="pte-folder-icon">▰</span> hello/</a><span>2017-12-10 23:27</span><span>-</span><span></span></div>
                    <div class="pte-directory-row" role="row"><a><span class="pte-folder-icon">▰</span> latest_posts/</a><span>2017-12-10 23:27</span><span>-</span><span></span></div>
                    <div class="pte-directory-row pte-directory-highlight" role="row"><a><span class="pte-folder-icon">▰</span> my_image/</a><span>2026-07-27 16:29</span><span>-</span><span></span></div>
                    <div class="pte-directory-row" role="row"><a><span class="pte-folder-icon">▰</span> pages/</a><span>2017-12-10 23:27</span><span>-</span><span></span></div>
                    <div class="pte-directory-rule pte-directory-rule-bottom"></div>
                </div>
                <p class="pte-apache-signature"><em>Apache/2.4.18 (Ubuntu) Server at 10.129.129.194 Port 80</em></p>
            </section>
        </div>
        <aside class="pte-recon-summary pte-directory-summary">
            <div class="pte-summary-label">UPLOAD VERIFICATION</div>
            <strong>Plugin Storage Exposed</strong>
            <div class="pte-summary-grid">
                <div><span>DIRECTORY</span><b>my_image/</b><small>Recently modified path</small></div>
                <div><span>SERVER</span><b>Apache 2.4.18</b><small>Directory indexing enabled</small></div>
            </div>
            <p>The exposed plugin directory confirms writable application storage and provides a direct path for validating uploaded content.</p>
        </aside>
    </div>
</div>`
        },
        {
            title: '07 // PRIVILEGE ESCALATION',
            motion: 'zoom-out',
            hud: [['Phase','Privilege Escalation'], ['Control','sudo -l'], ['Target','monitor.sh'], ['Risk','NOPASSWD Root']],
            body: `
<div class="pte-artboard pte-privesc-artboard">
    <div class="pte-parrot-panel">
        <div class="pte-desktop-bar">
            <div class="pte-app-name"><span class="pte-parrot-mark">P</span><strong>Terminal</strong></div>
            <div class="pte-desktop-center">sudo_misconfiguration — valeratech@parrot</div>
            <div class="pte-desktop-status"><span>ENG</span><span>15:06</span><span>▣</span></div>
        </div>
        <div class="pte-terminal-tabs">
            <div class="pte-tab is-active"><span>▣</span> Privilege Escalation / Sudo Misconfiguration</div>
            <div class="pte-window-controls"><i></i><i></i><i></i></div>
        </div>
        <div class="pte-terminal-body pte-privesc-body">
            <div class="pte-command"><span class="pte-prompt">$</span> <span class="pte-cmd">ls -l /home/nibbler/personal/stuff/</span></div>
            <div class="pte-permission-row"><span class="pte-permission-risk">-rwxrwxrwx</span> <span>1 nibbler nibbler 4015 May&nbsp;&nbsp;8&nbsp;&nbsp;2015</span> <strong>monitor.sh</strong></div>
            <div class="pte-gap"></div>
            <div class="pte-command"><span class="pte-prompt">$</span> <span class="pte-cmd">sudo -l</span></div>
            <div>Matching Defaults entries for <span class="pte-value">nibbler</span> on <span class="pte-target">Nibbles</span>:</div>
            <div class="pte-output-indent">env_reset, mail_badpass,</div>
            <div class="pte-output-indent">secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin</div>
            <div class="pte-gap"></div>
            <div>User <span class="pte-value">nibbler</span> may run the following commands on <span class="pte-target">Nibbles</span>:</div>
            <div class="pte-sudo-rule"><span>(root)</span> <b>NOPASSWD:</b> <strong>/home/nibbler/personal/stuff/monitor.sh</strong></div>
            <div class="pte-privesc-equation" aria-label="Privilege escalation condition">
                <span>[writable by attacker]</span><b>+</b><span>[executed as root]</span><b>=</b><strong>privilege escalation path</strong>
            </div>
            <div class="pte-cursor-line"><span class="pte-prompt">$</span><span class="pte-cursor"></span></div>
        </div>
        <aside class="pte-recon-summary pte-privesc-summary">
            <div class="pte-summary-label">PRIVILEGE ESCALATION</div>
            <strong>Root Execution Path Confirmed</strong>
            <div class="pte-summary-grid">
                <div><span>FILE CONTROL</span><b>World Writable</b><small>monitor.sh · 0777</small></div>
                <div><span>SUDO POLICY</span><b>NOPASSWD Root</b><small>Exact script allowed</small></div>
            </div>
            <p>The attacker-controlled script can be modified and then executed through sudo as root without supplying a password.</p>
        </aside>
    </div>
</div>`
        },
        {
            title: '08 // OBJECTIVE COMPLETE',
            motion: 'zoom-in',
            hud: [['Phase','Objective Complete'], ['Access','Root Shell'], ['Identity','uid=0(root)'], ['Evidence','root.txt Redacted']],
            body: `
<div class="pte-artboard pte-root-artboard">
    <div class="pte-parrot-panel">
        <div class="pte-desktop-bar">
            <div class="pte-app-name"><span class="pte-parrot-mark">P</span><strong>Terminal</strong></div>
            <div class="pte-desktop-center">root_shell — valeratech@parrot</div>
            <div class="pte-desktop-status"><span>ENG</span><span>15:14</span><span>▣</span></div>
        </div>
        <div class="pte-terminal-tabs">
            <div class="pte-tab is-active"><span>▣</span> Objective Complete / Root Shell</div>
            <div class="pte-window-controls"><i></i><i></i><i></i></div>
        </div>
        <div class="pte-terminal-body pte-root-body">
            <div class="pte-command"><span class="pte-prompt">$</span> <span class="pte-cmd">nc -lvnp &lt;PORT&gt;</span></div>
            <div>Listening on <span class="pte-value">0.0.0.0 &lt;PORT&gt;</span></div>
            <div>Connection received on <span class="pte-target">10[.]129[.]131[.]228</span></div>
            <div class="pte-gap"></div>
            <div class="pte-command"><span class="pte-prompt">$</span> <span class="pte-cmd">sudo /home/nibbler/personal/stuff/monitor.sh</span></div>
            <div class="pte-gap"></div>
            <div class="pte-command pte-root-command"><span class="pte-root-prompt">#</span> <span class="pte-cmd">id</span></div>
            <div class="pte-root-proof">uid=0(root) gid=0(root) groups=0(root)</div>
            <div class="pte-gap pte-gap-tight"></div>
            <div class="pte-command pte-root-command"><span class="pte-root-prompt">#</span> <span class="pte-cmd">whoami</span></div>
            <div class="pte-root-proof">root</div>
            <div class="pte-gap pte-gap-tight"></div>
            <div class="pte-command pte-root-command"><span class="pte-root-prompt">#</span> <span class="pte-cmd">cat /root/root.txt</span></div>
            <div class="pte-redacted-proof">[REDACTED]</div>
            <div class="pte-cursor-line"><span class="pte-root-prompt">#</span><span class="pte-cursor"></span></div>
        </div>
        <aside class="pte-recon-summary pte-root-summary">
            <div class="pte-summary-label">OBJECTIVE COMPLETE</div>
            <strong>Root Access Confirmed</strong>
            <div class="pte-summary-grid">
                <div><span>IDENTITY</span><b>uid=0(root)</b><small>Effective superuser context</small></div>
                <div><span>PROOF</span><b>root.txt</b><small>Flag safely redacted</small></div>
            </div>
            <p>The writable sudo-authorized script produced a privileged shell. Identity checks confirm root access while sensitive proof remains redacted.</p>
        </aside>
    </div>
</div>`
        },
        {
            title: '09 // DEFENSIVE ANALYSIS',
            motion: 'zoom-out',
            hud: [['Phase','Remediation'], ['Chain Breakers','4'], ['Detections','7'], ['ATT&CK','8 Techniques']],
            body: `
<div class="pte-artboard pte-def-artboard">
    <div class="pte-def-panel">
        <header class="pte-def-head">
            <div>
                <div class="pte-def-eyebrow">Nibbles &middot; Remediation &amp; Defensive Analysis</div>
                <h2 class="pte-def-title">The control that breaks the chain</h2>
                <p class="pte-def-sub">Individually moderate weaknesses combined into a full compromise. Removing any one critical link would have stopped root access.</p>
            </div>
            <span class="pte-def-badge"><i></i>BLUE TEAM VIEW</span>
        </header>
        <div class="pte-def-grid">
            <section class="pte-def-col">
                <div class="pte-def-col-head"><span>Tier 1</span>Attack chain breakers</div>
                <article class="pte-def-card">
                    <b>Default / guessable credentials</b>
                    <span>Random admin password. Never reuse a value that appears elsewhere in config.</span>
                    <em>Breaks &rarr; initial access</em>
                </article>
                <article class="pte-def-card">
                    <b>Insufficient upload validation</b>
                    <span>Allowlist by magic bytes, not extension. Rename server-side to a safe extension.</span>
                    <em>Breaks &rarr; webshell plant</em>
                </article>
                <article class="pte-def-card">
                    <b>Executable content in web root</b>
                    <span>Store uploads outside the web root, or disable script execution at the server level.</span>
                    <em>Breaks &rarr; code execution</em>
                </article>
                <article class="pte-def-card">
                    <b>World-writable script with NOPASSWD sudo</b>
                    <span>Sudo-authorized scripts must be root-owned and root-writable only.</span>
                    <em>Breaks &rarr; privilege escalation</em>
                </article>
            </section>
            <section class="pte-def-col">
                <div class="pte-def-col-head"><span>Tier 3</span>Detection opportunities</div>
                <article class="pte-def-detect">
                    <b>HTTP 404 spike from one source</b>
                    <span>Directory brute-force signature. Correlate rate, agent, and path pattern.</span>
                    <i>T1083</i>
                </article>
                <article class="pte-def-detect">
                    <b>Config data files fetched over HTTP</b>
                    <span>Requests for users.xml / config.xml precede credential-derived admin login.</span>
                    <i>T1552.001</i>
                </article>
                <article class="pte-def-detect">
                    <b>Upload then immediate execution</b>
                    <span>New .php under an upload path, then a GET to that exact path. High-confidence webshell.</span>
                    <i>T1190</i>
                </article>
                <article class="pte-def-detect">
                    <b>Reverse shell process tree</b>
                    <span>mkfifo in /tmp, /bin/sh -i under the web user, outbound nc to a non-standard port.</span>
                    <i>T1059.004</i>
                </article>
                <article class="pte-def-detect">
                    <b>Sudo-referenced file modified, then run</b>
                    <span>File-integrity alert on any sudoers-listed script written by a non-root user.</span>
                    <i>T1548.003</i>
                </article>
            </section>
        </div>
        <footer class="pte-def-strip">
            <div><span>Findings</span><strong>4 critical &middot; 6 high</strong></div>
            <div><span>Detection opportunities</span><strong>7 documented</strong></div>
            <div><span>ATT&amp;CK coverage</span><strong>8 techniques</strong></div>
            <div><span>Root cause</span><strong>CVE-2015-6967</strong></div>
        </footer>
    </div>
</div>
            `
        }
    ];

    function initPentestPreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, PENTEST_SCENES, renderPentestScene, PENTEST_SCENE_INTERVAL_MS);
    }

    // ── Cybersecurity Investigations scenes ───────────────
    // Artboards are "cyi-" prefixed so they never collide with other
    // projects sharing this engine. The shared engine (cf-engine-*,
    // cf-hud, cf-glitch-fx) provides scene cycling, HUD, dot pagination,
    // Ken Burns motion, and the Signal Acquisition interference sequence
    // automatically — this project only supplies scene data + a renderer.
    const CYBER_SCENE_INTERVAL_MS = 6200;

    function renderCyberScene(scene, index) {
        return '<article class="cf-engine-scene' + (index === 0 ? ' is-visible' : '') + '" data-motion="' + scene.motion + '">' +
            '<div class="cf-engine-inner">' + scene.body + hudMarkup(scene.title, scene.hud) + '</div>' +
            '</article>';
    }

    // Scene values are transcribed from the public case record
    // (valeratech/cybersecurity-investigations-portfolio); every other word is
    // interface wording. See docs/media-preview.md, Evidence Tier.
    const CYBER_SCENES = [
        {
            title: '01 // CASE INDEX',
            motion: 'zoom-in',
            hud: [['CyberDefenders','9'], ['Security Blue Team','1'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Index</span><h2 class="cyi-title">Cybersecurity Investigations Portfolio</h2><span class="cyi-tag">Case record · 2026-10-04</span></header>
        <section class="cyi-win is-idx">
            <div class="cyi-winbar"><i></i><b>Investigation Index</b><span>CyberDefenders — 9 investigations</span><em>Security Blue Team (BTLO) — 1 investigation</em></div>
            <div class="cyi-body">
                <div class="cyi-tbl">
                    <div class="cyi-tr cyi-c01 is-h"><span>Case</span><span>Investigation</span><span>Platform</span><span>Status</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">001</span><span>Macro Malware Data Exfiltration – Network Forensics</span><span>CyberDefenders</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">002</span><span>Web Upload Abuse → Cobalt Strike C2 → Lateral Movement &amp; Attempted Exfiltration</span><span>CyberDefenders</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">003</span><span>HR Webshell → AD Enum → LSASS Dump → Tunnel Pivot → SMB Enumeration</span><span>CyberDefenders</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">004</span><span>Office RTF (Equation Editor) → PowerShell Persistence → C2</span><span>CyberDefenders</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">005</span><span>Disk Forensics — Telegram, Covenant, mimikatz masquerade, and persistence artifacts</span><span>CyberDefenders</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">006</span><span>WmiPrvSE-Spawned PowerShell and a Masqueraded LSASS Dump Invocation</span><span>CyberDefenders</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">007</span><span>Memory EVTX Extraction, RDP Intrusion, WMIC Lateral Movement, Recovered LSASS Dump Command</span><span>CyberDefenders</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">008</span><span>SSH Brute-Force, Authentication Abuse, and Post-Exploitation</span><span>CyberDefenders</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">009</span><span>OSK Hijack Persistence and Cerber Botnet Activity</span><span>Security Blue Team</span><span>Complete</span></div>
                    <div class="cyi-tr cyi-c01"><span class="cyi-m">010</span><span>TeamCity APT Ransomware – Lateral Movement &amp; Data Exfiltration</span><span>CyberDefenders</span><span>Complete</span></div>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Scope of the record</b>
                    <span><i>Source</i><code>README.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-rec">Data</span><span>Case evidence and scenario data in the current repository content come from cyber-range lab environments.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-rec">Indicators</span><span>Indicators of compromise in this repository are defanged in prose, IOC tables and inline references</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '02 // NFDUMP FLOWS',
            motion: 'zoom-in',
            hud: [['Case','001'], ['Total flows','50'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 001</span><h2 class="cyi-title">Macro Malware Data Exfiltration – Network Forensics</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-term">
            <div class="cyi-winbar"><i></i><b>nfpcapd + nfdump</b><span>Network Analysis – Top Talkers (NetFlow)</span><em>All timestamps are from 2019-02-07 UTC.</em></div>
            <div class="cyi-body">
                <div class="cyi-term">
                    <div class="cyi-l"><span class="cyi-p">&#36; </span>nfdump -R ~/netflow_data -s record/bytes -n 10</div>
                    <div class="cyi-l"><span class="cyi-dim"># This block is a normalized reconstruction, not a verbatim transcript.</span></div>
                    <div class="cyi-tr cyi-c02 is-h"><span>#</span><span>First seen (UTC)</span><span>Flow source</span><span>Flow destination</span><span>In Byte</span></div>
                    <div class="cyi-tr cyi-c02"><span>1</span><span>19:02:51.152</span><span>205[.]186[.]187[.]108:80</span><span>10[.]2[.]7[.]101:49158</span><span>936,090</span></div>
                    <div class="cyi-tr cyi-c02"><span>2</span><span>20:20:00.016</span><span>10[.]2[.]7[.]101:49171</span><span>89[.]46[.]222[.]42:12087</span><span>153,266</span></div>
                    <div class="cyi-tr cyi-c02"><span>3</span><span>21:00:00.498</span><span>10[.]2[.]7[.]101:49175</span><span>89[.]46[.]222[.]42:12049</span><span>153,263</span></div>
                    <div class="cyi-tr cyi-c02"><span>4</span><span>20:40:00.481</span><span>10[.]2[.]7[.]101:49173</span><span>89[.]46[.]222[.]42:12028</span><span>153,262</span></div>
                    <div class="cyi-tr cyi-c02"><span>5</span><span>21:19:59.766</span><span>10[.]2[.]7[.]101:49177</span><span>89[.]46[.]222[.]42:12002</span><span>153,260</span></div>
                    <div class="cyi-tr cyi-c02"><span>6</span><span>20:00:00.637</span><span>10[.]2[.]7[.]101:49169</span><span>89[.]46[.]222[.]42:12050</span><span>153,257</span></div>
                </div>
                <div class="cyi-strip"><span>Rows one to six of the ten recorded</span><span>Total bytes 1.8 M</span><span>Total packets 2,367</span><span>Capture window 2019-02-07 19:02:50–21:20:52 UTC</span></div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>network-top-talkers.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-rec">Reading</span><span>Row 1 therefore records 936,090 bytes sent by the delivery server to the victim. Rows 2 to 6 record bytes sent by the victim to the exfiltration server.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-not">Limit</span><span>The capture-window end is the final timestamp reported by nfdump. It does not establish that exfiltration ceased at that time.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '03 // ZUI ALERT TRIAGE',
            motion: 'zoom-in',
            hud: [['Case','002'], ['Alerts','Suricata'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 002</span><h2 class="cyi-title">Web Upload Abuse → Cobalt Strike C2 → Lateral Movement &amp; Attempted Exfiltration</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-zui">
            <div class="cyi-winbar"><i></i><b>Zui</b><span>Alert Triage – Signatures, Filters, and Extracted Stream</span><em>Collected from Suricata alert logs by signature frequency</em></div>
            <div class="cyi-body">
                <div class="cyi-q"><em>Queries / Filters Used (Zui-style)</em><code>alert</code><code>alert | dest_ip==113[.]26[.]232[.]2</code><code>alert | dest_ip==113[.]26[.]232[.]2 | count() by alert.signature</code></div>
                <div class="cyi-cols cyi-g03">
                    <div class="cyi-pane">
                        <div class="cyi-pane-h">Destination IP Distribution (Observed)</div>
                        <div class="cyi-tr cyi-c03a">
                            <span class="cyi-m">113[.]26[.]232[.]2</span>
                            <span class="cyi-bar"><i style="width:100.0%"></i></span>
                            <span class="cyi-m">29870</span>
                        </div>
                        <div class="cyi-tr cyi-c03a">
                            <span class="cyi-m">10[.]0[.]128[.]0</span>
                            <span class="cyi-bar"><i style="width:2.0%"></i></span>
                            <span class="cyi-m">596</span>
                        </div>
                        <div class="cyi-tr cyi-c03a">
                            <span class="cyi-m">10[.]0[.]128[.]3</span>
                            <span class="cyi-bar"><i style="width:1.0%"></i></span>
                            <span class="cyi-m">294</span>
                        </div>
                        <div class="cyi-tr cyi-c03a">
                            <span class="cyi-m">10[.]0[.]128[.]1</span>
                            <span class="cyi-bar"><i style="width:1.0%"></i></span>
                            <span class="cyi-m">109</span>
                        </div>
                        <div class="cyi-tr cyi-c03a">
                            <span class="cyi-m">10[.]0[.]128[.]130</span>
                            <span class="cyi-bar"><i style="width:1.0%"></i></span>
                            <span class="cyi-m">96</span>
                        </div>
                        <div class="cyi-tr cyi-c03a">
                            <span class="cyi-m">1[.]174[.]208[.]130</span>
                            <span class="cyi-bar"><i style="width:1.0%"></i></span>
                            <span class="cyi-m">24</span>
                        </div>
                        <div class="cyi-tr cyi-c03a">
                            <span class="cyi-m">Missing destination IP</span>
                            <span class="cyi-bar"><i style="width:1.0%"></i></span>
                            <span class="cyi-m">34</span>
                        </div>
                    </div>
                    <div class="cyi-pane">
                        <div class="cyi-pane-h">Alert Signature Counts (Initial View)</div>
                        <div class="cyi-tr cyi-c03b"><span>ET HUNTING GENERIC SUSPICIOUS POST to Dotted Quad with Fake Browser 1</span><span class="cyi-m">618</span></div>
                        <div class="cyi-tr cyi-c03b"><span>ET MALWARE Cobalt Strike Beacon Observed</span><span class="cyi-m">14317</span></div>
                        <div class="cyi-tr cyi-c03b"><span>ET POLICY SMB2 NT Create AndX Request For a DLL File - Possible Lateral Movement</span><span class="cyi-m">2</span></div>
                        <div class="cyi-pane-h">Extracted HTTP Stream (Beacon Example)</div>
                        <div class="cyi-term is-two">
                            <div><div class="cyi-l">GET /en_US/all.js HTTP/1.1</div><div class="cyi-l">Host: 113[.]26[.]232[.]2</div><div class="cyi-l">User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)</div></div>
                            <div><div class="cyi-l">HTTP/1.1 200 OK</div><div class="cyi-l">Content-Type: application/octet-stream</div><div class="cyi-l">Content-Length: 0</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Interim Conclusion</b>
                    <span><i>Source</i><code>alert-triage-signatures-and-filters.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-rec">Record</span><span>External host 113[.]26[.]232[.]2 is highly likely associated with Cobalt Strike C2 infrastructure.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-rec">Record</span><span>Repeated HTTP requests with consistent user-agent strings and minimal response payloads are indicative of beaconing activity.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '04 // WIRESHARK + ZEEK',
            motion: 'zoom-in',
            hud: [['Case','003'], ['Capture','PCAP (E-001)'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 003</span><h2 class="cyi-title">HR Webshell → AD Enum → LSASS Dump → Tunnel Pivot → SMB Enumeration</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-wire">
            <div class="cyi-winbar"><i></i><b>Suricata + Wireshark + Zeek</b><span>Network Scan &amp; Reconnaissance Attribution</span><em>All timestamps referenced in this document are treated as UTC.</em></div>
            <div class="cyi-body">
                <div class="cyi-tbl">
                    <div class="cyi-tr cyi-c04 is-h"><span>Timestamp</span><span>Signature</span><span>Source IP</span><span>Destination IP</span><span>Destination Port</span></div>
                    <div class="cyi-tr cyi-c04"><span class="cyi-m">2025-05-20 18:20:46Z</span><span>ET SCAN RDP Connection Attempt from Nmap</span><span class="cyi-m">3[.]68[.]76[.]39</span><span class="cyi-m">10[.]10[.]3[.]115</span><span class="cyi-m">3389/TCP</span></div>
                    <div class="cyi-tr cyi-c04"><span class="cyi-m">2025-05-20 18:28:03Z</span><span>ET WEB_SERVER WebShell Generic - ASP File Uploaded</span><span class="cyi-m">3[.]68[.]76[.]39</span><span class="cyi-m">10[.]10[.]3[.]115</span><span class="cyi-m">80/TCP</span></div>
                </div>
                <div class="cyi-cols cyi-g04">
                    <div class="cyi-pane">
                        <div class="cyi-pane-h">RDP Negotiation Artifact</div>
                        <div class="cyi-kv"><span>RDP Cookie:</span><span class="cyi-m">mstshash=nmap</span></div>
                        <div class="cyi-kv"><span>Requested Capabilities:</span><span>TLS, CredSSP, Early User Authorization</span></div>
                        <div class="cyi-pane-h">Request Details</div>
                        <div class="cyi-kv"><span>Method:</span><span class="cyi-m">POST</span></div>
                        <div class="cyi-kv"><span>URI:</span><span class="cyi-m">/profile.aspx</span></div>
                        <div class="cyi-kv"><span>Host:</span><span class="cyi-m">hr[.]compliantsecure[.]store</span></div>
                    </div>
                    <div class="cyi-pane">
                        <div class="cyi-pane-h">Extracted File Metadata (Zeek)</div>
                        <div class="cyi-kv"><span>Filename:</span><span class="cyi-m">mycv.aspx</span></div>
                        <div class="cyi-kv"><span>MIME Type:</span><span class="cyi-m">text/plain</span></div>
                        <div class="cyi-kv"><span>Transfer Timestamp:</span><span class="cyi-m">2025-05-20 18:28:03Z</span></div>
                        <div class="cyi-kv"><span>MD5:</span><span class="cyi-m">2be86b49e21ebbbc1507ee5ac97f47e4</span></div>
                        <div class="cyi-kv"><span>SHA1:</span><span class="cyi-m">21cfe9efa65fd2a09aaf21cf633fb4160db1f62a</span></div>
                        <div class="cyi-kv"><span>Observed Size:</span><span class="cyi-m">~20 KB</span></div>
                    </div>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Analytical Assessment</b>
                    <span><i>Source</i><code>002-network-scan-and-recon-attribution.md</code><code>003-webshell-upload-and-http-exploitation.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-rec">Record</span><span>Provides high-confidence attribution of the RDP scanning activity to nmap.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-rec">Record</span><span>The upload of mycv.aspx is assessed as the initial access vector used by the attacker to compromise the HR web server.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '05 // MFT TIMELINE',
            motion: 'zoom-in',
            hud: [['Case','004'], ['Time Standard','UTC'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 004</span><h2 class="cyi-title">Office RTF (Equation Editor) → PowerShell Persistence → C2</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-ez">
            <div class="cyi-winbar"><i></i><b>MFTECmd + Timeline Explorer</b><span>Consolidated Timeline (UTC)</span><em>Output CSV was reviewed in Timeline Explorer.</em></div>
            <div class="cyi-body">
                <div class="cyi-q"><em>Command Executed:</em><code>MFTECmd.exe -f "C:&#92;Users&#92;Administrator&#92;Desktop&#92;Start Here&#92;Artifacts&#92;C&#92;&#36;MFT" --csv "MyOutputFile"</code></div>
                <div class="cyi-tbl">
                    <div class="cyi-tr cyi-c05 is-h"><span>Timestamp (UTC)</span><span>Event Description</span><span>Evidence Source</span><span>Artifact / Path</span></div>
                    <div class="cyi-tr cyi-c05"><span class="cyi-m">2025-05-23 10:52:59</span><span>User accessed phishing portal (defanged)</span><span>Edge History (SQLite)</span><span class="cyi-m">Edge&#92;User Data&#92;Default</span></div>
                    <div class="cyi-tr cyi-c05"><span class="cyi-m">2025-05-23 10:53:22</span><span>File created on disk</span><span>NTFS &#36;MFT</span><span class="cyi-m">...&#92;Users&#92;harrisr&#92;Downloads&#92;Financial_Report.rtf</span></div>
                    <div class="cyi-tr cyi-c05"><span class="cyi-m">2025-05-23 10:53:22</span><span>Zone.Identifier ADS created (internet origin)</span><span>NTFS ADS</span><span class="cyi-m">Financial_Report.rtf:Zone.Identifier</span></div>
                    <div class="cyi-tr cyi-c05"><span class="cyi-m">2025-05-23 10:53:35</span><span>Recent file shortcut created</span><span>NTFS &#36;MFT</span><span class="cyi-m">...&#92;Windows&#92;Recent&#92;Financial_Report.lnk</span></div>
                    <div class="cyi-tr cyi-c05"><span class="cyi-m">2025-05-23 10:54:02</span><span>Outbound connection to external host on TCP port 4444</span><span>Sysmon EID 3</span><span class="cyi-m">PowerShell → 63[.]176[.]96[.]97:4444</span></div>
                    <div class="cyi-tr cyi-c05"><span class="cyi-m">2025-05-23 11:15:43</span><span>Malicious PowerShell script created</span><span>NTFS &#36;MFT</span><span class="cyi-m">%TEMP%&#92;msupdate.ps1</span></div>
                    <div class="cyi-tr cyi-c05"><span class="cyi-m">2025-05-23 11:17:50</span><span>Registry Run key value created</span><span>Sysmon EID 13</span><span class="cyi-m">HKCU&#92;...&#92;Run&#92;Microsoft Update Assistant</span></div>
                    <div class="cyi-tr cyi-c05"><span class="cyi-m">2025-05-23 11:17:51</span><span>Startup folder persistence created</span><span>Sysmon EID 11</span><span class="cyi-m">Startup&#92;WindowsUpdate.lnk</span></div>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Timeline Observations</b>
                    <span><i>Source</i><code>mftecmd-command.txt</code><code>timeline.md</code><code>artifacts-of-interest.md</code><code>README.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-rec">Record</span><span>Initial access and payload delivery occurred within 23 seconds</span></p>
                <p class="cyi-f"><span class="cyi-chip is-obs">Observed</span><span>Office Version 15.0.4420.1017</span></p>
                <p class="cyi-f"><span class="cyi-chip is-range">Range-recorded answer</span><span>CVE CVE-2017-11882</span></p>
                <p class="cyi-f"><span class="cyi-chip is-rec">Collection</span><span>KAPE (artifact collection paths observed)</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '06 // REGISTRY + NTFS LOG',
            motion: 'zoom-in',
            hud: [['Case','005'], ['Hives','SYSTEM and SOFTWARE'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 005</span><h2 class="cyi-title">Disk Forensics — Telegram, Covenant, mimikatz masquerade, and persistence artifacts</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-reg">
            <div class="cyi-winbar"><i></i><b>Registry Explorer + NTFS Log Tracker</b><span>Tools and Commands Used</span><em>Only metadata documented in this repository.</em></div>
            <div class="cyi-body">
                <div class="cyi-cols cyi-g06">
                    <div class="cyi-pane">
                        <div class="cyi-pane-h">Service-Based Persistence</div>
                        <div class="cyi-l">HKLM&#92;SYSTEM&#92;ControlSet001&#92;Services&#92;cleanup-schedule</div>
                        <div class="cyi-kv"><span>ImagePath</span><span class="cyi-m">C:&#92;Users&#92;Administrator&#92;Downloads&#92;Telegram Desktop&#92;Minecraft.exe</span></div>
                        <div class="cyi-kv"><span>Start</span><span class="cyi-m">2</span></div>
                        <div class="cyi-kv"><span>ObjectName</span><span class="cyi-m">LocalSystem</span></div>
                        <div class="cyi-note">No surviving artifact shows the service executing.</div>
                        <div class="cyi-pane-h">Scheduled Task Validation</div>
                        <div class="cyi-l">...&#92;Windows&#92;System32&#92;Tasks&#92;spawn</div>
                        <div class="cyi-kv"><span>Command</span><span class="cyi-m">value ending in &#92;Downloads&#92;Telegram</span></div>
                        <div class="cyi-kv"><span>Arguments</span><span class="cyi-m">Desktop&#92;Minecraft.exe</span></div>
                        <div class="cyi-kv"><span>&lt;StartBoundary&gt;</span><span class="cyi-m">2022-11-11 20:10:00, no Z or numeric offset stated</span></div>
                    </div>
                    <div class="cyi-pane">
                        <div class="cyi-pane-h">Rename Correlation (Masquerade Validation)</div>
                        <div class="cyi-chips"><code>Parse &#36;LogFile</code><code>Parse &#36;MFT</code><code>Parse &#36;Extend&#92;&#36;J</code></div>
                        <div class="cyi-note">Establish that both names refer to the same file record; earlier name mimikatz.exe.</div>
                        <div class="cyi-note">Confirm mimikatz.exe → svchost.exe rename sequence</div>
                        <div class="cyi-pane-h">User Creation Validation</div>
                        <div class="cyi-note">Event Log Explorer · Event ID 4720 (User creation)</div>
                        <div class="cyi-kv"><span>New account:</span><span class="cyi-m">cpitter</span></div>
                        <div class="cyi-kv"><span>Timestamp:</span><span class="cyi-m">2022-11-11 21:23:51 UTC</span></div>
                        <div class="cyi-note">No surviving artifact shows subsequent use of the account.</div>
                    </div>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>What the record states</b>
                    <span><i>Source</i><code>tools-and-commands.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-rec">Time basis</span><span>Timestamps are recorded on the basis each source attests. No offset is inferred and no value is converted using the host timezone setting.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-enr">Enrichment</span><span>Record the Covenant identification returned by community data (analyst-derived enrichment)</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '07 // VOLATILITY',
            motion: 'zoom-in',
            hud: [['Case','006'], ['Image UTC','2023-02-03 13:29:33'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 006</span><h2 class="cyi-title">WmiPrvSE-Spawned PowerShell and a Masqueraded LSASS Dump Invocation</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-term">
            <div class="cyi-winbar"><i></i><b>Volatility</b><span>Process Analysis</span><em>image path normalised to memory.dmp</em></div>
            <div class="cyi-body">
                <div class="cyi-term">
                    <div class="cyi-l"><span class="cyi-p">&gt; </span>python vol.py -f memory.dmp --profile=Win10x64_17763 -g 0xf8034da8a4d8 pstree | Select-String -Pattern 5104</div>
                    <div class="cyi-l">WmiPrvSE.exe (PID 1944, parent PID 884)</div>
                    <div class="cyi-l">└── powershell.exe (PID 5104)</div>
                    <div class="cyi-l is-in">└── conhost.exe (PID 896)</div>
                    <div class="cyi-l"><span class="cyi-p">&gt; </span>python vol.py -f memory.dmp --profile=Win10x64_17763 -g 0xf8034da8a4d8 psxview</div>
                    <div class="cyi-tr cyi-c07 is-h"><span>PID</span><span>Image path (cmdline)</span><span>pslist</span><span>psscan</span><span>thrdproc</span><span>Exit time</span></div>
                    <div class="cyi-tr cyi-c07"><span>656</span><span>C:&#92;Windows&#92;system32&#92;lsass.exe</span><span>True</span><span>False</span><span>True</span><span>none</span></div>
                    <div class="cyi-tr cyi-c07"><span>1576</span><span>C:&#92;Windows&#92;lsass.exe</span><span>False</span><span>False</span><span>True</span><span>none</span></div>
                    <div class="cyi-l"><span class="cyi-p">&gt; </span>python vol.py -f memory.dmp --profile=Win10x64_17763 -g 0xf8034da8a4d8 cmdline --offset=0x0000000030581080</div>
                    <div class="cyi-l">PID 1576: "C:&#92;Windows&#92;lsass.exe" -accepteula -ma 656 lsass.dmp</div>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Process-Level Conclusion</b>
                    <span><i>Source</i><code>process-analysis.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-obs">Observed</span><span>WmiPrvSE (1944) → PowerShell (5104) → masqueraded lsass.exe (1576), the last link by recorded PPID.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-obs">Observed</span><span>a dump invocation against the legitimate LSASS (PID 656).</span></p>
                <p class="cyi-f"><span class="cyi-chip is-not">Not established</span><span>the dump&#39;s completion, its output location, the binary&#39;s identity, and any credential compromise.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '08 // MEMORY TO EVTX',
            motion: 'zoom-in',
            hud: [['Case','007'], ['Image UTC','2025-05-27 09:30:20'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 007</span><h2 class="cyi-title">Memory EVTX Extraction, RDP Intrusion, WMIC Lateral Movement, Recovered LSASS Dump Command</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-ez">
            <div class="cyi-winbar"><i></i><b>Volatility → EvtxECmd → Timeline Explorer</b><span>Timeline Reconstruction</span><em>No conversion was applied to any value below.</em></div>
            <div class="cyi-body">
                <div class="cyi-q"><em>Event Log Extraction</em><code>python vol.py -f ..&#92;..&#92;Server.raw --profile=Win10x64_17763 dumpfiles --regex .evtx&#36; --ignore-case --dump-dir output</code></div>
                <div class="cyi-note">The extraction yielded .vacb cache fragments rather than complete .evtx files. The fragments were renamed to .evtx and parsed with EvtxECmd for review in Timeline Explorer.</div>
                <div class="cyi-tbl">
                    <div class="cyi-tr cyi-c08 is-h"><span>Recorded time</span><span>Record</span><span>Detail</span><span>Time basis</span></div>
                    <div class="cyi-tr cyi-c08"><span class="cyi-m">2025-05-27 09:21:40</span><span>RDP-CoreTS Event ID 131</span><span>RDP server accepted a new TCP connection · 192[.]168[.]19[.]159:64984</span><span>no timezone field</span></div>
                    <div class="cyi-tr cyi-c08"><span class="cyi-m">2025-05-27 09:21:58</span><span>Sysmon Event ID 11</span><span class="cyi-m">C:&#92;Users&#92;Public&#92;Downloads&#92;N1&#92;N1&#92; · DD.exe SB.exe tt.exe n1.ps1</span><span>UtcTime</span></div>
                    <div class="cyi-tr cyi-c08"><span class="cyi-m">2025-05-27 09:22:22</span><span>Sysmon Event ID 11</span><span class="cyi-m">C:&#92;Users&#92;Default&#92;AppData&#92;Local&#92;Temp&#92;N1&#92; · containing the same four names</span><span>UtcTime</span></div>
                    <div class="cyi-tr cyi-c08"><span class="cyi-m">—</span><span>A service creation record</span><span class="cyi-m">ServiceName: FireFox Update · StartType: auto start</span><span>no timestamp field</span></div>
                </div>
                <div class="cyi-q"><em>strings64.exe</em><code>C:&#92;Users&#92;Default&#92;AppData&#92;Local&#92;Temp&#92;N1&#92;DD.exe -accepteula -ma lsass.exe C:&#92;Users&#92;Default&#92;AppData&#92;Local&#92;Temp&#92;mm.tmp</code></div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Limits stated in the record</b>
                    <span><i>Source</i><code>intake.md</code><code>initial-findings.md</code><code>timeline.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-not">Not established</span><span>That the command executed, that mm.tmp was written, or that credential material was obtained.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-rec">Record</span><span>Execution is not demonstrated for any of the staged binaries, the service payload, the dumping command or the WMI operation.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '09 // KIBANA DISCOVER',
            motion: 'zoom-in',
            hud: [['Case','008'], ['Language','KQL'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 008</span><h2 class="cyi-title">SSH Brute-Force, Authentication Abuse, and Post-Exploitation</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-kib">
            <div class="cyi-winbar"><i></i><b>Elastic SIEM (Elastic Stack)</b><span>Kibana Query Language (KQL)</span><em>No confidence rating is assigned, at case level or per finding.</em></div>
            <div class="cyi-body">
                <div class="cyi-cols cyi-g09">
                    <div class="cyi-pane">
                        <div class="cyi-pane-h">GeoIP Distribution of Failed Attempts</div>
                        <div class="cyi-q"><em>KQL</em><code>event.dataset : "system.auth" AND event.outcome : "failure" and source.geo.city_name: *</code></div>
                        <div class="cyi-note">523 failed attempts across 14 countries</div>
                        <div class="cyi-tr cyi-c09a is-h"><span>Country</span><span></span><span>Attempts</span><span>Share</span></div>
                        <div class="cyi-tr cyi-c09a">
                            <span>United States</span>
                            <span class="cyi-bar"><i style="width:100.0%"></i></span>
                            <span class="cyi-m">193</span>
                            <span class="cyi-m">36.9%</span>
                        </div>
                        <div class="cyi-tr cyi-c09a">
                            <span>Singapore</span>
                            <span class="cyi-bar"><i style="width:43.0%"></i></span>
                            <span class="cyi-m">83</span>
                            <span class="cyi-m">15.9%</span>
                        </div>
                        <div class="cyi-tr cyi-c09a">
                            <span>Russia</span>
                            <span class="cyi-bar"><i style="width:24.9%"></i></span>
                            <span class="cyi-m">48</span>
                            <span class="cyi-m">9.2%</span>
                        </div>
                        <div class="cyi-tr cyi-c09a">
                            <span>Germany</span>
                            <span class="cyi-bar"><i style="width:24.4%"></i></span>
                            <span class="cyi-m">47</span>
                            <span class="cyi-m">9.0%</span>
                        </div>
                        <div class="cyi-tr cyi-c09a">
                            <span>Netherlands</span>
                            <span class="cyi-bar"><i style="width:23.3%"></i></span>
                            <span class="cyi-m">45</span>
                            <span class="cyi-m">8.6%</span>
                        </div>
                    </div>
                    <div class="cyi-pane">
                        <div class="cyi-pane-h">Failed Windows Logons on EC2AMAZ-PARMDQI</div>
                        <div class="cyi-q"><em>KQL</em><code>host.name:"EC2AMAZ-PARMDQI" and winlog.channel:"Security" and event.code:"4625"</code></div>
                        <div class="cyi-note">The recorded query returned 22,267 hits</div>
                        <p class="cyi-f"><span class="cyi-chip is-not">Not established</span><span>A successful logon to EC2AMAZ-PARMDQI.</span></p>
                        <div class="cyi-pane-h">Failed SSH Authentication Attempts by Username</div>
                        <div class="cyi-note">admin with 76 failed attempts, the highest count.</div>
                        <div class="cyi-note">The count comes from the dashboard panel; no query is recorded for it.</div>
                    </div>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Limits stated in the record</b>
                    <span><i>Source</i><code>findings-summary.md</code><code>analysis-tools-and-methods.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-enr">External enrichment</span><span>Country values are GeoIP attributions of source addresses. They do not establish where the activity physically originated.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-rec">Record</span><span>Conflicting values, not reconciled.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-range">Range-supplied</span><span>Second-ranking country at 146 attempts</span></p>
                <p class="cyi-f"><span class="cyi-chip is-obs">Observed</span><span>Singapore second at 83 attempts</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '10 // SPLUNK SEARCH',
            motion: 'zoom-in',
            hud: [['Case','009'], ['Search app','Search and Reporting'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 009</span><h2 class="cyi-title">OSK Hijack Persistence and Cerber Botnet Activity</h2><span class="cyi-tag">Security Blue Team</span></header>
        <section class="cyi-win is-spl">
            <div class="cyi-winbar"><i></i><b>Splunk</b><span>Recorded Queries</span><em>Each query is reproduced as recorded.</em></div>
            <div class="cyi-body">
                <div class="cyi-tbl">
                    <div class="cyi-tr cyi-c10 is-h"><span>Search (SPL)</span><span>Recorded result</span></div>
                    <div class="cyi-tr cyi-c10"><span class="cyi-m">index="botsv1" sourcetype=xmlwineventlog "osk.exe" | stats count</span><span>The stats count search returned 49,608 events.</span></div>
                    <div class="cyi-tr cyi-c10"><span class="cyi-m">index="botsv1" sourcetype=xmlwineventlog "osk.exe"</span><span>The Image field summary shows this path in 49,594 events (99.972%)</span></div>
                    <div class="cyi-tr cyi-c10"><span class="cyi-m">index="botsv1" sourcetype=xmlwineventlog "osk.exe"</span><span>6892 in 48,196 events (99.998%) and 80 in 1 event (0.002%)</span></div>
                    <div class="cyi-tr cyi-c10">
                        <span class="cyi-m">index="botsv1" sourcetype=xmlwineventlog "osk.exe" DestinationPort=6892 DestinationIp=*| stats dc(DestinationIp)</span>
                        <span><span class="cyi-chip is-range">Range-accepted</span> 16,384: the distinct destination addresses of connection attempts on port 6892.</span>
                    </div>
                    <div class="cyi-tr cyi-c10">
                        <span class="cyi-m">index="botsv1" sourcetype=xmlwineventlog EventCode=7 ImageLoaded="*osk.exe*"</span>
                        <span><span class="cyi-chip is-range">Range-accepted</span> <code>37397F8D8E4B3731749094D7B7CD2CF56CACB12DD69E0131F07DD78DFF6F262B</code></span>
                    </div>
                    <div class="cyi-tr cyi-c10"><span class="cyi-m">index="botsv1" sourcetype=fortigate_utm dest_port=6892</span><span>udp/6892, action pass, application list Honeypot-Access, appcat Botnet, app Cerber.Botnet</span></div>
                </div>
                <div class="cyi-q"><em>Image</em><code>C:&#92;Users&#92;bob.smith.WAYNECORPINC&#92;AppData&#92;Roaming&#92;{35ACA89F-933F-6A5D-2776-A3589FB99832}&#92;osk.exe</code></div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Limits stated in the record</b>
                    <span><i>Source</i><code>analysis-tools-and-methods.md</code><code>investigation-procedure-and-findings.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-enr">External enrichment</span><span>VirusTotal vendor detections and the community entries quoted in the notes associate the hash with Cerber.</span></p>
                <p class="cyi-f"><span class="cyi-chip is-not">Record</span><span>No encryption, ransom note or other ransomware effect is recorded in this case.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '11 // KIBANA TIMELINE',
            motion: 'zoom-in',
            hud: [['Case','010'], ['Beachhead','JB01'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 010</span><h2 class="cyi-title">TeamCity APT Ransomware – Lateral Movement &amp; Data Exfiltration</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-kib">
            <div class="cyi-winbar"><i></i><b>Elastic (Kibana Discover and field statistics)</b><span>Timestamped Observations</span><em>Displayed times are UTC</em></div>
            <div class="cyi-body">
                <div class="cyi-q"><em>KQL</em><code>host.ip:"10[.]10[.]0[.]6" AND event.code:18456</code><span>2,062 events (Q23 answer)</span></div>
                <div class="cyi-tbl">
                    <div class="cyi-tr cyi-c11 is-h"><span>Recorded time (UTC)</span><span>Time class</span><span>Event</span><span>Label</span></div>
                    <div class="cyi-tr cyi-c11"><span class="cyi-m">2024-08-20 04:31:14.890</span><span>Sysmon UtcTime, equal to the display time</span><span>rundll32.exe loads clrjit.dll on the SQL server (Q28)</span><span>Observed</span></div>
                    <div class="cyi-tr cyi-c11"><span class="cyi-m">2024-08-20 04:43:12.810</span><span>Discover display time</span><span>Encoded PowerShell whose decoded form is Get-WindowsDriver -Online -All (Q14)</span><span>Observed</span></div>
                    <div class="cyi-tr cyi-c11"><span class="cyi-m">2024-08-20 05:33:45.709</span><span>Sysmon UtcTime</span><span>A process is created as CYBERRANGE&#92;roby, with a parent rundll32 running AclNumsInvertHost.dll (Q34)</span><span>Observed</span></div>
                    <div class="cyi-tr cyi-c11"><span class="cyi-m">2024-08-20 05:45:36.808</span><span>Sysmon UtcTime, equal to the display time</span><span>cmd.exe runs wmic /node:10[.]10[.]0[.]7 to start rundll32 with AddressResourcesSpec.dll; parent smss64.exe (Q35)</span><span>Observed</span></div>
                    <div class="cyi-tr cyi-c11"><span class="cyi-m">2024-08-20 06:43:26.053</span><span>Discover display time</span><span>Encoded command that downloads winPEASx64_ofs.exe to C:&#92;Windows&#92;Temp&#92;peas.exe (Q27)</span><span>Observed</span></div>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Stated in the record</b>
                    <span><i>Source</i><code>timeline-utc.md</code><code>analysis-tools-and-methods.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-range">Range-supplied; Range-accepted</span><span>Initial access through the TeamCity service jb[.]cyberrange[.]cyberdefenders[.]org; the question states CVE-2024-27198</span></p>
                <p class="cyi-f"><span class="cyi-chip is-not">Limit</span><span>Times are recorded only for the events in the first table; other events are listed without order.</span></p>
            </aside>
        </div>
    </div>
</div>`
        },
        {
            title: '12 // MITRE MAPPING',
            motion: 'zoom-out',
            hud: [['Case','006'], ['Mapped','Four techniques'], ['Basis','Case record']],
            body: `
<div class="cyi-artboard">
    <div class="cyi-stage">
        <header class="cyi-head"><span class="cyi-case">Case 006</span><h2 class="cyi-title">WmiPrvSE-Spawned PowerShell and a Masqueraded LSASS Dump Invocation</h2><span class="cyi-tag">CyberDefenders</span></header>
        <section class="cyi-win is-att">
            <div class="cyi-winbar"><i></i><b>MITRE ATT&amp;CK Mapping</b><span>ATT&amp;CK version: Enterprise v19.2</span><em>Tactic assignments are not reproduced here</em></div>
            <div class="cyi-body">
                <div class="cyi-tbl">
                    <div class="cyi-tr cyi-c12 is-h"><span>ID</span><span>Technique</span><span>Disposition</span></div>
                    <div class="cyi-tr cyi-c12"><span class="cyi-m">T1003.001</span><span>OS Credential Dumping: LSASS Memory</span><span>Invocation observed; completion and credential access not established</span></div>
                    <div class="cyi-tr cyi-c12"><span class="cyi-m">T1036</span><span>Masquerading</span><span>Supported for the name and path mismatch</span></div>
                    <div class="cyi-tr cyi-c12"><span class="cyi-m">T1059.001</span><span>Command and Scripting Interpreter: PowerShell</span><span>Supported that PowerShell ran and parented PID 1576; its commands are not recorded</span></div>
                    <div class="cyi-tr cyi-c12"><span class="cyi-m">T1047</span><span>Windows Management Instrumentation</span><span>Consistent with; not established</span></div>
                </div>
                <div class="cyi-pane-h">Considered and Not Mapped</div>
                <div class="cyi-techs">
                    <span class="cyi-tech"><code>T1071</code><span>Application Layer Protocol</span></span>
                    <span class="cyi-tech"><code>T1571</code><span>Non-Standard Port</span></span>
                    <span class="cyi-tech"><code>T1105</code><span>Ingress Tool Transfer</span></span>
                    <span class="cyi-tech"><code>T1134</code><span>Access Token Manipulation</span></span>
                    <span class="cyi-tech"><code>T1564</code><span>Hide Artifacts</span></span>
                    <span class="cyi-tech"><code>T1059.003</code><span>Command and Scripting Interpreter: Windows Command Shell</span></span>
                </div>
            </div>
        </section>
        <div class="cyi-low">
            <aside class="cyi-find">
                <div class="cyi-find-h">
                    <b>Mapping Conclusion</b>
                    <span><i>Source</i><code>mitre-attack-mapping.md</code></span>
                </div>
                <p class="cyi-f"><span class="cyi-chip is-rec">Terms</span><span>Invocation observed — the action was requested but its outcome is not recorded</span></p>
                <p class="cyi-f"><span class="cyi-chip is-not">Limit</span><span>No mapping in this document asserts that credential material was obtained, that a command channel carried traffic, or that a technique occurred beyond what the recorded artifacts show.</span></p>
            </aside>
        </div>
    </div>
</div>`
        }
    ];

    function initCyberPreview(previewBodyEl) {
        return createScenePreview(previewBodyEl, CYBER_SCENES, renderCyberScene, CYBER_SCENE_INTERVAL_MS);
    }


    function getProjectSlug() {
        const params = new URLSearchParams(window.location.search);
        const requested = params.get('project');
        if (!Object.prototype.hasOwnProperty.call(PROJECT_ALIASES, requested)) return requested;
        const slug = PROJECT_ALIASES[requested];
        // Old address: show the current one without a reload or a new history entry.
        try {
            params.set('project', slug);
            window.history.replaceState(window.history.state, '', window.location.pathname + '?' + params.toString() + window.location.hash);
        } catch (e) { /* the page still renders under the old address */ }
        return slug;
    }

    window.addEventListener('DOMContentLoaded', () => {
        const slug = getProjectSlug();
        const project = PROJECTS[slug];

        const titleBox = document.getElementById('media-title');
        const badgeBox = document.getElementById('media-badge');
        const subBox = document.getElementById('media-sub');
        const titleEl = streamTarget(titleBox);
        const badgeEl = streamTarget(badgeBox);
        const subEl = streamTarget(subBox);
        const phoneMode = typeof window.matchMedia === 'function' && window.matchMedia(PHONE_LAYOUT_QUERY).matches;
        installPinnedBlockMetrics();
        const introEl = document.getElementById('author-intro-text');
        const githubLink = document.getElementById('link-github');
        const githubLabelEl = document.getElementById('link-github-label');
        const previewTitleEl = document.getElementById('preview-window-title');
        const previewBodyEl = document.querySelector('#preview-panel .preview-window-body');
        let previewController = null;

        if (!project) {
            setReserve(titleBox, 'PROJECT NOT FOUND'); setReserve(badgeBox, BADGE_TEXT); setReserve(subBox, SUB_TEXT);
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
        setReserve(titleBox, project.title); setReserve(badgeBox, BADGE_TEXT); setReserve(subBox, SUB_TEXT);

        const authorIntroText = project.authorIntro || AUTHOR_INTRO_PLACEHOLDER;

        if (githubLink) githubLink.href = project.githubUrl;
        if (githubLabelEl) githubLabelEl.textContent = project.githubLabel;
        if (previewTitleEl) previewTitleEl.textContent = project.title;

        if (slug === 'cloudflare') {
            previewController = initCloudflarePreview(previewBodyEl);
        } else if (slug === 'sentinel') {
            previewController = initSentinelPreview(previewBodyEl);
        } else if (slug === 'healthcare') {
            previewController = initOrthancPreview(previewBodyEl);
        } else if (slug === 'aws') {
            previewController = initAwsPreview(previewBodyEl);
        } else if (slug === 'aivp') {
            previewController = initAivpPreview(previewBodyEl);
        } else if (slug === 'cyber') {
            previewController = initCyberPreview(previewBodyEl);
        } else if (slug === 'pentest') {
            previewController = initPentestPreview(previewBodyEl);
        } else {
            // Recognised project with no preview runtime branch (slice A).
            // The predicate is the dispatch itself, never a slug and never
            // the controller result: a runtime whose initializer fails to
            // produce a controller must not be presented as an intentional
            // pending state. Unknown slugs returned above (PROJECT NOT FOUND).
            markPendingPreview();
        }

        // Project-context seam. The scene engine is built by the shared
        // createScenePreview factory, so nothing inside it identifies which
        // runtime is mounted. Breakpoint-scoped rules for the SHARED shell
        // elements (.cf-hud, .cf-engine-dots) need a stable per-project
        // ancestor; without this they would have to reach through a
        // project-specific artboard class via :has(), making presentation
        // depend on artboard internals. Set generically from the slug the
        // router already resolved, so every registered runtime carries it.
        previewBodyEl.querySelector('.cf-preview-engine')
            ?.setAttribute('data-project', slug);

        // Local, opt-in browser-test seam only.
        // Production application code must not consume this global.
        // Requires BOTH a local/file environment AND ?controllerTest=1, so
        // an ordinary local session has no global and production never does
        // even if someone appends the flag. Exposing null for File Triage
        // under the flag is itself the "no controller" assertion.
        exposeMediaControllerForTests(previewController);
        installSliceD(previewController, previewBodyEl);

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

        // Slice C, phone mode (Owner Q4): the pinned preview opens first, at t0,
        // and the header stream starts when its open completes; the remaining
        // panels then follow the title, badge and subtitle at the usual stagger,
        // and the boot-interference effect fires on the preview's own open. The
        // desktop sequence below is unchanged.
        function streamHeaderThenPanels() {
            streamText(titleEl, project.title, NAME_DELAY, () => {
                setTimeout(() => {
                    streamText(badgeEl, BADGE_TEXT, FAST_DELAY);
                    streamText(subEl, SUB_TEXT, FAST_DELAY, () => {
                        setTimeout(() => {
                            reserveIntroHeight(introEl, authorIntroText);
                            materializePanels(phoneMode ? PANEL_IDS.filter(id => id !== 'preview-panel') : PANEL_IDS);
                            if (!phoneMode && previewController && previewController.fireBootInterference) {
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
        }

        if (phoneMode) {
            materializePanels(['preview-panel']);
            if (previewController && previewController.fireBootInterference) {
                setTimeout(() => {
                    previewController.fireBootInterference();
                }, PANEL_OPEN_MS + 80);
            }
            setTimeout(streamHeaderThenPanels, PANEL_OPEN_MS);
        } else {
            streamHeaderThenPanels();
        }

        initAutoplayToggle(handleAutoplayToggle);
    });
})();
