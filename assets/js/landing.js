// landing.js — v0.4 SYSTEM SELECT — two destination cards
// No styling dependencies. Pure behavior.

(function () {
  'use strict';

  // ── DOM references ──────────────────────────────────────────────────────

  var wrapperProfile = document.getElementById('wrapper-profile');
  var wrapperPortal  = document.getElementById('wrapper-portal');
  var cardProfile    = document.getElementById('card-profile');
  var cardPortal     = document.getElementById('card-portal');

  // HUD stream targets
  var hudTitle   = document.getElementById('hud-title');
  var hudSub1    = document.getElementById('hud-sub1');
  var hudSub2    = document.getElementById('hud-sub2');
  var hudStatus1 = document.getElementById('hud-status1');
  var hudStatus2 = document.getElementById('hud-status2');
  var hudStatus3 = document.getElementById('hud-status3');

  // Card role elements. Card 01 carries two authored inline spans; .role-a holds
  // the regime-dependent lead text and .role-b is static.
  var roleProfile = cardProfile.querySelector('.card-role');
  var rolePortal  = cardPortal.querySelector('.card-role');
  var role01Lead  = cardProfile.querySelector('.role-a');

  var LINE_PAUSE = 80; // ms pause between streamed lines

  // ── GROUP R focus containment ───────────────────────────────────────────
  var RV     = window.__rv || null;
  var rvMode = RV ? RV.scriptEntry() : 'reduced';

  // Listeners are registered BEFORE .materialized is added, so no animation
  // can complete before its release condition is watching for it.
  function armRelease(card) {
    if (rvMode !== 'active') return;
    var btn = card.querySelector('.enter-system-btn');
    if (!btn) return;
    var cardDone = false, fadeDone = false;
    function maybe() { if (cardDone && fadeDone) RV.release(btn); }
    card.addEventListener('animationend', function (e) {
      if (e.target === card && e.animationName === 'card-materialize') { cardDone = true; maybe(); }
    });
    btn.addEventListener('animationend', function (e) {
      if (e.target === btn && e.animationName === 'card-content-fade') { fadeDone = true; maybe(); }
    });
  }

  // ── Streaming ───────────────────────────────────────────────────────────

  function streamLine(el, text, charDelay, onComplete) {
    var index = 0;
    el.textContent = '';
    el.classList.add('streaming');
    var timer = setInterval(function () {
      index += 1;
      el.textContent = text.slice(0, index);
      if (index >= text.length) {
        clearInterval(timer);
        el.classList.remove('streaming');
        if (onComplete) onComplete();
      }
    }, charDelay);
  }

  // -- PASS L1 reveal engine: inverted Custom Highlight ---------------------
  // Every governed key carries its COMPLETE final text in layout from before the
  // card is visible. The reveal is paint only: one whole-key Range per pending
  // key sits in a per-card Highlight whose rule paints transparent, and the
  // reveal advances that Range's START, shrinking the hidden tail.
  //
  // The element keeps its ordinary colour throughout. That is the point of the
  // inversion: deleting a registry entry REVEALS text, so every failure path
  // ends visible. The previous design made the element transparent and painted
  // the prefix, where a missed cleanup stranded live text invisible.
  //
  // Layout never changes: no node is added, removed or re-texted during a reveal,
  // so card, role, name, tag, list and CTA geometry are invariant by construction.

  var RATE_ROLE = 5;
  var RATE_NAME = 10;
  var RATE_TAG  = 3;
  var RATE_CTA  = 10;

  var ROLE_01_FULL  = 'Security Operations & ';
  var ROLE_01_SHORT = 'Security Ops & ';
  var ROLE_01_ARIA  = 'Security Operations & Infrastructure';
  var ROLE_02_TEXT  = 'Engineering Platform';
  var ROLE_01_MQ    = '(max-width: 900px)';

  var CTA_FADE_NAME  = 'cta-reveal-fade';
  var CTA_FADE_MS    = 300;
  var CTA_FADE_GUARD = 200;   // if animationend never arrives, never strand the control

  var CHAIN_START_MS = 500;
  var CARD_02_STAGGER_MS = 220;

  // FAIL-OPEN: any matchMedia failure yields the full identity line.
  function role01Lead2() {
    try {
      return (window.matchMedia && window.matchMedia(ROLE_01_MQ).matches)
        ? ROLE_01_SHORT : ROLE_01_FULL;
    } catch (e) { return ROLE_01_FULL; }
  }

  function highlightSupported() {
    return typeof Highlight === 'function' &&
           typeof CSS !== 'undefined' && !!CSS.highlights;
  }

  function textNodesOf(el) {
    var out = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) { if (n.data.length) { out.push(n); } }
    return out;
  }

  // -- per-card chain state -------------------------------------------------
  // PASS L2 (F4): the cadence is four reveal GROUPS, not eight sequential keys:
  // role -> name -> {tag1..tag5} -> cta. `revealing` holds the running group's
  // unfinished keys; `armed` names the first key of the group waiting out its
  // pause. They are distinct: exactly one is non-null while RUNNING, outside the
  // synchronous crossing transaction. A crossing during a pause re-arms THE SAME
  // group -- nothing was revealed, so that is not duplication.
  function makeChain(card, wrapper, hideName, roleText) {
    return {
      card: card, wrapper: wrapper, hideName: hideName, roleText: roleText,
      btn: card.querySelector('.enter-system-btn'),
      keys: [], groups: [], ranges: {}, hl: null,
      phase: 'IDLE', revealing: null, armed: null, settled: [],
      tick: null, armTimer: null, pauseTimer: null, startTimer: null,
      ctaFadeGuard: null, ctaFadeDone: false, ctaTextDone: false, ctaOnEnd: null
    };
  }

  function buildKeys(ch) {
    var role = ch.card.querySelector('.card-role');
    var name = ch.card.querySelector('.card-name');
    var tags = ch.card.querySelectorAll('.card-tags li');
    var out = [{ key: 'role', el: role, rate: RATE_ROLE },
               { key: 'name', el: name, rate: RATE_NAME }];
    for (var i = 0; i < tags.length; i++) {
      out.push({ key: 'tag' + (i + 1), el: tags[i], rate: RATE_TAG });
    }
    out.push({ key: 'cta', el: ch.btn, rate: RATE_CTA });
    for (var j = 0; j < out.length; j++) { out[j].nodes = textNodesOf(out[j].el); }
    return out;
  }

  // Reveal groups, in key order. The five tags form ONE group: they start in the
  // same tick and share one cadence, and each settles on its own last character,
  // so they finish ragged. Every other key is a group of one.
  function buildGroups(keys) {
    var out = [], last = null;
    for (var i = 0; i < keys.length; i++) {
      var id = /^tag\d+$/.test(keys[i].key) ? 'tags' : keys[i].key;
      if (!last || last.id !== id) { last = { id: id, keys: [] }; out.push(last); }
      last.keys.push(keys[i]);
    }
    return out;
  }
  function groupIndexOf(ch, name) {
    for (var g = 0; g < ch.groups.length; g++) {
      for (var i = 0; i < ch.groups[g].keys.length; i++) {
        if (ch.groups[g].keys[i].key === name) { return g; }
      }
    }
    return -1;
  }

  function wholeRange(k) {
    var r = document.createRange();
    var last = k.nodes[k.nodes.length - 1];
    r.setStart(k.nodes[0], 0);
    r.setEnd(last, last.data.length);
    return r;
  }

  // Position of a flat character index inside a key's node list.
  function posFor(k, idx) {
    for (var i = 0; i < k.nodes.length; i++) {
      if (idx <= k.nodes[i].data.length) { return { n: k.nodes[i], o: idx, ni: i }; }
      idx -= k.nodes[i].data.length;
    }
    var last = k.nodes[k.nodes.length - 1];
    return { n: last, o: last.data.length, ni: k.nodes.length - 1 };
  }
  function keyChars(k) {
    var t = 0;
    for (var i = 0; i < k.nodes.length; i++) { t += k.nodes[i].data.length; }
    return t;
  }
  // A node boundary that is also a visual line break earns the authored pause.
  // Card 01's role is the only such boundary; measurement showed the natural
  // wrap falls exactly there at both regimes, so the spans add a boundary
  // without taking ownership of layout.
  function boundaryAfterNode(k, ni) {
    return k.key === 'role' && k.nodes.length > 1 && ni === 0;
  }

  function clearTimers(ch) {
    if (ch.tick) { clearInterval(ch.tick); ch.tick = null; }
    if (ch.armTimer) { clearTimeout(ch.armTimer); ch.armTimer = null; }
    if (ch.pauseTimer) { clearTimeout(ch.pauseTimer); ch.pauseTimer = null; }
  }

  function installPending(ch, fromKey) {
    // Reinstall a whole-key hide Range for every key at or after `fromKey`.
    var seen = false;
    for (var i = 0; i < ch.keys.length; i++) {
      var k = ch.keys[i];
      if (k.key === fromKey) { seen = true; }
      if (!seen) { continue; }
      var r = wholeRange(k);
      ch.ranges[k.key] = r;
      ch.hl.add(r);
    }
  }

  function dropAllRanges(ch) {
    // Per-card recovery deletes by NAME. CSS.highlights.clear() is global and
    // would settle the other card too.
    try { CSS.highlights.delete(ch.hideName); } catch (e) { /* nothing to clean */ }
    ch.ranges = {};
    ch.hl = null;
  }

  // FAIL-OPEN. The reveal is optional; readable content is not. Every exit path
  // ends here, and this always leaves text visible: the hidden state lives only
  // in the registry, and this empties it.
  function recover(ch) {
    clearTimers(ch);
    if (ch.ctaFadeGuard) { clearTimeout(ch.ctaFadeGuard); ch.ctaFadeGuard = null; }
    if (ch.startTimer) { clearTimeout(ch.startTimer); ch.startTimer = null; }
    dropAllRanges(ch);
    ctaSettle(ch);
    ch.revealing = null;
    ch.armed = null;
    ch.phase = 'FAILED';
  }

  // -- CTA lifecycle --------------------------------------------------------
  // The control is unreachable until it is fully painted. `inert` is reapplied
  // for the duration of the fade, so the first reachable state coincides with
  // opacity 1 and a complete label. The fade animation name differs from
  // card-content-fade so the bootstrap's release listener does not match it.
  function ctaBeginReveal(ch) {
    if (!ch.btn) { return; }
    ch.ctaFadeDone = false;
    ch.ctaTextDone = false;
    ch.btn.classList.remove('cta-pending');
    ch.btn.setAttribute('inert', '');
    // Settlement is the FADE's business, not the stream's. The stream finishes
    // around 200ms; the fade runs 300ms. Releasing at stream end would make the
    // control reachable while still partly transparent -- the exact window the
    // inert gate exists to close.
    ch.ctaOnEnd = function (e) {
      if (e.target !== ch.btn || e.animationName !== CTA_FADE_NAME) { return; }
      ch.ctaFadeDone = true;
      maybeSettleCta(ch);
    };
    ch.btn.addEventListener('animationend', ch.ctaOnEnd);
    // FAIL-OPEN: an animationend that never arrives must not strand an
    // unreachable control. It must also never release a control whose label is
    // still partly hidden, so the guard does NOT settle directly -- it routes
    // through whole-card recovery, which deletes the hide registry first and
    // therefore forces the complete label visible before anything is reachable.
    ch.ctaFadeGuard = setTimeout(function () {
      ch.ctaFadeGuard = null;
      if (ch.ctaFadeDone && ch.ctaTextDone) { return; }
      recover(ch);
    }, CTA_FADE_MS + CTA_FADE_GUARD);
    ch.btn.classList.add('cta-revealing');
  }
  // The first reachable state must be opacity 1 AND a complete label. Nominal
  // arithmetic says the ~200ms stream finishes inside the 300ms fade, but a
  // delayed tick can invert that, so both facts are required, not assumed.
  function maybeSettleCta(ch) {
    if (ch.ctaFadeDone && ch.ctaTextDone) { ctaSettle(ch); }
  }

  // Terminal, and also the forced-safe state used by recovery.
  function ctaSettle(ch) {
    if (!ch.btn) { return; }
    if (ch.ctaFadeGuard) { clearTimeout(ch.ctaFadeGuard); ch.ctaFadeGuard = null; }
    if (ch.ctaOnEnd) {
      ch.btn.removeEventListener('animationend', ch.ctaOnEnd);
      ch.ctaOnEnd = null;
    }
    // One synchronous step: no frame exists in which the button carries neither
    // .cta-revealing nor .cta-settled, so card-content-fade cannot re-match and
    // restart over an already-visible control.
    ch.btn.classList.remove('cta-pending');
    ch.btn.classList.remove('cta-revealing');
    ch.btn.classList.add('cta-settled');
    // Hand the control back to the bootstrap, not just to the DOM. RV.release()
    // also clears that button's watch entry and its 15s fail-open timer; removing
    // [inert] alone leaves the watchdog armed. On an early per-card recovery the
    // card settles with animation:none, so the inherited armRelease() never sees
    // card-content-fade end and never releases -- the stale timer would fire
    // ~15s later, raise GLOBAL .rv-failed, and escalate a one-card fault into a
    // both-card recovery. That would break per-card isolation.
    try { if (RV && RV.release) { RV.release(ch.btn); } } catch (e) { /* bootstrap gone */ }
    // Kept as the final fail-safe: RV.release() is deliberately a no-op once the
    // bootstrap has already failed globally.
    ch.btn.removeAttribute('inert');
  }

  // -- chain ----------------------------------------------------------------
  // Settle ONE key: its hide Range goes and its text is final. This does not
  // move the chain on -- a tag that finishes early must not stop the others.
  function settleKey(ch, k) {
    var r = ch.ranges[k.key];
    if (r && ch.hl) { try { ch.hl.delete(r); } catch (e) { /* already gone */ } }
    delete ch.ranges[k.key];
    if (ch.settled.indexOf(k.key) === -1) { ch.settled.push(k.key); }
    if (ch.revealing) {
      var at = ch.revealing.indexOf(k.key);
      if (at !== -1) { ch.revealing.splice(at, 1); }
    }
    // The CTA's label is complete here. It stays inert until the fade also ends.
    if (k.key === 'cta') { ch.ctaTextDone = true; maybeSettleCta(ch); }
  }

  // A group is done only when EVERY one of its keys has settled; only then is
  // the next group armed.
  function finishGroup(ch, gi) {
    clearTimers(ch);
    ch.revealing = null;
    if (gi + 1 < ch.groups.length) { arm(ch, gi + 1); } else { ch.phase = 'COMPLETE'; }
  }

  function arm(ch, gi) {
    ch.armed = ch.groups[gi].keys[0].key;
    ch.armTimer = setTimeout(function () {
      ch.armTimer = null;
      ch.armed = null;
      startGroup(ch, gi);
    }, LINE_PAUSE);
  }

  // ONE tick body. Every unfinished key of the running group advances one
  // character in the SAME callback -- so the five tags start together and keep
  // one cadence -- and each key settles on its own final character, so they
  // finish ragged. The authored intra-key pause (Card 01's role, a group of one)
  // suspends and resumes the SAME cursor on the SAME range -- one semantic stage,
  // not two -- so there is no second copy of this loop to drift out of step.
  function tickOnce(ch, gi, curs) {
    try {
      var i, cur, pos;
      for (i = 0; i < curs.length; i++) {
        if (!curs[i].done && !curs[i].k.nodes[0].isConnected) { recover(ch); return; }
      }
      for (i = 0; i < curs.length; i++) {
        cur = curs[i];
        if (cur.done) { continue; }
        cur.index += 1;
        pos = posFor(cur.k, cur.index);
        cur.range.setStart(pos.n, pos.o);
        if (cur.index >= cur.total) { cur.done = true; settleKey(ch, cur.k); continue; }
        if (pos.o === pos.n.data.length && boundaryAfterNode(cur.k, pos.ni)) {
          clearInterval(ch.tick); ch.tick = null;
          ch.pauseTimer = setTimeout(function () {
            ch.pauseTimer = null;
            runTicks(ch, gi, curs);
          }, LINE_PAUSE);
          return;
        }
      }
      if (!ch.revealing || !ch.revealing.length) { finishGroup(ch, gi); }
    } catch (e) { recover(ch); }
  }

  function runTicks(ch, gi, curs) {
    ch.tick = setInterval(function () { tickOnce(ch, gi, curs); }, curs[0].k.rate);
  }

  function startGroup(ch, gi) {
    var g = ch.groups[gi], curs = [];
    ch.revealing = [];
    for (var i = 0; i < g.keys.length; i++) {
      var k = g.keys[i];
      ch.revealing.push(k.key);
      if (k.key === 'cta') { ctaBeginReveal(ch); }
      var r = ch.ranges[k.key];
      if (!r) { settleKey(ch, k); continue; }
      curs.push({ k: k, index: 0, total: keyChars(k), range: r, done: false });
    }
    if (!curs.length) { finishGroup(ch, gi); return; }
    runTicks(ch, gi, curs);
  }

  function primeChain(ch) {
    ch.keys = buildKeys(ch);
    ch.groups = buildGroups(ch.keys);
    // A card recovered before its scheduled materialization must not re-hide
    // itself by priming afterwards.
    if (ch.phase === 'FAILED' || (RV && RV.isFailed && RV.isFailed())) {
      ch.phase = 'FAILED';
      ctaSettle(ch);   // no ranges were installed: the label is already painted
      return false;
    }
    if (!highlightSupported()) { ch.phase = 'COMPLETE'; return false; }
    try {
      ch.hl = new Highlight();
      installPending(ch, ch.keys[0].key);
      CSS.highlights.set(ch.hideName, ch.hl);
      if (ch.btn) { ch.btn.classList.add('cta-pending'); }
    } catch (e) { recover(ch); return false; }
    return true;
  }

  function startChain(ch) {
    if (ch.phase === 'FAILED' || ch.phase === 'COMPLETE') { return; }
    if (RV && RV.isFailed && RV.isFailed()) { recover(ch); return; }
    ch.phase = 'RUNNING';
    startGroup(ch, 0);              // first group runs directly: no leading pause
  }

  // -- breakpoint -----------------------------------------------------------
  // Gate 0 (e) measured that assigning CharacterData.data COLLAPSES a live Range
  // and the text flashes fully visible. So the transaction must delete, mutate
  // and reinstall without yielding. It never re-texts .card-role, which would
  // destroy the two authored nodes.
  function crossBreakpoint(ch) {
    if (ch.phase === 'IDLE' && !ch.hl) { return; }
    var wasRevealing = ch.revealing, wasArmed = ch.armed;
    clearTimers(ch);                                   // 1 cancel
    if (ch.hl) {                                        // 2 delete pending ranges
      for (var key in ch.ranges) {
        if (Object.prototype.hasOwnProperty.call(ch.ranges, key)) {
          try { ch.hl.delete(ch.ranges[key]); } catch (e) { /* already gone */ }
        }
      }
      ch.ranges = {};
    }
    var lead = ch.card.querySelector('.role-a');        // 3+4 mutate in place
    if (lead && lead.firstChild) { lead.firstChild.data = ch.roleText(); }
    ch.keys = buildKeys(ch);
    ch.groups = buildGroups(ch.keys);
    var revealingKeys = (wasRevealing && wasRevealing.length) ? wasRevealing : null;
    if (ch.hl) {                                        // 5 reinstall, same frame
      if (ch.phase === 'RUNNING' && (revealingKeys || wasArmed)) {
        if (revealingKeys) {
          // Every UNFINISHED key of the running group settles in this
          // transaction -- step 2 already deleted its range, so its text is fully
          // painted -- and keys of the group that had already settled stay settled.
          var gi = groupIndexOf(ch, revealingKeys[0]);
          for (var i = 0; i < revealingKeys.length; i++) {
            if (ch.settled.indexOf(revealingKeys[i]) === -1) { ch.settled.push(revealingKeys[i]); }
          }
          // Safe to release directly: step 2 above already emptied this card's
          // registry, so the CTA label is fully painted at this point. The
          // dual-completion gate guards the NORMAL path, where a hide range is
          // still live; here there is none.
          if (revealingKeys.indexOf('cta') !== -1) { ctaSettle(ch); }
          ch.revealing = null;
          if (gi !== -1 && gi + 1 < ch.groups.length) {
            installPending(ch, ch.groups[gi + 1].keys[0].key);
            arm(ch, gi + 1);
          } else { ch.phase = 'COMPLETE'; }
        } else {
          installPending(ch, wasArmed);
          arm(ch, groupIndexOf(ch, wasArmed));          // same group: nothing revealed
        }
      } else if (ch.phase === 'IDLE') {
        installPending(ch, ch.keys[0].key);
      }
    }
  }

  // -- chain instances ------------------------------------------------------
  var chain01 = makeChain(cardProfile, wrapperProfile, 'rv-hide-01', role01Lead2);
  var chain02 = makeChain(cardPortal,  wrapperPortal,  'rv-hide-02',
                          function () { return ROLE_02_TEXT; });

  // A crossing while a card is live runs one synchronous transaction per card.
  // Only Card 01 re-texts -- Card 02's strings are regime-invariant -- but both
  // rebuild their node lists, because a crossing can re-wrap either.
  try {
    var role01Mq = window.matchMedia(ROLE_01_MQ);
    var onBreakpoint = function () {
      crossBreakpoint(chain01);
      crossBreakpoint(chain02);
    };
    if (role01Mq.addEventListener) {
      role01Mq.addEventListener('change', onBreakpoint);
    } else if (role01Mq.addListener) {
      role01Mq.addListener(onBreakpoint);
    }
  } catch (e) { /* no matchMedia: the initial variant stands */ }

  // The bootstrap can fail open at ANY time, including mid-chain. It removes
  // .js, sweeps [inert] and adds .rv-failed -- but CSS cannot cancel a Custom
  // Highlight, so without this bridge a fail-open page would sit with future
  // keys still hidden. MutationObserver delivery is a microtask, so it drains
  // before the next rendering opportunity, matching the bootstrap's own model.
  function watchBootstrapFailure() {
    var d = document.documentElement;
    var mo = null;
    function fire() {
      if (!d.classList.contains('rv-failed')) { return; }
      if (mo) { mo.disconnect(); mo = null; }
      recover(chain01);
      recover(chain02);
    }
    if (d.classList.contains('rv-failed')) { fire(); return; }
    try {
      mo = new MutationObserver(fire);
      mo.observe(d, { attributes: true, attributeFilter: ['class'] });
    } catch (e) { /* no observer: startChain() still checks isFailed() */ }
  }
  watchBootstrapFailure();

  function runSequence(steps, i, onDone) {
    if (i >= steps.length) {
      if (onDone) onDone();
      return;
    }
    var el        = steps[i][0];
    var text      = steps[i][1];
    var charDelay = steps[i][2];
    streamLine(el, text, charDelay, function () {
      setTimeout(function () {
        runSequence(steps, i + 1, onDone);
      }, LINE_PAUSE);
    });
  }

  // ── Card materialize ────────────────────────────────────────────────────

  function materializeCard(card, wrapper) {
    armRelease(card);
    card.classList.add('materialized');
    if (wrapper) {
      wrapper.classList.add('frame-visible');
    }
  }

  // ── Init sequence ───────────────────────────────────────────────────────

  // Text only: no ranges, no chain. Also the reduced-motion and failed-bootstrap
  // final state, where every governed string must simply be present and painted.
  function primeText() {
    if (role01Lead) { role01Lead.textContent = role01Lead2(); }
    roleProfile.setAttribute('aria-label', ROLE_01_ARIA);
    rolePortal.textContent = ROLE_02_TEXT;
  }

  function initStream() {
    // prefers-reduced-motion: set all text immediately
    // rvMode 'failed' means a failsafe already restored the page; render the
    // final state rather than re-engaging a reveal onto visible content.
    if (rvMode === 'failed' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hudTitle.textContent   = 'System Select';
      hudSub1.textContent    = 'READY FOR INITIALIZATION';
      hudSub2.textContent    = 'Select a module to begin system navigation';
      hudStatus1.textContent = 'System online';
      hudStatus2.textContent = 'Network stable';
      hudStatus3.textContent = 'Access granted';
      primeText();
      materializeCard(cardProfile, wrapperProfile);
      materializeCard(cardPortal, wrapperPortal);
      return;
    }

    // Stage 1: HUD title — solo
    streamLine(hudTitle, 'System Select', 23, function () {
      setTimeout(function () {

        // Stage 2: both sublines simultaneously
        streamLine(hudSub1, 'READY FOR INITIALIZATION', 10);
        streamLine(hudSub2, 'Select a module to begin system navigation', 5, function () {
          setTimeout(function () {

            // Stage 3: cards materialize first — critical visuals first
            // Card 01's role text is in layout BEFORE the card is visible.
            primeText();
            primeChain(chain01);
            materializeCard(cardProfile, wrapperProfile);

            chain01.startTimer = setTimeout(function () {
              chain01.startTimer = null;
              startChain(chain01);
            }, CHAIN_START_MS);

            // Card 02 staggered 220ms after Card 01, then its own chain.
            setTimeout(function () {
              primeChain(chain02);
              materializeCard(cardPortal, wrapperPortal);

              chain02.startTimer = setTimeout(function () {
                chain02.startTimer = null;
                startChain(chain02);
              }, CHAIN_START_MS);
            }, CARD_02_STAGGER_MS);

            // Stage 4: footer status lines after cards are up
            setTimeout(function () {
              var footerSteps = [
                [hudStatus1, 'System online',  2],
                [hudStatus2, 'Network stable', 2],
                [hudStatus3, 'Access granted', 2]
              ];
              runSequence(footerSteps, 0);
              if (RV) RV.revealComplete();
            }, 600);

          }, LINE_PAUSE);
        });

      }, LINE_PAUSE);
    });
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  function navigateTo(href) {
    window.location.href = href;
  }

  // ── Card click handlers ─────────────────────────────────────────────────

  function bindCard(card) {
    var btn = card.querySelector('.enter-system-btn');
    var href = card.getAttribute('data-href');

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      navigateTo(href);
    });

    card.addEventListener('click', function (e) {
      if (e.target === btn) return;
      navigateTo(href);
    });
  }

  bindCard(cardProfile);
  bindCard(cardPortal);

  // ── Init ────────────────────────────────────────────────────────────────

  window.addEventListener('DOMContentLoaded', function () {
    initStream();
  });

})();
