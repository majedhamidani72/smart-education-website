import { apiFetch } from '@/lib/api';

export interface SendOtpResult {
  login_token: string;
}

export interface VerifyOtpResult {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string | null;
    mobile: string;
  };
}

export async function sendOtp(mobile: string): Promise<SendOtpResult> {
  return apiFetch<SendOtpResult>('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ mobile }),
  });
}

export async function verifyOtp(
  loginToken: string,
  code: string
): Promise<VerifyOtpResult> {
  return apiFetch<VerifyOtpResult>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ login_token: loginToken, code }),
  });
}

export async function resendOtp(loginToken: string): Promise<SendOtpResult> {
  return apiFetch<SendOtpResult>('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ login_token: loginToken }),
  });
}
