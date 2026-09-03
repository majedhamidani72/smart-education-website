import { Powerpoint } from '@/lib/powerpoints';

/** روبان «٪X تخفیف» که روی تصویر کارت/جلد پاورپوینت قرار می‌گیرد — کاملاً بر پایه‌ی discount_percentِ بک‌اند. */
export function DiscountRibbon({ item, className }: { item: Powerpoint; className: string }) {
  if (item.discount_percent <= 0) return null;
  return <span className={className}>{item.discount_percent.toLocaleString('fa-IR')}٪ تخفیف</span>;
}

/**
 * نمایش قیمتِ یک پاورپوینت.
 * --------------------------------------------------------------------
 * تمام محاسبات (قیمت نهایی، درصد تخفیف) از بک‌اند می‌آید؛ این کامپوننت
 * فقط همان مقادیر را نمایش می‌دهد و هیچ محاسبه‌ای خودش انجام نمی‌دهد —
 * چون همین بک‌اند قرار است پایه‌ی اپ موبایل هم باشد و منطق قیمت‌گذاری
 * باید فقط در یک جا (سرور) وجود داشته باشد.
 *
 * اگر final_price صفر باشد، به‌جای «۰ تومان» «رایگان» نشان داده می‌شود.
 * اگر discount_percent بزرگ‌تر از صفر باشد، قیمت اصلی خط‌خورده و درصد
 * تخفیف داخل پرانتز کنارش می‌آید — مثلاً: «۴۵,۰۰۰ تومان (٪۱۰۰) رایگان».
 */
export default function PowerpointPrice({
  item,
  finalPriceClassName = 'text-base font-black text-indigo-700',
  originalPriceClassName = 'text-xs text-slate-400',
}: {
  item: Powerpoint;
  finalPriceClassName?: string;
  originalPriceClassName?: string;
}) {
  const isFree = item.final_price === 0;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {item.discount_percent > 0 && (
        <span className={originalPriceClassName}>
          <del>{item.price.toLocaleString('fa-IR')} تومان</del>
          {' '}
          (٪{item.discount_percent.toLocaleString('fa-IR')})
        </span>
      )}
      <strong className={finalPriceClassName}>
        {isFree ? 'رایگان' : `${item.final_price.toLocaleString('fa-IR')} تومان`}
      </strong>
    </div>
  );
}
