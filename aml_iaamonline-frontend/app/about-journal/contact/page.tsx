'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', path: '/about-journal' },
              { label: 'Contact' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-700">
            Get in touch with the Advanced Materials Letters editorial team
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Mail className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm mb-4">For editorial inquiries and submissions</p>
              <a href="mailto:aml@iaamonline.org" className="text-[#0f2d6b] font-medium hover:underline">
                aml@iaamonline.org
              </a>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <Phone className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 text-sm mb-4">Direct line to editorial office</p>
              <a href="tel:+1-XXX-XXX-XXXX" className="text-[#0f2d6b] font-medium hover:underline">
                +1-XXX-XXX-XXXX
              </a>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <MapPin className="w-12 h-12 text-[#0f2d6b] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600 text-sm mb-4">IAAM Headquarters</p>
              <p className="text-gray-900 text-sm">
                Advanced Materials Letters<br/>
                Editorial Office<br/>
                International Association of Advanced Materials
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Send us a Message</h2>
            </div>
            
            <form className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Name *</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
                <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]" required />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Subject *</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]" required />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Message *</label>
                <textarea rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]" required></textarea>
              </div>
              
              <div className="md:col-span-2">
                <button type="submit" className="px-6 py-3 bg-[#0f2d6b] text-white rounded-lg hover:bg-[#0d2560] transition-colors font-medium">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Office Hours */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Office Hours</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Editorial Office</h3>
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
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">General Inquiries:</span>
                    <span className="text-gray-900">1-2 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Editorial Questions:</span>
                    <span className="text-gray-900">2-3 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technical Support:</span>
                    <span className="text-gray-900">1 business day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}