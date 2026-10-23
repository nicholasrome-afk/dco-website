// Registry of every photo used in the site's design, with its credit and
// license. Pages read images from here (never import photos directly), so
// swapping a photo is a one-line change and credits are never lost.
// See docs/IMAGERY_PLAN.md for the shot list and approved sources.
import type { ImageMetadata } from 'astro';

import heroNetworkMap from '~/assets/images/site/hero-network-map.jpg';
import gliderDeployment from '~/assets/images/site/spotlight-glider-deployment.jpg';

export interface SiteImage {
  src: ImageMetadata;
  /** Describe what is shown. Use '' only for purely decorative images. */
  alt: string;
  /** Credit line as the source asks for it, e.g. "NOAA Photo Library". Omit if unknown. */
  credit?: string;
  /** e.g. "Public domain", "CC BY-NC-SA 4.0", "Used with permission". */
  license: string;
  sourceUrl?: string;
  /** True for temporary images that must be replaced before launch. */
  placeholder: boolean;
  /** CSS object-position used when the image is cropped, e.g. '30% 60%'. */
  position?: string;
  /** True while written permission from the source is still being confirmed. */
  pendingPermission?: boolean;
}

export const IMAGES = {
  /**
   * Home hero: latest positions of in situ observing platforms reported to
   * OceanOPS, rendered in the site palette by `npm run map` (see
   * scripts/render-network-map.mjs). Re-run it to refresh the data.
   */
  homeHero: {
    src: heroNetworkMap,
    alt: 'World map with thousands of dots across every ocean, each the latest reported position of an ocean observing platform',
    credit: 'Data: OceanOPS (WMO-IOC) · Land: Natural Earth',
    license:
      'Platform data used with permission of OceanOPS (WMO-IOC), October 2026. Land: Natural Earth, public domain',
    sourceUrl: 'https://www.ocean-ops.org/board',
    placeholder: false,
  },
  /** Home spotlight tile: observing hardware in the field. */
  spotlight: {
    src: gliderDeployment,
    alt: "A science team on a research ship's deck lowers a yellow ocean glider into the sea",
    credit: 'Station Papa Science Team / NSF Ocean Observatories Initiative',
    license: 'Public domain (NSF OOI image policy)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Glider_Deployment_(OOI_172).jpg',
    placeholder: false,
    position: '12% 80%',
  },
} satisfies Record<string, SiteImage>;

if (import.meta.env.PROD) {
  const placeholders = Object.entries(IMAGES)
    .filter(([, image]) => image.placeholder)
    .map(([slot]) => slot);
  if (placeholders.length) {
    console.warn(`[images] Placeholder photos still in use: ${placeholders.join(', ')} (see docs/IMAGERY_PLAN.md)`);
  }
  const pending = Object.entries(IMAGES)
    .filter(([, image]) => 'pendingPermission' in image && image.pendingPermission)
    .map(([slot]) => slot);
  if (pending.length) {
    console.warn(`[images] Reuse permission still to be confirmed for: ${pending.join(', ')}`);
  }
}
