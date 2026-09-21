import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { DashboardView } from './components/DashboardView';
import { MasterDataView } from './components/MasterDataView';
import { TransactionsView } from './components/TransactionsView';
import { ReportsView } from './components/ReportsView';
import { DatabaseConfigModal } from './components/DatabaseConfigModal';
import { PrintSlipModal } from './components/PrintSlipModal';
import { PublishLinkModal } from './components/PublishLinkModal';
import { storageService } from './services/storageService';
import {
  ContainerMaster,
  VesselMaster,
  YardBlockMaster,
  ShippingLineMaster,
  GateInTransaction,
  GateOutTransaction,
  StevedoringTransaction,
  DatabaseConfig,
  DatabaseProvider,
  AuthUser
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const DEFAULT_AUTH_USER: AuthUser = {
  username: 'khoiri',
  displayName: 'Khoiri Suta',
  role: 'Terminal Director & Chief Operator',
  terminalCode: 'TPK-PRIOK-01',
  isLoggedIn: true
};

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('portops_auth_token') === 'khoiri_suta_valid_session';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const raw = localStorage.getItem('portops_auth_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return DEFAULT_AUTH_USER;
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master' | 'transactions' | 'reports'>('dashboard');
  const [transactionsSubTab, setTransactionsSubTab] = useState<string>('gate-in');

  // Database config state
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => storageService.getDatabaseConfig());

  // Master Data State
  const [containers, setContainers] = useState<ContainerMaster[]>([]);
  const [vessels, setVessels] = useState<VesselMaster[]>([]);
  const [yardBlocks, setYardBlocks] = useState<YardBlockMaster[]>([]);
  const [shippingLines, setShippingLines] = useState<ShippingLineMaster[]>([]);

  // Transactions State
  const [gateInList, setGateInList] = useState<GateInTransaction[]>([]);
  const [gateOutList, setGateOutList] = useState<GateOutTransaction[]>([]);
  const [stevedoringList, setStevedoringList] = useState<StevedoringTransaction[]>([]);

  // Print Slip State
  const [printSlipData, setPrintSlipData] = useState<{
    isOpen: boolean;
    type: 'gate-in' | 'gate-out';
    record: any;
  }>({
    isOpen: false,
    type: 'gate-in',
    record: null
  });

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load all data from storage on mount
  const refreshAllData = () => {
    setContainers(storageService.getContainers());
    setVessels(storageService.getVessels());
    setYardBlocks(storageService.getYardBlocks());
    setShippingLines(storageService.getShippingLines());
    setGateInList(storageService.getGateInList());
    setGateOutList(storageService.getGateOutList());
    setStevedoringList(storageService.getStevedoringList());
    setDbConfig(storageService.getDatabaseConfig());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Handle Login
  const handleLoginSuccess = (user: any) => {
    const userObj: AuthUser =
      typeof user === 'object' && user !== null && user.displayName
        ? user
        : {
            username: typeof user === 'string' ? user : 'khoiri',
            displayName: typeof user === 'string' && user !== 'khoiri' ? user : 'Khoiri Suta',
            role: 'Terminal Director & Chief Operator',
            terminalCode: 'TPK-PRIOK-01',
            isLoggedIn: true
          };
    setIsAuthenticated(true);
    setCurrentUser(userObj);
    try {
      localStorage.setItem('portops_auth_token', 'khoiri_suta_valid_session');
      localStorage.setItem('portops_auth_user', JSON.stringify(userObj));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
    showToast(`Selamat datang, Bpk. ${userObj.displayName}! Sesi Administrator Aktif.`);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('portops_auth_token');
      localStorage.removeItem('portops_auth_user');
      localStorage.removeItem('portops_auth_v1');
    } catch (e) {
      console.warn('Storage clear failed', e);
    }
    showToast('Anda telah keluar dari sesi administrator.', 'info');
  };

  // Quick action from Dashboard to Gate In / Out
  const handleOpenTransactionWithTab = (subTab: string) => {
    setTransactionsSubTab(subTab);
    setActiveTab('transactions');
  };

  // Database configuration save
  const handleSaveDbConfig = (newConfig: DatabaseConfig) => {
    storageService.saveDatabaseConfig(newConfig);
    setDbConfig(newConfig);
    showToast(`Koneksi database real ke ${newConfig.activeProvider.toUpperCase()} berhasil dikonfigurasi & aktif!`);
  };

  // ================= Master Data Handlers =================
  const handleAddContainer = (data: Omit<ContainerMaster, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item = storageService.addContainer(data);
    refreshAllData();
    showToast(`Peti kemas ${item.containerNo} berhasil ditambahkan ke Master Data.`);
  };

  const handleUpdateContainer = (id: string, data: Partial<ContainerMaster>) => {
    storageService.updateContainer(id, data);
    refreshAllData();
    showToast('Data peti kemas berhasil diperbarui.');
  };

  const handleDeleteContainer = (id: string) => {
    storageService.deleteContainer(id);
    refreshAllData();
    showToast('Peti kemas berhasil dihapus.', 'info');
  };

  const handleAddVessel = (data: Omit<VesselMaster, 'id'>) => {
    const item = storageService.addVessel(data);
    refreshAllData();
    showToast(`Kapal ${item.name} berhasil didaftarkan.`);
  };

  const handleUpdateVessel = (id: string, data: Partial<VesselMaster>) => {
    storageService.updateVessel(id, data);
    refreshAllData();
    showToast('Data kapal berhasil diperbarui.');
  };

  const handleDeleteVessel = (id: string) => {
    storageService.deleteVessel(id);
    refreshAllData();
    showToast('Data kapal berhasil dihapus.', 'info');
  };

  const handleAddYardBlock = (data: Omit<YardBlockMaster, 'id'>) => {
    const item = storageService.addYardBlock(data);
    refreshAllData();
    showToast(`Blok lapangan ${item.code} berhasil dibuat.`);
  };

  const handleUpdateYardBlock = (id: string, data: Partial<YardBlockMaster>) => {
    storageService.updateYardBlock(id, data);
    refreshAllData();
    showToast('Data blok lapangan berhasil diperbarui.');
  };

  const handleDeleteYardBlock = (id: string) => {
    storageService.deleteYardBlock(id);
    refreshAllData();
    showToast('Blok lapangan berhasil dihapus.', 'info');
  };

  const handleAddShippingLine = (data: Omit<ShippingLineMaster, 'id'>) => {
    const item = storageService.addShippingLine(data);
    refreshAllData();
    showToast(`Pelayaran ${item.name} berhasil ditambahkan.`);
  };

  const handleUpdateShippingLine = (id: string, data: Partial<ShippingLineMaster>) => {
    storageService.updateShippingLine(id, data);
    refreshAllData();
    showToast('Data perusahaan pelayaran diperbarui.');
  };

  const handleDeleteShippingLine = (id: string) => {
    storageService.deleteShippingLine(id);
    refreshAllData();
    showToast('Perusahaan pelayaran dihapus.', 'info');
  };

  // ================= Transactions Handlers =================
  const handleAddGateIn = (data: Omit<GateInTransaction, 'id' | 'eirNo' | 'timestamp'>) => {
    const created = storageService.addGateIn(data);
    refreshAllData();
    showToast(`Gate-In Berhasil! No. EIR: ${created.eirNo}`);
    setPrintSlipData({
      isOpen: true,
      type: 'gate-in',
      record: created
    });
    return created;
  };

  const handleUpdateGateIn = (id: string, data: Partial<GateInTransaction>) => {
    storageService.updateGateIn(id, data);
    refreshAllData();
    showToast('Data transaksi Gate-In diperbarui.');
  };

  const handleDeleteGateIn = (id: string) => {
    storageService.deleteGateIn(id);
    refreshAllData();
    showToast('Transaksi Gate-In dihapus.', 'info');
  };

  const handleAddGateOut = (data: Omit<GateOutTransaction, 'id' | 'gatePassNo' | 'timestamp'>) => {
    const created = storageService.addGateOut(data);
    refreshAllData();
    showToast(`Gate-Out Berhasil! No. Gate Pass: ${created.gatePassNo}`);
    setPrintSlipData({
      isOpen: true,
      type: 'gate-out',
      record: created
    });
    return created;
  };

  const handleUpdateGateOut = (id: string, data: Partial<GateOutTransaction>) => {
    storageService.updateGateOut(id, data);
    refreshAllData();
    showToast('Data transaksi Gate-Out diperbarui.');
  };

  const handleDeleteGateOut = (id: string) => {
    storageService.deleteGateOut(id);
    refreshAllData();
    showToast('Transaksi Gate-Out dihapus.', 'info');
  };

  const handleAddStevedoring = (data: Omit<StevedoringTransaction, 'id' | 'timestamp'>) => {
    const created = storageService.addStevedoring(data);
    refreshAllData();
    showToast(`Bongkar Muat dicatat untuk kapal ${created.vesselName}`);
  };

  const handleUpdateStevedoring = (id: string, data: Partial<StevedoringTransaction>) => {
    storageService.updateStevedoring(id, data);
    refreshAllData();
    showToast('Data bongkar muat diperbarui.');
  };

  const handleDeleteStevedoring = (id: string) => {
    storageService.deleteStevedoring(id);
    refreshAllData();
    showToast('Data bongkar muat dihapus.', 'info');
  };

  const handleOpenPrintSlip = (type: 'gate-in' | 'gate-out', record: any) => {
    setPrintSlipData({
      isOpen: true,
      type,
      record
    });
  };

  // If not logged in, show the aesthetic bright login form
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-semibold border border-slate-700">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab: any) => {
          if (tab === 'database') {
            setIsDbModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenDbHub={() => setIsDbModalOpen(true)}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        dbConfig={dbConfig}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            containers={containers}
            vessels={vessels}
            yardBlocks={yardBlocks}
            gateInList={gateInList}
            gateOutList={gateOutList}
            stevedoringList={stevedoringList}
            dbConfig={dbConfig}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            onOpenTransactionTab={handleOpenTransactionWithTab}
            onNavigate={(tab, subtab) => {
              if (tab === 'database') {
                setIsDbModalOpen(true);
              } else {
                setActiveTab(tab);
                if (subtab && tab === 'transactions') {
                  setTransactionsSubTab(subtab);
                }
              }
            }}
            onOpenQuickGateIn={() => handleOpenTransactionWithTab('gate-in')}
          />
        )}

        {activeTab === 'master' && (
          <MasterDataView
            containers={containers}
            vessels={vessels}
            yardBlocks={yardBlocks}
            shippingLines={shippingLines}
            onAddContainer={handleAddContainer}
            onUpdateContainer={handleUpdateContainer}
            onDeleteContainer={handleDeleteContainer}
            onAddVessel={handleAddVessel}
            onUpdateVessel={handleUpdateVessel}
            onDeleteVessel={handleDeleteVessel}
            onAddYardBlock={handleAddYardBlock}
            onUpdateYardBlock={handleUpdateYardBlock}
            onDeleteYardBlock={handleDeleteYardBlock}
            onAddShippingLine={handleAddShippingLine}
            onUpdateShippingLine={handleUpdateShippingLine}
            onDeleteShippingLine={handleDeleteShippingLine}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            gateInList={gateInList}
            gateOutList={gateOutList}
            stevedoringList={stevedoringList}
            containers={containers}
            vessels={vessels}
            yardBlocks={yardBlocks}
            shippingLines={shippingLines}
            onAddGateIn={handleAddGateIn}
            onUpdateGateIn={handleUpdateGateIn}
            onDeleteGateIn={handleDeleteGateIn}
            onAddGateOut={handleAddGateOut}
            onUpdateGateOut={handleUpdateGateOut}
            onDeleteGateOut={handleDeleteGateOut}
            onAddStevedoring={handleAddStevedoring}
            onUpdateStevedoring={handleUpdateStevedoring}
            onDeleteStevedoring={handleDeleteStevedoring}
            onPrintSlip={handleOpenPrintSlip}
            initialSubTab={transactionsSubTab}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            containers={containers}
            vessels={vessels}
            yardBlocks={yardBlocks}
            shippingLines={shippingLines}
            gateInList={gateInList}
            gateOutList={gateOutList}
            stevedoringList={stevedoringList}
          />
        )}
      </main>

      {/* Database Connection Config Modal */}
      {isDbModalOpen && (
        <DatabaseConfigModal
          config={dbConfig}
          onSaveConfig={handleSaveDbConfig}
          onClose={() => setIsDbModalOpen(false)}
        />
      )}

      {/* Publish / Share Link Modal */}
      {isPublishModalOpen && (
        <PublishLinkModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
        />
      )}

      {/* Printable Slip Modal (EIR / Gate Pass) */}
      {printSlipData.isOpen && printSlipData.record && (
        <PrintSlipModal
          type={printSlipData.type}
          record={printSlipData.record}
          onClose={() => setPrintSlipData({ isOpen: false, type: 'gate-in', record: null })}
        />
      )}

      {/* Subtle Footer */}
      <footer className="mt-auto py-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-xs text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-800">PortOps v2.4</span> • Terminal Peti Kemas Nusantara Operating System
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Database Terhubung: <strong className="text-cyan-700 uppercase">{dbConfig.activeProvider}</strong></span>
            <span>•</span>
            <span>Admin Operator: <strong className="text-slate-800">{currentUser?.displayName || currentUser?.username || 'Khoiri Suta'}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
