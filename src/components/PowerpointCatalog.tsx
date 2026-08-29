'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Download, FileSliders, GraduationCap, Layers3 } from 'lucide-react';
import { downloadPowerpoint, getPowerpoints, Powerpoint } from '@/lib/powerpoints';

export default function PowerpointCatalog() {
  const [items, setItems] = useState<Powerpoint[]>([]);
  const [gradeId, setGradeId] = useState<number | null>(null);
  const [bookId, setBookId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getPowerpoints()
      .then((data) => setItems(data.items))
      .catch(() => setMessage('دریافت پاورپوینت‌ها انجام نشد.'));
  }, []);

  const grades = useMemo(() => Array.from(new Map(items.map((item) => [item.grade.id, item.grade])).values()), [items]);
  const books = useMemo(() => Array.from(new Map(items.filter((item) => !gradeId || item.grade.id === gradeId).map((item) => [item.book.id, item.book])).values()), [items, gradeId]);
  const visibleItems = items.filter((item) => (!gradeId || item.grade.id === gradeId) && (!bookId || item.book.id === bookId));

  function selectGrade(id: number | null) {
    setGradeId(id);
    setBookId(null);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-indigo-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[2rem] bg-gradient-to-l from-slate-950 to-indigo-900 px-6 py-9 text-white sm:px-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold"><FileSliders size={16} /> ابزار آماده تدریس معلم</span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">فروشگاه پاورپوینت‌های تدریس</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-100">ابتدا پایه و کتاب را انتخاب کنید؛ سپس نمونه PDF هر پاورپوینت را داخل صفحه محصول ورق بزنید.</p>
        </header>

        <section className="mt-7 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-2 text-slate-900"><GraduationCap className="text-indigo-600" /><h2 className="font-black">انتخاب پایه</h2></div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            <button onClick={() => selectGrade(null)} className={`shrink-0 rounded-2xl px-5 py-3 text-sm font-black transition ${gradeId === null ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-indigo-50'}`}>همه پایه‌ها</button>
            {grades.map((grade) => <button key={grade.id} onClick={() => selectGrade(grade.id)} className={`shrink-0 rounded-2xl px-5 py-3 text-sm font-black transition ${gradeId === grade.id ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-indigo-50'}`}>پایه {grade.title}</button>)}
          </div>

          <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-6 text-slate-900"><BookOpen className="text-orange-500" /><h2 className="font-black">انتخاب کتاب</h2></div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => setBookId(null)} className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${bookId === null ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600'}`}>همه کتاب‌ها</button>
            {books.map((book) => <button key={book.id} onClick={() => setBookId(book.id)} className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${bookId === book.id ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600'}`}>{book.title}</button>)}
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between"><div className="flex items-center gap-2"><Layers3 className="text-indigo-600" /><h2 className="text-xl font-black text-slate-900">پاورپوینت‌های موجود</h2></div><span className="text-sm font-bold text-slate-400">{visibleItems.length.toLocaleString('fa-IR')} محصول</span></div>
        {message && <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-center text-sm font-bold text-rose-700">{message}</p>}

        <section className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <Link href={`/powerpoints/${item.id}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-orange-100 to-indigo-100">
                  {item.preview_image ? <Image src={item.preview_image} alt={`جلد ${item.title}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <FileSliders className="absolute inset-0 m-auto text-indigo-400" size={62} />}
                  {item.is_featured && <span className="absolute left-3 top-3 rounded-full bg-indigo-700 px-3 py-1 text-xs font-black text-white">منتخب</span>}
                  {item.has_preview && <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-800 backdrop-blur">دارای نمونه PDF</span>}
                </div>
                <div className="p-5"><small className="font-bold text-indigo-500">پایه {item.grade.title} · {item.book.title}</small><h3 className="mt-2 text-lg font-black text-slate-900">{item.title}</h3><p className="mt-2 line-clamp-2 min-h-12 text-xs leading-6 text-slate-500">{item.description || `پاورپوینت آماده ${item.chapter.title}`}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4"><strong className="text-lg text-indigo-700">{item.final_price.toLocaleString('fa-IR')} تومان</strong><span className="inline-flex items-center gap-1 text-xs font-black text-orange-600">جزئیات و نمونه <ArrowLeft size={15} /></span></div></div>
              </Link>
              {item.owned && <button onClick={() => downloadPowerpoint(item).catch((error) => setMessage(error.message))} className="mx-5 mb-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-bold text-white"><Download size={18} /> دانلود فایل خریداری‌شده</button>}
            </article>
          ))}
        </section>
        {!visibleItems.length && !message && <div className="mt-6 rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">برای این انتخاب هنوز پاورپوینتی ثبت نشده است.</div>}
      </div>
    </main>
  );
}
