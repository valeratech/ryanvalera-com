// landing.js — v0.3 interaction logic for the system access screen
// No styling dependencies. Pure behavior.

(function () {
  'use strict';

  var PROFILE_URL = 'profile.html';

  var activeCard    = document.getElementById('card-active');
  var glowWrapper   = document.getElementById('card-glow-wrapper');
  var enterBtn      = document.getElementById('enter-system-btn');
  var systemMessage = document.getElementById('system-message');

  // HUD stream targets
  var hudTitle   = document.getElementById('hud-title');
  var hudSub1    = document.getElementById('hud-sub1');
  var hudSub2    = document.getElementById('hud-sub2');
  var hudStatus1 = document.getElementById('hud-status1');
  var hudStatus2 = document.getElementById('hud-status2');
  var hudStatus3 = document.getElementById('hud-status3');

  // Sequence: [element, final text, char delay ms]
  var STREAM_SEQUENCE = [
    [hudTitle,   'Professional Select',               22],
    [hudSub1,    'Professional dossier available',          3],
    [hudSub2,    'Select to continue to operator profile',  3],
    [hudStatus1, 'System online',                      3],
    [hudStatus2, 'Network stable',                     3],
    [hudStatus3, 'Access granted',                     3]
  ];

  var LINE_PAUSE = 80; // ms pause between lines

  // --- Streaming ---

  function streamLine(el, text, charDelay, onComplete) {
    var index = 0;
    el.textContent = '';
    var timer = setInterval(function () {
      index += 1;
      el.textContent = text.slice(0, index);
      if (index >= text.length) {
        clearInterval(timer);
        onComplete();
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

  function materializeCard() {
    activeCard.classList.add('materialized');
    // Borders fade in together with the card-opening animation
    if (glowWrapper) {
      glowWrapper.classList.add('frame-visible');
    }
  }

  function initStream() {
    // prefers-reduced-motion: set all text immediately, materialize card instantly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      STREAM_SEQUENCE.forEach(function (step) {
        step[0].textContent = step[1];
      });
      activeCard.classList.add('materialized');
      if (glowWrapper) glowWrapper.classList.add('frame-visible');
      return;
    }

    // Stage 1: Professional Select — solo
    streamLine(hudTitle, 'Professional Select', 23, function () {
      setTimeout(function () {

        // Stage 2: both sublines simultaneously
        streamLine(hudSub1, 'Professional dossier available', 10);
        streamLine(hudSub2, 'Select to continue to operator profile', 5, function () {
          setTimeout(function () {

            // Stage 3: footer status lines sequential → card materializes
            var footerSteps = [
              [hudStatus1, 'System online',  2],
              [hudStatus2, 'Network stable', 2],
              [hudStatus3, 'Access granted', 2]
            ];
            runSequence(footerSteps, 0, materializeCard);

          }, LINE_PAUSE);
        });

      }, LINE_PAUSE);
    });
  }

  // --- Navigation ---

  function goToProfile() {
    window.location.href = PROFILE_URL;
  }

  function showSystemMessage() {
    systemMessage.hidden = false;
    systemMessage.classList.add('pulse');
    setTimeout(function () {
      systemMessage.classList.remove('pulse');
      systemMessage.hidden = true;
    }, 2000);
  }

  // --- Click handlers ---

  enterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    goToProfile();
  });

  activeCard.addEventListener('click', function (e) {
    if (e.target === enterBtn) return;
    goToProfile();
  });

  // --- Keyboard handlers (global) ---

  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        goToProfile();
        break;

      case 'Escape':
        e.preventDefault();
        showSystemMessage();
        break;

      default:
        break;
    }
  });

  // --- Init ---

  window.addEventListener('DOMContentLoaded', function () {
    activeCard.setAttribute('tabindex', '0');
    activeCard.focus();
    initStream();
  });

})();
