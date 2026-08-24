import { apiFetch } from '@/lib/api';

export interface Plan {
  id: number;
  title: string;
  description: string | null;
  planable_type: string;
  planable_id: number;
  price: number;
  discount_price: number | null;
  final_price: number;
  discount_percent: number | null;
  purchase_type: string;
  duration_days: number | null;
}

export async function getActivePlans(): Promise<Plan[]> {
  return apiFetch<Plan[]>('/plans/active');
}

/**
 * پلن‌های مرتبط با یک کتاب مشخص — چون API فیلتر سمت سرور ندارد،
 * از بین همه‌ی پلن‌های فعال، آن‌هایی که planable دقیقاً همین
 * کتاب است انتخاب می‌شوند.
 */
export function filterPlansForBook(plans: Plan[], bookId: number): Plan[] {
  return plans.filter(
    (p) => p.planable_type.endsWith('Book') && p.planable_id === bookId
  );
}
