import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
});

export const metadata: Metadata = {
  title: 'اسمارت اجوکیشن',
  description: 'پلتفرم آموزشی هوشمند برای دانش‌آموزان مدارس ایران',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white font-sans">
        {children}
      </body>
    </html>
  );
}
