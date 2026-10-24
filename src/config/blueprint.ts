// Ocean Decade Solutions Blueprint on Ocean Data, Information and Services.
// The /blueprint page and the homepage spotlight read the consultation dates
// from here; the workshops themselves are ordinary events in src/data/events/.

export const BLUEPRINT = {
  title: 'Solutions Blueprint: Ocean Information and Services',
  fullName: 'Ocean Decade Solution Blueprint on Ocean Data, Information and Services',
  draftUrl: 'https://docs.google.com/document/d/1Zauo8de69ORCTykz6nmQG6ER3mNIcpkx7_u2EioQijg/edit?tab=t.0',
  /** Shown to readers. */
  commentDeadline: 'Friday 6 November 2026',
  /** End of 6 November anywhere on Earth (UTC−12), so no time zone closes early. */
  commentsCloseAt: '2026-11-07T12:00:00Z',
  workshopEventIds: ['2026-11-18-blueprint-workshop-session-1', '2026-11-19-blueprint-workshop-session-2'],
  /** End of the second workshop session. */
  workshopsEndAt: '2026-11-19T09:00:00Z',
} as const;

/** Is `iso` still in the future at build time? Pages re-check in the browser too. */
export const isBefore = (iso: string, now = new Date()) => now.getTime() < new Date(iso).getTime();
