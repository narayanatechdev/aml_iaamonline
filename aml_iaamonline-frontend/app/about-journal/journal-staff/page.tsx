'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Users, Mail, Phone, MapPin, Star, Globe, Award, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function JournalStaffPage() {
  const editorInChief = {
    name: "Prof. Dr. Ashutosh Tiwari",
    title: "Editor-in-Chief",
    affiliation: "Institute of Advanced Materials, IAAM, Sweden",
    location: "Vaxholm, Sweden",
    expertise: ["Advanced Materials", "Nanotechnology", "Biosensors", "Energy Materials"],
    email: "ashutosh@iaamonline.org",
    bio: "Professor Ashutosh Tiwari is a distinguished researcher in advanced materials and nanotechnology with over 20 years of experience in materials science research and editorial leadership.",
    photo: "/images/editorial-board/ashutosh-tiwari.jpg"
  };

  const managingEditor = {
    name: "Gun Anit Kaur",
    affiliation: "VBRI Innovation, New Delhi, India",
    location: "India",
    photo: "/images/editorial-board/gun-anit-kaur.png"
  };

  const academicEditors = [
    {
      name: "Bingqing Wei",
      affiliation: "University of Delaware, USA",
      location: "USA", 
      photo: "/images/editorial-board/bingqing-wei.jpg"
    },
    {
      name: "Seiki Chiba",
      affiliation: "Chiba Science Institute, Japan",
      location: "Japan",
      photo: "/images/editorial-board/seiki-chiba.jpg"
    },
    {
      name: "Yogendra Kumar Mishra",
      affiliation: "University of Southern Denmark, Denmark",
      location: "Denmark",
      photo: "/images/editorial-board/yogendra-kumar-mishra.jpg"
    },
    {
      name: "Maroš Halama",
      affiliation: "Technical University of Kosice, Slovakia",
      location: "Slovakia",
      photo: "/images/editorial-board/maros-halama.jpg"
    },
    {
      name: "Tong Lin",
      affiliation: "Deakin University, Australia",
      location: "Australia", 
      photo: "/images/editorial-board/tong-lin.jpg"
    },
    {
      name: "Iwona Jasiuk",
      affiliation: "University of Illinois Urbana-Champaign, USA",
      location: "USA",
      photo: "/images/editorial-board/iwona-jasiuk.jpg"
    },
    {
      name: "Qijun Sun",
      affiliation: "Sungkyunkwan University, South Korea",
      location: "South Korea",
      photo: "/images/editorial-board/qijun-sun.png"
    },
    {
      name: "Carlos Semino",
      affiliation: "Ramon Llull University, Spain",
      location: "Spain",
      photo: "/images/editorial-board/carlos-semino.jpg"
    },
    {
      name: "Jitendra Singh",
      affiliation: "Indian Institute of Technology (IIT) Delhi, India",
      location: "India",
      photo: "/images/editorial-board/jitendra-singh.jpg"
    },
    {
      name: "Kun Jia",
      affiliation: "University of Electronic Science and Technology of China, China",
      location: "China", 
      photo: "/images/editorial-board/kun-jia.png"
    },
    {
      name: "Norman Munroe",
      affiliation: "Florida International University, USA",
      location: "USA",
      photo: "/images/editorial-board/norman-munroe.jpg"
    },
    {
      name: "Prasad Yarlagadda",
      affiliation: "Queensland University of Technology, Australia",
      location: "Australia",
      photo: "/images/editorial-board/prasad-yarlagadda.jpg"
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Journal Staff' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Journal Staff</h1>
          <p className="text-lg text-gray-700">
            Meet the dedicated team behind Advanced Materials Letters
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Editorial Office */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Editorial Office</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Editor-in-Chief */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-2">Editor-in-Chief</h3>
                <h4 className="text-base font-medium text-gray-900 mb-1">{editorInChief.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{editorInChief.affiliation}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{editorInChief.email}</span>
                  </div>
                </div>
              </div>

              {/* Managing Editor */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-2">Managing Editor</h3>
                <h4 className="text-base font-medium text-gray-900 mb-1">{managingEditor.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{managingEditor.affiliation}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>managing@iaamonline.org</span>
                  </div>
                </div>
              </div>

              {/* First Academic Editor */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2d6b] mb-2">Academic Editor</h3>
                <h4 className="text-base font-medium text-gray-900 mb-1">{academicEditors[0].name}</h4>
                <p className="text-sm text-gray-600 mb-3">{academicEditors[0].affiliation}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{academicEditors[0].location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Production Team */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">Production Team</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Production Manager</h4>
                    <p className="text-sm text-gray-600">Oversees manuscript processing and publication workflow</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Copy Editor</h4>
                    <p className="text-sm text-gray-600">Ensures editorial quality and consistency</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Typesetter</h4>
                    <p className="text-sm text-gray-600">Handles manuscript formatting and layout</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Web Manager</h4>
                    <p className="text-sm text-gray-600">Maintains online platform and digital presence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Technical Support</h4>
                    <p className="text-sm text-gray-600">Provides technical assistance to authors and reviewers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Administrative Assistant</h4>
                    <p className="text-sm text-gray-600">Handles general administrative tasks and coordination</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#0f2d6b] mb-6">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Editorial Office</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#0f2d6b] mt-0.5" />
                    <div>
                      <p className="text-gray-900 font-medium">IAAM Headquarters</p>
                      <p className="text-sm text-gray-600">Advanced Materials Letters<br />Editorial Office<br />International Association of Advanced Materials</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#0f2d6b]" />
                    <span className="text-gray-900">aml@iaamonline.org</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#0f2d6b]" />
                    <span className="text-gray-900">+1-XXX-XXX-XXXX</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="text-gray-900">9:00 AM - 5:00 PM (EST)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="text-gray-900">10:00 AM - 2:00 PM (EST)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="text-gray-900">Closed</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> For urgent editorial matters, please contact our managing editor directly.
                    Response times may vary during holidays and conference periods.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Board Leadership */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Editorial Board Leadership</h2>
            </div>
            
            {/* Editor-in-Chief */}
            <div className="bg-gradient-to-r from-[#f0f4fb] to-[#e8f1ff] p-6 rounded-lg border border-[#0f2d6b]/10 mb-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                  <img 
                    src={editorInChief.photo} 
                    alt={editorInChief.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                    }}
                  />
                  <div className="w-full h-full bg-[#0f2d6b]/20 rounded-full flex items-center justify-center text-[#0f2d6b] text-4xl font-bold" style={{display: 'none'}}>
                    AT
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-[#0f2d6b] text-lg mb-1" style={{ fontWeight: 700 }}>{editorInChief.name}</h3>
                      <p className="text-[#c9a227] text-sm mb-2" style={{ fontWeight: 600 }}>{editorInChief.title}</p>
                      <p className="text-[#5a6a8a] text-sm">{editorInChief.affiliation}</p>
                      <p className="text-[#5a6a8a] text-xs">{editorInChief.location}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a 
                        href={`mailto:${editorInChief.email}`}
                        className="flex items-center gap-2 text-[#0f2d6b] text-xs hover:underline"
                      >
                        <Mail className="w-3 h-3" />
                        Contact Editor
                      </a>
                    </div>
                  </div>
                  <p className="text-[#3a4a6a] text-sm mb-4 leading-relaxed">{editorInChief.bio}</p>
                  <div>
                    <p className="text-[#0f2d6b] text-xs mb-2" style={{ fontWeight: 600 }}>Expertise Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {editorInChief.expertise.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Managing Editor */}
            <div className="bg-gradient-to-r from-[#f8fafe] to-[#f0f4fb] p-6 rounded-lg border border-[#0f2d6b]/10">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-[#c9a227] shadow-lg flex-shrink-0">
                  <img 
                    src={managingEditor.photo} 
                    alt={managingEditor.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                    }}
                  />
                  <div className="w-full h-full bg-[#c9a227]/20 rounded-full flex items-center justify-center text-[#c9a227] text-2xl font-bold" style={{display: 'none'}}>
                    GK
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#0f2d6b] text-lg mb-1" style={{ fontWeight: 700 }}>{managingEditor.name}</h3>
                  <p className="text-[#c9a227] text-sm mb-2" style={{ fontWeight: 600 }}>Managing Editor</p>
                  <p className="text-[#5a6a8a] text-sm mb-1">{managingEditor.affiliation}</p>
                  <p className="text-[#5a6a8a] text-xs">{managingEditor.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Editors */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Academic Editorial Board</h2>
              <Badge variant="secondary" className="ml-auto text-xs">{academicEditors.length} members</Badge>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {academicEditors.map((member, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:bg-[#f0f4fb] transition-colors group">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border mx-auto mb-3 group-hover:border-[#0f2d6b] transition-colors">
                      <img 
                        src={member.photo} 
                        alt={member.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                        }}
                      />
                      <div className="w-full h-full bg-[#0f2d6b]/10 rounded-full flex items-center justify-center text-[#0f2d6b] text-xl font-bold" style={{display: 'none'}}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <h5 className="text-[#0f2d6b] text-xs mb-1 font-semibold leading-tight">{member.name}</h5>
                    <p className="text-[#5a6a8a] text-xs mb-1 leading-tight">{member.affiliation}</p>
                    <div className="flex items-center justify-center gap-1">
                      <Globe className="w-3 h-3 text-[#c9a227]" />
                      <span className="text-[#5a6a8a] text-xs">{member.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-[#f0f4fb] rounded-lg border border-[#0f2d6b]/10">
              <h4 className="text-[#0f2d6b] text-sm mb-2 font-semibold">Global Editorial Network</h4>
              <p className="text-[#5a6a8a] text-xs leading-relaxed">
                Our editorial board represents leading institutions across multiple countries, ensuring diverse perspectives and expertise in all areas of advanced materials research.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}