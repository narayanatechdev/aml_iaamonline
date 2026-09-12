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
  /** textarea only: edit as rich text (bold/italic/sub/sup/links/lists, stored as HTML). */
  rich?: boolean;
}

export interface LayoutField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'list';
  /** textarea only: edit as rich text (bold/italic/sub/sup/links/lists, stored as HTML). */
  rich?: boolean;
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
      { key: 'overview_title', label: 'Journal Overview — section title', type: 'text' },
      {
        key: 'overview_body',
        label: 'Journal Overview — content',
        type: 'textarea',
        rich: true,
        help: 'The section body. Use Enter for new paragraphs; formatting, links and lists are supported.',
      },
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
      { key: 'features_title', label: 'Key Features — section title', type: 'text' },
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
      { key: 'overview_title', label: 'Journal Overview — section title', type: 'text' },
      {
        key: 'overview_paragraphs',
        label: 'Journal Overview — content',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Paragraph', type: 'textarea', rich: true }],
      },
      { key: 'publication_types_title', label: 'Publication Types — section title', type: 'text' },
      {
        key: 'publication_types',
        label: 'Publication Types',
        type: 'list',
        help: 'Repeatable: each item is a title + rich-text content. Add or remove types as needed.',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Content', type: 'textarea', rich: true },
        ],
      },
      { key: 'access_title', label: 'Access & Membership — section title', type: 'text' },
      { key: 'access_intro', label: 'Access & Membership — intro', type: 'textarea', rich: true },
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
      { key: 'intro', label: 'Page introduction', type: 'textarea', rich: true },
      { key: 'eic_name', label: 'Editor-in-Chief — name', type: 'text' },
      { key: 'eic_title', label: 'Editor-in-Chief — role title', type: 'text' },
      { key: 'eic_affiliation', label: 'Editor-in-Chief — affiliation', type: 'text' },
      { key: 'eic_location', label: 'Editor-in-Chief — location', type: 'text' },
      { key: 'eic_email', label: 'Editor-in-Chief — email', type: 'text' },
      { key: 'eic_bio', label: 'Editor-in-Chief — biography', type: 'textarea', rich: true },
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

  'about-contact': {
    key: 'about-contact',
    label: 'Contact Us (designed layout)',
    route: '/about-journal/contact',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'email_heading', label: 'Email card — heading', type: 'text' },
      { key: 'email_desc', label: 'Email card — description', type: 'text' },
      { key: 'email_address', label: 'Email card — address', type: 'text' },
      { key: 'phone_heading', label: 'Phone card — heading', type: 'text' },
      { key: 'phone_desc', label: 'Phone card — description', type: 'text' },
      { key: 'phone_number', label: 'Phone card — number', type: 'text' },
      { key: 'address_heading', label: 'Address card — heading', type: 'text' },
      { key: 'address_desc', label: 'Address card — description', type: 'text' },
      {
        key: 'address_text',
        label: 'Address card — address lines',
        type: 'textarea',
        help: 'Each line is shown on its own line. Plain text only.',
      },
      { key: 'form_heading', label: 'Contact form — heading', type: 'text' },
      { key: 'office_hours_heading', label: 'Office Hours — section heading', type: 'text' },
      { key: 'editorial_office_title', label: 'Office Hours — Editorial Office column title', type: 'text' },
      {
        key: 'office_hours',
        label: 'Editorial Office hours',
        type: 'list',
        help: 'Each row: day label and hours value.',
        itemFields: [
          { key: 'day', label: 'Day / period', type: 'text' },
          { key: 'hours', label: 'Hours', type: 'text' },
        ],
      },
      { key: 'response_times_title', label: 'Office Hours — Response Times column title', type: 'text' },
      {
        key: 'response_times',
        label: 'Response times',
        type: 'list',
        help: 'Each row: inquiry type and expected response value.',
        itemFields: [
          { key: 'label', label: 'Inquiry type', type: 'text' },
          { key: 'value', label: 'Response time', type: 'text' },
        ],
      },
    ],
  },

  'about-editors': {
    key: 'about-editors',
    label: 'About the Editors (designed layout)',
    route: '/about-journal/about-editors',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', rich: true },
  
      // Editor-in-Chief
      { key: 'eic_name', label: 'Editor-in-Chief — name', type: 'text' },
      { key: 'eic_title', label: 'Editor-in-Chief — role title', type: 'text' },
      { key: 'eic_affiliation', label: 'Editor-in-Chief — affiliation', type: 'text' },
      { key: 'eic_location', label: 'Editor-in-Chief — location', type: 'text' },
      { key: 'eic_email', label: 'Editor-in-Chief — email', type: 'text' },
      { key: 'eic_bio', label: 'Editor-in-Chief — biography', type: 'textarea', rich: true },
      {
        key: 'eic_photo',
        label: 'Editor-in-Chief — photo path',
        type: 'text',
        help: 'Image path (e.g. /images/editorial-board/name.jpg). Leave empty to show initials.',
      },
      {
        key: 'eic_expertise',
        label: 'Editor-in-Chief — expertise areas',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Expertise area', type: 'text' }],
      },
  
      // Managing Editor
      { key: 'me_name', label: 'Managing Editor — name', type: 'text' },
      { key: 'me_affiliation', label: 'Managing Editor — affiliation', type: 'text' },
      { key: 'me_location', label: 'Managing Editor — location', type: 'text' },
      { key: 'me_photo', label: 'Managing Editor — photo path', type: 'text' },
  
      // Academic Editorial Board
      {
        key: 'academic_editors',
        label: 'Academic Editorial Board members',
        type: 'list',
        help: 'Add, edit, or remove board members. Photo is an image path; leave empty to show initials.',
        itemFields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'affiliation', label: 'Affiliation', type: 'text' },
          { key: 'location', label: 'Country/Region', type: 'text' },
          { key: 'photo', label: 'Photo path', type: 'text' },
        ],
      },
  
      // Editorial Philosophy
      { key: 'philosophy_title', label: 'Editorial Philosophy — section title', type: 'text' },
      { key: 'philosophy_intro', label: 'Editorial Philosophy — intro paragraph', type: 'textarea', rich: true },
      {
        key: 'philosophy_principles',
        label: 'Editorial Philosophy — principles',
        type: 'list',
        help: 'Displayed in a two-column grid. First half goes in the left column, second half in the right.',
        itemFields: [
          { key: 'title', label: 'Principle title', type: 'text' },
          { key: 'description', label: 'Principle description', type: 'textarea' },
        ],
      },
  
      // Global Editorial Network
      { key: 'network_title', label: 'Global Editorial Network — section title', type: 'text' },
      { key: 'network_intro', label: 'Global Editorial Network — intro paragraph', type: 'textarea', rich: true },
      {
        key: 'network_stats',
        label: 'Global Editorial Network — statistics (3 fixed slots)',
        type: 'list',
        fixedCount: 3,
        help: 'Exactly 3 stat boxes. Slot colours are fixed: blue, green, yellow.',
        itemFields: [
          { key: 'value', label: 'Statistic value (e.g. 50+)', type: 'text' },
          { key: 'label', label: 'Statistic label', type: 'text' },
        ],
      },
    ],
  },

  'aims-scope': {
    key: 'aims-scope',
    label: 'Aims & Scope (designed layout)',
    route: '/about-journal/aims-scope',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Intro paragraph', type: 'textarea' },
  
      { key: 'scope_title', label: 'Journal Scope & Mission — section title', type: 'text' },
      {
        key: 'scope_paragraphs',
        label: 'Journal Scope & Mission — paragraphs',
        type: 'list',
        help: 'Each item is one paragraph. Add or remove paragraphs as needed.',
        itemFields: [{ key: 'text', label: 'Paragraph', type: 'textarea', rich: true }],
      },
  
      { key: 'research_areas_title', label: 'Core Research Areas — section title', type: 'text' },
      {
        key: 'research_areas',
        label: 'Core Research Areas',
        type: 'list',
        fixedCount: 4,
        help: 'Exactly 4 areas. Icons (Atom, Leaf, Zap, Cpu) are fixed per slot.',
        itemFields: [
          { key: 'title', label: 'Area title', type: 'text' },
          { key: 'description', label: 'Area description', type: 'textarea' },
        ],
      },
  
      { key: 'submission_title', label: 'Submission Criteria — section title', type: 'text' },
      { key: 'submission_intro', label: 'Submission Criteria — intro paragraph', type: 'textarea' },
      {
        key: 'submission_criteria',
        label: 'Submission Criteria — checklist items',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Criterion', type: 'text' }],
      },
  
      { key: 'material_categories_title', label: 'Material Categories — section title', type: 'text' },
      {
        key: 'material_categories',
        label: 'Material Categories',
        type: 'list',
        fixedCount: 4,
        help: 'Exactly 4 categories, each with up to 3 sub-items.',
        itemFields: [
          { key: 'category', label: 'Category name', type: 'text' },
          { key: 'item1', label: 'Sub-item 1', type: 'text' },
          { key: 'item2', label: 'Sub-item 2', type: 'text' },
          { key: 'item3', label: 'Sub-item 3', type: 'text' },
        ],
      },
  
      { key: 'app_domains_title', label: 'Application Domains — section title', type: 'text' },
      {
        key: 'app_domains',
        label: 'Application Domains (badge labels)',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Domain', type: 'text' }],
      },
  
      { key: 'techniques_title', label: 'Key Techniques — section title', type: 'text' },
      {
        key: 'techniques',
        label: 'Key Techniques (bullet list)',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Technique', type: 'text' }],
      },
  
      { key: 'features_title', label: 'Special Features & Focus Areas — section title', type: 'text' },
      {
        key: 'features',
        label: 'Special Features',
        type: 'list',
        fixedCount: 6,
        help: 'Exactly 6 features. First 2 are highlighted (gold border); icons and highlight flags are fixed.',
        itemFields: [
          { key: 'title', label: 'Feature title', type: 'text' },
          { key: 'description', label: 'Feature description', type: 'textarea' },
        ],
      },
    ],
  },

  'awards': {
    key: 'awards',
    label: 'Awards & Recognition (designed layout)',
    route: '/about-journal/awards',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', rich: true },
  
      // Journal Recognition
      { key: 'recognition_title', label: 'Journal Recognition — section title', type: 'text' },
      {
        key: 'recognition_items',
        label: 'Journal Recognition — items (3 fixed slots)',
        type: 'list',
        fixedCount: 3,
        help: 'Exactly 3 recognition cards. Icons per slot are fixed: Medal (yellow), Star (blue), Award (green).',
        itemFields: [
          { key: 'title', label: 'Award title', type: 'text' },
          { key: 'period', label: 'Period (e.g. 2010 – Present)', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
  
      // Annual Excellence Awards
      { key: 'awards_title', label: 'Annual Excellence Awards — section title', type: 'text' },
      { key: 'awards_intro', label: 'Annual Excellence Awards — intro paragraph', type: 'textarea', rich: true },
      { key: 'best_papers_title', label: 'Best Paper Awards — column title', type: 'text' },
      {
        key: 'best_papers',
        label: 'Best Paper Awards — items',
        type: 'list',
        help: 'Each item gets a coloured left border (cycling: yellow, blue, green).',
        itemFields: [
          { key: 'title', label: 'Award title', type: 'text' },
          { key: 'subtitle', label: 'Paper / recipient title', type: 'text' },
          { key: 'note', label: 'Short note', type: 'textarea' },
        ],
      },
      { key: 'young_researchers_title', label: 'Young Researcher Awards — column title', type: 'text' },
      {
        key: 'young_researchers',
        label: 'Young Researcher Awards — items',
        type: 'list',
        help: 'Each item gets a coloured left border (cycling: purple, red, indigo).',
        itemFields: [
          { key: 'title', label: 'Award title', type: 'text' },
          { key: 'subtitle', label: 'Recipient name / description', type: 'text' },
          { key: 'note', label: 'Short note', type: 'textarea' },
        ],
      },
  
      // Recognition Criteria
      { key: 'criteria_title', label: 'Recognition Criteria — section title', type: 'text' },
      {
        key: 'criteria_items',
        label: 'Recognition Criteria — items (3 fixed slots)',
        type: 'list',
        fixedCount: 3,
        help: 'Exactly 3 criteria cards. Icons per slot are fixed: Star (blue), Trophy (green), Award (yellow).',
        itemFields: [
          { key: 'title', label: 'Criterion title', type: 'text' },
          { key: 'description', label: 'Criterion description', type: 'textarea' },
        ],
      },
  
      // Nomination Process
      { key: 'nomination_title', label: 'Nomination Process — section title', type: 'text' },
      { key: 'nomination_intro', label: 'Nomination Process — intro paragraph', type: 'textarea', rich: true },
      { key: 'nomination_deadline', label: 'Submission deadline', type: 'text' },
      { key: 'nomination_announcement', label: 'Announcement date', type: 'text' },
    ],
  },

  'editorial-policies': {
    key: 'editorial-policies',
    label: 'Editorial Policies (designed layout)',
    route: '/about-journal/editorial-policies',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
  
      // Peer Review Policy
      { key: 'peer_review_title', label: 'Peer Review Policy — section title', type: 'text' },
      {
        key: 'peer_review_body',
        label: 'Peer Review Policy — body',
        type: 'textarea',
        rich: true,
      },
      { key: 'review_process_title', label: 'Peer Review — Review Process column title', type: 'text' },
      {
        key: 'review_process_items',
        label: 'Peer Review — Review Process bullets',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      { key: 'review_criteria_title', label: 'Peer Review — Review Criteria column title', type: 'text' },
      {
        key: 'review_criteria_items',
        label: 'Peer Review — Review Criteria bullets',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
  
      // Publication Ethics
      { key: 'ethics_title', label: 'Publication Ethics — section title', type: 'text' },
      { key: 'misconduct_title', label: 'Research Misconduct box — title', type: 'text' },
      { key: 'misconduct_intro', label: 'Research Misconduct box — intro line', type: 'text' },
      {
        key: 'misconduct_items',
        label: 'Research Misconduct box — bullet items',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      { key: 'author_title', label: 'Author Responsibilities box — title', type: 'text' },
      {
        key: 'author_items',
        label: 'Author Responsibilities box — bullet items',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      { key: 'editorial_standards_title', label: 'Editorial Standards box — title', type: 'text' },
      {
        key: 'editorial_standards_items',
        label: 'Editorial Standards box — bullet items',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
  
      // Copyright & Licensing
      { key: 'copyright_title', label: 'Copyright & Licensing — section title', type: 'text' },
      {
        key: 'copyright_body',
        label: 'Copyright & Licensing — body',
        type: 'textarea',
        rich: true,
      },
      { key: 'cc_benefits_title', label: 'CC BY 4.0 — benefits box title', type: 'text' },
      { key: 'cc_free_title', label: 'CC BY 4.0 — "You are free to" column title', type: 'text' },
      {
        key: 'cc_free_items',
        label: 'CC BY 4.0 — "You are free to" bullets',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      { key: 'cc_terms_title', label: 'CC BY 4.0 — "Under the terms" column title', type: 'text' },
      {
        key: 'cc_terms_items',
        label: 'CC BY 4.0 — "Under the terms" bullets',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
    ],
  },

  'editorial-team': {
    key: 'editorial-team',
    label: 'Research Cross-Journal Editorial Team (designed layout)',
    route: '/about-journal/editorial-team',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
  
      // Overview section
      { key: 'collab_title', label: 'Cross-Journal Collaboration — section title', type: 'text' },
      {
        key: 'collab_body',
        label: 'Cross-Journal Collaboration — body (2 paragraphs)',
        type: 'textarea',
        rich: true,
        help: 'Rich text. Use paragraph breaks to separate the two intro paragraphs.',
      },
  
      // Team Structure
      { key: 'structure_title', label: 'Team Structure — section title', type: 'text' },
      { key: 'senior_title', label: 'Senior Editorial Committee — panel title', type: 'text' },
      {
        key: 'senior_items',
        label: 'Senior Editorial Committee — items',
        type: 'list',
        fixedCount: 3,
        itemFields: [
          { key: 'title', label: 'Role title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      { key: 'disciplinary_title', label: 'Disciplinary Panels — panel title', type: 'text' },
      {
        key: 'disciplinary_items',
        label: 'Disciplinary Panels — items',
        type: 'list',
        fixedCount: 3,
        itemFields: [
          { key: 'title', label: 'Panel name', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      { key: 'cross_title', label: 'Cross-Disciplinary Experts — panel title', type: 'text' },
      {
        key: 'cross_items',
        label: 'Cross-Disciplinary Experts — items',
        type: 'list',
        fixedCount: 3,
        itemFields: [
          { key: 'title', label: 'Role name', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
  
      // Benefits & Impact
      { key: 'benefits_title', label: 'Benefits & Impact — section title', type: 'text' },
      { key: 'authors_benefits_title', label: 'Benefits — "For Authors" column title', type: 'text' },
      {
        key: 'author_benefits',
        label: 'Benefits — For Authors items',
        type: 'list',
        fixedCount: 3,
        itemFields: [
          { key: 'title', label: 'Benefit title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'community_benefits_title',
        label: 'Benefits — "For Research Community" column title',
        type: 'text',
      },
      {
        key: 'community_benefits',
        label: 'Benefits — For Research Community items',
        type: 'list',
        fixedCount: 3,
        itemFields: [
          { key: 'title', label: 'Benefit title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
  
      // Collaboration Process
      { key: 'process_title', label: 'Collaboration Process — section title', type: 'text' },
      {
        key: 'process_steps',
        label: 'Collaboration Process — steps',
        type: 'list',
        fixedCount: 4,
        help: 'Fixed 4 steps. Step numbers and circle colours are determined by position.',
        itemFields: [
          { key: 'title', label: 'Step title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'process_note',
        label: 'Collaboration Process — note text',
        type: 'textarea',
        help: 'Shown in the blue note box after the steps.',
      },
    ],
  },

  'editorial-values': {
    key: 'editorial-values',
    label: 'Editorial Values Statement (designed layout)',
    route: '/about-journal/editorial-values',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
  
      // Core Values cards
      { key: 'core_values_title', label: 'Core Values — section title', type: 'text' },
      {
        key: 'values',
        label: 'Core Values — cards',
        type: 'list',
        fixedCount: 3,
        help: 'Fixed 3 cards. Icons are fixed per position: Shield (Integrity), Target (Excellence), Globe (Accessibility).',
        itemFields: [
          { key: 'title', label: 'Card title', type: 'text' },
          { key: 'description', label: 'Card description', type: 'textarea' },
        ],
      },
  
      // Detail sections
      { key: 'detail_title', label: 'Detailed Values — section title', type: 'text' },
      { key: 'integrity_title', label: 'Scientific Integrity — heading', type: 'text' },
      {
        key: 'integrity_body',
        label: 'Scientific Integrity — body paragraph',
        type: 'textarea',
        rich: true,
      },
      {
        key: 'integrity_items',
        label: 'Scientific Integrity — bullet items',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      { key: 'excellence_title', label: 'Editorial Excellence — heading', type: 'text' },
      {
        key: 'excellence_body',
        label: 'Editorial Excellence — body paragraph',
        type: 'textarea',
        rich: true,
      },
      {
        key: 'excellence_items',
        label: 'Editorial Excellence — bullet items',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      { key: 'diversity_title', label: 'Diversity & Inclusion — heading', type: 'text' },
      {
        key: 'diversity_body',
        label: 'Diversity & Inclusion — body paragraph',
        type: 'textarea',
        rich: true,
      },
      {
        key: 'diversity_items',
        label: 'Diversity & Inclusion — bullet items',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      { key: 'openscience_title', label: 'Open Science Commitment — heading', type: 'text' },
      {
        key: 'openscience_body',
        label: 'Open Science Commitment — body paragraph',
        type: 'textarea',
        rich: true,
      },
      {
        key: 'openscience_items',
        label: 'Open Science Commitment — bullet items',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
  
      // Promise section
      { key: 'promise_title', label: 'Promise — section title', type: 'text' },
      { key: 'promise_authors_title', label: 'Promise — "To Authors" column title', type: 'text' },
      {
        key: 'promise_authors',
        label: 'Promise — To Authors bullets',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      { key: 'promise_readers_title', label: 'Promise — "To Readers" column title', type: 'text' },
      {
        key: 'promise_readers',
        label: 'Promise — To Readers bullets',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Item', type: 'text' }],
      },
      {
        key: 'quote',
        label: 'Blockquote text',
        type: 'textarea',
        help: 'The editorial team quote shown at the bottom. Plain text.',
      },
      { key: 'quote_author', label: 'Blockquote attribution', type: 'text' },
    ],
  },

  'ethics-process': {
    key: 'ethics-process',
    label: 'Ethics & Process (designed layout)',
    route: '/about-journal/ethics-process',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Intro paragraph', type: 'textarea' },
  
      { key: 'pub_ethics_title', label: 'Publication Ethics — section title', type: 'text' },
      { key: 'pub_ethics_intro', label: 'Publication Ethics — intro paragraph', type: 'textarea', rich: true },
      {
        key: 'pub_ethics_sections',
        label: 'Publication Ethics — responsibility sections',
        type: 'list',
        fixedCount: 2,
        help: 'Exactly 2 sections (Author Responsibilities, Editor Responsibilities). Each has up to 5 bullet points.',
        itemFields: [
          { key: 'title', label: 'Section title', type: 'text' },
          { key: 'point1', label: 'Point 1', type: 'text' },
          { key: 'point2', label: 'Point 2', type: 'text' },
          { key: 'point3', label: 'Point 3', type: 'text' },
          { key: 'point4', label: 'Point 4', type: 'text' },
          { key: 'point5', label: 'Point 5', type: 'text' },
        ],
      },
  
      { key: 'peer_review_title', label: 'Peer Review Process — section title', type: 'text' },
      { key: 'peer_review_intro', label: 'Peer Review Process — intro paragraph', type: 'textarea' },
      {
        key: 'peer_review_steps',
        label: 'Peer Review Steps',
        type: 'list',
        fixedCount: 6,
        help: 'Exactly 6 numbered steps.',
        itemFields: [
          { key: 'step', label: 'Step number', type: 'text' },
          { key: 'title', label: 'Step title', type: 'text' },
          { key: 'duration', label: 'Duration (e.g. 3-5 days)', type: 'text' },
          { key: 'description', label: 'Step description', type: 'textarea' },
        ],
      },
  
      { key: 'misconduct_title', label: 'Research Misconduct — section title', type: 'text' },
      { key: 'misconduct_intro', label: 'Research Misconduct — intro paragraph', type: 'textarea' },
      {
        key: 'misconduct_types',
        label: 'Misconduct Types',
        type: 'list',
        fixedCount: 3,
        itemFields: [
          { key: 'type', label: 'Misconduct type', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'action', label: 'Action taken', type: 'text' },
        ],
      },
  
      { key: 'ethics_standards_title', label: 'Ethics Standards (sidebar) — title', type: 'text' },
      {
        key: 'ethics_standards',
        label: 'Ethics Standards',
        type: 'list',
        fixedCount: 3,
        itemFields: [
          { key: 'title', label: 'Standard title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'badge', label: 'Badge label', type: 'text' },
        ],
      },
  
      { key: 'report_concerns_title', label: 'Report Concerns — title', type: 'text' },
      { key: 'report_concerns_intro', label: 'Report Concerns — intro', type: 'textarea' },
      { key: 'ethics_email_label', label: 'Ethics email label', type: 'text' },
      { key: 'ethics_email', label: 'Ethics email address', type: 'text' },
      { key: 'editorial_email_label', label: 'Editorial office label', type: 'text' },
      { key: 'editorial_email', label: 'Editorial office email', type: 'text' },
  
      { key: 'timeline_title', label: 'Typical Timeline — title', type: 'text' },
      {
        key: 'timeline',
        label: 'Timeline entries',
        type: 'list',
        fixedCount: 4,
        itemFields: [
          { key: 'label', label: 'Stage name', type: 'text' },
          { key: 'value', label: 'Duration', type: 'text' },
        ],
      },
  
      { key: 'reviewer_program_title', label: 'Reviewer Program — title', type: 'text' },
      { key: 'reviewer_program_intro', label: 'Reviewer Program — intro', type: 'textarea' },
      {
        key: 'reviewer_benefits',
        label: 'Reviewer benefits (checklist)',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Benefit', type: 'text' }],
      },
    ],
  },

  'history': {
    key: 'history',
    label: 'History & Milestones (designed layout)',
    route: '/about-journal/history',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', rich: true },
  
      // Timeline
      { key: 'timeline_title', label: 'Our Journey — section title', type: 'text' },
      {
        key: 'timeline_items',
        label: 'Timeline entries',
        type: 'list',
        help: 'Add, edit, or reorder timeline entries. The first entry gets the accent border colour.',
        itemFields: [
          { key: 'year', label: 'Year', type: 'text' },
          { key: 'title', label: 'Milestone title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea', rich: true },
        ],
      },
  
      // Key Achievements
      { key: 'achievements_title', label: 'Key Achievements — section title', type: 'text' },
      {
        key: 'achievements_items',
        label: 'Key Achievements — statistics (4 fixed slots)',
        type: 'list',
        fixedCount: 4,
        help: 'Exactly 4 stat boxes. Slot colours are fixed: blue, green, yellow, purple.',
        itemFields: [
          { key: 'value', label: 'Statistic value (e.g. 5,000+)', type: 'text' },
          { key: 'label', label: 'Statistic label', type: 'text' },
        ],
      },
  
      // Looking Forward
      { key: 'forward_title', label: 'Looking Forward — section title', type: 'text' },
      { key: 'forward_body', label: 'Looking Forward — intro paragraph', type: 'textarea', rich: true },
      {
        key: 'forward_items',
        label: 'Looking Forward — items (3 fixed slots)',
        type: 'list',
        fixedCount: 3,
        help: 'Exactly 3 forward-looking items. Icons per slot are fixed: Globe, Milestone, TrendingUp.',
        itemFields: [
          { key: 'title', label: 'Item title', type: 'text' },
          { key: 'description', label: 'Short description', type: 'textarea' },
        ],
      },
    ],
  },

  'indexing': {
    key: 'indexing',
    label: 'Indexing & Abstracting (designed layout)',
    route: '/about-journal/indexing',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'subtitle', label: 'Intro paragraph', type: 'textarea' },
  
      { key: 'major_dbs_title', label: 'Major Scientific Databases — section title', type: 'text' },
      {
        key: 'major_indexes',
        label: 'Major Scientific Databases',
        type: 'list',
        fixedCount: 3,
        help: 'Exactly 3 entries. Icons and the "Premium" badge are fixed per slot.',
        itemFields: [
          { key: 'name', label: 'Database name', type: 'text' },
          { key: 'provider', label: 'Provider', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'coverage', label: 'Coverage', type: 'text' },
          { key: 'status', label: 'Status (e.g. Active, Historical)', type: 'text' },
          { key: 'since', label: 'Since (year)', type: 'text' },
        ],
      },
  
      { key: 'metrics_title', label: 'Citation Metrics & Impact — section title', type: 'text' },
      {
        key: 'metrics',
        label: 'Citation Metrics',
        type: 'list',
        fixedCount: 4,
        itemFields: [
          { key: 'metric', label: 'Metric name', type: 'text' },
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'provider', label: 'Source / provider', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
  
      { key: 'benefits_title', label: 'Benefits for Authors & Readers — section title', type: 'text' },
      { key: 'author_benefits_title', label: 'Author benefits column title', type: 'text' },
      {
        key: 'author_benefits',
        label: 'Author benefits (checklist)',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Benefit', type: 'text' }],
      },
      { key: 'reader_benefits_title', label: 'Reader benefits column title', type: 'text' },
      {
        key: 'reader_benefits',
        label: 'Reader benefits (checklist)',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Benefit', type: 'text' }],
      },
  
      { key: 'stats_title', label: 'Indexing Statistics (sidebar) — title', type: 'text' },
      {
        key: 'stats',
        label: 'Indexing Statistics tiles',
        type: 'list',
        fixedCount: 3,
        itemFields: [
          { key: 'value', label: 'Stat value', type: 'text' },
          { key: 'label', label: 'Stat label', type: 'text' },
        ],
      },
  
      { key: 'additional_dbs_title', label: 'Additional Databases — section title', type: 'text' },
      {
        key: 'additional_dbs',
        label: 'Additional Databases (checklist)',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Database name', type: 'text' }],
      },
  
      { key: 'for_authors_title', label: 'For Authors (sidebar) — title', type: 'text' },
      { key: 'for_authors_intro', label: 'For Authors — intro line', type: 'textarea' },
      {
        key: 'for_authors_tips',
        label: 'For Authors — tips (bullet list)',
        type: 'list',
        itemFields: [{ key: 'text', label: 'Tip', type: 'text' }],
      },
  
      { key: 'inquiries_title', label: 'Indexing Inquiries — title', type: 'text' },
      { key: 'inquiries_email_label', label: 'Inquiries email label', type: 'text' },
      { key: 'inquiries_email', label: 'Inquiries email address', type: 'text' },
      { key: 'inquiries_body', label: 'Inquiries body text', type: 'textarea' },
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
