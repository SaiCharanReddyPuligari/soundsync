// 'use client'; // This ensures the file is treated as a client component.

import { Roboto, Playfair_Display } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import { Providers } from './provider';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en" className={`${roboto.variable} ${playfair.variable}`}>
        <body className="font-roboto antialiased">{children}</body>
      </html>
    </Providers>
  );
}
