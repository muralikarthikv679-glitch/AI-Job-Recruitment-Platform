import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackendStatusAlert from '../components/BackendStatusAlert';
import { Layers, Lock, Mail, ArrowRight, AlertCircle, Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsNetworkError(false);
    setLoading(true);

    try {
      const user = await login(email.trim().toLowerCase(), password);
      if (user.role === 'CANDIDATE') {
        navigate('/candidate/dashboard');
      } else if (user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' && !err.response.data.includes('<!DOCTYPE') ? err.response.data : null);

      if (serverMsg) {
        setError(serverMsg);
        setIsNetworkError(false);
      } else if (err.code === 'ERR_NETWORK' || !err.response || err.message?.includes('Network Error')) {
        setError('Unable to reach backend service. The cloud backend may be waking up (takes ~30s on free tier).');
        setIsNetworkError(true);
      } else {
        setError('Invalid email or password');
        setIsNetworkError(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsNetworkError(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign in to TalentFlow
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Access your recruitment pipeline, match scores, and application tracking
          </p>
        </div>

        {/* Backend Connection Alert if network error */}
        {isNetworkError && (
          <BackendStatusAlert
            error={error}
            onRetry={() => handleLogin()}
          />
        )}

        {/* Demo Fast Login Selector */}
        <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Select Demo Account:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('candidate1@gmail.com', 'candidate123')}
              className="py-2 px-2 text-[11px] font-semibold rounded-xl bg-slate-800 text-slate-200 hover:bg-indigo-600 hover:text-white border border-slate-700 transition-all text-center"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('recruiter@google.com', 'recruiter123')}
              className="py-2 px-2 text-[11px] font-semibold rounded-xl bg-slate-800 text-slate-200 hover:bg-purple-600 hover:text-white border border-slate-700 transition-all text-center"
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@talentflow.io', 'admin123')}
              className="py-2 px-2 text-[11px] font-semibold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all text-center"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {error && !isNetworkError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300">
                Register here
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
