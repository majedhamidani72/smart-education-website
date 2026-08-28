import { apiFetch } from '@/lib/api';

export interface StudentDashboard {
  student: { name: string };
  summary: { books_count: number; completed_contents: number; remaining_quizzes: number; average_score: number };
  continue_learning: null | { content_id: number; title: string; book_id: number; book_title: string; chapter_id: number | null; section_id: number | null; page_number: string | null; last_position_seconds: number };
  books: Array<{ id: number; title: string; cover: string | null; grade: string | null; grade_number: number | null; subject: string | null; progress: number; completed_contents: number; total_contents: number; remaining_quizzes: number; chapters: Array<{ id: number; title: string; progress: number; completed_contents: number; total_contents: number; lessons: Array<{ id: number; title: string }> }> }>;
  recent_results: Array<{ id: number; quiz_title: string; percentage: number; finished_at: string | null }>;
  strengths: Array<{ title: string; percentage: number }>;
  needs_practice: Array<{ title: string; percentage: number }>;
  chart: Array<{ label: string; percentage: number }>;
}

export function getStudentDashboard(): Promise<StudentDashboard> {
  return apiFetch<StudentDashboard>('/student/dashboard');
}

export function saveContentProgress(contentId: number, data: { watch_seconds?: number; last_position_seconds?: number; completed?: boolean } = {}) {
  return apiFetch<{ saved: boolean }>(`/student/progress/content/${contentId}`, { method: 'POST', body: JSON.stringify(data) });
}

export function getContentProgress(contentId: number) {
  return apiFetch<{ last_position_seconds: number; watch_seconds: number; completed: boolean }>(`/student/progress/content/${contentId}`);
}
