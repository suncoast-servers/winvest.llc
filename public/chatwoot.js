/**
 * Suncoast marketing sites — Chatwoot loader (AIO-style nudge + default-off gate).
 * Set window.CHATWOOT_CONFIG before this script runs.
 */
(function (window, document) {
  'use strict';

  var BASE = 'https://support.suncoastservers.com';
  var TYPING_CPS = 55;

  function cfg() {
    return window.CHATWOOT_CONFIG || {};
  }

  function typeText(el, text, done) {
    var i = 0;
    var started = performance.now();
    function tick(now) {
      var n = Math.min(text.length, Math.floor(((now - started) / 1000) * TYPING_CPS));
      if (n !== i) {
        i = n;
        el.textContent = text.slice(0, i);
      }
      if (i < text.length) requestAnimationFrame(tick);
      else if (done) done();
    }
    requestAnimationFrame(tick);
  }

  function injectStyles() {
    if (document.getElementById('suncoast-chat-polish-css')) return;
    var link = document.createElement('link');
    link.id = 'suncoast-chat-polish-css';
    link.rel = 'stylesheet';
    link.href = (cfg().polishCssUrl || '/chatwoot-polish.css');
    document.head.appendChild(link);
  }

  function showNudge() {
    var c = cfg();
    if (!c.showNudge || c.enabled) return;
    var lines = c.greetingLines || [
      'A person answers this chat, with AI as backup.',
      'Open the bubble when you are ready to talk to us.',
    ];
    var root = document.createElement('div');
    root.id = 'suncoast-chat-nudge';
    root.className = 'suncoast-chat-nudge';
    root.innerHTML =
      '<div class="suncoast-chat-nudge__card" role="status">' +
      '<p class="suncoast-chat-nudge__text"></p>' +
      '<button type="button" class="suncoast-chat-nudge__dismiss" aria-label="Dismiss">×</button>' +
      '</div>';
    document.body.appendChild(root);
    var textEl = root.querySelector('.suncoast-chat-nudge__text');
    var line = 0;
    function next() {
      if (line >= lines.length) return;
      typeText(textEl, lines[line], function () {
        line += 1;
        if (line < lines.length) window.setTimeout(next, 400);
      });
    }
    next();
    root.querySelector('.suncoast-chat-nudge__dismiss').onclick = function (e) {
      e.stopPropagation();
      root.remove();
    };
    root.querySelector('.suncoast-chat-nudge__card').onclick = function () {
      root.remove();
      if (c.websiteToken) {
        c.enabled = true;
        boot();
      }
    };
    window.setTimeout(function () {
      if (document.getElementById('suncoast-chat-nudge')) root.remove();
    }, 12000);
  }

  function boot() {
    var c = cfg();
    if (!c.enabled || !c.websiteToken || !c.baseUrl) return;
    if (document.querySelector('script[data-suncoast-chatwoot]')) return;

    window.chatwootSettings = Object.assign(
      {
        position: 'right',
        type: 'standard',
        launcherTitle: c.launcherTitle || 'Talk to a person',
        widgetColor: c.widgetColor || '#0d9488',
      },
      c.settings || {}
    );

    var base = (c.baseUrl || BASE).replace(/\/$/, '');
    var script = document.createElement('script');
    script.dataset.suncoastChatwoot = '1';
    script.src = base + (c.sdkPath || '/packs/js/sdk.js');
    script.async = true;
    script.defer = true;
    if (c.sdkType) script.type = c.sdkType;

    script.onload = function () {
      var tries = 0;
      var timer = setInterval(function () {
        if (window.chatwootSDK && window.chatwootSDK.run) {
          clearInterval(timer);
          window.chatwootSDK.run({ websiteToken: c.websiteToken, baseUrl: base });
        } else if (++tries > 50) clearInterval(timer);
      }, 100);
    };
    document.head.appendChild(script);
  }

  injectStyles();
  if (cfg().enabled) boot();
  else if (cfg().showNudge !== false) window.setTimeout(showNudge, 2500);
})(window, document);