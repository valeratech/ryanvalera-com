/* ═══════════════════════════════════════════════════════
   contact.js — Contact Module (Milestone 8B)
   Endpoint, not showcase. No dramatics.
   Stream speed: FAST_DELAY = 4ms/char (matches profile.js)
═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const FAST_DELAY  = 4;  // ms/char — fastest configured value site-wide
    const LINK_STAGGER = 120; // ms between each contact link reveal
    const FOOTER_STAGGER = 120;
    const STATUS_LABEL_DELAY = 77; // ms/char — matches profile dossier status stream
    const STATUS_POST_PAUSE  = 80; // ms pause before dot + value fade in

    const TITLE_TEXT = 'CONTACT MODULE';
    const SUB_TEXT   = 'Professional inquiries and engineering discussions';
    const NAME_TEXT  = 'RYAN VALERA';
    const ROLE_TEXT  = 'Security Operations & Infrastructure Engineer';

    /* ── Streaming ──────────────────────────────────── */
    function streamText(el, text, charDelay, onComplete) {
        if (!el) return;
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
    }

    /* ── Panel materialize ──────────────────────────── */
    function materializePanel() {
        const panel = document.getElementById('contact-panel');
        if (panel) panel.classList.add('panel-materialized');
    }

    /* ── Link items reveal ──────────────────────────── */
    const LINK_IDS = ['link-email', 'link-linkedin', 'link-github', 'link-credly', 'link-location', 'contact-note'];

    function revealLinks() {
        LINK_IDS.forEach((id, i) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.classList.add('link-visible');
            }, i * LINK_STAGGER);
        });
    }

    /* ── Footer reveal ──────────────────────────────── */
    const FOOTER_ITEMS = [
        'footer-item-0', 'footer-div-0',
        'footer-item-1', 'footer-div-1',
        'footer-item-2', 'footer-div-2',
        'footer-item-3'
    ];

    function revealFooter() {
        const footerEl = document.getElementById('contact-footer');
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

    /* ── Init ───────────────────────────────────────── */
    window.addEventListener('DOMContentLoaded', () => {

        const titleEl = document.getElementById('contact-title');
        const subEl   = document.getElementById('contact-sub');
        const nameEl  = document.getElementById('contact-name');
        const roleEl  = document.getElementById('contact-role');

        if (reducedMotion) {
            if (titleEl) titleEl.textContent = TITLE_TEXT;
            if (subEl)   subEl.textContent   = SUB_TEXT;
            materializePanel();
            if (nameEl) nameEl.textContent = NAME_TEXT;
            if (roleEl) roleEl.textContent = ROLE_TEXT;
            revealLinks();
            revealFooter();
            showSystemStatusInstant();
            return;
        }

        // Stream title and sub simultaneously — both fast
        streamText(titleEl, TITLE_TEXT, FAST_DELAY);
        streamText(subEl, SUB_TEXT, FAST_DELAY, () => {

            // Panel opens after header streams
            setTimeout(() => {
                materializePanel();

                // Name and role stream simultaneously after panel opens (380ms animation)
                setTimeout(() => {
                    streamText(nameEl, NAME_TEXT, FAST_DELAY);
                    streamText(roleEl, ROLE_TEXT, FAST_DELAY, () => {

                        // Links reveal sequentially after role finishes
                        setTimeout(() => {
                            revealLinks();

                            // Footer + system status reveal after last link appears
                            const lastLinkDelay = (LINK_IDS.length - 1) * LINK_STAGGER + 300;
                            setTimeout(revealFooter, lastLinkDelay);
                            setTimeout(materializeSystemStatus, lastLinkDelay);
                        }, 80);
                    });
                }, 420);

            }, 80);
        });
    });

})();
