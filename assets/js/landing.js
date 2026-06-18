// landing.js — v0.1 interaction logic for the character select screen
// No styling dependencies. Pure behavior.

(function () {
  'use strict';

  var PROFILE_URL = 'profile.html';

  var activeCard = document.getElementById('card-active');
  var enterBtn = document.getElementById('enter-system-btn');
  var lockedLeft = document.getElementById('card-locked-left');
  var lockedRight = document.getElementById('card-locked-right');
  var tooltip = document.getElementById('tooltip');
  var systemMessage = document.getElementById('system-message');

  var allCards = [lockedLeft, activeCard, lockedRight];
  var focusIndex = 1; // start focus on the active card

  function goToProfile() {
    window.location.href = PROFILE_URL;
  }

  function showTooltip(target, message) {
    tooltip.textContent = message;
    tooltip.hidden = false;

    // Position tooltip near the target card if possible (no styling assumptions, just DOM relationship)
    target.setAttribute('aria-describedby', 'tooltip');

    clearTimeout(tooltip._hideTimer);
    tooltip._hideTimer = setTimeout(function () {
      tooltip.hidden = true;
      target.removeAttribute('aria-describedby');
    }, 2000);
  }

  function shakeCard(card) {
    card.classList.add('shake');
    setTimeout(function () {
      card.classList.remove('shake');
    }, 400);
  }

  function rejectLockedCard(card) {
    shakeCard(card);
    showTooltip(card, 'Recruit clearance required.');
  }

  function showSystemMessage() {
    systemMessage.hidden = false;
    systemMessage.classList.add('pulse');
    setTimeout(function () {
      systemMessage.classList.remove('pulse');
      systemMessage.hidden = true;
    }, 2000);
  }

  function focusCard(index) {
    if (index < 0) index = allCards.length - 1;
    if (index >= allCards.length) index = 0;
    focusIndex = index;
    allCards[focusIndex].focus();
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

  lockedLeft.addEventListener('click', function () {
    rejectLockedCard(lockedLeft);
  });

  lockedRight.addEventListener('click', function () {
    rejectLockedCard(lockedRight);
  });

  // --- Keyboard handlers (global) ---

  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'Enter':
        // If focus is on a locked card, reject. Otherwise navigate.
        if (document.activeElement === lockedLeft) {
          e.preventDefault();
          rejectLockedCard(lockedLeft);
        } else if (document.activeElement === lockedRight) {
          e.preventDefault();
          rejectLockedCard(lockedRight);
        } else {
          e.preventDefault();
          goToProfile();
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        focusCard(focusIndex - 1);
        break;

      case 'ArrowRight':
        e.preventDefault();
        focusCard(focusIndex + 1);
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