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

  // Card role elements (streamed after materialize)
  var roleProfile = cardProfile.querySelector('.card-role');
  var rolePortal  = cardPortal.querySelector('.card-role');

  var LINE_PAUSE = 80; // ms pause between streamed lines

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

  // ── Card 01 role: paint-only reveal ─────────────────────────────────────
  // The generic streamLine() above grows textContent one character at a time.
  // For Card 01's role that mutated the element's intrinsic width every tick,
  // which resized the shrink-to-fit card and relocated characters between
  // lines mid-stream. Card 01 instead carries its COMPLETE final text from
  // before the card is visible, and the stream becomes paint: a Custom
  // Highlight range whose endpoint advances. Layout never changes.
  //
  // Card 02 and the HUD have not shown this defect and keep streamLine().
  var ROLE_01  = 'Security Operations & Infrastructure';
  var HL_NAME  = 'card01-role-reveal';

  function highlightSupported() {
    return typeof Highlight === 'function' &&
           typeof CSS !== 'undefined' && !!CSS.highlights;
  }

  // FAIL-OPEN. The reveal is optional; readable content is not. Any failure --
  // missing capability, a throw during setup, a throw mid-reveal -- must leave
  // the real role text visible in its ordinary final state. It must never leave
  // .role-reveal applied, because that paints the live text transparent.
  function settleRole01() {
    roleProfile.textContent = ROLE_01;
    roleProfile.classList.remove('role-reveal');
    roleProfile.classList.remove('streaming');
    try {
      if (typeof CSS !== 'undefined' && CSS.highlights) {
        CSS.highlights.delete(HL_NAME);
      }
    } catch (e) { /* registry unavailable: nothing to clean */ }
  }

  // Called before materializeCard() so the final text owns layout from the
  // first visible frame.
  function primeRole01() {
    roleProfile.textContent = ROLE_01;
    if (highlightSupported()) {
      roleProfile.classList.add('role-reveal');
    }
  }

  function revealRole01(charDelay, onComplete) {
    if (!highlightSupported()) {
      settleRole01();
      if (onComplete) onComplete();
      return;
    }
    var node, range, hl, timer;
    try {
      node  = roleProfile.firstChild;
      range = document.createRange();
      range.setStart(node, 0);
      range.setEnd(node, 0);
      hl = new Highlight(range);
      CSS.highlights.set(HL_NAME, hl);
    } catch (e) {
      settleRole01();
      if (onComplete) onComplete();
      return;
    }
    var index = 0;
    roleProfile.classList.add('streaming');
    timer = setInterval(function () {
      try {
        index += 1;
        range.setEnd(node, index);        // endpoint only -- no DOM mutation
        if (index >= ROLE_01.length) {
          clearInterval(timer);
          settleRole01();
          if (onComplete) onComplete();
        }
      } catch (e) {
        clearInterval(timer);
        settleRole01();
        if (onComplete) onComplete();
      }
    }, charDelay);
  }

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
    card.classList.add('materialized');
    if (wrapper) {
      wrapper.classList.add('frame-visible');
    }
  }

  // ── Init sequence ───────────────────────────────────────────────────────

  function initStream() {
    // prefers-reduced-motion: set all text immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hudTitle.textContent   = 'System Select';
      hudSub1.textContent    = 'READY FOR INITIALIZATION';
      hudSub2.textContent    = 'Select a module to begin system navigation';
      hudStatus1.textContent = 'System online';
      hudStatus2.textContent = 'Network stable';
      hudStatus3.textContent = 'Access granted';
      roleProfile.textContent = ROLE_01;
      rolePortal.textContent  = 'Engineering Platform';
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
            primeRole01();
            materializeCard(cardProfile, wrapperProfile);

            setTimeout(function () {
              revealRole01(5);
            }, 500);

            // Card 02 staggered 220ms after Card 01
            setTimeout(function () {
              materializeCard(cardPortal, wrapperPortal);

              setTimeout(function () {
                streamLine(rolePortal, 'Engineering Platform', 5);
              }, 500);
            }, 220);

            // Stage 4: footer status lines after cards are up
            setTimeout(function () {
              var footerSteps = [
                [hudStatus1, 'System online',  2],
                [hudStatus2, 'Network stable', 2],
                [hudStatus3, 'Access granted', 2]
              ];
              runSequence(footerSteps, 0);
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
