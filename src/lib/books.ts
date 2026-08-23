import { apiFetch } from '@/lib/api';
import { Book } from '@/types';

export async function getBooksForGrade(gradeId: number): Promise<Book[]> {
  return apiFetch<Book[]>(`/books?grade_id=${gradeId}`);
}

export async function getBook(id: number): Promise<Book> {
  return apiFetch<Book>(`/books/${id}`);
}
