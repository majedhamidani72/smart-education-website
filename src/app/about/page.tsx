import BackLink from '@/components/BackLink';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <BackLink href="/">بازگشت</BackLink>

      <h1 className="mb-6 text-2xl font-extrabold text-gray-900">
        درباره‌ی درسکا
      </h1>

      <div className="space-y-4 text-base leading-8 text-gray-700">
        <p>
          درسکا یک پلتفرم آموزشی برای دانش‌آموزان مدارس ایران است —
          از پایه‌ی اول ابتدایی تا پایه‌ی دوازدهم.
        </p>
        <p>
          هدف ما این است که محتوای آموزشی مطابق کتاب درسی، تدریس ویدیویی،
          نمونه سوال، و آزمون آنلاین را در یک‌جا و به‌شکلی ساده در دسترس
          دانش‌آموزان بگذاریم.
        </p>
        <p>
          هر معلم مستقیم محتوای خودش را در پلتفرم منتشر می‌کند و دانش‌آموز
          می‌تواند پیش از هر خریدی، بخشی از محتوا را رایگان امتحان کند.
        </p>
      </div>
    </div>
  );
}
