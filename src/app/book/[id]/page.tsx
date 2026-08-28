import { getBook } from '@/lib/books';
import { getGrade } from '@/lib/grades';
import { getBookContent } from '@/lib/content';
import { getBookQuizSummary } from '@/lib/quizzes';
import { getChaptersForBook, getSectionsForChapters } from '@/lib/curriculum';
import BookContent from '@/components/BookContent';
import AdvertisementSlot from '@/components/AdvertisementSlot';

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ grade_id?: string }>;
}) {
  const { id } = await params;
  const { grade_id } = await searchParams;
  const bookId = Number(id);

  const book = await getBook(bookId);
  return <BookContentSection book={book} gradeId={grade_id} />;
}

async function BookContentSection({
  book,
  gradeId,
}: {
  book: import('@/types').Book;
  gradeId?: string;
}) {
  const [items, quizSummary, chapters, grade] = await Promise.all([
    getBookContent(book.id),
    getBookQuizSummary(book.id),
    getChaptersForBook(book.id),
    gradeId ? getGrade(Number(gradeId)) : Promise.resolve(null),
  ]);
  const sections = await getSectionsForChapters(chapters.map((chapter) => chapter.id));

  return (
    <div className="hero-pattern darska-watermark min-h-[calc(100vh-74px)]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:py-10">
        <AdvertisementSlot position="book" />
        <BookContent items={items} bookId={book.id} bookTitle={book.title} gradeTitle={grade?.title ?? null} quizSummary={quizSummary} chapters={chapters} sections={sections} />
      </div>
    </div>
  );
}
