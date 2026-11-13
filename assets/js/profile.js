// profile.js — v0.2 HUD initialization for the professional dossier
// No styling dependencies. Pure behavior.

(function () {
    'use strict';

    // ── GROUP R focus containment ──────────────────────────────────────
    var RV     = window.__rv || null;
    var rvMode = RV ? RV.scriptEntry() : 'reduced';
    var railDone = false, ctaPainted = false, ctaEl = null;

    function maybeReleaseCta() {
        if (railDone && ctaPainted && RV && ctaEl) RV.release(ctaEl);
    }

    // The CTA sits behind TWO gates — the rail's clip and its own opacity —
    // so class application is not paint completion for it.
    function armPanelRelease(el) {
        if (rvMode !== 'active') return;
        el.addEventListener('animationend', function (e) {
            if (e.target !== el || e.animationName !== 'panel-materialize') return;
            // A link whose text is streamed (see "Panel text streams") stays
            // locked until that text is drawn; streamPanelOpened() owns it.
            // Every other control is released here, as before.
            var ctrls = el.querySelectorAll('a:not(.portrait-cta)');
            for (var i = 0; i < ctrls.length; i++) {
                if (!streamHolds(ctrls[i])) RV.release(ctrls[i]);
            }
            streamPanelOpened(el);
            if (el.classList.contains('image-rail')) { railDone = true; maybeReleaseCta(); }
        });
    }

    var profileName = document.getElementById('profile-name');
    var roleTitle   = document.getElementById('role-title');
    var roleTags    = document.getElementById('role-tags');

    var NAME_DELAY = 44; // ms/char — matches Professional Select on landing
    var FAST_DELAY =  4; // ms/char — matches secondary lines on landing

    var NAME_TEXT  = 'Ryan Valera';

    // PASS A: the title and tags strings now live in profile.html as
    // .stream-item spans and are read from the DOM at init. TITLE_TEXT and
    // TAGS_TEXT were removed so the content has ONE source, not two that
    // can drift apart.

    // Pause between the name finishing and the start of stage 2
    var POST_NAME_PAUSE = 80; // ms

    // PASS A: at or below this width profile.css gives .stream-item
    // display:block, so each authored item is its own line and stage 2 runs
    // as ONE sequential chain instead of two concurrent ones.
    //
    // HEADER_MOBILE follows #dossier-header's OWN column-layout breakpoint.
    // PANEL_MOBILE below governs the separate content-grid / portrait
    // layout. They are intentionally different and must NOT be synchronized.
    //
    // This value and the profile.css @media width are one decision written
    // twice; they must never drift apart.
    var HEADER_MOBILE = window.matchMedia('(max-width: 800px)').matches;
    var ITEM_PAUSE    = 80; // ms between mobile items — the POST_NAME_PAUSE beat

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

    // PASS A: capture every .stream-item's authored string BEFORE anything
    // is cleared. Never assign textContent on #role-title / #role-tags —
    // that deletes the spans.
    function collectItems(root) {
        var nodes = root.querySelectorAll('.stream-item'), out = [];
        for (var i = 0; i < nodes.length; i++) {
            out.push({ el: nodes[i], text: nodes[i].textContent });
        }
        return out;
    }

    // PASS A: stream items in order. gapMs applies BETWEEN items only. A
    // trailing pause after the final item would delay onComplete, and
    // materializePanels() gates the entire downstream reveal.
    // onItemStart fires immediately BEFORE an item's first character is
    // scheduled, so a caller can anchor other work to the moment an item
    // begins rather than to the moment the chain finishes.
    function streamChain(items, charDelay, gapMs, onComplete, onItemStart) {
        var i = 0;
        (function next() {
            if (i >= items.length) { if (onComplete) onComplete(); return; }
            var it = items[i], index = i;
            i += 1;
            if (onItemStart) onItemStart(index);
            streamLine(it.el, it.text, charDelay, function () {
                if (gapMs && i < items.length) setTimeout(next, gapMs); else next();
            });
        })();
    }

    // --- Panel text streams ---
    //
    // Once a panel's aperture has opened, the text inside it streams in:
    //   Profile           three paragraphs, one after another, at the Media
    //                     author-intro cadence (9 characters every 8 ms)
    //   Technical Skills  nine blocks, one after another; a block's heading
    //                     and items advance together and the block takes about
    //                     100 ms
    //   the four cards    every row of a card together; a card takes 500 ms
    // At every width a unit also waits until it is itself on screen.
    //
    // The reveal is PAINT ONLY — the Landing page's inverted Custom Highlight.
    // Every string keeps its complete authored text in the DOM and in layout
    // throughout. One Range per text node sits in a Highlight that profile.css
    // paints transparent, and a stream advances each Range's START. No node is
    // added, removed or re-texted, so panel geometry cannot move and assistive
    // technology reads the whole text at every moment. Removing the registry
    // entry REVEALS, so every failure path ends with visible text.
    //
    // Two classes cover what a Highlight cannot paint. .rv-pending sits on a
    // unit until its stream starts: list bullets, row rules and the button
    // border wait with it. .rv-wait sits on an element until its own text is
    // complete: the text glow waits, and a link cannot be clicked. profile.css
    // scopes all of it under .js and @media screen, so the bootstrap's
    // fail-open and printing both show everything.

    var STREAM_HIDE       = 'rv-hide-panels'; // Highlight name — one decision written twice, with profile.css
    var STREAM_TICK_MS    = 8;    // Media author intro: INTRO_TICK_DELAY
    var STREAM_TICK_CHARS = 9;    // Media author intro: INTRO_CHARS_PER_TICK
    var SKILL_BLOCK_MS    = 96;   // one Technical Skills block, heading and items together: 12 ticks, about 100 ms
    var CARD_MS           = 500;  // one card (metrics, certifications, links, projects), all rows together

    // At every width a unit waits until it is on screen: a paragraph, a skills
    // block or a card that streamed below the fold would be finished before
    // anyone scrolled to it. No breakpoint is involved, so this cannot be
    // conflated with HEADER_MOBILE (800px) or PANEL_MOBILE (900px).

    // "On screen": part of the box is inside the viewport, and when the box
    // arrives from below at least this many CSS pixels of it are. The number
    // is small on purpose: nothing that is on screen stays blank for want of a
    // little more scrolling, and every box on this page can reach it, even
    // with the document scrolled to its very end.
    var ON_SCREEN_PX = 40;

    var UNIT_WAITING = 0, UNIT_RUNNING = 1, UNIT_DONE = 2;
    var streams = { on: false, hl: null, io: null, mo: null, tracks: [], running: [], timer: null };

    function streamsSupported() {
        return rvMode === 'active' && typeof Highlight === 'function' &&
               typeof CSS !== 'undefined' && !!CSS.highlights;
    }

    // One unit streams as a whole: a paragraph, a skills block or a card.
    // span 0 means the fixed Media cadence. Otherwise every line advances at
    // one speed and the unit takes `span` ms, set by its longest line.
    // watch is the box whose arrival on screen lets the unit start.
    function buildUnit(el, span, watch) {
        var unit = { el: el, watch: watch, span: span, lines: [], longest: 0,
                     state: UNIT_WAITING, t0: 0, inView: false };
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
        var node, host, range;
        while ((node = walker.nextNode())) {
            host = node.parentNode;
            // Skip the indentation between elements, and a card's own title:
            // the title is part of the aperture, not of the stream.
            if (!/\S/.test(node.data) || host.closest('.panel-header')) continue;
            range = document.createRange();
            range.setStart(node, 0);
            range.setEnd(node, node.data.length);
            unit.lines.push({ node: node, el: host, len: node.data.length, shown: 0,
                              range: range, link: host.closest('a') });
            if (node.data.length > unit.longest) unit.longest = node.data.length;
        }
        return unit;
    }

    // A track is one panel and its units, which run one at a time.
    function addTrack(panelSelector, unitSelector, span) {
        var panel = document.querySelector(panelSelector);
        if (!panel) return;
        var els = unitSelector ? panel.querySelectorAll(unitSelector) : [panel];
        var track = { panel: panel, units: [], open: false, busy: null };
        streams.tracks.push(track);
        for (var i = 0; i < els.length; i++) {
            // Watched box: the unit itself.
            var unit = buildUnit(els[i], span, els[i]);
            track.units.push(unit);
            unit.el.classList.add('rv-pending');
            for (var j = 0; j < unit.lines.length; j++) {
                var line = unit.lines[j];
                streams.hl.add(line.range);
                line.el.classList.add('rv-wait');
                if (line.link) line.link.classList.add('rv-wait');
            }
        }
    }

    // Runs before any panel opens, so every governed string is already held
    // back when its aperture starts to move.
    function prepareStreams() {
        if (!streamsSupported()) return;
        try {
            streams.on = true;
            streams.hl = new Highlight();
            addTrack('#profile-summary', '.panel-body p', 0);
            addTrack('#technical-skills', '.skill-category', SKILL_BLOCK_MS);
            addTrack('#professional-metrics', null, CARD_MS);
            addTrack('#certifications', null, CARD_MS);
            addTrack('#quick-links', null, CARD_MS);
            addTrack('#featured-projects', null, CARD_MS);
            CSS.highlights.set(STREAM_HIDE, streams.hl);
            if (typeof IntersectionObserver === 'function') {
                streams.io = new IntersectionObserver(streamSeen, {
                    rootMargin: '0px 0px -' + ON_SCREEN_PX + 'px 0px'
                });
            }
            document.addEventListener('focusin', streamFocusBridge);
            watchBootstrapFailure();
        } catch (e) { abandonStreams(); }
    }

    // Does a unit wait for the viewport? Without an observer nothing would
    // ever wake a waiting unit, so then it does not wait.
    function streamWaitsForView() { return !!streams.io; }

    // The observer reports every watched box that comes on screen or leaves
    // it. Its report is the ONLY test of "on screen": no second measurement
    // exists that could disagree with it and leave a unit waiting.
    function streamSeen(entries) {
        if (!streams.on) return;
        try {
            for (var e = 0; e < entries.length; e++) {
                for (var t = 0; t < streams.tracks.length; t++) {
                    var units = streams.tracks[t].units;
                    for (var u = 0; u < units.length; u++) {
                        if (units[u].watch === entries[e].target) {
                            units[u].inView = entries[e].isIntersecting;
                        }
                    }
                }
            }
            pumpAll();
        } catch (err) { abandonStreams(); }
    }

    // Units of a panel run one at a time, in document order among those that
    // are on screen. A unit that is not on screen keeps waiting, and never
    // holds back a later unit that is.
    function nextUnit(track) {
        for (var i = 0; i < track.units.length; i++) {
            var unit = track.units[i];
            if (unit.state !== UNIT_WAITING) continue;
            if (!streamWaitsForView() || unit.inView) return unit;
        }
        return null;
    }

    function pump(track) {
        if (!streams.on || !track.open || track.busy) return;
        var unit = nextUnit(track);
        if (!unit) return;
        unit.state = UNIT_RUNNING;
        unit.t0 = performance.now();
        unit.el.classList.remove('rv-pending');
        track.busy = unit;
        streams.running.push({ track: track, unit: unit });
        if (!streams.timer) streams.timer = setInterval(streamTick, STREAM_TICK_MS);
    }

    function pumpAll() {
        for (var i = 0; i < streams.tracks.length; i++) pump(streams.tracks[i]);
    }

    function stopTickerIfIdle() {
        if (!streams.running.length && streams.timer) {
            clearInterval(streams.timer);
            streams.timer = null;
        }
    }

    // Hand a control back to the bootstrap, not just to the DOM: RV.release()
    // also clears that control's 15 s fail-open timer.
    function releaseControl(a) {
        try { if (RV && RV.release) RV.release(a); } catch (e) { /* bootstrap gone */ }
        a.removeAttribute('inert');
    }

    // A line's text is complete: its hide Range goes. Once its element has no
    // unfinished line left the glow comes back, and once its link has none the
    // link can be clicked again. Returns true when that link is fully drawn.
    function revealLine(unit, line) {
        line.shown = line.len;
        try { streams.hl.delete(line.range); } catch (e) { /* registry already gone */ }
        var elBusy = false, linkBusy = false;
        for (var i = 0; i < unit.lines.length; i++) {
            var other = unit.lines[i];
            if (other.shown >= other.len) continue;
            if (other.el === line.el) elBusy = true;
            if (line.link && other.link === line.link) linkBusy = true;
        }
        if (!elBusy && line.el !== line.link) line.el.classList.remove('rv-wait');
        if (!line.link || linkBusy) return false;
        line.link.classList.remove('rv-wait');
        return true;
    }

    // The position is computed from the clock, not counted in callbacks, so a
    // late tick catches up instead of stretching the stream.
    function advanceUnit(run, now) {
        var unit = run.unit, elapsed = now - unit.t0;
        var reach = unit.span
            ? Math.ceil(unit.longest * elapsed / unit.span)
            : STREAM_TICK_CHARS * Math.floor(elapsed / STREAM_TICK_MS);
        var left = 0;
        for (var i = 0; i < unit.lines.length; i++) {
            var line = unit.lines[i];
            if (line.shown >= line.len) continue;
            if (!line.node.isConnected) throw new Error('stream text left the document');
            var n = Math.min(line.len, reach);
            if (n >= line.len) {
                if (revealLine(unit, line)) releaseControl(line.link);
            } else if (n > line.shown) {
                line.shown = n;
                line.range.setStart(line.node, n);
            }
            if (line.shown < line.len) left += 1;
        }
        if (!left) finishUnit(run);
    }

    // Nothing left to wake, to bridge or to guard.
    function dropWatchers() {
        if (streams.io) {
            try { streams.io.disconnect(); } catch (e) { /* already gone */ }
            streams.io = null;
        }
        if (streams.mo) { streams.mo.disconnect(); streams.mo = null; }
        document.removeEventListener('focusin', streamFocusBridge);
    }

    // Once every unit is drawn the engine leaves nothing behind: no observer,
    // no listener, no registry entry.
    function retireIfComplete() {
        for (var t = 0; t < streams.tracks.length; t++) {
            var units = streams.tracks[t].units;
            for (var u = 0; u < units.length; u++) {
                if (units[u].state !== UNIT_DONE) return;
            }
        }
        dropWatchers();
        try { CSS.highlights.delete(STREAM_HIDE); } catch (e) { /* already gone */ }
    }

    function finishUnit(run) {
        var at = streams.running.indexOf(run);
        if (at !== -1) streams.running.splice(at, 1);
        run.unit.state = UNIT_DONE;
        run.track.busy = null;
        pump(run.track);
        stopTickerIfIdle();
        retireIfComplete();
        maybeStartStatus();
    }

    function streamTick() {
        try {
            var now = performance.now();
            for (var i = streams.running.length - 1; i >= 0; i--) {
                advanceUnit(streams.running[i], now);
            }
        } catch (e) { abandonStreams(); }
    }

    function trackOf(panel) {
        if (!streams.on) return null;
        for (var i = 0; i < streams.tracks.length; i++) {
            if (streams.tracks[i].panel === panel) return streams.tracks[i];
        }
        return null;
    }

    // Is this control's release owned by a stream that has not drawn it yet?
    function streamHolds(a) {
        if (!streams.on) return false;
        for (var t = 0; t < streams.tracks.length; t++) {
            var units = streams.tracks[t].units;
            for (var u = 0; u < units.length; u++) {
                if (units[u].state === UNIT_DONE) continue;
                for (var l = 0; l < units[u].lines.length; l++) {
                    if (units[u].lines[l].link === a) return true;
                }
            }
        }
        return false;
    }

    // The panel's aperture has opened: its panel-materialize animation ended.
    function streamPanelOpened(el) {
        var track = trackOf(el);
        if (!track) return;
        try {
            track.open = true;
            // Not waiting for the viewport: the first unit starts now, and a
            // link stays locked until its own text is drawn.
            if (!streamWaitsForView()) { pump(track); return; }
            // Waiting for the viewport, for as long as the visitor takes. The
            // links cannot stay inert that long: the bootstrap fails the whole
            // page open when an armed control is still inert 15 s after script
            // entry, and a keyboard or screen-reader user would have no way to
            // reach them. They are handed back now — the moment the page has
            // always handed them back. Until a link's text is drawn, .rv-wait
            // keeps it from being clicked, and streamFocusBridge() draws its
            // unit the moment focus lands on it. The observer's first report
            // then starts whatever is already on screen.
            for (var i = 0; i < track.units.length; i++) {
                var unit = track.units[i];
                for (var j = 0; j < unit.lines.length; j++) {
                    if (unit.lines[j].link) releaseControl(unit.lines[j].link);
                }
                streams.io.observe(unit.watch);
            }
        } catch (e) { abandonStreams(); }
    }

    // Draw one unit completely, now. Used when focus reaches a link whose text
    // is not drawn yet.
    function settleUnitNow(track, unit) {
        var i;
        for (i = 0; i < unit.lines.length; i++) {
            if (unit.lines[i].shown >= unit.lines[i].len) continue;
            if (revealLine(unit, unit.lines[i]) && track.open) releaseControl(unit.lines[i].link);
        }
        unit.el.classList.remove('rv-pending');
        for (i = streams.running.length - 1; i >= 0; i--) {
            if (streams.running[i].unit === unit) streams.running.splice(i, 1);
        }
        unit.state = UNIT_DONE;
        if (track.busy === unit) track.busy = null;
        pump(track);
        stopTickerIfIdle();
        retireIfComplete();
        maybeStartStatus();
    }

    // Focus has reached a link whose text is not drawn yet. That is only
    // possible where text waits for the viewport (see streamPanelOpened). The
    // unit is drawn in this same task, before the browser paints the focus
    // ring, so no frame shows a focused link without its text.
    function streamFocusBridge(e) {
        if (!streams.on || !e.target || !e.target.closest) return;
        var a = e.target.closest('a.rv-wait');
        if (!a) return;
        try {
            for (var t = 0; t < streams.tracks.length; t++) {
                var units = streams.tracks[t].units;
                for (var u = 0; u < units.length; u++) {
                    for (var l = 0; l < units[u].lines.length; l++) {
                        if (units[u].lines[l].link === a) {
                            settleUnitNow(streams.tracks[t], units[u]);
                            return;
                        }
                    }
                }
            }
        } catch (err) { abandonStreams(); }
    }

    // FAIL-OPEN. The streams are optional; readable text and reachable links
    // are not. Every exit path ends here, and this always leaves the text
    // painted: the waiting state lives only in the registry entry and in two
    // classes, and this removes all three. A panel that has not opened yet
    // keeps its links locked — armPanelRelease() releases them when it opens,
    // exactly as it did before there were streams.
    function abandonStreams() {
        var wasOn = streams.on;
        streams.on = false;
        if (streams.timer) { clearInterval(streams.timer); streams.timer = null; }
        try { CSS.highlights.delete(STREAM_HIDE); } catch (e) { /* nothing registered */ }
        dropWatchers();
        for (var t = 0; t < streams.tracks.length; t++) {
            var track = streams.tracks[t];
            for (var u = 0; u < track.units.length; u++) {
                var unit = track.units[u];
                unit.state = UNIT_DONE;
                unit.el.classList.remove('rv-pending');
                for (var l = 0; l < unit.lines.length; l++) {
                    var line = unit.lines[l];
                    line.shown = line.len;
                    line.el.classList.remove('rv-wait');
                    if (!line.link) continue;
                    line.link.classList.remove('rv-wait');
                    if (track.open) releaseControl(line.link);
                }
            }
            track.busy = null;
        }
        streams.running = [];
        if (wasOn) maybeStartStatus();
    }

    // The bootstrap can fail open at any time, including mid-stream. It
    // removes .js, which unmatches every stream rule in profile.css, but the
    // engine must also stop and let SYSTEM STATUS go. MutationObserver delivery
    // is a microtask, so it drains before the next rendering opportunity.
    function watchBootstrapFailure() {
        var d = document.documentElement;
        streams.mo = new MutationObserver(function () {
            if (d.classList.contains('rv-failed')) abandonStreams();
        });
        streams.mo.observe(d, { attributes: true, attributeFilter: ['class'] });
    }

    // MD4: SYSTEM STATUS is the final reveal. Its floor (statusDelay, in
    // materializePanels) is arithmetic over fixed animation times. A text
    // stream ends when its last character is drawn, so this half of the gate
    // waits for the event itself, not for an estimate of it.
    var statusFloorPassed = false, statusStarted = false;

    // The streams SYSTEM STATUS waits for: every one that is running, and
    // where text does not wait for the viewport, every one still to run. Text
    // that waits for the viewport is off screen and may stay there, so it is
    // not waited for.
    function streamsHoldStatus() {
        if (!streams.on) return false;
        if (streams.running.length) return true;
        if (streamWaitsForView()) return false;
        for (var t = 0; t < streams.tracks.length; t++) {
            var units = streams.tracks[t].units;
            for (var u = 0; u < units.length; u++) {
                if (units[u].state !== UNIT_DONE) return true;
            }
        }
        return false;
    }

    function maybeStartStatus() {
        if (statusStarted || !statusFloorPassed || streamsHoldStatus()) return;
        statusStarted = true;
        materializeSystemStatus();
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
                    if (RV) RV.revealComplete();
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
            armPanelRelease(el);
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
                ctaEl = cta;
                if (rvMode === 'active') {
                    cta.addEventListener('transitionend', function (e) {
                        if (e.target !== cta || e.propertyName !== 'opacity') return;
                        ctaPainted = true; maybeReleaseCta();
                    });
                }
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
        // statusDelay is now the EARLIEST moment for status: it also waits for
        // the panel text streams (maybeStartStatus), which end on an event.
        setTimeout(materializeTicker,       statusDelay - TICKER_TRANSITION_MS);
        setTimeout(function () {
            statusFloorPassed = true;
            maybeStartStatus();
        }, statusDelay);
    }

    // --- Init ---

    function initStream() {
        // prefers-reduced-motion: populate all text and panels instantly
        if (rvMode === 'failed' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            profileName.textContent = NAME_TEXT;
            // PASS A: role-title and role-tags are NOT touched here. This
            // branch returns before any collection or clearing, so the
            // authored .stream-item markup is already the final state.
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

        // Hold back every panel's text before any aperture can open. This
        // runs only on the animated path: the branch above returned first.
        prepareStreams();

        // Clear targets before streaming. Items are captured FIRST and then
        // cleared individually: clearing a parent would destroy its
        // .stream-item spans, and every item must be blank before ANY chain
        // starts or later items sit visibly complete while an earlier one
        // is still animating.
        profileName.textContent = '';
        var titleItems = collectItems(roleTitle);
        var tagItems   = collectItems(roleTags);
        var allItems   = titleItems.concat(tagItems);
        // PASS A timing: the mobile panel sequence is anchored to the FIRST
        // TAG ITEM, derived from the title item count rather than hard-coded,
        // so adding or removing a title item cannot silently move the anchor.
        var panelStartItem = titleItems.length;
        for (var n = 0; n < allItems.length; n++) allItems[n].el.textContent = '';

        // Stage 1: stream name
        streamLine(profileName, NAME_TEXT, NAME_DELAY, function () {
            // Stage 2. Mobile: ONE sequential chain, ITEM_PAUSE between items.
            // Desktop: two concurrent chains with no gap, which reproduces the
            // previous character arrival and fires materializePanels() on the
            // tags chain at the same instant as before.
            setTimeout(function () {
                if (HEADER_MOBILE) {
                    // PASS A timing: the panel sequence starts WITH the first
                    // tag item instead of after the last one — waiting for all
                    // six left about 580 ms of dead time on mobile. Fired from
                    // the item-start hook, so the chain passes NO completion
                    // callback and materializePanels() still runs exactly once.
                    streamChain(allItems, FAST_DELAY, ITEM_PAUSE, null, function (index) {
                        if (index === panelStartItem) materializePanels();
                    });
                } else {
                    streamChain(titleItems, FAST_DELAY, 0);
                    streamChain(tagItems, FAST_DELAY, 0, function () {
                        materializePanels();
                    });
                }
            }, POST_NAME_PAUSE);
        });
    }

    window.addEventListener('DOMContentLoaded', function () {
        initStream();
    });

})();
