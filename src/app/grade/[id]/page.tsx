import { getGrade } from '@/lib/grades';
import { getTeachersForGrade } from '@/lib/teachers';
import { getBooksForGrade } from '@/lib/books';
import BackLink from '@/components/BackLink';
import TeacherCard from '@/components/TeacherCard';
import BookAccordion from '@/components/BookAccordion';

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
    <div>
      <div className="pattern-header border-b border-gray-100 px-4 py-10 text-center">
        <p className="mb-2 inline-block rounded-full bg-violet-700 px-4 py-1 text-xs text-white">
          پایه {grade.title}
        </p>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          {isElementary ? 'معلم‌ات رو انتخاب کن' : 'درست رو انتخاب کن'}
        </h1>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <BackLink href="/">بازگشت به لیست پایه‌ها</BackLink>

        {isElementary ? (
          <ElementaryGradeContent gradeId={gradeId} />
        ) : (
          <SecondaryGradeContent gradeId={gradeId} />
        )}
      </div>
    </div>
  );
}

async function ElementaryGradeContent({ gradeId }: { gradeId: number }) {
  const teachers = await getTeachersForGrade(gradeId);

  if (teachers.length === 0) {
    return <EmptyState text="هنوز معلمی برای این پایه ثبت نشده است." />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {teachers.map((teacher) => (
        <TeacherCard
          key={teacher.id}
          teacher={teacher}
          href={`/grade/${gradeId}/teacher/${teacher.id}`}
        />
      ))}
    </div>
  );
}

async function SecondaryGradeContent({ gradeId }: { gradeId: number }) {
  const books = await getBooksForGrade(gradeId);

  if (books.length === 0) {
    return <EmptyState text="هنوز کتابی برای این پایه ثبت نشده است." />;
  }

  return <BookAccordion books={books} extraQuery={`&grade_id=${gradeId}`} />;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
      {text}
    </div>
  );
}
