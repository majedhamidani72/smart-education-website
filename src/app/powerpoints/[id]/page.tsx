'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, Download, Expand, FileCheck2, FileSliders, GraduationCap, Layers3, LockKeyhole, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { getToken } from '@/lib/token';
import { requestPayment } from '@/lib/purchases';
import { buyPowerpoint, downloadPowerpoint, getPowerpoint, getPowerpointPreviewUrl, Powerpoint } from '@/lib/powerpoints';
import PowerpointPrice from '@/components/PowerpointPrice';
import { DiscountRibbon } from '@/components/PowerpointPrice';

export default function PowerpointDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const powerpointId = Number(params.id);
  const [item, setItem] = useState<Powerpoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(powerpointId)) return;
    getPowerpoint(powerpointId).then(setItem).catch(() => setMessage('این پاورپوینت پیدا نشد.')).finally(() => setLoading(false));
  }, [powerpointId]);

  async function purchase() {
    if (!item || !accepted) return;
    if (!getToken()) { router.push(`/login?redirect=/powerpoints/${item.id}`); return; }
    setBusy(true); setMessage('');
    try {
      const order = await buyPowerpoint(item.id);
      const payment = await requestPayment(order.purchase_id, `/powerpoints/${item.id}`);
      window.location.href = payment.payment_url;
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : 'ایجاد سفارش انجام نشد.');
      setBusy(false);
    }
  }

  if (!Number.isInteger(powerpointId)) return <div className="mx-auto max-w-xl px-4 py-14 text-center"><p className="rounded-3xl bg-rose-50 p-8 font-bold text-rose-700">نشانی پاورپوینت معتبر نیست.</p></div>;
  if (loading) return <div className="grid min-h-[60vh] place-items-center text-sm font-bold text-slate-500">در حال دریافت اطلاعات...</div>;
  if (!item) return <div className="mx-auto max-w-xl px-4 py-14 text-center"><p className="rounded-3xl bg-rose-50 p-8 font-bold text-rose-700">{message || 'محصول پیدا نشد.'}</p><Link href="/powerpoints" className="mt-5 inline-flex items-center gap-2 font-bold text-indigo-700"><ArrowRight size={18} /> بازگشت به فروشگاه</Link></div>;

  const previewUrl = `${getPowerpointPreviewUrl(item.id)}#toolbar=0&navpanes=0`;

  return <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-6"><div className="mx-auto max-w-7xl">
    <Link href="/powerpoints" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-700"><ArrowRight size={18} /> بازگشت به فروشگاه</Link>
    {message && <p className="mt-4 rounded-2xl bg-rose-50 p-4 text-center text-sm font-bold text-rose-700">{message}</p>}
    <section className="mt-4 grid gap-5 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100/70 lg:grid-cols-[1.08fr_0.92fr] lg:p-8">
      <div className="relative min-h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 to-indigo-100">{item.preview_image ? <Image src={item.preview_image} alt={`جلد ${item.title}`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /> : <FileSliders className="absolute inset-0 m-auto text-indigo-400" size={90} />}<DiscountRibbon item={item} className="absolute right-4 top-4 rounded-full bg-rose-500 px-4 py-2 text-xs font-black text-white" /></div>
      <div className="flex flex-col"><div className="flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-indigo-50 px-3 py-2 text-indigo-700">پایه {item.grade.title}</span><span className="rounded-full bg-orange-50 px-3 py-2 text-orange-700">{item.book.title}</span><span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">{item.chapter.title}</span></div><h1 className="mt-5 text-lg font-black leading-10 text-slate-950 sm:text-xl">{item.title}</h1><p className="mt-4 text-sm leading-8 text-slate-600">{item.description || 'پاورپوینت آماده و منظم برای تدریس این فصل در کلاس.'}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><Info icon={Layers3} label="تعداد اسلاید" value={item.slides_count ? `${item.slides_count.toLocaleString('fa-IR')} اسلاید` : 'ثبت نشده'} /><Info icon={FileCheck2} label="نوع فایل" value="PPTX قابل دریافت" /><Info icon={GraduationCap} label="پایه" value={`پایه ${item.grade.title}`} /><Info icon={BookOpen} label="کتاب" value={item.book.title || '—'} /></div>
        {item.features.length > 0 && <ul className="mt-5 grid gap-2 sm:grid-cols-2">{item.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm font-bold text-slate-700"><Check size={17} className="text-emerald-500" />{feature}</li>)}</ul>}
        <div className="mt-auto pt-5"><PowerpointPrice item={item} finalPriceClassName="text-lg font-black text-indigo-700" originalPriceClassName="text-sm text-slate-400" />{item.owned ? <button onClick={() => downloadPowerpoint(item).catch((error) => setMessage(error.message))} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-black text-white"><Download size={20} /> دانلود پاورپوینت خریداری‌شده</button> : <button onClick={() => { setAccepted(false); setLicenseOpen(true); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 py-4 font-black text-white shadow-lg shadow-indigo-100"><ShoppingBag size={20} /> خرید این پاورپوینت</button>}</div>
      </div>
    </section>
    <section className="mt-6 rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><span className="text-xs font-black text-indigo-600">قبل از خرید ببینید</span><h2 className="mt-1 text-lg font-black text-slate-900">نمونه واقعی پاورپوینت</h2><p className="mt-2 text-sm text-slate-500">نمونه به‌صورت PDF چنداسلایدی نمایش داده می‌شود، نه تصاویر پراکنده.</p></div>{item.has_preview && <button onClick={() => setPreviewFullscreen(true)} className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 px-4 py-3 text-sm font-black text-indigo-700"><Expand size={18} /> نمایش بزرگ</button>}</div>{item.has_preview ? <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"><iframe src={previewUrl} title={`نمونه ${item.title}`} className="h-[35vh] min-h-[280px] w-full" /></div> : <div className="mt-4 flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center"><LockKeyhole size={38} className="text-slate-300" /><strong className="mt-4 text-slate-700">هنوز PDF نمونه ثبت نشده است</strong><span className="mt-2 text-sm text-slate-400">پس از بارگذاری نمونه در پنل، همین‌جا قابل ورق‌زدن خواهد بود.</span></div>}</section>
  </div>
  {previewFullscreen && <div className="fixed inset-0 z-[110] bg-slate-950/90 p-3 sm:p-7"><button onClick={() => setPreviewFullscreen(false)} className="mb-3 mr-auto flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-800"><X size={18} /> بستن</button><iframe src={previewUrl} title={`نمایش بزرگ نمونه ${item.title}`} className="h-[calc(100vh-5rem)] w-full rounded-2xl bg-white" /></div>}
  {licenseOpen && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 px-4 backdrop-blur-sm" onClick={() => setLicenseOpen(false)}><div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><button onClick={() => setLicenseOpen(false)} className="float-left rounded-xl bg-slate-100 p-2"><X size={19} /></button><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><ShieldCheck size={28} /></span><h2 className="mt-4 text-lg font-black">قانون استفاده از پاورپوینت</h2><p className="mt-3 text-sm leading-7 text-slate-600">خریدار حق فروش مجدد یا انتشار فایل در سایت و شبکه‌های اجتماعی را ندارد. استفاده برای تدریس حضوری در کلاس مجاز است.</p><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold leading-6 text-indigo-950"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 accent-indigo-600" />این شرایط را خواندم و می‌پذیرم.</label><button disabled={!accepted || busy} onClick={purchase} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 py-3.5 font-black text-white disabled:opacity-40"><Check size={20} /> {busy ? 'در حال انتقال...' : 'تأیید و ادامه پرداخت'}</button></div></div>}
  </main>;
}

function Info({ icon: Icon, label, value }: { icon: typeof Layers3; label: string; value?: string }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><span className="flex items-center gap-2 text-xs text-slate-400"><Icon size={16} />{label}</span><strong className="mt-2 block text-slate-800">{value || '—'}</strong></div>;
}
