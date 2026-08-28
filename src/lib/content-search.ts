import { apiFetch } from '@/lib/api';

export interface ContentSearchData {
  count: number;
  results: Array<{
    id: number; title: string; description: string | null; page_number: string | null;
    thumbnail: string | null; is_free: boolean; has_access: boolean;
    type: { id: number; title: string; slug: string } | null;
    grade: { id: number; title: string } | null;
    book: { id: number; title: string } | null;
    chapter: { id: number; title: string } | null;
    section: { id: number; title: string } | null;
  }>;
  filters: {
    grades: Array<{ id: number; title: string }>;
    books: Array<{ id: number; title: string; grade_id: number | null }>;
    chapters: Array<{ id: number; book_id: number; title: string }>;
    content_types: Array<{ id: number; title: string; slug: string }>;
  };
}

export function searchContent(params: Record<string, string | number | boolean | null | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') query.set(key, String(value));
  });
  return apiFetch<ContentSearchData>(`/search/content?${query.toString()}`);
}
