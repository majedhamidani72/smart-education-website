'use client';

import { useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BookOpen, Calculator, ChevronLeft, CircleCheck, ClipboardCheck,
  FileQuestion, GraduationCap, LockKeyhole, Video,
} from 'lucide-react';
import { Book, Chapter, ContentItem, Grade, QuizSummary, QuizSummaryItem, Section } from '@/types';
import { getToken } from '@/lib/token';

export interface GradeLearningOption {
  grade: Grade;
  books: Array<{
    book: Book;
    chapters: Chapter[];
    sections: Section[];
    items: ContentItem[];
    quizSummary: QuizSummary;
  }>;
}

type LearningMode = 'teaching' | 'sample_questions' | 'online_exam';

export default function LearningExplorer({ options }: { options: GradeLearningOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultGradeId = options.find((option) => option.grade.grade_number === 5)?.grade.id
    ?? options[0]?.grade.id
    ?? 0;
  const requestedGradeId = Number(searchParams.get('grade_id')) || defaultGradeId;
  const requestedMode = searchParams.get('mode');
  const requestedBookId = Number(searchParams.get('book_id')) || 0;
  const initialMode: LearningMode = requestedMode === 'sample_questions' || requestedMode === 'online_exam'
    ? requestedMode
    : 'teaching';
  const activeGradeId = requestedGradeId;
  const activeMode = initialMode;
  const learningContentRef = useRef<HTMLDivElement>(null);
  const active = useMemo(
    () => options.find((option) => option.grade.id === activeGradeId),
    [activeGradeId, options]
  );
  const activeBook = active?.books.find(({ book }) => book.id === requestedBookId)
    ?? active?.books[0]
    ?? null;

  const selectGrade = (gradeId: number) => {
    router.push(`/?grade_id=${gradeId}&mode=${initialMode}#learning-explorer`, { scroll: false });
    requestAnimationFrame(() => {
      learningContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const selectBook = (bookId: number) => {
    if (! active) return;
    router.replace(`/?grade_id=${active.grade.id}&book_id=${bookId}&mode=${activeMode}#learning-explorer`, { scroll: false });
  };

  const selectMode = (mode: LearningMode) => {
    if (!active) return;
    // Modes are siblings, not another hierarchy level, so changing tabs must
    // not require several Back clicks.
    router.replace(`/?grade_id=${active.grade.id}${activeBook ? `&book_id=${activeBook.book.id}` : ''}&mode=${mode}#learning-explorer`, { scroll: false });
  };

  const gradeNumber = active ? toPersian(active.grade.grade_number) : '';
  const gradeLabel = active ? `پایه ${active.grade.title}` : '';

  return (
    <section id="learning-explorer" className="grade-pattern darska-watermark scroll-mt-20 px-4 pb-10 pt-5 sm:pb-12 sm:pt-7">
      <div className="mx-auto max-w-[1480px]">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#242238] sm:text-4xl">پایه تحصیلی خودت را انتخاب کن</h2>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {options.map((option) => {
            const selected = option.grade.id === active?.grade.id;
            return (
              <button
                key={option.grade.id}
                onClick={() => selectGrade(option.grade.id)}
                className={`group flex min-h-28 items-center gap-3 rounded-2xl border p-5 text-right transition hover:-translate-y-1 ${selected ? 'border-blue-600 bg-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.2)]' : 'border-white bg-white text-slate-700 shadow-[0_7px_22px_rgba(44,72,69,0.07)] hover:border-blue-200'}`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${selected ? 'bg-white text-blue-600' : 'bg-blue-50 text-blue-600'}`}>{toPersian(option.grade.grade_number)}</span>
                <span><small className={`block text-xs font-medium ${selected ? 'text-blue-100' : 'text-slate-400'}`}>ابتدایی</small><strong className="mt-1 block text-base font-black">پایه {option.grade.title}</strong></span>
                {selected && <CircleCheck size={17} className="mr-auto" />}
              </button>
            );
          })}
        </div>

        {active && <div id="grade-learning-content" ref={learningContentRef} className="mt-7 scroll-mt-24">
          {active.books.length > 0 && (
            <div className="mb-5 rounded-[2rem] border border-blue-100 bg-white/90 p-5 shadow-[0_14px_40px_rgba(37,99,235,0.08)] backdrop-blur sm:p-6">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-xs font-black text-blue-600">کتاب‌های پایه {active.grade.title}</span>
                  <h3 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">کتاب موردنظرت را انتخاب کن</h3>
                </div>
                <p className="text-sm text-slate-500">کتاب‌های فارسی، ریاضی و سایر کتاب‌های ثبت‌شده این پایه</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {active.books.map(({ book }, index) => {
                  const selected = book.id === activeBook?.book.id;
                  const Icon = book.title.includes('ریاضی') ? Calculator : BookOpen;
                  const accents = [
                    'from-blue-600 to-indigo-600 shadow-blue-100',
                    'from-orange-500 to-amber-500 shadow-orange-100',
                    'from-emerald-500 to-teal-500 shadow-emerald-100',
                    'from-violet-600 to-fuchsia-500 shadow-violet-100',
                  ];
                  return (
                    <button
                      key={book.id}
                      onClick={() => selectBook(book.id)}
                      className={`group flex min-h-20 items-center gap-3 rounded-2xl border p-4 text-right transition hover:-translate-y-1 hover:shadow-lg ${selected ? `border-transparent bg-gradient-to-l text-white shadow-lg ${accents[index % accents.length]}` : 'border-slate-200 bg-white text-slate-800 hover:border-blue-300'}`}
                    >
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}><Icon size={24} /></span>
                      <span><small className={`block text-xs ${selected ? 'text-white/75' : 'text-slate-400'}`}>کتاب</small><strong className="mt-1 block text-lg font-black">{book.title}</strong></span>
                      {selected && <CircleCheck size={20} className="mr-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-7 text-white shadow-[0_20px_45px_rgba(37,99,235,0.2)]">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/20">پایه انتخاب‌شده</span>
            <span className="mt-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl font-black text-blue-600 shadow-xl">{gradeNumber}</span>
            <h3 className="mt-5 text-3xl font-black">{gradeLabel}</h3>
            <p className="mt-3 text-sm leading-7 text-blue-100">درس‌های این پایه را انتخاب کن و وارد مسیر تدریس، تمرین و آزمون شو.</p>
            <div className="mt-6 flex items-center gap-2 border-t border-white/15 pt-5 text-xs text-blue-100"><GraduationCap size={18} /> محتوای مناسب همین پایه</div>
          </aside>

          <div className="rounded-[2rem] border border-orange-100 bg-gradient-to-l from-orange-50 via-white to-amber-50 p-6 shadow-[0_15px_45px_rgba(249,115,22,0.09)] sm:p-8">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-orange-500 text-white shadow-lg shadow-orange-100"><Calculator size={40} /></span>
                <div><h3 className="text-2xl font-black text-slate-900 sm:text-3xl">{activeBook?.book.title ?? `درس‌های پایه ${active.grade.title}`}</h3></div>
              </div>

              {activeBook ? (
                <div className="grid gap-3 sm:grid-cols-3">
                    <Action selected={activeMode === 'teaching'} onClick={() => selectMode('teaching')} icon={Video} title="تدریس" subtitle="پیش‌فرض" color="bg-violet-50 text-violet-600" activeColor="border-violet-500 bg-violet-600 text-white" />
                    <Action selected={activeMode === 'sample_questions'} onClick={() => selectMode('sample_questions')} icon={FileQuestion} title="نمونه‌سؤال" subtitle="تمرین فصل‌ها" color="bg-orange-100 text-orange-600" activeColor="border-orange-500 bg-orange-500 text-white" />
                    <Action selected={activeMode === 'online_exam'} onClick={() => selectMode('online_exam')} icon={ClipboardCheck} title="آزمون آنلاین" subtitle="آزمون کل کتاب" color="bg-emerald-50 text-emerald-600" activeColor="border-emerald-500 bg-emerald-500 text-white" />
                </div>
              ) : (
                <div className="flex min-h-28 min-w-72 items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-5 text-slate-500"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><LockKeyhole size={22} /></span><div><strong className="block text-sm text-slate-700">درس‌های پایه {active.grade.title}</strong><small className="mt-1 block">به‌زودی به مسیر آموزشی اضافه می‌شود.</small></div></div>
              )}
            </div>
            {activeBook && (
              <InlineLearningPanel
                mode={activeMode}
                book={activeBook.book}
                grade={active.grade}
                chapters={activeBook.chapters}
                sections={activeBook.sections}
                items={activeBook.items}
                quizSummary={activeBook.quizSummary}
              />
            )}
          </div>
          </div>
        </div>}
      </div>
    </section>
  );
}

function Action({ selected, onClick, icon: Icon, title, subtitle, color, activeColor }: { selected: boolean; onClick: () => void; icon: typeof Video; title: string; subtitle: string; color: string; activeColor: string }) {
  return <button onClick={onClick} className={`group flex min-h-24 min-w-40 items-center gap-3 rounded-2xl border p-4 text-right shadow-sm transition hover:-translate-y-1 hover:shadow-md ${selected ? activeColor : 'border-white bg-white text-slate-800'}`}><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selected ? 'bg-white/20 text-white' : color}`}><Icon size={24} /></span><span><strong className="block text-sm">{title}</strong><small className={`mt-1 block text-[10px] ${selected ? 'text-white/80' : 'text-slate-400'}`}>{subtitle}</small></span>{selected && <CircleCheck size={17} className="mr-auto" />}</button>;
}

function InlineLearningPanel({ mode, book, grade, chapters: apiChapters, sections, items, quizSummary }: { mode: LearningMode; book: Book; grade: Grade; chapters: Chapter[]; sections: Section[]; items: ContentItem[]; quizSummary: QuizSummary }) {
  const chapters = apiChapters;
  const isMath = book.title.includes('ریاضی');
  const lessons = sections.map((section) => ({
    section,
    chapter: chapters.find((chapter) => chapter.id === section.chapter_id),
  })).filter((lesson) => lesson.chapter);

  if (mode === 'online_exam') {
    return (
      <div className="mt-7 border-t border-orange-100 pt-7">
        <Link href={`/book/${book.id}?type=online_exam&grade_id=${grade.id}`} className="group flex min-h-24 items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 transition hover:-translate-y-1 hover:shadow-md"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white"><ClipboardCheck size={28} /></span><span><small className="text-sm font-bold text-emerald-600">جمع‌بندی نهایی</small><strong className="mt-1 block text-xl text-slate-900">آزمون آنلاین کل کتاب</strong><span className="mt-1 block text-sm text-slate-500">همه فصل‌های {book.title}</span></span><ChevronLeft className="mr-auto text-emerald-500 transition group-hover:-translate-x-1" /></Link>
      </div>
    );
  }

  const teaching = mode === 'teaching';
  const teachingItems = items.filter((item) => item.content_type?.slug === 'teaching');

  if (!teaching) {
    return (
      <div className="mt-7 space-y-3 border-t border-orange-100 pt-7">
        {chapters.map((chapter, index) => (
          <Link key={chapter.id} href={`/book/${book.id}?type=${mode}&chapter=${chapter.id}&grade_id=${grade.id}`} className="group flex min-h-20 items-center gap-4 rounded-2xl border border-orange-100 bg-white p-4 transition hover:border-orange-300 hover:shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 font-black text-orange-600">{toPersian(index + 1)}</span>
            <span><small className="font-black text-orange-500">نمونه‌سؤال فصل {toPersian(index + 1)}</small><strong className="mt-1 block text-lg text-slate-800">{chapter.title}</strong></span>
            <ChevronLeft className="mr-auto text-slate-300 transition group-hover:-translate-x-1" size={18} />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-7 border-t border-orange-100 pt-7">
      <div className="space-y-3">
        {isMath ? chapters.map((chapter, chapterIndex) => {
          const chapterSections = sections.filter((section) => section.chapter_id === chapter.id);
          const directItems = teachingItems.filter((item) => item.chapter_id === chapter.id && !item.section_id);
          const chapterQuizzes = quizSummary.chapter.filter((quiz) => quiz.chapter_id === chapter.id);
          return <TeachingUnit key={chapter.id} number={chapterIndex + 1} eyebrow={`تدریس فصل ${toPersian(chapterIndex + 1)}`} title={chapter.title}>
            {directItems.map((item, index) => <TeachingRow key={item.id} item={item} index={index + 1} href={`/book/${book.id}?type=teaching&chapter=${chapter.id}&grade_id=${grade.id}&content=${item.id}`} />)}
            {chapterSections.map((section, sectionIndex) => {
              const sectionItems = teachingItems.filter((item) => item.section_id === section.id);
              const sectionQuizzes = quizSummary.section.filter((quiz) => quiz.section_id === section.id);
              if (sectionItems.length === 0 && sectionQuizzes.length === 0) return null;
              return <details key={section.id} open className="group/section border-t border-slate-100 bg-slate-50/40">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3 marker:hidden sm:px-4"><span className="rounded-lg bg-white px-2.5 py-1 text-xs font-black text-slate-500">بخش {toPersian(sectionIndex + 1)}</span><strong className="flex-1 text-sm text-slate-700">{section.title}</strong><span className="text-xs font-bold text-violet-500 group-open/section:hidden">نمایش تدریس‌ها</span><span className="hidden text-xs font-bold text-slate-400 group-open/section:inline">بستن بخش</span><ChevronLeft size={18} className="rotate-90 text-slate-400 transition group-open/section:-rotate-90" /></summary>
                <div className="space-y-2 px-3 pb-3 sm:px-4 sm:pb-4">{sectionItems.map((item, index) => <TeachingRow key={item.id} item={item} index={index + 1} href={`/book/${book.id}?type=teaching&chapter=${chapter.id}&section=${section.id}&grade_id=${grade.id}&content=${item.id}`} />)}{sectionQuizzes.map((quiz) => <InlineQuizRow key={quiz.id} quiz={quiz} bookId={book.id} label="آزمون بخش" />)}</div>
              </details>;
            })}
            {chapterQuizzes.map((quiz) => <InlineQuizRow key={quiz.id} quiz={quiz} bookId={book.id} label="آزمون فصل" />)}
          </TeachingUnit>;
        }) : lessons.map(({ section, chapter }, lessonIndex) => {
          const lessonItems = teachingItems.filter((item) => item.section_id === section.id);
          const lessonQuizzes = quizSummary.section.filter((quiz) => quiz.section_id === section.id);
          const siblings = sections.filter((item) => item.chapter_id === chapter!.id);
          const isLastLesson = siblings.at(-1)?.id === section.id;
          const chapterQuizzes = isLastLesson ? quizSummary.chapter.filter((quiz) => quiz.chapter_id === chapter!.id) : [];
          const baseHref = `/book/${book.id}?type=teaching&chapter=${chapter!.id}&section=${section.id}&grade_id=${grade.id}`;
          return <TeachingUnit key={section.id} number={lessonIndex + 1} eyebrow={`تدریس درس ${section.title}`} title={section.title} subtitle={chapter!.title}>
            {lessonItems.map((item, index) => <TeachingRow key={item.id} item={item} index={index + 1} href={`${baseHref}&content=${item.id}`} />)}
            {lessonQuizzes.map((quiz) => <InlineQuizRow key={quiz.id} quiz={quiz} bookId={book.id} label="آزمون درس" displayTitle={`آزمون درس ${section.title}`} />)}
            {chapterQuizzes.map((quiz) => <InlineQuizRow key={quiz.id} quiz={quiz} bookId={book.id} label="آزمون فصل" />)}
          </TeachingUnit>;
        })}
      </div>
    </div>
  );
}

function TeachingUnit({ number, eyebrow, title, subtitle, children }: { number: number; eyebrow: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return <details open className="group/unit overflow-hidden rounded-2xl border border-violet-100 bg-white transition hover:border-violet-300 hover:shadow-md"><summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 p-4 marker:hidden"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 font-black text-violet-600">{toPersian(number)}</span><span className="flex-1"><small className="font-black text-violet-500">{eyebrow}</small><strong className="mt-1 block text-lg text-slate-800">{title}</strong>{subtitle && <span className="mt-1 block text-xs text-slate-400">{subtitle}</span>}</span><span className="text-xs font-bold text-violet-500 group-open/unit:hidden">نمایش آیتم‌ها</span><span className="hidden text-xs font-bold text-slate-400 group-open/unit:inline">بستن درس</span><ChevronLeft size={18} className="rotate-90 text-slate-400 transition group-open/unit:-rotate-90" /></summary><div className="space-y-2 border-t border-violet-50 bg-violet-50/20 p-3 sm:p-4">{children}</div></details>;
}

function TeachingRow({ item, index, href }: { item: ContentItem; index: number; href: string }) {
  return <Link href={href} className="group flex min-h-16 w-full items-center gap-3 rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-right transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-sm"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-600">{toPersian(index)}</span><Video size={18} className="shrink-0 text-violet-400" /><strong className="min-w-0 flex-1 text-sm text-slate-800 sm:text-base">{item.title}</strong>{item.page_number && <span className="shrink-0 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-sm font-black text-sky-700 shadow-sm sm:text-base">{formatPageLabel(item.page_number)}</span>}<ChevronLeft size={17} className="text-slate-300 transition group-hover:-translate-x-1" /></Link>;
}

function InlineQuizRow({ quiz, bookId, label, displayTitle }: { quiz: QuizSummaryItem; bookId: number; label: string; displayTitle?: string }) {
  const router = useRouter();
  const openQuiz = () => {
    const destination = `/quiz/${quiz.id}?book_id=${bookId}`;
    if (!getToken()) return router.push(`/login?redirect=${encodeURIComponent(destination)}`);
    // مقدار has_access در رندر اولیه سرور ممکن است به‌دلیل نبودن
    // توکن موقتاً false باشد؛ مرجع نهایی، API شروع آزمون است.
    router.push(destination);
  };
  return <button type="button" onClick={openQuiz} className="group flex min-h-16 w-full items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-right transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white"><ClipboardCheck size={20} /></span><span className="flex-1">{!displayTitle && <small className="font-black text-emerald-600">{label}</small>}<strong className="block text-base font-black text-slate-800 sm:text-lg">{displayTitle ?? quiz.title}</strong></span><span className="text-xs font-bold text-emerald-700">{toPersian(quiz.question_count)} سؤال</span><ChevronLeft size={17} className="text-emerald-400 transition group-hover:-translate-x-1" /></button>;
}

function formatPageLabel(value: string) {
  const normalized = value.trim();
  return /^صفحه/.test(normalized) ? normalized : `صفحه ${normalized}`;
}

function toPersian(value: number) {
  return String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}
