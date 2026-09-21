import React, { useState } from 'react';
import { Container, ShieldCheck, Lock, User, ArrowRight, Anchor, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { AuthUser } from '../types';

interface LoginFormProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('khoiri');
  const [password, setPassword] = useState('suta');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = (uName: string, dName: string, role: string) => {
    const user: AuthUser = {
      username: uName,
      displayName: dName,
      role: role,
      terminalCode: 'TPK-PRIOK-01',
      isLoggedIn: true
    };
    try {
      localStorage.setItem('portops_auth_token', 'khoiri_suta_valid_session');
      localStorage.setItem('portops_auth_v1', JSON.stringify(user));
      localStorage.setItem('portops_auth_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Storage unavailable in this environment', e);
    }
    onLoginSuccess(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      // Required Admin credentials: username ( khoiri ) dan password ( suta )
      if (cleanUser === 'khoiri' && cleanPass === 'suta') {
        performLogin('khoiri', 'Khoiri Suta', 'Terminal Director & Chief Operator');
      } else {
        setError('Kredensial tidak valid. Silakan gunakan Username: khoiri dan Password: suta');
      }
      setIsLoading(false);
    }, 200);
  };

  const handleQuickFill = () => {
    setUsername('khoiri');
    setPassword('suta');
    setError('');
  };

  const handleDirectAdminLogin = () => {
    performLogin('khoiri', 'Khoiri Suta', 'Terminal Director & Chief Operator');
  };

  const handleGuestLogin = () => {
    performLogin('tamu', 'Operator Tamu (Demo)', 'Guest Terminal Operator');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Decorative bright maritime elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 mb-4 border border-cyan-400/30">
          <Container className="w-9 h-9" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          PortOps <span className="text-cyan-600">Terminal</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto font-medium">
          Sistem Operasi Terminal Peti Kemas (TOS) & Logistics Gate Control
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-8 sm:p-10 relative z-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Portal Masuk Petugas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Otoritas Operasional Terminal Terpadu</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Terproteksi
          </span>
        </div>

        {/* Credentials reminder banner */}
        <div className="my-5 p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 flex items-start gap-2.5">
          <Key className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-cyan-950">Akses Administrator Terminal:</span>
            <div className="mt-1 font-mono-code text-cyan-800 flex items-center justify-between">
              <span>User: <strong className="text-cyan-950 font-bold">khoiri</strong> &nbsp;|&nbsp; Pass: <strong className="text-cyan-950 font-bold">suta</strong></span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs font-semibold underline text-cyan-700 hover:text-cyan-900 ml-2"
                id="btn-quick-fill"
              >
                Isi Otomatis
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="login-username">
              Username Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username (khoiri)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password (suta)"
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-400 font-mono-code"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                {showPassword ? 'Tutup' : 'Lihat'}
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isLoading}
              id="btn-submit-login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold text-sm shadow-md shadow-cyan-600/25 transition-all cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <span>Memverifikasi Otoritas...</span>
              ) : (
                <>
                  <span>Masuk ke Sistem Operasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDirectAdminLogin}
                id="btn-direct-admin"
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold border border-cyan-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-cyan-600" />
                <span>1-Klik Admin (Khoiri)</span>
              </button>

              <button
                type="button"
                onClick={handleGuestLogin}
                id="btn-guest-mode"
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
              >
                Mode Tamu
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-600">
            <Anchor className="w-3.5 h-3.5 text-cyan-600" />
            Pelabuhan Hub Nusantara
          </span>
          <span className="font-mono-code text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">v2.4 Live</span>
        </div>
      </div>

      {/* Database connection readiness note */}
      <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Real DB Ready:
        </span>
        <span className="bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-700 font-medium">Supabase</span>
        <span className="bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-700 font-medium">Neon DB</span>
        <span className="bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-700 font-medium">Firebase Firestore</span>
      </div>
    </div>
  );
};
