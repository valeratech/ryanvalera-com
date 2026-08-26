// profile.js — v0.2 HUD initialization for the professional dossier
// No styling dependencies. Pure behavior.

(function () {
    'use strict';

    var profileName = document.getElementById('profile-name');
    var roleTitle   = document.getElementById('role-title');
    var roleTags    = document.getElementById('role-tags');

    var NAME_DELAY = 44; // ms/char — matches Professional Select on landing
    var FAST_DELAY =  4; // ms/char — matches secondary lines on landing

    var NAME_TEXT  = 'Ryan Valera';
    var TITLE_TEXT = 'Security Operations & Infrastructure Engineer';
    var TAGS_TEXT  = 'Threat Detection // Linux Infrastructure // DNS & Email Security // Cloud Engineering';

    // Pause between name finishing and simultaneous title/tags start
    var POST_NAME_PAUSE = 80; // ms

    // Panel materialization — ordered sequence
    var PANEL_STAGGER   = 120; // ms between each panel aperture open
    var PANEL_DURATION  = 380; // ms per panel aperture animation

    // MD2: at <=900px .content-right takes order:-1, so the portrait is already
    // FIRST on screen while the reveal still fired it last. The reveal order is
    // derived from that same breakpoint, evaluated once at script execution.
    // A viewport crossing 900px mid-intro would leave this value stale until
    // reload; the verification procedure loads/reloads at each target width, so
    // that is accepted rather than guarded.
    var PANEL_RAIL      = '.image-rail';
    var PANEL_BODY      = [
        '#profile-summary',
        '#technical-skills',
        '#professional-metrics',
        '#certifications',
        '#quick-links',
        '#featured-projects'
    ];
    var PANEL_MOBILE    = window.matchMedia('(max-width: 900px)').matches;
    var PANEL_TARGETS   = PANEL_MOBILE
        ? [PANEL_RAIL].concat(PANEL_BODY)   // mobile: portrait first
        : PANEL_BODY.concat([PANEL_RAIL]);  // desktop: unchanged

    // Mirrors the authored #dossier-ticker transition in profile.css.
    // MD4 requires the ticker to SETTLE before SYSTEM STATUS begins, so this
    // and that CSS duration must never drift apart.
    var TICKER_TRANSITION_MS = 400;

    // Mirrors the authored #profile-photo / #portrait-grid / #portrait-color
    // scan animations in profile.css: 900ms duration after a 150ms delay, all
    // three started together when .scanning is applied. MD4 requires SYSTEM
    // STATUS to be the FINAL reveal, so status cannot begin while these are
    // still painting. These and those CSS values must never drift apart.
    // (#portrait-scanline declares a longer 2000ms+100ms animation, but nothing
    //  ever applies .scanning to it — that rule is dead and is not counted.)
    var PORTRAIT_RENDER_DELAY_MS = 150;
    var PORTRAIT_RENDER_MS       = 900;

    // System status reveal — fires after last panel completes
    var STATUS_LABEL_DELAY = 77; // ms/char — ~1s total for "System Status"
    var STATUS_POST_PAUSE  = 80; // ms pause before dot + value fade in

    // --- Streaming ---

    function streamLine(el, text, charDelay, onComplete) {
        var index = 0;
        el.textContent = '';
        var timer = setInterval(function () {
            index += 1;
            el.textContent = text.slice(0, index);
            if (index >= text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, charDelay);
    }


    function materializeSystemStatus() {
        var statusEl  = document.getElementById('system-status');
        var labelEl   = statusEl.querySelector('.status-label');
        var dotEl     = statusEl.querySelector('.status-dot');
        var valueEl   = statusEl.querySelector('.status-value');

        // Make container visible (label will stream into it)
        statusEl.classList.add('status-label-done');
        labelEl.textContent = '';

        streamLine(labelEl, 'System Status', STATUS_LABEL_DELAY, function () {
            setTimeout(function () {
                dotEl.classList.add('visible');
                valueEl.classList.add('visible');
                // Border draw fires after fade-in completes
                setTimeout(function () {
                    statusEl.classList.add('border-draw');
                }, 2400);
            }, STATUS_POST_PAUSE);
        });
    }

    function materializeTicker() {
        var ticker = document.getElementById('dossier-ticker');
        if (ticker) ticker.classList.add('ticker-visible');
    }

    function materializePanels(reducedMotion) {
        var lastIndex = PANEL_TARGETS.length - 1;
        PANEL_TARGETS.forEach(function (selector, i) {
            var el = document.querySelector(selector);
            if (!el) return;
            el.style.setProperty('--stagger-delay', (i * PANEL_STAGGER) + 'ms');
            el.classList.add('panel-materialized');
        });

        // MD4: reduced motion must leave NO delayed reveal callback alive. The
        // caller has already put every surface in its final state, so scheduling
        // any of the three branches below would re-stream the CTA and the status
        // label after SYSTEM STATUS was already final.
        if (reducedMotion) return;

        // MD2: derive from the rail's ACTUAL index. lastIndex silently assumed
        // the rail was last, which stops being true once MD2 moves it.
        var railIndex         = PANEL_TARGETS.indexOf(PANEL_RAIL);
        var imageRailComplete = railIndex * PANEL_STAGGER + PANEL_DURATION + 80;
        setTimeout(function () {
            var rail         = document.querySelector('.image-rail');
            var contentRight = document.querySelector('.content-right');
            var photo        = document.getElementById('profile-photo');
            var grid         = document.getElementById('portrait-grid');
            var color        = document.getElementById('portrait-color');
            if (rail)         rail.classList.add('scanning');
            if (contentRight) contentRight.classList.add('rail-visible');
            if (photo)        photo.classList.add('scanning');
            if (grid)         grid.classList.add('scanning');
            if (color)        color.classList.add('scanning');

            // Stream CTA button text after portrait scan completes
            // Reduced from 980ms by 1000ms; floored at 0 so it fires immediately
            // once the scan completes, no negative delay
            setTimeout(function () {
                var cta = document.getElementById('portrait-projects-btn');
                if (!cta) return;
                cta.classList.add('cta-visible');
                streamLine(cta, 'ENTER ENGINEERING PORTAL \u203a', 10);
            }, 0);
        }, imageRailComplete);

        // MD4: SYSTEM STATUS must be the final reveal, so it cannot begin until
        // BOTH the CTA chain and every panel aperture have finished. On desktop
        // the CTA chain is later and dominates; on mobile, with the rail moved
        // first, the CTA chain ends at 920ms while the last panel is still
        // opening until 1100ms. Without this floor status would fire before the
        // final panel — breaking MD4 in the act of fixing it.
        var ctaChainComplete  = imageRailComplete + 0 + 260 + 200;
        var allPanelsComplete = lastIndex * PANEL_STAGGER + PANEL_DURATION;

        // MD4 third bound: the portrait render/fade animations start at
        // imageRailComplete and run 150ms + 900ms beyond it. Candidate 1 omitted
        // this and left SYSTEM STATUS overlapping them by 590ms on desktop and
        // 210ms on mobile — status was not actually the final reveal.
        var portraitVisualComplete =
            imageRailComplete + PORTRAIT_RENDER_DELAY_MS + PORTRAIT_RENDER_MS;

        var statusDelay = Math.max(ctaChainComplete,
                                   allPanelsComplete + 200,
                                   portraitVisualComplete);

        // MD4: the ticker settles BEFORE status begins. TICKER_TRANSITION_MS
        // mirrors the authored #dossier-ticker transition; both must move together.
        setTimeout(materializeTicker,       statusDelay - TICKER_TRANSITION_MS);
        setTimeout(materializeSystemStatus, statusDelay);
    }

    // --- Init ---

    function initStream() {
        // prefers-reduced-motion: populate all text and panels instantly
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            profileName.textContent = NAME_TEXT;
            roleTitle.textContent   = TITLE_TEXT;
            roleTags.textContent    = TAGS_TEXT;
            materializePanels(true);
            var contentRight = document.querySelector('.content-right');
            if (contentRight) contentRight.classList.add('rail-visible');
            var cta = document.getElementById('portrait-projects-btn');
            if (cta) { cta.textContent = 'ENTER ENGINEERING PORTAL \u203a'; cta.classList.add('cta-visible'); }
            document.querySelector('.image-rail').classList.add('scanning');
            document.getElementById('profile-photo').classList.add('scanning');
            var grid  = document.getElementById('portrait-grid');
            var color = document.getElementById('portrait-color');
            if (grid)  { grid.classList.add('scanning');  grid.style.opacity  = '0'; }
            if (color) { color.classList.add('scanning'); color.style.opacity = '0'; }
            // MD4: every pre-status surface reaches its final state BEFORE
            // SYSTEM STATUS is finalized. The ticker is included here, not left
            // to a delayed callback.
            materializeTicker();
            var statusEl = document.getElementById('system-status');
            statusEl.querySelector('.status-label').textContent = 'System Status';
            statusEl.classList.add('status-label-done');
            statusEl.classList.add('border-draw');
            statusEl.querySelector('.status-dot').classList.add('visible');
            statusEl.querySelector('.status-value').classList.add('visible');
            return;
        }

        // Clear targets before streaming
        profileName.textContent = '';
        roleTitle.textContent   = '';
        roleTags.textContent    = '';

        // Stage 1: stream name
        streamLine(profileName, NAME_TEXT, NAME_DELAY, function () {
            // Stage 2: stream title and tags simultaneously
            setTimeout(function () {
                streamLine(roleTitle, TITLE_TEXT, FAST_DELAY);
                // Tags are longer — fire panel sequence when tags complete
                streamLine(roleTags, TAGS_TEXT, FAST_DELAY, function () {
                    materializePanels();
                });
            }, POST_NAME_PAUSE);
        });
    }

    window.addEventListener('DOMContentLoaded', function () {
        initStream();
    });

})();
