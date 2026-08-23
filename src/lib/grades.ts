import { apiFetch } from '@/lib/api';
import { Grade } from '@/types';

export async function getGrades(): Promise<Grade[]> {
  return apiFetch<Grade[]>('/grades');
}
