/**
 * Registry of designed page layouts whose text content is editable from
 * Admin → Content → Pages as a structured form (page.layout != 'prose').
 *
 * The page keeps its designed React layout in code; the CMS stores only a
 * JSON object of the fields below (page.content). Every field is optional —
 * missing/empty values fall back to the text built into the component, so a
 * newly created page changes nothing until an admin edits a field.
 */

export interface LayoutItemField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
}

export interface LayoutField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'list';
  help?: string;
  /** For type 'list': the fields of each list item. */
  itemFields?: LayoutItemField[];
  /** For type 'list': fixed item count (no add/remove) when the design has fixed slots. */
  fixedCount?: number;
}

export interface PageLayoutDef {
  key: string;
  label: string;
  /** Route the layout renders on, for the admin UI hint. */
  route: string;
  fields: LayoutField[];
}

export const PAGE_LAYOUTS: Record<string, PageLayoutDef> = {
  'about-journal': {
    key: 'about-journal',
    label: 'About Journal (designed layout)',
    route: '/about-journal',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'overview_p1', label: 'Journal Overview — paragraph 1', type: 'textarea' },
      { key: 'overview_p2', label: 'Journal Overview — paragraph 2', type: 'textarea' },
      {
        key: 'cards',
        label: 'Navigation cards',
        type: 'list',
        fixedCount: 6,
        help: 'Order: Aims & Scope, Editorial Board, Indexing, Ethics & Process, Review Process, Contact Us. Links and icons are fixed.',
        itemFields: [
          { key: 'title', label: 'Card title', type: 'text' },
          { key: 'description', label: 'Card description', type: 'textarea' },
        ],
      },
      {
        key: 'features',
        label: 'Key Features',
        type: 'list',
        fixedCount: 6,
        itemFields: [
          { key: 'title', label: 'Feature title', type: 'text' },
          { key: 'description', label: 'Feature description', type: 'textarea' },
        ],
      },
      {
        key: 'extra_sections',
        label: 'Additional sections',
        type: 'list',
        help: "Your own sections, shown below Key Features. In the text: blank line = new paragraph; start a line with '- ' for a bullet; start a line with '## Column title' to create side-by-side coloured columns.",
        itemFields: [
          { key: 'title', label: 'Section heading', type: 'text' },
          { key: 'body', label: 'Section text', type: 'textarea' },
        ],
      },
    ],
  },

  about: {
    key: 'about',
    label: 'About AML (designed layout)',
    route: '/about',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Intro paragraph', type: 'textarea' },
      {
        key: 'overview_paragraphs',
        label: 'Journal Overview paragraphs',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Paragraph', type: 'textarea' }],
      },
      {
        key: 'publication_types',
        label: 'Publication Types',
        type: 'list',
        itemFields: [
          { key: 'title', label: 'Type', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      { key: 'access_intro', label: 'Access & Membership — intro', type: 'textarea' },
      {
        key: 'access_points',
        label: 'Access & Membership — bullet points',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Point', type: 'text' }],
      },
      {
        key: 'key_info',
        label: 'Key Information (sidebar)',
        type: 'list',
        itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'value', label: 'Value', type: 'text' },
        ],
      },
      {
        key: 'focus_areas',
        label: 'Focus Areas (sidebar badges)',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Area', type: 'text' }],
      },
      { key: 'office_name', label: 'Editorial Office — organisation', type: 'text' },
      { key: 'office_address', label: 'Editorial Office — address', type: 'textarea' },
      { key: 'office_email', label: 'Editorial Office — email', type: 'text' },
      { key: 'office_website', label: 'Editorial Office — website', type: 'text' },
      {
        key: 'recognition',
        label: 'Recognition & Indexing tiles',
        type: 'list',
        fixedCount: 4,
        itemFields: [
          { key: 'title', label: 'Tile title', type: 'text' },
          { key: 'description', label: 'Tile description', type: 'textarea' },
        ],
      },
      {
        key: 'extra_sections',
        label: 'Additional sections',
        type: 'list',
        help: "Your own sections, shown at the bottom of the page. In the text: blank line = new paragraph; start a line with '- ' for a bullet; start a line with '## Column title' to create side-by-side coloured columns.",
        itemFields: [
          { key: 'title', label: 'Section heading', type: 'text' },
          { key: 'body', label: 'Section text', type: 'textarea' },
        ],
      },
    ],
  },

  'editorial-board': {
    key: 'editorial-board',
    label: 'Editorial Board (designed layout)',
    route: '/editorial-board',
    fields: [
      { key: 'intro', label: 'Page introduction', type: 'textarea' },
      { key: 'eic_name', label: 'Editor-in-Chief — name', type: 'text' },
      { key: 'eic_title', label: 'Editor-in-Chief — role title', type: 'text' },
      { key: 'eic_affiliation', label: 'Editor-in-Chief — affiliation', type: 'text' },
      { key: 'eic_location', label: 'Editor-in-Chief — location', type: 'text' },
      { key: 'eic_email', label: 'Editor-in-Chief — email', type: 'text' },
      { key: 'eic_bio', label: 'Editor-in-Chief — biography', type: 'textarea' },
      {
        key: 'eic_photo',
        label: 'Editor-in-Chief — photo path',
        type: 'text',
        help: 'Image path under /images/editorial-board/ (e.g. /images/editorial-board/name.jpg). Leave empty to show initials.',
      },
      {
        key: 'eic_expertise',
        label: 'Editor-in-Chief — expertise areas',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Expertise area', type: 'text' }],
      },
      { key: 'me_name', label: 'Managing Editor — name', type: 'text' },
      { key: 'me_affiliation', label: 'Managing Editor — affiliation', type: 'text' },
      { key: 'me_location', label: 'Managing Editor — location', type: 'text' },
      { key: 'me_photo', label: 'Managing Editor — photo path', type: 'text' },
      {
        key: 'academic_editors',
        label: 'Academic Editors',
        type: 'list',
        help: 'Add, edit, or remove board members. Photo is an image path under /images/editorial-board/; leave empty to show initials.',
        itemFields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'affiliation', label: 'Affiliation', type: 'text' },
          { key: 'location', label: 'Country/Region', type: 'text' },
          { key: 'photo', label: 'Photo path', type: 'text' },
        ],
      },
      {
        key: 'advisory_members',
        label: 'Advisory Board Members',
        type: 'list',
        help: 'Add, edit, or remove board members. Photo is an image path under /images/editorial-board/; leave empty to show initials.',
        itemFields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'affiliation', label: 'Affiliation', type: 'text' },
          { key: 'location', label: 'Country/Region', type: 'text' },
          { key: 'photo', label: 'Photo path', type: 'text' },
        ],
      },
    ],
  },
};

export type PageContentData = Record<string, unknown>;

/** Parse a CMS page's content column as structured JSON ({} on failure). */
export function parsePageContent(raw: string | null | undefined): PageContentData {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/** A non-empty string override, else the default. */
export function pickText(content: PageContentData, key: string, fallback: string): string {
  const v = content[key];
  return typeof v === 'string' && v.trim() !== '' ? v : fallback;
}

/**
 * Merge a CMS list over default items index-by-index: each item's fields
 * override the default item's when non-empty. Without fixedCount the CMS
 * array determines the item count (so removing an item in the dashboard
 * removes it here); an absent or empty CMS array keeps the defaults.
 */
export function pickList<T extends Record<string, string>>(
  content: PageContentData,
  key: string,
  defaults: T[],
  fixedCount?: number
): T[] {
  const raw = content[key];
  if (!Array.isArray(raw) || raw.length === 0) return defaults;

  const length = fixedCount ?? raw.length;
  const result: T[] = [];
  for (let i = 0; i < length; i++) {
    const base = defaults[i] ?? defaults[defaults.length - 1] ?? ({} as T);
    const override = (raw[i] ?? {}) as Record<string, unknown>;
    const merged = { ...base } as Record<string, string>;
    for (const [field, value] of Object.entries(override)) {
      if (typeof value === 'string' && value.trim() !== '') merged[field] = value;
    }
    result.push(merged as T);
  }
  return result;
}
