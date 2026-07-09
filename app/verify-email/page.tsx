'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/auth-store';
import { Navbar } from '@/app/components/Navbar';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState(searchParams.get('password') || '');
  const [username, setUsername] = useState(searchParams.get('username') || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email || !password || !username) {
      router.push('/register');
    }
  }, [email, password, username, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setErrors({ submit: 'Please enter the full 6-digit OTP' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authAPI.verifyEmailOTP({ email, otp: otpValue });

      const loginResponse = await authAPI.login({
        username,
        password,
      });

      const { token, user } = loginResponse.data;
      setAuth(user, token);
      router.push('/recipes');
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setErrors({});
    setMessage('');

    try {
      await authAPI.sendVerificationOTP(email);
      setMessage('OTP resent successfully!');
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to resend OTP',
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-light flex items-center justify-center p-4">
        <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-dark mb-2 text-center">Verify Your Email</h1>
          <p className="text-center text-gray-600 mb-6">
            We've sent a 6-digit OTP to {email}
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700 text-center">
                {errors.submit}
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-100 border border-green-400 rounded text-green-700 text-center">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-primary font-bold hover:underline disabled:opacity-50"
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>

          <p className="text-center text-gray-600 mt-6">
            <Link href="/register" className="text-primary font-bold hover:underline">
              Back to Registration
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
