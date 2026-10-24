# DCO Website Rebuild: Project Brief

Handoff document for Claude Code. Summarizes all planning decisions, recommendations, and open questions for migrating the organization's website off Squarespace.

**Suggested use:** Save this file as `docs/PROJECT_BRIEF.md` in the repo, then add the line `@docs/PROJECT_BRIEF.md` to the existing `CLAUDE.md` so Claude Code reads it every session. Do not replace the theme's included `CLAUDE.md` or `AGENTS.md`.

---

## 1. Project overview

- **Organization:** Non-governmental organization associated with the United Nations
- **Site type:** Informational (no store, no member areas)
- **Current platform:** Squarespace
- **Reason for migration:** More flexibility in updating and designing the site
- **Primary goals:**
  1. Easy to update
  2. Share information effectively
  3. Slick, polished, professional look

## 2. Decisions made

| Item                | Decision                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Build tool          | Claude Code                                                                                 |
| Code hosting        | GitHub                                                                                      |
| Web hosting and DNS | Cloudflare                                                                                  |
| Domain              | Owned by the organization                                                                   |
| Framework           | Astro                                                                                       |
| Theme               | [AstroWind](https://github.com/arthelokyo/astrowind) (Astro + Tailwind CSS v4, MIT license) |
| Repository          | `nicholasrome-afk/dco-website` (created from the AstroWind template)                        |

## 3. Open decisions

- [ ] **Multilingual or not?** Decide before building. Adding languages later means restructuring every page and URL.
- [ ] **CMS choice** (see Section 6)
- [ ] **AstroWind v1 or v2?** v1 is in maintenance mode; v2 was planned for October 2026. If v2 is released, consider starting from it.
- [ ] **Codex as PR reviewer?** Optional (see Section 11)
- [ ] **Domain: move DNS only, or also transfer the registrar to Cloudflare?** (see Section 9)
- [ ] **Working environment:** Claude Desktop Code tab (recommended for the build) or Claude Code on the web

## 4. Local setup

**Requirements:** Node.js 22.22.3 or newer (see `.nvmrc`).

**No-terminal setup (recommended):**

1. Install GitHub Desktop, sign in, and clone `dco-website` (File → Clone Repository).
2. Install Node.js from nodejs.org.
3. Open the Claude desktop app, go to the Code tab, and select the `dco-website` folder.
4. Ask Claude to install dependencies and start the dev server.

**Terminal setup (alternative):**

```bash
git clone https://github.com/nicholasrome-afk/dco-website.git
cd dco-website
npm install
npm run dev     # preview at localhost:4321
claude          # start Claude Code in a second terminal
```

**Key AstroWind files:**

- `src/config.yaml`: site name, URL, SEO defaults, blog settings, analytics
- `src/components/CustomStyles.astro`: colors (light and dark CSS variables)
- `src/assets/styles/tailwind.css`: Tailwind theme tokens and utilities
- `astro.config.ts`: fonts
- `src/data/post/`: blog posts (`.md` or `.mdx`)
- `src/components/widgets/`: 30+ reusable page sections
- `.agents/skills/`: step-by-step skills for common tasks (including `use-widgets.md`)

## 5. Content model

Build these as Astro content collections so editors fill in fields (title, date, summary, image, attachments) instead of designing pages:

| Collection              | Contents                                                         |
| ----------------------- | ---------------------------------------------------------------- |
| **News and statements** | Updates, positions, press releases                               |
| **Events**              | Conferences, side events, webinars, with "add to calendar" links |
| **Publications**        | Reports, briefs, PDF submissions, filterable by year and topic   |
| **People**              | Board, staff, partners                                           |
| **Static pages**        | Mission, history, UN relationship, Get Involved, Contact         |

**Information-sharing features:**

- Site search with **Pagefind** (static, free)
- **RSS feed** (AstroWind includes one for the blog)
- Auto-generated **social share (Open Graph) images**
- **Newsletter signup** (Buttondown, Mailchimp, or Brevo)
- **Form replacement** for Squarespace forms (Formspree, Web3Forms, or Cloudflare Turnstile with a Worker)
- **Analytics** (Cloudflare Web Analytics is free)

## 6. CMS options (for easy updating)

All are free and store content in the GitHub repo, so there is no lock-in. Add the CMS after the build and content are stable.

| CMS           | Editing experience                                | Best when                                             |
| ------------- | ------------------------------------------------- | ----------------------------------------------------- |
| **Keystatic** | Clean forms and rich-text editor, built for Astro | Most polished admin with least setup                  |
| **TinaCMS**   | Live visual editing on the page                   | Several non-technical editors; closest to Squarespace |
| **Pages CMS** | Simple forms, no code added to the site           | Few editors, minimal maintenance                      |

Note: Keystatic (GitHub mode) and Pages CMS require editors to have GitHub accounts. TinaCMS's cloud service handles accounts itself.

## 7. Design direction

- **Tone:** Editorial, authoritative, accessible. Generous white space, restrained color, strong typography.
- **Reference sites:** Screenshot 3 to 5 sites (respected international NGOs or think tanks) into `/reference`.
- **Process:**
  1. Define design rules (fonts, palette, spacing, photo style) in `CLAUDE.md` first.
  2. Restyle AstroWind's components before building pages: hero, news card, publication card, event listing, quote block.
  3. Refine the homepage and one inner page; the rest inherits the style.
  4. Give feedback using screenshots rather than descriptions.
- **Photography:** Use real photos of the organization's work. Avoid stock-photo clichés.
- **Avoid** closely mimicking UN blue or UN visual identity.

## 8. Sector-specific requirements

- **UN emblem and name:** NGOs generally cannot use the UN emblem or imply UN endorsement without authorization. Describe status precisely (for example, "in Special Consultative Status with ECOSOC"). Build this wording as a **single reusable component** so it stays accurate everywhere.
- **Accessibility:** Target **WCAG 2.2 AA**. Run axe and Lighthouse checks as part of QA.
- **Global performance:** Many readers may be on slow connections. Use Astro image optimization; keep heavy video and animation to a minimum.

## 9. Migration and launch steps

### Step 1: Extract content from Squarespace (before touching DNS)

- Export via Settings → Import & Export (WordPress XML; covers pages and blog posts only).
- Download all images at full resolution (export only links to Squarespace's CDN, which disappears on cancellation).
- Record every URL from `/sitemap.xml`.
- Screenshot each page for reference.
- List integrations: forms, analytics, newsletter, embeds, scheduling tools.
- Alternatively, have Claude Code crawl the site with **Playwright MCP**.

### Step 2: Build

- Start in **plan mode**. Approve the plan before building.
- Build in approval gates: plan → design direction → full build → QA report → deploy.
- Generate a **redirect map** from old Squarespace URLs (for example, `/blog/post-name`) to new URLs.
- Add meta tags, sitemap, and Open Graph images (AstroWind includes most of this).

### Step 3: Deploy to Cloudflare

- AstroWind's `wrangler.jsonc` already targets Cloudflare Workers with static assets (no adapter needed).
- Cloudflare dashboard → Workers & Pages → Create → Import from GitHub → select `dco-website`.
- Every push to `main` deploys to production; other branches get preview URLs.

### Step 4: Domain cutover

**Path A: Move DNS only (faster, lower risk)**

1. Add the domain to Cloudflare; it scans existing records.
2. **Confirm email records copied over: MX, SPF, DKIM, and DMARC.** Missing records silently break email.
3. Change nameservers at the current registrar to Cloudflare's.
4. Attach the domain to the Cloudflare project as a custom domain.

**Path B: Also transfer the registrar to Cloudflare (cheaper long-term)**

1. Complete Path A first.
2. Unlock the domain at Squarespace Domains and get the authorization code.
3. Start the transfer in Cloudflare Registrar. Domains registered or transferred in the last 60 days can't move yet.

### Step 5: Launch checklist

- [ ] Every old URL loads or redirects correctly
- [ ] Email sends and receives
- [ ] Forms submit
- [ ] Analytics installed
- [ ] Sitemap submitted to Google Search Console
- [ ] Accessibility and Lighthouse audits pass
- [ ] Squarespace kept live 1 to 2 weeks before canceling

## 10. Kickoff prompt for Claude Code

> Read CLAUDE.md, docs/PROJECT_BRIEF.md, and /reference. This is an informational NGO site in consultative status with the UN, built on the AstroWind theme. Using Playwright, crawl [OLD SITE URL], migrate all text and images, and create content collections for news, events, publications, and people. Restyle the theme to match the reference screenshots: editorial, authoritative, and accessible (WCAG 2.2 AA). Generate a redirect map from old URLs. Show me the plan first and wait for my approval.

## 11. Optional: agents and automation

**Recommendation:** A single Claude Code session is fastest for a site this size. Add the following only if useful.

**Subagents** (Markdown files in `.claude/agents/`):

1. **migrator:** crawls old site, extracts content, builds redirect map
2. **content-architect:** defines collections and sets up the CMS
3. **designer:** owns design tokens, components, and visual consistency
4. **qa-auditor:** runs accessibility, performance, link, and redirect tests (read-only)
5. **deployer:** Wrangler config, preview deploys, post-deploy checks

**Other automation:**

- **Hooks:** run QA automatically after edits
- **Custom slash commands:** for example `/new-post` or `/audit`
- **Claude Code GitHub Action:** staff open an issue, Claude returns a PR

**Codex (optional):** Use only as an automatic PR reviewer (`@codex review`), not as a second builder. Keep shared rules in `AGENTS.md` and import it into `CLAUDE.md` with `@AGENTS.md` so both tools follow one source of truth. Add a "Review guidelines" section covering accessibility, broken links, image optimization, and accurate UN status wording.

## 12. Guardrails

- **Never give an agent write access to DNS.** Have it prepare and verify the record list; make DNS changes manually.
- **Use scoped Cloudflare API tokens** (Workers deploy only), never the global key.
- **Protect the `main` branch** so nothing deploys without approval.
- **Keep credentials out of the repo.** Use environment variables or Cloudflare secrets.
- **Work in branches and pull requests** to get preview URLs and reviews.

## 13. Speed tips

- Theme over scratch (already done with AstroWind)
- Screenshots over descriptions for design feedback
- CMS last, once content is stable
- Domain registrar transfer can happen anytime after launch
