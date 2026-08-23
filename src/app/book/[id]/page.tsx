import { getBook } from '@/lib/books';
import { getTeachersForBook } from '@/lib/teachers';
import BackLink from '@/components/BackLink';
import TeacherCard from '@/components/TeacherCard';

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
    return <BookContent book={book} teacherId={Number(teacher_id)} />;
  }

  // در غیر این صورت (مسیر متوسطه)، معلم‌های این کتاب را می‌گیریم:
  const teachers = await getTeachersForBook(bookId);

  // فقط یک معلم؟ نیازی به انتخاب نیست — مستقیم وارد محتوا می‌شویم.
  if (teachers.length === 1) {
    return <BookContent book={book} teacherId={teachers[0].id} />;
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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <BackLink href={grade_id ? `/grade/${grade_id}` : '/'}>بازگشت</BackLink>

      <h1 className="mb-1 text-xl font-bold text-gray-900">{book.title}</h1>
      <p className="mb-6 text-sm text-gray-500">معلم‌ات رو انتخاب کن</p>

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
  );
}

function BookContent({
  book,
  teacherId,
}: {
  book: import('@/types').Book;
  teacherId: number;
}) {
  // این بخش (نمایش تدریس/گام‌به‌گام/نمونه‌سوال یک کتاب برای یک
  // معلم مشخص) قدم بعدی توسعه است — فعلاً فقط تأیید می‌کند که
  // مسیر تا اینجا درست رسیده.
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-xl font-bold text-gray-900">{book.title}</h1>
      <p className="text-sm text-gray-500">
        محتوای این کتاب (شناسه‌ی معلم: {teacherId}) به‌زودی اینجا نمایش داده
        می‌شود.
      </p>
    </div>
  );
}
