'use client';

import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { TrackingForm } from '@/components/forms/tracking-form';

export default function DashboardTrackPage() {
  return (
    <UserDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Track Your Submission</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor your manuscript through each stage of the review process</p>
        </div>
        <TrackingForm />
      </div>
    </UserDashboardLayout>
  );
}
