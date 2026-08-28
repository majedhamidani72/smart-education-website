import { apiFetch } from '@/lib/api';
export type AdvertisementPosition = 'home' | 'book' | 'lesson' | 'quiz' | 'profile';
export interface Advertisement { id: number; title: string; image: string; link?: string; }
export const getAdvertisements = (position: AdvertisementPosition) => apiFetch<{ items: Advertisement[] }>(`/advertisements?position=${position}`);
export const recordAdvertisementView = (id: number) => apiFetch<{ recorded: boolean }>(`/advertisements/${id}/view`, { method: 'POST' });
export const recordAdvertisementClick = (id: number) => apiFetch<{ url?: string }>(`/advertisements/${id}/click`, { method: 'POST' });
