'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, MessageSquareText, Phone, Send } from 'lucide-react';
import BackLink from '@/components/BackLink';
import { apiFetch, ApiError } from '@/lib/api';

const subjects = ['پشتیبانی آموزشی', 'مشکل فنی', 'خرید و پرداخت', 'همکاری با درسکا', 'پیشنهاد یا انتقاد', 'سایر موارد'];
const fieldClass = 'flex flex-col gap-2 text-sm font-bold text-slate-700';
const inputClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100';

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setSuccess('');
    setError('');
    const form = event.currentTarget;
    const values = new FormData(form);

    try {
      await apiFetch<null>('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: values.get('name'),
          mobile: values.get('mobile'),
          email: values.get('email') || null,
          subject: values.get('subject'),
          message: values.get('message'),
        }),
      });
      setSuccess('پیام شما با موفقیت ارسال شد. در اولین فرصت با شما تماس می‌گیریم.');
      form.reset();
    } catch (exception) {
      setError(exception instanceof ApiError ? exception.message : 'ارسال پیام انجام نشد. کمی بعد دوباره تلاش کنید.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="bg-gradient-to-b from-orange-50/70 via-white to-white px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <BackLink href="/">بازگشت به خانه</BackLink>
        <div className="mt-7 grid overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-xl shadow-orange-100/40 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="bg-gradient-to-br from-orange-500 to-rose-500 p-7 text-white sm:p-10">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><MessageSquareText size={28} /></span>
            <h1 className="mt-6 text-3xl font-black">تماس با ما</h1>
            <p className="mt-4 text-sm leading-8 text-orange-50">سؤال، پیشنهاد یا مشکلتان را برای ما بنویسید. پیام شما مستقیم برای مدیریت درسکا ایمیل می‌شود.</p>
            <div className="mt-9 space-y-4 border-t border-white/20 pt-7 text-sm">
              <p className="flex items-center gap-3"><Phone size={19} /> پاسخ‌گویی با شماره‌ای که ثبت می‌کنید</p>
              <p className="flex items-center gap-3"><Mail size={19} /> ارسال مستقیم به واحد پشتیبانی</p>
            </div>
          </aside>
          <section className="p-6 sm:p-10">
            <h2 className="text-xl font-black text-slate-900">پیامتان را بنویسید</h2>
            <p className="mt-2 text-sm text-slate-500">فیلدهای ستاره‌دار الزامی هستند.</p>
            <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className={fieldClass}>نام و نام خانوادگی *<input className={inputClass} name="name" required maxLength={100} placeholder="مثلاً علی رضایی" /></label>
              <label className={fieldClass}>شماره موبایل *<input className={inputClass} name="mobile" required inputMode="numeric" dir="ltr" pattern="09[0-9]{9}" maxLength={11} placeholder="09123456789" /></label>
              <label className={fieldClass}>ایمیل (اختیاری)<input className={inputClass} name="email" type="email" dir="ltr" maxLength={150} placeholder="name@gmail.com" /></label>
              <label className={fieldClass}>موضوع *<select className={inputClass} name="subject" required defaultValue=""><option value="" disabled>انتخاب موضوع</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
              <label className={fieldClass + ' sm:col-span-2'}>متن پیام *<textarea className={inputClass + ' resize-y leading-7'} name="message" required minLength={10} maxLength={5000} rows={6} placeholder="چطور می‌توانیم کمکتان کنیم؟" /></label>
              {success && <div className="sm:col-span-2 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700"><CheckCircle2 size={20} />{success}</div>}
              {error && <div className="sm:col-span-2 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
              <button disabled={sending} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-orange-500 to-rose-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
                <Send size={19} /> {sending ? 'در حال ارسال...' : 'ارسال پیام'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
