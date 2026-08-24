import { getGrades } from '@/lib/grades';
import GradeGrid from '@/components/GradeGrid';
import { Grade } from '@/types';
import { Video, ClipboardCheck, ShieldCheck } from 'lucide-react';

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
      {/* Hero — رنگ ملایم و روشن (نه بنفش تیره‌ی قبلی)، متن تیره
          برای خوانایی کامل */}
      <div className="bg-orange-50/70 px-4 py-12 text-center">
        <h1 className="mx-auto mb-3 max-w-xl text-3xl font-extrabold text-gray-900 sm:text-4xl">
          درس بخوان، تمرین کن، خودت را بسنج
        </h1>
        <p className="mx-auto mb-7 max-w-md text-base leading-7 text-gray-600">
          محتوای آموزشی مرحله‌به‌مرحله و آزمون آنلاین، مرتب‌شده برای پایه‌ی
          تحصیلی خودت.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#grades"
            className="inline-block rounded-full bg-violet-700 px-7 py-3 text-base font-bold text-white transition hover:bg-violet-800"
          >
            شروع یادگیری
          </a>
          <a
            href="#grades"
            className="inline-flex items-center gap-2 rounded-full border-2 border-violet-700 px-7 py-3 text-base font-bold text-violet-700 transition hover:bg-violet-50"
          >
            <ClipboardCheck size={20} />
            آزمون آنلاین
          </a>
        </div>
      </div>

      {/* ویژگی‌های واقعی سیستم — فقط چیزهایی که واقعاً پیاده‌سازی
          شده‌اند (نه آمار ساختگی) */}
      <div className="border-b border-gray-100 bg-white px-4 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<Video size={22} />}
            text="۳ ویدئوی اول هر کتاب رایگان"
          />
          <FeatureCard
            icon={<ClipboardCheck size={22} />}
            text="آزمون آنلاین با نتیجه‌ی فوری"
          />
          <FeatureCard
            icon={<ShieldCheck size={22} />}
            text="پرداخت امن با درگاه بانکی"
          />
        </div>
      </div>

      {/* بخش انتخاب پایه — پس‌زمینه‌ی ظریفاً متفاوت از Hero */}
      <div id="grades" className="bg-emerald-50/40 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              پایه تحصیلی خودت را انتخاب کن
            </h2>
            <p className="text-base text-gray-600">
              برای مشاهده‌ی درس‌ها، ابتدا پایه تحصیلی خود را انتخاب کن.
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
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 text-base text-gray-700">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
        {icon}
      </span>
      {text}
    </div>
  );
}
