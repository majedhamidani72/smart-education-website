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
    <header className="border-b border-gray-100 px-4 py-3">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="font-bold text-gray-900">
          اسمارت اجوکیشن
        </Link>

        {loggedIn ? (
          <button
            onClick={() => {
              clearToken();
              setLoggedIn(false);
            }}
            className="text-sm text-gray-500"
          >
            خروج
          </button>
        ) : (
          <Link href="/login" className="text-sm text-gray-700">
            ورود
          </Link>
        )}
      </div>
    </header>
  );
}
