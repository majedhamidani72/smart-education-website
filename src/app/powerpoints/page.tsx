'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Download, FileSliders, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { getToken } from '@/lib/token';
import { requestPayment } from '@/lib/purchases';
import { buyPowerpoint, cancelPowerpointOrder, downloadPowerpoint, getPowerpointOrders, getPowerpoints, Powerpoint, PowerpointOrder } from '@/lib/powerpoints';

export default function PowerpointsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Powerpoint[]>([]);
  const [orders, setOrders] = useState<PowerpointOrder[]>([]);
  const [selected, setSelected] = useState<Powerpoint | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const load = () => {
    getPowerpoints().then((data) => setItems(data.items)).catch(() => setMessage('دریافت پاورپوینت‌ها انجام نشد.'));
    if (getToken()) getPowerpointOrders().then((data) => setOrders(data.items)).catch(() => undefined);
  };
  useEffect(load, []);

  async function purchase() {
    if (!selected || !accepted) return;
    if (!getToken()) { router.push('/login?redirect=/powerpoints'); return; }
    setBusy(selected.id); setMessage('');
    try {
      const order = await buyPowerpoint(selected.id);
      const payment = await requestPayment(order.purchase_id, '/powerpoints');
      window.location.href = payment.payment_url;
    } catch (error) { setMessage(error instanceof ApiError ? error.message : 'ایجاد سفارش انجام نشد.'); setBusy(null); }
  }

  const pending = orders.filter((order) => order.status === 'pending');
  return <main className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-indigo-50 px-4 py-10"><div className="mx-auto max-w-6xl">
    <header className="overflow-hidden rounded-[2rem] bg-gradient-to-l from-slate-950 to-indigo-900 px-6 py-9 text-white sm:px-10"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold"><FileSliders size={16} /> ابزار آماده تدریس معلم</span><h1 className="mt-4 text-3xl font-black sm:text-4xl">پاورپوینت‌های آماده تدریس</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-100">هر فصل را جداگانه تهیه کنید؛ اسلایدهای مرتب و آماده برای تدریس حضوری در کلاس.</p></header>
    {message && <p className="mt-4 rounded-2xl bg-rose-50 p-4 text-center text-sm font-bold text-rose-700">{message}</p>}
    {pending.length > 0 && <section className="mt-6 rounded-3xl border border-amber-100 bg-amber-50/70 p-5"><h2 className="font-black text-amber-950">سفارش‌های در انتظار پرداخت</h2><div className="mt-3 space-y-2">{pending.map((order) => <div key={order.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 text-sm"><strong>{order.powerpoint.title}</strong><span className="text-slate-500">{order.payable_amount.toLocaleString('fa-IR')} تومان</span><button onClick={async () => { await cancelPowerpointOrder(order.id); load(); }} className="mr-auto rounded-xl border border-rose-100 px-3 py-2 font-bold text-rose-600">لغو سفارش</button></div>)}</div></section>}
    <section className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[16/10] bg-gradient-to-br from-orange-100 to-indigo-100">{item.preview_image ? <Image src={item.preview_image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /> : <FileSliders className="absolute inset-0 m-auto text-indigo-400" size={62} />}{item.discount_percent > 0 && <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-black text-white">{item.discount_percent.toLocaleString('fa-IR')}٪ تخفیف</span>}</div><div className="p-5"><small className="font-bold text-indigo-500">{item.grade.title} · {item.book.title}</small><h2 className="mt-2 text-lg font-black text-slate-900">{item.title}</h2><p className="mt-2 line-clamp-2 min-h-12 text-xs leading-6 text-slate-500">{item.description || `پاورپوینت آماده ${item.chapter.title}`}</p><div className="mt-4 flex items-end justify-between"><div>{item.discount_percent > 0 && <del className="block text-xs text-slate-400">{item.price.toLocaleString('fa-IR')}</del>}<strong className="text-lg text-indigo-700">{item.final_price.toLocaleString('fa-IR')} تومان</strong></div>{item.slides_count && <span className="text-xs text-slate-400">{item.slides_count.toLocaleString('fa-IR')} اسلاید</span>}</div>{item.owned ? <button onClick={() => downloadPowerpoint(item).catch((e) => setMessage(e.message))} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-bold text-white"><Download size={19} /> دانلود فایل</button> : <button onClick={() => { setSelected(item); setAccepted(false); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 py-3 font-bold text-white"><ShoppingBag size={19} /> خرید این فصل</button>}</div></article>)}</section>
    {!items.length && !message && <div className="mt-8 rounded-3xl bg-white p-12 text-center text-sm text-slate-500">پاورپوینتی برای فروش ثبت نشده است.</div>}
  </div>
  {selected && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 px-4 backdrop-blur-sm" onClick={() => setSelected(null)}><div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><button onClick={() => setSelected(null)} className="float-left rounded-xl bg-slate-100 p-2"><X size={19} /></button><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><ShieldCheck size={28} /></span><h2 className="mt-4 text-xl font-black">قانون استفاده از پاورپوینت</h2><p className="mt-3 text-sm leading-7 text-slate-600">خریدار حق فروش مجدد، انتشار در سایت یا شبکه‌های اجتماعی، تدریس آنلاین یا ارائه فایل در پلتفرم‌های دیگر را ندارد. استفاده فقط برای تدریس حضوری در کلاس و دانش‌آموزان همان کلاس مجاز است.</p><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold leading-6 text-indigo-950"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 accent-indigo-600" />این شرایط را خواندم و می‌پذیرم.</label><button disabled={!accepted || busy === selected.id} onClick={purchase} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 py-3.5 font-black text-white disabled:opacity-40"><Check size={20} /> تأیید و ادامه پرداخت</button></div></div>}
  </main>;
}
