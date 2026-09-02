import { Powerpoint } from '@/lib/powerpoints';

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
