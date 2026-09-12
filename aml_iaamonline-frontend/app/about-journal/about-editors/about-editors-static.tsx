"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Users, BookOpen, Globe, Star, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { pickText, pickList } from '@/lib/page-layouts';
import { CmsRichText } from '@/components/shared/cms-rich-text';
import type { PageContentData } from '@/lib/page-layouts';

type Member = { name: string; affiliation: string; location: string; photo: string };
type ExpertiseItem = { text: string };
type PrincipleItem = { title: string; description: string };
type StatItem = { value: string; label: string };

const DEFAULT_EXPERTISE: ExpertiseItem[] = [
  { text: 'Advanced Materials' },
  { text: 'Nanotechnology' },
  { text: 'Biosensors' },
  { text: 'Energy Materials' },
];

const DEFAULT_ACADEMIC: Member[] = [
  { name: 'Bingqing Wei', affiliation: 'University of Delaware, USA', location: 'USA', photo: '/images/editorial-board/bingqing-wei.jpg' },
  { name: 'Seiki Chiba', affiliation: 'Chiba Science Institute, Japan', location: 'Japan', photo: '/images/editorial-board/seiki-chiba.jpg' },
  { name: 'Yogendra Kumar Mishra', affiliation: 'University of Southern Denmark, Denmark', location: 'Denmark', photo: '/images/editorial-board/yogendra-kumar-mishra.jpg' },
  { name: 'Maroš Halama', affiliation: 'Technical University of Kosice, Slovakia', location: 'Slovakia', photo: '/images/editorial-board/maros-halama.jpg' },
  { name: 'Tong Lin', affiliation: 'Deakin University, Australia', location: 'Australia', photo: '/images/editorial-board/tong-lin.jpg' },
  { name: 'Iwona Jasiuk', affiliation: 'University of Illinois Urbana-Champaign, USA', location: 'USA', photo: '/images/editorial-board/iwona-jasiuk.jpg' },
  { name: 'Qijun Sun', affiliation: 'Sungkyunkwan University, South Korea', location: 'South Korea', photo: '/images/editorial-board/qijun-sun.png' },
  { name: 'Carlos Semino', affiliation: 'Ramon Llull University, Spain', location: 'Spain', photo: '/images/editorial-board/carlos-semino.jpg' },
  { name: 'Jitendra Singh', affiliation: 'Indian Institute of Technology (IIT) Delhi, India', location: 'India', photo: '/images/editorial-board/jitendra-singh.jpg' },
  { name: 'Kun Jia', affiliation: 'University of Electronic Science and Technology of China, China', location: 'China', photo: '/images/editorial-board/kun-jia.png' },
  { name: 'Norman Munroe', affiliation: 'Florida International University, USA', location: 'USA', photo: '/images/editorial-board/norman-munroe.jpg' },
  { name: 'Prasad Yarlagadda', affiliation: 'Queensland University of Technology, Australia', location: 'Australia', photo: '/images/editorial-board/prasad-yarlagadda.jpg' },
];

const DEFAULT_PRINCIPLES: PrincipleItem[] = [
  { title: 'Scientific Excellence', description: 'Rigorous peer review ensuring only high-quality, innovative research' },
  { title: 'Ethical Integrity', description: 'Upholding the highest ethical standards in all editorial decisions' },
  { title: 'Accessibility', description: 'Committed to worldwide dissemination of research through IAAM membership and subscription' },
  { title: 'Global Perspective', description: 'Embracing diverse viewpoints from the international research community' },
  { title: 'Innovation Focus', description: 'Prioritizing groundbreaking research with real-world impact' },
  { title: 'Author Support', description: 'Providing comprehensive support throughout the publication process' },
];

const DEFAULT_NETWORK_STATS: StatItem[] = [
  { value: '50+', label: 'Editorial Board Members' },
  { value: '25+', label: 'Countries Represented' },
  { value: '100+', label: 'Years Combined Experience' },
];

const STAT_COLORS = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50'];

export default function AboutEditorsStatic({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'About the Editors');
  const subtitle = pickText(content, 'subtitle', 'Distinguished experts leading Advanced Materials Letters editorial excellence');

  const eicName = pickText(content, 'eic_name', 'Prof. Dr. Ashutosh Tiwari');
  const eicTitle = pickText(content, 'eic_title', 'Editor-in-Chief');
  const eicAffiliation = pickText(content, 'eic_affiliation', 'Institute of Advanced Materials, IAAM, Sweden');
  const eicLocation = pickText(content, 'eic_location', 'Vaxholm, Sweden');
  const eicEmail = pickText(content, 'eic_email', 'ashutosh@iaamonline.org');
  const eicBio = pickText(content, 'eic_bio', 'Professor Ashutosh Tiwari is a distinguished researcher in advanced materials and nanotechnology with over 20 years of experience in materials science research and editorial leadership.');
  const eicPhoto = pickText(content, 'eic_photo', '/images/editorial-board/ashutosh-tiwari.jpg');
  const expertise = pickList<ExpertiseItem>(content, 'eic_expertise', DEFAULT_EXPERTISE)
    .map((e) => e.text)
    .filter((t) => (t ?? '').trim() !== '');

  const meName = pickText(content, 'me_name', 'Gun Anit Kaur');
  const meAffiliation = pickText(content, 'me_affiliation', 'VBRI Innovation, New Delhi, India');
  const meLocation = pickText(content, 'me_location', 'India');
  const mePhoto = pickText(content, 'me_photo', '/images/editorial-board/gun-anit-kaur.png');

  const academicEditors = pickList<Member>(content, 'academic_editors', DEFAULT_ACADEMIC)
    .filter((m) => (m.name ?? '').trim() !== '');

  const philosophyTitle = pickText(content, 'philosophy_title', 'Editorial Philosophy');
  const philosophyIntro = pickText(content, 'philosophy_intro', 'The editorial team of Advanced Materials Letters is committed to maintaining the highest standards of scientific rigor, ethical conduct, and editorial excellence. Our approach is built on several core principles that guide every aspect of our publication process.');
  const principles = pickList<PrincipleItem>(content, 'philosophy_principles', DEFAULT_PRINCIPLES)
    .filter((p) => (p.title ?? '').trim() !== '');
  const col1 = principles.slice(0, Math.ceil(principles.length / 2));
  const col2 = principles.slice(Math.ceil(principles.length / 2));

  const networkTitle = pickText(content, 'network_title', 'Global Editorial Network');
  const networkIntro = pickText(content, 'network_intro', 'Our editorial team represents a truly global network of materials science experts, spanning across continents and bringing together diverse perspectives from leading research institutions worldwide.');
  const networkStats = pickList<StatItem>(content, 'network_stats', DEFAULT_NETWORK_STATS, 3);

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'About the Editors' }
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <CmsRichText value={subtitle} className="text-lg text-gray-700" />
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Editor-in-Chief */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Editor-in-Chief</h2>
            </div>

            <div className="bg-gradient-to-r from-[#f0f4fb] to-[#e8f1ff] p-6 rounded-lg border border-[#0f2d6b]/10">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                  <img
                    src={eicPhoto}
                    alt={eicName}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                    }}
                  />
                  <div className="w-full h-full bg-[#0f2d6b]/20 rounded-full flex items-center justify-center text-[#0f2d6b] text-4xl font-bold" style={{ display: 'none' }}>
                    AT
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-[#0f2d6b] text-xl mb-1" style={{ fontWeight: 700 }}>{eicName}</h3>
                      <p className="text-[#c9a227] text-lg mb-2" style={{ fontWeight: 600 }}>{eicTitle}</p>
                      <p className="text-[#5a6a8a] text-base">{eicAffiliation}</p>
                      <p className="text-[#5a6a8a] text-sm">{eicLocation}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a
                        href={`mailto:${eicEmail}`}
                        className="flex items-center gap-2 text-[#0f2d6b] text-sm hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        Contact Editor
                      </a>
                    </div>
                  </div>
                  <CmsRichText value={eicBio} className="text-[#3a4a6a] text-base mb-6 leading-relaxed" />
                  {expertise.length > 0 && (
                    <div>
                      <p className="text-[#0f2d6b] text-sm mb-2" style={{ fontWeight: 600 }}>Expertise Areas:</p>
                      <div className="flex flex-wrap gap-2">
                        {expertise.map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Managing Editor */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Managing Editor</h2>
            </div>

            <div className="bg-gradient-to-r from-[#f8fafe] to-[#f0f4fb] p-6 rounded-lg border border-[#0f2d6b]/10">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-[#c9a227] shadow-lg flex-shrink-0">
                  <img
                    src={mePhoto}
                    alt={meName}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                    }}
                  />
                  <div className="w-full h-full bg-[#c9a227]/20 rounded-full flex items-center justify-center text-[#c9a227] text-2xl font-bold" style={{ display: 'none' }}>
                    GK
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#0f2d6b] text-xl mb-1" style={{ fontWeight: 700 }}>{meName}</h3>
                  <p className="text-[#c9a227] text-lg mb-2" style={{ fontWeight: 600 }}>Managing Editor</p>
                  <p className="text-[#5a6a8a] text-base mb-1">{meAffiliation}</p>
                  <p className="text-[#5a6a8a] text-sm">{meLocation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Editorial Board */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Academic Editorial Board</h2>
              <Badge variant="secondary" className="ml-auto text-sm">{academicEditors.length} members</Badge>
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
                      <div className="w-full h-full bg-[#0f2d6b]/10 rounded-full flex items-center justify-center text-[#0f2d6b] text-xl font-bold" style={{ display: 'none' }}>
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    </div>
                    <h5 className="text-[#0f2d6b] text-sm mb-1 font-semibold leading-tight">{member.name}</h5>
                    <p className="text-[#5a6a8a] text-xs mb-1 leading-tight">{member.affiliation}</p>
                    <div className="flex items-center justify-center gap-1">
                      <Globe className="w-3 h-3 text-[#c9a227]" />
                      <span className="text-[#5a6a8a] text-xs">{member.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Philosophy */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{philosophyTitle}</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <CmsRichText value={philosophyIntro} className="text-gray-700 leading-relaxed mb-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {col1.map((p, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{p.title}</h4>
                        <p className="text-sm text-gray-600">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {col2.map((p, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#c9a227] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{p.title}</h4>
                        <p className="text-sm text-gray-600">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Global Editorial Network */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{networkTitle}</h2>
            </div>

            <CmsRichText value={networkIntro} className="text-gray-700 leading-relaxed mb-6" />

            <div className="grid md:grid-cols-3 gap-6">
              {networkStats.map((stat, i) => (
                <div key={i} className={`text-center p-6 ${STAT_COLORS[i] ?? 'bg-gray-50'} rounded-lg`}>
                  <div className="text-2xl font-bold text-[#0f2d6b] mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
