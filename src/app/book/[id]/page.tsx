import { getBook } from '@/lib/books';
import { getTeachersForBook } from '@/lib/teachers';
import { getBookContent } from '@/lib/content';
import { getBookQuizSummary } from '@/lib/quizzes';
import BackLink from '@/components/BackLink';
import TeacherCard from '@/components/TeacherCard';
import BookContent from '@/components/BookContent';
import QuizSummarySection from '@/components/QuizSummarySection';

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ teacher_id?: string; grade_id?: string }>;
}) {
  const { id } = await params;
  const { teacher_id, grade_id } = await searchParams;
  const bookId = Number(id);

  const book = await getBook(bookId);

  // اگر از قبل (مسیر ابتدایی، از داخل صفحه‌ی یک معلم مشخص) معلم
  // مشخص است، مستقیم وارد محتوای کتاب می‌شویم.
  if (teacher_id) {
    return <BookContentSection book={book} teacherId={Number(teacher_id)} />;
  }

  // در غیر این صورت (مسیر متوسطه)، معلم‌های این کتاب را می‌گیریم:
  const teachers = await getTeachersForBook(bookId);

  // فقط یک معلم؟ نیازی به انتخاب نیست — مستقیم وارد محتوا می‌شویم.
  if (teachers.length === 1) {
    return <BookContentSection book={book} teacherId={teachers[0].id} />;
  }

  // بدون هیچ معلمی — یعنی هنوز کسی این کتاب را تدریس نمی‌کند.
  if (teachers.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <BackLink href={grade_id ? `/grade/${grade_id}` : '/'}>بازگشت</BackLink>
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          هنوز معلمی برای «{book.title}» ثبت نشده است.
        </div>
      </div>
    );
  }

  // چند معلم — دانش‌آموز باید یکی را انتخاب کند.
  return (
    <div>
      <div className="pattern-header border-b border-gray-100 px-4 py-10 text-center">
        <p className="mb-2 inline-block rounded-full bg-violet-700 px-4 py-1 text-xs text-white">
          {book.title}
        </p>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          معلم‌ات رو انتخاب کن
        </h1>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <BackLink href={grade_id ? `/grade/${grade_id}` : '/'}>بازگشت</BackLink>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              href={`/book/${bookId}?teacher_id=${teacher.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

async function BookContentSection({
  book,
  teacherId,
}: {
  book: import('@/types').Book;
  teacherId: number;
}) {
  const [items, quizSummary] = await Promise.all([
    getBookContent(book.id),
    getBookQuizSummary(book.id),
  ]);

  return (
    <div>
      <div className="pattern-header border-b border-gray-100 px-4 py-10 text-center">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          {book.title}
        </h1>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <QuizSummarySection summary={quizSummary} />
        <BookContent items={items} />
      </div>
    </div>
  );
}
