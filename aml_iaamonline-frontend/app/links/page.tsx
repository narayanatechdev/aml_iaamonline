"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Users, Database, BookOpen, Globe, School, Building2, Award, Microscope } from 'lucide-react';

export default function Links() {
  const organizationLinks = [
    {
      name: "International Association of Advanced Materials (IAAM)",
      url: "https://www.iaamonline.org",
      description: "Our parent organization promoting advanced materials research worldwide",
      category: "Publisher",
      featured: true
    },
    {
      name: "IAAM Conferences",
      url: "https://www.iaamonline.org/conferences",
      description: "Global conferences and events in advanced materials science",
      category: "Events"
    },
    {
      name: "IAAM Awards",
      url: "https://www.iaamonline.org/awards", 
      description: "Recognition programs for outstanding contributions to materials science",
      category: "Awards"
    }
  ];

  const researchLinks = [
    {
      name: "Materials Research Society (MRS)",
      url: "https://www.mrs.org",
      description: "International organization advancing materials science",
      category: "Professional Society"
    },
    {
      name: "American Chemical Society (ACS)",
      url: "https://www.acs.org",
      description: "Leading professional organization for chemists and materials scientists",
      category: "Professional Society"
    },
    {
      name: "European Materials Research Society (E-MRS)",
      url: "https://www.european-mrs.eu",
      description: "European network for materials research communities",
      category: "Professional Society"
    },
    {
      name: "Institute of Materials, Minerals and Mining (IOM3)",
      url: "https://www.iom3.org",
      description: "UK-based professional body for materials, minerals and mining",
      category: "Professional Society"
    }
  ];

  const databaseLinks = [
    {
      name: "Scopus",
      url: "https://www.scopus.com",
      description: "Largest database of peer-reviewed literature",
      category: "Database"
    },
    {
      name: "Web of Science",
      url: "https://apps.webofknowledge.com",
      description: "Premier global citation database",
      category: "Database"
    },
    {
      name: "Directory of Open Access Journals (DOAJ)",
      url: "https://doaj.org",
      description: "Quality-assured directory of open access journals",
      category: "Database"
    },
    {
      name: "PubMed",
      url: "https://pubmed.ncbi.nlm.nih.gov",
      description: "Biomedical literature database",
      category: "Database"
    },
    {
      name: "Google Scholar",
      url: "https://scholar.google.com",
      description: "Freely accessible academic search engine",
      category: "Database"
    }
  ];

  const institutionLinks = [
    {
      name: "MIT Materials Science",
      url: "https://dmse.mit.edu",
      description: "Department of Materials Science and Engineering at MIT",
      category: "Academic Institution"
    },
    {
      name: "Stanford Materials Science",
      url: "https://mse.stanford.edu",
      description: "Materials Science and Engineering at Stanford University",
      category: "Academic Institution"
    },
    {
      name: "Cambridge Materials Science",
      url: "https://www.msm.cam.ac.uk",
      description: "Department of Materials Science and Metallurgy at Cambridge",
      category: "Academic Institution"
    },
    {
      name: "Max Planck Institute",
      url: "https://www.mpg.de",
      description: "Leading research institutes in materials science",
      category: "Research Institute"
    }
  ];

  const ethicsLinks = [
    {
      name: "Committee on Publication Ethics (COPE)",
      url: "https://publicationethics.org",
      description: "Guidelines and resources for publication ethics",
      category: "Ethics & Standards"
    },
    {
      name: "International Committee of Medical Journal Editors (ICMJE)",
      url: "http://www.icmje.org",
      description: "Recommendations for medical journal conduct and reporting",
      category: "Ethics & Standards"
    },
    {
      name: "ORCID",
      url: "https://orcid.org",
      description: "Persistent digital identifier for researchers",
      category: "Research Tools"
    },
    {
      name: "CrossRef",
      url: "https://www.crossref.org",
      description: "Digital Object Identifier (DOI) registration",
      category: "Research Tools"
    }
  ];

  const resourceLinks = [
    {
      name: "Materials Project",
      url: "https://materialsproject.org",
      description: "Open database of computed materials properties",
      category: "Research Resource"
    },
    {
      name: "NIST Materials Data Repository",
      url: "https://materialsdata.nist.gov",
      description: "Materials science data and resources from NIST",
      category: "Research Resource"
    },
    {
      name: "Crystallography Open Database",
      url: "http://www.crystallography.net/cod",
      description: "Open-access collection of crystal structures",
      category: "Research Resource"
    },
    {
      name: "AFLOW",
      url: "http://www.aflowlib.org",
      description: "Automatic framework for high-throughput materials discovery",
      category: "Research Resource"
    }
  ];

  const LinkCard = ({ links, title, icon }: { links: any[], title: string, icon: React.ReactNode }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {links.map((link, index) => (
            <div key={index} className={`p-4 border rounded-lg transition-all ${
              link.featured ? 'border-[#c9a227] bg-[#c9a227]/5 hover:bg-[#c9a227]/10' : 'border-border hover:bg-[#f0f4fb]'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-[#0f2d6b] text-sm" style={{ fontWeight: 600 }}>{link.name}</h4>
                    {link.featured && <Badge variant="secondary" className="text-xs">Official</Badge>}
                    <Badge variant="outline" className="text-xs">{link.category}</Badge>
                  </div>
                  <p className="text-[#3a4a6a] text-xs leading-relaxed mb-3">{link.description}</p>
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0f2d6b] text-xs hover:underline"
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>Useful Links</h1>
          <p className="text-[#5a6a8a] text-lg leading-relaxed">
            A comprehensive collection of resources for materials science researchers, including professional organizations, databases, institutions, and research tools.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <LinkCard 
              links={organizationLinks} 
              title="IAAM & Related Organizations"
              icon={<Building2 className="w-4 h-4" />}
            />
            
            <LinkCard 
              links={researchLinks} 
              title="Professional Societies"
              icon={<Users className="w-4 h-4" />}
            />

            <LinkCard 
              links={ethicsLinks} 
              title="Ethics & Research Standards"
              icon={<Award className="w-4 h-4" />}
            />
          </div>

          <div>
            <LinkCard 
              links={databaseLinks} 
              title="Scientific Databases"
              icon={<Database className="w-4 h-4" />}
            />

            <LinkCard 
              links={institutionLinks} 
              title="Academic Institutions"
              icon={<School className="w-4 h-4" />}
            />

            <LinkCard 
              links={resourceLinks} 
              title="Research Resources & Tools"
              icon={<Microscope className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-[#c9a227] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>Disclaimer</h3>
                <p className="text-[#5a6a8a] text-xs leading-relaxed">
                  The external links provided on this page are for informational purposes only. Advanced Materials Letters and IAAM do not endorse or take responsibility for the content, accuracy, or availability of external websites. These links are provided as a service to our research community and may be updated periodically. If you notice any broken links or have suggestions for additional resources, please contact our editorial office.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}