export interface DivisionData {
  name: string;
  description: string;
  image: string;
  /** Shown as "<articles> articles" when set, e.g. "412". */
  articles: string;
  /** Optional link override; defaults to the division's own page. */
  href?: string;
}

/** URL slug for a division, derived from its name. */
export function divisionSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Where a division card links to: the admin override, or its detail page. */
export function divisionHref(division: DivisionData): string {
  return division.href && division.href.trim() !== ''
    ? division.href
    : `/divisions/${divisionSlug(division.name)}`;
}

const DIVISIONS: DivisionData[] = [
  {
    name: 'Materials for Human Health',
    description: 'Clinical translation, decentralized diagnostics, nanomedicine.',
    image: 'https://picsum.photos/500/300?random=1',
    articles: '412',
  },
  {
    name: 'Intelligent Functional Materials',
    description: 'Responsive, sensing and bioelectronic systems.',
    image: 'https://picsum.photos/500/300?random=2',
    articles: '368',
  },
  {
    name: 'Sustainable Materials',
    description: 'Climate adaptation, circularity, scalable low-cost tech.',
    image: 'https://picsum.photos/500/300?random=3',
    articles: '503',
  },
  {
    name: 'Translational Biomaterials',
    description: 'Lab-to-clinic biomaterials & regulatory pathways.',
    image: 'https://picsum.photos/500/300?random=4',
    articles: '287',
  },
  {
    name: 'Digital & AI-Designed Materials',
    description: 'AI-guided discovery, dynamic datasets, simulation.',
    image: 'https://picsum.photos/500/300?random=5',
    articles: '331',
  },
];

/**
 * What the block renders when no CMS content is saved. Also used to prefill
 * the admin edit form so admins tweak the live values instead of blanks.
 */
export const CHALLENGE_DIVISIONS_DEFAULTS = {
  heading: 'Challenge Divisions',
  intro:
    'Content is organised around five grand-challenge streams rather than conventional materials sub-disciplines – owning the interdisciplinary edge between materials science, medicine, AI, climate and regulation.',
  linkLabel: 'All divisions →',
  linkHref: '/divisions',
  divisions: DIVISIONS,
};

export interface ResolvedChallengeDivisions {
  heading: string;
  intro: string;
  linkLabel: string;
  linkHref: string;
  divisions: DivisionData[];
}

/**
 * Merges saved CMS content over the defaults. Blank strings fall back to the
 * default value; the divisions list replaces the default list wholesale once
 * the admin has saved at least one division.
 */
export function resolveChallengeDivisions(
  content?: Record<string, unknown>
): ResolvedChallengeDivisions {
  const str = (key: keyof typeof CHALLENGE_DIVISIONS_DEFAULTS): string => {
    const v = content?.[key];
    return typeof v === 'string' && v.trim() !== ''
      ? v
      : (CHALLENGE_DIVISIONS_DEFAULTS[key] as string);
  };

  const raw = content?.divisions;
  const saved = Array.isArray(raw)
    ? raw
        .filter(
          (d): d is Record<string, unknown> =>
            !!d && typeof d === 'object' && typeof (d as Record<string, unknown>).name === 'string' &&
            ((d as Record<string, unknown>).name as string).trim() !== ''
        )
        .map((d) => ({
          name: String(d.name),
          description: typeof d.description === 'string' ? d.description : '',
          image: typeof d.image === 'string' ? d.image : '',
          articles: d.articles == null ? '' : String(d.articles),
          href: typeof d.href === 'string' ? d.href : '',
        }))
    : [];

  return {
    heading: str('heading'),
    intro: str('intro'),
    linkLabel: str('linkLabel'),
    linkHref: str('linkHref'),
    divisions: saved.length > 0 ? saved : DIVISIONS,
  };
}
