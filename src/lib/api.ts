/**
 * کلاینت مرکزی برای صحبت با بک‌اند لاراول.
 * --------------------------------------------------------------------
 * همه‌ی درخواست‌ها از همینجا رد می‌شوند — تا اگر بعداً نیاز به
 * افزودن هدر مشترک (مثلاً توکن ورود) یا مدیریت خطای یکسان پیدا
 * شد، فقط همین یک فایل عوض شود. اگر کاربر وارد شده باشد (توکن
 * روی مرورگرش ذخیره شده)، خودکار به هر درخواست اضافه می‌شود —
 * چه از Server Component بیاید (که آنجا توکنی نیست و بی‌خطر رد
 * می‌شود)، چه از Client Component.
 */

import { getToken } from '@/lib/token';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new ApiError(json.message ?? 'خطای غیرمنتظره رخ داد.', response.status);
  }

  return json.data;
}
