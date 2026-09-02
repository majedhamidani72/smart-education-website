'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, FileText, Filter, LockKeyhole, Search, X } from 'lucide-react';
import { ContentSearchData, searchContent } from '@/lib/content-search';
import { getToken } from '@/lib/token';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [bookId, setBookId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [data, setData] = useState<ContentSearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true); setError('');
      searchContent({ q: query, grade_id: gradeId, book_id: bookId, chapter_id: chapterId, content_type_id: typeId, accessible_only: accessibleOnly && getToken() ? 1 : null })
        .then(setData).catch(() => setError('جست‌وجو انجام نشد؛ دوباره تلاش کنید.')).finally(() => setLoading(false));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, gradeId, bookId, chapterId, typeId, accessibleOnly]);

  const clearFilters = () => { setGradeId(''); setBookId(''); setChapterId(''); setTypeId(''); setAccessibleOnly(false); };
  const hasFilters = !!(gradeId || bookId || chapterId || typeId || accessibleOnly);

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:py-11"><div className="mx-auto max-w-6xl">
    <header className="rounded-[2rem] bg-gradient-to-l from-sky-700 to-indigo-700 p-6 text-white sm:p-8"><span className="text-xs font-bold text-sky-200">دسترسی سریع درسکا</span><h1 className="mt-1 text-xl font-black sm:text-2xl">هر چیزی را سریع پیدا کن</h1><p className="mt-2 text-sm text-sky-100">نام درس، عنوان محتوا یا شماره صفحه را بنویس.</p><label className="mt-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-lg"><Search className="text-indigo-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} autoFocus placeholder="مثلاً عددنویسی، ستایش یا صفحه ۱۲" className="w-full bg-transparent text-sm font-bold outline-none placeholder:font-normal placeholder:text-slate-400" />{query && <button onClick={() => setQuery('')} aria-label="پاک‌کردن جست‌وجو"><X size={18} className="text-slate-400" /></button>}</label></header>

    <section className="mt-5 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-center gap-2"><Filter size={18} className="text-indigo-600" /><strong className="text-sm">فیلتر نتایج</strong>{hasFilters && <button onClick={clearFilters} className="mr-auto text-xs font-bold text-rose-600">پاک‌کردن فیلترها</button>}</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Select value={gradeId} onChange={(value) => { setGradeId(value); setBookId(''); setChapterId(''); }} label="همه پایه‌ها" options={data?.filters.grades ?? []} /><Select value={bookId} onChange={(value) => { setBookId(value); setChapterId(''); }} label="همه کتاب‌ها" options={data?.filters.books ?? []} /><Select value={chapterId} onChange={setChapterId} label="همه فصل‌ها" options={data?.filters.chapters ?? []} /><Select value={typeId} onChange={setTypeId} label="همه انواع محتوا" options={data?.filters.content_types ?? []} /></div>{getToken() && <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={accessibleOnly} onChange={(event) => setAccessibleOnly(event.target.checked)} className="h-4 w-4 accent-indigo-600" />فقط محتواهای قابل دسترس من</label>}</section>

    <div className="mt-5 flex items-center justify-between"><h2 className="font-black text-slate-900">نتایج</h2><span className="text-xs text-slate-500">{loading ? 'در حال جست‌وجو...' : `${(data?.count ?? 0).toLocaleString('fa-IR')} مورد`}</span></div>
    {error ? <p className="mt-4 rounded-2xl bg-rose-50 p-5 text-center text-sm font-bold text-rose-700">{error}</p> : !loading && data?.results.length === 0 ? <p className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">موردی با این مشخصات پیدا نشد؛ عبارت کوتاه‌تر یا فیلتر دیگری امتحان کن.</p> : <section className="mt-4 grid gap-3 sm:grid-cols-2">{data?.results.map((item) => { const mode = item.type?.slug ?? 'teaching'; const target = item.has_access ? `/book/${item.book?.id}?type=${mode}&chapter=${item.chapter?.id}${item.section ? `&section=${item.section.id}` : ''}&content=${item.id}` : `/purchase?book_id=${item.book?.id}&return_to=${encodeURIComponent(`/book/${item.book?.id}?type=${mode}&chapter=${item.chapter?.id}&content=${item.id}`)}`; return <Link key={item.id} href={target} className="group flex min-h-28 gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.has_access ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>{item.has_access ? <FileText size={21} /> : <LockKeyhole size={20} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-1.5 text-[10px] font-bold"><span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{item.grade?.title}</span><span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700">{item.type?.title}</span>{item.page_number && <span className="rounded-full bg-orange-50 px-2 py-1 text-orange-700">{pageLabel(item.page_number)}</span>}</div><h3 className="mt-2 line-clamp-1 font-black text-slate-900">{item.title}</h3><p className="mt-1 line-clamp-1 text-xs text-slate-400">{item.book?.title} · {item.chapter?.title}{item.section ? ` · ${item.section.title}` : ''}</p></div><ChevronLeft size={18} className="my-auto shrink-0 text-slate-300 transition group-hover:-translate-x-1 group-hover:text-indigo-600" /></Link>; })}</section>}
  </div></main>;
}

function Select({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: Array<{ id: number; title: string }> }) { return <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 outline-none focus:border-indigo-400"><option value="">{label}</option>{options.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}</select>; }
function pageLabel(value: string) { return /^صفحه/.test(value.trim()) ? value : `صفحه ${value}`; }
