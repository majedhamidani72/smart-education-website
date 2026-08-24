import { apiFetch } from '@/lib/api';
import { QuizSummary, QuizDetail, QuizResult } from '@/types';

export async function getBookQuizSummary(bookId: number): Promise<QuizSummary> {
  return apiFetch<QuizSummary>(`/books/${bookId}/quiz-summary`);
}

export interface QuizAttempt {
  id: number;
  status: string;
}

/**
 * شروع یک آزمون — بک‌اند خودش تشخیص می‌دهد آیا کاربر دسترسی
 * دارد یا نه (چه رایگان، چه از طریق اشتراک فعال)؛ اگر نداشته
 * باشد، با پیام «باید خریداری کنی» رد می‌کند.
 */
export async function startQuiz(quizId: number): Promise<QuizAttempt> {
  return apiFetch<QuizAttempt>(`/quizzes/${quizId}/start`, {
    method: 'POST',
  });
}

/**
 * سوالات کامل یک آزمون (بدون پاسخ صحیح — آن فقط برای معلم/ادمین
 * فرستاده می‌شود، نه دانش‌آموز).
 */
export async function getQuiz(quizId: number): Promise<QuizDetail> {
  return apiFetch<QuizDetail>(`/quizzes/${quizId}`);
}

export async function submitAnswer(
  attemptId: number,
  questionId: number,
  optionId: number | null
): Promise<void> {
  await apiFetch(`/quiz-attempts/${attemptId}/answer`, {
    method: 'POST',
    body: JSON.stringify({
      question_id: questionId,
      question_option_id: optionId,
    }),
  });
}

export async function finishQuiz(attemptId: number): Promise<void> {
  await apiFetch(`/quiz-attempts/${attemptId}/finish`, {
    method: 'POST',
  });
}

export async function getQuizResult(attemptId: number): Promise<QuizResult> {
  return apiFetch<QuizResult>(`/quiz-attempts/${attemptId}/result`);
}
