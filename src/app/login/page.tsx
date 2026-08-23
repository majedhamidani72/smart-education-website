'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendOtp, verifyOtp } from '@/lib/auth';
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
      setStep('code');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'خطایی رخ داد.');
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white disabled:opacity-50"
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
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? 'در حال بررسی...' : 'ورود'}
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
