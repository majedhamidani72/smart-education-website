import { redirect } from 'next/navigation';
import { getBook } from '@/lib/books';
import { getBookQuizSummary } from '@/lib/quizzes';
import BackLink from '@/components/BackLink';

/**
 * وقتی از مسیر «آزمون آنلاین» به اینجا می‌رسیم، همیشه دنبال
 * آزمون سطح «کل کتاب» همین کتاب می‌گردیم و مستقیم به صفحه‌ی
 * خودِ آن آزمون هدایت می‌شویم — نه لیست محتوا یا انتخاب معلم.
 */
export default async function ExamStartPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const bookIdNum = Number(bookId);

  const [book, summary] = await Promise.all([
    getBook(bookIdNum),
    getBookQuizSummary(bookIdNum),
  ]);

  if (summary.book.length > 0) {
    redirect(`/quiz/${summary.book[0].id}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <BackLink href="/exam">بازگشت</BackLink>
      <div className="mb-3 text-4xl">📕</div>
      <h1 className="mb-2 text-lg font-bold text-gray-900">
        آزمون کل کتاب هنوز آماده نیست
      </h1>
      <p className="text-sm text-gray-500">
        برای «{book.title}» هنوز آزمونی برای کل کتاب ثبت نشده — می‌توانی از
        صفحه‌ی خودِ کتاب، آزمون‌های بخش یا فصل را امتحان کنی.
      </p>
    </div>
  );
}
