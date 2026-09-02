/* eslint-disable @next/next/no-img-element -- تصویر ویترین از API و دامنه قابل تنظیم فایل‌ها دریافت می‌شود. */
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, ClipboardCheck, Gamepad2, Headphones,
  Medal, MessageCircleMore, PlayCircle, Presentation, ShoppingBag, Sparkles, Video,
} from 'lucide-react';
import LearningExplorer, { GradeLearningOption } from '@/components/LearningExplorer';
import AdvertisementSlot from '@/components/AdvertisementSlot';
import { getGrades } from '@/lib/grades';
import { getBooksForGrade } from '@/lib/books';
import { getChaptersForBook, getSectionsForChapters } from '@/lib/curriculum';
import { getBookContent } from '@/lib/content';
import { getBookQuizSummary } from '@/lib/quizzes';
import { Book } from '@/types';
import { getPowerpoints, Powerpoint } from '@/lib/powerpoints';

const reasons = [
  { icon: BookOpen, title: 'مطابق کتاب درسی', text: 'تمامی محتوا بر اساس آخرین ویرایش کتاب‌های درسی تهیه شده است.', style: 'from-orange-50 to-amber-50 text-orange-500' },
  { icon: ClipboardCheck, title: 'آزمون‌های استاندارد', text: 'با آزمون‌های طبقه‌بندی‌شده توانایی خودت را دقیق بسنج.', style: 'from-emerald-50 to-teal-50 text-emerald-500' },
  { icon: Gamepad2, title: 'یادگیری جذاب', text: 'با آموزش ساده و تمرین‌های متنوع، یادگیری را لذت‌بخش کن.', style: 'from-blue-50 to-indigo-50 text-blue-500' },
  { icon: MessageCircleMore, title: 'پشتیبانی سریع', text: 'هر سؤالی داری، ما در مسیر یادگیری همراهت هستیم.', style: 'from-violet-50 to-fuchsia-50 text-violet-500' },
];

const suggestions = [
  { icon: PlayCircle, title: 'ویدیوهای آموزشی', text: 'تدریس مفهومی و ساده', href: '#learning-explorer', color: 'text-violet-500 bg-violet-50' },
  { icon: ClipboardCheck, title: 'نمونه سؤالات', text: 'سؤالات طبقه‌بندی‌شده', href: '#learning-explorer', color: 'text-emerald-500 bg-emerald-50' },
  { icon: Sparkles, title: 'گام‌به‌گام دروس', text: 'حل تمرین‌ها به زبان ساده', href: '#learning-explorer', color: 'text-orange-500 bg-orange-50' },
  { icon: Gamepad2, title: 'تمرین هدفمند', text: 'یادگیری همراه با سرگرمی', href: '/?mode=online_exam#learning-explorer', color: 'text-blue-500 bg-blue-50' },
  { icon: Headphones, title: 'پشتیبانی آموزشی', text: 'همراه شما در مسیر یادگیری', href: '/contact', color: 'text-rose-500 bg-rose-50' },
];

export default async function Home() {
  let learningOptions: GradeLearningOption[] = [];
  let powerpoints: Powerpoint[] = [];
  let backendOffline = false;

  try {
    powerpoints = (await getPowerpoints()).items.slice(0, 4);
  } catch {
    powerpoints = [];
  }

  try {
    const apiGrades = (await getGrades())
      .filter((grade) => grade.grade_number <= 6)
      .sort((a, b) => a.grade_number - b.grade_number);

    const gradeTitles = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم'];
    const grades = gradeTitles.map((title, index) =>
      apiGrades.find((grade) => grade.grade_number === index + 1) ?? {
        id: -(index + 1),
        title,
        grade_number: index + 1,
      }
    );

    learningOptions = await Promise.all(
      grades.map(async (grade) => {
        let books: Book[] = [];
        if (grade.id > 0) {
          try {
            books = await getBooksForGrade(grade.id);
          } catch {
            books = [];
          }
        }
        const bookOptions = await Promise.all(
          books.map(async (book) => {
            const chapters = await getChaptersForBook(book.id).catch(() => []);
            const sections = await getSectionsForChapters(chapters.map((chapter) => chapter.id)).catch(() => []);
            const items = await getBookContent(book.id).catch(() => []);
            const quizSummary = await getBookQuizSummary(book.id).catch(() => ({ section: [], chapter: [], book: [] }));
            return { book, chapters, sections, items, quizSummary };
          })
        );

        // A subject can be connected to the same grade through more than one
        // assignment/app. Show one clear tab per subject and prefer the book
        // record that actually has the richer curriculum.
        const uniqueBooks = new Map<string, (typeof bookOptions)[number]>();
        for (const option of bookOptions.filter((item) => item.chapters.length > 0)) {
          const key = option.book.title
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/ي/g, 'ی')
            .replace(/ك/g, 'ک');
          const current = uniqueBooks.get(key);
          // When duplicate subject records exist (for example an old Math app
          // and the current Darska Math app), prefer the record that actually
          // owns published content. Chapter count alone used to select the old
          // empty book and hide newly-created activities.
          if (
            ! current
            || option.items.length > current.items.length
            || (option.items.length === current.items.length && option.chapters.length > current.chapters.length)
          ) {
            uniqueBooks.set(key, option);
          }
        }

        return { grade, books: Array.from(uniqueBooks.values()) };
      })
    );
  } catch {
    backendOffline = true;
  }

  return (
    <div className="overflow-hidden bg-white">
      <section className="hero-pattern relative px-4 pb-7 pt-3 sm:pb-8 sm:pt-4">
        <div className="relative mx-auto grid max-w-[1480px] items-center gap-3 lg:grid-cols-2 lg:gap-6">
          <div className="text-center lg:text-right">
            <h1 className="text-2xl font-black leading-[1.35] text-[#171526] sm:text-3xl lg:whitespace-nowrap lg:text-[2.25rem] xl:text-[2.5rem]">یادگیری آسان، موفقیت برای همیشه</h1>
            <div className="mt-4 flex flex-col justify-center gap-2.5 sm:flex-row lg:justify-start">
              <Link href="#learning-explorer" className="button-outline group"><BookOpen size={20} />شروع یادگیری<ArrowLeft size={17} className="transition group-hover:-translate-x-1" /></Link>
              <Link href="#powerpoint-showcase" className="button-primary group"><Presentation size={20} />پاورپوینت تدریس<ArrowLeft size={17} className="transition group-hover:-translate-x-1" /></Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-[240px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-1.5 shadow-[0_18px_45px_rgba(230,126,50,0.14)] backdrop-blur sm:max-w-[260px] lg:max-w-[285px]">
              <Image src="/darska-brand.png" alt="درسکا؛ همراه هوشمند یادگیری" width={1254} height={1254} priority className="h-auto w-full rounded-[2rem]" />
              <span className="absolute bottom-3 right-3 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-[10px] font-black text-[#17284f] shadow-sm backdrop-blur">یاد بگیر، تمرین کن، بدرخش ✦</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-px h-9 bg-[#effaf8] [clip-path:ellipse(58%_48%_at_50%_100%)] sm:h-12" />
      </section>

      <AdvertisementSlot position="home" />

      {learningOptions.length > 0 ? (
        <LearningExplorer options={learningOptions} />
      ) : (
        <section id="learning-explorer" className="grade-pattern px-4 py-14"><div className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-white p-5 text-center text-sm text-red-700 shadow-sm">{backendOffline ? 'اتصال به سرور برقرار نشد. لطفاً بک‌اند Laravel را اجرا کنید.' : 'هنوز پایه‌ای برای نمایش ثبت نشده است.'}</div></section>
      )}

      <section id="powerpoint-showcase" className="relative overflow-hidden bg-gradient-to-b from-[#fff9f2] to-white px-4 py-14 sm:py-20">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-[1480px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-black text-orange-700"><Presentation size={17} /> ویژه معلمان</span><h2 className="mt-4 text-xl font-black text-slate-900 sm:text-3xl">پاورپوینت‌های آماده تدریس</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">اسلایدهای مرتب و آماده هر فصل را ببینید و هر پاورپوینت را جداگانه تهیه کنید.</p></div>
            <Link href="/powerpoints" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-black text-white shadow-lg"><ShoppingBag size={19} /> مشاهده همه پاورپوینت‌ها <ArrowLeft size={17} /></Link>
          </div>
          {powerpoints.length > 0 ? <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{powerpoints.map((item) => <Link href="/powerpoints" key={item.id} className="group overflow-hidden rounded-[1.7rem] border border-orange-100 bg-white shadow-[0_12px_35px_rgba(120,72,30,.08)] transition hover:-translate-y-1.5 hover:shadow-xl"><div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-orange-100 to-indigo-100">{item.preview_image ? <img src={item.preview_image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <Presentation size={58} className="absolute inset-0 m-auto text-indigo-400" />}{item.discount_percent > 0 && <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black text-white">{item.discount_percent.toLocaleString('fa-IR')}٪ تخفیف</span>}</div><div className="p-4"><small className="font-bold text-orange-600">{item.grade.title} · {item.book.title}</small><h3 className="mt-2 line-clamp-2 min-h-12 font-black leading-6 text-slate-900">{item.title}</h3><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><strong className="text-indigo-700">{item.final_price.toLocaleString('fa-IR')} تومان</strong><span className="text-xs font-bold text-slate-400">مشاهده و خرید</span></div></div></Link>)}</div> : <Link href="/powerpoints" className="mt-9 flex min-h-52 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-orange-200 bg-white/80 p-8 text-center"><span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-indigo-100 text-indigo-600"><Presentation size={38} /></span><strong className="mt-5 text-lg text-slate-900">ویترین پاورپوینت‌های درسکا</strong><span className="mt-2 text-sm text-slate-500">پاورپوینت‌های منتشرشده همراه تصویر و قیمت در این قسمت نمایش داده می‌شوند.</span></Link>}
        </div>
      </section>

      <section className="px-4 py-14 sm:py-18">
        <div className="mx-auto max-w-[1480px]">
          <SectionTitle title="چرا درسکا؟" />
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text, style }) => (
              <article key={title} className={`rounded-3xl bg-gradient-to-br p-6 text-center ${style}`}><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm"><Icon size={32} strokeWidth={1.7} /></span><h3 className="mt-5 text-base font-black text-slate-900">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-600">{text}</p></article>
            ))}
          </div>

          <h2 className="mt-12 text-center text-lg font-black text-[#242238] sm:text-xl">پیشنهاد می‌کنیم از این بخش‌ها دیدن کنید</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {suggestions.map(({ icon: Icon, title, text, href, color }) => (
              <Link key={title} href={href} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_6px_20px_rgba(36,34,56,0.06)] transition hover:-translate-y-1 hover:shadow-lg"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}><Icon size={25} strokeWidth={1.8} /></span><span><strong className="block text-sm text-slate-800">{title}</strong><small className="mt-1 block text-[10px] text-slate-500">{text}</small></span></Link>
            ))}
          </div>

          <div className="mt-9 grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(36,34,56,0.06)] sm:grid-cols-2 lg:grid-cols-4">
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

function SectionTitle({ title }: { title: string }) {
  return <div className="text-center"><h2 className="text-xl font-black text-[#242238] sm:text-2xl">{title}</h2><span className="mx-auto mt-3 block h-1 w-10 rounded-full bg-teal-300" /></div>;
}

function Stat({ icon: Icon, value, label, color }: { icon: typeof Medal; value: string; label: string; color: string }) {
  return <div className="flex items-center justify-center gap-4 border-b border-slate-100 p-5 last:border-0 sm:border-l sm:border-b-0"><span className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}><Icon size={23} /></span><div><strong className="block text-sm font-black text-slate-800">{value}</strong><span className="text-[11px] text-slate-500">{label}</span></div></div>;
}
