/* Chatwoot support widget (inbox "Winvest — Website").
 * DEFAULT OFF. To turn support on for visitors, set ENABLED to true and deploy.
 * The website token is public (it only identifies the inbox). */
(function () {
  var ENABLED = false;
  if (!ENABLED) return;

  var BASE_URL = "https://support.suncoastservers.com";
  window.chatwootSettings = {
    hideMessageBubble: false,
    position: "right",
    locale: "en",
    type: "standard",
    launcherTitle: "Talk to a person"
  };
  var g = document.createElement("script");
  var s = document.getElementsByTagName("script")[0];
  g.src = BASE_URL + "/packs/js/sdk.js";
  g.async = true;
  s.parentNode.insertBefore(g, s);
  g.onload = function () {
    window.chatwootSDK.run({ websiteToken: "pFgakM7fp7zLchpFmdJVNC1h", baseUrl: BASE_URL });
  };
})();
