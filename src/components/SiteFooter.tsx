import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <GraduationCap size={20} className="text-orange-500" />
          اسمارت اجوکیشن
        </div>

        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm text-gray-500 transition hover:text-orange-600"
          >
            درباره ما
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-500 transition hover:text-orange-600"
          >
            تماس با ما
          </Link>
        </nav>
      </div>
    </footer>
  );
}
