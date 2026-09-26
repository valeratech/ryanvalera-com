/* ═══════════════════════════════════════════════════════
   projects.js — Engineering Portal (Milestone 7B)
   Stream timing mirrors profile.js exactly.
   Glitch logic ported from demo card.js.
═══════════════════════════════════════════════════════ */
(function () {
    'use strict';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* ── Timing — mirrors profile.js ──────────────── */
    const NAME_DELAY        = 44;
    const FAST_DELAY        =  5;
    const POST_NAME_PAUSE   = 80;
    const POST_EYEBROW_PAUSE = POST_NAME_PAUSE; // H1: the same beat before the hint
    const STATUS_CHAR_DELAY = 77;
    const STATUS_POST_PAUSE = 80;
    /* ── Text content ─────────────────────────────── */
    // M3: at <=1100px the title and eyebrow stream as the Owner-approved narrow copy.
    // streamText writes textContent, so the forced breaks travel as \n and
    // projects.css sets white-space:pre-line at the same width. The two strings
    // are resolved when each stream STARTS, and re-applied if the viewport crosses
    // 1100px afterwards (see onHeaderBreakpoint), so neither layout is left with
    // the other's strings. The title is 18 characters either way (space -> \n),
    // so the NAME_DELAY cadence is unchanged. This query and the projects.css
    // @media width are one decision written twice and must never drift apart.
    const NARROW_HEADER_MQ = window.matchMedia('(max-width: 1100px)');
    const TITLE_DESKTOP    = 'ENGINEERING PORTAL';
    const TITLE_NARROW     = 'ENGINEERING\nPORTAL';
    const EYEBROW_DESKTOP  = 'SECURITY OPERATIONS \u00b7 INFRASTRUCTURE \u00b7 AUTOMATION';
    const EYEBROW_NARROW   = '\u00b7 SECURITY OPERATIONS\n\u00b7 INFRASTRUCTURE\n\u00b7 AUTOMATION';
    function titleText()   { return NARROW_HEADER_MQ.matches ? TITLE_NARROW   : TITLE_DESKTOP; }
    function eyebrowText() { return NARROW_HEADER_MQ.matches ? EYEBROW_NARROW : EYEBROW_DESKTOP; }
    // D2: the page hint is the header intro; the reticle is markup in projects.html.
    // H3: at <=599px the one-line hint has no room to spare, so it streams with a forced
    // break after "preview" (projects.css sets white-space:pre-line at that width).
    // Resolved when the hint stream starts and swapped on a live crossing of 599/600px
    // exactly like the M3 strings. This query and the projects.css @media width are
    // one decision written twice and must never drift apart.
    const HINT_BREAK_MQ = window.matchMedia('(max-width: 599px)');
    const INTRO_ONE_LINE = 'Hover over a project card to preview system workflows and architecture.';
    const INTRO_BROKEN   = 'Hover over a project card to preview\nsystem workflows and architecture.';
    function introText() { return HINT_BREAK_MQ.matches ? INTRO_BROKEN : INTRO_ONE_LINE; }
    const STATUS_LABEL_TEXT = 'SYSTEM STATUS';
    const STATUS_VALUE_TEXT = 'OPERATIONAL';
    const DESC_TEXT    = 'Imaging interoperability lab using Orthanc PACS and Mirth Connect to demonstrate DICOM workflows, HL7 messaging, MWL concepts, and controlled integration scenarios in a laboratory environment.';
    /* ── Streaming utility ────────────────────────── */
    function streamText(el, text, charDelay, onComplete) {
        if (!el) return null;
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
        return timer;
    }
    /* Static-card task: each description box carries an invisible copy of its full
       text from load (.desc-reserve, aria-hidden), so the card already has its final
       height before anything streams and the streamed text can never exceed it. */
    function reserveDescription(el, text) {
        if (!el || !el.parentNode) return;
        const reserve = document.createElement('p');
        reserve.className = 'desc-reserve';
        reserve.setAttribute('aria-hidden', 'true');
        reserve.textContent = text;
        el.parentNode.insertBefore(reserve, el);
    }
    /* ── Status pill ──────────────────────────────── */
    function streamStatus() {
        const pillEl  = document.getElementById('portal-status');
        const labelEl = document.getElementById('portal-status-label');
        const dotEl   = document.getElementById('portal-status-dot');
        const valueEl = document.getElementById('portal-status-value');
        if (!pillEl) return;
        if (valueEl) valueEl.textContent = STATUS_VALUE_TEXT;
        pillEl.classList.add('status-label-done');
        if (labelEl) labelEl.textContent = '';
        streamText(labelEl, STATUS_LABEL_TEXT, STATUS_CHAR_DELAY, () => {
            setTimeout(() => {
                if (dotEl)   dotEl.classList.add('visible');
                if (valueEl) valueEl.classList.add('visible');
                setTimeout(() => pillEl.classList.add('border-draw'), 2400);
            }, STATUS_POST_PAUSE);
        });
    }
    // Reduced motion: reach the final state with no character streaming and no
    // delayed border. The CSS animation is already collapsed by the reduced-motion
    // block, but the setInterval and the 2400ms setTimeout above are not — without
    // this path the label still typed for 800ms and the border landed at 3150ms.
    // Mirrors showSystemStatusInstant() in contact.js.
    function showStatusInstant() {
        const pillEl = document.getElementById('portal-status');
        if (!pillEl) return;
        const labelEl = document.getElementById('portal-status-label');
        const dotEl   = document.getElementById('portal-status-dot');
        const valueEl = document.getElementById('portal-status-value');
        if (labelEl) labelEl.textContent = STATUS_LABEL_TEXT;
        if (valueEl) valueEl.textContent = STATUS_VALUE_TEXT;
        pillEl.classList.add('status-label-done');
        pillEl.classList.add('border-draw');
        if (dotEl)   dotEl.classList.add('visible');
        if (valueEl) valueEl.classList.add('visible');
    }
    /* ── Header stream-in ─────────────────────────── */
    // Breakpoint crossing after load. Until the header streams have finished the
    // switch is only noted, so an in-progress stream is never rewritten under
    // itself; it is applied the moment the hint (the last header stream)
    // completes. After that the final strings are swapped directly.
    let headerSettled = false, headerSwitchPending = false;
    function applyHeaderText() {
        const titleEl   = document.getElementById('portal-title');
        const eyebrowEl = document.getElementById('portal-eyebrow');
        const introTextEl = document.getElementById('portal-intro-text');
        if (titleEl)     titleEl.textContent     = titleText();
        if (eyebrowEl)   eyebrowEl.textContent   = eyebrowText();
        if (introTextEl) introTextEl.textContent = introText();
    }
    function settleHeader() {
        headerSettled = true;
        if (headerSwitchPending) { headerSwitchPending = false; applyHeaderText(); }
    }
    function onHeaderBreakpoint() {
        if (headerSettled) applyHeaderText(); else headerSwitchPending = true;
    }
    [NARROW_HEADER_MQ, HINT_BREAK_MQ].forEach(mq => {
        if (mq.addEventListener) mq.addEventListener('change', onHeaderBreakpoint);
        else if (mq.addListener)  mq.addListener(onHeaderBreakpoint);
    });
    function initHeader() {
        const titleEl   = document.getElementById('portal-title');
        const eyebrowEl = document.getElementById('portal-eyebrow');
        const introEl   = document.getElementById('portal-intro');
        const introTextEl = document.getElementById('portal-intro-text');
        if (reducedMotion) {
            if (titleEl)     titleEl.textContent     = titleText();
            if (eyebrowEl)   eyebrowEl.textContent   = eyebrowText();
            if (introTextEl) introTextEl.textContent = introText();
            if (introEl)     introEl.classList.add('intro-live');
            settleHeader();
            showStatusInstant();
            materializeCards();
            revealFooter();
            return;
        }
        // H1 (A5p): title -> beat -> eyebrow -> the same beat -> hint -> status and
        // cards. The hint starts only when the eyebrow has finished.
        streamText(titleEl, titleText(), NAME_DELAY, () => {
            setTimeout(() => {
                streamText(eyebrowEl, eyebrowText(), FAST_DELAY, () => {
                    setTimeout(() => {
                        if (introEl) introEl.classList.add('intro-live');
                        streamText(introTextEl, introText(), FAST_DELAY, () => {
                            settleHeader();
                            setTimeout(() => {
                                streamStatus();
                                const cardsSpan = materializeCards();
                                // Trails the last card rather than a fixed 980ms.
                                setTimeout(revealFooter, cardsSpan + POST_CARDS_GAP);
                            }, 120);
                        });
                    }, POST_EYEBROW_PAUSE);
                });
            }, POST_NAME_PAUSE);
        });
    }
    /* ── Card materialization ────────────────────── */
    // The footer must trail the LAST card, not a fixed delay. With a
    // hardcoded 980ms wait the hint landed 780ms BEFORE the final card at nine
    // cards, and the gap widens with every card added (1446ms at twelve).
    // Derive the wait from the same constant that drives the stagger, and
    // retune the stagger so twelve cards span what nine used to.
    const CARD_STAGGER   = 160; // ms between each card
    const POST_CARDS_GAP = 220; // ms after the last card before the footer
    function materializeCards() {
        const wraps = document.querySelectorAll('.active-card-wrap');
        wraps.forEach(function(wrap, i) {
            setTimeout(function() {
                wrap.classList.add('card-materialized');
            }, i * CARD_STAGGER);
        });
        return wraps.length ? (wraps.length - 1) * CARD_STAGGER : 0;
    }
    /* ── Footer sequential reveal ─────────────────── */
    // D2: the footer hint is gone (the hint is the header intro), so the footer no
    // longer waits for a hint stream; it starts POST_CARDS_GAP after the last card.
    const FOOTER_ITEMS   = ['footer-item-0','footer-div-0','footer-item-1','footer-div-1','footer-item-2','footer-div-2','footer-item-3'];
    const ITEM_STAGGER   = 120; // ms between each footer item reveal
    function revealFooter() {
        const footerEl = document.querySelector('.projects-footer');
        // Reveal footer border with first item
        if (footerEl) footerEl.classList.add('footer-visible');
        if (reducedMotion) {
            FOOTER_ITEMS.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('item-visible');
            });
            return;
        }
        // Reveal footer items sequentially
        FOOTER_ITEMS.forEach((id, i) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.classList.add('item-visible');
            }, i * ITEM_STAGGER);
        });
    }
    /* ── Glitch engine — ported from card.js ─────── */
    const card = document.getElementById('card-orthanc');
    function fireGlitch() {
        if (!card || reducedMotion) return;
        card.classList.add('is-glitching');
        setTimeout(() => card.classList.remove('is-glitching'), 240);
    }
    let glitchTimer;
    function scheduleGlitch() {
        clearTimeout(glitchTimer);
        glitchTimer = setTimeout(() => {
            fireGlitch();
            scheduleGlitch();
        }, 2800 + Math.random() * 3600);
    }
    /* ── Description + CTA reveal on hover ───────── */
    const descEl    = document.getElementById('orthanc-desc');
    const btnEl     = document.getElementById('orthanc-btn');
    const cfDescEl  = document.getElementById('cloudflare-desc');
    const cfBtnEl   = document.getElementById('cloudflare-btn');
    const awsDescEl = document.getElementById('aws-desc');
    const awsBtnEl  = document.getElementById('aws-btn');
    const CF_DESC_TEXT  = 'Cloudflare edge platform with global load balancing, DNS management, WAF, security rules, analytics, and operational notifications. Built to ensure high availability and performance for ryanvalera.com.';
    const AWS_DESC_TEXT = 'Independent reliability layer for DNS, DNSSEC, and TLS certificate monitoring with tiered alerting, structured runbooks, and event-driven validation workflows on AWS serverless architecture.';
    reserveDescription(descEl, DESC_TEXT);
    reserveDescription(cfDescEl, CF_DESC_TEXT);
    reserveDescription(awsDescEl, AWS_DESC_TEXT);
    let descTimer     = null;
    let hoverDelay    = null;
    let cfDescTimer   = null;
    let cfHoverDelay  = null;
    let awsDescTimer  = null;
    let awsHoverDelay = null;
    function streamDesc() {
        if (!descEl) return;
        descEl.textContent = '';
        descTimer = streamText(descEl, DESC_TEXT, FAST_DELAY);
    }
    function clearDesc() {
        if (descTimer) clearInterval(descTimer);
        // Delay text clear until after CSS color fade-out (350ms transition)
        setTimeout(() => {
            if (descEl) descEl.textContent = '';
        }, 380);
    }
    function revealCTA() {
        if (!btnEl) return;
        btnEl.style.opacity = '1';
        btnEl.style.pointerEvents = 'auto';
    }
    function hideCTA() {
        if (!btnEl) return;
        btnEl.style.opacity = '0';
        btnEl.style.pointerEvents = 'none';
    }
    if (card) {
        card.addEventListener('mouseenter', () => {
            hoverDelay = setTimeout(() => {
                if (!reducedMotion) {
                    streamDesc();
                } else {
                    if (descEl) descEl.textContent = DESC_TEXT;
                }
                revealCTA();
            }, 220);
        });
        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverDelay);
            clearDesc();
            hideCTA();
        });
        card.addEventListener('focusin', () => {
            if (descEl) descEl.textContent = DESC_TEXT;
            revealCTA();
        });
        card.addEventListener('focusout', () => {
            clearDesc();
            hideCTA();
        });
    }
    /* ── Cloudflare card hover ────────────────────── */
    const cfCard = document.getElementById('card-cloudflare');
    function streamCfDesc() {
        if (!cfDescEl) return;
        cfDescEl.textContent = '';
        cfDescTimer = streamText(cfDescEl, CF_DESC_TEXT, FAST_DELAY);
    }
    function clearCfDesc() {
        if (cfDescTimer) clearInterval(cfDescTimer);
        setTimeout(() => { if (cfDescEl) cfDescEl.textContent = ''; }, 380);
    }
    function revealCfCTA() {
        if (!cfBtnEl) return;
        cfBtnEl.style.opacity = '1';
        cfBtnEl.style.pointerEvents = 'auto';
    }
    function hideCfCTA() {
        if (!cfBtnEl) return;
        cfBtnEl.style.opacity = '0';
        cfBtnEl.style.pointerEvents = 'none';
    }
    if (cfCard) {
        cfCard.addEventListener('mouseenter', () => {
            cfHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamCfDesc();
                else if (cfDescEl) cfDescEl.textContent = CF_DESC_TEXT;
                revealCfCTA();
            }, 220);
        });
        cfCard.addEventListener('mouseleave', () => {
            clearTimeout(cfHoverDelay);
            clearCfDesc();
            hideCfCTA();
        });
        cfCard.addEventListener('focusin', () => {
            if (cfDescEl) cfDescEl.textContent = CF_DESC_TEXT;
            revealCfCTA();
        });
        cfCard.addEventListener('focusout', () => {
            clearCfDesc();
            hideCfCTA();
        });
    }
    /* ── AWS card hover ───────────────────────────── */
    const awsCard = document.getElementById('card-aws');
    function streamAwsDesc() {
        if (!awsDescEl) return;
        awsDescEl.textContent = '';
        awsDescTimer = streamText(awsDescEl, AWS_DESC_TEXT, FAST_DELAY);
    }
    function clearAwsDesc() {
        if (awsDescTimer) clearInterval(awsDescTimer);
        setTimeout(() => { if (awsDescEl) awsDescEl.textContent = ''; }, 380);
    }
    function revealAwsCTA() {
        if (!awsBtnEl) return;
        awsBtnEl.style.opacity = '1';
        awsBtnEl.style.pointerEvents = 'auto';
    }
    function hideAwsCTA() {
        if (!awsBtnEl) return;
        awsBtnEl.style.opacity = '0';
        awsBtnEl.style.pointerEvents = 'none';
    }
    if (awsCard) {
        awsCard.addEventListener('mouseenter', () => {
            awsHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamAwsDesc();
                else if (awsDescEl) awsDescEl.textContent = AWS_DESC_TEXT;
                revealAwsCTA();
            }, 220);
        });
        awsCard.addEventListener('mouseleave', () => {
            clearTimeout(awsHoverDelay);
            clearAwsDesc();
            hideAwsCTA();
        });
        awsCard.addEventListener('focusin', () => {
            if (awsDescEl) awsDescEl.textContent = AWS_DESC_TEXT;
            revealAwsCTA();
        });
        awsCard.addEventListener('focusout', () => {
            clearAwsDesc();
            hideAwsCTA();
        });
    }
    /* ── FastAPI card hover ───────────────────────── */
    const fastapiCard    = document.getElementById('card-fastapi');
    const fastapiDescEl  = document.getElementById('fastapi-desc');
    const fastapiBtnEl   = document.getElementById('fastapi-btn');
    const FASTAPI_DESC_TEXT = 'Metadata-only file triage and orchestration API: streaming SHA-256 intake with dedupe, an enforced Queued → Running → Complete | Failed analysis state machine, 202-and-poll lifecycle endpoints, and verdict gating. FastAPI, SQLAlchemy 2.x, Pydantic v2, SQLite, pytest.';
    reserveDescription(fastapiDescEl, FASTAPI_DESC_TEXT);
    let fastapiDescTimer  = null;
    let fastapiHoverDelay = null;
    function streamFastapiDesc() {
        if (!fastapiDescEl) return;
        fastapiDescEl.textContent = '';
        fastapiDescTimer = streamText(fastapiDescEl, FASTAPI_DESC_TEXT, FAST_DELAY);
    }
    function clearFastapiDesc() {
        if (fastapiDescTimer) clearInterval(fastapiDescTimer);
        setTimeout(() => { if (fastapiDescEl) fastapiDescEl.textContent = ''; }, 380);
    }
    function revealFastapiCTA() {
        if (!fastapiBtnEl) return;
        fastapiBtnEl.style.opacity = '1';
        fastapiBtnEl.style.pointerEvents = 'auto';
    }
    function hideFastapiCTA() {
        if (!fastapiBtnEl) return;
        fastapiBtnEl.style.opacity = '0';
        fastapiBtnEl.style.pointerEvents = 'none';
    }
    if (fastapiCard) {
        fastapiCard.addEventListener('mouseenter', () => {
            fastapiHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamFastapiDesc();
                else if (fastapiDescEl) fastapiDescEl.textContent = FASTAPI_DESC_TEXT;
                revealFastapiCTA();
            }, 220);
        });
        fastapiCard.addEventListener('mouseleave', () => {
            clearTimeout(fastapiHoverDelay);
            clearFastapiDesc();
            hideFastapiCTA();
        });
        fastapiCard.addEventListener('focusin', () => {
            if (fastapiDescEl) fastapiDescEl.textContent = FASTAPI_DESC_TEXT;
            revealFastapiCTA();
        });
        fastapiCard.addEventListener('focusout', () => {
            clearFastapiDesc();
            hideFastapiCTA();
        });
    }
    /* ── AI Engineering Validation Platform card hover ── */
    const aivpCard   = document.getElementById('card-aivp');
    const aivpDescEl = document.getElementById('aivp-desc');
    const aivpBtnEl  = document.getElementById('aivp-btn');
    const AIVP_DESC_TEXT = 'Multi-model AI engineering platform that generates, validates, and iteratively refines technical artifacts — infrastructure code, documentation, and architecture — through structured Builder/Validator collaboration with transparent review scoring.';
    reserveDescription(aivpDescEl, AIVP_DESC_TEXT);
    let aivpDescTimer  = null;
    let aivpHoverDelay = null;
    function streamAivpDesc() {
        if (!aivpDescEl) return;
        aivpDescEl.textContent = '';
        aivpDescTimer = streamText(aivpDescEl, AIVP_DESC_TEXT, FAST_DELAY);
    }
    function clearAivpDesc() {
        if (aivpDescTimer) clearInterval(aivpDescTimer);
        setTimeout(() => { if (aivpDescEl) aivpDescEl.textContent = ''; }, 380);
    }
    function revealAivpCTA() {
        if (!aivpBtnEl) return;
        aivpBtnEl.style.opacity = '1';
        aivpBtnEl.style.pointerEvents = 'auto';
    }
    function hideAivpCTA() {
        if (!aivpBtnEl) return;
        aivpBtnEl.style.opacity = '0';
        aivpBtnEl.style.pointerEvents = 'none';
    }
    if (aivpCard) {
        aivpCard.addEventListener('mouseenter', () => {
            aivpHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamAivpDesc();
                else if (aivpDescEl) aivpDescEl.textContent = AIVP_DESC_TEXT;
                revealAivpCTA();
            }, 220);
        });
        aivpCard.addEventListener('mouseleave', () => {
            clearTimeout(aivpHoverDelay);
            clearAivpDesc();
            hideAivpCTA();
        });
        aivpCard.addEventListener('focusin', () => {
            if (aivpDescEl) aivpDescEl.textContent = AIVP_DESC_TEXT;
            revealAivpCTA();
        });
        aivpCard.addEventListener('focusout', () => {
            clearAivpDesc();
            hideAivpCTA();
        });
    }
    /* ── Cybersecurity Investigations card hover ── */
    const cyberCard    = document.getElementById('card-cyber');
    const cyberDescEl  = document.getElementById('cyber-desc');
    const cyberBtnEl   = document.getElementById('cyber-btn');
    const CYBER_DESC_TEXT = 'Blue-team DFIR portfolio documenting SOC investigations across CyberDefenders, Hack The Box, and SANS CyberRange — investigations spanning Splunk, Elastic, and Microsoft Sentinel with threat hunting, memory, disk, and network forensics, timeline reconstruction, and MITRE ATT&CK mapping.';
    reserveDescription(cyberDescEl, CYBER_DESC_TEXT);
    let cyberDescTimer  = null;
    let cyberHoverDelay = null;
    function streamCyberDesc() {
        if (!cyberDescEl) return;
        cyberDescEl.textContent = '';
        cyberDescTimer = streamText(cyberDescEl, CYBER_DESC_TEXT, FAST_DELAY);
    }
    function clearCyberDesc() {
        if (cyberDescTimer) clearInterval(cyberDescTimer);
        setTimeout(() => { if (cyberDescEl) cyberDescEl.textContent = ''; }, 380);
    }
    function revealCyberCTA() {
        if (!cyberBtnEl) return;
        cyberBtnEl.style.opacity = '1';
        cyberBtnEl.style.pointerEvents = 'auto';
    }
    function hideCyberCTA() {
        if (!cyberBtnEl) return;
        cyberBtnEl.style.opacity = '0';
        cyberBtnEl.style.pointerEvents = 'none';
    }
    if (cyberCard) {
        cyberCard.addEventListener('mouseenter', () => {
            cyberHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamCyberDesc();
                else if (cyberDescEl) cyberDescEl.textContent = CYBER_DESC_TEXT;
                revealCyberCTA();
            }, 220);
        });
        cyberCard.addEventListener('mouseleave', () => {
            clearTimeout(cyberHoverDelay);
            clearCyberDesc();
            hideCyberCTA();
        });
        cyberCard.addEventListener('focusin', () => {
            if (cyberDescEl) cyberDescEl.textContent = CYBER_DESC_TEXT;
            revealCyberCTA();
        });
        cyberCard.addEventListener('focusout', () => {
            clearCyberDesc();
            hideCyberCTA();
        });
    }
    /* ── Microsoft Sentinel & Defender XDR card hover ── */
    const sentinelCard    = document.getElementById('card-sentinel');
    const sentinelDescEl  = document.getElementById('sentinel-desc');
    const sentinelBtnEl   = document.getElementById('sentinel-btn');
    const SENTINEL_DESC_TEXT = 'Microsoft security operations environment built end to end — endpoint onboarding through Defender for Endpoint, incident correlation in Defender XDR, and forwarding into a Microsoft Sentinel workspace. Detections and KQL hunting queries are committed artifacts; ATT&CK coverage counts only rules proven to fire.';
    reserveDescription(sentinelDescEl, SENTINEL_DESC_TEXT);
    let sentinelDescTimer  = null;
    let sentinelHoverDelay = null;
    function streamSentinelDesc() {
        if (!sentinelDescEl) return;
        sentinelDescEl.textContent = '';
        sentinelDescTimer = streamText(sentinelDescEl, SENTINEL_DESC_TEXT, FAST_DELAY);
    }
    function clearSentinelDesc() {
        if (sentinelDescTimer) clearInterval(sentinelDescTimer);
        setTimeout(() => { if (sentinelDescEl) sentinelDescEl.textContent = ''; }, 380);
    }
    function revealSentinelCTA() {
        if (!sentinelBtnEl) return;
        sentinelBtnEl.style.opacity = '1';
        sentinelBtnEl.style.pointerEvents = 'auto';
    }
    function hideSentinelCTA() {
        if (!sentinelBtnEl) return;
        sentinelBtnEl.style.opacity = '0';
        sentinelBtnEl.style.pointerEvents = 'none';
    }
    if (sentinelCard) {
        sentinelCard.addEventListener('mouseenter', () => {
            sentinelHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamSentinelDesc();
                else if (sentinelDescEl) sentinelDescEl.textContent = SENTINEL_DESC_TEXT;
                revealSentinelCTA();
            }, 220);
        });
        sentinelCard.addEventListener('mouseleave', () => {
            clearTimeout(sentinelHoverDelay);
            clearSentinelDesc();
            hideSentinelCTA();
        });
        sentinelCard.addEventListener('focusin', () => {
            if (sentinelDescEl) sentinelDescEl.textContent = SENTINEL_DESC_TEXT;
            revealSentinelCTA();
        });
        sentinelCard.addEventListener('focusout', () => {
            clearSentinelDesc();
            hideSentinelCTA();
        });
    }
    const pentestCard    = document.getElementById('card-pentest');
    const pentestDescEl  = document.getElementById('pentest-desc');
    const pentestBtnEl   = document.getElementById('pentest-btn');
    const PENTEST_DESC_TEXT = 'Authorized offensive exercises documented from a blue-team-first perspective. Each phase, from reconnaissance and enumeration through initial access and privilege escalation, is paired with its defensive lesson: the telemetry it generates, the detection opportunity, and the control that breaks the chain.';
    reserveDescription(pentestDescEl, PENTEST_DESC_TEXT);
    let pentestDescTimer  = null;
    let pentestHoverDelay = null;
    function streamPentestDesc() {
        if (!pentestDescEl) return;
        pentestDescEl.textContent = '';
        pentestDescTimer = streamText(pentestDescEl, PENTEST_DESC_TEXT, FAST_DELAY);
    }
    function clearPentestDesc() {
        if (pentestDescTimer) clearInterval(pentestDescTimer);
        setTimeout(() => { if (pentestDescEl) pentestDescEl.textContent = ''; }, 380);
    }
    function revealPentestCTA() {
        if (!pentestBtnEl) return;
        pentestBtnEl.style.opacity = '1';
        pentestBtnEl.style.pointerEvents = 'auto';
    }
    function hidePentestCTA() {
        if (!pentestBtnEl) return;
        pentestBtnEl.style.opacity = '0';
        pentestBtnEl.style.pointerEvents = 'none';
    }
    if (pentestCard) {
        pentestCard.addEventListener('mouseenter', () => {
            pentestHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamPentestDesc();
                else if (pentestDescEl) pentestDescEl.textContent = PENTEST_DESC_TEXT;
                revealPentestCTA();
            }, 220);
        });
        pentestCard.addEventListener('mouseleave', () => {
            clearTimeout(pentestHoverDelay);
            clearPentestDesc();
            hidePentestCTA();
        });
        pentestCard.addEventListener('focusin', () => {
            if (pentestDescEl) pentestDescEl.textContent = PENTEST_DESC_TEXT;
            revealPentestCTA();
        });
        pentestCard.addEventListener('focusout', () => {
            clearPentestDesc();
            hidePentestCTA();
        });
    }

    const linuxCard    = document.getElementById('card-linux');
    const linuxDescEl  = document.getElementById('linux-desc');
    const linuxBtnEl   = document.getElementById('linux-btn');
    const LINUX_DESC_TEXT = 'A growing Linux infrastructure and platform engineering portfolio focused on rebuilding production-adjacent services by hand, exposing the request paths, trust boundaries, and operational decisions normally hidden behind control panels.';
    reserveDescription(linuxDescEl, LINUX_DESC_TEXT);
    let linuxDescTimer  = null;
    let linuxHoverDelay = null;
    function streamLinuxDesc() {
        if (!linuxDescEl) return;
        linuxDescEl.textContent = '';
        linuxDescTimer = streamText(linuxDescEl, LINUX_DESC_TEXT, FAST_DELAY);
    }
    function clearLinuxDesc() {
        if (linuxDescTimer) clearInterval(linuxDescTimer);
        setTimeout(() => { if (linuxDescEl) linuxDescEl.textContent = ''; }, 380);
    }
    function revealLinuxCTA() {
        if (!linuxBtnEl) return;
        linuxBtnEl.style.opacity = '1';
        linuxBtnEl.style.pointerEvents = 'auto';
    }
    function hideLinuxCTA() {
        if (!linuxBtnEl) return;
        linuxBtnEl.style.opacity = '0';
        linuxBtnEl.style.pointerEvents = 'none';
    }
    if (linuxCard) {
        linuxCard.addEventListener('mouseenter', () => {
            linuxHoverDelay = setTimeout(() => {
                if (!reducedMotion) streamLinuxDesc();
                else if (linuxDescEl) linuxDescEl.textContent = LINUX_DESC_TEXT;
                revealLinuxCTA();
            }, 220);
        });
        linuxCard.addEventListener('mouseleave', () => {
            clearTimeout(linuxHoverDelay);
            clearLinuxDesc();
            hideLinuxCTA();
        });
        linuxCard.addEventListener('focusin', () => {
            if (linuxDescEl) linuxDescEl.textContent = LINUX_DESC_TEXT;
            revealLinuxCTA();
        });
        linuxCard.addEventListener('focusout', () => {
            clearLinuxDesc();
            hideLinuxCTA();
        });
    }

    /* ── Init ─────────────────────────────────────── */
    window.addEventListener('DOMContentLoaded', () => {
        initHeader();
        scheduleGlitch();
    });
})();
