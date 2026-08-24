import { apiFetch } from '@/lib/api';
import { QuizSummary } from '@/types';

export async function getBookQuizSummary(bookId: number): Promise<QuizSummary> {
  return apiFetch<QuizSummary>(`/books/${bookId}/quiz-summary`);
}
