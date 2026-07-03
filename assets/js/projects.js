/* ═══════════════════════════════════════════════════════
   projects.js — Engineering Portal (Milestone 7B)
   Stream timing mirrors profile.js exactly.
   Glitch logic ported from demo card.js.
═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Timing — mirrors profile.js ──────────────── */
    const NAME_DELAY        = 44;
    const FAST_DELAY        =  5;
    const POST_NAME_PAUSE   = 80;
    const STATUS_CHAR_DELAY = 77;
    const STATUS_POST_PAUSE = 80;

    /* ── Text content ─────────────────────────────── */
    const TITLE_TEXT   = 'ENGINEERING PORTAL';
    const EYEBROW_TEXT = 'FEATURED PROJECTS \u00b7 INFRASTRUCTURE \u00b7 HEALTHCARE IMAGING';
    const INTRO_TEXT   = 'Hover over a project card to preview workflow architecture';
    const DESC_TEXT    = 'Imaging interoperability lab using Orthanc PACS and Mirth Connect to demonstrate DICOM workflows, HL7 messaging, MWL concepts, and controlled integration scenarios in a laboratory environment.';

    /* ── Streaming utility ────────────────────────── */
    function streamText(el, text, charDelay, onComplete) {
        if (!el) return null;
        let index = 0;
        el.textContent = '';
        const timer = setInterval(() => {
            index++;
            el.textContent = text.slice(0, index);
            if (index >= text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, charDelay);
        return timer;
    }

    /* ── Status pill ──────────────────────────────── */
    function streamStatus() {
        const pillEl  = document.getElementById('portal-status');
        const labelEl = document.getElementById('portal-status-label');
        const dotEl   = document.getElementById('portal-status-dot');
        const valueEl = document.getElementById('portal-status-value');
        if (!pillEl) return;

        if (valueEl) valueEl.textContent = 'OPERATIONAL';
        pillEl.classList.add('status-label-done');
        if (labelEl) labelEl.textContent = '';

        streamText(labelEl, 'SYSTEM STATUS', STATUS_CHAR_DELAY, () => {
            setTimeout(() => {
                if (dotEl)   dotEl.classList.add('visible');
                if (valueEl) valueEl.classList.add('visible');
                setTimeout(() => pillEl.classList.add('border-draw'), 2400);
            }, STATUS_POST_PAUSE);
        });
    }

    /* ── Header stream-in ─────────────────────────── */
    function initHeader() {
        const titleEl   = document.getElementById('portal-title');
        const eyebrowEl = document.getElementById('portal-eyebrow');
        const introEl   = document.getElementById('portal-intro');

        if (reducedMotion) {
            if (titleEl)   titleEl.textContent   = TITLE_TEXT;
            if (eyebrowEl) eyebrowEl.textContent = EYEBROW_TEXT;
            if (introEl)   introEl.textContent   = INTRO_TEXT;
            streamStatus();
            materializeCards();
            streamHintAndFooter();
            return;
        }

        streamText(titleEl, TITLE_TEXT, NAME_DELAY, () => {
            setTimeout(() => {
                streamText(eyebrowEl, EYEBROW_TEXT, FAST_DELAY);
                streamText(introEl, INTRO_TEXT, FAST_DELAY, () => {
                    setTimeout(() => {
                        streamStatus();
                        materializeCards();
                        // Stream hint + footer after all cards have opened
                        setTimeout(streamHintAndFooter, 980);
                    }, 120);
                });
            }, POST_NAME_PAUSE);
        });
    }

    /* ── Card materialization ────────────────────── */
    function materializeCards() {
        const wraps = document.querySelectorAll('.active-card-wrap');
        const STAGGER = 220; // ms between each card
        wraps.forEach(function(wrap, i) {
            setTimeout(function() {
                wrap.classList.add('card-materialized');
            }, i * STAGGER);
        });
    }

    /* ── Hint + footer sequential reveal ─────────── */
    const HINT_TEXT      = 'Hover over a project card to preview system workflows and architecture.';
    const FOOTER_ITEMS   = ['footer-item-0','footer-div-0','footer-item-1','footer-div-1','footer-item-2','footer-div-2','footer-item-3'];
    const ITEM_STAGGER   = 120; // ms between each footer item reveal

    function streamHintAndFooter() {
        const hintEl     = document.getElementById('projects-hint');
        const hintTextEl = document.getElementById('hint-text');
        if (!hintEl || !hintTextEl) return;

        // Show hint container
        hintEl.classList.add('hint-visible');

        if (reducedMotion) {
            hintTextEl.textContent = HINT_TEXT;
            const footerEl = document.querySelector('.projects-footer');
            if (footerEl) footerEl.classList.add('footer-visible');
            FOOTER_ITEMS.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('item-visible');
            });
            return;
        }

        // Stream hint text first
        streamText(hintTextEl, HINT_TEXT, FAST_DELAY, () => {
            setTimeout(() => {
                const footerEl = document.querySelector('.projects-footer');
                // Reveal footer border with first item
                if (footerEl) footerEl.classList.add('footer-visible');
                // Reveal footer items sequentially
                FOOTER_ITEMS.forEach((id, i) => {
                    setTimeout(() => {
                        const el = document.getElementById(id);
                        if (el) el.classList.add('item-visible');
                    }, i * ITEM_STAGGER);
                });
            }, 80);
        });
    }

    /* ── Glitch engine — ported from card.js ─────── */
    const card = document.getElementById('card-orthanc');

    function fireGlitch() {
        if (!card || reducedMotion) return;
        card.classList.add('is-glitching');
        setTimeout(() => card.classList.remove('is-glitching'), 240);
    }

    let glitchTimer;
    function scheduleGlitch() {
        clearTimeout(glitchTimer);
        glitchTimer = setTimeout(() => {
            fireGlitch();
            scheduleGlitch();
        }, 2800 + Math.random() * 3600);
    }

    /* ── Description + CTA reveal on hover ───────── */
    const descEl    = document.getElementById('orthanc-desc');
    const btnEl     = document.getElementById('orthanc-btn');
    const cfDescEl  = document.getElementById('cloudflare-desc');
    const cfBtnEl   = document.getElementById('cloudflare-btn');
    const awsDescEl = document.getElementById('aws-desc');
    const awsBtnEl  = document.getElementById('aws-btn');

    const CF_DESC_TEXT  = 'Cloudflare edge platform with global load balancing, DNS management, WAF, security rules, analytics, and operational notifications. Built to ensure high availability and performance for ryanvalera.com.';
    const AWS_DESC_TEXT = 'Independent reliability layer for DNS, DNSSEC, and TLS certificate monitoring with tiered alerting, structured runbooks, and event-driven validation workflows on AWS serverless architecture.';

    let descTimer     = null;
    let hoverDelay    = null;
    let cfDescTimer   = null;
    let cfHoverDelay  = null;
    let awsDescTimer  = null;
    let awsHoverDelay = null;

    function streamDesc() {
        if (!descEl) return;
        descEl.textContent = '';
        descTimer = streamText(descEl, DESC_TEXT, FAST_DELAY);
    }

    function clearDesc() {
        if (descTimer) clearInterval(descTimer);
        // Delay text clear until after CSS color fade-out (350ms transition)
        setTimeout(() => {
            if (descEl) descEl.textContent = '';
        }, 380);
    }

    function revealCTA() {
        if (!btnEl) return;
        btnEl.style.opacity = '1';
        btnEl.style.pointerEvents = 'auto';
    }

    function hideCTA() {
        if (!btnEl) return;
        btnEl.style.opacity = '0';
        btnEl.style.pointerEvents = 'none';
    }

    if (card) {
        card.addEventListener('mouseenter', () => {
            hoverDelay = setTimeout(() => {
                if (!reducedMotion) {
                    streamDesc();
                } else {
                    if (descEl) descEl.textContent = DESC_TEXT;
                }
                revealCTA();
            }, 220);
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverDelay);
            clearDesc();
            hideCTA();
        });

        card.addEventListener('focusin', () => {
            if (descEl) descEl.textContent = DESC_TEXT;
            revealCTA();
        });

        card.addEventListener('focusout', () => {
            clearDesc();
            hideCTA();
        });
    }

    /* ── Cloudflare card hover ────────────────────── */
    const cfCard = document.getElementById('card-cloudflare');

    function streamCfDesc() {
        if (!cfDescEl) return;
        cfDescEl.textContent = '';
        cfDescTimer = streamText(cfDescEl, CF_DESC_TEXT, FAST_DELAY);
    }

    function clearCfDesc() {
        if (cfDescTimer) clearInterval(cfDescTimer);
        setTimeout(() => { if (cfDescEl) cfDescEl.textContent = ''; }, 380);
    }

    function revealCfCTA() {
        if (!cfBtnEl) return;
        cfBtnEl.style.opacity = '1';
        cfBtnEl.style.pointerEvents = 'auto';
    }

    function hideCfCTA() {
        if (!cfBtnEl) return;
        cfBtnEl.style.opacity = '0';
        cfBtnEl.style.pointerEvents = 'none';
    }

    if (cfCard) {
        cfCard.addEventListener('mouseenter', () => {
            cfHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamCfDesc();
                else if (cfDescEl) cfDescEl.textContent = CF_DESC_TEXT;
                revealCfCTA();
            }, 220);
        });
        cfCard.addEventListener('mouseleave', () => {
            clearTimeout(cfHoverDelay);
            clearCfDesc();
            hideCfCTA();
        });
        cfCard.addEventListener('focusin', () => {
            if (cfDescEl) cfDescEl.textContent = CF_DESC_TEXT;
            revealCfCTA();
        });
        cfCard.addEventListener('focusout', () => {
            clearCfDesc();
            hideCfCTA();
        });
    }

    /* ── AWS card hover ───────────────────────────── */
    const awsCard = document.getElementById('card-aws');

    function streamAwsDesc() {
        if (!awsDescEl) return;
        awsDescEl.textContent = '';
        awsDescTimer = streamText(awsDescEl, AWS_DESC_TEXT, FAST_DELAY);
    }

    function clearAwsDesc() {
        if (awsDescTimer) clearInterval(awsDescTimer);
        setTimeout(() => { if (awsDescEl) awsDescEl.textContent = ''; }, 380);
    }

    function revealAwsCTA() {
        if (!awsBtnEl) return;
        awsBtnEl.style.opacity = '1';
        awsBtnEl.style.pointerEvents = 'auto';
    }

    function hideAwsCTA() {
        if (!awsBtnEl) return;
        awsBtnEl.style.opacity = '0';
        awsBtnEl.style.pointerEvents = 'none';
    }

    if (awsCard) {
        awsCard.addEventListener('mouseenter', () => {
            awsHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamAwsDesc();
                else if (awsDescEl) awsDescEl.textContent = AWS_DESC_TEXT;
                revealAwsCTA();
            }, 220);
        });
        awsCard.addEventListener('mouseleave', () => {
            clearTimeout(awsHoverDelay);
            clearAwsDesc();
            hideAwsCTA();
        });
        awsCard.addEventListener('focusin', () => {
            if (awsDescEl) awsDescEl.textContent = AWS_DESC_TEXT;
            revealAwsCTA();
        });
        awsCard.addEventListener('focusout', () => {
            clearAwsDesc();
            hideAwsCTA();
        });
    }


    /* ── FastAPI card hover ───────────────────────── */
    const fastapiCard    = document.getElementById('card-fastapi');
    const fastapiDescEl  = document.getElementById('fastapi-desc');
    const fastapiBtnEl   = document.getElementById('fastapi-btn');

    const FASTAPI_DESC_TEXT = 'REST API for radiology imaging device inventory management. FastAPI, SQLAlchemy 2.x, Pydantic v2, and SQLite. Full CRUD across devices, vendors, and maintenance records with pytest coverage.';

    let fastapiDescTimer  = null;
    let fastapiHoverDelay = null;

    function streamFastapiDesc() {
        if (!fastapiDescEl) return;
        fastapiDescEl.textContent = '';
        fastapiDescTimer = streamText(fastapiDescEl, FASTAPI_DESC_TEXT, FAST_DELAY);
    }

    function clearFastapiDesc() {
        if (fastapiDescTimer) clearInterval(fastapiDescTimer);
        setTimeout(() => { if (fastapiDescEl) fastapiDescEl.textContent = ''; }, 380);
    }

    function revealFastapiCTA() {
        if (!fastapiBtnEl) return;
        fastapiBtnEl.style.opacity = '1';
        fastapiBtnEl.style.pointerEvents = 'auto';
    }

    function hideFastapiCTA() {
        if (!fastapiBtnEl) return;
        fastapiBtnEl.style.opacity = '0';
        fastapiBtnEl.style.pointerEvents = 'none';
    }

    if (fastapiCard) {
        fastapiCard.addEventListener('mouseenter', () => {
            fastapiHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamFastapiDesc();
                else if (fastapiDescEl) fastapiDescEl.textContent = FASTAPI_DESC_TEXT;
                revealFastapiCTA();
            }, 220);
        });
        fastapiCard.addEventListener('mouseleave', () => {
            clearTimeout(fastapiHoverDelay);
            clearFastapiDesc();
            hideFastapiCTA();
        });
        fastapiCard.addEventListener('focusin', () => {
            if (fastapiDescEl) fastapiDescEl.textContent = FASTAPI_DESC_TEXT;
            revealFastapiCTA();
        });
        fastapiCard.addEventListener('focusout', () => {
            clearFastapiDesc();
            hideFastapiCTA();
        });
    }

    /* ── AI Engineering Validation Platform card hover ── */
    const aivpCard   = document.getElementById('card-aivp');
    const aivpDescEl = document.getElementById('aivp-desc');
    const aivpBtnEl  = document.getElementById('aivp-btn');

    const AIVP_DESC_TEXT = 'Multi-model AI engineering platform that generates, validates, and iteratively refines technical artifacts — infrastructure code, documentation, and architecture — through structured Builder/Validator collaboration with transparent review scoring.';

    let aivpDescTimer  = null;
    let aivpHoverDelay = null;

    function streamAivpDesc() {
        if (!aivpDescEl) return;
        aivpDescEl.textContent = '';
        aivpDescTimer = streamText(aivpDescEl, AIVP_DESC_TEXT, FAST_DELAY);
    }

    function clearAivpDesc() {
        if (aivpDescTimer) clearInterval(aivpDescTimer);
        setTimeout(() => { if (aivpDescEl) aivpDescEl.textContent = ''; }, 380);
    }

    function revealAivpCTA() {
        if (!aivpBtnEl) return;
        aivpBtnEl.style.opacity = '1';
        aivpBtnEl.style.pointerEvents = 'auto';
    }

    function hideAivpCTA() {
        if (!aivpBtnEl) return;
        aivpBtnEl.style.opacity = '0';
        aivpBtnEl.style.pointerEvents = 'none';
    }

    if (aivpCard) {
        aivpCard.addEventListener('mouseenter', () => {
            aivpHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamAivpDesc();
                else if (aivpDescEl) aivpDescEl.textContent = AIVP_DESC_TEXT;
                revealAivpCTA();
            }, 220);
        });
        aivpCard.addEventListener('mouseleave', () => {
            clearTimeout(aivpHoverDelay);
            clearAivpDesc();
            hideAivpCTA();
        });
        aivpCard.addEventListener('focusin', () => {
            if (aivpDescEl) aivpDescEl.textContent = AIVP_DESC_TEXT;
            revealAivpCTA();
        });
        aivpCard.addEventListener('focusout', () => {
            clearAivpDesc();
            hideAivpCTA();
        });
    }

    /* ── Init ─────────────────────────────────────── */
    window.addEventListener('DOMContentLoaded', () => {
        initHeader();
        scheduleGlitch();
    });

})();
