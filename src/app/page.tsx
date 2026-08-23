import { getGrades } from '@/lib/grades';
import GradeGrid from '@/components/GradeGrid';
import { Grade } from '@/types';

export const revalidate = 300;

export default async function Home() {
  let grades: Grade[] = [];
  let backendOffline = false;

  try {
    grades = await getGrades();
  } catch {
    backendOffline = true;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          پایه‌ات رو انتخاب کن
        </h1>
        <p className="text-gray-500">
          تدریس، گام‌به‌گام و آزمون آنلاین، مرتب‌شده برای هر پایه
        </p>
      </div>

      {backendOffline ? (
        <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">
          اتصال به سرور برقرار نشد. مطمئن شو بک‌اند لاراول با{' '}
          <code className="rounded bg-white px-1.5 py-0.5">
            php artisan serve
          </code>{' '}
          روشن است.
        </div>
      ) : grades.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-500">
          هنوز هیچ پایه‌ای ثبت نشده است.
        </div>
      ) : (
        <GradeGrid grades={grades} />
      )}

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FeatureCard text="۳ ویدئوی اول هر کتاب رایگان" />
        <FeatureCard text="فقط با شماره موبایل، بدون رمز عبور" />
        <FeatureCard text="پرداخت امن با درگاه بانکی" />
      </div>
    </div>
  );
}

function FeatureCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
      {text}
    </div>
  );
}
