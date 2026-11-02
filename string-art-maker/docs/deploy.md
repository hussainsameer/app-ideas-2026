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
