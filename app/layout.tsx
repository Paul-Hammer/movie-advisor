import React, { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { cookies } from 'next/headers';

const poppins = Poppins({ subsets: ['latin'], weight: '400' });

import Header from '@/components/Header';
import Providers from '@/providers';

import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'Movie advisor | Discover Your Next Favorite Movie',
  description:
    'Explore a diverse selection of movies with Movie Advisor. Get random movie recommendations and find out top-rated, popular, and user-favorite films.'
};

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const theme = cookies().get('theme')?.value as Theme;

  return (
    <html lang='en' className={theme}>
      <head>
        <meta name='theme-color' content='black' />
      </head>
      <body style={poppins.style}>
        <Providers theme={theme}>
          <div className='fixed w-full left-0 top-0 z-20'>
            <Header />
          </div>
          <main className='px-2 mx-auto flex flex-col flex-1 w-full max-w-[1240px] mt-[56px]'>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
