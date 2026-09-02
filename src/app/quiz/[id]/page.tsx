'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, type ReactNode } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  startQuiz, getQuiz, submitAnswer, finishQuiz, getQuizResult,
} from '@/lib/quizzes';
import { getToken } from '@/lib/token';
import { ApiError } from '@/lib/api';
import { QuizDetail, QuizResult } from '@/types';
import BackLink from '@/components/BackLink';
import { AlarmClock, ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, CircleHelp, ClipboardCheck, Flag, RotateCcw, ShieldCheck, Target, XCircle } from 'lucide-react';

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
  const searchParams = useSearchParams();
  const bookId = Number(searchParams.get('book_id')) || null;
  const [phase, setPhase] = useState<Phase>({ name: 'loading' });

  // پاسخ‌های انتخاب‌شده روی خودِ مرورگر نگه داشته می‌شوند تا وقتی
  // «پایان آزمون» زده شود، یکجا فرستاده شوند.
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{ questionId: number; selectedId: number; correctId: number | null; isCorrect: boolean } | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push(`/login?redirect=/quiz/${params.id}`);
      return;
    }

    (async () => {
      try {
        const attempt = await startQuiz(Number(params.id));
        const quizMeta = await getQuiz(Number(params.id));
        const generatedQuestions = (attempt.answers ?? []).map((answer) => ({
          id: answer.question_id,
          question_text: answer.question_snapshot?.text ?? null,
          image_path: answer.question_snapshot?.image_path ?? null,
          default_score: 1,
          options: (answer.options_snapshot ?? []).map((option) => ({
            id: option.id,
            option_text: option.text ?? null,
            image_path: option.image_path ?? null,
          })),
        }));
        const quiz = { ...quizMeta, questions: generatedQuestions };

        setPhase({ name: 'answering', attemptId: attempt.id, quiz });
        setSecondsLeft(quiz.time_limit ? quiz.time_limit * 60 : null);
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

  useEffect(() => {
    if (phase.name !== 'answering' || secondsLeft === null || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => value === null ? null : Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [phase.name, secondsLeft]);

  async function handleFinish() {
    if (phase.name !== 'answering') return;

    setPhase({ name: 'submitting' });

    try {
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

  async function handleOptionSelect(questionId: number, optionId: number) {
    if (phase.name !== 'answering' || isAnswering || answers[questionId] !== undefined || answerFeedback?.questionId === questionId) return;
    setIsAnswering(true);
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }));

    try {
      const response = await submitAnswer(phase.attemptId, questionId, optionId);
      setAnswerFeedback({ questionId, selectedId: optionId, correctId: response.result.correct_option_id, isCorrect: response.result.is_correct });
      window.setTimeout(() => {
        setAnswerFeedback(null);
        setIsAnswering(false);
        if (currentIndex < phase.quiz.questions.length - 1) {
          setCurrentIndex((index) => index + 1);
        } else {
          void handleFinish();
        }
      }, 500);
    } catch (err) {
      setIsAnswering(false);
      setPhase({ name: 'error', message: err instanceof ApiError ? err.message : 'ثبت پاسخ انجام نشد.' });
    }
  }

  if (phase.name === 'loading' || phase.name === 'submitting') {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-gray-500">
        {phase.name === 'loading' ? 'در حال بارگذاری آزمون...' : 'در حال ثبت پاسخ‌ها...'}
      </div>
    );
  }

  if (phase.name === 'needs-purchase') {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <BackLink href="/">بازگشت</BackLink>
        <div className="mb-3 text-2xl">🔒</div>
        <h1 className="mb-2 text-base font-bold text-gray-900">نیاز به خرید</h1>
        <p className="text-sm text-gray-500">{phase.message}</p>
        {bookId && <Link href={`/purchase?book_id=${bookId}&return_to=${encodeURIComponent(`/quiz/${params.id}?book_id=${bookId}`)}`} className="mt-4 inline-flex rounded-xl bg-violet-700 px-6 py-3 text-sm font-bold text-white">مشاهده پلن‌های خرید</Link>}
      </div>
    );
  }

  if (phase.name === 'error') {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <BackLink href="/">بازگشت</BackLink>
        <div className="mb-3 text-2xl">⚠️</div>
        <p className="text-sm text-red-600">{phase.message}</p>
      </div>
    );
  }

  if (phase.name === 'result') {
    return <ResultView result={phase.result} bookId={bookId} />;
  }

  // phase.name === 'answering'
  const { quiz } = phase;
  const answeredCount = Object.values(answers).filter((answer) => answer != null).length;
  const currentQuestion = quiz.questions[currentIndex];
  const progress = quiz.questions.length > 0 ? (answeredCount / quiz.questions.length) * 100 : 0;
  const timerLabel = secondsLeft === null
    ? 'بدون محدودیت'
    : `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const optionLabels = ['الف', 'ب', 'ج', 'د', 'هـ', 'و'];

  return (
    <main className="min-h-[calc(100vh-74px)] bg-gradient-to-b from-violet-50 via-white to-sky-50 px-4 py-5 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="overflow-hidden rounded-[2rem] bg-gradient-to-l from-violet-700 via-indigo-700 to-blue-700 p-6 text-white shadow-[0_24px_70px_rgba(79,70,229,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"><ClipboardCheck size={29} /></span><div><p className="text-xs font-bold text-violet-200">آزمون هوشمند درسکا</p><h1 className="mt-1 text-lg font-black sm:text-lg">{quiz.title}</h1></div></div><div className="flex gap-3"><span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm"><CircleHelp size={18} /> {quiz.questions.length.toLocaleString('fa-IR')} سؤال</span><span dir="ltr" className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm font-black ${secondsLeft !== null && secondsLeft < 60 ? 'bg-red-500' : 'bg-white/10'}`}><AlarmClock size={18} /> {timerLabel}</span></div></div>
          <div className="mt-4"><div className="mb-2 flex justify-between text-xs text-violet-100"><span>{answeredCount.toLocaleString('fa-IR')} پاسخ ثبت‌شده</span><span>{Math.round(progress).toLocaleString('fa-IR')}٪ پیشرفت</span></div><div className="h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-l from-emerald-300 to-cyan-300 transition-all" style={{ width: `${progress}%` }} /></div></div>
        </header>

        <div className="mt-4 grid gap-5 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-3xl border border-violet-100 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2 font-black text-slate-800"><Flag size={19} className="text-violet-600" /> نقشه آزمون</div><div className="grid grid-cols-5 gap-2 lg:grid-cols-4">{quiz.questions.map((question, index) => <button key={question.id} onClick={() => setCurrentIndex(index)} className={`flex aspect-square items-center justify-center rounded-xl text-sm font-black transition ${currentIndex === index ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : answers[question.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-violet-50'}`}>{(index + 1).toLocaleString('fa-IR')}</button>)}</div><div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><p className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-100" /> پاسخ داده‌شده</p><p className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-slate-100" /> بدون پاسخ</p></div></aside>

          <section className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-[0_18px_60px_rgba(79,70,229,0.08)] sm:p-8">
            {currentQuestion ? <><div className="mb-4 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-base font-black text-violet-700">{(currentIndex + 1).toLocaleString('fa-IR')}</span>{currentQuestion.question_text && <p className="pt-2 text-base font-black leading-8 text-slate-800 sm:text-base">{currentQuestion.question_text}</p>}</div>{currentQuestion.image_path && <img src={currentQuestion.image_path} alt="تصویر سؤال" className="mx-auto mb-4 max-h-96 max-w-full rounded-2xl border border-slate-100 bg-white object-contain p-2" />}<div className="grid gap-3 sm:grid-cols-2">{currentQuestion.options.map((option, optionIndex) => { const feedback = answerFeedback?.questionId === currentQuestion.id ? answerFeedback : null; const selected = feedback?.selectedId === option.id; const correct = feedback?.correctId === option.id; const stateClass = correct ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : selected && !feedback?.isCorrect ? 'border-rose-500 bg-rose-50 text-rose-900' : selected ? 'border-violet-500 bg-violet-50 text-violet-900' : 'border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50/40'; return <button key={option.id} disabled={isAnswering || !!feedback} onClick={() => void handleOptionSelect(currentQuestion.id, option.id)} className={`flex min-h-16 items-center gap-3 rounded-2xl border p-4 text-right transition ${stateClass}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black ${correct ? 'bg-emerald-600 text-white' : selected && !feedback?.isCorrect ? 'bg-rose-600 text-white' : selected ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{optionLabels[optionIndex] ?? (optionIndex + 1).toLocaleString('fa-IR')}</span><span className="flex min-w-0 flex-1 flex-col gap-2 font-bold leading-7">{option.option_text && <span>{option.option_text}</span>}{option.image_path && <img src={option.image_path} alt={`تصویر گزینه ${optionLabels[optionIndex] ?? optionIndex + 1}`} className="max-h-44 max-w-full rounded-xl border border-slate-100 bg-white object-contain p-1" />}</span>{correct && <CheckCircle2 size={20} className="mr-auto shrink-0 text-emerald-600" />}{selected && !feedback?.isCorrect && <XCircle size={20} className="mr-auto shrink-0 text-rose-600" />}</button>; })}</div></> : <p className="py-9 text-center text-slate-500">سؤالی برای این آزمون پیدا نشد.</p>}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"><button disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 disabled:opacity-35"><ArrowRight size={18} /> سؤال قبلی</button>{currentIndex < quiz.questions.length - 1 ? <button onClick={() => setCurrentIndex((index) => Math.min(quiz.questions.length - 1, index + 1))} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-100">سؤال بعدی <ArrowLeft size={18} /></button> : <button onClick={handleFinish} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100"><ShieldCheck size={18} /> پایان آزمون و مشاهده نتیجه</button>}</div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ResultView({ result, bookId }: { result: QuizResult; bookId: number | null }) {
  const percentage = Math.round(result.score.percentage);
  const assessment = result.descriptive_assessment ?? {
    label: percentage >= 50 ? 'قابل قبول' : 'نیازمند تلاش بیشتر',
    message: percentage >= 50 ? 'آفرین، مسیر یادگیری را خوب پیش می‌بری.' : 'با مرور پیشنهادهای زیر بهتر خواهی شد.',
    tone: percentage >= 50 ? 'acceptable' : 'needs_practice',
  };
  const reviews = result.feedback ?? [];
  const needsReview = reviews.filter((item) => !item.is_correct);
  const correctReviews = reviews.filter((item) => item.is_correct);
  const faces = { excellent: '😄', good: '🙂', acceptable: '😌', needs_practice: '🙁' };
  const face = faces[assessment.tone as keyof typeof faces] ?? '🙂';

  return (
    <main className="min-h-[calc(100vh-74px)] bg-slate-50 px-4 py-5 text-slate-800 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-right">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-3xl">{face}</span>
            <div className="flex-1"><p className="text-xs font-bold text-emerald-600">نتیجه آزمون</p><h1 className="mt-1 text-lg font-black text-slate-900">{assessment.label}</h1><p className="mt-2 text-sm leading-7 text-slate-500">{assessment.message}</p></div>
            <div className="border-t border-slate-100 pt-4 text-center sm:border-r sm:border-t-0 sm:pr-7 sm:pt-0"><strong className="block text-2xl font-black text-teal-700">{percentage.toLocaleString('fa-IR')}٪</strong><span className="mt-1 block text-xs text-slate-400">{result.score.earned.toLocaleString('fa-IR')} از {result.score.total.toLocaleString('fa-IR')} امتیاز</span></div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <ResultStat icon={<CheckCircle2 size={23} />} value={result.statistics.correct_answers} label="پاسخ درست" className="border-emerald-100 bg-emerald-50 text-emerald-700" />
          <ResultStat icon={<XCircle size={23} />} value={result.statistics.wrong_answers} label="نیاز به مرور" className="border-amber-100 bg-amber-50 text-amber-700" />
          <ResultStat icon={<CircleHelp size={23} />} value={result.statistics.unanswered} label="بدون پاسخ" className="border-sky-100 bg-sky-50 text-sky-700" />
        </section>

        <section className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          {needsReview.length ? (
            <div className="space-y-4">
              {needsReview.map((item) => (
                <article key={item.number} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-start gap-3 border-b border-slate-100 bg-white p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-700">{item.number.toLocaleString('fa-IR')}</span>
                    <div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${item.is_answered ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'}`}>{item.is_answered ? 'پاسخ اشتباه' : 'بدون پاسخ'}</span></div><h3 className="text-sm font-black leading-7 text-slate-800 sm:text-base">{item.question || 'سؤال تصویری'}</h3></div>
                  </div>
                  <div className="p-4 sm:p-5">
                    {item.question_image && <img src={item.question_image} alt="تصویر سؤال" className="mx-auto mb-4 max-h-72 max-w-full rounded-xl border border-slate-200 bg-white object-contain p-2" />}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <AnswerReview title="پاسخ تو" text={item.selected_answer} image={item.selected_answer_image} empty={!item.is_answered} correct={false} />
                      <AnswerReview title="پاسخ درست" text={item.correct_answer} image={item.correct_answer_image} correct />
                    </div>
                    {(item.explanation || item.explanation_image) && <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/70 p-3 text-sm leading-7 text-violet-950"><strong className="block text-xs text-violet-700">توضیح معلم</strong>{item.explanation && <p>{item.explanation}</p>}{item.explanation_image && <img src={item.explanation_image} alt="تصویر توضیح معلم" className="mt-2 max-h-64 max-w-full rounded-lg bg-white object-contain p-1" />}</div>}
                    {item.recommendation && <p className="mt-3 rounded-xl bg-sky-50 px-4 py-3 text-base font-bold leading-8 text-sky-900"><strong>پیشنهاد برای یادگیری: </strong>{item.recommendation}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700"><BookOpenCheck size={22} /> همه پاسخ‌ها درست هستند.</div>}
          {correctReviews.length > 0 && <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">{correctReviews.map((item) => <div key={item.number} className="flex items-center gap-2 rounded-xl bg-emerald-50/70 px-3 py-2 text-xs text-slate-700"><CheckCircle2 size={16} className="shrink-0 text-emerald-600" /><span className="font-black">سؤال {item.number.toLocaleString('fa-IR')}</span><span className="min-w-0 flex-1 truncate">{item.question || 'سؤال تصویری'}</span><span className="shrink-0 font-bold text-emerald-700">درست</span></div>)}</div>}
        </section>

        <div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-black text-white hover:bg-teal-700"><RotateCcw size={18} /> تلاش دوباره</button><Link href={bookId ? `/?book_id=${bookId}#learning-explorer` : '/'} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:border-teal-300"><Target size={18} /> بازگشت به مسیر یادگیری</Link></div>
      </div>
    </main>
  );
}

function AnswerReview({ title, text, image, correct, empty = false }: { title: string; text: string | null; image: string | null; correct: boolean; empty?: boolean }) {
  return <div className={`rounded-xl border p-3 ${correct ? 'border-emerald-200 bg-emerald-50' : empty ? 'border-sky-200 bg-sky-50' : 'border-rose-200 bg-rose-50'}`}><div className={`mb-2 flex items-center gap-2 text-xs font-black ${correct ? 'text-emerald-700' : empty ? 'text-sky-700' : 'text-rose-700'}`}>{correct ? <CheckCircle2 size={17} /> : empty ? <CircleHelp size={17} /> : <XCircle size={17} />}{title}</div><p className="text-sm font-bold leading-7 text-slate-800">{empty ? 'این سؤال را پاسخ ندادی.' : text || (image ? 'پاسخ تصویری' : 'پاسخی ثبت نشده است.')}</p>{image && <img src={image} alt={title} className="mt-2 max-h-44 max-w-full rounded-lg border border-white bg-white object-contain p-1" />}</div>;
}

function ResultStat({ icon, value, label, className }: { icon: ReactNode; value: number; label: string; className: string }) {
  return <div className={`rounded-2xl border p-3 text-center sm:flex sm:items-center sm:gap-3 sm:text-right ${className}`}><span className="mx-auto mb-1 flex h-8 w-8 items-center justify-center sm:m-0">{icon}</span><div><strong className="block text-base font-black">{value.toLocaleString('fa-IR')}</strong><span className="text-[10px] font-bold sm:text-xs">{label}</span></div></div>;
}
