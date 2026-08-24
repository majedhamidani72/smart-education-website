import { getGrade } from '@/lib/grades';
import { getTeachersForGrade } from '@/lib/teachers';
import { getBooksForGrade } from '@/lib/books';
import BackLink from '@/components/BackLink';
import TeacherCard from '@/components/TeacherCard';
import Link from 'next/link';
import { Book } from '@/types';

export default async function ExamGradePage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  const { gradeId } = await params;
  const gradeIdNum = Number(gradeId);

  const grade = await getGrade(gradeIdNum);
  const isElementary = grade.grade_number <= 6;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <BackLink href="/exam">بازگشت به لیست پایه‌ها</BackLink>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          پایه {grade.title} — کتابت رو انتخاب کن
        </h1>
      </div>

      {isElementary ? (
        <ElementaryTeachers gradeId={gradeIdNum} />
      ) : (
        <SecondaryBooks gradeId={gradeIdNum} />
      )}
    </div>
  );
}

async function ElementaryTeachers({ gradeId }: { gradeId: number }) {
  const teachers = await getTeachersForGrade(gradeId);

  if (teachers.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
        هنوز معلمی برای این پایه ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {teachers.map((teacher) => (
        <TeacherCard
          key={teacher.id}
          teacher={teacher}
          href={`/exam/${gradeId}/teacher/${teacher.id}`}
        />
      ))}
    </div>
  );
}

async function SecondaryBooks({ gradeId }: { gradeId: number }) {
  const books = await getBooksForGrade(gradeId);

  if (books.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
        هنوز کتابی برای این پایه ثبت نشده است.
      </div>
    );
  }

  return <ExamBookList books={books} />;
}

export function ExamBookList({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {books.map((book) => (
        <Link
          key={book.id}
          href={`/exam/start/${book.id}`}
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:border-orange-200 hover:shadow-md"
        >
          <span className="text-2xl">📗</span>
          <span className="text-sm font-medium text-gray-800">
            {book.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
