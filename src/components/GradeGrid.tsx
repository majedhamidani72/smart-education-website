'use client';

import Link from 'next/link';
import { Grade } from '@/types';
import {
  BookOpen,
  Pencil,
  Ruler,
  Backpack,
  BookMarked,
  Lightbulb,
  PenTool,
  FlaskConical,
  Atom,
  Calculator,
  Shapes,
  Award,
  type LucideIcon,
} from 'lucide-react';

interface Props {
  grades: Grade[];
  /** برای استفاده‌ی دوباره در مسیر «آزمون آنلاین» با مقصد متفاوت */
  basePath?: string;
}

/**
 * یک آیکون و رنگ اختصاصی برای هر پایه — همه از یک کتابخانه‌ی
 * واحد (lucide-react) با سبک خطی یکسان، نه اموجی پراکنده.
 */
const GRADE_STYLE: Record<number, { Icon: LucideIcon; bg: string; iconColor: string }> = {
  1: { Icon: Backpack, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  2: { Icon: Pencil, bg: 'bg-rose-50', iconColor: 'text-rose-600' },
  3: { Icon: PenTool, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  4: { Icon: Ruler, bg: 'bg-sky-50', iconColor: 'text-sky-600' },
  5: { Icon: BookOpen, bg: 'bg-teal-50', iconColor: 'text-teal-600' },
  6: { Icon: FlaskConical, bg: 'bg-violet-50', iconColor: 'text-violet-600' },
  7: { Icon: BookMarked, bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  8: { Icon: Lightbulb, bg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
  9: { Icon: Atom, bg: 'bg-fuchsia-50', iconColor: 'text-fuchsia-600' },
  10: { Icon: Calculator, bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  11: { Icon: Shapes, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  12: { Icon: Award, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
};

/**
 * جدول انتخاب پایه — به تفکیک ابتدایی (۱ تا ۶) و متوسطه (۷ تا
 * ۱۲)، چون مسیر بعدی هرکدام فرق دارد:
 * - ابتدایی: پایه → معلم → کتاب‌های همان معلم
 * - متوسطه: پایه → کتاب → (در صورت چند معلم) انتخاب معلم
 */
export default function GradeGrid({ grades, basePath = '/grade' }: Props) {
  const elementary = grades
    .filter((g) => g.grade_number <= 6)
    .sort((a, b) => a.grade_number - b.grade_number);

  const secondary = grades
    .filter((g) => g.grade_number > 6)
    .sort((a, b) => a.grade_number - b.grade_number);

  return (
    <div className="space-y-4">
      <GradeSection grades={elementary} basePath={basePath} />
      <GradeSection grades={secondary} basePath={basePath} />
    </div>
  );
}

function GradeSection({
  grades,
  basePath,
}: {
  grades: Grade[];
  basePath: string;
}) {
  if (grades.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {grades.map((grade) => {
        const style = GRADE_STYLE[grade.grade_number] ?? {
          Icon: BookOpen,
          bg: 'bg-gray-50',
          iconColor: 'text-gray-600',
        };
        const Icon = style.Icon;

        return (
          <Link
            key={grade.id}
            href={`${basePath}/${grade.id}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full transition group-hover:scale-105 ${style.bg}`}
            >
              <Icon size={30} strokeWidth={1.75} className={style.iconColor} />
            </span>
            <span className="text-base font-semibold text-gray-800">
              {grade.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
