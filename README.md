# Winvest

This site was created for Winvest.

The source, design, and assets are proprietary. See [LICENSE](LICENSE). Do not copy them without permission.

Contact: [info@winvest.llc](mailto:info@winvest.llc)

## Chatwoot support widget (issue #5)

Optional live chat to the Suncoast Servers Chatwoot on `index.html`, `privacy/index.html` and
`404.html`. **Default is off** — the pages ship `enabled: false` with no token, so nothing
customer-visible loads until it is switched on.

| Part | File |
|---|---|
| Loader (nudge, style inject, SDK boot) | `public/chatwoot.js` |
| Page config (launcher "Chat with Winvest", colour `#1e3a5f`) | inline `window.CHATWOOT_CONFIG` before `</body>` |
| Styles | `public/chatwoot-polish.css` |
| Runtime switch | `functions/_middleware.js` |

### Turning it on / off

This is a Cloudflare Pages site (`wrangler.jsonc`, output `public/`), so the switch is an
environment variable, not a code change.

Cloudflare dashboard → Workers & Pages → `winvest` → Settings → Environment variables:

```text
CHATWOOT_ENABLED=1
CHATWOOT_WEBSITE_TOKEN=<token from the Chatwoot VPS, inbox "Winvest — Website">
CHATWOOT_BASE_URL=https://support.suncoastservers.com   # optional, this is the default
```

The middleware injects `window.CHATWOOT_CONFIG` before `/chatwoot.js` on HTML responses only,
marks them `no-store`, and does nothing at all when the vars are unset. Set them on
**Preview** first, check it, then on **Production**. To switch support off again, delete or
unset `CHATWOOT_ENABLED` and redeploy — no HTML edit.

Asset paths are root-relative (`/chatwoot.js`, `/chatwoot-polish.css`) because Cloudflare Pages
serves `public/` as the site root. Do not prefix them with `/public/`.

### Verify

```bash
curl -s https://winvest.llc/ | grep -c 'websiteToken'   # 2 when on (default + injected)
curl -sI https://winvest.llc/chatwoot.js | head -1      # 200
```

Browser: launcher **Chat with Winvest** → send a message → it must land in the Chatwoot
**Winvest — Website** inbox with `brand-winvest` + `channel-widget`.

### Compliance note

Winvest is a regulated-finance brand (Reg CF / Reg A+). The widget copy is deliberately
generic — a person answers, AI is backup — and contains **no investment advice, no offer, no
performance claims**. Keep the flag off until Ryan/legal approve the Help Center articles for
this brand (they are still drafts) and review the greeting lines. Any customer-facing copy
change must be re-reviewed before the flag is flipped.

Tokens are exported/rotated on the Chatwoot VPS: `docs/widget-tokens.md` in
`suncoast-servers/SuncoastServersChatwoot`. Never commit them.
