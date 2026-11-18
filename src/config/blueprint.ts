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
  /** End of the second workshop session. The thank-you and "What we heard" section replaces the sign-up boxes from here. */
  workshopsEndAt: '2026-11-19T09:00:00Z',
  /** The homepage spotlight features the Blueprint until after the Rio conference (7–9 April 2027). */
  homepageSpotlightUntil: '2027-04-10T00:00:00Z',
  /** Key takeaways from the comment period and the two workshops (supplied by DCO-OO). */
  whatWeHeard: [
    'Secure sustained, long-term financing for observing, data infrastructure, operations, maintenance, and capacity',
    'Strengthen national and regional implementation, particularly in underserved and under-observed regions, while connecting efforts globally',
    'Build an interoperable, connected ocean data ecosystem using common standards, shared infrastructure, and federated systems',
    'Prioritize user needs and co-design, ensuring data, products, and services translate into useful, actionable information',
    'Build and sustain capacity, including technical skills, equipment access, calibration, maintenance, and institutional capability',
    'Deepen public-private collaboration, including industry, insurance, technology providers, and new financing models',
    'Define clear priorities, responsibilities, and measurable milestones, with realistic actions through 2030 and accountability for progress',
    'Demonstrate and communicate value, using successful examples, operational prototypes, and evidence of societal and economic benefits to build support and investment',
  ],
} as const;

/** Is `iso` still in the future at build time? Pages re-check in the browser too. */
export const isBefore = (iso: string, now = new Date()) => now.getTime() < new Date(iso).getTime();
