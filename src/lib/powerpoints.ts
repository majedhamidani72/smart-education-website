import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1';

export interface Powerpoint {
  id: number; title: string; description?: string; preview_image?: string; price: number;
  discount_price?: number; final_price: number; discount_percent: number; slides_count?: number;
  owned: boolean; grade: { id: number; title?: string }; book: { id: number; title?: string };
  chapter: { id: number; title?: string };
}

export interface PowerpointOrder {
  id: number; invoice_number: string; status: string; payable_amount: number;
  created_at: string; powerpoint: { id: number; title: string };
}

export async function getPowerpoints() {
  return apiFetch<{ items: Powerpoint[]; count: number }>('/powerpoints');
}

export async function buyPowerpoint(id: number) {
  return apiFetch<{ purchase_id: number; invoice_number: string; payable_amount: number }>(`/powerpoints/${id}/purchase`, {
    method: 'POST', body: JSON.stringify({ accepted_license: true }),
  });
}

export async function getPowerpointOrders() {
  return apiFetch<{ items: PowerpointOrder[] }>('/powerpoints/orders');
}

export async function cancelPowerpointOrder(id: number) {
  return apiFetch<{ cancelled: boolean }>(`/powerpoints/purchases/${id}/cancel`, { method: 'DELETE' });
}

export async function downloadPowerpoint(item: Powerpoint) {
  const response = await fetch(`${API_BASE_URL}/powerpoints/${item.id}/download`, {
    headers: { Accept: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', Authorization: `Bearer ${getToken() ?? ''}` },
  });
  if (!response.ok) throw new Error('دریافت فایل انجام نشد. لطفاً دوباره تلاش کنید.');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = `${item.title}.pptx`; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
