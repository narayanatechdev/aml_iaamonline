'use client';

import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { TypeformSubmission } from '@/components/forms/typeform-submission';

export default function DashboardSubmitPage() {
  return (
    <UserDashboardLayout>
      <TypeformSubmission />
    </UserDashboardLayout>
  );
}
