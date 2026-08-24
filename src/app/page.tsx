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
      {/* Hero — رنگ ملایم، به‌علاوه‌ی چند شکل تزئینی محو (نه یک
          تصویر واقعی، صرفاً اشکال انتزاعی SVG با پالت خودمان) تا
          صفحه غنی‌تر و کمتر خالی به‌نظر برسد */}
      <div className="relative overflow-hidden bg-orange-50/70 px-4 py-14">
        {/* اشکال محوِ پس‌زمینه */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-4xl flex-col-reverse items-center gap-10 md:flex-row md:justify-between">
          <div className="text-center md:text-right">
            <h1 className="mx-auto mb-3 max-w-lg text-3xl font-extrabold text-gray-900 sm:text-4xl md:mx-0">
              درس بخوان، تمرین کن، خودت را بسنج
            </h1>
            <p className="mx-auto mb-7 max-w-md text-base leading-7 text-gray-600 md:mx-0">
              محتوای آموزشی مرحله‌به‌مرحله و آزمون آنلاین، مرتب‌شده برای
              پایه‌ی تحصیلی خودت.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
              <a
                href="#grades"
                className="inline-block rounded-full bg-violet-700 px-7 py-3 text-base font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800"
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

          <HeroIllustration />
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

/**
 * یک تصویرسازی انتزاعی و ساده (نه کپی از تصویر مرجع) — فقط
 * اشکال هندسی نرم با پالت رنگی خودمان، برای پرکردن فضای خالی
 * سمت چپِ Hero روی صفحه‌های بزرگ. روی موبایل مخفی می‌شود تا
 * صفحه شلوغ نشود.
 */
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 240 200"
      className="hidden h-48 w-56 shrink-0 md:block"
      aria-hidden
    >
      <rect x="20" y="60" width="140" height="100" rx="16" fill="#ede9fe" />
      <rect x="40" y="80" width="100" height="10" rx="5" fill="#a78bfa" />
      <rect x="40" y="100" width="70" height="10" rx="5" fill="#c4b5fd" />
      <rect x="40" y="120" width="85" height="10" rx="5" fill="#c4b5fd" />
      <circle cx="185" cy="70" r="34" fill="#ffedd5" />
      <path
        d="M170 70l10 10 20-22"
        stroke="#f97316"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="55" cy="45" r="16" fill="#d1fae5" />
      <circle cx="55" cy="45" r="6" fill="#10b981" />
    </svg>
  );
}
