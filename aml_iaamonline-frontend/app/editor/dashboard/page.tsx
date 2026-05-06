'use client';

import React, { useState } from 'react';
import { LuxuryDashboardLayout } from '@/components/luxury/dashboard-layout';
import { LuxuryInsights } from '@/components/luxury/dashboard-content';
import { EditorDashboard } from '@/components/editor/dashboard'; // Keep old one for "Editorial Workflow" tab

export default function LuxuryDashboardPage() {
  const [activeTab, setActiveTab] = useState('insights');

  return (
    <LuxuryDashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'insights' && <LuxuryInsights />}
      {activeTab === 'manuscripts' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <EditorDashboard />
        </div>
      )}
      {activeTab === 'users' && (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <span className="text-luxury-primary text-2xl font-bold">UM</span>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">User Management</h2>
            <p className="text-luxury-text-secondary text-sm max-w-sm mx-auto">
              Access control and team collaboration features are being prepared for your luxury panel.
            </p>
          </div>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <span className="text-luxury-primary text-2xl font-bold">ST</span>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">System Settings</h2>
            <p className="text-luxury-text-secondary text-sm max-w-sm mx-auto">
              Global configuration and security protocols for the IAAM network.
            </p>
          </div>
        </div>
      )}
    </LuxuryDashboardLayout>
  );
}
