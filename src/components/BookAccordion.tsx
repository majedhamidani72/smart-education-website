'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types';

interface Props {
  books: Book[];
  /** برای گذاشتن پارامتر تشخیص معلم/پایه در لینک‌ها (اختیاری) */
  extraQuery?: string;
}

/**
 * لیست کتاب‌ها به‌صورت آکاردئون کشویی — دقیقاً همان الگوی سایت
 * همیار: هر کتاب یک ردیف کشیده و تمام‌عرض است (نه یک باکس مربعی)،
 * با کلیک باز می‌شود و زیرمجموعه‌های تدریس/نمونه‌سوال را نشان
 * می‌دهد؛ فقط یکی در هر لحظه باز می‌ماند.
 */
export default function BookAccordion({ books, extraQuery = '' }: Props) {
  const [openBookId, setOpenBookId] = useState<number | null>(
    books[0]?.id ?? null
  );

  return (
    <div className="space-y-2">
      {books.map((book) => {
        const isOpen = openBookId === book.id;

        return (
          <div
            key={book.id}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white"
          >
            <button
              onClick={() => setOpenBookId(isOpen ? null : book.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-right transition hover:bg-gray-50"
            >
              <span className="text-base font-semibold text-gray-800">
                {book.title}
              </span>
              <span
                className={`text-violet-700 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              >
                ⌄
              </span>
            </button>

            {isOpen && (
              <div className="space-y-1 border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <BookLink
                  href={`/book/${book.id}?type=teaching${extraQuery}`}
                  icon="🎥"
                  label="تدریس"
                />
                <BookLink
                  href={`/book/${book.id}?type=sample_questions${extraQuery}`}
                  icon="📄"
                  label="نمونه سوال"
                />
                <BookLink
                  href={`/book/${book.id}${extraQuery}`}
                  icon="🎯"
                  label="آزمون آنلاین"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BookLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base text-gray-700 transition hover:bg-white"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
