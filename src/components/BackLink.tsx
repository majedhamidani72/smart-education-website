import Link from 'next/link';

export default function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
    >
      ← {children}
    </Link>
  );
}
