'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InputField } from '@/app/components/FormFields';
import { authAPI } from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/auth-store';
import { Navbar } from '@/app/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      setAuth(user, token);
      router.push('/recipes');
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Login failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-light flex items-center justify-center p-4">
        <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-dark mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(value) => handleChange('username', value)}
              error={errors.username}
              required
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              required
            />
            {errors.submit && (
              <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700">
                {errors.submit}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
