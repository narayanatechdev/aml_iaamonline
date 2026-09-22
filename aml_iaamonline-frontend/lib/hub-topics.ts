/**
 * The hub's browse taxonomy, and how each topic maps onto the subject values
 * AML and AMP actually store on their articles.
 *
 * The ten topics below are the ones already published on the home page
 * (components/hub/MaterialsAreas.tsx) and in the header's Topics menu, so the
 * slugs are load-bearing — they are live URLs. The `subjects` list is the
 * honest part: every entry is a real subject string returned by
 * GET /api/subjects on one of the two journals, matched with the API's
 * case-insensitive LIKE filter.
 *
 * Three topics map to nothing yet. AML and AMP have never tagged an article
 * "metallurgy", "quantum" or "AI-designed", so those pages show an empty
 * state rather than borrowing articles from a neighbouring field.
 */
export interface HubTopic {
  slug: string;
  label: string;
  text: string;
  tint: string;
  ink: string;
  /** Real subject values from GET /api/subjects, matched with the `subject` LIKE filter. */
  subjects: string[];
}

export const HUB_TOPICS: HubTopic[] = [
  {
    slug: 'advanced-materials',
    label: 'Advanced Materials',
    text: 'Functional, smart and hybrid materials, composites, coatings and thin films.',
    tint: '#E8F0FF',
    ink: '#1546E0',
    subjects: ['Materials Science', 'Surface Science', 'Functional Materials', 'Thin Films'],
  },
  {
    slug: 'energy-materials',
    label: 'Energy Materials',
    text: 'Batteries, solar cells, fuel cells, hydrogen storage, supercapacitors and thermoelectrics.',
    tint: '#FFF4DB',
    ink: '#B45309',
    subjects: ['Energy Materials'],
  },
  {
    slug: 'biomaterials',
    label: 'Biomaterials',
    text: 'Tissue scaffolds, implants, drug delivery, biosensors and bioinspired design.',
    tint: '#FFE8EF',
    ink: '#BE185D',
    subjects: ['Biomaterials', 'Biosensors'],
  },
  {
    slug: 'nanomaterials',
    label: 'Nanomaterials',
    text: 'Nanoparticles, nanotubes, two-dimensional layers, quantum dots and nanocomposites.',
    tint: '#F1E8FF',
    ink: '#6D28D9',
    subjects: ['Nanomaterials', 'Nanotechnology', '2D Materials'],
  },
  {
    slug: 'sustainable-circular-materials',
    label: 'Sustainable & Circular Materials',
    text: 'Bio-based and recyclable materials, life-cycle design, waste recovery and green chemistry.',
    tint: '#DDF7E9',
    ink: '#0E7A45',
    subjects: ['Green Materials', 'Sustainable'],
  },
  {
    slug: 'electronic-materials',
    label: 'Electronic Materials',
    text: 'Semiconductors, dielectrics, flexible and printed electronics, photonics and sensors.',
    tint: '#DDF4FA',
    ink: '#0E7490',
    subjects: ['Electronic Materials', 'Bioelectronics'],
  },
  {
    slug: 'metallurgy-rare-earth-materials',
    label: 'Metallurgy & Rare-Earth Materials',
    text: 'Alloys, magnets, critical minerals, extraction, corrosion and high-temperature behaviour.',
    tint: '#E9EDF3',
    ink: '#334155',
    subjects: [],
  },
  {
    slug: 'structural-engineering-materials',
    label: 'Structural & Engineering Materials',
    text: 'Ceramics, polymers, concrete, lightweight structures, fatigue and fracture.',
    tint: '#FFEBDD',
    ink: '#C2410C',
    subjects: ['Composites', 'Polymer Science', 'Polymers'],
  },
  {
    slug: 'ai-materials-discovery',
    label: 'AI & Materials Discovery',
    text: 'Machine learning, materials informatics, high-throughput screening and autonomous laboratories.',
    tint: '#E6E9FF',
    ink: '#4338CA',
    subjects: [],
  },
  {
    slug: 'quantum-materials',
    label: 'Quantum Materials',
    text: 'Superconductors, topological phases, spintronics and materials for quantum devices.',
    tint: '#D9F5F0',
    ink: '#0F766E',
    subjects: [],
  },
];

export function findTopic(slug: string): HubTopic | undefined {
  return HUB_TOPICS.find((t) => t.slug === slug);
}
