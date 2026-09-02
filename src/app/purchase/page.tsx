'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getActivePlans, filterPlansForPurchase, Plan } from '@/lib/plans';
import { createPurchase, getPaymentMode, requestPayment } from '@/lib/purchases';
import { getBook } from '@/lib/books';
import { getToken } from '@/lib/token';
import { ApiError } from '@/lib/api';
import { Book } from '@/types';
import BackLink from '@/components/BackLink';
import { BookOpenCheck, CheckCircle2, CreditCard, GraduationCap, ShieldCheck } from 'lucide-react';

export default function PurchasePage() {
  return (
    <Suspense fallback={null}>
      <PurchaseForm />
    </Suspense>
  );
}

function PurchaseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = Number(searchParams.get('book_id'));
  const requestedReturnTo = searchParams.get('return_to');
  const returnTo = requestedReturnTo?.startsWith('/') && !requestedReturnTo.startsWith('//')
    ? requestedReturnTo
    : `/book/${bookId}${searchParams.get('grade_id') ? `?grade_id=${searchParams.get('grade_id')}` : ''}`;

  const [book, setBook] = useState<Book | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(Boolean(bookId));
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<'test' | 'real'>('real');

  useEffect(() => {
    if (!getToken()) {
      router.push(`/login?redirect=${encodeURIComponent(`/purchase?book_id=${bookId}&return_to=${encodeURIComponent(returnTo)}`)}`);
      return;
    }

    if (!bookId) {
      return;
    }

    Promise.all([getBook(bookId), getActivePlans(), getPaymentMode()])
      .then(([bookData, allPlans, mode]) => {
        setBook(bookData);
        setPaymentMode(mode);

        const bookPlans = filterPlansForPurchase(allPlans, bookData);

        setPlans(bookPlans);

        if (bookPlans.length > 0) {
          setSelectedPlanId(bookPlans[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, [bookId, returnTo, router]);

  async function handleBuy() {
    if (!selectedPlanId) return;

    setPaying(true);
    setError(null);

    try {
      const purchase = await createPurchase([selectedPlanId]);

      if (paymentMode === 'test') {
        router.push(`/payment/test?purchase_id=${purchase.id}&return_to=${encodeURIComponent(returnTo)}`);
        return;
      }

      const { payment_url } = await requestPayment(purchase.id, returnTo);

      if (!payment_url) {
        throw new Error('درگاه زیبال لینک پرداخت معتبری برنگرداند.');
      }

      // به درگاه پرداخت (زیبال) منتقل می‌شویم — بعد از پرداخت،
      // خودِ درگاه کاربر را به callback بک‌اند برمی‌گرداند.
      window.location.href = payment_url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'خطایی رخ داد.');
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  if (!bookId || !book) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <BackLink href="/">بازگشت</BackLink>
        <p className="text-sm text-gray-500">کتاب مشخص نشده است.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <BackLink href={returnTo}>بازگشت</BackLink>

      <div className="overflow-hidden rounded-[2rem] border border-violet-100 bg-white shadow-[0_24px_70px_rgba(76,29,149,0.12)]">
        <div className="bg-gradient-to-l from-violet-700 via-violet-600 to-indigo-700 px-6 py-8 text-white sm:px-10">
          <div className="flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"><GraduationCap size={34} /></span><div><span className="text-sm text-violet-100">{book.app_title ?? 'اپلیکیشن آموزشی'}</span><h1 className="mt-1 text-xl font-black sm:text-2xl">دسترسی کامل پایه {book.grade_title ?? ''}</h1><p className="mt-2 text-sm leading-7 text-violet-100">ورود شما از بخش «{book.title}» است؛ اما این خرید، کل محتوای پایه را فعال می‌کند.</p></div></div>
        </div>

        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.25fr]">
          <aside className="rounded-3xl bg-violet-50 p-6">
            <div className="mb-5 flex items-center gap-3"><BookOpenCheck className="text-violet-700" /><h2 className="text-base font-black text-slate-900">چه چیزهایی باز می‌شود؟</h2></div>
            <div className="space-y-4 text-sm text-slate-700">{['تدریس همه درس‌های پایه', 'فعالیت‌ها و کار در کلاس', 'نمونه‌سؤالات و پاسخ‌های تشریحی', 'آزمون‌های بخش، فصل و آزمون آنلاین'].map((title) => <div key={title} className="flex items-center gap-3"><CheckCircle2 size={20} className="shrink-0 text-emerald-500" /><span>{title}</span></div>)}</div>
            <div className="mt-6 rounded-2xl border border-violet-100 bg-white p-4 text-sm leading-7 text-slate-600"><ShieldCheck className="mb-2 text-violet-600" />برای پایه‌های اول تا ششم، دسترسی به‌صورت «کل پایه» فعال می‌شود؛ بنابراین خرید از هر بخش، همه درس‌ها و محتواهای همان پایه را در بر می‌گیرد.</div>
          </aside>

          <main>
            <h2 className="text-lg font-black text-slate-900">انتخاب پلن دسترسی</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">مدت و قیمت مناسب را انتخاب کنید.</p>
      {plans.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          هنوز پلن خریدی برای پایه {book.grade_title ?? ''} تعریف نشده است.
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <label
              key={plan.id}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
                selectedPlanId === plan.id
                  ? 'border-violet-400 bg-violet-50'
                  : 'border-gray-100 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="plan"
                  checked={selectedPlanId === plan.id}
                  onChange={() => setSelectedPlanId(plan.id)}
                  className="accent-violet-700"
                />
                <div>
                  <p className="font-medium text-gray-800">{plan.title}</p>
                  {plan.duration_days && (
                    <p className="text-xs text-gray-400">
                      {plan.duration_days} روز اعتبار
                    </p>
                  )}
                </div>
              </div>
              <div className="text-left">
                {plan.discount_price && (
                  <p className="text-xs text-gray-400 line-through">
                    {plan.price.toLocaleString('fa-IR')} تومان
                  </p>
                )}
                <p className="font-bold text-gray-900">
                  {plan.final_price.toLocaleString('fa-IR')} تومان
                </p>
              </div>
            </label>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleBuy}
            disabled={paying || !selectedPlanId}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800 disabled:opacity-50"
          >
            <CreditCard size={20} /> {paying ? 'در حال انتقال به درگاه پرداخت...' : 'ادامه و پرداخت امن'}
          </button>
          {paymentMode === 'test' && <p className="text-center text-xs leading-6 text-slate-400">مرچنت زیبال در حالت تست است؛ دکمه بالا شبیه‌ساز درگاه را باز می‌کند.</p>}
        </div>
      )}
          </main>
        </div>
      </div>
    </div>
  );
}
