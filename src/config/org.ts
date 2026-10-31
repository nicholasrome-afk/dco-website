// Single source of truth for how the organization describes itself.
// Every page, the footer and the structured data read from here, so a change
// to the name, host or contacts only ever happens in this file.

export const ORG = {
  name: 'Decade Coordination Office for Ocean Observing',
  shortName: 'DCO-OO',
  host: {
    name: "UCAR's Center for Ocean Leadership",
    url: 'https://col.ucar.edu',
  },
  decade: {
    name: 'UN Decade of Ocean Science for Sustainable Development',
    shortName: 'Ocean Decade',
    url: 'https://oceandecade.org/',
    challenge: 'Ocean Decade Challenge 7',
    challengesUrl: 'https://oceandecade.org/challenges/',
  },
  goos: {
    name: 'Global Ocean Observing System',
    shortName: 'GOOS',
    url: 'https://goosocean.org/',
  },
  newsletterUrl: 'https://mailchi.mp/oceanobs29/dco-oo-quarterly-newsletter',
  contacts: [
    { name: 'Nick Rome', email: 'nrome@ucar.edu' },
    { name: 'Cassie Wilson', email: 'cassiew@ucar.edu' },
  ],
} as const;

/** One-line status statement, e.g. for the footer. */
export const ORG_STATUS = `The ${ORG.name} is hosted by ${ORG.host.name}.`;
