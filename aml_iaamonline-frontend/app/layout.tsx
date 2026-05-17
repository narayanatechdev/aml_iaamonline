import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AML IAA Online',
  description: 'AML IAA Online Management System',
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
