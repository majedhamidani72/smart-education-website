'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startQuiz } from '@/lib/quizzes';
import { getToken } from '@/lib/token';
import { ApiError } from '@/lib/api';
import BackLink from '@/components/BackLink';

type State =
  | { status: 'loading' }
  | { status: 'started'; attemptId: number }
  | { status: 'needs-purchase'; message: string }
  | { status: 'error'; message: string };

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!getToken()) {
      router.push(`/login?redirect=/quiz/${params.id}`);
      return;
    }

    startQuiz(Number(params.id))
      .then((attempt) => {
        setState({ status: 'started', attemptId: attempt.id });
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 403) {
          setState({ status: 'needs-purchase', message: err.message });
        } else {
          setState({
            status: 'error',
            message: err instanceof ApiError ? err.message : 'خطایی رخ داد.',
          });
        }
      });
  }, [params.id, router]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <BackLink href="/">بازگشت</BackLink>

      {state.status === 'loading' && (
        <p className="text-gray-500">در حال بررسی دسترسی...</p>
      )}

      {state.status === 'started' && (
        <div>
          <div className="mb-3 text-4xl">✅</div>
          <h1 className="mb-2 text-lg font-bold text-gray-900">
            آزمون شروع شد
          </h1>
          <p className="text-sm text-gray-500">
            صفحه‌ی پاسخ‌دهی به سوالات به‌زودی اضافه می‌شود — فعلاً فقط
            دسترسی و شروع آزمون تایید شد (شماره‌ی تلاش: {state.attemptId}).
          </p>
        </div>
      )}

      {state.status === 'needs-purchase' && (
        <div>
          <div className="mb-3 text-4xl">🔒</div>
          <h1 className="mb-2 text-lg font-bold text-gray-900">
            نیاز به خرید
          </h1>
          <p className="text-sm text-gray-500">{state.message}</p>
          <p className="mt-4 text-xs text-gray-400">
            صفحه‌ی خرید هنوز در وب‌سایت آماده نشده — به‌زودی همینجا اضافه
            می‌شود.
          </p>
        </div>
      )}

      {state.status === 'error' && (
        <div>
          <div className="mb-3 text-4xl">⚠️</div>
          <p className="text-sm text-red-600">{state.message}</p>
        </div>
      )}
    </div>
  );
}
