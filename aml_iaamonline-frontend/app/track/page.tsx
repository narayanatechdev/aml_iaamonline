import { MainLayout } from '@/components/layout/main-layout';
import { TrackingForm } from '@/components/forms/tracking-form';

export const metadata = {
  title: 'Track Manuscript - IAAM Advanced Materials Letters',
  description: 'Track the status of your manuscript submission to Advanced Materials Letters',
};

export default function TrackPage() {
  return (
    <MainLayout>
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Track Your Submission
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor the status of your manuscript through each stage of the review process
            </p>
          </div>

          <TrackingForm />
        </div>
      </section>
    </MainLayout>
  );
}
