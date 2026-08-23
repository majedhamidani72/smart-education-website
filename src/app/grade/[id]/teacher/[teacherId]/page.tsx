import { getGrade } from '@/lib/grades';
import { getTeacherBooks, getTeachersForGrade } from '@/lib/teachers';
import BackLink from '@/components/BackLink';
import BookCard from '@/components/BookCard';

export default async function TeacherBooksPage({
  params,
}: {
  params: Promise<{ id: string; teacherId: string }>;
}) {
  const { id, teacherId } = await params;
  const gradeId = Number(id);
  const teacherIdNum = Number(teacherId);

  const [grade, teachers, books] = await Promise.all([
    getGrade(gradeId),
    getTeachersForGrade(gradeId),
    getTeacherBooks(teacherIdNum, gradeId),
  ]);

  const teacher = teachers.find((t) => t.id === teacherIdNum);

  return (
    <div>
      <div className="pattern-header border-b border-gray-100 px-4 py-10 text-center">
        <p className="mb-2 inline-block rounded-full bg-violet-700 px-4 py-1 text-xs text-white">
          پایه {grade.title}
        </p>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          {teacher?.name ?? 'معلم'}
        </h1>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <BackLink href={`/grade/${gradeId}`}>بازگشت به لیست معلم‌ها</BackLink>

        {books.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
            هنوز کتابی برای این معلم ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                href={`/book/${book.id}?teacher_id=${teacherIdNum}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
