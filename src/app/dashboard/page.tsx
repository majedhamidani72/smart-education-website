'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, BookOpen, CheckCircle2, ChevronLeft, ClipboardCheck, PlayCircle, Sparkles, Target, TrendingUp } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { getToken } from '@/lib/token';
import { getStudentDashboard, StudentDashboard } from '@/lib/student-dashboard';
import AdvertisementSlot from '@/components/AdvertisementSlot';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) { router.replace('/login?redirect=/dashboard'); return; }
    getStudentDashboard().then(setData).catch((err) => setError(err instanceof ApiError ? err.message : 'دریافت اطلاعات داشبورد انجام نشد.'));
  }, [router]);

  if (error) return <main className="mx-auto max-w-xl px-4 py-16 text-center"><div className="rounded-3xl border border-rose-100 bg-rose-50 p-7 text-sm font-bold text-rose-700">{error}</div></main>;
  if (!data) return <main className="min-h-[65vh] px-4 py-20 text-center text-sm text-slate-500">در حال آماده‌کردن مسیر یادگیری تو...</main>;

  const resume = data.continue_learning;
  const resumeHref = resume ? `/book/${resume.book_id}?type=teaching${resume.chapter_id ? `&chapter=${resume.chapter_id}` : ''}${resume.section_id ? `&section=${resume.section_id}` : ''}&content=${resume.content_id}` : '/#learning-explorer';

  return <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50/40 px-4 py-8 sm:py-11"><div className="mx-auto max-w-6xl">
    <header className="flex flex-col gap-4 rounded-[2rem] bg-gradient-to-l from-indigo-700 to-violet-700 p-6 text-white shadow-xl shadow-indigo-100 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><span className="text-xs font-bold text-indigo-200">داشبورد یادگیری من</span><h1 className="mt-1 text-2xl font-black">سلام {data.student.name} 👋</h1><p className="mt-2 text-sm text-indigo-100">یک قدم کوچک دیگر تا یادگیری بهتر</p></div><Link href={resumeHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-indigo-700"><PlayCircle size={21} />{resume ? 'ادامه آخرین درس' : 'شروع یادگیری'}</Link></header>

    <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat icon={BookOpen} value={data.summary.books_count} label="کتاب‌های من" color="text-indigo-700 bg-indigo-50" /><Stat icon={CheckCircle2} value={data.summary.completed_contents} label="محتوای تکمیل‌شده" color="text-emerald-700 bg-emerald-50" /><Stat icon={ClipboardCheck} value={data.summary.remaining_quizzes} label="آزمون باقی‌مانده" color="text-orange-700 bg-orange-50" /><Stat icon={TrendingUp} value={`${data.summary.average_score}٪`} label="میانگین آزمون‌ها" color="text-sky-700 bg-sky-50" /></section>
    <AdvertisementSlot position="profile" />

    {resume && <section className="mt-5 flex flex-col gap-4 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700"><PlayCircle /></span><div className="flex-1"><small className="font-bold text-indigo-500">ادامه از آخرین مشاهده</small><h2 className="mt-1 font-black text-slate-900">{resume.title}</h2><p className="mt-1 text-xs text-slate-500">{resume.book_title}{resume.page_number ? ` · صفحه ${resume.page_number}` : ''}</p></div><Link href={resumeHref} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">ادامه بده <ChevronLeft size={17} /></Link></section>}

    <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 className="flex items-center gap-2 text-lg font-black"><BookOpen className="text-indigo-600" />کتاب‌ها و پایه‌های من</h2>{data.books.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{data.books.map((book) => <details key={book.id} className="group rounded-2xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:shadow-md"><summary className="cursor-pointer list-none"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><BookOpen /></span><div><strong className="block text-slate-900">{book.title}</strong><small className="text-slate-400">{book.grade} · {book.subject}</small></div><span className="mr-auto font-black text-indigo-700">{book.progress}٪</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-sky-400" style={{ width: `${book.progress}%` }} /></div><div className="mt-3 flex justify-between text-[11px] text-slate-500"><span>{book.completed_contents} از {book.total_contents} محتوا</span><span>{book.remaining_quizzes} آزمون باقی‌مانده</span></div></summary><div className="mt-4 space-y-2 border-t border-slate-100 pt-3">{book.chapters.map((chapter) => <Link key={chapter.id} href={`/book/${book.id}?type=teaching&chapter=${chapter.id}`} className="flex items-center rounded-xl bg-slate-50 px-3 py-2 text-xs"><span className="min-w-0 flex-1 truncate font-bold text-slate-700">{chapter.title}</span><span className="text-slate-400">{chapter.lessons.length} درس</span><strong className="mr-3 text-indigo-600">{chapter.progress}٪</strong></Link>)}</div></details>)}</div> : <Empty text="هنوز کتابی برای این حساب خریداری نشده است." />}</section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 className="flex items-center gap-2 text-lg font-black"><BarChart3 className="text-sky-600" />روند آزمون‌ها</h2>{data.chart.length ? <div className="mt-6 flex h-44 items-end gap-2">{data.chart.map((point) => <div key={point.label} className="flex h-full flex-1 flex-col justify-end gap-2 text-center"><span className="text-[10px] font-bold text-slate-500">{point.percentage}٪</span><div className="min-h-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-sky-400" style={{ height: `${Math.max(5, point.percentage)}%` }} /><span className="truncate text-[9px] text-slate-400">{point.label}</span></div>)}</div> : <Empty text="پس از اولین آزمون، روند پیشرفت اینجا نمایش داده می‌شود." />}</section>
    </div>

    <section className="mt-6 grid gap-4 md:grid-cols-2"><TopicCard title="نقاط قوت من" icon={Sparkles} items={data.strengths} tone="emerald" empty="با انجام آزمون‌ها، نقاط قوتت مشخص می‌شود." /><TopicCard title="نیازمند تمرین بیشتر" icon={Target} items={data.needs_practice} tone="orange" empty="فعلاً مبحثی برای تمرین بیشتر ثبت نشده است." /></section>
    {data.recent_results.length > 0 && <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="font-black text-slate-900">آخرین نتیجه‌ها</h2><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{data.recent_results.map((result) => <div key={result.id} className="flex items-center rounded-xl bg-slate-50 px-3 py-3 text-xs"><span className="min-w-0 flex-1 truncate font-bold text-slate-700">{result.quiz_title}</span><strong className={`mr-3 text-base ${result.percentage >= 75 ? 'text-emerald-600' : result.percentage >= 50 ? 'text-orange-600' : 'text-rose-600'}`}>{result.percentage}٪</strong></div>)}</div></section>}
  </div></main>;
}

function Stat({ icon: Icon, value, label, color }: { icon: typeof BookOpen; value: number | string; label: string; color: string }) { return <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}><Icon size={19} /></span><strong className="mt-3 block text-xl font-black text-slate-900">{typeof value === 'number' ? value.toLocaleString('fa-IR') : value}</strong><span className="text-[11px] font-bold text-slate-500">{label}</span></div>; }
function TopicCard({ title, icon: Icon, items, tone, empty }: { title: string; icon: typeof Target; items: Array<{ title: string; percentage: number }>; tone: 'emerald' | 'orange'; empty: string }) { const colors = tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'; return <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-black"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors}`}><Icon size={19} /></span>{title}</h2>{items.length ? <div className="mt-4 space-y-2">{items.map((item) => <div key={item.title} className="flex items-center rounded-xl bg-slate-50 px-3 py-2.5 text-sm"><strong>{item.title}</strong><span className="mr-auto font-black text-slate-600">{item.percentage}٪</span></div>)}</div> : <p className="mt-4 text-xs leading-6 text-slate-400">{empty}</p>}</div>; }
function Empty({ text }: { text: string }) { return <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-center text-xs leading-6 text-slate-500">{text}</p>; }
