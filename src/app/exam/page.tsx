import { getGrades } from '@/lib/grades';
import GradeGrid from '@/components/GradeGrid';
import BackLink from '@/components/BackLink';

export default async function ExamGradePicker() {
  const grades = await getGrades();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <BackLink href="/">بازگشت</BackLink>

      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          برای آزمون آنلاین، اول پایه‌ات رو انتخاب کن
        </h1>
        <p className="text-sm text-gray-500">
          بعد از انتخاب کتاب، مستقیم وارد آزمون کل همان کتاب می‌شوی.
        </p>
      </div>

      <GradeGrid grades={grades} basePath="/exam" />
    </div>
  );
}
