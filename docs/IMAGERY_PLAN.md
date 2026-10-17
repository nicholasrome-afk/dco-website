# Imagery plan

How DCO-OO sources, credits and places photos and visuals. Every image used in the design is registered in `src/config/images.ts`, with its credit and license.

## Principles

1. **Show the real system.** Prefer observing hardware, data, people at work, and the ecosystems Challenge 7 programmes study. Avoid generic stock seascapes.
2. **Partners first.** Photos from DCO-OO's own partners and programmes are the most authentic, and they show the network the site describes.
3. **Every image has a license and a credit.** Record both in `src/config/images.ts`. If either is unknown, the image is a placeholder.
4. **People need consent.** Only use photos of identifiable people when the source confirms consent. Never use stock images of Indigenous or coastal community monitors; ask the programme involved (e.g. Ocean Networks Canada).
5. **No logos or emblems** (NOAA, NASA, UN, Ocean Decade) inside photos used as decoration, and nothing that implies endorsement.
6. **Accessibility and performance.** Write alt text that says what the image shows. Use `''` only for purely decorative images. Supply the largest original; Astro resizes and compresses it.

## Shot list

| Slot (in `images.ts`)        | Where                                          | What to look for                                                                                                                                                        | Good sources                                                                            | Status                                                                             |
| ---------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `homeHero`                   | Home hero, full-bleed behind left-aligned text | Live map of the global observing system: latest positions of ~8,500 in situ platforms (Argo, buoys, ships, gliders…)                                                    | Rendered by `npm run map` from OceanOPS data over Natural Earth land                    | **In use.** Refresh with `npm run map`. OceanOPS reuse permission to confirm       |
| `spotlight`                  | Home spotlight tile                            | Close-up of an instrument or a deployment                                                                                                                               | NOAA Photo Library, NSF OOI, Argo / partner programmes                                  | **In use:** glider deployment, Station Papa Science Team / NSF OOI (public domain) |
| _planned_ `networkMap`       | Partners & programmes section                  | Global map of where programmes and partners operate, over a bathymetry base                                                                                             | We render it ourselves from the GEBCO Grid plus location data from partners             | Needs location data                                                                |
| _planned_ `pillarsBg`        | Coordinate / Observe / Deliver band            | Subtle bathymetry or ocean-current render, darkened under text                                                                                                          | GEBCO Grid render; NASA Earth Observatory                                               | Optional                                                                           |
| _planned_ theme thumbnails   | "What we do" cards                             | Ocean–climate: sea-surface temperature map · Ecosystems: deep-sea or pelagic life · Blue food & economy: coastal fisheries or port · GOOS beyond 2030: float deployment | NASA Earth Observatory, NOAA Ocean Exploration, Schmidt Ocean Institute, NOAA Fisheries | Optional                                                                           |
| _planned_ `eventsHeader`     | Events page header                             | Scientists at a poster hall or workshop (e.g. OSM'26)                                                                                                                   | DCO-OO's own photos, or partners' with consent                                          | Ask the Secretariat and partners                                                   |
| _planned_ people / community | About page                                     | Technicians on a wet deck; community monitors collecting observations                                                                                                   | Partner programmes only (with consent)                                                  | Ask partners                                                                       |

## The hero map (OceanOPS)

The homepage hero is a map we render ourselves rather than a photo. `scripts/render-network-map.mjs` queries OceanOPS's public map service for every platform that reported a position in the last 30 days. It draws them in the site palette over Natural Earth land, which is public domain. It writes:

- `src/assets/images/site/hero-network-map.jpg`: the image
- `src/data/network-map.json`: the retrieval date and counts per network, which the hero's stat line reads

**To refresh:** run `npm run map`, check the image, then commit both files. Monthly is plenty.

**Permission:** OceanOPS marks the service "Copyright: OceanOPS" but publishes no reuse license. Because OceanOPS is the GOOS operational centre, ask them for a short written OK (template below). Then set `pendingPermission: false` on `homeHero` in `src/config/images.ts`. Until then, the build prints a reminder.

> Subject: Using OceanOPS platform positions on the DCO-OO website
>
> Hi OceanOPS team,
>
> The Decade Coordination Office for Ocean Observing is relaunching its website. We'd like to use a map of the latest platform positions from your public PtfLocations map service (rendered in our own colors, credited "Data: OceanOPS (WMO-IOC)", with a link to the OceanOPS board) as the homepage hero image, refreshed about monthly. Is that OK with you, and is there a preferred credit line?
>
> Thank you,
> [name], DCO-OO Secretariat

## Approved sources

Always confirm the terms on the specific image's own page: individual images can carry different rights from the rest of a library.

| Source                                                                                                                                 | Best for                                           | License                                                                                              | Credit to use                                                                                                                    | Watch out for                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Partner programmes** (ONC, Challenger 150, CoastPredict, Marine Life 2030, OBON, Seabed 2030, GOOS, POGO…)                           | Authentic hardware, people, community monitoring   | Written permission (email is fine)                                                                   | As the partner requests                                                                                                          | Record the permission email date in `license`, e.g. "Used with permission (ONC, 2026-11)"                      |
| **[NOAA Photo Library](https://photolib.noaa.gov/About)**                                                                              | Ships, buoys, deployments, marine life             | Public domain                                                                                        | "NOAA" plus the photographer if listed (customary, not required)                                                                 | Images credited to non-NOAA owners need their permission. Don't use the NOAA emblem or imply endorsement       |
| **NOAA Ocean Exploration**                                                                                                             | Deep-sea habitats, ROV imagery                     | Generally not copyrighted ([NOAA OMAO policy](https://www.omao.noaa.gov/image-licensing-usage-info)) | The credit in the image caption, e.g. "NOAA Ocean Exploration"                                                                   | Some images are co-owned by partners (e.g. Ocean Exploration Trust). Check the caption                         |
| **[NSF Ocean Observatories Initiative](https://oceanobservatories.org/about-ooi/media-relations/)**                                    | Moorings, cabled observatories, arrays             | Images by programme personnel are public domain                                                      | The image's own credit, or "Image credit: National Science Foundation's Ocean Observatories Initiative"                          | Vendor images and WHOI-copyright images (images.whoi.edu) need a license                                       |
| **[NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/) / [Earth Observatory](https://earthobservatory.nasa.gov/ImageUse)** | Sea-surface temperature, currents, satellite views | Generally not copyrighted                                                                            | "NASA" (or the credit given, e.g. "NASA Earth Observatory")                                                                      | Logos are not public domain; some images are third-party copyright; no implied endorsement                     |
| **[GEBCO Grid](https://www.gebco.net/data-products/gridded-bathymetry/terms-of-use)**                                                  | Bathymetry renders and map bases we make ourselves | Public domain; free, including commercial use                                                        | Required: the citation in the grid's documentation, e.g. "GEBCO Bathymetric Compilation Group 2026 (2026). The GEBCO_2026 Grid…" | Not for navigation. Don't imply GEBCO/IHO/IOC endorsement                                                      |
| **[Schmidt Ocean Institute](https://schmidtocean.org/newsletter04-data-in-open/)**                                                     | Deep-sea ROV imagery, vents, pelagic life          | CC BY-NC-SA 4.0 (non-commercial)                                                                     | "Schmidt Ocean Institute", with a link to the license                                                                            | Share-alike applies to edited versions. Not for lobbying. Other uses need SOI's request form (allow 4–6 weeks) |
| **Unsplash**                                                                                                                           | Last resort only                                   | Unsplash License (free; credit appreciated)                                                          | "Photographer / Unsplash"                                                                                                        | Generic stock. Avoid for anything meant to show real work                                                      |

## Adding or replacing a photo

1. Choose an image from an approved source and **check its own page** for the license and credit line.
2. Download the largest original (no screenshots, no Squarespace CDN copies).
3. Save it as `src/assets/images/site/<slot>-<short-name>.jpg`.
4. Update the slot in `src/config/images.ts`: `src`, `alt`, `credit`, `license`, `sourceUrl`, and `placeholder: false`.
5. Run `npm run build`. The build lists any placeholder photos still in use.

## Asking partners for photos (email template)

> Subject: Photos of [programme] for the new DCO-OO website
>
> Hi [name],
>
> We're rebuilding the Decade Coordination Office for Ocean Observing website and would love to feature [programme]'s work: in particular [hardware in the field / your team at work / community monitoring].
>
> Could you share 2–3 high-resolution photos you're happy for us to use, along with the credit line you'd like and confirmation that anyone identifiable has agreed to their image being used? We'll credit you on the site and link to [programme].
>
> Thank you,
> [name], DCO-OO Secretariat
