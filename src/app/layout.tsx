import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: {
    default: 'درسکا',
    template: '%s | درسکا',
  },
  description: 'درسکا؛ همراه هوشمند یادگیری، تمرین و آزمون دانش‌آموزان',
  icons: {
    icon: '/darska-brand.png',
    apple: '/darska-brand.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
