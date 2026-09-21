import React, { useState, useEffect } from 'react';
import {
  Container,
  LayoutDashboard,
  Database,
  ArrowLeftRight,
  FileSpreadsheet,
  Server,
  LogOut,
  User,
  Clock,
  Radio,
  Globe,
  Share2
} from 'lucide-react';
import { AuthUser, DatabaseConfig } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'master' | 'transactions' | 'reports' | 'database';
  setActiveTab: (tab: any) => void;
  currentUser?: AuthUser | string;
  userName?: string;
  onLogout: () => void;
  dbConfig?: DatabaseConfig;
  onOpenDbHub?: () => void;
  onOpenDbModal?: () => void;
  onOpenPublishModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  userName,
  onLogout,
  dbConfig,
  onOpenDbHub,
  onOpenDbModal,
  onOpenPublishModal
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  const displayName =
    (typeof currentUser === 'object' && currentUser?.displayName) ||
    (typeof currentUser === 'string' && currentUser) ||
    userName ||
    'Khoiri Suta';

  const userUsername =
    (typeof currentUser === 'object' && currentUser?.username) ||
    (typeof currentUser === 'string' && currentUser) ||
    'khoiri';

  const handleOpenDatabase = () => {
    if (onOpenDbHub) onOpenDbHub();
    else if (onOpenDbModal) onOpenDbModal();
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getProviderBadge = () => {
    switch (dbConfig.activeProvider) {
      case 'supabase':
        return { label: 'Supabase Real DB', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' };
      case 'neon':
        return { label: 'Neon DB Postgres', bg: 'bg-cyan-500/10 text-cyan-700 border-cyan-300' };
      case 'firebase':
        return { label: 'Firebase Firestore', bg: 'bg-amber-500/10 text-amber-700 border-amber-300' };
      default:
        return { label: 'Local Persistent', bg: 'bg-blue-500/10 text-blue-700 border-blue-200' };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top micro bar for quick terminal status */}
      <div className="bg-slate-900 text-slate-300 px-4 sm:px-6 py-1 text-xs flex items-center justify-between font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Terminal Live: Dermaga 01 & 02 Siaga
          </span>
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {currentTime} (Shift 2 Operasional)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Publish / Link Badge button */}
          <button
            onClick={onOpenPublishModal}
            id="nav-publish-indicator"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-cyan-400/40 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all cursor-pointer"
            title="Kelola & Ganti Link Publikasi / Share URL"
          >
            <Globe className="w-3 h-3 text-cyan-300" />
            <span>Publish Link</span>
          </button>

          <span className="text-slate-500 hidden sm:inline">|</span>

          {/* Active Database badge button */}
          <button
            onClick={handleOpenDatabase}
            id="nav-db-indicator"
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border cursor-pointer hover:brightness-95 transition-all ${badge.bg}`}
            title="Klik untuk konfigurasi Supabase, Neon DB, atau Firebase"
          >
            <Radio className="w-3 h-3 animate-pulse" />
            <span>{badge.label}</span>
          </button>
          
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-300 hidden sm:inline">
            Terminal Code: <strong className="text-white">TPK-PRIOK</strong>
          </span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Terminal Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
              <Container className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  PortOps <span className="text-cyan-600">TOS</span>
                </span>
                <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Terminal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
                Operasional Peti Kemas & Logistik
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              id="nav-tab-dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('master')}
              id="nav-tab-master"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'master'
                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Master Data</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              id="nav-tab-transactions"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Transaksi Data</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              id="nav-tab-reports"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Laporan</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('database');
                handleOpenDatabase();
              }}
              id="nav-tab-database"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Koneksi Real DB</span>
            </button>
          </nav>

          {/* User Profile, Publish & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenPublishModal}
              id="btn-nav-publish-link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-300 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Kelola & Ganti Link Publish Aplikasi"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden md:inline">Publish Link</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-800 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{displayName}</span>
                  <span className="bg-cyan-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono-code">Admin</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">@{userUsername}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              id="btn-logout"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold transition-all cursor-pointer"
              title="Keluar dari sesi"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-100 gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-cyan-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeTab === 'master' ? 'bg-cyan-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Master Data
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeTab === 'transactions' ? 'bg-cyan-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Transaksi Data
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeTab === 'reports' ? 'bg-cyan-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Laporan
          </button>
          <button
            onClick={() => {
              setActiveTab('database');
              handleOpenDatabase();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeTab === 'database' ? 'bg-emerald-600 text-white' : 'text-emerald-700 bg-emerald-50'
            }`}
          >
            Real DB
          </button>
        </div>
      </div>
    </header>
  );
};
