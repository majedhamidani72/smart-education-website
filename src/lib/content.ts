import { apiFetch } from '@/lib/api';
import { ContentItem } from '@/types';

export async function getBookContent(bookId: number): Promise<ContentItem[]> {
  return apiFetch<ContentItem[]>(`/content-items?book_id=${bookId}`);
}
