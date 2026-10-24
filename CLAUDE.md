# Claude Code Configuration

See [AGENTS.md](./AGENTS.md) for all project documentation and AI agent instructions.

@docs/PROJECT_BRIEF.md

## About the organization (overrides the brief where they differ)

- **Name:** Decade Coordination Office for Ocean Observing (**DCO-OO**). Use this exact name. Do not use "UN Decade Coordination Office" or ECOSOC wording.
- **Host:** UCAR's Center for Ocean Leadership (https://col.ucar.edu).
- **Context:** Coordinates the Decade Actions addressing Ocean Decade Challenge 7, working with GOOS. Mention the "UN Decade of Ocean Science for Sustainable Development" in supporting copy, not in the name.
- **Single source of truth:** names, host, and status lines live in `src/config/org.ts`. Never hard-code them in pages.
- **No logo of its own.** The header uses a text wordmark (`DCO-OO`). Partner logos (Ocean Decade, GOOS, COL) appear only in the footer.
- **Imagery:** follow `docs/IMAGERY_PLAN.md`. Every photo is registered in `src/config/images.ts` with its credit and license; pages never import photos directly. The hero is a live OceanOPS platform map rendered by `npm run map`.
- **No social media accounts.** Don't add social icons.
- **Site sections:** Home, About, Events, News, Contact. English only.

## Design rules

**Tone:** editorial, authoritative, calm. Generous white space, restrained color, strong type. References are in `../reference/`: MBARI, Ocean Networks Canada, and Schmidt Ocean Institute.

**Typography** (self-hosted via the Fonts API in `astro.config.ts`)

- Headings: **Plus Jakarta Sans** (geometric sans), weight 700–800, tight tracking. The hero headline is large and left-aligned.
- Body, labels and event metadata: **Inter**, weight 400/500/600. Line length 60–75 characters for prose.
- Eyebrow labels: Inter, uppercase, 0.75rem, semibold, wide tracking (e.g. `EVENT | 27 FEB 2026`). Use the `eyebrow` / `eyebrow-bar` utilities.

**Color** (tokens in `src/components/CustomStyles.astro`; never hard-code hex values in components)

| Token       | Hex       | Use                                                                                      |
| ----------- | --------- | ---------------------------------------------------------------------------------------- |
| `abyss`     | `#0A192F` | Deep abyssal navy: hero, page headers, pillars, footer                                   |
| `deep`      | `#13294B` | Cards on navy                                                                            |
| `primary`   | `#008080` | Ocean teal: button fills (white text, 4.77:1), badges, icons, borders                    |
| `secondary` | `#006666` | Hover state for teal buttons                                                             |
| `link`      | `#006D6D` | Small text links and badge labels on white or ice gray (`#008080` is 4.44:1 on ice gray) |
| `accent`    | `#00A896` | Bright teal: **only on navy** (as text, or as a fill under navy text). Fails AA on white |
| `mist`      | `#F4F7FA` | Cool ice gray: alternating light sections                                                |
| `line`      | `#D8E0E6` | Borders and dividers                                                                     |
| text        | `#12202D` | Body text; muted text is `#4A5C6C`; muted text on navy is `#AFC0D2`                      |

- Avoid UN blue (`#009EDB`) and the Ocean Decade palette.
- Every text/background pair must meet WCAG 2.2 AA (4.5:1 for body text, 3:1 for large text and UI).
- The site is light-only for now (`ui.theme: light:only`). Navy bands are a design element, not a dark mode.

**Layout and components**

- Max content width `max-w-7xl`; section padding `py-16 md:py-24`; 4px corner radius on cards; 1px `line` borders instead of shadows.
- Section heads: eyebrow with a teal bar (`primary` on light, `accent` on navy), then a Plus Jakarta Sans H2.
- Buttons: `btn-dco-primary` (teal, on light), `btn-dco-accent` (bright teal, on navy), `btn-dco-outline-light` (on navy or photos), `btn-dco-light` (white, on teal); square-ish, not pills.
- Event cards: square date block, format pill badges, room, and co-organizer tags.
- Motion: minimal. Respect `prefers-reduced-motion`. No autoplay video.
- Site-specific components live in `src/components/dco/`. Content lives in `src/data/` (events, programmes, updates).
