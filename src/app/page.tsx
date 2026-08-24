import { getGrades } from '@/lib/grades';
import GradeGrid from '@/components/GradeGrid';
import { Grade } from '@/types';

// چون apiFetch دیگر خودش cache: 'no-store' دارد، دیگر نیازی به
// این export نیست — قبلاً این خط باعث می‌شد صفحه‌ی اصلی تا ۵
// دقیقه، حتی بعد از تغییر داده‌ی بک‌اند، نسخه‌ی قدیمی نشان دهد.

export default async function Home() {
  let grades: Grade[] = [];
  let backendOffline = false;

  try {
    grades = await getGrades();
  } catch {
    backendOffline = true;
  }

  return (
    <div>
      {/* هدر با الگوی تزئینی — دقیقاً طبق طراحی همیار، ولی فاصله‌ی
          بالا/پایینش کمتر شده تا صفحه فشرده‌تر باشد */}
      <div className="pattern-header border-b border-gray-100 px-4 py-8 text-center">
        <h1 className="mx-auto mb-2 max-w-lg text-xl font-bold text-gray-900 sm:text-2xl">
          یادگیری آسان، در هر زمان و هر مکان
        </h1>
        <p className="mx-auto mb-4 max-w-md text-sm text-gray-500">
          پایه تحصیلی خود را انتخاب کنید و به دنیایی از محتوای آموزشی با
          کیفیت دسترسی پیدا کنید.
        </p>
        <a
          href="#grades"
          className="inline-block rounded-full bg-violet-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800"
        >
          شروع یادگیری
        </a>
      </div>

      <div id="grades" className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            انتخاب پایه تحصیلی
          </h2>
          <p className="text-sm text-gray-500">
            برای دسترسی به محتوای آموزشی، پایه خود را انتخاب کنید.
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

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FeatureCard icon="🎬" text="۳ ویدئوی اول هر کتاب رایگان" />
          <FeatureCard icon="📱" text="فقط با شماره موبایل، بدون رمز عبور" />
          <FeatureCard icon="🔒" text="پرداخت امن با درگاه بانکی" />
        </div>
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
