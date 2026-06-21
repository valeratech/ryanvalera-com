// landing.js — v0.2 interaction logic for the system access screen
// No styling dependencies. Pure behavior.

(function () {
  'use strict';

  var PROFILE_URL = 'profile.html';

  var activeCard = document.getElementById('card-active');
  var enterBtn = document.getElementById('enter-system-btn');
  var systemMessage = document.getElementById('system-message');

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
    // Avoid double-triggering when the button itself was clicked
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

  // Set initial focus to the active card on load for keyboard users
  window.addEventListener('DOMContentLoaded', function () {
    activeCard.setAttribute('tabindex', '0');
    activeCard.focus();
  });

})();
