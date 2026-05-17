'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Mail, MapPin, Phone, Clock, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <MainLayout>
      <div className="bg-[#0f2d6b] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-white/80">
            Get in touch with the Advanced Materials Letters editorial team
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-[#0f2d6b]" />
                  <h2 className="text-2xl font-bold text-[#0f2d6b]">Send us a message</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="submission">Manuscript Submission</option>
                      <option value="review">Peer Review Process</option>
                      <option value="editorial">Editorial Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="subscription">Subscription/Access</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] transition-colors"
                      placeholder="Please provide details about your inquiry..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2d6b] text-white rounded-lg hover:bg-[#0d2560] transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Editorial Office */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-[#0f2d6b] mb-4">Editorial Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#c9a227] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">IAAM Headquarters</p>
                      <p className="text-sm text-gray-600">
                        Linköping University<br />
                        Department of Science and Technology<br />
                        SE-601 74 Norrköping, Sweden
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#c9a227] flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href="mailto:editor@iaamonline.org" className="text-sm text-[#0f2d6b] hover:underline">
                        editor@iaamonline.org
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#c9a227] flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">+46 11 36 3000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-xl font-bold text-[#0f2d6b]">Business Hours</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">09:00 - 17:00 (CET)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday - Sunday</span>
                    <span className="font-medium text-gray-500">Closed</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  We typically respond to inquiries within 1-2 business days.
                </p>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-[#0f2d6b] mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a href="/author-resources" className="block text-[#0f2d6b] hover:underline">
                    Author Guidelines
                  </a>
                  <a href="/about-journal" className="block text-[#0f2d6b] hover:underline">
                    About the Journal
                  </a>
                  <a href="/submit" className="block text-[#0f2d6b] hover:underline">
                    Submit Manuscript
                  </a>
                  <a href="/track" className="block text-[#0f2d6b] hover:underline">
                    Track Submission
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}