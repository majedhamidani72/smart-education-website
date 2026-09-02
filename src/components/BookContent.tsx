'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight, BookOpenCheck, ChevronLeft, CirclePlay, ClipboardCheck, Clock3,
  Eye, FileQuestion, FileText, HardDrive, Layers3, LockKeyhole, MonitorPlay, PlayCircle,
} from 'lucide-react';
import { Chapter, ContentItem, QuizSummary, Section } from '@/types';
import QuizSummarySection from '@/components/QuizSummarySection';
import { getBookContent } from '@/lib/content';
import { getContentProgress, saveContentProgress } from '@/lib/student-dashboard';
import { getToken } from '@/lib/token';

interface Props {
  items: ContentItem[];
  bookId: number;
  bookTitle: string;
  gradeTitle: string | null;
  quizSummary: QuizSummary;
  chapters: Chapter[];
  sections: Section[];
}

const MODES = [
  { slug: 'teaching', title: 'تدریس', subtitle: 'فصل‌ها، بخش‌ها و فعالیت‌ها', icon: PlayCircle, active: 'border-violet-500 bg-violet-600 text-white shadow-violet-100' },
  { slug: 'sample_questions', title: 'نمونه‌سؤال', subtitle: 'تمرین‌های طبقه‌بندی‌شده فصل‌ها', icon: FileQuestion, active: 'border-orange-500 bg-orange-500 text-white shadow-orange-100' },
  { slug: 'online_exam', title: 'آزمون آنلاین', subtitle: 'آزمون درس، فصل و کل کتاب', icon: ClipboardCheck, active: 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-100' },
];

const CHAPTERS = [
  'عددنویسی و الگوها', 'کسر', 'نسبت، تناسب و درصد', 'تقارن و چندضلعی‌ها',
  'عددهای اعشاری', 'اندازه‌گیری', 'آمار و احتمال',
];

export default function BookContent({ items: initialItems, bookId, bookTitle, gradeTitle, quizSummary, chapters, sections }: Props) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    let cancelled = false;
    getBookContent(bookId)
      .then((freshItems) => {
        if (!cancelled) setItems(freshItems);
      })
      .catch(() => {
        // نسخه‌ای که سمت سرور دریافت شده همچنان قابل استفاده است.
      });
    return () => {
      cancelled = true;
    };
  }, [bookId]);
  const requestedType = searchParams.get('type');
  const requestedChapter = Number(searchParams.get('chapter')) || null;
  const requestedSection = Number(searchParams.get('section')) || null;
  const requestedGrade = searchParams.get('grade_id');
  const requestedContent = Number(searchParams.get('content')) || null;
  const activeType = MODES.some((mode) => mode.slug === requestedType) ? requestedType! : 'teaching';
  const selectedItem = requestedContent ? items.find((item) => item.id === requestedContent) : null;
  const currentContentHref = `/book/${bookId}?type=${activeType}${requestedChapter ? `&chapter=${requestedChapter}` : ''}${requestedSection ? `&section=${requestedSection}` : ''}${requestedGrade ? `&grade_id=${requestedGrade}` : ''}${requestedContent ? `&content=${requestedContent}` : ''}`;

  const visibleItems = items
    .filter((item) => item.content_type?.slug === activeType)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      {selectedItem ? (
        <ContentDetail item={selectedItem} backHref={`/book/${bookId}?type=${activeType}${requestedChapter ? `&chapter=${requestedChapter}` : ''}${requestedSection ? `&section=${requestedSection}` : ''}${requestedGrade ? `&grade_id=${requestedGrade}` : ''}`} purchaseHref={`/purchase?book_id=${bookId}&return_to=${encodeURIComponent(currentContentHref)}`} />
      ) : activeType === 'online_exam' ? (
        <QuizSummarySection summary={quizSummary} bookId={bookId} />
      ) : activeType === 'sample_questions' && requestedChapter ? (
        <SampleQuestionChapter chapterNumber={requestedChapter} bookId={bookId} items={visibleItems} chapters={chapters} sections={sections} />
      ) : activeType === 'teaching' && requestedChapter ? (
        <ChapterTeaching chapterNumber={requestedChapter} sectionNumber={requestedSection} bookId={bookId} bookTitle={bookTitle} gradeTitle={gradeTitle} chapters={chapters} sections={sections} items={items} />
      ) : visibleItems.length > 0 ? (
        <PublishedItems items={visibleItems} bookId={bookId} type={activeType} />
      ) : activeType === 'teaching' ? (
        <TeachingChapters bookId={bookId} bookTitle={bookTitle} chapters={chapters} sections={sections} />
      ) : (
        <SampleQuestionChapters bookId={bookId} chapters={chapters} />
      )}
    </div>
  );
}

function TeachingChapters({ bookId, bookTitle, chapters, sections }: { bookId: number; bookTitle: string; chapters: Chapter[]; sections: Section[] }) {
  const displayChapters = chapters.length > 0 ? chapters : fallbackChapters(bookId);
  const isMath = bookTitle.includes('ریاضی');
  const lessons = sections.map((section) => ({
    section,
    chapter: displayChapters.find((chapter) => chapter.id === section.chapter_id),
  })).filter((lesson): lesson is { section: Section; chapter: Chapter } => Boolean(lesson.chapter));
  return (
    <section className="rounded-3xl border border-violet-100 bg-violet-50/40 p-5 sm:p-7">
      <Header icon={Layers3} title={isMath ? 'تدریس فصل‌به‌فصل' : 'تدریس درس‌به‌درس'} text={isMath ? 'پس از بخش‌های آموزشی هر فصل، آزمون جمع‌بندی همان فصل قرار می‌گیرد.' : 'هر درس با نام واقعی ثبت‌شده در کتاب نمایش داده می‌شود.'} />
      <div className="mt-7 space-y-5">
        {(isMath || lessons.length === 0 ? displayChapters.map((chapter) => ({ chapter, section: null })) : lessons).map(({ chapter, section }, index) => (
          <div key={section?.id ?? chapter.id} className="overflow-hidden rounded-2xl border border-white bg-white shadow-[0_8px_28px_rgba(76,29,149,0.06)]">
            <Link href={`/book/${bookId}?type=teaching&chapter=${chapter.id}${section ? `&section=${section.id}` : ''}`} className="group flex min-h-24 items-center gap-4 p-5 transition hover:bg-violet-50/40">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-lg font-black text-violet-700">{toPersian(index + 1)}</span>
              <span className="flex-1"><small className="font-bold text-violet-500">تدریس {isMath ? `فصل ${toPersian(index + 1)}` : `درس ${section?.title ?? chapter.title}`}</small><strong className="mt-1 block text-base text-slate-900">{section?.title ?? chapter.title}</strong>{section && <span className="mt-1 block text-xs text-slate-400">{chapter.title}</span>}<span className="mt-2 flex gap-4 text-xs text-slate-400"><span>ویدیوهای تدریس</span><span>فعالیت و کار در کلاس</span></span></span>
              <ChevronLeft className="text-slate-300 transition group-hover:-translate-x-1 group-hover:text-violet-600" />
            </Link>
            <div className="flex items-center gap-3 border-t border-emerald-100 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-700"><ClipboardCheck size={19} /> آزمون پایان {isMath ? 'فصل' : 'درس'} {toPersian(index + 1)} <span className="mr-auto rounded-full bg-white px-3 py-1 text-[10px] text-emerald-600">پس از تکمیل تدریس</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChapterTeaching({ chapterNumber, sectionNumber, bookId, bookTitle, gradeTitle, chapters, sections, items }: { chapterNumber: number; sectionNumber: number | null; bookId: number; bookTitle: string; gradeTitle: string | null; chapters: Chapter[]; sections: Section[]; items: ContentItem[] }) {
  const displayChapters = chapters.length > 0 ? chapters : fallbackChapters(bookId);
  const chapter = displayChapters.find((item) => item.id === chapterNumber) ?? displayChapters[Math.min(Math.max(chapterNumber, 1), displayChapters.length) - 1];
  // شناسه فصل لزوماً شماره نمایشی آن نیست (مثلاً id=3 می‌تواند فصل اول کتاب باشد).
  const chapterIndex = Math.max(displayChapters.findIndex((item) => item.id === chapter.id), 0);
  const chapterPosition = chapter.sort_order > 0 ? chapter.sort_order : chapterIndex + 1;
  const chapterSections = sections.filter((section) => section.chapter_id === chapter.id);
  const isMath = bookTitle.includes('ریاضی');
  const visibleSections = sectionNumber
    ? chapterSections.filter((section) => section.id === sectionNumber)
    : chapterSections;
  return (
    <section className="rounded-3xl border border-orange-100 bg-[#fffaf3] p-5 shadow-[0_18px_55px_rgba(249,115,22,0.08)] sm:p-7">
      <Link href={`/book/${bookId}?type=teaching`} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-orange-600"><ArrowRight size={18} /> بازگشت به فصل‌ها</Link>
      <Header icon={BookOpenCheck} eyebrow={`${gradeTitle ? `پایه ${gradeTitle} • ` : ''}کتاب ${bookTitle} • ${isMath ? `تدریس فصل ${toPersian(chapterPosition)}` : 'فهرست درس‌ها'}`} title={sectionNumber ? (visibleSections[0]?.title ?? chapter.title) : chapter.title} />
      <div className="mt-7 space-y-5">
        {(visibleSections.length > 0 ? visibleSections : fallbackSections(chapter.id)).map((section, index) => {
          const sectionItems = items.filter((item) => item.section_id === section.id).sort((a, b) => a.sort_order - b.sort_order);
          return (
          <div key={section.title} className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_8px_26px_rgba(249,115,22,0.06)]">
            <div className="flex items-center gap-3 border-b border-orange-50 p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 font-black text-orange-600">{toPersian(section.sort_order || index + 1)}</span><div><small className="text-xs text-slate-400">{isMath ? 'بخش' : 'درس'} {toPersian(section.sort_order || index + 1)}</small><h3 className="font-black text-slate-900">{section.title}</h3>{section.description && <p className="mt-1 text-xs text-slate-400">{section.description}</p>}</div></div>
            <div className="divide-y divide-slate-100 px-5">
              {sectionItems.length > 0 ? sectionItems.map((item) => <SectionContentRow key={item.id} item={item} bookId={bookId} chapterId={chapter.id} />) : <div className="flex min-h-16 items-center gap-3 py-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><CirclePlay size={19} /></span><strong className="text-sm text-slate-700">محتوای این {isMath ? 'بخش' : 'درس'}</strong><span className="mr-auto rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-600"><LockKeyhole size={11} className="ml-1 inline" />در حال آماده‌سازی</span></div>}
            </div>
            <div className="flex min-h-16 items-center gap-3 border-t border-emerald-100 bg-emerald-50 px-5 text-sm font-black text-emerald-700"><ClipboardCheck size={20} /> آزمون {isMath ? 'بخش' : 'درس'} {toPersian(section.sort_order || index + 1)} <span className="mr-auto text-xs font-normal text-emerald-600">بعد از فعالیت‌های این {isMath ? 'بخش' : 'درس'}</span></div>
          </div>
          );
        })}
        {!sectionNumber && <div className="flex min-h-20 items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-orange-700"><ClipboardCheck size={28} /><div><small className="text-orange-500">جمع‌بندی {isMath ? 'فصل' : 'نوبت'}</small><strong className="block">آزمون پایان {isMath ? 'فصل' : 'نوبت'} {toPersian(chapterPosition)}</strong></div><ChevronLeft className="mr-auto" /></div>}
      </div>
    </section>
  );
}

function SampleQuestionChapters({ bookId, chapters }: { bookId: number; chapters: Chapter[] }) {
  const displayChapters = chapters.length > 0 ? chapters : fallbackChapters(bookId);
  return (
    <section className="rounded-3xl border border-orange-100 bg-orange-50/40 p-5 sm:p-7">
      <Header icon={FileQuestion} eyebrow="بانک نمونه‌سؤال" title="نمونه‌سؤالات فصل‌به‌فصل" text="برای هر فصل، تمرین‌های آموزشی، سؤالات امتحانی و فایل جمع‌بندی در یک محل قرار می‌گیرد." />
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {displayChapters.map((chapter, index) => <Link href={`/book/${bookId}?type=sample_questions&chapter=${chapter.id}`} key={chapter.id} className="rounded-2xl border border-white bg-white p-5 shadow-[0_8px_26px_rgba(194,65,12,0.06)] transition hover:-translate-y-1"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 font-black text-orange-600">{toPersian(index + 1)}</span><div><small className="text-xs font-bold text-orange-500">نمونه‌سؤال فصل {toPersian(index + 1)}</small><h3 className="font-black text-slate-900">{chapter.title}</h3></div></div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500"><span className="rounded-xl bg-slate-50 p-2">تمرین آموزشی</span><span className="rounded-xl bg-slate-50 p-2">سؤالات امتحانی</span><span className="rounded-xl bg-slate-50 p-2">پاسخ تشریحی</span></div><div className="mt-4 flex items-center text-xs font-bold text-slate-400"><LockKeyhole size={14} className="ml-1" /> مشاهده فصل <ChevronLeft size={16} className="mr-auto" /></div></Link>)}
      </div>
      <Link href={`/book/${bookId}?type=online_exam`} className="mt-6 flex min-h-16 items-center gap-3 rounded-2xl bg-emerald-500 px-5 font-black text-white shadow-lg shadow-emerald-100"><ClipboardCheck size={24} /> بعد از تمرین، آزمون آنلاین کل کتاب را بده <ChevronLeft className="mr-auto" /></Link>
    </section>
  );
}

function SampleQuestionChapter({ chapterNumber, bookId, items, chapters, sections }: { chapterNumber: number; bookId: number; items: ContentItem[]; chapters: Chapter[]; sections: Section[] }) {
  const displayChapters = chapters.length > 0 ? chapters : fallbackChapters(bookId);
  const chapter = displayChapters.find((item) => item.id === chapterNumber) ?? displayChapters[Math.min(Math.max(chapterNumber, 1), displayChapters.length) - 1];
  const chapterIndex = Math.max(displayChapters.findIndex((item) => item.id === chapter.id), 0);
  const chapterTitle = chapter.title;
  const sectionIds = new Set(sections.filter((section) => section.chapter_id === chapter.id).map((section) => section.id));
  const chapterItems = items.filter((item) =>
    item.chapter_id === chapter.id ||
    (item.section_id != null && sectionIds.has(item.section_id))
  );
  return (
    <section className="rounded-3xl border border-orange-100 bg-orange-50/40 p-5 sm:p-7">
      <Header icon={FileQuestion} title={`نمونه‌سؤالات فصل ${toPersian(chapterIndex + 1)}`} text={chapterTitle} />
      <div className="mt-7 space-y-3">{chapterItems.length > 0 ? chapterItems.map((item, index) => <SampleQuestionCard key={item.id} item={item} index={index + 1} />) : <div className="rounded-2xl border border-dashed border-orange-200 bg-white/70 p-8 text-center"><FileText className="mx-auto mb-3 text-orange-400" size={34} /><strong className="block text-slate-700">هنوز نمونه‌سؤالی برای این فصل منتشر نشده است.</strong><p className="mt-2 text-xs text-slate-400">فایل‌های PDF تأییدشده پس از انتشار در همین قسمت قرار می‌گیرند.</p></div>}</div>
    </section>
  );
}

function SampleQuestionCard({ item, index }: { item: ContentItem; index: number }) {
  const sampleFiles = item.sample_questions?.filter((file) => file.url) ?? [];
  const directPdf = item.pdf_file?.file ? [{ id: item.pdf_file.id ?? 0, url: item.pdf_file.view_url ?? item.pdf_file.file, original_name: item.pdf_file.original_name ?? item.pdf_file.title ?? null, file_size_readable: item.pdf_file.file_size ? formatFileSize(item.pdf_file.file_size) : null }] : [];
  const files = sampleFiles.length > 0 ? sampleFiles : directPdf;

  return <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-[0_6px_20px_rgba(249,115,22,0.05)]">
    <div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 font-black text-orange-600">{toPersian(index)}</span><FileText size={22} className="text-orange-500" /><div><strong className="text-base font-black text-slate-800">{item.title}{item.page_number && <span> {formatPages(item.page_number)}</span>}</strong>{item.description && <p className="mt-1 text-xs text-slate-400">{item.description}</p>}</div></div>
    {item.has_access && files.length > 0 ? <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">{files.map((file, fileIndex) => <div key={`${file.id}-${fileIndex}`} className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-600">{file.original_name || `فایل PDF ${toPersian(fileIndex + 1)}`}</span>{file.file_size_readable && <small className="text-[10px] text-slate-400">{file.file_size_readable}</small>}<a href={file.url ?? '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-2 text-xs font-black text-violet-700"><Eye size={15} /> نمایش</a></div>)}</div> : <div className="mt-3 border-t border-slate-100 pt-3 text-xs font-bold text-amber-600">{item.has_access ? 'فایل PDF هنوز بارگذاری نشده است.' : 'برای دریافت فایل، ابتدا دسترسی پایه را تهیه کنید.'}</div>}
  </div>;
}

function PublishedItems({ items, bookId, type }: { items: ContentItem[]; bookId: number; type: string }) {
  return <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-7"><Header icon={type === 'teaching' ? PlayCircle : FileQuestion} title={type === 'teaching' ? 'تدریس‌های ریاضی پنجم' : 'تمرین‌ها و نمونه‌سؤالات'} /><div className="mt-6 space-y-3">{items.map((item, index) => <ContentItemCard key={item.id} item={item} bookId={bookId} index={index + 1} type={type} />)}</div></section>;
}

function SectionContentRow({ item, bookId, chapterId }: { item: ContentItem; bookId: number; chapterId: number }) {
  const searchParams = useSearchParams();
  const gradeId = searchParams.get('grade_id');
  const sectionId = searchParams.get('section');
  const contentHref = `/book/${bookId}?type=teaching&chapter=${chapterId}${sectionId ? `&section=${sectionId}` : ''}${gradeId ? `&grade_id=${gradeId}` : ''}&content=${item.id}`;
  const purchaseHref = `/purchase?book_id=${bookId}&return_to=${encodeURIComponent(contentHref)}`;
  const header = (
    <div className="flex min-h-14 w-full items-center gap-3 py-3 text-right">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><CirclePlay size={20} /></span>
      <strong className="text-base font-black text-slate-800 sm:text-base">{item.title}{item.page_number && <span> {formatPages(item.page_number)}</span>}</strong>
      <span className={`mr-auto rounded-full px-3 py-1 text-[10px] font-bold ${item.is_free ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.is_free ? 'رایگان' : 'پولی'}</span>
      <ChevronLeft size={18} className="text-slate-300" />
    </div>
  );

  if (!item.has_access) {
    return <Link href={purchaseHref} className="block transition hover:bg-orange-50/40">{header}</Link>;
  }

  return <Link href={contentHref} className="block transition hover:bg-orange-50/40">{header}</Link>;
}

function ContentDetail({ item, backHref, purchaseHref }: { item: ContentItem; backHref: string; purchaseHref: string }) {
  const pageLabel = item.page_number ? formatPages(item.page_number) : '';
  const [resumePosition, setResumePosition] = useState(0);
  useEffect(() => {
    if (item.has_access && getToken()) {
      void saveContentProgress(item.id).catch(() => undefined);
      void getContentProgress(item.id).then((progress) => setResumePosition(progress.last_position_seconds)).catch(() => undefined);
    }
  }, [item.id, item.has_access]);
  return (
    <section className="rounded-3xl border border-orange-100 bg-[#fffaf3] p-5 shadow-[0_18px_55px_rgba(249,115,22,0.08)] sm:p-8">
      <Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-orange-600"><ArrowRight size={18} /> بازگشت به بخش</Link>
      <div className="mb-6 flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><CirclePlay size={28} /></span><h1 className="text-lg font-black text-slate-900 sm:text-xl">{item.title}{pageLabel && <span> {pageLabel}</span>}</h1><span className={`mr-auto rounded-full px-3 py-1 text-xs font-bold ${item.is_free ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.is_free ? 'رایگان' : 'پولی'}</span></div>
      {item.description && <p className="mb-6 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">{item.description}</p>}
      {item.has_access ? <ContentPlayer item={item} resumePosition={resumePosition} onProgress={(seconds) => getToken() ? saveContentProgress(item.id, { watch_seconds: seconds, last_position_seconds: seconds }).catch(() => undefined) : undefined} onCompleted={() => getToken() ? saveContentProgress(item.id, { completed: true, last_position_seconds: 0 }).catch(() => undefined) : undefined} /> : <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center"><LockKeyhole className="mx-auto mb-3 text-amber-600" /><p className="mb-4 text-sm text-amber-800">برای مشاهده این محتوا، دسترسی پایه را تهیه کنید.</p><Link href={purchaseHref} className="inline-flex rounded-xl bg-violet-700 px-6 py-3 font-bold text-white">مشاهده پلن‌های خرید</Link></div>}
    </section>
  );
}

function ContentItemCard({ item, bookId, index, type }: { item: ContentItem; bookId: number; index: number; type: string }) {
  const params = useSearchParams();
  const gradeId = params.get('grade_id');
  const chapterId = item.section?.chapter_id;
  const href = item.has_access
    ? `/book/${bookId}?type=${type}${chapterId ? `&chapter=${chapterId}` : ''}${gradeId ? `&grade_id=${gradeId}` : ''}&content=${item.id}`
    : `/purchase?book_id=${bookId}&return_to=${encodeURIComponent(`/book/${bookId}?type=${type}${chapterId ? `&chapter=${chapterId}` : ''}${gradeId ? `&grade_id=${gradeId}` : ''}&content=${item.id}`)}`;
  return <Link href={href} className="flex min-h-20 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-violet-200 hover:shadow-md"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 font-black text-violet-600">{toPersian(index)}</span><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><CirclePlay size={19} /></span><div><strong className="text-base font-black text-slate-800 sm:text-base">{item.title}{item.page_number && <span> {formatPages(item.page_number)}</span>}</strong>{item.description && <p className="mt-1 line-clamp-1 text-xs text-slate-400">{item.description}</p>}</div><span className="mr-auto text-xs font-bold text-violet-600">{item.has_access ? 'مشاهده محتوا' : 'خرید دسترسی'}</span><ChevronLeft size={18} className="text-slate-300" /></Link>;
}

function ContentPlayer({ item, resumePosition, onProgress, onCompleted }: { item: ContentItem; resumePosition: number; onProgress: (seconds: number) => void; onCompleted: () => void }) {
  const params = useSearchParams();
  const lastSavedSecond = useRef(0);
  if (item.video?.video_url) {
    const video = item.video;
    const metadata = [
      video.views_count != null ? { icon: Eye, label: `${toPersian(video.views_count)} بازدید` } : null,
      video.duration ? { icon: Clock3, label: formatDuration(video.duration) } : null,
      video.quality ? { icon: MonitorPlay, label: `کیفیت ${video.quality}` } : null,
      video.file_size ? { icon: HardDrive, label: formatFileSize(video.file_size) } : null,
    ].filter(Boolean) as { icon: typeof Eye; label: string }[];

    return <div className="mx-auto w-full max-w-[760px]">
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg ring-1 ring-black/10">
        <video controls playsInline preload="metadata" onLoadedMetadata={(event) => { if (resumePosition > 0 && resumePosition < event.currentTarget.duration - 2) event.currentTarget.currentTime = resumePosition; }} onTimeUpdate={(event) => { const second = Math.floor(event.currentTarget.currentTime); if (second >= lastSavedSecond.current + 10) { lastSavedSecond.current = second; onProgress(second); } }} onEnded={onCompleted} className="h-full w-full object-cover" poster={video.thumbnail_url ?? undefined}><source src={video.video_url ?? undefined} /></video>
      </div>
      {metadata.length > 0 && <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">{metadata.map(({ icon: Icon, label }) => <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"><Icon size={15} className="text-orange-500" />{label}</span>)}</div>}
    </div>;
  }
  const requestedFile = Number(params.get('file')) || null;
  const sampleFile = item.sample_questions?.find((file) => file.id === requestedFile) ?? item.sample_questions?.find((file) => file.url);
  const pdfUrl = sampleFile?.url ?? item.pdf_file?.file;
  if (pdfUrl) return <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-orange-100 px-4 py-3"><FileText size={20} className="text-orange-500" /><strong className="text-sm text-slate-700">{sampleFile?.original_name || item.title}</strong></div><iframe src={pdfUrl} title={item.title} className="h-[72vh] min-h-[520px] w-full bg-slate-50" /></div>;
  return <p className="text-xs text-slate-400">فایل این محتوا هنوز بارگذاری نشده است.</p>;
}

function Header({ icon: Icon, eyebrow, title, text }: { icon: typeof Layers3; eyebrow?: string; title: string; text?: string }) {
  return <div className="flex items-start gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm"><Icon size={27} /></span><div>{eyebrow && <span className="text-xs font-black text-orange-600">{eyebrow}</span>}<h2 className={`${eyebrow ? 'mt-1' : ''} text-lg font-black text-slate-900 sm:text-xl`}>{title}</h2>{text && <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>}</div></div>;
}

function toPersian(value: number) {
  return String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}

function formatPages(value: string) {
  const normalized = String(value).trim();
  return /^صفحه/.test(normalized) ? normalized : `صفحه ${normalized}`;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${toPersian(minutes)}:${toPersian(remainder).padStart(2, '۰')} دقیقه`;
}

function formatFileSize(bytes: number) {
  const megabytes = bytes / 1024 / 1024;
  return `${toPersian(Number(megabytes.toFixed(megabytes >= 10 ? 0 : 1)))} مگابایت`;
}

function fallbackChapters(bookId: number): Chapter[] {
  return CHAPTERS.map((title, index) => ({ id: index + 1, book_id: bookId, title, slug: '', description: null, sort_order: index + 1, is_active: true }));
}

function fallbackSections(chapterId: number): Section[] {
  return [
    { id: -1, chapter_id: chapterId, title: 'مرور و یادآوری', slug: '', description: null, sort_order: 1, is_active: true },
    { id: -2, chapter_id: chapterId, title: 'آموزش و فعالیت‌ها', slug: '', description: null, sort_order: 2, is_active: true },
  ];
}
