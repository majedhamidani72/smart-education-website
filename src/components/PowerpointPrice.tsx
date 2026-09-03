import { Powerpoint } from '@/lib/powerpoints';

/** درصد تخفیفِ واقعی را مستقل از فیلد discount_percent سرور حساب می‌کند. */
export function getDiscountPercent(item: Powerpoint): number {
  if (item.price <= item.final_price) return 0;
  return item.discount_percent > 0
    ? item.discount_percent
    : Math.round(((item.price - item.final_price) / item.price) * 100);
}

/** روبان «٪X تخفیف» که روی تصویر کارت/جلد پاورپوینت قرار می‌گیرد. */
export function DiscountRibbon({ item, className }: { item: Powerpoint; className: string }) {
  const percent = getDiscountPercent(item);
  if (percent <= 0) return null;
  return <span className={className}>{percent.toLocaleString('fa-IR')}٪ تخفیف</span>;
}

/**
 * نمایش قیمتِ یک پاورپوینت.
 * --------------------------------------------------------------------
 * اگر قیمت نهایی صفر باشد (چه با قیمت اصلیِ صفر، چه با ۱۰۰٪ تخفیف)،
 * به‌جای «۰ تومان» عبارت «رایگان» نشان داده می‌شود. اگر تخفیفی در کار
 * باشد، قیمت اصلی با خط‌خورده و درصد تخفیف داخل پرانتز کنارش می‌آید —
 * مثلاً: «۴۵,۰۰۰ تومان (٪۱۰۰) رایگان».
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
  const percent = getDiscountPercent(item);
  const hasDiscount = percent > 0;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {hasDiscount && (
        <span className={originalPriceClassName}>
          <del>{item.price.toLocaleString('fa-IR')} تومان</del>
          {' '}
          (٪{percent.toLocaleString('fa-IR')})
        </span>
      )}
      <strong className={finalPriceClassName}>
        {isFree ? 'رایگان' : `${item.final_price.toLocaleString('fa-IR')} تومان`}
      </strong>
    </div>
  );
}
