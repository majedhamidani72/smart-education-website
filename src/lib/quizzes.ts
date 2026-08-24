import { apiFetch } from '@/lib/api';
import { QuizSummary } from '@/types';

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
