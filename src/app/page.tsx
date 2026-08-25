import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, BarChart3, BookOpen, ClipboardCheck, FileQuestion,
  Gamepad2, Headphones, Medal, MessageCircleMore, PlayCircle,
  ShieldCheck, Sparkles, Target, Video,
} from 'lucide-react';
import GradeGrid from '@/components/GradeGrid';
import { getGrades } from '@/lib/grades';
import { Grade } from '@/types';

const heroFeatures = [
  { icon: Target, title: 'محتوای هدفمند', text: 'مطابق کتاب درسی و استاندارد' },
  { icon: Video, title: 'ویدیوهای آموزشی', text: 'تدریس ساده، مفهومی و روان' },
  { icon: BarChart3, title: 'گزارش پیشرفت', text: 'پیگیری دقیق روند یادگیری' },
  { icon: ShieldCheck, title: 'ایمن و مطمئن', text: 'اطلاعات شما نزد ما محفوظ است' },
];

const reasons = [
  { icon: BookOpen, title: 'مطابق کتاب درسی', text: 'تمامی محتوا بر اساس آخرین ویرایش کتاب‌های درسی تهیه شده است.', style: 'from-orange-50 to-amber-50 text-orange-500' },
  { icon: ClipboardCheck, title: 'آزمون‌های استاندارد', text: 'با آزمون‌های طبقه‌بندی‌شده توانایی خودت را دقیق بسنج.', style: 'from-emerald-50 to-teal-50 text-emerald-500' },
  { icon: Gamepad2, title: 'یادگیری جذاب', text: 'با آموزش ساده و تمرین‌های متنوع، یادگیری را لذت‌بخش کن.', style: 'from-blue-50 to-indigo-50 text-blue-500' },
  { icon: MessageCircleMore, title: 'پشتیبانی سریع', text: 'هر سؤالی داری، ما در مسیر یادگیری همراهت هستیم.', style: 'from-violet-50 to-fuchsia-50 text-violet-500' },
];

const suggestions = [
  { icon: PlayCircle, title: 'ویدیوهای آموزشی', text: 'تدریس مفهومی و ساده', href: '#grades', color: 'text-violet-500 bg-violet-50' },
  { icon: FileQuestion, title: 'نمونه سؤالات', text: 'سؤالات طبقه‌بندی‌شده', href: '/exam', color: 'text-emerald-500 bg-emerald-50' },
  { icon: Sparkles, title: 'گام‌به‌گام دروس', text: 'حل تمرین‌ها به زبان ساده', href: '#grades', color: 'text-orange-500 bg-orange-50' },
  { icon: Gamepad2, title: 'تمرین هدفمند', text: 'یادگیری همراه با سرگرمی', href: '/exam', color: 'text-blue-500 bg-blue-50' },
  { icon: Headphones, title: 'پشتیبانی آموزشی', text: 'همراه شما در مسیر یادگیری', href: '/contact', color: 'text-rose-500 bg-rose-50' },
];

export default async function Home() {
  let grades: Grade[] = [];
  let backendOffline = false;

  try {
    grades = await getGrades();
  } catch {
    backendOffline = true;
  }

  return (
    <div className="overflow-hidden bg-white">
      <section className="hero-pattern relative bg-[#fff5ea] px-4 pb-24 pt-10 sm:pb-28 sm:pt-14 lg:pt-16">
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="order-1 text-center lg:text-right">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-bold text-orange-600 shadow-sm">
              <Medal size={16} /> همراه هوشمند مسیر یادگیری
            </span>
            <h1 className="text-3xl font-black leading-[1.55] text-[#171526] sm:text-4xl lg:text-5xl">
              یادگیری آسان،<br />موفقیت برای همیشه
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-slate-600 sm:text-base lg:mx-0">
              با محتوای آموزشی باکیفیت، درس را بهتر یاد بگیر و با آزمون‌های هدفمند، پیشرفتت را بسنج.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="#grades" className="button-outline group"><BookOpen size={20} />شروع یادگیری<ArrowLeft size={17} className="transition group-hover:-translate-x-1" /></Link>
              <Link href="/exam" className="button-primary group"><Medal size={20} />آزمون آنلاین<ArrowLeft size={17} className="transition group-hover:-translate-x-1" /></Link>
            </div>
          </div>
          <div className="order-2 flex justify-center">
            <Image src="/hero-illustration.png" alt="کوله‌پشتی، کتاب و لوازم‌التحریر" width={640} height={640} priority className="h-auto w-full max-w-[480px] drop-shadow-[0_24px_28px_rgba(230,150,77,0.13)] lg:max-w-[560px]" />
          </div>
        </div>

        <div className="relative mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-5 border-t border-orange-200/70 pt-8 lg:grid-cols-4 lg:gap-8">
          {heroFeatures.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-[0_8px_22px_rgba(235,149,74,0.14)]"><Icon size={24} strokeWidth={1.8} /></span>
              <div><h2 className="text-sm font-extrabold text-slate-800">{title}</h2><p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">{text}</p></div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 -bottom-px h-12 bg-white [clip-path:ellipse(57%_46%_at_50%_100%)] sm:h-16" />
      </section>

      <section id="grades" className="grade-pattern relative px-4 pb-20 pt-14 sm:pb-24 sm:pt-20">
        <div className="relative mx-auto max-w-6xl">
          <SectionTitle title="انتخاب پایه تحصیلی" text="پایه تحصیلی خود را انتخاب کنید تا وارد دنیای یادگیری شوید." />
          <div className="mt-10">
            {backendOffline ? (
              <div className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-white p-5 text-center text-sm text-red-700 shadow-sm">اتصال به سرور برقرار نشد. لطفاً مطمئن شوید بک‌اند Laravel در حال اجرا است.</div>
            ) : grades.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white p-5 text-center text-sm text-slate-500 shadow-sm">هنوز هیچ پایه‌ای ثبت نشده است.</div>
            ) : <GradeGrid grades={grades} />}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title="چرا اسمارت اجوکیشن؟" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text, style }) => (
              <article key={title} className={`rounded-3xl bg-gradient-to-br p-6 text-center ${style}`}>
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm"><Icon size={32} strokeWidth={1.7} /></span>
                <h3 className="mt-5 text-base font-black text-slate-900">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>

          <h2 className="mt-14 text-center text-xl font-black text-[#242238] sm:text-2xl">پیشنهاد می‌کنیم از این بخش‌ها دیدن کنید</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {suggestions.map(({ icon: Icon, title, text, href, color }) => (
              <Link key={title} href={href} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_6px_20px_rgba(36,34,56,0.06)] transition hover:-translate-y-1 hover:shadow-lg">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}><Icon size={25} strokeWidth={1.8} /></span>
                <span><strong className="block text-sm text-slate-800">{title}</strong><small className="mt-1 block text-[10px] text-slate-500">{text}</small></span>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(36,34,56,0.06)] sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={MessageCircleMore} value="پاسخ‌گو" label="پشتیبانی آموزشی" color="bg-rose-50 text-rose-500" />
            <Stat icon={Video} value="ویدیویی" label="آموزش مفهومی" color="bg-blue-50 text-blue-500" />
            <Stat icon={ClipboardCheck} value="هدفمند" label="آزمون و ارزیابی" color="bg-emerald-50 text-emerald-500" />
            <Stat icon={Medal} value="همراه شما" label="در مسیر پیشرفت" color="bg-violet-50 text-violet-500" />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ title, text }: { title: string; text?: string }) {
  return <div className="text-center"><h2 className="text-2xl font-black text-[#242238] sm:text-3xl">{title}</h2><span className="mx-auto mt-3 block h-1 w-10 rounded-full bg-teal-300" />{text && <p className="mt-4 text-sm text-slate-500">{text}</p>}</div>;
}

function Stat({ icon: Icon, value, label, color }: { icon: typeof Medal; value: string; label: string; color: string }) {
  return <div className="flex items-center justify-center gap-4 border-b border-slate-100 p-5 last:border-0 sm:border-l sm:border-b-0"><span className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}><Icon size={23} /></span><div><strong className="block text-sm font-black text-slate-800">{value}</strong><span className="text-[11px] text-slate-500">{label}</span></div></div>;
}
