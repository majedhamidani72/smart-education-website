/**
 * کلاینت مرکزی برای صحبت با بک‌اند لاراول.
 * --------------------------------------------------------------------
 * همه‌ی درخواست‌ها از همینجا رد می‌شوند — تا اگر بعداً نیاز به
 * افزودن هدر مشترک (مثلاً توکن ورود) یا مدیریت خطای یکسان پیدا
 * شد، فقط همین یک فایل عوض شود.
 */

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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new ApiError(json.message ?? 'خطای غیرمنتظره رخ داد.', response.status);
  }

  return json.data;
}
