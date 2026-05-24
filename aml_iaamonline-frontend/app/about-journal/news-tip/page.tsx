'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Send, Mail, Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsTipPage() {
  return (
    <MainLayout>
      <div className="bg-gray-100 text-black py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb 
            items={[
              { label: 'About Journal', path: '/about-journal' },
              { label: 'Send a News Tip' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">Send a News Tip</h1>
          <p className="text-lg text-gray-700">
            Share breaking research news, discoveries, or developments with our editorial team
          </p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          {/* Submission Form */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Submit Your News Tip</h2>
            </div>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Your Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email Address *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Institution/Organization</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                    placeholder="Your institution or company"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">News Category</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]">
                    <option value="">Select category</option>
                    <option value="breakthrough">Research Breakthrough</option>
                    <option value="discovery">New Discovery</option>
                    <option value="technology">Technology Development</option>
                    <option value="collaboration">Research Collaboration</option>
                    <option value="award">Award/Recognition</option>
                    <option value="conference">Conference/Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">News Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  placeholder="Brief, descriptive title of your news tip"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">News Description *</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  placeholder="Provide detailed information about the news tip including key findings, significance, researchers involved, and potential impact..."
                  required
                ></textarea>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Related Publication/DOI</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                    placeholder="DOI or publication reference"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Contact Information</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                    placeholder="Additional contact details"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Additional Comments</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  placeholder="Any additional information or special considerations..."
                ></textarea>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 w-4 h-4 text-[#0f2d6b] border-gray-300 rounded focus:ring-[#0f2d6b]"
                  required
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I consent to the processing of my personal data for editorial purposes and understand that 
                  this information may be shared with relevant editorial team members. *
                </label>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[#0f2d6b] text-white rounded-lg hover:bg-[#0d2560] transition-colors font-medium"
                >
                  <Send className="w-4 h-4" />
                  Submit News Tip
                </button>
                <button
                  type="reset"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Submission Guidelines</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What We're Looking For</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Breakthrough Research</h4>
                      <p className="text-sm text-gray-600">Significant discoveries in materials science</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Novel Technologies</h4>
                      <p className="text-sm text-gray-600">New technologies with potential impact</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Major Collaborations</h4>
                      <p className="text-sm text-gray-600">Important research partnerships</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Awards & Recognition</h4>
                      <p className="text-sm text-gray-600">Notable achievements in the field</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Verification Required:</strong> All news tips will be verified before publication
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Editorial Decision:</strong> Not all tips will be published as news items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Response Time:</strong> We aim to respond within 5-7 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Confidentiality:</strong> Sensitive information will be handled appropriately
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Contact */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-8 h-8 text-[#0f2d6b]" />
              <h2 className="text-2xl font-bold text-[#0f2d6b]">Alternative Contact Methods</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Mail className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-sm text-gray-600 mb-2">Send directly to our editorial team</p>
                <a href="mailto:news@iaamonline.org" className="text-[#0f2d6b] font-medium text-sm">
                  news@iaamonline.org
                </a>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Phone className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-sm text-gray-600 mb-2">Call our editorial office</p>
                <a href="tel:+1-XXX-XXX-XXXX" className="text-[#0f2d6b] font-medium text-sm">
                  +1-XXX-XXX-XXXX
                </a>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <MessageCircle className="w-8 h-8 text-[#0f2d6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                <p className="text-sm text-gray-600">Monday - Friday</p>
                <p className="text-[#0f2d6b] font-medium text-sm">9:00 AM - 5:00 PM (EST)</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Urgent News:</strong> For time-sensitive news tips, please call our editorial office 
                directly during business hours or mark your email subject with [URGENT].
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}