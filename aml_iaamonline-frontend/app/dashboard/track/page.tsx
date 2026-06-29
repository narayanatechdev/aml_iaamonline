'use client';

import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { TrackingForm } from '@/components/forms/tracking-form';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TrackContent() {
  const searchParams = useSearchParams();
  
  return (
    <TrackingForm 
      initialSubmissionId={searchParams.get('id') || undefined} 
      initialEmail={searchParams.get('email') || undefined} 
    />
  );
}

export default function DashboardTrackPage() {
  return (
    <UserDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Track Your Submission</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor your manuscript through each stage of the review process</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <TrackContent />
        </Suspense>
      </div>
    </UserDashboardLayout>
  );
}