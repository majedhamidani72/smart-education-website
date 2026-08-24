import { apiFetch } from '@/lib/api';

export interface Purchase {
  id: number;
}

export async function createPurchase(planIds: number[]): Promise<Purchase> {
  return apiFetch<Purchase>('/purchases', {
    method: 'POST',
    body: JSON.stringify({ plan_ids: planIds }),
  });
}

export interface PaymentRequestResult {
  payment_url: string;
}

export async function requestPayment(
  purchaseId: number
): Promise<PaymentRequestResult> {
  return apiFetch<PaymentRequestResult>(`/payments/request/${purchaseId}`, {
    method: 'POST',
  });
}
