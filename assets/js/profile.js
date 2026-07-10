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
    var TITLE_TEXT = 'Enterprise Security Operations & Infrastructure Engineer';
    var TAGS_TEXT  = 'Defensive Telemetry // Log Analysis // Network Access Control // Informatics';

    // Pause between name finishing and simultaneous title/tags start
    var POST_NAME_PAUSE = 80; // ms

    // Panel materialization — ordered sequence, image-rail last
    var PANEL_STAGGER   = 120; // ms between each panel aperture open
    var PANEL_DURATION  = 380; // ms per panel aperture animation
    var PANEL_TARGETS   = [
        '#profile-summary',
        '#technical-skills',
        '#professional-metrics',
        '#certifications',
        '#quick-links',
        '#featured-projects',
        '.image-rail'
    ];

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

    function materializePanels() {
        var lastIndex = PANEL_TARGETS.length - 1;
        PANEL_TARGETS.forEach(function (selector, i) {
            var el = document.querySelector(selector);
            if (!el) return;
            el.style.setProperty('--stagger-delay', (i * PANEL_STAGGER) + 'ms');
            el.classList.add('panel-materialized');
        });

        // Fire portrait scan + reveal content-right trace after image-rail aperture completes
        var imageRailComplete = lastIndex * PANEL_STAGGER + PANEL_DURATION + 80;
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

        // Fire system-status after CTA finishes streaming
        // imageRailComplete + 0ms (CTA appears immediately) + ~260ms (CTA stream
        // ~26 chars * 10ms) + 200ms buffer
        var statusDelay = imageRailComplete + 0 + 260 + 200;
        setTimeout(materializeSystemStatus, statusDelay);
        setTimeout(materializeTicker, statusDelay + 400);
    }

    // --- Init ---

    function initStream() {
        // prefers-reduced-motion: populate all text and panels instantly
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            profileName.textContent = NAME_TEXT;
            roleTitle.textContent   = TITLE_TEXT;
            roleTags.textContent    = TAGS_TEXT;
            materializePanels();
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
