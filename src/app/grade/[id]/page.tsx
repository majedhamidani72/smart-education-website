import { getGrade } from '@/lib/grades';
import { getTeachersForGrade } from '@/lib/teachers';
import { getBooksForGrade } from '@/lib/books';
import BackLink from '@/components/BackLink';
import TeacherCard from '@/components/TeacherCard';
import BookCard from '@/components/BookCard';

export default async function GradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gradeId = Number(id);

  const grade = await getGrade(gradeId);
  const isElementary = grade.grade_number <= 6;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <BackLink href="/">بازگشت به لیست پایه‌ها</BackLink>

      <h1 className="mb-6 text-xl font-bold text-gray-900">
        پایه {grade.title}
      </h1>

      {isElementary ? (
        <ElementaryGradeContent gradeId={gradeId} />
      ) : (
        <SecondaryGradeContent gradeId={gradeId} />
      )}
    </div>
  );
}

async function ElementaryGradeContent({ gradeId }: { gradeId: number }) {
  const teachers = await getTeachersForGrade(gradeId);

  if (teachers.length === 0) {
    return <EmptyState text="هنوز معلمی برای این پایه ثبت نشده است." />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">معلم‌ات رو انتخاب کن</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            href={`/grade/${gradeId}/teacher/${teacher.id}`}
          />
        ))}
      </div>
    </div>
  );
}

async function SecondaryGradeContent({ gradeId }: { gradeId: number }) {
  const books = await getBooksForGrade(gradeId);

  if (books.length === 0) {
    return <EmptyState text="هنوز کتابی برای این پایه ثبت نشده است." />;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">درست رو انتخاب کن</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} href={`/book/${book.id}?grade_id=${gradeId}`} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
      {text}
    </div>
  );
}
