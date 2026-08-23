import Link from 'next/link';
import { Book } from '@/types';

export default function BookCard({ book, href }: { book: Book; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-24 w-16 items-center justify-center rounded-lg bg-gray-100 text-2xl">
        📗
      </div>
      <span className="text-sm font-medium text-gray-800">{book.title}</span>
    </Link>
  );
}
