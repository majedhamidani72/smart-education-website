'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ContentItem } from '@/types';

interface Props {
  items: ContentItem[];
  bookId: number;
}

const TYPE_LABELS: Record<string, string> = {
  teaching: '🎥 تدریس',
  sample_questions: '📄 نمونه سوال',
  // گام‌به‌گام عمداً حذف شده — فعلاً از دید کاربر پنهان است، هرچند
  // در بک‌اند و پنل ادمین موجود و کامل است.
};

const HIDDEN_TYPES = ['step_by_step'];

export default function BookContent({ items, bookId }: Props) {
  const visibleItemsAll = items.filter(
    (i) => !HIDDEN_TYPES.includes(i.content_type?.slug ?? '')
  );

  // فقط انواعی که واقعاً محتوا دارند نشان داده می‌شوند — نه یک
  // تب ثابت و همیشگی برای هر نوع.
  const typesPresent = Array.from(
    new Set(visibleItemsAll.map((i) => i.content_type?.slug).filter(Boolean))
  ) as string[];

  const [activeType, setActiveType] = useState<string | null>(
    typesPresent[0] ?? null
  );

  if (visibleItemsAll.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
        هنوز محتوایی برای این کتاب منتشر نشده است.
      </div>
    );
  }

  const visibleItems = visibleItemsAll
    .filter((i) => i.content_type?.slug === activeType)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {typesPresent.map((slug) => (
          <button
            key={slug}
            onClick={() => setActiveType(slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeType === slug
                ? 'bg-violet-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {TYPE_LABELS[slug] ?? slug}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleItems.map((item) => (
          <ContentItemCard key={item.id} item={item} bookId={bookId} />
        ))}
      </div>
    </div>
  );
}

function ContentItemCard({ item, bookId }: { item: ContentItem; bookId: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 transition hover:shadow-md">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-medium text-gray-800">{item.title}</span>
        {!item.has_access && (
          <span className="whitespace-nowrap rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            🔒 نیاز به خرید
          </span>
        )}
      </div>

      {item.has_access ? (
        <ContentPlayer item={item} />
      ) : (
        <Link
          href={`/purchase?book_id=${bookId}`}
          className="text-sm font-medium text-violet-700 underline"
        >
          برای مشاهده‌ی این محتوا، ابتدا این کتاب را خریداری کن ←
        </Link>
      )}
    </div>
  );
}

function ContentPlayer({ item }: { item: ContentItem }) {
  if (item.video?.video_url) {
    return (
      <video
        controls
        className="w-full rounded-lg"
        poster={item.video.thumbnail_url ?? undefined}
      >
        <source src={item.video.video_url} />
      </video>
    );
  }

  if (item.pdf_file?.file) {
    return (
      <a
        href={item.pdf_file.file}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-violet-700 underline"
      >
        باز کردن فایل PDF
      </a>
    );
  }

  return <p className="text-sm text-gray-400">فایلی برای این محتوا یافت نشد.</p>;
}
