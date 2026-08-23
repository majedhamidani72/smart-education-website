import Link from 'next/link';
import { Teacher } from '@/types';

export default function TeacherCard({
  teacher,
  href,
}: {
  teacher: Teacher;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-teal-300 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700 transition group-hover:scale-105">
        {teacher.name.charAt(0)}
      </div>
      <span className="font-medium text-gray-800">{teacher.name}</span>
    </Link>
  );
}
