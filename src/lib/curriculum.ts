import { apiFetch } from '@/lib/api';
import { Chapter, Section } from '@/types';

export async function getChaptersForBook(bookId: number): Promise<Chapter[]> {
  const chapters = await apiFetch<Chapter[]>('/chapters');
  return chapters
    .filter((chapter) => chapter.book_id === bookId && chapter.is_active)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}

export async function getSectionsForChapters(chapterIds: number[]): Promise<Section[]> {
  if (chapterIds.length === 0) return [];
  const sections = await apiFetch<Section[]>('/sections');
  const ids = new Set(chapterIds);
  return sections
    .filter((section) => ids.has(section.chapter_id) && section.is_active)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}
