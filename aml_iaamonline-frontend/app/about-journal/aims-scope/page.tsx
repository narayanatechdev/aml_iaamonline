"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Microscope, Atom, Cpu, Leaf, Zap, Globe, BookOpen, Users, CheckCircle } from 'lucide-react';

export default function AimsScope() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>Aims & Scope</h1>
          <p className="text-[#5a6a8a] text-lg leading-relaxed">
            Advanced Materials Letters serves as a premier platform for cutting-edge research in materials science, engineering, and nanotechnology.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Journal Scope & Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#3a4a6a] leading-relaxed">
                  <strong>Advanced Materials Letters (AML)</strong> is committed to publishing high-quality, original research that advances the fundamental understanding and practical application of materials science. Our scope encompasses the entire spectrum of materials research, from fundamental studies to applied engineering solutions.
                </p>
                <p className="text-[#3a4a6a] leading-relaxed">
                  The journal welcomes contributions that demonstrate significant innovation in materials synthesis, characterization, processing, and applications. We particularly encourage submissions that bridge the gap between laboratory research and real-world applications, fostering technological advancement and industrial development.
                </p>
                <p className="text-[#3a4a6a] leading-relaxed">
                  AML aims to be a global forum for researchers, scientists, and engineers to share breakthrough discoveries, novel methodologies, and emerging trends in materials science, supporting the advancement of sustainable technologies and next-generation materials.
                </p>
              </CardContent>
            </Card>

            {/* Research Areas */}
            <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <Microscope className="w-5 h-5" />
                  Core Research Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-1 gap-6">
                  {[
                    {
                      icon: <Atom className="w-5 h-5 text-[#c9a227]" />,
                      title: "Nanomaterials & Nanotechnology",
                      desc: "Synthesis, characterization, and applications of nanostructured materials including nanoparticles, nanowires, nanotubes, quantum dots, and nanocomposites."
                    },
                    {
                      icon: <Leaf className="w-5 h-5 text-emerald-500" />,
                      title: "Biomaterials & Bioengineering",
                      desc: "Biocompatible materials, tissue engineering scaffolds, drug delivery systems, biosensors, and materials for medical applications."
                    },
                    {
                      icon: <Zap className="w-5 h-5 text-amber-500" />,
                      title: "Energy Materials",
                      desc: "Materials for energy storage and conversion including batteries, fuel cells, solar cells, thermoelectrics, and supercapacitors."
                    },
                    {
                      icon: <Cpu className="w-5 h-5 text-blue-500" />,
                      title: "Electronic & Photonic Materials",
                      desc: "Semiconductors, conductors, dielectrics, magnetic materials, optical materials, and materials for electronic devices."
                    }
                  ].map((area, index) => (
                    <div key={index} className="py-4 border-b border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0f2d6b]/10 flex items-center justify-center mt-1">
                          {area.icon}
                        </div>
                        <div>
                          <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>{area.title}</h4>
                          <p className="text-[#5a6a8a] text-xs leading-relaxed">{area.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submission Guidelines */}
            <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Submission Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#3a4a6a] leading-relaxed">
                  AML welcomes original research contributions that meet our standards for scientific rigor and innovation. All submissions undergo rigorous peer review to ensure quality and significance.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Original and unpublished research",
                    "Significant scientific contribution",
                    "Clear methodology and analysis",
                    "Reproducible results",
                    "Ethical research practices",
                    "Proper attribution and citations"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-[#3a4a6a] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Material Categories */}
            <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Material Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      category: "Advanced Ceramics",
                      materials: ["Structural ceramics", "Functional ceramics", "Bioceramics"]
                    },
                    {
                      category: "Polymers & Composites",
                      materials: ["Smart polymers", "Polymer nanocomposites", "Biodegradable polymers"]
                    },
                    {
                      category: "Metals & Alloys",
                      materials: ["High-entropy alloys", "Shape memory alloys", "Lightweight metals"]
                    },
                    {
                      category: "2D Materials",
                      materials: ["Graphene", "TMDCs", "MXenes"]
                    }
                  ].map((cat, index) => (
                    <div key={index} className="pb-3 border-b border-border last:border-b-0">
                      <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>{cat.category}</h4>
                      <div className="space-y-1">
                        {cat.materials.map((material, idx) => (
                          <div key={idx} className="text-[#5a6a8a] text-xs">• {material}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Areas */}
            <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Application Domains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Aerospace",
                    "Automotive", 
                    "Electronics",
                    "Healthcare",
                    "Energy Storage",
                    "Catalysis",
                    "Sensors",
                    "Coatings",
                    "Construction",
                    "Environmental"
                  ].map((area) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Characterization Methods */}
            <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-[#0f2d6b] text-lg">Key Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-[#5a6a8a] text-xs">
                  <div>• X-ray Diffraction (XRD)</div>
                  <div>• Electron Microscopy (SEM/TEM)</div>
                  <div>• Spectroscopy (XPS, FTIR, Raman)</div>
                  <div>• Thermal Analysis (DSC, TGA)</div>
                  <div>• Mechanical Testing</div>
                  <div>• Surface Analysis (AFM, STM)</div>
                  <div>• Computational Modeling</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Special Issues & Features */}
        <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Special Features & Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Sustainable Materials",
                  desc: "Research on environmentally friendly materials, recycling technologies, and circular economy approaches.",
                  highlight: true
                },
                {
                  title: "AI-Driven Materials Discovery",
                  desc: "Machine learning applications in materials design, high-throughput screening, and predictive modeling.",
                  highlight: true
                },
                {
                  title: "Smart & Responsive Materials",
                  desc: "Self-healing materials, shape-memory alloys, and stimuli-responsive polymers.",
                  highlight: false
                },
                {
                  title: "Quantum Materials",
                  desc: "Materials with quantum properties for next-generation electronics and computing applications.",
                  highlight: false
                },
                {
                  title: "Multifunctional Materials",
                  desc: "Materials combining multiple properties such as structural and functional characteristics.",
                  highlight: false
                },
                {
                  title: "Industry 4.0 Materials",
                  desc: "Advanced materials for additive manufacturing, IoT sensors, and smart manufacturing.",
                  highlight: false
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-4 border-b transition-all ${
                    feature.highlight 
                      ? 'border-[#c9a227] bg-[#c9a227]/5 hover:bg-[#c9a227]/10' 
                      : 'border-gray-200 hover:bg-[#f0f4fb]'
                  }`}
                >
                  <h4 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>
                    {feature.title}
                    {feature.highlight && <Badge variant="secondary" className="ml-2 text-xs">Featured</Badge>}
                  </h4>
                  <p className="text-[#5a6a8a] text-xs leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
