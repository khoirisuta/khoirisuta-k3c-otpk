import React, { useState } from 'react';
import {
  Container,
  Anchor,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Search,
  Maximize2,
  PlusCircle,
  Server,
  Share2
} from 'lucide-react';
import {
  ContainerMaster,
  VesselMaster,
  YardBlockMaster,
  GateInTransaction,
  GateOutTransaction,
  StevedoringTransaction,
  DatabaseConfig
} from '../types';

interface DashboardViewProps {
  containers?: ContainerMaster[];
  vessels?: VesselMaster[];
  yardBlocks?: YardBlockMaster[];
  gateInList?: GateInTransaction[];
  gateOutList?: GateOutTransaction[];
  stevedoringList?: StevedoringTransaction[];
  dbConfig?: DatabaseConfig;
  onNavigate?: (tab: 'master' | 'transactions' | 'reports' | 'database', subtab?: string) => void;
  onSelectContainerForModal?: (container: ContainerMaster) => void;
  onOpenQuickGateIn?: () => void;
  onOpenTransactionTab?: (subTab: string) => void;
  onOpenPublishModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  containers = [],
  vessels = [],
  yardBlocks = [],
  gateInList = [],
  gateOutList = [],
  stevedoringList = [],
  dbConfig,
  onNavigate,
  onSelectContainerForModal,
  onOpenQuickGateIn,
  onOpenTransactionTab,
  onOpenPublishModal
}) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('ALL');

  const handleNav = (tab: any, subtab?: string) => {
    if (onNavigate) {
      onNavigate(tab, subtab);
    } else if (onOpenTransactionTab && (tab === 'transactions' || subtab)) {
      onOpenTransactionTab(subtab || 'gate-in');
    }
  };

  const handleQuickGateIn = () => {
    if (onOpenQuickGateIn) {
      onOpenQuickGateIn();
    } else if (onOpenTransactionTab) {
      onOpenTransactionTab('gate-in');
    } else if (onNavigate) {
      onNavigate('transactions', 'gate-in');
    }
  };

  // Compute key terminal metrics
  // Total TEUs: 20ft = 1 TEU, 40ft = 2 TEU, 45ft = 2.25 TEU
  const calculateTeus = (cntList: ContainerMaster[]) => {
    return cntList.reduce((acc, c) => {
      if (c.size === '20ft') return acc + 1;
      if (c.size === '40ft') return acc + 2;
      return acc + 2.25;
    }, 0);
  };

  const totalYardTeus = calculateTeus(containers);
  const totalYardCapacity = yardBlocks.reduce((acc, b) => acc + b.totalCapacityTeus, 0);
  const yardOccupancyRate = Math.round((totalYardTeus / (totalYardCapacity || 1)) * 100);

  const berthingVessels = vessels.filter(v => v.status === 'Berthing');
  const berthOccupancyRate = Math.round((berthingVessels.length / 3) * 100); // 3 total active quays

  const todayGateInCount = gateInList.length;
  const todayGateOutCount = gateOutList.length;

  // Overdwell containers (> 5 days)
  const overDwellContainers = containers.filter(c => c.dwellDays > 5);

  // Filtered containers for quick slot finder
  const searchResults = containers.filter(c => {
    const matchesSearch = quickSearch === '' ||
      c.containerNo.toLowerCase().includes(quickSearch.toLowerCase()) ||
      c.shippingLine.toLowerCase().includes(quickSearch.toLowerCase()) ||
      c.sealNo.toLowerCase().includes(quickSearch.toLowerCase());
    const matchesBlock = selectedBlockFilter === 'ALL' || c.yardSlot.block === selectedBlockFilter;
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Search */}
      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-cyan-900/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2 text-cyan-100 border border-white/20">
            <Activity className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            Live Operation Terminal Peti Kemas
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Pengendalian Terminal
          </h1>
          <p className="text-cyan-100 text-sm mt-1 max-w-xl">
            Monitoring arus bongkar muat peti kemas, pemanfaatan lapangan penumpukan (YOR), dan pergerakan dermaga secara real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenPublishModal}
            id="btn-dash-publish-link"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-900/40 hover:bg-cyan-900/60 text-white border border-cyan-300/30 font-semibold text-sm transition-all cursor-pointer backdrop-blur-sm"
            title="Pengaturan & Ganti Link Publish"
          >
            <Share2 className="w-4 h-4 text-cyan-300" />
            <span>Publish Link</span>
          </button>

          <button
            onClick={handleQuickGateIn}
            id="btn-dash-quick-gate-in"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-cyan-800 hover:bg-cyan-50 font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-600" />
            <span>Catat Gate-In</span>
          </button>

          <button
            onClick={() => handleNav('transactions', 'gate-out')}
            id="btn-dash-gate-out"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-700/60 hover:bg-cyan-700 text-white border border-white/20 font-semibold text-sm transition-all cursor-pointer backdrop-blur-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Proses Gate-Out</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Yard Inventory */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Peti Kemas di Yard</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Container className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{containers.length}</span>
              <span className="text-sm font-semibold text-slate-600">Box ({totalYardTeus} TEUs)</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span>20ft: {containers.filter(c => c.size === '20ft').length} Box</span>
              <span>40/45ft: {containers.filter(c => c.size !== '20ft').length} Box</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Yard Occupancy Rate (YOR) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Yard Occupancy (YOR)</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              yardOccupancyRate > 75 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{yardOccupancyRate}%</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {yardOccupancyRate > 75 ? 'Hampir Penuh' : 'Optimal'}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  yardOccupancyRate > 80 ? 'bg-rose-500' : yardOccupancyRate > 65 ? 'bg-amber-500' : 'bg-cyan-600'
                }`}
                style={{ width: `${Math.min(yardOccupancyRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 3: Berth Occupancy Rate (BOR) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kapal Sandar (BOR)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Anchor className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{berthingVessels.length}</span>
              <span className="text-sm font-semibold text-slate-600">Kapal ({berthOccupancyRate}% Dermaga)</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="text-emerald-700 font-medium">QC Active: 4 Crane</span>
              <span className="text-slate-500">Wait: {vessels.filter(v => v.status === 'Anchored').length} Kapal</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Daily Gate Throughput */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Aktivitas Gate Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-cyan-700">
                <ArrowDownLeft className="w-4 h-4" />
                <span className="text-2xl font-bold">{todayGateInCount}</span>
                <span className="text-xs font-medium text-slate-500">In</span>
              </div>
              <span className="text-slate-300">/</span>
              <div className="flex items-center gap-1.5 text-indigo-700">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-2xl font-bold">{todayGateOutCount}</span>
                <span className="text-xs font-medium text-slate-500">Out</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span>Avg Gate Time: 8.4 Min</span>
              <span className="text-emerald-700 font-semibold">Lancar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner for Over-Dwell Containers */}
      {overDwellContainers.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold text-amber-950">Peringatan Dwelling Time: </span>
            Terdapat <strong className="font-bold underline">{overDwellContainers.length} peti kemas</strong> dengan masa inap lebih dari 5 hari di lapangan penumpukan (potensi penumpukan demurrage).
            <div className="mt-2 flex flex-wrap gap-2">
              {overDwellContainers.map(c => (
                <button
                  key={c.id}
                  onClick={() => onSelectContainerForModal && onSelectContainerForModal(c)}
                  className="bg-white px-2.5 py-1 rounded-lg border border-amber-300 text-xs font-mono-code font-bold text-amber-950 hover:bg-amber-100 cursor-pointer transition-all"
                >
                  {c.containerNo} ({c.dwellDays} Hari - {c.yardSlot.block})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Layout Grid: 2D Yard Interactive Map + Active Vessels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yard Map 2D Visualizer Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-600" />
                Peta Visual Lapangan Penumpukan (Yard Layout)
              </h2>
              <p className="text-xs text-slate-500">Status penumpukan kontainer per blok operasional</p>
            </div>

            {/* Block filters */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedBlockFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  selectedBlockFilter === 'ALL'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Blok
              </button>
              {yardBlocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => setSelectedBlockFilter(block.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                    selectedBlockFilter === block.code
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {block.code}
                </button>
              ))}
            </div>
          </div>

          {/* Yard Blocks Grid View */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {yardBlocks.map(block => {
              const blockContainers = containers.filter(c => c.yardSlot.block === block.code);
              const occupancyPct = Math.round((block.currentOccupancyTeus / block.totalCapacityTeus) * 100);

              return (
                <div
                  key={block.id}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedBlockFilter === block.code
                      ? 'border-cyan-500 bg-cyan-50/40 ring-2 ring-cyan-200'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 font-mono-code">{block.code}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          block.isReeferZone
                            ? 'bg-blue-100 text-blue-800'
                            : block.category === 'Import'
                            ? 'bg-amber-100 text-amber-800'
                            : block.category === 'Export'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {block.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{block.name}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{occupancyPct}%</span>
                      <p className="text-[10px] text-slate-600 font-medium">
                        {block.currentOccupancyTeus} / {block.totalCapacityTeus} TEUs
                      </p>
                    </div>
                  </div>

                  {/* Progress gauge */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyPct > 80 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-cyan-600'
                      }`}
                      style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                    />
                  </div>

                  {/* Visual slot representation (mini stacks) */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Peti Kemas Terparkir ({blockContainers.length} Unit):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {blockContainers.slice(0, 4).map(c => (
                        <button
                          key={c.id}
                          onClick={() => onSelectContainerForModal(c)}
                          className="px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-mono-code font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-700 cursor-pointer shadow-2xs"
                        >
                          {c.containerNo.slice(0, 4)}.. (Bay {c.yardSlot.bay})
                        </button>
                      ))}
                      {blockContainers.length > 4 && (
                        <span className="text-[11px] font-bold text-slate-600 self-center">
                          +{blockContainers.length - 4} lagi
                        </span>
                      )}
                      {blockContainers.length === 0 && (
                        <span className="text-[11px] text-slate-600 italic">Slot kosong tersedia</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Container Search Bar inside Yard */}
          <div className="mt-5 p-4 rounded-xl bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-slate-600" />
              <label htmlFor="dash-quick-search" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pencarian Cepat Posisi Peti Kemas (Quick Slot Finder)
              </label>
            </div>
            <div className="flex gap-2">
              <input
                id="dash-quick-search"
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Ketik Nomor Kontainer (misal: TGHU-849201-4) atau Shipping Line..."
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-400 placeholder:font-sans"
              />
              {quickSearch && (
                <button
                  onClick={() => setQuickSearch('')}
                  className="px-3 py-2 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Live Search Quick Results */}
            {quickSearch && (
              <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map(c => (
                    <div
                      key={c.id}
                      onClick={() => onSelectContainerForModal(c)}
                      className="p-2 bg-white rounded-lg border border-slate-200 hover:border-cyan-500 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-800 font-mono-code">{c.containerNo}</span>
                        <span className="text-slate-600">{c.shippingLine}</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {c.size} {c.type}
                        </span>
                      </div>
                      <div className="font-mono-code font-bold text-slate-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                        {c.yardSlot.block}-B{c.yardSlot.bay}-R{c.yardSlot.row}-T{c.yardSlot.tier}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-2 text-center">Tidak ditemukan peti kemas dengan kata kunci tersebut.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Berthing Vessels & Quick Gate Activity */}
        <div className="space-y-6">
          {/* Active Vessels Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Anchor className="w-4 h-4 text-cyan-600" />
                Kapal di Dermaga (Quay)
              </h2>
              <button
                onClick={() => handleNav('master', 'vessels')}
                className="text-xs font-bold text-cyan-600 hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {vessels.slice(0, 3).map(v => {
                const totalOps = v.teusLoaded + v.teusDischarged;
                const progressPct = v.totalTeusPlanned > 0
                  ? Math.round((totalOps / v.totalTeusPlanned) * 100)
                  : 0;

                return (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{v.name}</h3>
                        <p className="text-[11px] text-slate-500">{v.berthId}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.status === 'Berthing'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'Anchored'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    {v.status === 'Berthing' && (
                      <div className="mt-2.5">
                        <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                          <span>Bongkar Muat: {totalOps} / {v.totalTeusPlanned} TEUs</span>
                          <span className="font-bold">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-600 rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Crane: {v.quayCraneAssigned.join(', ') || 'None'}</span>
                          <span>ETD: {new Date(v.etd).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Gate In Activity Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-cyan-600" />
                Arus Masuk Gate Terkini
              </h2>
              <button
                onClick={() => handleNav('transactions', 'gate-in')}
                className="text-xs font-bold text-cyan-600 hover:underline cursor-pointer"
              >
                Lihat Gate
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {gateInList.slice(0, 4).map(gin => (
                <div
                  key={gin.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold font-mono-code text-slate-900">{gin.containerNo}</span>
                      <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-semibold">
                        {gin.size}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Truk: {gin.truckPlate} • {gin.shippingLine}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-code font-semibold text-[11px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 block">
                      {gin.allocatedSlot}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                      {gin.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
