import { getTeacherBooks } from '@/lib/teachers';
import BackLink from '@/components/BackLink';
import { ExamBookList } from '../../page';

export default async function ExamTeacherBooksPage({
  params,
}: {
  params: Promise<{ gradeId: string; teacherId: string }>;
}) {
  const { gradeId, teacherId } = await params;
  const books = await getTeacherBooks(Number(teacherId), Number(gradeId));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <BackLink href={`/exam/${gradeId}`}>بازگشت به لیست معلم‌ها</BackLink>

      <h1 className="mb-8 text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
        کتابت رو انتخاب کن
      </h1>

      {books.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          هنوز کتابی برای این معلم ثبت نشده است.
        </div>
      ) : (
        <ExamBookList books={books} />
      )}
    </div>
  );
}
