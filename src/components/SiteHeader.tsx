'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { getToken, clearToken } from '@/lib/token';

/**
 * منوی وسط هدر — عمداً فقط شامل مقصدهایی است که واقعاً روی سایت
 * وجود دارند (خانه، آزمون آنلاین که به بخش پایه‌ها می‌رود). بلاگ،
 * دروس، درباره ما، و تماس با ما چون صفحه‌ی واقعی ندارند، اضافه
 * نشدند — نه برای این‌که در طرح مرجع نبودند.
 */
const NAV_ITEMS = [
  { label: 'خانه', href: '/' },
  { label: 'آزمون آنلاین', href: '/#grades' },
];

export default function SiteHeader() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-gray-900"
        >
          <GraduationCap size={26} className="text-violet-700" />
          اسمارت اجوکیشن
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition hover:text-violet-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {loggedIn ? (
          <button
            onClick={() => {
              clearToken();
              setLoggedIn(false);
            }}
            className="rounded-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
          >
            خروج
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-violet-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-800"
          >
            ورود
          </Link>
        )}
      </div>
    </header>
  );
}
