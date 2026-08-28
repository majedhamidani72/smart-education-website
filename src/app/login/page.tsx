'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resendOtp, sendOtp, verifyOtp } from '@/lib/auth';
import { saveToken } from '@/lib/token';
import { ApiError } from '@/lib/api';
import BackLink from '@/components/BackLink';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/';

  const [step, setStep] = useState<'mobile' | 'code'>('mobile');
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    if (step !== 'code' || secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, secondsLeft]);

  async function handleSendOtp() {
    setError(null);

    if (!/^09\d{9}$/.test(mobile)) {
      setError('شماره موبایل را درست وارد کن (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).');
      return;
    }

    setLoading(true);

    try {
      const result = await sendOtp(mobile);
      setLoginToken(result.login_token);
      setSecondsLeft(120);
      setStep('code');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (secondsLeft > 0 || !loginToken) return;
    setLoading(true);
    setError(null);
    try {
      const result = await resendOtp(loginToken);
      setLoginToken(result.login_token);
      setCode('');
      setSecondsLeft(120);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'ارسال مجدد کد با خطا مواجه شد.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError(null);

    if (!/^\d{6}$/.test(code)) {
      setError('کد ۶ رقمی را درست وارد کن.');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOtp(loginToken, code);
      saveToken(result.access_token);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'کد وارد شده اشتباه است.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <BackLink href="/">بازگشت</BackLink>

      <h1 className="mb-2 text-xl font-bold text-gray-900">ورود</h1>
      <p className="mb-6 text-sm text-gray-500">
        {step === 'mobile'
          ? 'شماره موبایلت رو وارد کن تا کد ورود برات پیامک بشه.'
          : `کدی که به ${mobile} پیامک شد رو وارد کن.`}
      </p>

      {step === 'mobile' ? (
        <div className="space-y-3">
          <input
            type="tel"
            inputMode="numeric"
            placeholder="09123456789"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-center text-lg tracking-widest"
            dir="ltr"
          />
          <div className={`rounded-lg px-4 py-2 text-center text-sm font-medium ${secondsLeft > 0 ? 'bg-violet-50 text-violet-700' : 'bg-red-50 text-red-600'}`}>
            {secondsLeft > 0
              ? `اعتبار کد: ${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`
              : 'اعتبار کد به پایان رسیده است.'}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full rounded-lg bg-violet-700 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? 'در حال ارسال...' : 'دریافت کد'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            placeholder="------"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-center text-2xl tracking-[0.5em]"
            dir="ltr"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={handleVerifyOtp}
            disabled={loading || secondsLeft === 0}
            className="w-full rounded-lg bg-violet-700 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? 'در حال بررسی...' : 'ورود'}
          </button>
          <button
            onClick={handleResendOtp}
            disabled={loading || secondsLeft > 0}
            className="w-full rounded-lg border border-violet-200 py-2.5 text-sm font-medium text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ارسال مجدد کد
          </button>
          <button
            onClick={() => setStep('mobile')}
            className="w-full text-sm text-gray-500"
          >
            تغییر شماره موبایل
          </button>
        </div>
      )}
    </div>
  );
}
