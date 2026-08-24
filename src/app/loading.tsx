/**
 * Loading UI سراسری — Next.js این را خودکار نشان می‌دهد وقتی هر
 * صفحه (Server Component) در حال گرفتن داده از بک‌اند است. طرح
 * آن تقریباً همان چیدمان صفحات واقعی است (هدر تیره + شبکه‌ی
 * کارت) تا هنگام بارگذاری، صفحه به‌شدت جابه‌جا نشود.
 */
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-40 bg-gray-100" />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mx-auto mb-8 h-8 w-56 rounded bg-gray-100" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
