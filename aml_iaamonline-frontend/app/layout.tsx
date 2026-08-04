import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://amljournal.iaamonline.org'),
  title: {
    default: 'Advanced Materials Letters',
    template: '%s | Advanced Materials Letters',
  },
  description:
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
