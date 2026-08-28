'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, CreditCard, LockKeyhole, ShieldCheck, XCircle } from 'lucide-react';
import { completeTestPayment, failTestPayment, getPurchase, Purchase } from '@/lib/purchases';
import { ApiError } from '@/lib/api';

type Result = 'success' | 'failed' | null;

export default function TestPaymentPage() {
  return <Suspense fallback={null}><TestGateway /></Suspense>;
}

function TestGateway() {
  const query = useSearchParams();
  const purchaseId = Number(query.get('purchase_id'));
  const requestedReturnTo = query.get('return_to');
  const returnHref = requestedReturnTo?.startsWith('/') && !requestedReturnTo.startsWith('//')
    ? requestedReturnTo
    : '/';
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(600);

  useEffect(() => {
    if (!purchaseId) return;
    getPurchase(purchaseId).then(setPurchase).catch((err) => setError(err instanceof ApiError ? err.message : 'تراکنش پیدا نشد.')).finally(() => setLoading(false));
  }, [purchaseId]);

  useEffect(() => {
    if (result || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [result, secondsLeft]);

  async function finish(kind: Exclude<Result, null>) {
    if (!purchaseId || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (kind === 'success') await completeTestPayment(purchaseId);
      else await failTestPayment(purchaseId);
      setResult(kind);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'ثبت نتیجه پرداخت انجام نشد.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="py-24 text-center text-slate-500">در حال آماده‌سازی درگاه آزمایشی…</div>;

  if (result) {
    const successful = result === 'success';
    return <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12"><div className={`w-full rounded-[2rem] border bg-white p-8 text-center shadow-2xl sm:p-12 ${successful ? 'border-emerald-100' : 'border-red-100'}`}>{successful ? <CheckCircle2 size={76} className="mx-auto text-emerald-500" /> : <XCircle size={76} className="mx-auto text-red-500" />}<h1 className="mt-5 text-3xl font-black text-slate-900">{successful ? 'پرداخت آزمایشی موفق بود' : 'پرداخت آزمایشی ناموفق بود'}</h1><p className="mt-3 text-sm leading-7 text-slate-500">{successful ? 'دسترسی کامل پایه برای این حساب فعال شد.' : 'هیچ دسترسی‌ای فعال نشد و مبلغی نیز پرداخت نشده است.'}</p><div className="mx-auto mt-6 max-w-sm rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">شماره فاکتور: <strong dir="ltr">{purchase?.invoice_number}</strong></div><Link href={returnHref} className={`mt-7 inline-flex rounded-2xl px-7 py-3.5 font-bold text-white ${successful ? 'bg-emerald-600' : 'bg-violet-700'}`}>بازگشت به محتوای آموزشی</Link></div></main>;
  }

  return <main className="bg-slate-100 px-4 py-10 sm:py-14"><div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.16)]"><header className="flex items-center justify-between bg-gradient-to-l from-sky-700 to-blue-900 px-6 py-6 text-white sm:px-9"><div className="flex items-center gap-3"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><CreditCard size={30} /></span><div><h1 className="text-xl font-black">درگاه پرداخت آزمایشی زیبال</h1><p className="mt-1 text-xs text-blue-100">درسکا — محیط شبیه‌سازی پرداخت</p></div></div><span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-amber-950">TEST</span></header><div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.85fr_1.15fr]"><aside className="rounded-3xl bg-slate-50 p-6"><h2 className="font-black text-slate-900">اطلاعات پذیرنده</h2><dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><dt className="text-slate-400">پذیرنده</dt><dd className="font-bold text-slate-700">درسکا</dd></div><div className="flex justify-between"><dt className="text-slate-400">شماره فاکتور</dt><dd className="font-bold text-slate-700" dir="ltr">{purchase?.invoice_number}</dd></div><div className="flex justify-between border-t border-slate-200 pt-4"><dt className="text-slate-500">مبلغ قابل پرداخت</dt><dd className="text-lg font-black text-blue-700">{(purchase?.payable_amount ?? 0).toLocaleString('fa-IR')} تومان</dd></div></dl><div className="mt-6 flex items-center gap-2 rounded-2xl bg-blue-50 p-4 text-xs leading-6 text-blue-700"><ShieldCheck size={22} className="shrink-0" />این صفحه فقط برای تست است و به شبکه بانکی متصل نمی‌شود.</div></aside><section><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black text-slate-900">اطلاعات کارت</h2><span className="font-mono text-sm font-bold text-red-500">{String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}</span></div><div className="space-y-4"><label className="block text-xs font-bold text-slate-500">شماره کارت<input dir="ltr" inputMode="numeric" placeholder="0000  0000  0000  0000" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-center text-lg tracking-widest outline-none focus:border-blue-500" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-xs font-bold text-slate-500">CVV2<input dir="ltr" placeholder="000" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-center outline-none focus:border-blue-500" /></label><label className="block text-xs font-bold text-slate-500">تاریخ انقضا<input dir="ltr" placeholder="ماه / سال" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-center outline-none focus:border-blue-500" /></label></div><label className="block text-xs font-bold text-slate-500">رمز پویا<input dir="ltr" type="password" placeholder="رمز آزمایشی" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-center outline-none focus:border-blue-500" /></label></div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => finish('success')} disabled={submitting || secondsLeft === 0} className="rounded-2xl bg-emerald-600 py-3.5 font-bold text-white disabled:opacity-50">پرداخت موفق آزمایشی</button><button onClick={() => finish('failed')} disabled={submitting} className="rounded-2xl border border-red-200 bg-red-50 py-3.5 font-bold text-red-600 disabled:opacity-50">پرداخت ناموفق آزمایشی</button></div><p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400"><LockKeyhole size={14} />اطلاعات واردشده ذخیره یا ارسال نمی‌شود.</p></section></div></div></main>;
}
