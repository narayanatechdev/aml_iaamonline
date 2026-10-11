import type { Metadata } from 'next';
import { IS_HUB } from '@/lib/hub-guard';
import { HubPageLayout } from '@/components/hub/HubPageLayout';
import { ContactSection } from '@/components/hub/ContactSection';
import ContactJournal from './contact-journal';

export const metadata: Metadata = IS_HUB
  ? {
      title: 'Contact',
      description:
        'Contact IAAM Publications about a submission, a subscription, a partnership or your membership.',
    }
  : {
      title: 'Contact',
      description:
        'Contact Advanced Materials Letters about a submission, a subscription or your membership.',
    };

/*
 * pubs.iaamonline.org builds from this same app/ directory as the AML and AMP
 * journal sites, so this route compiles into all three. The hub answers with
 * its own page; the journals keep theirs untouched.
 */
export default function ContactPage() {
  if (!IS_HUB) {
    return <ContactJournal />;
  }

  return (
    <HubPageLayout
      kicker="Get in touch"
      title="Contact Us"
      intro="We are here to help. Reach out to us for any questions, collaborations, or support."
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Contact', href: '/contact' },
      ]}
    >
      {/* The title block above stands in for the section's own heading. */}
      <ContactSection heading={false} />
    </HubPageLayout>
  );
}
