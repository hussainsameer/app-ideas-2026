# Deployment

## Live web version (Wix Headless, free tier)

- Live URL: https://headless-dopqpbgdxvc-hussainzsameer-140e.wix-site-host.com
- Wix dashboard: https://manage.wix.com/dashboard/9d5248a2-7682-4fac-becf-4ad31d84d482
- metaSiteId: `9d5248a2-7682-4fac-becf-4ad31d84d482` (needed to update the same site; never create a new one)
- Deployed 2026-11-02 from `app/` with one change: `index.html` loads jsPDF from cdnjs instead of `vendor/`, so the upload stays small.

Wix states Headless is free to start; a premium plan is only needed for payments, a custom domain or analytics. Do not connect a subdomain (e.g. stringart.thesameerhussain.com) unless you accept a plan upgrade on this site.

## Showing it on thesameerhussain.com

That site is built in the Wix Editor, which the API cannot edit. In the Editor: add a page, add Elements → Embed Code → Embed a site, paste the live URL, stretch to full width. Fallback if the embed stays blank: a button that links to the live URL.

## Updating

Re-run the upload with the changed files only, same metaSiteId. The Claude session that deployed it used the Wix MCP `UploadHeadlessWebsiteFiles` tool.

## thesameerhussain.com/string-art-maker

Done with a Wix Custom Embed on the main site (Editor site `bdbaad22-d0be-4c75-80f8-ecba8e898d87`), because the API cannot add pages to an Editor site.

- Custom embed ID: `6cad5671-69f9-43fd-8ce5-823de3400898`, position BODY_END, category ESSENTIAL, ~1 KB script.
- On the path `/string-art-maker` it overlays a full-screen iframe of the live app. The app posts `string-art-maker-ready` to its parent; if that message doesn't arrive within 8 s the script redirects to the app URL instead.
- Verified: the app host sends no X-Frame-Options / CSP, so framing is allowed. The page itself could not be fetched from the sandbox (403 to bots), so the first real check is in a browser.
- To remove: delete the custom embed (Wix Custom Embeds API or dashboard → Settings → Custom Code). Nothing else on the main site was changed.
- Note: the address answers as Wix's "page not found" to search engines; fine for a personal link, not for SEO.
