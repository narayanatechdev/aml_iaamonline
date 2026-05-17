"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Globe, Mail, ExternalLink, Award, BookOpen } from 'lucide-react';

export default function EditorialBoard() {
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
    },
    {
      name: "Rajiv Gupta",
      affiliation: "BITS Pilani, India",
      location: "India",
      photo: "/images/editorial-board/rajiv-gupta.jpg"
    },
    {
      name: "Said Easa",
      affiliation: "Ryerson University, Canada",
      location: "Canada",
      photo: "/images/editorial-board/said-easa.jpeg"
    },
    {
      name: "Jinyang Xu",
      affiliation: "Shanghai Jiao Tong University, China",
      location: "China",
      photo: "/images/editorial-board/jinyang-xu.jpg"
    }
  ];

  const advisoryBoardMembers = [
    {
      name: "Joseph Koo",
      affiliation: "The University of Texas at Austin, USA",
      location: "USA",
      photo: "/images/editorial-board/joseph-koo.jpg"
    },
    {
      name: "Zhongwei Guan",
      affiliation: "University of Liverpool, UK",
      location: "UK",
      photo: "/images/editorial-board/zhongwei-guan.jpg"
    },
    {
      name: "Yi-Lung Mo",
      affiliation: "University of Houston, USA",
      location: "USA",
      photo: "/images/editorial-board/yi-lung-mo.jpg"
    },
     {
      name: "Zdenek Drozd",
      affiliation: "Charles University, Czech Republic",
      location: "Czech Republic",
      photo: "/images/editorial-board/placeholder.png"
    },
     {
      name: "Barbara Lipowska",
      affiliation: "Institute of Ceramics and Building Materials, Poland",
      location: "Poland",
      photo: "/images/editorial-board/placeholder.png"
    },
      {
      name: "Franck Molina",
      affiliation: "CNRS, France",
      location: "France",
      photo: "/images/editorial-board/frank-molina.png"
    },
      {
      name: "Gennady Panin",
      affiliation: "Dongguk University, Republic of Korea",
      location: "South Korea",
      photo: "/images/editorial-board/gennady-panin.jpg"
    },
     {
      name: "RameshAgarwal",
      affiliation: "Washington University in St. Louis, USA",
      location: "USA",
      photo: "/images/editorial-board/ramesh-agarwal.jpg"
    },
     {
      name: "Guang-Ping Zhang",
      affiliation: "Shenyang National Laboratory for Materials Science, China",
      location: "China",
      photo: "/images/editorial-board/guang-ping-zhang.jpg"
    },
    {
      name: "Indranath Dutta",
      affiliation: "Washington State University, USA",
      location: "USA",
      photo: "/images/editorial-board/indranath-dutta.jpg"
    },
     {
      name: "Heyou Han",
      affiliation: "Huazhong Agricultural University, China",
      location: "China",
      photo: "/images/editorial-board/heyou-han.jpg"
    },
    {
      name: "Pratim Chattaraj",
      affiliation: "Indian Institute of Technology (IIT) Kharagpur, India",
      location: "India",
      photo: "/images/editorial-board/pratim-chattaraj.jpg"
    },
      {
      name: "Ivan Stich",
      affiliation: "Slovak Academy of Sciences, Slovakia",
      location: "Slovakia",
      photo: "/images/editorial-board/ivan-stich.jpg"
    },
      {
      name: "Anjun Jin",
      affiliation: "Ningbo University, China",
      location: "China",
      photo: "/images/editorial-board/anjun-jin.png"
    },
    {
      name: "Tseung-Yuen Tseng",
      affiliation: "Institute of Electronics, National Chiao Tung University, Taiwan",
      location: "Taiwan",
      photo: "/images/editorial-board/tseung-yuen-tseng.jpg"
    },
   
   
  
     {
      name: "Sergey Dunaevsky",
      affiliation: "Kurchatov Institute, Russia",
      location: "Russia",
      photo: "/images/editorial-board/placeholder.png"
    },
    {
      name: "Taras Kavetskyy",
      affiliation: "The John Paul II Catholic University of Lublin, Poland",
      location: "Poland",
      photo: "/images/editorial-board/placeholder.png"
    },
  {
      name: "Mohamed Elsayed",
      affiliation: "Military Technical College (MTC), Cairo, Egypt",
      location: "Egypt",
      photo: "/images/editorial-board/mohamed-elsayed.jpg"
    },
     {
      name: "Zhiming Liu",
      affiliation: "Beijing University of Chemical Technology, China",
      location: "China", 
      photo: "/images/editorial-board/zhiming-liu.jpg"
    }
   
    
   
  
  ];


  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <h1 className="text-[#0f2d6b] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>Editorial Board</h1>
          <p className="text-[#5a6a8a] text-lg leading-relaxed">
            Our distinguished editorial board comprises leading experts from around the world, ensuring the highest standards of peer review and scientific excellence.
          </p>
        </div>

        {/* Editor-in-Chief */}
        <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
              <Star className="w-5 h-5 text-[#c9a227]" />
              Editor-in-Chief
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-2">
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
          </CardContent>
        </Card>

        {/* Managing Editor */}
        <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
              <Star className="w-5 h-5 text-[#c9a227]" />
              Managing Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-2">
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
                  <p className="text-[#5a6a8a] text-sm mb-1">{managingEditor.affiliation}</p>
                  <p className="text-[#5a6a8a] text-xs">{managingEditor.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Editors */}
        <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
              <Users className="w-5 h-5" />
              Academic Editors
              <Badge variant="secondary" className="ml-auto text-xs">{academicEditors.length} members</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {academicEditors.map((member, index) => (
                <div key={index} className="p-4 border-b border-gray-200 group">
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
          </CardContent>
        </Card>

        {/* Advisory Board Members */}
        <Card className="mb-8 border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-[#0f2d6b] text-xl flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Advisory Board Members
              <Badge variant="secondary" className="ml-auto text-xs">{advisoryBoardMembers.length} members</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {advisoryBoardMembers.map((member, index) => (
                <div key={index} className="p-4 border-b border-gray-200 group">
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
            <div className="mt-6 p-4">
              <h4 className="text-[#0f2d6b] text-sm mb-2 font-semibold">Global Representation</h4>
              <p className="text-[#5a6a8a] text-xs leading-relaxed">
                Our editorial board represents leading institutions across {
                  [...new Set([...academicEditors, ...advisoryBoardMembers, managingEditor].map(member => member.location))].length
                } countries and regions, ensuring diverse perspectives and expertise in all areas of advanced materials research.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Editorial Policies */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Editorial Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0f2d6b]/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#0f2d6b] text-xs font-bold">1</span>
                </div>
                <div>
                  <h5 className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>Peer Review Standards</h5>
                  <p className="text-[#5a6a8a] text-xs">All submissions undergo rigorous double-blind peer review by international experts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0f2d6b]/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#0f2d6b] text-xs font-bold">2</span>
                </div>
                <div>
                  <h5 className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>Ethical Standards</h5>
                  <p className="text-[#5a6a8a] text-xs">We adhere to COPE guidelines and maintain the highest ethical standards in publishing.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0f2d6b]/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#0f2d6b] text-xs font-bold">3</span>
                </div>
                <div>
                  <h5 className="text-[#0f2d6b] text-xs mb-1" style={{ fontWeight: 600 }}>Open Access</h5>
                  <p className="text-[#5a6a8a] text-xs">Diamond Open Access model ensures free publication and worldwide accessibility.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 border-b border-gray-200 rounded-none shadow-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-[#0f2d6b] text-lg flex items-center gap-2">
                <Award className="w-4 h-4" />
                Recognition & Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3">
                  <div className="text-[#0f2d6b] text-lg font-bold">50+</div>
                  <div className="text-[#5a6a8a] text-xs">Countries</div>
                </div>
                <div className="p-3">
                  <div className="text-[#0f2d6b] text-lg font-bold">1000+</div>
                  <div className="text-[#5a6a8a] text-xs">Reviewers</div>
                </div>
              </div>
              <p className="text-[#5a6a8a] text-xs leading-relaxed">
                Our editorial board represents leading institutions worldwide, ensuring global perspectives and expertise across all materials science disciplines.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
