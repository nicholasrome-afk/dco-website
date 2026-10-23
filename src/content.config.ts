import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    /** Alternative text for the cover image. Leave empty for decorative stock photos. */
    imageAlt: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

/**
 * Events: one Markdown file per event in src/data/events/. Times are local to
 * the event (`timezone`), written as "HH:MM" so editors don't wrestle with ISO dates.
 */
export const EVENT_FORMATS = [
  'Workshop',
  'Oral Session',
  'Poster Session',
  'Town Hall',
  'Agency Forum',
  'Presentation',
  'Webinar',
  'Side Event',
  'Conference',
] as const;

const time = z.string().regex(/^\d{2}:\d{2}$/, 'Use 24-hour HH:MM');

const eventCollection = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    startTime: time.optional(),
    endTime: time.optional(),
    timezone: z.string().default('UTC'),
    /** Extra schedule line, e.g. a linked poster session. */
    scheduleNote: z.string().optional(),
    formats: z.array(z.enum(EVENT_FORMATS)).default([]),
    /** Room or venue, e.g. "Carron (SEC)". */
    location: z.string().optional(),
    organizers: z.array(z.string()).default([]),
    /** Groups events from the same meeting, e.g. "OSM'26". */
    conference: z.string().optional(),
    /** Event page: a full URL, or a page on this site such as "/blueprint". */
    link: z.union([z.url(), z.string().regex(/^\//, 'Use a full URL or a site path starting with /')]).optional(),
    registerUrl: z.url().optional(),
    registerBy: z.coerce.date().optional(),
    summary: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** Decade Implementing Partners and Challenge 7 Programmes: one YAML list. */
const networkCollection = defineCollection({
  loader: file('src/data/network.yaml'),
  schema: z.object({
    name: z.string(),
    acronym: z.string().optional(),
    type: z.enum(['partner', 'programme']),
    /** One-line scope tag shown on the card. */
    scope: z.string(),
    url: z.url(),
  }),
});

export const collections = {
  post: postCollection,
  events: eventCollection,
  network: networkCollection,
};
