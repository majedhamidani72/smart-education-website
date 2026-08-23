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
      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        {teacher.name.charAt(0)}
      </div>
      <span className="font-medium text-gray-800">{teacher.name}</span>
    </Link>
  );
}
