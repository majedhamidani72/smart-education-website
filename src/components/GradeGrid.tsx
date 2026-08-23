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
    <div className="space-y-6">
      <GradeSection
        title="دوره‌ی ابتدایی"
        subtitle="اول تا ششم — با انتخاب معلم"
        icon="📗"
        grades={elementary}
        accent="teal"
      />
      <GradeSection
        title="دوره‌ی متوسطه"
        subtitle="هفتم تا دوازدهم — با انتخاب درس"
        icon="🎓"
        grades={secondary}
        accent="purple"
      />
    </div>
  );
}

const ACCENTS = {
  teal: {
    section: 'bg-teal-50/60 border-teal-100',
    badge: 'bg-teal-600 text-white',
    card: 'bg-white border-teal-100 hover:border-teal-300 hover:shadow-md',
    title: 'text-teal-900',
  },
  purple: {
    section: 'bg-purple-50/60 border-purple-100',
    badge: 'bg-purple-600 text-white',
    card: 'bg-white border-purple-100 hover:border-purple-300 hover:shadow-md',
    title: 'text-purple-900',
  },
} as const;

function GradeSection({
  title,
  subtitle,
  icon,
  grades,
  accent,
}: {
  title: string;
  subtitle: string;
  icon: string;
  grades: Grade[];
  accent: keyof typeof ACCENTS;
}) {
  if (grades.length === 0) return null;

  const colors = ACCENTS[accent];

  return (
    <section className={`rounded-2xl border p-5 ${colors.section}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <div>
          <h2 className={`font-bold ${colors.title}`}>{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {grades.map((grade) => (
          <Link
            key={grade.id}
            href={`/grade/${grade.id}`}
            className={`group flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${colors.card}`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition group-hover:scale-105 ${colors.badge}`}
            >
              {grade.grade_number}
            </span>
            <span className="text-sm font-medium text-gray-800">
              {grade.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
