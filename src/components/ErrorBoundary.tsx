import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import { storageService } from '../services/storageService';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by PortOps ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      storageService.resetToInitial();
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-800">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-rose-200 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sistem Menemui Kendala</h2>
            <p className="text-xs text-slate-600 mt-2">
              Terjadi kesalahan saat memuat tampilan operasional terminal. Anda dapat memuat ulang atau memulihkan data bawaan.
            </p>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left font-mono-code text-[11px] text-slate-600 overflow-x-auto max-h-32">
              {this.state.error?.message || 'Unknown error occurred'}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Muat Ulang</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data Default</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
