'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken, clearToken } from '@/lib/token';

export default function SiteHeader() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="text-2xl">📚</span>
          اسمارت اجوکیشن
        </Link>

        {loggedIn ? (
          <button
            onClick={() => {
              clearToken();
              setLoggedIn(false);
            }}
            className="rounded-lg px-4 py-2 text-base text-gray-500 hover:bg-gray-50"
          >
            خروج
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-violet-700 px-5 py-2 text-base font-medium text-white hover:bg-violet-800"
          >
            ورود
          </Link>
        )}
      </div>
    </header>
  );
}
