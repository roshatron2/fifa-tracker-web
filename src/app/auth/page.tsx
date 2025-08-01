'use client';

import { TrophyIcon } from '@/components/Icons';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f1419] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render auth page if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await signIn(formData.username, formData.password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const success = await signUp(
        formData.first_name,
        formData.last_name,
        formData.email,
        formData.password,
        formData.username
      );
      if (success) {
        router.push('/');
      } else {
        setError('Failed to create account');
      }
    } catch {
      setError('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white flex flex-col">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <TrophyIcon className="text-yellow-400 w-8 h-8" />
          <h1 className="text-3xl font-bold">FIFA Tracker</h1>
        </div>
        <p className="text-gray-300">
          Track your FIFA matches and tournaments with friends.
        </p>
      </header>

      {/* Main Content */}
      <div className="flex justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-[#1a1f2e] rounded-lg p-8">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome</h2>
              <p className="text-gray-400">
                Sign in to your account or create a new one
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-[#2d3748] rounded-lg p-1 mb-6">
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isSignIn
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isSignIn
                    ? 'bg-green-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Sign In Form */}
            {isSignIn && (
              <LoginForm
                onSubmit={handleSignIn}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                formData={{
                  username: formData.username,
                  password: formData.password,
                }}
              />
            )}

            {/* Sign Up Form */}
            {!isSignIn && (
              <RegisterForm
                onSubmit={handleSignUp}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                formData={formData}
              />
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1f2e] text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-[#2d3748] border border-gray-600 rounded-lg py-3 px-4 text-white hover:bg-[#374151] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#2d3748] border border-gray-600 rounded-lg py-3 px-4 text-white hover:bg-[#374151] transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 px-4">
        <p className="text-gray-400 text-sm">
          © 2024 FIFA Tracker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
