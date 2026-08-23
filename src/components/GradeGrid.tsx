'use client';

import Link from 'next/link';
import { Grade } from '@/types';

interface Props {
  grades: Grade[];
}

/**
 * یک آیکون رنگی مجزا برای هر پایه — دقیقاً همان الگویی که سایت
 * همیار برای پایه‌ها استفاده می‌کند؛ نه شماره‌ی خشک، یک نماد
 * دوستانه و به‌یادماندنی.
 */
const GRADE_ICONS: Record<number, string> = {
  1: '📚',
  2: '✏️',
  3: '🎨',
  4: '📐',
  5: '🌍',
  6: '🧪',
  7: '🎓',
  8: '💡',
  9: '🧬',
  10: '➗',
  11: '🔬',
  12: '📖',
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
    <div className="space-y-8">
      <GradeSection title="دوره‌ی ابتدایی" grades={elementary} />
      <GradeSection title="دوره‌ی متوسطه" grades={secondary} />
    </div>
  );
}

function GradeSection({
  title,
  grades,
}: {
  title: string;
  grades: Grade[];
}) {
  if (grades.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-sm text-gray-400">{title}</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {grades.map((grade) => (
          <Link
            key={grade.id}
            href={`/grade/${grade.id}`}
            className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white py-5 text-center transition hover:border-gray-200 hover:shadow-md"
          >
            <span className="text-3xl transition group-hover:scale-110">
              {GRADE_ICONS[grade.grade_number] ?? '📘'}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {grade.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
