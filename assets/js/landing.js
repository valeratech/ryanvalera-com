// landing.js — v0.4 SYSTEM SELECT — two destination cards
// No styling dependencies. Pure behavior.

(function () {
  'use strict';

  // ── DOM references ──────────────────────────────────────────────────────

  var wrapperProfile = document.getElementById('wrapper-profile');
  var wrapperPortal  = document.getElementById('wrapper-portal');
  var cardProfile    = document.getElementById('card-profile');
  var cardPortal     = document.getElementById('card-portal');
  var systemMessage  = document.getElementById('system-message');

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
      revealKbdHint();
      roleProfile.textContent = 'Infrastructure Security';
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
            materializeCard(cardProfile, wrapperProfile);

            setTimeout(function () {
              streamLine(roleProfile, 'Infrastructure Security', 5);
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
              runSequence(footerSteps, 0, function () {
                setTimeout(revealKbdHint, 200);
              });
            }, 600);

          }, LINE_PAUSE);
        });

      }, LINE_PAUSE);
    });
  }

  // ── Keyboard hint reveal ────────────────────────────────────────────────

  function revealKbdHint() {
    var hint = document.querySelector('footer p:last-child');
    if (hint) hint.classList.add('hint-visible');
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  function navigateTo(href) {
    window.location.href = href;
  }

  function showSystemMessage() {
    systemMessage.hidden = false;
    systemMessage.classList.add('pulse');
    setTimeout(function () {
      systemMessage.classList.remove('pulse');
      systemMessage.hidden = true;
    }, 2000);
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

  // ── Keyboard handlers ───────────────────────────────────────────────────

  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        // Enter always routes to Professional Dossier (Card 01)
        navigateTo('profile.html');
        break;

      case 'Escape':
        e.preventDefault();
        showSystemMessage();
        break;

      default:
        break;
    }
  });

  // ── Init ────────────────────────────────────────────────────────────────

  window.addEventListener('DOMContentLoaded', function () {
    cardProfile.setAttribute('tabindex', '0');
    cardProfile.focus();
    initStream();
  });

})();
