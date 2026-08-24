'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  startQuiz,
  getQuiz,
  submitAnswer,
  finishQuiz,
  getQuizResult,
} from '@/lib/quizzes';
import { getToken } from '@/lib/token';
import { ApiError } from '@/lib/api';
import { QuizDetail, QuizResult } from '@/types';
import BackLink from '@/components/BackLink';

type Phase =
  | { name: 'loading' }
  | { name: 'needs-purchase'; message: string }
  | { name: 'answering'; attemptId: number; quiz: QuizDetail }
  | { name: 'submitting' }
  | { name: 'result'; result: QuizResult }
  | { name: 'error'; message: string };

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ name: 'loading' });

  // پاسخ‌های انتخاب‌شده روی خودِ مرورگر نگه داشته می‌شوند تا وقتی
  // «پایان آزمون» زده شود، یکجا فرستاده شوند.
  const [answers, setAnswers] = useState<Record<number, number | null>>({});

  useEffect(() => {
    if (!getToken()) {
      router.push(`/login?redirect=/quiz/${params.id}`);
      return;
    }

    (async () => {
      try {
        const attempt = await startQuiz(Number(params.id));
        const quiz = await getQuiz(Number(params.id));

        setPhase({ name: 'answering', attemptId: attempt.id, quiz });
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          setPhase({ name: 'needs-purchase', message: err.message });
        } else {
          setPhase({
            name: 'error',
            message: err instanceof ApiError ? err.message : 'خطایی رخ داد.',
          });
        }
      }
    })();
  }, [params.id, router]);

  async function handleFinish() {
    if (phase.name !== 'answering') return;

    setPhase({ name: 'submitting' });

    try {
      // پاسخ‌ها یکی‌یکی فرستاده می‌شوند — سوالی که جواب داده
      // نشده، اصلاً ارسال نمی‌شود (بی‌جواب حساب می‌شود).
      for (const question of phase.quiz.questions) {
        const selected = answers[question.id];

        if (selected !== undefined) {
          await submitAnswer(phase.attemptId, question.id, selected);
        }
      }

      await finishQuiz(phase.attemptId);

      const result = await getQuizResult(phase.attemptId);

      setPhase({ name: 'result', result });
    } catch (err) {
      setPhase({
        name: 'error',
        message: err instanceof ApiError ? err.message : 'خطایی رخ داد.',
      });
    }
  }

  if (phase.name === 'loading' || phase.name === 'submitting') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-500">
        {phase.name === 'loading' ? 'در حال بارگذاری آزمون...' : 'در حال ثبت پاسخ‌ها...'}
      </div>
    );
  }

  if (phase.name === 'needs-purchase') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <BackLink href="/">بازگشت</BackLink>
        <div className="mb-3 text-4xl">🔒</div>
        <h1 className="mb-2 text-lg font-bold text-gray-900">نیاز به خرید</h1>
        <p className="text-sm text-gray-500">{phase.message}</p>
        <p className="mt-4 text-xs text-gray-400">
          صفحه‌ی خرید هنوز در وب‌سایت آماده نشده — به‌زودی همینجا اضافه
          می‌شود.
        </p>
      </div>
    );
  }

  if (phase.name === 'error') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <BackLink href="/">بازگشت</BackLink>
        <div className="mb-3 text-4xl">⚠️</div>
        <p className="text-sm text-red-600">{phase.message}</p>
      </div>
    );
  }

  if (phase.name === 'result') {
    return <ResultView result={phase.result} />;
  }

  // phase.name === 'answering'
  const { quiz } = phase;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-1 text-lg font-bold text-gray-900">{quiz.title}</h1>
        <p className="text-sm text-gray-500">{quiz.questions.length} سوال</p>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-xl border border-gray-100 bg-white p-4"
          >
            <p className="mb-3 font-medium text-gray-800">
              {index + 1}. {question.question_text}
            </p>

            {question.image_path && (
              <img
                src={question.image_path}
                alt=""
                className="mb-3 max-w-full rounded-lg"
              />
            )}

            <div className="space-y-2">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm transition ${
                    answers[question.id] === option.id
                      ? 'border-violet-400 bg-violet-50'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === option.id}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: option.id,
                      }))
                    }
                    className="accent-violet-700"
                  />
                  {option.option_text}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleFinish}
        className="mt-6 w-full rounded-lg bg-violet-700 py-3 font-medium text-white hover:bg-violet-800"
      >
        پایان آزمون و مشاهده‌ی نتیجه
      </button>
    </div>
  );
}

function ResultView({ result }: { result: QuizResult }) {
  const passed = result.score.percentage >= 50;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mb-3 text-5xl">{passed ? '🎉' : '📚'}</div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        {Math.round(result.score.percentage)}٪
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        {result.score.earned} از {result.score.total} نمره
      </p>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="font-bold text-emerald-700">
            {result.statistics.correct_answers}
          </p>
          <p className="text-xs text-emerald-600">درست</p>
        </div>
        <div className="rounded-xl bg-red-50 p-3">
          <p className="font-bold text-red-700">
            {result.statistics.wrong_answers}
          </p>
          <p className="text-xs text-red-600">غلط</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="font-bold text-gray-700">
            {result.statistics.unanswered}
          </p>
          <p className="text-xs text-gray-500">بی‌جواب</p>
        </div>
      </div>

      <a
        href="/"
        className="mt-8 inline-block rounded-lg bg-violet-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-800"
      >
        بازگشت به صفحه‌ی اصلی
      </a>
    </div>
  );
}
