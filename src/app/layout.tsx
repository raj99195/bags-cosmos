import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BAGS COSMOS — Your Token. Your Universe.',
  description: 'Analyze your Bags.fm creator token through the lens of the cosmos. Powered by Claude AI.',
  openGraph: {
    title: 'BAGS COSMOS',
    description: 'Your Token. Your Universe.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
