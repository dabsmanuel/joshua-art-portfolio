'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { handleApiError } from '../../../utils/errorHandler';
import type { TypedApiError } from '../../../types/error';

interface LoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoginLoading, loginError, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    // Errors are reported by the useAuth hook
    login({
      email: formData.email,
      password: formData.password,
    });
  };

  const fieldClass =
    'w-full border border-rule bg-white px-4 py-3 text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none';

  return (
    <div className="grid min-h-screen bg-wall lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden flex-col justify-between bg-charcoal p-12 text-mat lg:flex">
        <Link href="/" className="font-display text-xl font-semibold">
          Joshua Otuonye
        </Link>
        <div>
          <p className="label mb-4 !text-mat/50">Studio admin</p>
          <p className="max-w-sm font-display text-4xl font-semibold leading-tight">
            Manage the work, the shows and the messages in one place.
          </p>
        </div>
        <Link href="/" className="label !text-mat/50 hover:!text-mat">
          Back to the public site
        </Link>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="label mb-4 lg:hidden">Studio admin</p>
          <h1 className="text-4xl font-semibold">Sign in</h1>
          <p className="mt-3 text-lead">Use your admin account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label htmlFor="email" className="label mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={fieldClass}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${fieldClass} pr-12`}
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-lead hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="border border-dot/40 bg-dot/5 p-3 text-sm text-dot" role="alert">
                {handleApiError(loginError as TypedApiError)}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoginLoading || !formData.email || !formData.password}
              className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-3.5 text-sm font-medium text-mat transition-colors hover:bg-lead disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoginLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-mat/40 border-t-mat" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
