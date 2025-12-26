import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Home Sweet Home | Premium Furniture',
  description: 'Discover premium furniture for your home',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <Navigation />
        <main className="flex-1">{children}</main>
        {/* Footer will be added later */}
      </body>
    </html>
  );
}