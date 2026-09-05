"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Microscope, Atom, Cpu, Leaf, Zap, Globe, BookOpen, Users, CheckCircle } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

const DEFAULT_SCOPE_PARAGRAPHS = [
  { text: 'Advanced Materials Letters (AML) is committed to publishing high-quality, original research that advances the fundamental understanding and practical application of materials science. Our scope encompasses the entire spectrum of materials research, from fundamental studies to applied engineering solutions.' },
  { text: 'The journal welcomes contributions that demonstrate significant innovation in materials synthesis, characterization, processing, and applications. We particularly encourage submissions that bridge the gap between laboratory research and real-world applications, fostering technological advancement and industrial development.' },
  { text: 'AML aims to be a global forum for researchers, scientists, and engineers to share breakthrough discoveries, novel methodologies, and emerging trends in materials science, supporting the advancement of sustainable technologies and next-generation materials.' },
];

const DEFAULT_RESEARCH_AREAS = [
  { title: 'Nanomaterials & Nanotechnology', description: 'Synthesis, characterization, and applications of nanostructured materials including nanoparticles, nanowires, nanotubes, quantum dots, and nanocomposites.' },
  { title: 'Biomaterials & Bioengineering', description: 'Biocompatible materials, tissue engineering scaffolds, drug delivery systems, biosensors, and materials for medical applications.' },
  { title: 'Energy Materials', description: 'Materials for energy storage and conversion including batteries, fuel cells, solar cells, thermoelectrics, and supercapacitors.' },
  { title: 'Electronic & Photonic Materials', description: 'Semiconductors, conductors, dielectrics, magnetic materials, optical materials, and materials for electronic devices.' },
];

const RESEARCH_AREA_ICONS = [
  <Atom key={0} className="w-5 h-5 text-[#c9a227]" />,
  <Leaf key={1} className="w-5 h-5 text-emerald-500" />,
  <Zap key={2} className="w-5 h-5 text-amber-500" />,
  <Cpu key={3} className="w-5 h-5 text-blue-500" />,
];

const DEFAULT_SUBMISSION_CRITERIA = [
  { text: 'Original and unpublished research' },
  { text: 'Significant scientific contribution' },
  { text: 'Clear methodology and analysis' },
  { text: 'Reproducible results' },
  { text: 'Ethical research practices' },
  { text: 'Proper attribution and citations' },
];

const DEFAULT_MATERIAL_CATEGORIES = [
  { category: 'Advanced Ceramics', item1: 'Structural ceramics', item2: 'Functional ceramics', item3: 'Bioceramics' },
  { category: 'Polymers & Composites', item1: 'Smart polymers', item2: 'Polymer nanocomposites', item3: 'Biodegradable polymers' },
  { category: 'Metals & Alloys', item1: 'High-entropy alloys', item2: 'Shape memory alloys', item3: 'Lightweight metals' },
  { category: '2D Materials', item1: 'Graphene', item2: 'TMDCs', item3: 'MXenes' },
];

const DEFAULT_APP_DOMAINS = [
  { text: 'Aerospace' }, { text: 'Automotive' }, { text: 'Electronics' },
  { text: 'Healthcare' }, { text: 'Energy Storage' }, { text: 'Catalysis' },
  { text: 'Sensors' }, { text: 'Coatings' }, { text: 'Construction' }, { text: 'Environmental' },
];

const DEFAULT_TECHNIQUES = [
  { text: 'X-ray Diffraction (XRD)' },
  { text: 'Electron Microscopy (SEM/TEM)' },
  { text: 'Spectroscopy (XPS, FTIR, Raman)' },
  { text: 'Thermal Analysis (DSC, TGA)' },
  { text: 'Mechanical Testing' },
  { text: 'Surface Analysis (AFM, STM)' },
  { text: 'Computational Modeling' },
];

const DEFAULT_FEATURES = [
  { title: 'Sustainable Materials', description: 'Research on environmentally friendly materials, recycling technologies, and circular economy approaches.' },
  { title: 'AI-Driven Materials Discovery', description: 'Machine learning applications in materials design, high-throughput screening, and predictive modeling.' },
  { title: 'Smart & Responsive Materials', description: 'Self-healing materials, shape-memory alloys, and stimuli-responsive polymers.' },
  { title: 'Quantum Materials', description: 'Materials with quantum properties for next-generation electronics and computing applications.' },
  { title: 'Multifunctional Materials', description: 'Materials combining multiple properties such as structural and functional characteristics.' },
  { title: 'Industry 4.0 Materials', description: 'Advanced materials for additive manufacturing, IoT sensors, and smart manufacturing.' },
];

const FEATURE_HIGHLIGHT = [true, true, false, false, false, false];

export default function AimsScopeStatic({
  content = {},
  flat = false,
}: {
  content?: PageContentData;
  /** true = flat card styling used on /about-journal/aims-scope */
  flat?: boolean;
}) {
  const title = pickText(content, 'title', 'Aims & Scope');
  const subtitle = pickText(content, 'subtitle', 'Advanced Materials Letters serves as a premier platform for cutting-edge research in materials science, engineering, and nanotechnology.');

  const scopeTitle = pickText(content, 'scope_title', 'Journal Scope & Mission');
  const scopeParagraphs = pickList<{ text: string }>(content, 'scope_paragraphs', DEFAULT_SCOPE_PARAGRAPHS);

  const researchAreasTitle = pickText(content, 'research_areas_title', 'Core Research Areas');
  const researchAreas = pickList<{ title: string; description: string }>(content, 'research_areas', DEFAULT_RESEARCH_AREAS, 4);

  const submissionTitle = pickText(content, 'submission_title', 'Submission Criteria');
  const submissionIntro = pickText(content, 'submission_intro', 'AML welcomes original research contributions that meet our standards for scientific rigor and innovation. All submissions undergo rigorous peer review to ensure quality and significance.');
  const submissionCriteria = pickList<{ text: string }>(content, 'submission_criteria', DEFAULT_SUBMISSION_CRITERIA);

  const materialCategoriesTitle = pickText(content, 'material_categories_title', 'Material Categories');
  const materialCategories = pickList<{ category: string; item1: string; item2: string; item3: string }>(content, 'material_categories', DEFAULT_MATERIAL_CATEGORIES, 4);

  const appDomainsTitle = pickText(content, 'app_domains_title', 'Application Domains');
  const appDomains = pickList<{ text: string }>(content, 'app_domains', DEFAULT_APP_DOMAINS);

  const techniquesTitle = pickText(content, 'techniques_title', 'Key Techniques');
  const techniques = pickList<{ text: string }>(content, 'techniques', DEFAULT_TECHNIQUES);

  const featuresTitle = pickText(content, 'features_title', 'Special Features & Focus Areas');
  const features = pickList<{ title: string; description: string }>(content, 'features', DEFAULT_FEATURES, 6);

  const cardCls = flat
    ? 'mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent'
    : 'mb-8';
  const lastCardCls = flat
    ? 'border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent'
    : '';

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: '2rem', fontWeight: 700 }}>{title}</h1>
          <CmsRichText value={subtitle} className="text-[#5a6a8a] text-lg leading-relaxed" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Journal Scope & Mission */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {scopeTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scopeParagraphs.map((p, i) => (
                  <CmsRichText key={i} value={p.text} className="text-[#3a4a6a] leading-relaxed" />
                ))}
              </CardContent>
            </Card>

            {/* Core Research Areas */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Microscope className="w-5 h-5" />
                  {researchAreasTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-1 gap-6">
                  {researchAreas.map((area, index) => (
                    <div
                      key={index}
                      className={
                        flat
                          ? 'py-4 border-b border-gray-200'
                          : 'p-4 border border-border rounded-lg hover:bg-[#f0f4fb] transition-colors'
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0f2d6b]/10 flex items-center justify-center mt-1">
                          {RESEARCH_AREA_ICONS[index]}
                        </div>
                        <div>
                          <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>{area.title}</h4>
                          <p className="text-[#5a6a8a] text-xs leading-relaxed">{area.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submission Criteria */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {submissionTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CmsRichText value={submissionIntro} className="text-[#3a4a6a] leading-relaxed" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {submissionCriteria.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#3a4a6a] text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Material Categories */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {materialCategoriesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materialCategories.map((cat, index) => (
                    <div key={index} className="pb-3 border-b border-border last:border-b-0">
                      <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>{cat.category}</h4>
                      <div className="space-y-1">
                        {[cat.item1, cat.item2, cat.item3].filter(Boolean).map((material, idx) => (
                          <div key={idx} className="text-[#5a6a8a] text-xs">• {material}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Domains */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {appDomainsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {appDomains.map((domain, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {domain.text}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Techniques */}
            <Card className={lastCardCls}>
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">{techniquesTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-[#5a6a8a] text-xs">
                  {techniques.map((t, i) => (
                    <div key={i}>• {t.text}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Special Features & Focus Areas */}
        <Card className={lastCardCls}>
          <CardHeader>
            <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {featuresTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const highlight = FEATURE_HIGHLIGHT[index] ?? false;
                return (
                  <div
                    key={index}
                    className={
                      flat
                        ? `p-4 border-b transition-all ${highlight ? 'border-[#c9a227] bg-[#c9a227]/5 hover:bg-[#c9a227]/10' : 'border-gray-200 hover:bg-[#f0f4fb]'}`
                        : `p-4 border rounded-lg transition-all ${highlight ? 'border-[#c9a227] bg-[#c9a227]/5 hover:bg-[#c9a227]/10' : 'border-border hover:bg-[#f0f4fb]'}`
                    }
                  >
                    <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>
                      {feature.title}
                      {highlight && <Badge variant="secondary" className="ml-2 text-xs">Featured</Badge>}
                    </h4>
                    <p className="text-[#5a6a8a] text-xs leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
