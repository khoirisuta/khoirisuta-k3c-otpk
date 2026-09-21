import React, { useState } from 'react';
import {
  Container,
  Anchor,
  Layers,
  Ship,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  AlertCircle,
  QrCode,
  ThermometerSnowflake,
  Scale,
  Calendar,
  Building2,
  ExternalLink
} from 'lucide-react';
import {
  ContainerMaster,
  VesselMaster,
  YardBlockMaster,
  ShippingLineMaster,
  ContainerSize,
  ContainerType,
  ContainerStatus,
  VesselStatus
} from '../types';

interface MasterDataViewProps {
  containers: ContainerMaster[];
  vessels: VesselMaster[];
  yardBlocks: YardBlockMaster[];
  shippingLines: ShippingLineMaster[];
  onAddContainer: (c: Omit<ContainerMaster, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateContainer: (id: string, c: Partial<ContainerMaster>) => void;
  onDeleteContainer: (id: string) => void;
  onAddVessel: (v: Omit<VesselMaster, 'id'>) => void;
  onUpdateVessel: (id: string, v: Partial<VesselMaster>) => void;
  onDeleteVessel: (id: string) => void;
  onAddYardBlock: (b: Omit<YardBlockMaster, 'id'>) => void;
  onUpdateYardBlock: (id: string, b: Partial<YardBlockMaster>) => void;
  onDeleteYardBlock: (id: string) => void;
  onAddShippingLine: (s: Omit<ShippingLineMaster, 'id'>) => void;
  onUpdateShippingLine: (id: string, s: Partial<ShippingLineMaster>) => void;
  onDeleteShippingLine: (id: string) => void;
  onViewContainerDetail?: (c: ContainerMaster) => void;
  initialSubTab?: string;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  containers,
  vessels,
  yardBlocks,
  shippingLines,
  onAddContainer,
  onUpdateContainer,
  onDeleteContainer,
  onAddVessel,
  onUpdateVessel,
  onDeleteVessel,
  onAddYardBlock,
  onUpdateYardBlock,
  onDeleteYardBlock,
  onAddShippingLine,
  onUpdateShippingLine,
  onDeleteShippingLine,
  onViewContainerDetail,
  initialSubTab = 'containers'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'containers' | 'vessels' | 'yard' | 'lines'>(
    (initialSubTab as any) || 'containers'
  );

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isContainerModalOpen, setIsContainerModalOpen] = useState(false);
  const [editingContainerId, setEditingContainerId] = useState<string | null>(null);

  const [isVesselModalOpen, setIsVesselModalOpen] = useState(false);
  const [editingVesselId, setEditingVesselId] = useState<string | null>(null);

  const [isYardModalOpen, setIsYardModalOpen] = useState(false);
  const [editingYardId, setEditingYardId] = useState<string | null>(null);

  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);

  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{
    type: 'container' | 'vessel' | 'yard' | 'line';
    id: string;
    label: string;
  } | null>(null);

  // --- Container Form State ---
  const [containerForm, setContainerForm] = useState({
    containerNo: '',
    size: '40ft' as ContainerSize,
    type: 'Dry' as ContainerType,
    isoCode: '42G1',
    tareWeightKg: 3820,
    maxGrossWeightKg: 30480,
    currentGrossWeightKg: 24500,
    shippingLine: 'Evergreen Marine Corp',
    status: 'FCL' as ContainerStatus,
    block: 'BLK-A',
    bay: 1,
    row: 1,
    tier: 1,
    dwellDays: 1,
    sealNo: '',
    tempSetpoint: -18,
    vesselName: ''
  });

  // --- Vessel Form State ---
  const [vesselForm, setVesselForm] = useState({
    name: '',
    imoNo: '',
    callSign: '',
    lengthMeters: 250,
    berthId: 'Dermaga 01-A (Quay 1)',
    shippingAgent: '',
    eta: '',
    etd: '',
    status: 'Berthing' as VesselStatus,
    totalTeusPlanned: 1000,
    teusLoaded: 0,
    teusDischarged: 0,
    quayCraneAssigned: ['QC-01']
  });

  // --- Yard Block Form State ---
  const [yardForm, setYardForm] = useState({
    code: '',
    name: '',
    maxBays: 10,
    maxRows: 6,
    maxTiers: 4,
    isReeferZone: false,
    totalCapacityTeus: 480,
    currentOccupancyTeus: 0,
    category: 'Import' as 'Import' | 'Export' | 'Domestic' | 'Empty' | 'Reefer'
  });

  // --- Shipping Line Form State ---
  const [lineForm, setLineForm] = useState({
    code: '',
    name: '',
    country: 'Indonesia',
    contactPerson: '',
    phone: '',
    email: '',
    colorHex: '#0284c7'
  });

  // --- Container Form Helpers ---
  const clearContainerForm = () => {
    setContainerForm({
      containerNo: '',
      size: '40ft',
      type: 'Dry',
      isoCode: '42G1',
      tareWeightKg: 3820,
      maxGrossWeightKg: 30480,
      currentGrossWeightKg: 24500,
      shippingLine: '',
      status: 'FCL',
      block: yardBlocks[0]?.code || 'BLK-A',
      bay: 1,
      row: 1,
      tier: 1,
      dwellDays: 0,
      sealNo: '',
      tempSetpoint: -18,
      vesselName: ''
    });
  };

  const fillContainerExample = () => {
    setContainerForm({
      containerNo: `TPKU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`,
      size: '40ft',
      type: 'Dry',
      isoCode: '42G1',
      tareWeightKg: 3820,
      maxGrossWeightKg: 30480,
      currentGrossWeightKg: 24500,
      shippingLine: shippingLines[0]?.name || 'Evergreen Marine Corp',
      status: 'FCL',
      block: yardBlocks[0]?.code || 'BLK-A',
      bay: 1,
      row: 1,
      tier: 1,
      dwellDays: 0,
      sealNo: `SL-${Math.floor(100000 + Math.random() * 900000)}`,
      tempSetpoint: -18,
      vesselName: vessels[0]?.name || ''
    });
  };

  // --- Vessel Form Helpers ---
  const clearVesselForm = () => {
    const now = new Date();
    const nextDay = new Date(now.getTime() + 48 * 3600 * 1000);
    setVesselForm({
      name: '',
      imoNo: '',
      callSign: '',
      lengthMeters: 220,
      berthId: 'Dermaga 01-A (Quay 1)',
      shippingAgent: '',
      eta: now.toISOString().slice(0, 16),
      etd: nextDay.toISOString().slice(0, 16),
      status: 'Berthing',
      totalTeusPlanned: 1000,
      teusLoaded: 0,
      teusDischarged: 0,
      quayCraneAssigned: ['QC-01', 'QC-02']
    });
  };

  const fillVesselExample = () => {
    const now = new Date();
    const nextDay = new Date(now.getTime() + 48 * 3600 * 1000);
    setVesselForm({
      name: 'MV Samudera Nusantara',
      imoNo: `IMO ${Math.floor(9000000 + Math.random() * 999999)}`,
      callSign: `PK${Math.floor(10 + Math.random() * 89)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      lengthMeters: 260,
      berthId: 'Dermaga 01-A (Quay 1)',
      shippingAgent: shippingLines[0]?.name || 'PT Samudera Indonesia',
      eta: now.toISOString().slice(0, 16),
      etd: nextDay.toISOString().slice(0, 16),
      status: 'Berthing',
      totalTeusPlanned: 1200,
      teusLoaded: 0,
      teusDischarged: 0,
      quayCraneAssigned: ['QC-01', 'QC-02']
    });
  };

  // --- Yard Block Form Helpers ---
  const clearYardForm = () => {
    setYardForm({
      code: '',
      name: '',
      maxBays: 10,
      maxRows: 6,
      maxTiers: 4,
      isReeferZone: false,
      totalCapacityTeus: 480,
      currentOccupancyTeus: 0,
      category: 'Export'
    });
  };

  const fillYardExample = () => {
    setYardForm({
      code: `BLK-${String.fromCharCode(68 + yardBlocks.length)}`,
      name: `Blok Lapangan Tambahan ${yardBlocks.length + 1}`,
      maxBays: 10,
      maxRows: 6,
      maxTiers: 4,
      isReeferZone: false,
      totalCapacityTeus: 480,
      currentOccupancyTeus: 0,
      category: 'Export'
    });
  };

  // --- Shipping Line Form Helpers ---
  const clearLineForm = () => {
    setLineForm({
      code: '',
      name: '',
      country: '',
      contactPerson: '',
      phone: '',
      email: '',
      colorHex: '#0284c7'
    });
  };

  const fillLineExample = () => {
    setLineForm({
      code: 'MRL',
      name: 'PT Meratus Line',
      country: 'Indonesia',
      contactPerson: 'Bpk. Gunawan',
      phone: '+62 21 2928100',
      email: 'ops@meratusline.com',
      colorHex: '#2563eb'
    });
  };

  // Handle open container form (Add / Edit)
  const handleOpenContainerForm = (c?: ContainerMaster) => {
    if (c) {
      setEditingContainerId(c.id);
      setContainerForm({
        containerNo: c.containerNo,
        size: c.size,
        type: c.type,
        isoCode: c.isoCode,
        tareWeightKg: c.tareWeightKg,
        maxGrossWeightKg: c.maxGrossWeightKg,
        currentGrossWeightKg: c.currentGrossWeightKg,
        shippingLine: c.shippingLine,
        status: c.status,
        block: c.yardSlot.block,
        bay: c.yardSlot.bay,
        row: c.yardSlot.row,
        tier: c.yardSlot.tier,
        dwellDays: c.dwellDays,
        sealNo: c.sealNo,
        tempSetpoint: c.tempSetpoint ?? -18,
        vesselName: c.vesselName || ''
      });
    } else {
      setEditingContainerId(null);
      clearContainerForm();
    }
    setIsContainerModalOpen(true);
  };

  const handleSaveContainer = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      containerNo: containerForm.containerNo.trim().toUpperCase(),
      size: containerForm.size,
      type: containerForm.type,
      isoCode: containerForm.isoCode,
      tareWeightKg: Number(containerForm.tareWeightKg),
      maxGrossWeightKg: Number(containerForm.maxGrossWeightKg),
      currentGrossWeightKg: Number(containerForm.currentGrossWeightKg),
      shippingLine: containerForm.shippingLine,
      status: containerForm.status,
      yardSlot: {
        block: containerForm.block,
        bay: Number(containerForm.bay),
        row: Number(containerForm.row),
        tier: Number(containerForm.tier)
      },
      dwellDays: Number(containerForm.dwellDays),
      sealNo: containerForm.sealNo,
      tempSetpoint: containerForm.type === 'Reefer' ? Number(containerForm.tempSetpoint) : undefined,
      vesselName: containerForm.vesselName || undefined
    };

    if (editingContainerId) {
      onUpdateContainer(editingContainerId, payload);
    } else {
      onAddContainer(payload);
    }
    setIsContainerModalOpen(false);
  };

  // Handle open vessel form (Add / Edit)
  const handleOpenVesselForm = (v?: VesselMaster) => {
    if (v) {
      setEditingVesselId(v.id);
      setVesselForm({
        name: v.name,
        imoNo: v.imoNo,
        callSign: v.callSign,
        lengthMeters: v.lengthMeters,
        berthId: v.berthId,
        shippingAgent: v.shippingAgent,
        eta: v.eta.slice(0, 16),
        etd: v.etd.slice(0, 16),
        status: v.status,
        totalTeusPlanned: v.totalTeusPlanned,
        teusLoaded: v.teusLoaded,
        teusDischarged: v.teusDischarged,
        quayCraneAssigned: v.quayCraneAssigned
      });
    } else {
      setEditingVesselId(null);
      clearVesselForm();
    }
    setIsVesselModalOpen(true);
  };

  const handleSaveVessel = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: vesselForm.name.trim(),
      imoNo: vesselForm.imoNo.trim(),
      callSign: vesselForm.callSign.trim(),
      lengthMeters: Number(vesselForm.lengthMeters),
      berthId: vesselForm.berthId,
      shippingAgent: vesselForm.shippingAgent,
      eta: new Date(vesselForm.eta).toISOString(),
      etd: new Date(vesselForm.etd).toISOString(),
      status: vesselForm.status,
      totalTeusPlanned: Number(vesselForm.totalTeusPlanned),
      teusLoaded: Number(vesselForm.teusLoaded),
      teusDischarged: Number(vesselForm.teusDischarged),
      quayCraneAssigned: vesselForm.quayCraneAssigned
    };

    if (editingVesselId) {
      onUpdateVessel(editingVesselId, payload);
    } else {
      onAddVessel(payload);
    }
    setIsVesselModalOpen(false);
  };

  // Handle open Yard Block form
  const handleOpenYardForm = (b?: YardBlockMaster) => {
    if (b) {
      setEditingYardId(b.id);
      setYardForm({
        code: b.code,
        name: b.name,
        maxBays: b.maxBays,
        maxRows: b.maxRows,
        maxTiers: b.maxTiers,
        isReeferZone: b.isReeferZone,
        totalCapacityTeus: b.totalCapacityTeus,
        currentOccupancyTeus: b.currentOccupancyTeus,
        category: b.category
      });
    } else {
      setEditingYardId(null);
      clearYardForm();
    }
    setIsYardModalOpen(true);
  };

  const handleSaveYard = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: yardForm.code.trim().toUpperCase(),
      name: yardForm.name.trim(),
      maxBays: Number(yardForm.maxBays),
      maxRows: Number(yardForm.maxRows),
      maxTiers: Number(yardForm.maxTiers),
      isReeferZone: yardForm.isReeferZone,
      totalCapacityTeus: Number(yardForm.totalCapacityTeus),
      currentOccupancyTeus: Number(yardForm.currentOccupancyTeus),
      category: yardForm.category
    };

    if (editingYardId) {
      onUpdateYardBlock(editingYardId, payload);
    } else {
      onAddYardBlock(payload);
    }
    setIsYardModalOpen(false);
  };

  // Handle open Shipping line form
  const handleOpenLineForm = (s?: ShippingLineMaster) => {
    if (s) {
      setEditingLineId(s.id);
      setLineForm({
        code: s.code,
        name: s.name,
        country: s.country,
        contactPerson: s.contactPerson,
        phone: s.phone,
        email: s.email,
        colorHex: s.colorHex
      });
    } else {
      setEditingLineId(null);
      clearLineForm();
    }
    setIsLineModalOpen(true);
  };

  const handleSaveLine = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: lineForm.code.trim().toUpperCase(),
      name: lineForm.name.trim(),
      country: lineForm.country.trim(),
      contactPerson: lineForm.contactPerson.trim(),
      phone: lineForm.phone.trim(),
      email: lineForm.email.trim(),
      colorHex: lineForm.colorHex
    };

    if (editingLineId) {
      onUpdateShippingLine(editingLineId, payload);
    } else {
      onAddShippingLine(payload);
    }
    setIsLineModalOpen(false);
  };

  const executeDelete = () => {
    if (!deleteConfirmItem) return;
    if (deleteConfirmItem.type === 'container') onDeleteContainer(deleteConfirmItem.id);
    if (deleteConfirmItem.type === 'vessel') onDeleteVessel(deleteConfirmItem.id);
    if (deleteConfirmItem.type === 'yard') onDeleteYardBlock(deleteConfirmItem.id);
    if (deleteConfirmItem.type === 'line') onDeleteShippingLine(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
  };

  // Filtered containers
  const filteredContainers = containers.filter(c => {
    const matchesSearch = searchTerm === '' ||
      c.containerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shippingLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sealNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.isoCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = sizeFilter === 'ALL' || c.size === sizeFilter;
    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesSize && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <Container className="w-7 h-7 text-cyan-600" />
            Master Data Terminal Peti Kemas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pengelolaan database terpadu peti kemas, armada kapal, blok lapangan penumpukan, dan agen pelayaran.
          </p>
        </div>

        {/* Sub-tabs buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('containers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'containers' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Peti Kemas ({containers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('vessels')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'vessels' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jadwal Kapal ({vessels.length})
          </button>
          <button
            onClick={() => setActiveSubTab('yard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'yard' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blok Lapangan ({yardBlocks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('lines')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'lines' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pelayaran ({shippingLines.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MASTER PETI KEMAS (CONTAINERS) */}
      {/* ======================================================== */}
      {activeSubTab === 'containers' && (
        <div className="space-y-4">
          {/* Controls bar: Search, Filters, Add Button */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search input */}
              <div className="relative min-w-[240px] flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari No. Kontainer, Shipping Line, Segel..."
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono-code placeholder:font-sans"
                />
              </div>

              {/* Size filter */}
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="ALL">Semua Ukuran (20/40/45)</option>
                <option value="20ft">20 Feet (1 TEU)</option>
                <option value="40ft">40 Feet (2 TEUs)</option>
                <option value="45ft">45 Feet High Cube</option>
              </select>

              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="ALL">Semua Tipe (Dry/Reefer/dll)</option>
                <option value="Dry">Dry Container</option>
                <option value="Reefer">Reefer (Pendingin)</option>
                <option value="Tank">Tank Container</option>
                <option value="Open Top">Open Top</option>
                <option value="Flat Rack">Flat Rack</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="ALL">Semua Status Muatan</option>
                <option value="FCL">FCL (Full Container)</option>
                <option value="LCL">LCL (Less Container)</option>
                <option value="Empty">Empty (Kosong)</option>
              </select>
            </div>

            {/* Add container button */}
            <button
              onClick={() => handleOpenContainerForm()}
              id="btn-add-container-master"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Peti Kemas (CRUD)</span>
            </button>
          </div>

          {/* Table of Containers */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">No. Peti Kemas / ISO</th>
                    <th className="py-3 px-4">Spesifikasi</th>
                    <th className="py-3 px-4">Pelayaran & Kapal</th>
                    <th className="py-3 px-4">Berat Kotor</th>
                    <th className="py-3 px-4">Posisi Yard Slot</th>
                    <th className="py-3 px-4">Status & Dwell</th>
                    <th className="py-3 px-4 text-center">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredContainers.map(cnt => {
                    const isOverDwell = cnt.dwellDays > 5;
                    return (
                      <tr key={cnt.id} className="hover:bg-slate-50/80 transition-all">
                        {/* Container No */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 font-mono-code text-sm">
                              {cnt.containerNo}
                            </span>
                            <span className="text-[10px] font-mono-code bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                              {cnt.isoCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">Segel: {cnt.sealNo}</div>
                        </td>

                        {/* Specs */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cnt.size === '20ft' ? 'bg-cyan-50 text-cyan-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {cnt.size}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cnt.type === 'Reefer' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {cnt.type}
                            </span>
                          </div>
                          {cnt.type === 'Reefer' && (
                            <div className="text-[10px] text-sky-700 flex items-center gap-1 mt-0.5 font-semibold">
                              <ThermometerSnowflake className="w-3 h-3" />
                              {cnt.tempSetpoint}°C
                            </div>
                          )}
                        </td>

                        {/* Line & Vessel */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{cnt.shippingLine}</div>
                          <div className="text-[11px] text-slate-600">{cnt.vesselName || 'Ex-Gate In Truck'}</div>
                        </td>

                        {/* Weights */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono-code font-bold text-slate-800">
                            {cnt.currentGrossWeightKg.toLocaleString('id-ID')} Kg
                          </div>
                          <div className="text-[10px] text-slate-600">
                            Max: {cnt.maxGrossWeightKg.toLocaleString('id-ID')} Kg
                          </div>
                        </td>

                        {/* Yard Slot */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono-code font-bold text-cyan-900 bg-cyan-50 border border-cyan-200 px-2 py-1 rounded inline-block">
                            {cnt.yardSlot.block}-B{cnt.yardSlot.bay}-R{cnt.yardSlot.row}-T{cnt.yardSlot.tier}
                          </span>
                        </td>

                        {/* Status & Dwell */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cnt.status === 'FCL'
                                ? 'bg-emerald-100 text-emerald-800'
                                : cnt.status === 'LCL'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {cnt.status}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isOverDwell ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {cnt.dwellDays} Hari
                            </span>
                          </div>
                        </td>

                        {/* CRUD Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => onViewContainerDetail ? onViewContainerDetail(cnt) : handleOpenContainerForm(cnt)}
                              className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg cursor-pointer transition-all"
                              title="Lihat Detail & Barcode"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenContainerForm(cnt)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                              title="Edit Peti Kemas (Update)"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmItem({
                                type: 'container',
                                id: cnt.id,
                                label: `Peti Kemas ${cnt.containerNo}`
                              })}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                              title="Hapus Peti Kemas (Delete)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredContainers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Tidak ada peti kemas yang sesuai dengan kriteria filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MASTER JADWAL KAPAL (VESSELS) */}
      {/* ======================================================== */}
      {activeSubTab === 'vessels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Jadwal Kedatangan & Sandar Kapal (Berthing Master)</h2>
              <p className="text-xs text-slate-500">Alokasi dermaga, crane, dan kuota bongkar muat TEUs</p>
            </div>
            <button
              onClick={() => handleOpenVesselForm()}
              id="btn-add-vessel"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal Kapal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vessels.map(v => {
              const totalOps = v.teusLoaded + v.teusDischarged;
              const progressPct = v.totalTeusPlanned > 0
                ? Math.round((totalOps / v.totalTeusPlanned) * 100)
                : 0;

              return (
                <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Ship className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">{v.name}</h3>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{v.imoNo}</span>
                            <span>•</span>
                            <span>Call Sign: {v.callSign}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        v.status === 'Berthing'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'Anchored'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-600 block text-[10px] uppercase font-bold">Dermaga / Quay:</span>
                        <span className="font-bold text-slate-900">{v.berthId}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[10px] uppercase font-bold">Panjang Kapal (LOA):</span>
                        <span className="font-mono-code font-bold text-slate-900">{v.lengthMeters} Meter</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[10px] uppercase font-bold">ETA (Estimasi Tiba):</span>
                        <span className="text-slate-800">{new Date(v.eta).toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[10px] uppercase font-bold">ETD (Estimasi Berangkat):</span>
                        <span className="text-slate-800">{new Date(v.etd).toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Stevedoring Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700">Kemajuan Bongkar Muat</span>
                        <span className="text-cyan-700 font-bold">{totalOps} / {v.totalTeusPlanned} TEUs ({progressPct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-600 rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Discharge: {v.teusDischarged} TEUs | Load: {v.teusLoaded} TEUs</span>
                        <span className="font-semibold text-slate-700">Crane: {v.quayCraneAssigned.join(', ') || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Agen: {v.shippingAgent}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenVesselForm(v)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                        title="Edit Kapal"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem({
                          type: 'vessel',
                          id: v.id,
                          label: `Kapal ${v.name}`
                        })}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                        title="Hapus Kapal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: MASTER BLOK LAPANGAN (YARD BLOCKS) */}
      {/* ======================================================== */}
      {activeSubTab === 'yard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Master Blok Lapangan Penumpukan (Yard Blocks)</h2>
              <p className="text-xs text-slate-500">Konfigurasi kapasitas Bay, Row, Tier, dan zona reefer</p>
            </div>
            <button
              onClick={() => handleOpenYardForm()}
              id="btn-add-yard-block"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Blok Lapangan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {yardBlocks.map(yb => {
              const occupancyPct = Math.round((yb.currentOccupancyTeus / yb.totalCapacityTeus) * 100);
              return (
                <div key={yb.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-lg font-black text-slate-900 font-mono-code">{yb.code}</span>
                        <h3 className="text-xs font-bold text-slate-600 mt-0.5">{yb.name}</h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        yb.isReeferZone ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {yb.category}
                      </span>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Konfigurasi Slot:</span>
                        <span className="font-mono-code font-bold">
                          {yb.maxBays} Bays × {yb.maxRows} Rows × {yb.maxTiers} Tiers
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fasilitas Reefer Plug:</span>
                        <span className="font-bold">{yb.isReeferZone ? 'Tersedia (Cold Chain)' : 'Tidak Ada'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kapasitas Maksimal:</span>
                        <span className="font-mono-code font-bold text-cyan-700">{yb.totalCapacityTeus} TEUs</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Okupansi Terisi</span>
                        <span className="font-bold text-slate-900">{yb.currentOccupancyTeus} TEUs ({occupancyPct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            occupancyPct > 80 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-cyan-600'
                          }`}
                          style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenYardForm(yb)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                      title="Edit Blok Lapangan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmItem({
                        type: 'yard',
                        id: yb.id,
                        label: `Blok Lapangan ${yb.code}`
                      })}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                      title="Hapus Blok Lapangan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: MASTER PELAYARAN (SHIPPING LINES) */}
      {/* ======================================================== */}
      {activeSubTab === 'lines' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Master Perusahaan Pelayaran (Shipping Lines)</h2>
              <p className="text-xs text-slate-500">Mitra operator kapal kontainer internasional dan domestik</p>
            </div>
            <button
              onClick={() => handleOpenLineForm()}
              id="btn-add-shipping-line"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pelayaran</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shippingLines.map(sl => (
              <div key={sl.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs"
                        style={{ backgroundColor: sl.colorHex }}
                      >
                        {sl.code}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">{sl.name}</h3>
                        <p className="text-[11px] text-slate-500">{sl.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Kontak Operasional:</span>
                      <span className="font-semibold text-slate-900">{sl.contactPerson}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Telepon:</span>
                      <span className="font-mono-code text-slate-800">{sl.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Email:</span>
                      <span className="text-cyan-700 underline text-[11px]">{sl.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenLineForm(sl)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                    title="Edit Pelayaran"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmItem({
                      type: 'line',
                      id: sl.id,
                      label: `Pelayaran ${sl.name}`
                    })}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                    title="Hapus Pelayaran"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT CONTAINER */}
      {/* ======================================================== */}
      {isContainerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Container className="w-5 h-5 text-cyan-600" />
                {editingContainerId ? 'Edit Data Peti Kemas' : 'Tambah Peti Kemas Baru'}
              </h3>
              <button
                onClick={() => setIsContainerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-600">
                Mode Input: <strong className="text-slate-900">Ketik Bebas Sesuai Keinginan</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearContainerForm}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Kosongkan Form
                </button>
                <button
                  type="button"
                  onClick={fillContainerExample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 cursor-pointer transition-all"
                >
                  Isi Contoh Cepat
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveContainer} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Container No */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nomor Peti Kemas *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={containerForm.containerNo}
                    onChange={(e) => setContainerForm({ ...containerForm, containerNo: e.target.value })}
                    placeholder="Ketik nomor kontainer (misal: TGHU-849201-4)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Bisa diketik format apa saja sesuai kebutuhan</span>
                </div>

                {/* ISO Code */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Kode ISO (Tipe/Ukuran)
                  </label>
                  <input
                    type="text"
                    list="dl-container-isocodes"
                    value={containerForm.isoCode}
                    onChange={(e) => setContainerForm({ ...containerForm, isoCode: e.target.value.toUpperCase() })}
                    placeholder="Ketik atau pilih (misal: 42G1, 22G1, 45R1)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                  />
                  <datalist id="dl-container-isocodes">
                    <option value="22G1">22G1 (20ft General Standard)</option>
                    <option value="42G1">42G1 (40ft General Standard)</option>
                    <option value="45G1">45G1 (40ft High Cube)</option>
                    <option value="45R1">45R1 (40ft High Cube Reefer)</option>
                    <option value="22T1">22T1 (20ft ISO Tank Container)</option>
                    <option value="22U1">22U1 (20ft Open Top)</option>
                    <option value="42P1">42P1 (40ft Flat Rack)</option>
                  </datalist>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Ukuran (Size)
                  </label>
                  <select
                    value={containerForm.size}
                    onChange={(e) => setContainerForm({ ...containerForm, size: e.target.value as ContainerSize })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="20ft">20 Feet (1 TEU)</option>
                    <option value="40ft">40 Feet (2 TEUs)</option>
                    <option value="45ft">45 Feet High Cube</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Tipe Peti Kemas
                  </label>
                  <select
                    value={containerForm.type}
                    onChange={(e) => setContainerForm({ ...containerForm, type: e.target.value as ContainerType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="Dry">Dry Container (Standar)</option>
                    <option value="Reefer">Reefer (Pendingin Cold Chain)</option>
                    <option value="Tank">Tank Container (Cairan)</option>
                    <option value="Open Top">Open Top (Muatan Tinggi)</option>
                    <option value="Flat Rack">Flat Rack (Muatan Berat)</option>
                  </select>
                </div>

                {/* Shipping Line - Allows Free Typing + Datalist Suggestions */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Perusahaan Pelayaran (Owner) *
                  </label>
                  <input
                    type="text"
                    required
                    list="dl-container-shippinglines"
                    value={containerForm.shippingLine}
                    onChange={(e) => setContainerForm({ ...containerForm, shippingLine: e.target.value })}
                    placeholder="Ketik pelayaran bebas atau pilih dari daftar..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <datalist id="dl-container-shippinglines">
                    {shippingLines.map(sl => (
                      <option key={sl.id} value={sl.name}>{sl.name} ({sl.code})</option>
                    ))}
                    <option value="Maersk Line" />
                    <option value="Evergreen Marine Corp" />
                    <option value="CMA CGM Group" />
                    <option value="Ocean Network Express (ONE)" />
                    <option value="MSC Mediterranean Shipping" />
                    <option value="PT Samudera Indonesia Tbk" />
                    <option value="PT Meratus Line" />
                    <option value="PT Temas Line" />
                  </datalist>
                </div>

                {/* Status Muatan */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Status Muatan
                  </label>
                  <select
                    value={containerForm.status}
                    onChange={(e) => setContainerForm({ ...containerForm, status: e.target.value as ContainerStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="FCL">FCL - Full Container Load</option>
                    <option value="LCL">LCL - Less Container Load</option>
                    <option value="Empty">Empty - Kosong</option>
                  </select>
                </div>

                {/* Gross Weight */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Berat Kotor Saat Ini (Kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={containerForm.currentGrossWeightKg}
                    onChange={(e) => setContainerForm({ ...containerForm, currentGrossWeightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {/* Seal No */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nomor Segel (Seal No)
                  </label>
                  <input
                    type="text"
                    value={containerForm.sealNo}
                    onChange={(e) => setContainerForm({ ...containerForm, sealNo: e.target.value })}
                    placeholder="Ketik nomor segel (misal: SL-982310)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                  />
                </div>
              </div>

              {/* Vessel Name (Optional, Free typing + Datalist) */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nama Kapal Pengangkut (Opsional)
                </label>
                <input
                  type="text"
                  list="dl-container-vessels"
                  value={containerForm.vesselName}
                  onChange={(e) => setContainerForm({ ...containerForm, vesselName: e.target.value })}
                  placeholder="Ketik nama kapal bebas atau pilih dari kapal yang ada..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <datalist id="dl-container-vessels">
                  {vessels.map(v => (
                    <option key={v.id} value={v.name}>{v.name} ({v.berthId})</option>
                  ))}
                </datalist>
              </div>

              {/* Slot Allocation inside Yard */}
              <div className="p-3.5 bg-cyan-50/50 rounded-xl border border-cyan-100">
                <span className="block text-xs font-bold text-cyan-950 uppercase mb-2">
                  Alokasi Posisi Lapangan (Yard Slot) - Bebas Ketik
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Blok</label>
                    <input
                      type="text"
                      list="dl-container-blocks"
                      value={containerForm.block}
                      onChange={(e) => setContainerForm({ ...containerForm, block: e.target.value.toUpperCase() })}
                      placeholder="BLK-A"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono-code font-bold uppercase focus:ring-2 focus:ring-cyan-500"
                    />
                    <datalist id="dl-container-blocks">
                      {yardBlocks.map(yb => (
                        <option key={yb.id} value={yb.code}>{yb.code} ({yb.name})</option>
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Bay (Panjang)</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={containerForm.bay}
                      onChange={(e) => setContainerForm({ ...containerForm, bay: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono-code font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Row (Lebar)</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={containerForm.row}
                      onChange={(e) => setContainerForm({ ...containerForm, row: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono-code font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Tier (Susun)</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={containerForm.tier}
                      onChange={(e) => setContainerForm({ ...containerForm, tier: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono-code font-bold"
                    />
                  </div>
                </div>
              </div>

              {containerForm.type === 'Reefer' && (
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <ThermometerSnowflake className="w-4 h-4 text-sky-600" />
                    Suhu Pendingin Reefer (°C)
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    value={containerForm.tempSetpoint}
                    onChange={(e) => setContainerForm({ ...containerForm, tempSetpoint: Number(e.target.value) })}
                    className="w-24 px-2 py-1 bg-white border border-sky-300 rounded text-xs font-mono-code font-bold"
                  />
                </div>
              )}

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsContainerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-container"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  {editingContainerId ? 'Simpan Perubahan' : 'Simpan Peti Kemas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT VESSEL */}
      {/* ======================================================== */}
      {isVesselModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ship className="w-5 h-5 text-cyan-600" />
                {editingVesselId ? 'Edit Jadwal Kapal' : 'Tambah Jadwal Kapal Baru'}
              </h3>
              <button
                onClick={() => setIsVesselModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-600">
                Mode Input: <strong className="text-slate-900">Ketik Bebas Sesuai Keinginan</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearVesselForm}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Kosongkan Form
                </button>
                <button
                  type="button"
                  onClick={fillVesselExample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 cursor-pointer transition-all"
                >
                  Isi Contoh Cepat
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveVessel} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nama Kapal (Vessel Name) *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={vesselForm.name}
                    onChange={(e) => setVesselForm({ ...vesselForm, name: e.target.value })}
                    placeholder="Ketik nama kapal (misal: MV Meratus Jayakarta)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nomor IMO *
                  </label>
                  <input
                    type="text"
                    required
                    value={vesselForm.imoNo}
                    onChange={(e) => setVesselForm({ ...vesselForm, imoNo: e.target.value })}
                    placeholder="Ketik IMO (misal: IMO 9821340)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Call Sign
                  </label>
                  <input
                    type="text"
                    value={vesselForm.callSign}
                    onChange={(e) => setVesselForm({ ...vesselForm, callSign: e.target.value.toUpperCase() })}
                    placeholder="Ketik call sign (misal: PK-99X)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Dermaga (Quay Berth)
                  </label>
                  <input
                    type="text"
                    list="dl-vessel-berths"
                    value={vesselForm.berthId}
                    onChange={(e) => setVesselForm({ ...vesselForm, berthId: e.target.value })}
                    placeholder="Ketik dermaga atau pilih..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <datalist id="dl-vessel-berths">
                    <option value="Dermaga 01-A (Quay 1)" />
                    <option value="Dermaga 02-B (Quay 2)" />
                    <option value="Dermaga 03-C (Domestik)" />
                    <option value="Dermaga Khusus Curah" />
                    <option value="Waiting Outer Anchorage" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Status Kapal
                  </label>
                  <select
                    value={vesselForm.status}
                    onChange={(e) => setVesselForm({ ...vesselForm, status: e.target.value as VesselStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    <option value="Berthing">Berthing (Sandar di Dermaga)</option>
                    <option value="Anchored">Anchored (Lego Jangkar)</option>
                    <option value="Sailing">Sailing (Dalam Pelayaran)</option>
                    <option value="Departed">Departed (Selesai/Berangkat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Panjang Kapal (LOA - Meter)
                  </label>
                  <input
                    type="number"
                    min={20}
                    value={vesselForm.lengthMeters}
                    onChange={(e) => setVesselForm({ ...vesselForm, lengthMeters: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Estimasi Tiba (ETA)
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={vesselForm.eta}
                    onChange={(e) => setVesselForm({ ...vesselForm, eta: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Estimasi Berangkat (ETD)
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={vesselForm.etd}
                    onChange={(e) => setVesselForm({ ...vesselForm, etd: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Rencana Bongkar Muat (TEUs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={vesselForm.totalTeusPlanned}
                    onChange={(e) => setVesselForm({ ...vesselForm, totalTeusPlanned: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Agen Pelayaran *
                  </label>
                  <input
                    type="text"
                    required
                    list="dl-vessel-agents"
                    value={vesselForm.shippingAgent}
                    onChange={(e) => setVesselForm({ ...vesselForm, shippingAgent: e.target.value })}
                    placeholder="Ketik agen kapal atau pilih..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <datalist id="dl-vessel-agents">
                    {shippingLines.map(sl => (
                      <option key={sl.id} value={sl.name} />
                    ))}
                    <option value="PT Samudera Indonesia Tbk" />
                    <option value="PT Pelayaran Meratus" />
                    <option value="PT Tanto Intim Line" />
                    <option value="PT SPIL (Salam Pacific Indonesia Lines)" />
                  </datalist>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsVesselModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-vessel"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  {editingVesselId ? 'Simpan Perubahan' : 'Simpan Jadwal Kapal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT YARD BLOCK */}
      {/* ======================================================== */}
      {isYardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-600" />
                {editingYardId ? 'Edit Blok Lapangan' : 'Tambah Blok Lapangan Baru'}
              </h3>
              <button
                onClick={() => setIsYardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-600">
                Mode Input: <strong className="text-slate-900">Ketik Bebas Sesuai Keinginan</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearYardForm}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Kosongkan Form
                </button>
                <button
                  type="button"
                  onClick={fillYardExample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 cursor-pointer transition-all"
                >
                  Isi Contoh Cepat
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveYard} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kode Blok *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={yardForm.code}
                    onChange={(e) => setYardForm({ ...yardForm, code: e.target.value.toUpperCase() })}
                    placeholder="Ketik kode blok (misal: BLK-E, DEPOT-01)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kategori Lapangan</label>
                  <select
                    value={yardForm.category}
                    onChange={(e) => setYardForm({ ...yardForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Import">Import FCL</option>
                    <option value="Export">Export Ready</option>
                    <option value="Domestic">Domestic Antar Pulau</option>
                    <option value="Reefer">Reefer Cold Chain</option>
                    <option value="Empty">Empty Depo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nama Blok Lengkap *</label>
                <input
                  type="text"
                  required
                  value={yardForm.name}
                  onChange={(e) => setYardForm({ ...yardForm, name: e.target.value })}
                  placeholder="Ketik nama deskripsi blok penumpukan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Bays</label>
                  <input
                    type="number"
                    min={1}
                    value={yardForm.maxBays}
                    onChange={(e) => setYardForm({ ...yardForm, maxBays: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono-code font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Rows</label>
                  <input
                    type="number"
                    min={1}
                    value={yardForm.maxRows}
                    onChange={(e) => setYardForm({ ...yardForm, maxRows: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono-code font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tiers (Tinggi)</label>
                  <input
                    type="number"
                    min={1}
                    value={yardForm.maxTiers}
                    onChange={(e) => setYardForm({ ...yardForm, maxTiers: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono-code font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Total Kapasitas TEUs</label>
                  <input
                    type="number"
                    min={1}
                    value={yardForm.totalCapacityTeus}
                    onChange={(e) => setYardForm({ ...yardForm, totalCapacityTeus: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="chk-reefer-zone"
                    checked={yardForm.isReeferZone}
                    onChange={(e) => setYardForm({ ...yardForm, isReeferZone: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                  />
                  <label htmlFor="chk-reefer-zone" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Zona Reefer Plug
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsYardModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-yard"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  {editingYardId ? 'Simpan Perubahan' : 'Simpan Blok Lapangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT SHIPPING LINE */}
      {/* ======================================================== */}
      {isLineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-600" />
                {editingLineId ? 'Edit Pelayaran' : 'Tambah Pelayaran Baru'}
              </h3>
              <button
                onClick={() => setIsLineModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-600">
                Mode Input: <strong className="text-slate-900">Ketik Bebas Sesuai Keinginan</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearLineForm}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Kosongkan Form
                </button>
                <button
                  type="button"
                  onClick={fillLineExample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 cursor-pointer transition-all"
                >
                  Isi Contoh Cepat
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveLine} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kode Line *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={lineForm.code}
                    onChange={(e) => setLineForm({ ...lineForm, code: e.target.value.toUpperCase() })}
                    placeholder="Ketik kode (misal: MSK, ONE, PIL)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Warna Label</label>
                  <input
                    type="color"
                    value={lineForm.colorHex}
                    onChange={(e) => setLineForm({ ...lineForm, colorHex: e.target.value })}
                    className="w-full h-9 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nama Perusahaan *</label>
                <input
                  type="text"
                  required
                  value={lineForm.name}
                  onChange={(e) => setLineForm({ ...lineForm, name: e.target.value })}
                  placeholder="Ketik nama perusahaan pelayaran bebas"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Negara Asal</label>
                <input
                  type="text"
                  value={lineForm.country}
                  onChange={(e) => setLineForm({ ...lineForm, country: e.target.value })}
                  placeholder="Ketik negara asal (misal: Indonesia, Singapura, dll)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kontak Person PIC</label>
                <input
                  type="text"
                  value={lineForm.contactPerson}
                  onChange={(e) => setLineForm({ ...lineForm, contactPerson: e.target.value })}
                  placeholder="Ketik nama PIC operasional"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={lineForm.phone}
                    onChange={(e) => setLineForm({ ...lineForm, phone: e.target.value })}
                    placeholder="Ketik no telepon / WhatsApp"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={lineForm.email}
                    onChange={(e) => setLineForm({ ...lineForm, email: e.target.value })}
                    placeholder="Ketik alamat email"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLineModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-line"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  {editingLineId ? 'Simpan Perubahan' : 'Simpan Pelayaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Data</h3>
            <p className="text-xs text-slate-600 mt-1">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirmItem.label}</strong>? Tindakan ini akan menghapus data dari sistem dan cloud database.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                id="btn-confirm-delete"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 cursor-pointer"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
