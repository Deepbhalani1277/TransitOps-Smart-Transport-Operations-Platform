import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/services/authService';
import ErrorAlert from '../components/ui/ErrorAlert';
import FormField from '../components/ui/FormField';
import type { UserRole } from '../types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Fleet Manager');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Lockout tracking
  const [failedCount, setFailedCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Role branding access definitions
  const roleBranding = {
    'Fleet Manager': 'Full platform administrative privileges. Manage registry, operators, dispatches, maintenance and analytics.',
    'Dispatcher': 'Create trip drafts, assign operators, validate load requirements, and live dispatch routes.',
    'Safety Officer': 'Audit operator safety scores, license expirations, and verify vehicle maintenance logs.',
    'Financial Analyst': 'Access operational cost audits, fuel tracking tables, expense records, and export reports.',
  };

  useEffect(() => {
    let timer: any;
    if (isLocked && lockoutTimeLeft > 0) {
      timer = setTimeout(() => {
        setLockoutTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (lockoutTimeLeft === 0 && isLocked) {
      setIsLocked(false);
      setFailedCount(0);
      setErrorMsg('');
    }
    return () => clearTimeout(timer);
  }, [isLocked, lockoutTimeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Store sandbox role choice
      localStorage.setItem('sandbox_role', selectedRole);

      // POST login
      const tokenResponse = await authService.login({ email, password });
      
      // Store token temporarily to fetch "me" profile info
      localStorage.setItem('token', tokenResponse.access_token);
      
      // Fetch user details
      const userProfile = await authService.getMe();
      
      // Update Context
      login(tokenResponse.access_token, userProfile, rememberMe);
      
      // Reset attempts
      setFailedCount(0);
      
      navigate('/dashboard');
    } catch (err: any) {
      // Clear token in case we stored a partial one
      localStorage.removeItem('token');
      
      const count = failedCount + 1;
      setFailedCount(count);

      let message = 'Invalid email or password.';
      if (err.response && err.response.data && err.response.data.detail) {
        message = err.response.data.detail;
      }

      if (count >= 5) {
        setIsLocked(true);
        setLockoutTimeLeft(30); // 30 seconds lockout
        setErrorMsg('Too many failed attempts. You have been locked out for 30 seconds.');
      } else {
        setErrorMsg(`${message} Failed attempts: ${count}/5`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Left panel: Branding info */}
      <div className="hidden lg:flex lg:w-1/2 bg-panel border-r border-gray-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="space-y-4 z-10">
          <span className="text-2xl font-black text-accent tracking-widest">TransitOps</span>
          <h1 className="text-4xl font-extrabold text-gray-100 tracking-tight leading-tight mt-12">
            Smart Transport Operations Platform
          </h1>
          <p className="text-gray-400 text-sm max-w-md">
            Manage fleets, dispatch routes, audit safety metrics, and run cost analytics from a unified dark workspace.
          </p>
        </div>

        {/* Role highlight box */}
        <div className="bg-bg/40 border border-gray-800 p-6 rounded-lg space-y-3 max-w-md z-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
            Role Scope Preview
          </h3>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            className="w-full bg-panel border border-gray-800 text-sm rounded-md px-3 py-1.5 text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="Fleet Manager">Fleet Manager</option>
            <option value="Dispatcher">Dispatcher</option>
            <option value="Safety Officer">Safety Officer</option>
            <option value="Financial Analyst">Financial Analyst</option>
          </select>
          <p className="text-xs text-gray-400 leading-relaxed min-h-[50px] transition-all">
            {roleBranding[selectedRole]}
          </p>
        </div>

        <div className="text-[10px] text-gray-600 font-medium z-10">
          &copy; {new Date().getFullYear()} TransitOps Inc. All rights reserved.
        </div>
      </div>

      {/* Right panel: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-105 text-gray-100 tracking-tight">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Access your workspace using your email address.
            </p>
          </div>

          {errorMsg && <ErrorAlert message={errorMsg} onDismiss={() => setErrorMsg('')} />}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormField label="Email address" required>
              <input
                type="email"
                required
                disabled={isLocked || loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@transitops.com"
                className="w-full rounded-md border border-gray-800 bg-panel px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:border-accent focus:outline-none disabled:opacity-50"
              />
            </FormField>

            <FormField label="Password" required>
              <input
                type="password"
                required
                disabled={isLocked || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-800 bg-panel px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:border-accent focus:outline-none disabled:opacity-50"
              />
            </FormField>

            {/* Role dropdown for mockup layout / branding context */}
            <FormField label="Role Selection (Workspace Branding)">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                disabled={isLocked || loading}
                className="w-full rounded-md border border-gray-800 bg-panel px-3.5 py-2.5 text-sm text-gray-300 focus:border-accent focus:outline-none disabled:opacity-50"
              >
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </FormField>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isLocked || loading}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-800 bg-panel text-accent focus:ring-accent"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLocked || loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-accent hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocked
                ? `Locked Out (${lockoutTimeLeft}s)`
                : loading
                ? 'Authenticating...'
                : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
