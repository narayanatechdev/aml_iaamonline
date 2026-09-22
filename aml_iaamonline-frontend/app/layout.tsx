import type { Metadata } from 'next';
import './globals.css';

const isHub = process.env.NEXT_PUBLIC_SITE_KIND === 'hub';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const journalName = process.env.NEXT_PUBLIC_JOURNAL_NAME || 'Advanced Materials Letters';

export const metadata: Metadata = isHub
  ? {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pubs.iaamonline.org'),
      title: {
        default: 'IAAM Publications | Advanced Materials Research Journals',
        template: '%s | IAAM Publications',
      },
      description:
        'Not-for-profit publisher of peer-reviewed advanced materials research: journals, conference proceedings, lectures, videos, web talks, books and reports.',
      // Without this the hub inherits app/favicon.ico, which is the journal's.
      icons: {
        icon: [{ url: '/iaam-logo.svg', type: 'image/svg+xml' }],
        shortcut: [{ url: '/iaam-logo.svg', type: 'image/svg+xml' }],
        apple: [{ url: '/iaam-logo.svg', type: 'image/svg+xml' }],
      },
      openGraph: {
        title: 'IAAM Publications: Knowledge. Discovery. Impact.',
        description: 'Read, watch and publish advanced materials research with a not-for-profit scientific publisher.',
        siteName: 'IAAM Publications',
        type: 'website',
      },
    }
  : {
      // Overridden per-build so canonical/OG URLs match wherever this build
      // is actually served — see NEXT_PUBLIC_BASE_PATH in next.config.js.
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://amljournal.iaamonline.org'),
      title: {
        default: journalName,
        template: `%s | ${journalName}`,
      },
      // Declared rather than left to app/favicon.ico: that file convention
      // emits on every build, so the hub was serving this journal icon too.
      icons: { icon: [{ url: `${basePath}/journal-favicon.ico`, type: 'image/x-icon' }] },
      // NEXT_PUBLIC_JOURNAL_DESCRIPTION overrides this per deployment — the
      // default below states AML-specific facts (founding year) that don't
      // necessarily hold for another journal built from this same codebase.
      description:
        process.env.NEXT_PUBLIC_JOURNAL_DESCRIPTION ||
        'Advanced Materials Letters is a peer-reviewed international journal of the International Association of Advanced Materials (IAAM), publishing research across materials science since 2010.',
    };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {isHub ? (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=Figtree:wght@400;500;600;700&display=swap"
          />
        ) : (
          <link rel="stylesheet" href="https://use.typekit.net/und3est.css" />
        )}
      </head>
      <body className={isHub ? 'font-hub-body' : 'font-sans'}>{children}</body>
    </html>
  );
}
