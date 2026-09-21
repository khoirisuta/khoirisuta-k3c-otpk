import React, { useState, useEffect } from 'react';
import {
  Globe,
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  X,
  Settings,
  Sparkles,
  Link as LinkIcon,
  ShieldCheck,
  Send,
  RefreshCw,
  Layers
} from 'lucide-react';

interface PublishLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAppUrl?: string;
  projectId?: string;
}

export const PublishLinkModal: React.FC<PublishLinkModalProps> = ({
  isOpen,
  onClose,
  defaultAppUrl = 'https://ais-pre-kxglittepjtdje2k65j4cu-376446959477.asia-southeast1.run.app',
  projectId = '6774c24f-0c88-43a7-a1b6-21ca9f28961c'
}) => {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : defaultAppUrl;
  const initialLink = currentOrigin.includes('localhost') ? defaultAppUrl : currentOrigin;

  const [activeUrl, setActiveUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('portops_custom_publish_url');
      return saved || initialLink;
    } catch {
      return initialLink;
    }
  });

  const [customInputUrl, setCustomInputUrl] = useState<string>(activeUrl);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'link' | 'custom' | 'guide'>('link');

  useEffect(() => {
    setCustomInputUrl(activeUrl);
  }, [activeUrl]);

  if (!isOpen) return null;

  const handleCopy = (textToCopy: string) => {
    try {
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard failed', e);
    }
  };

  const handleSaveCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    let formatted = customInputUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    setActiveUrl(formatted);
    try {
      localStorage.setItem('portops_custom_publish_url', formatted);
    } catch {}
    setSaveSuccessMsg('Link kustom berhasil disimpan sebagai tautan publik aktif!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleResetToDefault = () => {
    setActiveUrl(defaultAppUrl);
    setCustomInputUrl(defaultAppUrl);
    try {
      localStorage.removeItem('portops_custom_publish_url');
    } catch {}
    setSaveSuccessMsg('Link telah dikembalikan ke URL Shared Cloud Run default.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo, berikut tautan aplikasi operasional PortOps Terminal Peti Kemas:\n${activeUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner">
              <Globe className="w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight">Pengaturan & Ganti Link Publish</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Online
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Kelola tautan publik, domain kustom, atau bagikan aplikasi ke tim operasional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'link'
                ? 'border-cyan-600 text-cyan-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Tautan Publik Aktif</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'custom'
                ? 'border-cyan-600 text-cyan-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Ganti / Kustomisasi Link</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'guide'
                ? 'border-cyan-600 text-cyan-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panduan Deploy & Custom Domain</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700">
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: Link Aktif & Quick Share */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  URL Aplikasi Siap Akses (Published Link)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon className="w-4 h-4 text-cyan-600" />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={activeUrl}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono-code font-bold text-slate-900 select-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(activeUrl)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={activeUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="Buka di tab browser baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Buka</span>
                  </a>
                </div>
              </div>

              {/* Status Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status Build & Server:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Compiled & Production Ready
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Cloud Environment:</span>
                  <span className="font-bold text-slate-800 font-mono-code">Google Cloud Run (Asia-Southeast1)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">AI Studio Project ID:</span>
                  <span className="font-bold text-slate-700 font-mono-code text-[11px]">{projectId}</span>
                </div>
              </div>

              {/* Share actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={shareViaWhatsApp}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQr(!showQr)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{showQr ? 'Tutup QR Code' : 'Tampilkan QR Code'}</span>
                </button>
              </div>

              {/* QR Code display */}
              {showQr && (
                <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
                  <p className="text-xs font-medium text-slate-600">
                    Scan QR code di bawah ini menggunakan kamera HP/Tablet untuk membuka aplikasi langsung:
                  </p>
                  <div className="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        activeUrl
                      )}`}
                      alt="QR Code Aplikasi"
                      className="w-40 h-40"
                    />
                  </div>
                  <span className="text-[11px] font-mono-code text-slate-500">{activeUrl}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Ganti / Kustomisasi Link */}
          {activeTab === 'custom' && (
            <form onSubmit={handleSaveCustomLink} className="space-y-4">
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900 leading-relaxed">
                <strong>Catatan Penggantian Link:</strong> Anda dapat menentukan URL tujuan publik atau subdomain kustom Anda sendiri (misal: domain perusahaan, Cloud Run kustom, atau link deployment pribadi). Tautan ini akan dijadikan tautan rujukan utama pada aplikasi.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Ketik URL / Link Baru untuk Publikasi *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={customInputUrl}
                    onChange={(e) => setCustomInputUrl(e.target.value)}
                    placeholder="Contoh: https://portops.namaperusahaan.co.id atau https://myapp.run.app"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono-code font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mendukung domain apa pun dengan protokol HTTPS / HTTP.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset ke Link Cloud Run Asli</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Terapkan & Simpan Link</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: Panduan Publish & Custom Domain */}
          {activeTab === 'guide' && (
            <div className="space-y-3.5 text-xs">
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Cara Publish / Share di Google AI Studio</span>
                </div>
                <p className="text-slate-600 pl-7 leading-relaxed">
                  Buka bilah menu di pojok kanan atas layar AI Studio, klik tombol <strong>Share</strong> atau <strong>Deploy to Cloud Run</strong>. Pilih opsi visibilitas <em>"Anyone with link"</em> untuk mengaktifkan akses publik.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>Menggunakan Domain Sendiri (Custom Domain)</span>
                </div>
                <p className="text-slate-600 pl-7 leading-relaxed">
                  Jika Anda ingin menggunakan domain Anda (misal: <code>portops.perusahaan.com</code>), buka Google Cloud Console &gt; Cloud Run &gt; <em>Manage Custom Domains</em>, lalu tambahkan CNAME Record DNS ke domain Anda. Setelah terverifikasi, masukkan tautan tersebut di tab <strong>"Ganti / Kustomisasi Link"</strong>.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span>Ekspor Proyek ke GitHub atau ZIP</span>
                </div>
                <p className="text-slate-600 pl-7 leading-relaxed">
                  Anda juga dapat mengekspor seluruh kode sumber aplikasi ini ke repositori GitHub pribadi atau mengunduh arsip ZIP melalui menu pengaturan proyek AI Studio kapan pun dibutuhkan.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            <span>PortOps TOS • Publish Link Hub</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
