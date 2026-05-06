import { MainLayout } from '@/components/layout/main-layout';
import { SubmissionWizard } from '@/components/forms/submission-wizard';

export const metadata = {
  title: 'Submit Manuscript - IAAM Advanced Materials Letters',
  description: 'Submit your research manuscript to Advanced Materials Letters for peer review',
};

export default function SubmitPage() {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Submit Manuscript
            </h1>
            <p className="text-gray-600">
              Advanced Materials Letters — Diamond Open Access
            </p>
          </div>

          {/* Submission Wizard */}
          <SubmissionWizard />
        </div>
      </div>
    </MainLayout>
  );
}