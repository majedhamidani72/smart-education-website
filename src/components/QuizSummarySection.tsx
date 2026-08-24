import { QuizSummary, QuizSummaryItem } from '@/types';

/**
 * سازماندهی آزمون‌های آنلاین به تفکیک دقیق سطح — بخش، فصل، یا
 * کل کتاب. این بخش عمداً برجسته و جدا از تدریس/نمونه‌سوال نمایش
 * داده می‌شود، چون دقیقاً همان چیزی است که پروژه را نسبت به
 * رقبا متمایز می‌کند: شفافیت کامل در این‌که هر آزمون دقیقاً
 * برای کدام قسمت طراحی شده.
 */
export default function QuizSummarySection({ summary }: { summary: QuizSummary }) {
  const total =
    summary.section.length + summary.chapter.length + summary.book.length;

  if (total === 0) {
    return null;
  }

  return (
    <div className="mb-10 rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/50 to-white p-5">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-xl">🎯</span>
        <div>
          <h2 className="font-bold text-gray-900">آزمون آنلاین</h2>
          <p className="text-xs text-gray-500">
            دقیقاً همان قسمتی که خوانده‌ای را امتحان بده
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <QuizGroup
          title="آزمون‌های بخش/درس"
          icon="📘"
          items={summary.section}
          getSubtitle={(q) =>
            [q.chapter_title, q.section_title].filter(Boolean).join(' — ')
          }
        />
        <QuizGroup title="آزمون‌های فصل" icon="📙" items={summary.chapter} />
        <QuizGroup title="آزمون کل کتاب" icon="📕" items={summary.book} />
      </div>
    </div>
  );
}

function QuizGroup({
  title,
  icon,
  items,
  getSubtitle,
}: {
  title: string;
  icon: string;
  items: QuizSummaryItem[];
  getSubtitle?: (item: QuizSummaryItem) => string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-600">
        {icon} {title}
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((quiz) => (
          <div
            key={quiz.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-3 transition hover:border-violet-200 hover:shadow-sm"
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
            {!quiz.is_free && (
              <span className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                🔒 پولی
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
