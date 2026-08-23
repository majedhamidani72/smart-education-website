import { apiFetch } from '@/lib/api';
import { Teacher } from '@/types';

export async function getTeachersForGrade(gradeId: number): Promise<Teacher[]> {
  return apiFetch<Teacher[]>(`/grades/${gradeId}/teachers`);
}

export async function getTeacherBooks(
  teacherId: number,
  gradeId?: number
): Promise<import('@/types').Book[]> {
  const query = gradeId ? `?grade_id=${gradeId}` : '';
  return apiFetch(`/teachers/${teacherId}/books${query}`);
}

export async function getTeachersForBook(bookId: number): Promise<Teacher[]> {
  return apiFetch<Teacher[]>(`/books/${bookId}/teachers`);
}
