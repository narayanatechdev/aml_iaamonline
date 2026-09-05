'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { pickText, pickList } from '@/lib/page-layouts';
import type { PageContentData } from '@/lib/page-layouts';

const DEFAULT_OFFICE_HOURS = [
  { day: 'Monday - Friday', hours: '9:00 AM - 5:00 PM (EST)' },
  { day: 'Saturday', hours: '10:00 AM - 2:00 PM (EST)' },
  { day: 'Sunday', hours: 'Closed' },
];

const DEFAULT_RESPONSE_TIMES = [
  { label: 'General Inquiries', value: '1-2 business days' },
  { label: 'Editorial Questions', value: '2-3 business days' },
  { label: 'Technical Support', value: '1 business day' },
];

export default function ContactStatic({ content = {} }: { content?: PageContentData }) {
  const title = pickText(content, 'title', 'Contact Us');
  const subtitle = pickText(
    content,
    'subtitle',
    'Get in touch with the Advanced Materials Letters editorial team',
  );
  const emailHeading = pickText(content, 'email_heading', 'Email');
  const emailDesc = pickText(content, 'email_desc', 'For editorial inquiries and submissions');
  const emailAddress = pickText(content, 'email_address', 'aml@iaamonline.org');
  const phoneHeading = pickText(content, 'phone_heading', 'Phone');
  const phoneDesc = pickText(content, 'phone_desc', 'Direct line to editorial office');
  const phoneNumber = pickText(content, 'phone_number', '+1-XXX-XXX-XXXX');
  const addressHeading = pickText(content, 'address_heading', 'Address');
  const addressDesc = pickText(content, 'address_desc', 'IAAM Headquarters');
  const addressText = pickText(
    content,
    'address_text',
    'Advanced Materials Letters\nEditorial Office\nInternational Association of Advanced Materials',
  );
  const formHeading = pickText(content, 'form_heading', 'Send us a Message');
  const officeHoursHeading = pickText(content, 'office_hours_heading', 'Office Hours');
  const editorialOfficeTitle = pickText(content, 'editorial_office_title', 'Editorial Office');
  const responseTimesTitle = pickText(content, 'response_times_title', 'Response Times');

  const officeHours = pickList<{ day: string; hours: string }>(
    content,
    'office_hours',
    DEFAULT_OFFICE_HOURS,
  );
  const responseTimes = pickList<{ label: string; value: string }>(
    content,
    'response_times',
    DEFAULT_RESPONSE_TIMES,
  );

  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: 'About Journal', href: '/about-journal' },
              { label: 'Contact' },
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-700">{subtitle}</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Mail className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{emailHeading}</h3>
              <p className="text-gray-600 text-sm mb-4">{emailDesc}</p>
              <a href={`mailto:${emailAddress}`} className="text-[#0f2d6b] font-medium hover:underline">
                {emailAddress}
              </a>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Phone className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{phoneHeading}</h3>
              <p className="text-gray-600 text-sm mb-4">{phoneDesc}</p>
              <a href={`tel:${phoneNumber}`} className="text-[#0f2d6b] font-medium hover:underline">
                {phoneNumber}
              </a>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <MapPin className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{addressHeading}</h3>
              <p className="text-gray-600 text-sm mb-4">{addressDesc}</p>
              <p className="text-gray-900 text-sm whitespace-pre-line">{addressText}</p>
            </div>
          </div>

          {/* Contact Form — hard-coded */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{formHeading}</h2>
            </div>

            <form className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Subject *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Message *</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  required
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0f2d6b] text-white rounded-lg hover:bg-[#0d2560] transition-colors font-medium"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Office Hours */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">{officeHoursHeading}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{editorialOfficeTitle}</h3>
                <div className="space-y-2">
                  {officeHours.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">{item.day}:</span>
                      <span className="text-gray-900">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{responseTimesTitle}</h3>
                <div className="space-y-2">
                  {responseTimes.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">{item.label}:</span>
                      <span className="text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
