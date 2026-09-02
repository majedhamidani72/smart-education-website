import Link from 'next/link';
import Image from 'next/image';

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-[#fafafa] px-4 py-6">
      <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5 text-sm font-black text-gray-800">
          <span className="relative h-9 w-9 overflow-hidden rounded-xl bg-orange-50 ring-1 ring-orange-100">
            <Image src="/darska-brand.png" alt="نشان کامل درسکا" fill sizes="36px" className="object-contain" />
          </span>
          درسکا
        </div>

        <nav className="flex items-center gap-4">
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
