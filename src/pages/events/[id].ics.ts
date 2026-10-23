import type { APIRoute, GetStaticPaths } from 'astro';

import { getEvents, eventInstants, absoluteLink, type DcoEvent } from '~/utils/events';
import { getPermalink } from '~/utils/permalinks';

// One calendar file per timed event (/events/<id>.ics), for "Add to calendar".
// Times are written in UTC, which Outlook, Google and Apple Calendar all convert
// to the reader's own zone.
export const prerender = true;

export const getStaticPaths = (async () =>
  (await getEvents())
    .filter((event) => eventInstants(event.data))
    .map((event) => ({ params: { id: event.id }, props: { event } }))) satisfies GetStaticPaths;

/** RFC 5545 text escaping. */
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** "20261118T160000Z" */
const stamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

/** Fold lines longer than 75 octets (continuation lines start with a space). */
function fold(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = '';
  let size = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (size + n > (out.length ? 74 : 75)) {
      out.push(current);
      current = '';
      size = 0;
    }
    current += ch;
    size += n;
  }
  out.push(current);
  return out.join('\r\n ');
}

export const GET: APIRoute = ({ props, site }) => {
  const event = props.event as DcoEvent;
  const { title, summary, location, conference, link, registerUrl } = event.data;
  const { start, end } = eventInstants(event.data)!;
  const siteUrl = (site ?? new URL('https://www.dco-oo.org')).toString();
  const url = absoluteLink(link, siteUrl) ?? absoluteLink(getPermalink('/events'), siteUrl)!;

  const description = [summary, registerUrl && `Register: ${registerUrl}`, `Details: ${url}`]
    .filter(Boolean)
    .join('\n\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DCO-OO//dco-oo.org events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@dco-oo.org`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    ...(location ? [`LOCATION:${esc([location, conference].filter(Boolean).join(', '))}`] : []),
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.id}.ics"`,
    },
  });
};
