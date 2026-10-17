import { getCollection, type CollectionEntry } from 'astro:content';

export type DcoEvent = CollectionEntry<'events'>;

// Event dates are calendar days in the event's own timezone; format them in UTC
// so a 21 Feb event never renders as 20 Feb on a machine west of Greenwich.
const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...opts });

const fmtWeekday = fmt({ weekday: 'short' });
const fmtWeekdayLong = fmt({ weekday: 'long' });
const fmtMonth = fmt({ month: 'short' });
const fmtDay = fmt({ day: 'numeric' });
const fmtFull = fmt({ day: 'numeric', month: 'long', year: 'numeric' });

export const dayKey = (d: Date) => d.toISOString().slice(0, 10);
export const weekday = (d: Date) => fmtWeekday.format(d);
export const weekdayLong = (d: Date) => fmtWeekdayLong.format(d);
export const monthShort = (d: Date) => fmtMonth.format(d);
export const dayOfMonth = (d: Date) => fmtDay.format(d);
export const fullDate = (d: Date) => fmtFull.format(d);
/** "Sat 21 Feb" */
export const shortDay = (d: Date) => `${weekday(d)} ${dayOfMonth(d)} ${monthShort(d)}`;

export const timeRange = ({ startTime, endTime }: DcoEvent['data']) =>
  startTime && endTime ? `${startTime}–${endTime}` : (startTime ?? '');

/** Organizers minus the generic "partners" entry, which is shown as "+ partners". */
export const splitOrganizers = (organizers: string[]) => {
  const named = organizers.filter((o) => o.toLowerCase() !== 'partners');
  return { named, withPartners: named.length !== organizers.length };
};

const byDateTime = (a: DcoEvent, b: DcoEvent) =>
  a.data.date.getTime() - b.data.date.getTime() || (a.data.startTime ?? '').localeCompare(b.data.startTime ?? '');

/** All published events, oldest first. */
export const getEvents = async () =>
  (await getCollection('events', ({ data }) => import.meta.env.DEV || !data.draft)).sort(byDateTime);

/**
 * Upcoming vs past is decided at build time, so the site needs a rebuild
 * (any content change or a scheduled deploy) for an event to move to "past".
 */
export const splitByTime = (events: DcoEvent[], now = new Date()) => {
  const today = dayKey(now);
  return {
    upcoming: events.filter((e) => dayKey(e.data.date) >= today),
    past: events.filter((e) => dayKey(e.data.date) < today).reverse(),
  };
};

/** Group events by conference (or "Other events"), keeping date order inside each group. */
export const groupByConference = (events: DcoEvent[]) => {
  const groups = new Map<string, DcoEvent[]>();
  for (const e of events) {
    const key = e.data.conference ?? 'Other events';
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  for (const list of groups.values()) list.sort(byDateTime);
  return groups;
};

/** Group a list of events by calendar day, in date order. */
export const groupByDay = (events: DcoEvent[]) => {
  const days = new Map<string, DcoEvent[]>();
  for (const e of [...events].sort(byDateTime)) {
    const key = dayKey(e.data.date);
    days.set(key, [...(days.get(key) ?? []), e]);
  }
  return days;
};
