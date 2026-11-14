/* Chatwoot website widget — disabled by default.
 *
 * To turn it on for this site:
 *   1. Create the Chatwoot inbox "Winvest — Website".
 *   2. Copy its website token into `websiteToken` below.
 *   3. Set `enabled: true`.
 *
 * Nothing loads (and no request is made) while `enabled` is false.
 *
 * Local testing against a development Chatwoot (Mixin): set
 *   sdkPath: "/vite-dev/entrypoints/sdk.js", sdkType: "module"
 * Production keeps the defaults below.
 */
window.CHATWOOT_CONFIG = window.CHATWOOT_CONFIG || {
  enabled: false,
  baseUrl: "https://support.suncoastservers.com",
  websiteToken: "",
  sdkPath: "/packs/js/sdk.js",
  settings: {
    position: "right",
    type: "standard",
    launcherTitle: "Chat with us"
  }
};

(function () {
  var cfg = window.CHATWOOT_CONFIG;
  if (!cfg || !cfg.enabled || !cfg.websiteToken || !cfg.baseUrl) return;

  window.chatwootSettings = cfg.settings || { position: "right", type: "standard" };

  var base = cfg.baseUrl.replace(/\/$/, "");
  var script = document.createElement("script");
  script.src = base + (cfg.sdkPath || "/packs/js/sdk.js");
  script.async = true;
  script.defer = true;
  if (cfg.sdkType) script.type = cfg.sdkType;

  script.onload = function () {
    var tries = 0;
    var timer = setInterval(function () {
      if (window.chatwootSDK && window.chatwootSDK.run) {
        clearInterval(timer);
        window.chatwootSDK.run({ websiteToken: cfg.websiteToken, baseUrl: base });
      } else if (++tries > 50) {
        clearInterval(timer);
      }
    }, 100);
  };

  document.head.appendChild(script);
})();
