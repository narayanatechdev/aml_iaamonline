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
import {
  Atom,
  Building2,
  BrainCircuit,
  CircuitBoard,
  Dna,
  Layers,
  type LucideIcon,
  Magnet,
  Orbit,
  Recycle,
  Zap,
} from 'lucide-react';

export interface HubTopic {
  slug: string;
  label: string;
  text: string;
  /** Icon chip colours. One brand colour across every topic. */
  accent: string;
  /** Tile photograph. Absent until artwork is supplied; the tile falls back to its icon. */
  photo?: string;
  /** The tile icon. One icon per topic, rendered in a single accent colour. */
  icon: LucideIcon;
  /** Real subject values from GET /api/subjects, matched with the `subject` LIKE filter. */
  subjects: string[];
}

export const HUB_TOPICS: HubTopic[] = [
  {
    slug: 'advanced-materials',
    label: 'Advanced Materials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Functional, smart and hybrid materials, composites, coatings and thin films.',
    icon: Layers,
    subjects: ['Materials Science', 'Surface Science', 'Functional Materials', 'Thin Films'],
  },
  {
    slug: 'energy-materials',
    label: 'Energy Materials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Batteries, solar cells, fuel cells, hydrogen storage, supercapacitors and thermoelectrics.',
    icon: Zap,
    subjects: ['Energy Materials'],
  },
  {
    slug: 'biomaterials',
    label: 'Biomaterials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Tissue scaffolds, implants, drug delivery, biosensors and bioinspired design.',
    icon: Dna,
    subjects: ['Biomaterials', 'Biosensors'],
  },
  {
    slug: 'nanomaterials',
    label: 'Nanomaterials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Nanoparticles, nanotubes, two-dimensional layers, quantum dots and nanocomposites.',
    icon: Atom,
    subjects: ['Nanomaterials', 'Nanotechnology', '2D Materials'],
  },
  {
    slug: 'sustainable-circular-materials',
    label: 'Sustainable & Circular Materials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Bio-based and recyclable materials, life-cycle design, waste recovery and green chemistry.',
    icon: Recycle,
    subjects: ['Green Materials', 'Sustainable'],
  },
  {
    slug: 'electronic-materials',
    label: 'Electronic Materials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Semiconductors, dielectrics, flexible and printed electronics, photonics and sensors.',
    icon: CircuitBoard,
    subjects: ['Electronic Materials', 'Bioelectronics'],
  },
  {
    slug: 'metallurgy-rare-earth-materials',
    label: 'Metallurgy & Rare-Earth Materials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Alloys, magnets, critical minerals, extraction, corrosion and high-temperature behaviour.',
    icon: Magnet,
    subjects: [],
  },
  {
    slug: 'structural-engineering-materials',
    label: 'Structural & Engineering Materials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Ceramics, polymers, concrete, lightweight structures, fatigue and fracture.',
    icon: Building2,
    subjects: ['Composites', 'Polymer Science', 'Polymers'],
  },
  {
    slug: 'ai-materials-discovery',
    label: 'AI & Materials Discovery',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Machine learning, materials informatics, high-throughput screening and autonomous laboratories.',
    icon: BrainCircuit,
    subjects: [],
  },
  {
    slug: 'quantum-materials',
    label: 'Quantum Materials',
    accent: 'bg-[#EAF1FD] text-[var(--brand)]',
    text: 'Superconductors, topological phases, spintronics and materials for quantum devices.',
    icon: Orbit,
    subjects: [],
  },
];

export function findTopic(slug: string): HubTopic | undefined {
  return HUB_TOPICS.find((t) => t.slug === slug);
}
