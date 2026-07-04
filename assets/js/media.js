/* ═══════════════════════════════════════════════════════
   media.js — R2 Engineering Media Layer (boilerplate)
   One template, five projects, driven by ?project= query param.
   Real content (author intro, videos, live preview) to be
   populated per project as it becomes available.
═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const NAME_DELAY = 44; // ms/char — matches profile.js and projects.js title speed
    const FAST_DELAY = 4;  // ms/char — matches secondary lines on profile/projects
    const POST_NAME_PAUSE = 80; // ms — pause between title finishing and badge/sub starting
    const PANEL_OPEN_MS = 380; // matches .media-panel-materialize animation duration in media.css —
                                // Author Intro must wait for this before streaming, or early
                                // characters render while the panel is still visually clipped shut
    const INTRO_TICK_DELAY = FAST_DELAY * 2; // 2x slower per your last request
    const INTRO_CHARS_PER_TICK = 9; // Author Intro reveals 9 chars per tick (~9x throughput). A
                                     // sub-1ms charDelay was tried first but browsers commonly clamp
                                     // setInterval to a ~4ms floor, silently erasing that speedup —
                                     // revealing more characters per tick sidesteps the clamp entirely.

    /* ── Project data ──────────────────────────────────
       Add real author intro / video entries here as they
       become available. Boilerplate fields are intentionally
       generic until then. ────────────────────────────── */
    const PROJECTS = {
        cloudflare: {
            title: 'CLOUDFLARE PLATFORM',
            githubUrl: 'https://github.com/valeratech/ryanvalera-com',
            githubLabel: 'VIEW GITHUB REPOSITORY'
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

    const AUTHOR_INTRO_PLACEHOLDER = 'Welcome to the early stages of this platform. This space will soon feature a formal introduction detailing the core motivations behind this project and the specific challenges it was built to solve. The goal is to provide a clear window into the engineering philosophy driving the architecture, moving beyond standard implementations to showcase a practical, production-ready environment.\n\nThe approach taken throughout this development focuses heavily on robust design patterns, automation, and modern infrastructure standards. Future updates will break down the design decisions made along the way—from streamlining deployment pipelines to implementing rigid security controls—offering a comprehensive look at how disparate technologies were integrated into a cohesive, scalable solution.\n\nUltimately, this project serves as both a live proof of concept and a continuous learning playground. Check back soon for a firsthand breakdown of the key takeaways, unexpected engineering hurdles, and practical insights gained from building and managing this environment from the ground up.\n\nThis introduction will continue to expand as the project matures, eventually covering the specific architecture decisions behind each component, the reasoning for the tools and frameworks chosen, and how this work connects to the broader body of engineering projects represented across this portfolio.';

    /* ── Streaming utility ─────────────────────────── */
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

    /* ── Panel materialize ─────────────────────────── */
    const PANEL_IDS = ['author-panel', 'preview-panel', 'videos-panel', 'links-panel'];
    const PANEL_STAGGER = 140;

    // Author Intro is the only panel with variable-length streamed content,
    // so it's the only one that visibly grows while its text types in. Fix:
    // briefly render the full text to measure its real height, lock that as
    // a min-height, then clear back to empty. The panel's materialize
    // animation then expands to the correct final size up front, and the
    // character-by-character reveal that follows never changes box height.
    function reserveIntroHeight(el, fullText) {
        if (!el) return;
        el.style.minHeight = '';
        el.textContent = fullText;
        const measured = el.scrollHeight;
        el.textContent = '';
        el.style.minHeight = measured + 'px';
        void el.offsetHeight; // force a synchronous reflow so the browser commits
                              // this height before the materialize animation (which
                              // reads clip-path percentages against it) begins
    }

    function materializePanels() {
        PANEL_IDS.forEach((id, i) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.classList.add('panel-materialized');
            }, i * PANEL_STAGGER);
        });
    }

    /* ── Footer reveal ──────────────────────────────── */
    const FOOTER_ITEMS = [
        'footer-item-0', 'footer-div-0',
        'footer-item-1', 'footer-div-1',
        'footer-item-2', 'footer-div-2',
        'footer-item-3'
    ];
    const FOOTER_STAGGER = 120;

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

    /* ── Autoplay toggle ────────────────────────────── */
    function initAutoplayToggle() {
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
        });
    }

    /* ── Resolve project from ?project= query param ─── */
    function getProjectSlug() {
        const params = new URLSearchParams(window.location.search);
        return params.get('project');
    }

    /* ── Init ───────────────────────────────────────── */
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

        if (!project) {
            // Unrecognized or missing ?project= — fail gracefully rather
            // than showing broken/blank content.
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

        if (githubLink) githubLink.href = project.githubUrl;
        if (githubLabelEl) githubLabelEl.textContent = project.githubLabel;
        if (previewTitleEl) previewTitleEl.textContent = project.title;

        if (reducedMotion) {
            if (titleEl) titleEl.textContent = project.title;
            if (badgeEl) badgeEl.textContent = BADGE_TEXT;
            if (subEl) subEl.textContent = SUB_TEXT;
            if (introEl) introEl.textContent = AUTHOR_INTRO_PLACEHOLDER;
            materializePanels();
            revealFooter();
            initAutoplayToggle();
            return;
        }

        // Title streams alone at NAME_DELAY first — matches profile.js/projects.js,
        // where the title is deliberately slower/readable and secondary lines
        // (badge, sub) stream faster together afterward.
        streamText(titleEl, project.title, NAME_DELAY, () => {
            setTimeout(() => {
                streamText(badgeEl, BADGE_TEXT, FAST_DELAY);
                streamText(subEl, SUB_TEXT, FAST_DELAY, () => {
                    setTimeout(() => {
                        reserveIntroHeight(introEl, AUTHOR_INTRO_PLACEHOLDER);
                        materializePanels();
                        // Wait for the Author panel's own materialize animation to
                        // finish opening before streaming into it — otherwise the
                        // first characters render while the panel is still clipped.
                        setTimeout(() => {
                            streamText(introEl, AUTHOR_INTRO_PLACEHOLDER, INTRO_TICK_DELAY, null, INTRO_CHARS_PER_TICK);
                        }, PANEL_OPEN_MS);
                        setTimeout(revealFooter, PANEL_IDS.length * PANEL_STAGGER + 300);
                    }, 120);
                });
            }, POST_NAME_PAUSE);
        });

        initAutoplayToggle();
    });

})();
