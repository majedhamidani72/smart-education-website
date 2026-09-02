'use client';

import { useRouter } from 'next/navigation';
import { QuizSummary, QuizSummaryItem } from '@/types';
import { getToken } from '@/lib/token';
import { ClipboardCheck } from 'lucide-react';

/**
 * سازماندهی آزمون‌های آنلاین به تفکیک دقیق سطح — بخش، فصل، یا
 * کل کتاب. این بخش عمداً برجسته و جدا از تدریس/نمونه‌سوال نمایش
 * داده می‌شود، چون دقیقاً همان چیزی است که پروژه را نسبت به
 * رقبا متمایز می‌کند: شفافیت کامل در این‌که هر آزمون دقیقاً
 * برای کدام قسمت طراحی شده.
 */
export default function QuizSummarySection({
  summary,
  bookId,
}: {
  summary: QuizSummary;
  bookId: number;
}) {
  if (summary.book.length === 0) {
    return (
      <section className="mb-10 rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/70 to-white p-5 shadow-[0_10px_35px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-100"><ClipboardCheck size={25} /></span>
          <div><h2 className="font-black text-gray-900">آزمون آنلاین کل کتاب</h2><p className="text-xs text-gray-500">آزمون جامع کتاب پس از انتشار در این قسمت فعال می‌شود.</p></div>
        </div>
        <div className="mt-6">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5"><span className="text-lg">🏆</span><strong className="mt-3 block text-sm text-slate-800">آزمون جامع کل کتاب</strong><span className="mt-1 block text-[10px] text-slate-400">به‌زودی فعال می‌شود</span></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10 rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/70 to-white p-5 shadow-[0_10px_35px_rgba(16,185,129,0.06)] sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-100"><ClipboardCheck size={25} /></span>
        <div>
          <h2 className="font-black text-gray-900">آزمون آنلاین کل کتاب</h2>
          <p className="text-xs text-gray-500">
            سنجش جامع همه فصل‌های کتاب
          </p>
        </div>
      </div>

      <QuizGroup title="آزمون جامع کل کتاب" icon="🏆" items={summary.book} bookId={bookId} />
    </section>
  );
}

function QuizGroup({
  title,
  icon,
  items,
  bookId,
  getSubtitle,
}: {
  title: string;
  icon: string;
  items: QuizSummaryItem[];
  bookId: number;
  getSubtitle?: (item: QuizSummaryItem) => string;
}) {
  const router = useRouter();

  if (items.length === 0) return null;

  function handleClick(quiz: QuizSummaryItem) {
    // اگر وارد نشده، اول باید وارد شود — بعد از ورود دوباره به
    // همین آزمون برمی‌گردد.
    if (!getToken()) {
      router.push(`/login?redirect=/quiz/${quiz.id}`);
      return;
    }

    // تصمیم نهایی درباره دسترسی با API شروع آزمون است؛ این صفحه ممکن است
    // در رندر اولیه بدون توکن دریافت شده باشد و نباید خرید را اشتباه تکرار کند.
    router.push(`/quiz/${quiz.id}?book_id=${bookId}`);
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-600">
        {icon} {title}
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => handleClick(quiz)}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-3 text-right transition hover:border-violet-200 hover:shadow-sm"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{quiz.title}</p>
              {getSubtitle && (
                <p className="text-xs text-gray-400">{getSubtitle(quiz)}</p>
              )}
              <p className="text-xs text-gray-400">
                {quiz.question_count} سوال
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
