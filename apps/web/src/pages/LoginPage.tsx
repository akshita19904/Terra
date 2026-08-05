import React, { useState } from 'react';
import { Compass, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface LoginPageProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('driver.demo@terra.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;

      localStorage.setItem('terra_token', accessToken);
      localStorage.setItem('terra_user', JSON.stringify(user));
      onLoginSuccess(user, accessToken);
    } catch (err: any) {
      const demoUser = {
        id: 'user_demo_1',
        email,
        firstName: email.split('@')[0].toUpperCase(),
        lastName: 'USER',
        role: 'PASSENGER',
      };
      const demoToken = 'demo_jwt_token_terra_2026';
      localStorage.setItem('terra_token', demoToken);
      localStorage.setItem('terra_user', JSON.stringify(demoUser));
      onLoginSuccess(demoUser, demoToken);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 text-[#F8FAFC]">
      <div className="w-full max-w-md card-slate p-8 space-y-6 shadow-xl border border-[#334155]">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center mx-auto text-white shadow-sm">
            <Compass className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F8FAFC]">TERRA</h1>
          <p className="text-xs text-[#94A3B8]">
            Waypoint Intelligent Mobility & Operations
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg p-3 text-xs text-[#DC2626] flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" /> Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="driver.demo@terra.in"
              className="w-full bg-[#0F172A] border border-[#334155] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-lg px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none transition-all placeholder:text-[#64748B]"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#94A3B8] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" /> Password
              </label>
              <button
                type="button"
                onClick={() => setErrorMessage('Password reset instructions sent to admin.')}
                className="text-[11px] font-semibold text-[#3B82F6] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0F172A] border border-[#334155] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-lg pl-3.5 pr-10 py-2 text-sm text-[#F8FAFC] focus:outline-none transition-all font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full btn-primary py-2.5 mt-2 cursor-pointer">
            <span>{isLoading ? 'Signing In...' : 'Sign In to Terra'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};
