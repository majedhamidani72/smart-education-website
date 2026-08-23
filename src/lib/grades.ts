import { apiFetch } from '@/lib/api';
import { Grade } from '@/types';

export async function getGrades(): Promise<Grade[]> {
  return apiFetch<Grade[]>('/grades');
}

export async function getGrade(id: number): Promise<Grade> {
  return apiFetch<Grade>(`/grades/${id}`);
}
