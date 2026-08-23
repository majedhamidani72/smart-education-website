'use client';

import Link from 'next/link';
import { Grade } from '@/types';

interface Props {
  grades: Grade[];
}

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
      <GradeRow title="ابتدایی" grades={elementary} basePath="/grade" colorClass="bg-teal-50 text-teal-800 hover:bg-teal-100" />
      <GradeRow title="متوسطه" grades={secondary} basePath="/grade" colorClass="bg-purple-50 text-purple-800 hover:bg-purple-100" />
    </div>
  );
}

function GradeRow({
  title,
  grades,
  basePath,
  colorClass,
}: {
  title: string;
  grades: Grade[];
  basePath: string;
  colorClass: string;
}) {
  if (grades.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-sm text-gray-400">{title}</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {grades.map((grade) => (
          <Link
            key={grade.id}
            href={`${basePath}/${grade.id}`}
            className={`rounded-xl py-4 text-center font-medium transition ${colorClass}`}
          >
            {grade.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
