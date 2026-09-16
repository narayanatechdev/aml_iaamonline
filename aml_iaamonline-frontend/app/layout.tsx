import type { Metadata } from 'next';
import './globals.css';

const journalName = process.env.NEXT_PUBLIC_JOURNAL_NAME || 'Advanced Materials Letters';

export const metadata: Metadata = {
  // Overridden per-build so canonical/OG URLs match wherever this build is
  // actually served — see NEXT_PUBLIC_BASE_PATH in next.config.js.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://amljournal.iaamonline.org'),
  title: {
    default: journalName,
    template: `%s | ${journalName}`,
  },
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
        <link rel="stylesheet" href="https://use.typekit.net/und3est.css" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
