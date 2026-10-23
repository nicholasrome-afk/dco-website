import { getPermalink, getBlogPermalink } from './utils/permalinks';
import { ORG } from './config/org';

export const headerData = {
  links: [
    { text: 'About', href: getPermalink('/about') },
    { text: 'Blueprint', href: getPermalink('/blueprint') },
    { text: 'Events', href: getPermalink('/events') },
    { text: 'News', href: getBlogPermalink() },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  // Subscribe lives in the utility bar (UtilityBar.astro), not the main menu.
  actions: [],
};

export const footerData = {
  // Quick anchor links to the homepage sections (MBARI-style footer).
  homeSections: [
    { text: 'What we do', href: getPermalink('/#about') },
    { text: 'Partners & programmes', href: getPermalink('/#network') },
    { text: 'Events', href: getPermalink('/#events') },
    { text: 'Latest updates', href: getPermalink('/#updates') },
  ],
  sections: [
    {
      title: 'On this site',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Solutions Blueprint', href: getPermalink('/blueprint') },
        { text: 'Events', href: getPermalink('/events') },
        { text: 'News', href: getBlogPermalink() },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Ocean Decade',
      links: [
        { text: 'Ocean Decade website', href: ORG.decade.url },
        { text: 'GOOS', href: ORG.goos.url },
        { text: 'Center for Ocean Leadership', href: ORG.host.url },
      ],
    },
  ],
};
