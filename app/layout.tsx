import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Spend Audit - Stop Overpaying for AI Tools',
  description:
    'Analyze your AI tool subscriptions and discover hidden monthly savings instantly. Get personalized recommendations to optimize your spending.',
  openGraph: {
    title: 'AI Spend Audit - Stop Overpaying for AI Tools',
    description:
      'Analyze your AI tool subscriptions and discover hidden monthly savings instantly.',
    type: 'website',
    siteName: 'AI Spend Audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit - Stop Overpaying for AI Tools',
    description:
      'Analyze your AI tool subscriptions and discover hidden monthly savings instantly.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
