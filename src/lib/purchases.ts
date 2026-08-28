import { apiFetch } from '@/lib/api';

export interface Purchase {
  id: number;
  invoice_number?: string;
  payable_amount?: number;
  status?: string;
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
  purchaseId: number,
  returnTo: string
): Promise<PaymentRequestResult> {
  return apiFetch<PaymentRequestResult>(`/payments/request/${purchaseId}`, {
    method: 'POST',
    body: JSON.stringify({ return_to: returnTo }),
  });
}

export async function completeTestPayment(purchaseId: number): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/payments/test-complete/${purchaseId}`, {
    method: 'POST',
  });
}

export async function failTestPayment(purchaseId: number): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/payments/test-fail/${purchaseId}`, {
    method: 'POST',
  });
}

export async function getPurchase(purchaseId: number): Promise<Purchase> {
  return apiFetch<Purchase>(`/purchases/${purchaseId}`);
}

export async function getPaymentMode(): Promise<'test' | 'real'> {
  const result = await apiFetch<{ mode: 'test' | 'real' }>('/payment/mode');
  return result.mode;
}
