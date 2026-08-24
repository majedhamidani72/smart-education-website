'use client';

import { AlertTriangle } from 'lucide-react';

/**
 * Error Boundary سراسری — Next.js این کامپوننت را خودکار به‌جای
 * صفحه‌ی خام و پیش‌فرض خودش نشان می‌دهد، هر وقت هرکدام از
 * صفحات (پایه، کتاب، معلم و ...) موقع گرفتن داده از بک‌اند به
 * خطا بخورند.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mb-2 text-lg font-bold text-gray-900">
        دریافت اطلاعات با مشکل مواجه شد
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        مطمئن شو به اینترنت وصلی و بک‌اند روشن است، بعد دوباره تلاش کن.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-violet-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800"
      >
        تلاش مجدد
      </button>
    </div>
  );
}
