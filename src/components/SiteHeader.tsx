'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOpenCheck, LogIn, LogOut, Menu, X } from 'lucide-react';
import { clearToken, getToken } from '@/lib/token';

const NAV_ITEMS = [
  { label: 'خانه', href: '/' },
  { label: 'دروس', href: '/#grades' },
  { label: 'درباره ما', href: '/about' },
  { label: 'آزمون آنلاین', href: '/exam', pill: true },
  { label: 'تماس با ما', href: '/contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLoggedIn(!!getToken()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const authControl = loggedIn ? (
    <button
      onClick={() => {
        clearToken();
        setLoggedIn(false);
      }}
      className="header-login"
    >
      <LogOut size={17} /> خروج
    </button>
  ) : (
    <Link href="/login" className="header-login"><LogIn size={17} /> ورود</Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-black text-[#1f1d2f]">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-100">
            <BookOpenCheck size={23} />
            <i className="absolute -bottom-1 -left-1 h-3 w-3 rounded-sm bg-violet-500 ring-2 ring-white" />
          </span>
          <span className="text-base sm:text-lg">اسمارت اجوکیشن</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => {
            const path = item.href.split('#')[0];
            const active = item.href === '/' ? pathname === '/' : path !== '/' && pathname.startsWith(path);
            return (
              <Link key={item.href} href={item.href} className={`${item.pill ? 'nav-pill' : 'nav-link'} ${active ? 'nav-active' : ''}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">{authControl}</div>
        <button aria-label="باز کردن منو" onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 lg:hidden">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mx-auto max-w-6xl border-t border-slate-100 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-orange-50">{item.label}</Link>)}
            <div className="mt-2 px-4">{authControl}</div>
          </nav>
        </div>
      )}
    </header>
  );
}
