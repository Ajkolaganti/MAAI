// src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientProvider } from '@/components/client-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MAAI - AI-Powered UI Generation',
  description: 'Generate beautiful UI pages or components with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <div className="dark">
            {children}
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}