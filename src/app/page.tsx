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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 rounded-2xl bg-gray-900 px-6 py-10 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
          پایه‌ات رو انتخاب کن
        </h1>
        <p className="text-sm text-gray-300 sm:text-base">
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

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FeatureCard icon="🎬" text="۳ ویدئوی اول هر کتاب رایگان" />
        <FeatureCard icon="📱" text="فقط با شماره موبایل، بدون رمز عبور" />
        <FeatureCard icon="🔒" text="پرداخت امن با درگاه بانکی" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-600">
      <span className="text-lg">{icon}</span>
      {text}
    </div>
  );
}
