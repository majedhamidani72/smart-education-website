'use client';

import { useState } from 'react';
import { ContentItem } from '@/types';

interface Props {
  items: ContentItem[];
}

const TYPE_LABELS: Record<string, string> = {
  teaching: '🎥 تدریس',
  step_by_step: '📝 گام‌به‌گام',
  sample_questions: '📄 نمونه سوال',
};

export default function BookContent({ items }: Props) {
  // فقط انواعی که واقعاً محتوا دارند نشان داده می‌شوند — نه یک
  // تب ثابت و همیشگی برای هر سه نوع.
  const typesPresent = Array.from(
    new Set(items.map((i) => i.content_type?.slug).filter(Boolean))
  ) as string[];

  const [activeType, setActiveType] = useState<string | null>(
    typesPresent[0] ?? null
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
        هنوز محتوایی برای این کتاب منتشر نشده است.
      </div>
    );
  }

  const visibleItems = items
    .filter((i) => i.content_type?.slug === activeType)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {typesPresent.map((slug) => (
          <button
            key={slug}
            onClick={() => setActiveType(slug)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeType === slug
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {TYPE_LABELS[slug] ?? slug}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleItems.map((item) => (
          <ContentItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ContentItemRow({ item }: { item: ContentItem }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
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
        <p className="text-sm text-gray-400">
          برای مشاهده‌ی این محتوا، ابتدا باید این کتاب را خریداری کنی.
        </p>
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
        className="text-sm text-blue-600 underline"
      >
        باز کردن فایل PDF
      </a>
    );
  }

  if (item.step_by_step?.pages?.length) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {item.step_by_step.pages.map((page) => (
          <img
            key={page.id}
            src={page.image ?? ''}
            alt={`صفحه ${page.page_number}`}
            className="rounded-lg border border-gray-100"
          />
        ))}
      </div>
    );
  }

  return <p className="text-sm text-gray-400">فایلی برای این محتوا یافت نشد.</p>;
}
