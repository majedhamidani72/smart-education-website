'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getActivePlans, filterPlansForBook, Plan } from '@/lib/plans';
import { createPurchase, requestPayment } from '@/lib/purchases';
import { getBook } from '@/lib/books';
import { getToken } from '@/lib/token';
import { ApiError } from '@/lib/api';
import { Book } from '@/types';
import BackLink from '@/components/BackLink';

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

  const [book, setBook] = useState<Book | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push(`/login?redirect=/purchase?book_id=${bookId}`);
      return;
    }

    if (!bookId) {
      setLoading(false);
      return;
    }

    Promise.all([getBook(bookId), getActivePlans()])
      .then(([bookData, allPlans]) => {
        setBook(bookData);

        const bookPlans = filterPlansForBook(allPlans, bookId);

        setPlans(bookPlans);

        if (bookPlans.length > 0) {
          setSelectedPlanId(bookPlans[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, [bookId, router]);

  async function handleBuy() {
    if (!selectedPlanId) return;

    setPaying(true);
    setError(null);

    try {
      const purchase = await createPurchase([selectedPlanId]);
      const { payment_url } = await requestPayment(purchase.id);

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
    <div className="mx-auto max-w-lg px-4 py-10">
      <BackLink href={`/book/${bookId}`}>بازگشت</BackLink>

      <h1 className="mb-1 text-xl font-bold text-gray-900">{book.title}</h1>
      <p className="mb-6 text-sm text-gray-500">یک پلن را انتخاب کن</p>

      {plans.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          هنوز پلن خریدی برای این کتاب تعریف نشده است.
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <label
              key={plan.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
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
            className="w-full rounded-lg bg-violet-700 py-3 font-medium text-white disabled:opacity-50"
          >
            {paying ? 'در حال انتقال به درگاه پرداخت...' : 'پرداخت'}
          </button>
        </div>
      )}
    </div>
  );
}
