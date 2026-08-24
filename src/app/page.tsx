import { getGrades } from '@/lib/grades';
import GradeGrid from '@/components/GradeGrid';
import { Grade } from '@/types';
import Image from 'next/image';
import {
  Video,
  ClipboardCheck,
  ShieldCheck,
  Target,
  BookCheck,
  Sparkles,
  Headset,
} from 'lucide-react';

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
      {/* ===== بخش ۱: Hero — پس‌زمینه‌ی کرم/هلویی روشن ===== */}
      <div className="relative overflow-hidden bg-orange-50 px-4 pb-24 pt-14 sm:pb-32">
        {/* تزئینات ظریف پس‌زمینه */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-orange-100/70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-10 left-8 h-20 w-20 rounded-full bg-violet-100/60"
        />

        <div className="relative mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 md:flex-row md:justify-between">
          <div className="text-center md:text-right">
            <h1 className="mx-auto mb-4 max-w-xl text-xl font-extrabold leading-relaxed text-gray-900 sm:max-w-none sm:whitespace-nowrap sm:text-3xl md:mx-0 lg:text-4xl">
              یادگیری آسان، موفقیت برای همیشه
            </h1>
            <p className="mx-auto mb-8 max-w-md text-base leading-8 text-gray-600 md:mx-0">
              با محتوای آموزشی باکیفیت، درس را بهتر یاد بگیر و با آزمون‌های
              هدفمند، پیشرفتت را بسنج.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
              <a
                href="#grades"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-base font-bold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600"
              >
                <ClipboardCheck size={20} />
                آزمون آنلاین
              </a>
              <a
                href="#grades"
                className="inline-block rounded-full border-2 border-gray-800 px-7 py-3.5 text-base font-bold text-gray-800 transition hover:bg-gray-50"
              >
                شروع یادگیری
              </a>
            </div>
          </div>

          {/* تصویر آموزشی واقعی — بدون هیچ پس‌زمینه یا حاشیه‌ی
              اضافه، تا کرم‌رنگ خودِ تصویر با پس‌زمینه‌ی Hero یکی
              دیده شود و لبه‌ی مستطیلی مشخص نباشد. */}
          <Image
            src="/hero-illustration.png"
            alt="کوله‌پشتی، کتاب و لوازم‌التحریر"
            width={320}
            height={320}
            priority
            className="h-56 w-56 shrink-0 object-contain sm:h-72 sm:w-72"
          />
        </div>

        {/* ردیف ۴ ویژگی — فقط قابلیت‌های واقعی پروژه */}
        <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
          <FeatureItem
            icon={<Target size={24} />}
            title="محتوای هدفمند"
            desc="مطابق کتاب درسی و استاندارد"
          />
          <FeatureItem
            icon={<Video size={24} />}
            title="ویدیوهای آموزشی"
            desc="تدریس ساده و مفهومی"
          />
          <FeatureItem
            icon={<ClipboardCheck size={24} />}
            title="آزمون با نتیجه‌ی فوری"
            desc="بلافاصله بعد از پاسخ‌دهی"
          />
          <FeatureItem
            icon={<ShieldCheck size={24} />}
            title="ایمن و مطمئن"
            desc="ورود با کد یک‌بارمصرف"
          />
        </div>

        {/* جداکننده‌ی هلالی — منحنی دوموجی که به بخش پایین (سبز
            روشن) متصل می‌شود؛ عرض کامل صفحه و واکنش‌گرا. ارتفاع
            بیشتر و انحنای واضح‌تر از نسخه‌ی قبلی تا واقعاً هلالی
            دیده شود، نه یک خط تقریباً صاف. */}
        <svg
          className="absolute inset-x-0 -bottom-px h-20 w-full text-emerald-50 sm:h-32"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,80 C 200,140 350,20 550,50 C 750,80 850,10 1050,45 C 1250,80 1350,55 1440,65 L1440,150 L0,150 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ===== بخش ۲: انتخاب پایه تحصیلی — پس‌زمینه‌ی سبز روشن ===== */}
      <div id="grades" className="bg-emerald-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              انتخاب پایه تحصیلی
            </h2>
            <p className="text-base text-gray-600">
              پایه تحصیلی خود را انتخاب کنید تا وارد دنیای یادگیری شوید.
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

      {/* ===== بخش ۳: چرا اسمارت اجوکیشن؟ ===== */}
      <div className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              چرا اسمارت اجوکیشن؟
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-violet-300" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <WhyCard
              icon={<BookCheck size={26} />}
              title="مطابق کتاب درسی"
              desc="تمامی محتوا بر اساس آخرین ویرایش کتاب درسی است."
              bg="bg-orange-50"
              iconColor="text-orange-600"
            />
            <WhyCard
              icon={<ClipboardCheck size={26} />}
              title="آزمون‌های استاندارد"
              desc="با آزمون‌های طبقه‌بندی‌شده تواتت را بسنج."
              bg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <WhyCard
              icon={<Sparkles size={26} />}
              title="یادگیری جذاب"
              desc="با تدریس ساده و مفهومی، یادگیری را لذت‌بخش کن."
              bg="bg-sky-50"
              iconColor="text-sky-600"
            />
            <WhyCard
              icon={<Headset size={26} />}
              title="پشتیبانی سریع"
              desc="هر سوالی داری، ما همین‌جا هستیم."
              bg="bg-violet-50"
              iconColor="text-violet-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:text-right">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-violet-700 shadow-sm">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

function WhyCard({
  icon,
  title,
  desc,
  bg,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bg: string;
  iconColor: string;
}) {
  return (
    <div className={`rounded-2xl p-6 ${bg}`}>
      <span className={`mb-3 inline-flex ${iconColor}`}>{icon}</span>
      <p className="mb-1 text-base font-bold text-gray-900">{title}</p>
      <p className="text-sm leading-6 text-gray-600">{desc}</p>
    </div>
  );
}
