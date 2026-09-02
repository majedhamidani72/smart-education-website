'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertTriangle, LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react';
import { AUTH_CHANGED_EVENT, clearToken, getToken } from '@/lib/token';

const NAV_ITEMS = [
  { label: 'خانه', href: '/' },
  { label: 'جست‌وجو', href: '/search' },
  { label: 'پاورپوینت تدریس', href: '/powerpoints' },
  { label: 'پایه‌ها و دروس', href: '/#learning-explorer' },
  { label: 'درباره ما', href: '/about' },
  { label: 'تماس با ما', href: '/contact' },
  { label: 'آزمون آنلاین', href: '/?mode=online_exam#learning-explorer', pill: true },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    const syncAuth = () => setLoggedIn(!!getToken());
    const frame = requestAnimationFrame(syncAuth);
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const authControl = loggedIn ? (
    <div className="flex items-center gap-2">
    <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700"><LayoutDashboard size={17} /> داشبورد من</Link>
    <button
      onClick={() => setShowLogoutConfirmation(true)}
      className="header-login"
    >
      <LogOut size={17} /> خروج
    </button>
    </div>
  ) : (
    <Link href="/login" className="header-login"><LogIn size={17} /> ورود</Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-black text-[#1f1d2f]">
          <span className="relative h-10 w-10 overflow-hidden rounded-2xl bg-[#fff3e8] p-0.5 shadow-md shadow-orange-100 ring-1 ring-orange-100">
            <Image src="/darska-brand.png" alt="نشان کامل درسکا" fill sizes="40px" className="object-contain" priority />
          </span>
          <span className="text-base sm:text-lg">درسکا</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
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
        <div className="mx-auto max-w-[1480px] border-t border-slate-100 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-orange-50">{item.label}</Link>)}
            <div className="mt-2 px-4">{authControl}</div>
          </nav>
        </div>
      )}
      </header>

      {showLogoutConfirmation && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirmation-title"
          onClick={() => setShowLogoutConfirmation(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl ring-1 ring-slate-900/5"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <AlertTriangle size={30} />
            </span>
            <h2 id="logout-confirmation-title" className="mt-5 text-lg font-black text-slate-900">
              خروج از حساب کاربری؟
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirmation(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  clearToken();
                  setLoggedIn(false);
                  setOpen(false);
                  setShowLogoutConfirmation(false);
                }}
                className="rounded-xl bg-gradient-to-l from-orange-500 to-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5"
              >
                بله، خارج شو
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
