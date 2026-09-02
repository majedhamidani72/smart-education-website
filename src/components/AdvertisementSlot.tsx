'use client';
/* eslint-disable @next/next/no-img-element -- تصویر تبلیغ از دامنه قابل تنظیم API دریافت می‌شود. */

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Advertisement, AdvertisementPosition, getAdvertisements, recordAdvertisementClick, recordAdvertisementView } from '@/lib/advertisements';

export default function AdvertisementSlot({ position }: { position: AdvertisementPosition; compact?: boolean }) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      getAdvertisements(position).then((result) => {
        const nextAd = result.items[0] ?? null;
        if (active && nextAd) setAd(nextAd);
      }).catch(() => undefined);
    }, 4000);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [position]);

  useEffect(() => {
    if (!ad || !ref.current) return;

    let retrySound: (() => void) | null = null;
    void playSoftArrivalSound().then((played) => {
      if (played) return;
      retrySound = () => {
        void playSoftArrivalSound();
        if (retrySound) document.removeEventListener('pointerdown', retrySound);
      };
      document.addEventListener('pointerdown', retrySound, { once: true });
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        recordAdvertisementView(ad.id).catch(() => undefined);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (retrySound) document.removeEventListener('pointerdown', retrySound);
    };
  }, [ad]);

  if (!ad || dismissed) return null;

  function close() {
    setClosing(true);
    window.setTimeout(() => setDismissed(true), 480);
  }

  async function openDestination() {
    await recordAdvertisementClick(ad!.id).catch(() => undefined);
    if (ad!.link) window.open(ad!.link, '_blank', 'noopener,noreferrer');
  }

  return (
    <aside ref={ref} aria-label="تبلیغ" className={`${closing ? 'advertisement-slide-out pointer-events-none' : 'advertisement-slide-in'} fixed left-4 top-1/2 z-40 aspect-square w-44 overflow-hidden rounded-[1.4rem] border-2 border-white bg-white shadow-[0_18px_55px_rgba(15,23,42,.24)] sm:left-7 sm:w-64`}>
      <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-slate-950/70 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur">تبلیغ</span>
      <button type="button" onClick={close} aria-label="بستن تبلیغ" className="absolute left-2.5 top-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-rose-50 hover:text-rose-600"><X size={15} /></button>
      <button type="button" onClick={openDestination} className="group relative block h-full w-full text-right">
        <img src={ad.image} alt={ad.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent px-3 pb-3 pt-8 text-white sm:px-4 sm:pb-4">
          <strong className="line-clamp-2 block text-xs leading-5 sm:text-sm">{ad.title}</strong>
          {ad.link && <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-white/80 sm:text-[10px]">مشاهده <ExternalLink size={11} /></span>}
        </span>
      </button>
    </aside>
  );
}

let advertisementAudioContext: AudioContext | null = null;

async function playSoftArrivalSound(): Promise<boolean> {
  try {
    const AudioContextClass = window.AudioContext
      || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return false;

    const context = advertisementAudioContext ?? new AudioContextClass();
    advertisementAudioContext = context;
    if (context.state === 'suspended') await context.resume();
    if (context.state !== 'running') return false;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(820, now + 0.24);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.045);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.34);
    return true;
  } catch {
    // بعضی مرورگرها صدای خودکار را تا اولین تعامل کاربر مسدود می‌کنند.
    return false;
  }
}
