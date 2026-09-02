import Link from 'next/link';
import { Book } from '@/types';

export default function BookCard({ book, href }: { book: Book; href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex h-24 w-16 items-center justify-center rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 text-xl transition group-hover:scale-105">
        📗
      </div>
      <span className="text-sm font-medium text-gray-800">{book.title}</span>
    </Link>
  );
}
