/* ═══════════════════════════════════════════════════════
   projects.js — Engineering Portal
   Stream timing mirrors profile.js exactly:
     Title:      44ms/char  (matches "Ryan Valera")
     Secondary:   2ms/char  (matches title/tags — simultaneous)
     Status:     77ms/char  (matches "System Status")
═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Timing constants — mirrors profile.js exactly ─── */
    const NAME_DELAY        = 44;  // ms/char — title stream speed
    const FAST_DELAY        =  2;  // ms/char — secondary lines
    const POST_NAME_PAUSE   = 80;  // ms — pause after title before secondary
    const STATUS_CHAR_DELAY = 77;  // ms/char — status label
    const STATUS_POST_PAUSE = 80;  // ms — pause before dot + value

    /* ── Text content ──────────────────────────────────── */
    const TITLE_TEXT   = 'ENGINEERING PORTAL';
    const EYEBROW_TEXT = 'Featured Projects \u00b7 Infrastructure \u00b7 Healthcare Imaging';
    const INTRO_TEXT   = 'Hover over a project card to preview workflow architecture';
    const DESC_TEXT    = 'Imaging interoperability lab using Orthanc PACS and Mirth Connect to demonstrate DICOM workflows, HL7 messaging, MWL concepts, and controlled integration scenarios in a laboratory environment.';

    /* ── Streaming utility ─────────────────────────────── */
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

    /* ── Status pill — mirrors profile.js materializeSystemStatus ── */
    function streamStatus() {
        const pillEl   = document.getElementById('portal-status');
        const labelEl  = document.getElementById('portal-status-label');
        const dotEl    = document.getElementById('portal-status-dot');
        const valueEl  = document.getElementById('portal-status-value');
        if (!pillEl) return;

        // Pre-render dot and value at opacity 0 so container width is
        // already established — prevents layout shift when they fade in
        if (valueEl) valueEl.textContent = 'OPERATIONAL';

        pillEl.classList.add('status-label-done');
        if (labelEl) labelEl.textContent = '';

        streamText(labelEl, 'SYSTEM STATUS', STATUS_CHAR_DELAY, () => {
            setTimeout(() => {
                if (dotEl)   dotEl.classList.add('visible');
                if (valueEl) valueEl.classList.add('visible');
                setTimeout(() => {
                    pillEl.classList.add('border-draw');
                }, 2400);
            }, STATUS_POST_PAUSE);
        });
    }

    /* ── Header stream-in ──────────────────────────────── */
    function initHeader() {
        const titleEl   = document.getElementById('portal-title');
        const eyebrowEl = document.getElementById('portal-eyebrow');
        const introEl   = document.getElementById('portal-intro');

        if (reducedMotion) {
            if (titleEl)   titleEl.textContent   = TITLE_TEXT;
            if (eyebrowEl) eyebrowEl.textContent = EYEBROW_TEXT;
            if (introEl)   introEl.textContent   = INTRO_TEXT;
            streamStatus();
            return;
        }

        // Stage 1: stream title at name speed
        streamText(titleEl, TITLE_TEXT, NAME_DELAY, () => {
            // Stage 2: eyebrow and intro stream simultaneously at fast speed
            setTimeout(() => {
                // Track which finishes last to trigger status
                let introDone = false;

                streamText(eyebrowEl, EYEBROW_TEXT, FAST_DELAY);

                streamText(introEl, INTRO_TEXT, FAST_DELAY, () => {
                    introDone = true;
                    // Status streams after the last secondary line completes
                    streamStatus();
                });
            }, POST_NAME_PAUSE);
        });
    }

    /* ── Center card hover engine ──────────────────────── */
    const card   = document.getElementById('card-orthanc');
    const glitch = document.getElementById('glitch-band');
    const descEl = document.getElementById('orthanc-desc');
    const btnEl  = document.getElementById('orthanc-btn');

    if (!card || !glitch) {
        window.addEventListener('DOMContentLoaded', initHeader);
        return;
    }

    const scenes    = Array.from(card.querySelectorAll('.scene'));
    let sceneIndex  = 0;
    let sceneTimer  = null;
    let glitchTimer = null;
    let hoverDelay  = null;
    let descTimer   = null;
    let running     = false;

    /* ── Scene management ──────────────────────────────── */
    function setScene(index) {
        scenes.forEach((s, i) => s.classList.toggle('active', i === index));
    }

    /* ── Glitch band ───────────────────────────────────── */
    function fireGlitch() {
        glitch.classList.remove('fire');
        void glitch.offsetWidth;
        glitch.style.top = `${18 + Math.random() * 58}%`;
        glitch.classList.add('fire');
    }

    /* ── Stream description on hover ───────────────────── */
    function streamDesc() {
        if (!descEl) return;
        descEl.textContent = '';
        descTimer = streamText(descEl, DESC_TEXT, FAST_DELAY);
    }

    function clearDesc() {
        if (descTimer) clearInterval(descTimer);
        if (descEl)   descEl.textContent = '';
    }

    /* ── Start preview ─────────────────────────────────── */
    function startPreview() {
        if (running) return;
        running = true;

        sceneIndex = 0;
        setScene(sceneIndex);
        fireGlitch();

        sceneTimer = setInterval(() => {
            sceneIndex = (sceneIndex + 1) % scenes.length;
            setScene(sceneIndex);
        }, 1400);

        glitchTimer = setInterval(() => {
            if (Math.random() > 0.4) fireGlitch();
        }, 950);

        // Stream description 300ms after hover activates
        if (!reducedMotion) {
            setTimeout(streamDesc, 300);
        } else {
            if (descEl) descEl.textContent = DESC_TEXT;
        }
    }

    /* ── Stop preview ──────────────────────────────────── */
    function stopPreview() {
        clearTimeout(hoverDelay);
        clearInterval(sceneTimer);
        clearInterval(glitchTimer);
        clearDesc();
        running = false;
        sceneIndex = 0;
        setScene(sceneIndex);
    }

    /* ── Event listeners ───────────────────────────────── */
    card.addEventListener('mouseenter', () => {
        hoverDelay = setTimeout(startPreview, 220);
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(hoverDelay);
        stopPreview();
    });

    card.addEventListener('focusin',  startPreview);
    card.addEventListener('focusout', stopPreview);

    /* ── Init ──────────────────────────────────────────── */
    window.addEventListener('DOMContentLoaded', initHeader);

})();
