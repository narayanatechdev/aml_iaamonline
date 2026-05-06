export interface FeaturedArticle {
  id: string;
  type: 'Research Article' | 'Review' | 'Letter' | 'Communication';
  title: string;
  authors: string[];
  affiliations: string[];
  abstract: string;
  subject: string;
  published: string;
  year: number;
  volume: string;
  issue: string;
  doi: string;
  pages: string;
  views: number;
  cited: number;
  keywords: string[];
}

export interface Subject {
  id: string;
  name: string;
  count: number;
}

export interface ArchiveVolume {
  year: number;
  volumes: Array<{
    vol: number;
    issues: number[];
  }>;
}

export const JOURNAL_INFO = {
  currentVolume: '25',
  currentIssue: '2',
  currentYear: '2025',
  issn: '0976-3961',
  eISSN: '1998-0140',
};

export const FEATURED_ARTICLES: FeaturedArticle[] = [
  {
    id: '1',
    type: 'Research Article',
    title: 'Graphene-based Nanocomposites: Synthesis and Applications',
    authors: ['Dr. Sarah Chen', 'Prof. Michael Johnson', 'Dr. Robert Lee'],
    affiliations: ['Department of Nanotechnology, Institute of Materials Science', 'School of Engineering, Global Tech University'],
    abstract: 'This paper presents a comprehensive study of graphene-based nanocomposites with novel synthesis methods and their application in advanced materials, demonstrating superior mechanical and thermal properties.',
    subject: 'Nanotechnology',
    published: '2025-04-15',
    year: 2025,
    volume: '25',
    issue: '2',
    doi: '10.1234/aml.2025.001',
    pages: '45-62',
    views: 1250,
    cited: 8,
    keywords: ['Graphene', 'Nanocomposites', 'Mechanical Properties', 'Thermal Transport', 'Advanced Synthesis'],
  },
  {
    id: '2',
    type: 'Review',
    title: 'Perovskite Solar Cells: Recent Advances and Challenges',
    authors: ['Prof. Elena Rodriguez', 'Dr. James Wilson'],
    affiliations: ['Energy Research Centre, Mediterranean University', 'Department of Applied Physics, North State University'],
    abstract: 'A comprehensive review of recent advances in perovskite solar cell technology, including efficiency improvements and stability enhancement strategies for next-generation photovoltaics.',
    subject: 'Energy Materials',
    published: '2025-04-10',
    year: 2025,
    volume: '25',
    issue: '2',
    doi: '10.1234/aml.2025.002',
    pages: '15-42',
    views: 2150,
    cited: 24,
    keywords: ['Perovskite', 'Solar Cells', 'Photovoltaics', 'Energy Conversion', 'Stability'],
  },
  {
    id: '3',
    type: 'Research Article',
    title: 'Sustainable Production of Biodegradable Polymers',
    authors: ['Dr. Ravi Patel', 'Prof. Lisa Anderson'],
    affiliations: ['Center for Sustainable Chemistry, Green City Institute'],
    abstract: 'Novel approaches to manufacturing sustainable and biodegradable polymers with reduced environmental impact and improved mechanical properties.',
    subject: 'Biomaterials',
    published: '2025-04-05',
    year: 2025,
    volume: '25',
    issue: '2',
    doi: '10.1234/aml.2025.003',
    pages: '78-94',
    views: 895,
    cited: 5,
    keywords: ['Biopolymers', 'Biodegradable', 'Sustainability', 'Polymer Science', 'Green Chemistry'],
  },
  {
    id: '4',
    type: 'Communication',
    title: '2D Materials for Next-Generation Electronics',
    authors: ['Dr. Wei Zhang', 'Prof. Yuki Tanaka', 'Dr. Maria Garcia'],
    affiliations: ['Advanced Electronics Laboratory, East Asia University', 'Materials Research Unit, University of Science'],
    abstract: 'Rapid communication on the development of novel 2D materials for electronic applications, demonstrating promising characteristics for transistors and sensors.',
    subject: '2D Materials',
    published: '2025-03-28',
    year: 2025,
    volume: '25',
    issue: '1',
    doi: '10.1234/aml.2025.004',
    pages: '112-119',
    views: 1450,
    cited: 3,
    keywords: ['2D Materials', 'TMDs', 'Transistors', 'Flexible Electronics', 'Nanofabrication'],
  },
];

export const SUBJECTS: Subject[] = [
  { id: 'nano', name: 'Nanotechnology', count: 145 },
  { id: 'biomaterials', name: 'Biomaterials', count: 92 },
  { id: 'energy', name: 'Energy Materials', count: 178 },
  { id: '2d', name: '2D Materials', count: 67 },
  { id: 'composites', name: 'Composites', count: 124 },
  { id: 'polymers', name: 'Polymer Science', count: 156 },
  { id: 'electronics', name: 'Electronic Materials', count: 89 },
  { id: 'surface', name: 'Surface Science', count: 73 },
];

export const ARCHIVE_VOLUMES: ArchiveVolume[] = [
  {
    year: 2025,
    volumes: [
      { vol: 25, issues: [1, 2, 3, 4, 5, 6] },
    ],
  },
  {
    year: 2024,
    volumes: [
      { vol: 24, issues: [1, 2, 3, 4, 5, 6] },
    ],
  },
];
