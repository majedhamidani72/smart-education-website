import BackLink from '@/components/BackLink';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <BackLink href="/">بازگشت</BackLink>

      <h1 className="mb-6 text-2xl font-extrabold text-gray-900">
        تماس با ما
      </h1>

      <p className="text-base leading-8 text-gray-700">
        راه‌های ارتباطی مستقیم (تلفن، ایمیل، شبکه‌های اجتماعی) به‌زودی
        اینجا اضافه می‌شود.
      </p>
    </div>
  );
}
