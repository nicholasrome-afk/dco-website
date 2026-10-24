# dco-oo.org

Website of the **Decade Coordination Office for Ocean Observing (DCO-OO)**, hosted by UCAR's Center for Ocean Leadership. Built with [Astro](https://astro.build) on the [AstroWind](https://github.com/arthelokyo/astrowind) theme (MIT license, see `LICENSE.md`) and hosted on Cloudflare.

## Run it locally

Requires Node.js 22.22.3 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run check    # types, lint, formatting
```

## Where things live

| What                                               | Where                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| Organization name, host, contacts, newsletter link | `src/config/org.ts`                                              |
| Events (one file per event)                        | `src/data/events/*.md`                                           |
| Partners and programmes                            | `src/data/network.yaml`                                          |
| News posts                                         | `src/data/post/*.md`                                             |
| Photos and their credits                           | `src/config/images.ts` (see `docs/IMAGERY_PLAN.md`)              |
| Homepage map from OceanOPS                         | `npm run map` (writes the image and `src/data/network-map.json`) |
| Design rules (colors, fonts, components)           | `CLAUDE.md`                                                      |
| Redirects from old URLs                            | `public/_redirects`                                              |

## Deploying

Every push to `main` deploys to production through Cloudflare Workers Builds; other branches get preview links (marked `noindex`). `main` is protected: changes arrive through pull requests.
