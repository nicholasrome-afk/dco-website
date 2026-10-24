# Pre-launch check (23 October 2026)

Short check before moving dco-oo.org to Cloudflare. Run against the `phase-1-migration` preview
(https://phase-1-migration-dco-website.nicholas-rome.workers.dev) at commit 22793df, plus the fixes listed below.

## Result: ready for Phase 5

| Check                                                               | Result                                                                              |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Email records                                                       | No email on the domain. Two anti-spoofing TXT records must be copied (see DNS list) |
| Old URLs (4 on the old site)                                        | All load or redirect. Fixed: `/home/`, `/cart` and `/sitemap.xml` (were 404)        |
| Internal links (13 pages)                                           | 0 broken                                                                            |
| External links (56)                                                 | All live. 4 sites block automated checks; see "Check by hand"                       |
| Accessibility (axe, WCAG 2.2 AA + best practice, desktop and phone) | 0 violations after one fix (utility bar now a labelled landmark)                    |
| Robots / indexing                                                   | Previews: `noindex, nofollow`. `main` build: `index, follow`                        |
| Sitemap, robots.txt, RSS                                            | Present; sitemap lists all 13 pages at `https://www.dco-oo.org`                     |
| Canonical and social image                                          | Canonical URLs use `https://www.dco-oo.org`; social image served (1200×630)         |
| 404 page                                                            | Returns a real 404 status                                                           |
| DNSSEC                                                              | Off, so nameservers can change without extra steps                                  |

## DNS record list for Cloudflare (Path A: move DNS only)

Current nameservers: `ns-cloud-d1…d4.googledomains.com` (Squarespace Domains). Registrar: Squarespace Domains.

| Type  | Name             | Value                                                | Action at cutover                            |
| ----- | ---------------- | ---------------------------------------------------- | -------------------------------------------- |
| A ×4  | `dco-oo.org`     | 198.185.159.144/145, 198.49.23.144/145 (Squarespace) | Delete; replaced by the Worker custom domain |
| CNAME | `www`            | `ext-sq.squarespace.com`                             | Delete; replaced by the Worker custom domain |
| TXT   | `dco-oo.org`     | `v=spf1 -all`                                        | **Keep** (says the domain sends no email)    |
| TXT   | `_dmarc`         | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s`     | **Keep** (rejects mail spoofing the domain)  |
| TXT   | `_domainkey`     | `v=DKIM1; p=`                                        | **Keep** (empty DKIM key: no mail is signed) |
| CNAME | `_domainconnect` | `_domainconnect.domains.squarespace.com`             | Drop (Squarespace setup helper only)         |
| MX    | none             |                                                      | None exist; nothing to copy                  |

Public DNS only shows names that are asked for, so compare this list with the DNS panel at
Squarespace Domains before changing nameservers. Anything there that isn't listed above should be copied.

The canonical address is `https://www.dco-oo.org` (the old site also redirects the bare domain to `www`).
At launch, attach both `www.dco-oo.org` and `dco-oo.org` to the Worker, and redirect the bare domain to `www`.

## Check by hand (one click each)

These sites block automated checkers, so confirm each opens in a normal browser:

- https://mae.dosits.org/ (OD-MAE programme card): blocked even headless Chrome
- https://oceandecade.org/, https://marinelife2030.org/, https://www.onedeepocean.org/: loaded in Chrome behind bot protection

## Not covered (after launch)

- Analytics: none configured. Cloudflare Web Analytics can be switched on in the dashboard after launch (no cookies, no code change).
- The homepage hero text sits on the map image, which axe can't measure. It was checked visually: the text is on the dark left side of the map.
- Full Phase 4 QA report (Lighthouse, performance) and the CMS (Phase 6).
- Calendar files link to `https://www.dco-oo.org/blueprint`, which only works once the domain points here.
