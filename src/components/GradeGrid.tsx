'use client';

import Link from 'next/link';
import { Grade } from '@/types';

interface Props {
  grades: Grade[];
}

/**
 * برای هر پایه، یک نماد و یک رنگ اختصاصی — طرحی خودمان (نه کپی
 * مستقیم سایت‌های دیگر): هر پایه یک بج گرد رنگی دارد که نماد
 * داخلش را برجسته می‌کند، به‌جای یک آیکون تخت روی زمینه‌ی سفید.
 */
const GRADE_STYLE: Record<number, { icon: string; bg: string }> = {
  1: { icon: '🌱', bg: 'bg-emerald-100' },
  2: { icon: '🖍️', bg: 'bg-rose-100' },
  3: { icon: '🎨', bg: 'bg-amber-100' },
  4: { icon: '📐', bg: 'bg-sky-100' },
  5: { icon: '🌍', bg: 'bg-teal-100' },
  6: { icon: '🧪', bg: 'bg-violet-100' },
  7: { icon: '🚀', bg: 'bg-indigo-100' },
  8: { icon: '💡', bg: 'bg-yellow-100' },
  9: { icon: '🧬', bg: 'bg-fuchsia-100' },
  10: { icon: '📊', bg: 'bg-cyan-100' },
  11: { icon: '🔭', bg: 'bg-blue-100' },
  12: { icon: '🏆', bg: 'bg-orange-100' },
};

/**
 * جدول انتخاب پایه — به تفکیک ابتدایی (۱ تا ۶) و متوسطه (۷ تا
 * ۱۲)، چون مسیر بعدی هرکدام فرق دارد:
 * - ابتدایی: پایه → معلم → کتاب‌های همان معلم
 * - متوسطه: پایه → کتاب → (در صورت چند معلم) انتخاب معلم
 */
export default function GradeGrid({ grades }: Props) {
  const elementary = grades
    .filter((g) => g.grade_number <= 6)
    .sort((a, b) => a.grade_number - b.grade_number);

  const secondary = grades
    .filter((g) => g.grade_number > 6)
    .sort((a, b) => a.grade_number - b.grade_number);

  return (
    <div className="space-y-3">
      <GradeSection grades={elementary} />
      <GradeSection grades={secondary} />
    </div>
  );
}

function GradeSection({ grades }: { grades: Grade[] }) {
  if (grades.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {grades.map((grade) => {
          const style = GRADE_STYLE[grade.grade_number] ?? {
            icon: '📘',
            bg: 'bg-gray-100',
          };

          return (
            <Link
              key={grade.id}
              href={`/grade/${grade.id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-7 text-center transition hover:border-gray-200 hover:shadow-md"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl transition group-hover:scale-110 ${style.bg}`}
              >
                {style.icon}
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
