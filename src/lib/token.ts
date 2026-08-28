/**
 * نگهداری توکن ورود روی مرورگر — ساده و محلی (localStorage).
 * این فایل جدا از auth.ts است تا api.ts بتواند بدون وابستگی
 * دوری، مستقیم از آن استفاده کند.
 */

const TOKEN_KEY = 'smart_education_token';
export const AUTH_CHANGED_EVENT = 'smart-education-auth-changed';

export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}
