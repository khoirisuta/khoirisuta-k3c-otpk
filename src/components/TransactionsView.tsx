import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Ship,
  MoveRight,
  Plus,
  Search,
  Printer,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  FileText,
  ShieldCheck,
  X,
  Container as ContainerIcon,
  Layers
} from 'lucide-react';
import {
  GateInTransaction,
  GateOutTransaction,
  StevedoringTransaction,
  ContainerMaster,
  VesselMaster,
  YardBlockMaster,
  ShippingLineMaster,
  ContainerSize,
  ContainerType,
  GateInStatus,
  CustomsClearanceStatus
} from '../types';

interface TransactionsViewProps {
  gateInList: GateInTransaction[];
  gateOutList: GateOutTransaction[];
  stevedoringList: StevedoringTransaction[];
  containers: ContainerMaster[];
  vessels: VesselMaster[];
  yardBlocks: YardBlockMaster[];
  shippingLines: ShippingLineMaster[];
  onAddGateIn: (item: Omit<GateInTransaction, 'id' | 'eirNo' | 'timestamp'>) => GateInTransaction;
  onUpdateGateIn: (id: string, item: Partial<GateInTransaction>) => void;
  onDeleteGateIn: (id: string) => void;
  onAddGateOut: (item: Omit<GateOutTransaction, 'id' | 'gatePassNo' | 'timestamp'>) => GateOutTransaction;
  onUpdateGateOut: (id: string, item: Partial<GateOutTransaction>) => void;
  onDeleteGateOut: (id: string) => void;
  onAddStevedoring: (item: Omit<StevedoringTransaction, 'id' | 'timestamp'>) => void;
  onUpdateStevedoring: (id: string, item: Partial<StevedoringTransaction>) => void;
  onDeleteStevedoring: (id: string) => void;
  onPrintSlip: (type: 'gate-in' | 'gate-out', record: any) => void;
  initialSubTab?: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  gateInList,
  gateOutList,
  stevedoringList,
  containers,
  vessels,
  yardBlocks,
  shippingLines,
  onAddGateIn,
  onUpdateGateIn,
  onDeleteGateIn,
  onAddGateOut,
  onUpdateGateOut,
  onDeleteGateOut,
  onAddStevedoring,
  onUpdateStevedoring,
  onDeleteStevedoring,
  onPrintSlip,
  initialSubTab = 'gate-in'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'gate-in' | 'gate-out' | 'stevedoring' | 'shifting'>(
    (initialSubTab as any) || 'gate-in'
  );

  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isGateInModalOpen, setIsGateInModalOpen] = useState(false);
  const [editingGateInId, setEditingGateInId] = useState<string | null>(null);

  const [isGateOutModalOpen, setIsGateOutModalOpen] = useState(false);
  const [editingGateOutId, setEditingGateOutId] = useState<string | null>(null);

  const [isStevedoringModalOpen, setIsStevedoringModalOpen] = useState(false);
  const [editingStevedoringId, setEditingStevedoringId] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'gate-in' | 'gate-out' | 'stevedoring';
    id: string;
    label: string;
  } | null>(null);

  // --- Gate-In Form State ---
  const [gateInForm, setGateInForm] = useState({
    containerNo: '',
    size: '40ft' as ContainerSize,
    type: 'Dry' as ContainerType,
    truckPlate: '',
    driverName: '',
    shippingLine: shippingLines[0]?.name || '',
    grossWeightKg: 0,
    sealNo: '',
    block: yardBlocks[0]?.code || 'BLK-A',
    bay: 1,
    row: 1,
    tier: 1,
    gateLane: 'Lane 01 (Auto-OCR)',
    status: 'Completed' as GateInStatus,
    notes: ''
  });

  // --- Gate-Out Form State ---
  const [gateOutForm, setGateOutForm] = useState({
    containerNo: '',
    doNumber: '',
    sppbNumber: '',
    truckPlate: '',
    driverName: '',
    destination: '',
    shippingLine: '',
    customsStatus: 'Clear' as CustomsClearanceStatus,
    status: 'Completed' as 'Completed' | 'Pending Clearance',
    notes: ''
  });

  // --- Stevedoring Form State ---
  const [stvForm, setStvForm] = useState({
    vesselId: vessels[0]?.id || '',
    vesselName: vessels[0]?.name || '',
    type: 'Discharge' as 'Discharge' | 'Loading',
    containerNo: '',
    size: '40ft' as ContainerSize,
    craneId: 'QC-01',
    rtgOperator: '',
    hatchBay: '',
    status: 'Completed' as 'Completed' | 'In Progress' | 'Scheduled'
  });

  // --- Helper Functions to Clear & Fill Forms Freely ---
  const clearGateInForm = () => {
    setGateInForm({
      containerNo: '',
      size: '40ft',
      type: 'Dry',
      truckPlate: '',
      driverName: '',
      shippingLine: shippingLines[0]?.name || '',
      grossWeightKg: 0,
      sealNo: '',
      block: yardBlocks[0]?.code || 'BLK-A',
      bay: 1,
      row: 1,
      tier: 1,
      gateLane: 'Lane 01 (Auto-OCR)',
      status: 'Completed',
      notes: ''
    });
  };

  const fillGateInExample = () => {
    setGateInForm({
      containerNo: `MSKU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`,
      size: '40ft',
      type: 'Dry',
      truckPlate: `B ${Math.floor(1000 + Math.random() * 8999)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      driverName: 'Supriyadi',
      shippingLine: shippingLines[0]?.name || 'Evergreen Marine Corp',
      grossWeightKg: 26800,
      sealNo: `SL-${Math.floor(100000 + Math.random() * 899999)}`,
      block: yardBlocks[0]?.code || 'BLK-A',
      bay: 2,
      row: 1,
      tier: 1,
      gateLane: 'Lane 02 (Weighbridge)',
      status: 'Completed',
      notes: 'Pemeriksaan fisik gate prima'
    });
  };

  const clearGateOutForm = () => {
    setGateOutForm({
      containerNo: '',
      doNumber: '',
      sppbNumber: '',
      truckPlate: '',
      driverName: '',
      destination: '',
      shippingLine: '',
      customsStatus: 'Clear',
      status: 'Completed',
      notes: ''
    });
  };

  const fillGateOutExample = () => {
    const randomContainer = containers[Math.floor(Math.random() * containers.length)];
    setGateOutForm({
      containerNo: randomContainer ? randomContainer.containerNo : 'TGHU-849201-4',
      doNumber: `DO-${Math.floor(100000 + Math.random() * 899999)}`,
      sppbNumber: `SPPB-BC-${Math.floor(100000 + Math.random() * 899999)}`,
      truckPlate: `B ${Math.floor(1000 + Math.random() * 8999)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      driverName: 'Bambang Irawan',
      destination: 'Kawasan Industri MM2100 Cibitung',
      shippingLine: randomContainer ? randomContainer.shippingLine : (shippingLines[0]?.name || 'Maersk Line'),
      customsStatus: 'Clear',
      status: 'Completed',
      notes: 'Dokumen SPPB Bea Cukai lengkap jalur hijau'
    });
  };

  const clearStevedoringForm = () => {
    const chosenVessel = vessels.find(v => v.status === 'Berthing') || vessels[0];
    setStvForm({
      vesselId: chosenVessel ? chosenVessel.id : '',
      vesselName: chosenVessel ? chosenVessel.name : '',
      type: 'Discharge',
      containerNo: '',
      size: '40ft',
      craneId: 'QC-01',
      rtgOperator: '',
      hatchBay: '',
      status: 'Completed'
    });
  };

  const fillStevedoringExample = () => {
    const chosenVessel = vessels.find(v => v.status === 'Berthing') || vessels[0];
    setStvForm({
      vesselId: chosenVessel ? chosenVessel.id : '',
      vesselName: chosenVessel ? chosenVessel.name : '',
      type: 'Discharge',
      containerNo: `CMAU-${Math.floor(100000 + Math.random() * 899999)}-${Math.floor(Math.random() * 9)}`,
      size: '40ft',
      craneId: 'QC-01',
      rtgOperator: 'Sutrisno',
      hatchBay: 'Bay 16 On-Deck',
      status: 'Completed'
    });
  };

  // --- Yard Shifting State ---
  const [shiftForm, setShiftForm] = useState({
    containerId: containers[0]?.id || '',
    targetBlock: yardBlocks[0]?.code || 'BLK-B',
    targetBay: 1,
    targetRow: 1,
    targetTier: 1,
    reason: 'Persiapan Muat Ekspor ke Kapal'
  });
  const [shiftSuccessMsg, setShiftSuccessMsg] = useState('');

  // Open Gate-In Form
  const handleOpenGateIn = (item?: GateInTransaction) => {
    if (item) {
      setEditingGateInId(item.id);
      const slotParts = item.allocatedSlot.split('-');
      setGateInForm({
        containerNo: item.containerNo,
        size: item.size,
        type: item.type,
        truckPlate: item.truckPlate,
        driverName: item.driverName,
        shippingLine: item.shippingLine,
        grossWeightKg: item.grossWeightKg,
        sealNo: item.sealNo,
        block: slotParts[0] ? `${slotParts[0]}-${slotParts[1]}` : 'BLK-A',
        bay: Number(slotParts[2]) || 1,
        row: Number(slotParts[3]) || 1,
        tier: Number(slotParts[4]) || 1,
        gateLane: item.gateLane,
        status: item.status,
        notes: item.notes || ''
      });
    } else {
      setEditingGateInId(null);
      clearGateInForm();
    }
    setIsGateInModalOpen(true);
  };

  const handleSaveGateIn = (e: React.FormEvent) => {
    e.preventDefault();
    const allocatedSlot = `${gateInForm.block}-${String(gateInForm.bay).padStart(2, '0')}-${String(gateInForm.row).padStart(2, '0')}-${gateInForm.tier}`;
    const payload = {
      containerNo: gateInForm.containerNo.trim().toUpperCase(),
      size: gateInForm.size,
      type: gateInForm.type,
      truckPlate: gateInForm.truckPlate.trim().toUpperCase(),
      driverName: gateInForm.driverName.trim(),
      shippingLine: gateInForm.shippingLine,
      grossWeightKg: Number(gateInForm.grossWeightKg),
      sealNo: gateInForm.sealNo.trim().toUpperCase(),
      allocatedSlot,
      gateLane: gateInForm.gateLane,
      status: gateInForm.status,
      notes: gateInForm.notes
    };

    if (editingGateInId) {
      onUpdateGateIn(editingGateInId, payload);
    } else {
      const created = onAddGateIn(payload);
      // Automatically prompt or allow printing EIR slip
    }
    setIsGateInModalOpen(false);
  };

  // Open Gate-Out Form
  const handleOpenGateOut = (item?: GateOutTransaction) => {
    if (item) {
      setEditingGateOutId(item.id);
      setGateOutForm({
        containerNo: item.containerNo,
        doNumber: item.doNumber,
        sppbNumber: item.sppbNumber,
        truckPlate: item.truckPlate,
        driverName: item.driverName,
        destination: item.destination,
        shippingLine: item.shippingLine,
        customsStatus: item.customsStatus,
        status: item.status,
        notes: item.notes || ''
      });
    } else {
      setEditingGateOutId(null);
      clearGateOutForm();
    }
    setIsGateOutModalOpen(true);
  };

  const handleSaveGateOut = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      containerNo: gateOutForm.containerNo.trim().toUpperCase(),
      doNumber: gateOutForm.doNumber.trim(),
      sppbNumber: gateOutForm.sppbNumber.trim(),
      truckPlate: gateOutForm.truckPlate.trim().toUpperCase(),
      driverName: gateOutForm.driverName.trim(),
      destination: gateOutForm.destination.trim(),
      shippingLine: gateOutForm.shippingLine,
      customsStatus: gateOutForm.customsStatus,
      status: gateOutForm.status,
      notes: gateOutForm.notes
    };

    if (editingGateOutId) {
      onUpdateGateOut(editingGateOutId, payload);
    } else {
      onAddGateOut(payload);
    }
    setIsGateOutModalOpen(false);
  };

  // Open Stevedoring Form
  const handleOpenStevedoring = (item?: StevedoringTransaction) => {
    if (item) {
      setEditingStevedoringId(item.id);
      setStvForm({
        vesselId: item.vesselId,
        vesselName: item.vesselName,
        type: item.type,
        containerNo: item.containerNo,
        size: item.size,
        craneId: item.craneId,
        rtgOperator: item.rtgOperator,
        hatchBay: item.hatchBay,
        status: item.status
      });
    } else {
      setEditingStevedoringId(null);
      clearStevedoringForm();
    }
    setIsStevedoringModalOpen(true);
  };

  const handleSaveStevedoring = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVsl = vessels.find(v => v.id === stvForm.vesselId);
    const payload = {
      vesselId: stvForm.vesselId,
      vesselName: selectedVsl ? selectedVsl.name : stvForm.vesselName,
      type: stvForm.type,
      containerNo: stvForm.containerNo.trim().toUpperCase(),
      size: stvForm.size,
      craneId: stvForm.craneId,
      rtgOperator: stvForm.rtgOperator.trim(),
      hatchBay: stvForm.hatchBay.trim(),
      status: stvForm.status
    };

    if (editingStevedoringId) {
      onUpdateStevedoring(editingStevedoringId, payload);
    } else {
      onAddStevedoring(payload);
    }
    setIsStevedoringModalOpen(false);
  };

  // Perform Shifting
  const handlePerformShift = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedContainer = containers.find(c => c.id === shiftForm.containerId);
    if (!selectedContainer) return;

    // Simulate updating container yard slot
    selectedContainer.yardSlot = {
      block: shiftForm.targetBlock,
      bay: Number(shiftForm.targetBay),
      row: Number(shiftForm.targetRow),
      tier: Number(shiftForm.targetTier)
    };

    setShiftSuccessMsg(
      `Peti kemas ${selectedContainer.containerNo} berhasil dipindahkan ke ${shiftForm.targetBlock}-B${shiftForm.targetBay}-R${shiftForm.targetRow}-T${shiftForm.targetTier}!`
    );

    setTimeout(() => {
      setShiftSuccessMsg('');
    }, 4000);
  };

  const executeDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'gate-in') onDeleteGateIn(deleteConfirm.id);
    if (deleteConfirm.type === 'gate-out') onDeleteGateOut(deleteConfirm.id);
    if (deleteConfirm.type === 'stevedoring') onDeleteStevedoring(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-cyan-600" />
            Transaksi Operasional Terminal Peti Kemas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pencatatan Gate-In (EIR), Gate-Out (SPPB), Bongkar Muat Stevedoring Dermaga, dan Relokasi Shifting Lapangan.
          </p>
        </div>

        {/* Sub-tabs buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('gate-in')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'gate-in' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-600" />
            <span>Gate-In ({gateInList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gate-out')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'gate-out' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
            <span>Gate-Out ({gateOutList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('stevedoring')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'stevedoring' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ship className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bongkar Muat ({stevedoringList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('shifting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'shifting' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Pindah Susun Yard</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: GATE-IN TRANSACTIONS */}
      {/* ======================================================== */}
      {activeSubTab === 'gate-in' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative min-w-[260px] flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari No. EIR, No. Kontainer, Plat Truk, Supir..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono-code placeholder:font-sans"
              />
            </div>

            <button
              onClick={() => handleOpenGateIn()}
              id="btn-add-gate-in-tx"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Penerimaan Gate-In Baru (CRUD)</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">No. EIR & Waktu</th>
                    <th className="py-3 px-4">Peti Kemas & Tipe</th>
                    <th className="py-3 px-4">Truk & Pengemudi</th>
                    <th className="py-3 px-4">Pelayaran & Segel</th>
                    <th className="py-3 px-4">Berat Kotor</th>
                    <th className="py-3 px-4">Alokasi Lapangan</th>
                    <th className="py-3 px-4 text-center">Aksi CRUD & Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {gateInList
                    .filter(g => {
                      const search = searchTerm.toLowerCase();
                      return (
                        searchTerm === '' ||
                        g.eirNo.toLowerCase().includes(search) ||
                        g.containerNo.toLowerCase().includes(search) ||
                        g.truckPlate.toLowerCase().includes(search) ||
                        g.driverName.toLowerCase().includes(search)
                      );
                    })
                    .map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 font-mono-code">{item.eirNo}</span>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(item.timestamp).toLocaleString('id-ID')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold font-mono-code text-cyan-800 text-sm">
                              {item.containerNo}
                            </span>
                            <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {item.size}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{item.type}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold font-mono-code text-slate-900">{item.truckPlate}</div>
                          <div className="text-[11px] text-slate-500">Supir: {item.driverName}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{item.shippingLine}</div>
                          <div className="text-[11px] text-slate-600 font-mono-code">Segel: {item.sealNo}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono-code font-bold text-slate-800">
                            {item.grossWeightKg.toLocaleString('id-ID')} Kg
                          </div>
                          <div className="text-[10px] text-slate-500">{item.gateLane}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono-code font-bold text-cyan-900 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded text-xs">
                            {item.allocatedSlot}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => onPrintSlip('gate-in', item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 text-xs font-semibold cursor-pointer transition-all border border-cyan-200"
                              title="Cetak Slip EIR Gate-In"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak</span>
                            </button>

                            <button
                              onClick={() => handleOpenGateIn(item)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                              title="Edit Transaksi"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirm({
                                type: 'gate-in',
                                id: item.id,
                                label: `Transaksi Gate-In ${item.eirNo}`
                              })}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: GATE-OUT TRANSACTIONS */}
      {/* ======================================================== */}
      {activeSubTab === 'gate-out' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative min-w-[260px] flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari No. SPPB, No. DO, No. Kontainer, Truk..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono-code placeholder:font-sans"
              />
            </div>

            <button
              onClick={() => handleOpenGateOut()}
              id="btn-add-gate-out-tx"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Proses Pengeluaran Gate-Out (CRUD)</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">No. Gate Pass / SPPB</th>
                    <th className="py-3 px-4">No. Peti Kemas</th>
                    <th className="py-3 px-4">Delivery Order (DO)</th>
                    <th className="py-3 px-4">Truk & Pengemudi</th>
                    <th className="py-3 px-4">Tujuan Pengiriman</th>
                    <th className="py-3 px-4">Status Kepabeanan</th>
                    <th className="py-3 px-4 text-center">Aksi CRUD & Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {gateOutList
                    .filter(g => {
                      const search = searchTerm.toLowerCase();
                      return (
                        searchTerm === '' ||
                        g.gatePassNo.toLowerCase().includes(search) ||
                        g.containerNo.toLowerCase().includes(search) ||
                        g.doNumber.toLowerCase().includes(search) ||
                        g.truckPlate.toLowerCase().includes(search)
                      );
                    })
                    .map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 font-mono-code">{item.gatePassNo}</span>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(item.timestamp).toLocaleString('id-ID')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold font-mono-code text-cyan-800 text-sm">
                            {item.containerNo}
                          </span>
                          <div className="text-[11px] text-slate-500">{item.shippingLine}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono-code font-bold text-slate-800">{item.doNumber}</div>
                          <div className="text-[11px] text-slate-500">SPPB: {item.sppbNumber}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold font-mono-code text-slate-900">{item.truckPlate}</div>
                          <div className="text-[11px] text-slate-500">Supir: {item.driverName}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-semibold">{item.destination}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3 h-3" />
                            {item.customsStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => onPrintSlip('gate-out', item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold cursor-pointer transition-all border border-blue-200"
                              title="Cetak Surat Jalan Gate-Out"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak</span>
                            </button>

                            <button
                              onClick={() => handleOpenGateOut(item)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                              title="Edit Transaksi"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirm({
                                type: 'gate-out',
                                id: item.id,
                                label: `Transaksi Gate-Out ${item.gatePassNo}`
                              })}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: STEVEDORING (BONGKAR MUAT) */}
      {/* ======================================================== */}
      {activeSubTab === 'stevedoring' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Operasi Bongkar Muat Kapal (Stevedoring)</h2>
              <p className="text-xs text-slate-500">Monitoring pergerakan Quay Crane (QC) dan alokasi Hatch Bay</p>
            </div>

            <button
              onClick={() => handleOpenStevedoring()}
              id="btn-add-stevedoring-tx"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Bongkar Muat (CRUD)</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Waktu & Jenis</th>
                    <th className="py-3 px-4">Nama Kapal</th>
                    <th className="py-3 px-4">No. Peti Kemas</th>
                    <th className="py-3 px-4">Quay Crane & Hatch</th>
                    <th className="py-3 px-4">Operator RTG</th>
                    <th className="py-3 px-4">Status Operasi</th>
                    <th className="py-3 px-4 text-center">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {stevedoringList.map(stv => (
                    <tr key={stv.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          stv.type === 'Discharge' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {stv.type === 'Discharge' ? 'Bongkar (Discharge)' : 'Muat (Loading)'}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(stv.timestamp).toLocaleString('id-ID')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {stv.vesselName}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold font-mono-code text-cyan-800 text-sm">
                          {stv.containerNo}
                        </span>
                        <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                          {stv.size}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold font-mono-code text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {stv.craneId}
                        </span>
                        <span className="ml-2 text-slate-600 font-mono-code text-[11px]">{stv.hatchBay}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-800">
                        {stv.rtgOperator}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stv.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {stv.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenStevedoring(stv)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({
                              type: 'stevedoring',
                              id: stv.id,
                              label: `Bongkar Muat ${stv.containerNo}`
                            })}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: YARD SHIFTING (RELOKASI LAPANGAN) */}
      {/* ======================================================== */}
      {activeSubTab === 'shifting' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Relokasi & Pindah Susun Peti Kemas (Yard Shifting)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pindahkan kontainer ke blok/slot lain untuk optimasi pemuatan kapal atau cold-chain reefer.
            </p>
          </div>

          {shiftSuccessMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{shiftSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handlePerformShift} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Pilih Peti Kemas yang Akan Dipindahkan *
              </label>
              <select
                value={shiftForm.containerId}
                onChange={(e) => setShiftForm({ ...shiftForm, containerId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold focus:bg-white focus:ring-2 focus:ring-cyan-500"
              >
                {containers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.containerNo} ({c.size} {c.type}) — Posisi Saat Ini: {c.yardSlot.block}-B{c.yardSlot.bay}-R{c.yardSlot.row}-T{c.yardSlot.tier}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
              <span className="block text-xs font-bold text-amber-950 uppercase">
                Tentukan Posisi Baru (Target Slot):
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Blok Baru</label>
                  <select
                    value={shiftForm.targetBlock}
                    onChange={(e) => setShiftForm({ ...shiftForm, targetBlock: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono-code font-bold"
                  >
                    {yardBlocks.map(yb => (
                      <option key={yb.id} value={yb.code}>{yb.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Bay Baru</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={shiftForm.targetBay}
                    onChange={(e) => setShiftForm({ ...shiftForm, targetBay: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono-code font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Row Baru</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={shiftForm.targetRow}
                    onChange={(e) => setShiftForm({ ...shiftForm, targetRow: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono-code font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Tier Baru</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={shiftForm.targetTier}
                    onChange={(e) => setShiftForm({ ...shiftForm, targetTier: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono-code font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Alasan Shifting Operasional *
              </label>
              <input
                type="text"
                required
                value={shiftForm.reason}
                onChange={(e) => setShiftForm({ ...shiftForm, reason: e.target.value })}
                placeholder="Misal: Persiapan muat kapal ekspor MV Ever Given Star"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="btn-submit-shift"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 cursor-pointer transition-all"
              >
                Eksekusi Pindah Susun Lapangan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT GATE-IN */}
      {/* ======================================================== */}
      {isGateInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-cyan-600" />
                {editingGateInId ? 'Edit Transaksi Gate-In' : 'Penerimaan Gate-In Baru (EIR)'}
              </h3>
              <button onClick={() => setIsGateInModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center justify-between mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-600">
                Mode Input: <strong className="text-slate-900">Ketik Bebas Sesuai Keinginan</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearGateInForm}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Kosongkan Form
                </button>
                <button
                  type="button"
                  onClick={fillGateInExample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 cursor-pointer transition-all"
                >
                  Isi Contoh Cepat
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveGateIn} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">No. Peti Kemas *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    list="dl-gatein-containers"
                    value={gateInForm.containerNo}
                    onChange={(e) => setGateInForm({ ...gateInForm, containerNo: e.target.value.toUpperCase() })}
                    placeholder="Ketik nomor box (misal: TCLU-582910-3)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <datalist id="dl-gatein-containers">
                    {containers.map(c => (
                      <option key={c.id} value={c.containerNo}>{c.containerNo} ({c.shippingLine})</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Ukuran</label>
                  <select
                    value={gateInForm.size}
                    onChange={(e) => setGateInForm({ ...gateInForm, size: e.target.value as ContainerSize })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="20ft">20 Feet (1 TEU)</option>
                    <option value="40ft">40 Feet (2 TEUs)</option>
                    <option value="45ft">45 Feet High Cube</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nomor Polisi Truk *</label>
                  <input
                    type="text"
                    required
                    value={gateInForm.truckPlate}
                    onChange={(e) => setGateInForm({ ...gateInForm, truckPlate: e.target.value.toUpperCase() })}
                    placeholder="Ketik no plat (misal: B 9182 UY)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nama Supir / Driver *</label>
                  <input
                    type="text"
                    required
                    value={gateInForm.driverName}
                    onChange={(e) => setGateInForm({ ...gateInForm, driverName: e.target.value })}
                    placeholder="Ketik nama supir"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Pelayaran (Line) *</label>
                  <input
                    type="text"
                    required
                    list="dl-gatein-lines"
                    value={gateInForm.shippingLine}
                    onChange={(e) => setGateInForm({ ...gateInForm, shippingLine: e.target.value })}
                    placeholder="Ketik pelayaran atau pilih..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <datalist id="dl-gatein-lines">
                    {shippingLines.map(sl => (
                      <option key={sl.id} value={sl.name}>{sl.name} ({sl.code})</option>
                    ))}
                    <option value="Evergreen Marine Corp" />
                    <option value="Maersk Line" />
                    <option value="CMA CGM" />
                    <option value="ONE (Ocean Network Express)" />
                    <option value="MSC (Mediterranean Shipping)" />
                    <option value="Hapag-Lloyd" />
                    <option value="Samudera Indonesia" />
                    <option value="Meratus Line" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nomor Segel (Seal No) *</label>
                  <input
                    type="text"
                    required
                    value={gateInForm.sealNo}
                    onChange={(e) => setGateInForm({ ...gateInForm, sealNo: e.target.value.toUpperCase() })}
                    placeholder="Ketik no segel (misal: EMC-982310)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Berat Kotor Timbangan (Kg)</label>
                  <input
                    type="number"
                    required
                    value={gateInForm.grossWeightKg || ''}
                    onChange={(e) => setGateInForm({ ...gateInForm, grossWeightKg: Number(e.target.value) })}
                    placeholder="Contoh: 24500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Lane Gerbang Masuk</label>
                  <input
                    type="text"
                    list="dl-gatein-lanes"
                    value={gateInForm.gateLane}
                    onChange={(e) => setGateInForm({ ...gateInForm, gateLane: e.target.value })}
                    placeholder="Ketik lane gerbang..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <datalist id="dl-gatein-lanes">
                    <option value="Lane 01 (Auto-OCR)" />
                    <option value="Lane 02 (Weighbridge)" />
                    <option value="Lane 03 (Reefer Inbound)" />
                    <option value="Lane 04 (Manual Inspection)" />
                  </datalist>
                </div>
              </div>

              {/* Slot Allocation */}
              <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-100">
                <span className="block text-[11px] font-bold text-cyan-950 uppercase mb-1.5">
                  Alokasi Slot Penumpukan (Otomatis / Manual)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Blok</label>
                    <input
                      type="text"
                      list="dl-gatein-blocks"
                      value={gateInForm.block}
                      onChange={(e) => setGateInForm({ ...gateInForm, block: e.target.value.toUpperCase() })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono-code font-bold uppercase focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <datalist id="dl-gatein-blocks">
                      {yardBlocks.map(b => (
                        <option key={b.id} value={b.code}>{b.code} ({b.name})</option>
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Bay</label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={gateInForm.bay}
                      onChange={(e) => setGateInForm({ ...gateInForm, bay: Number(e.target.value) })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono-code font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Row</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={gateInForm.row}
                      onChange={(e) => setGateInForm({ ...gateInForm, row: Number(e.target.value) })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono-code font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Tier</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={gateInForm.tier}
                      onChange={(e) => setGateInForm({ ...gateInForm, tier: Number(e.target.value) })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono-code font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Catatan Pemeriksaan</label>
                <input
                  type="text"
                  value={gateInForm.notes}
                  onChange={(e) => setGateInForm({ ...gateInForm, notes: e.target.value })}
                  placeholder="Ketik catatan kondisi kontainer atau instruksi khusus..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsGateInModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-gate-in"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  {editingGateInId ? 'Simpan Perubahan' : 'Terbitkan EIR & Masuk Gate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT GATE-OUT */}
      {/* ======================================================== */}
      {isGateOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
                {editingGateOutId ? 'Edit Transaksi Gate-Out' : 'Proses Pengeluaran Peti Kemas (Gate-Out)'}
              </h3>
              <button onClick={() => setIsGateOutModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center justify-between mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-600">
                Mode Input: <strong className="text-slate-900">Ketik Bebas Sesuai Keinginan</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearGateOutForm}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Kosongkan Form
                </button>
                <button
                  type="button"
                  onClick={fillGateOutExample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer transition-all"
                >
                  Isi Contoh Cepat
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveGateOut} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">No. Peti Kemas *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    list="dl-gateout-containers"
                    value={gateOutForm.containerNo}
                    onChange={(e) => {
                      const typed = e.target.value.toUpperCase();
                      const matched = containers.find(c => c.containerNo.toUpperCase() === typed);
                      setGateOutForm({
                        ...gateOutForm,
                        containerNo: typed,
                        shippingLine: matched ? matched.shippingLine : gateOutForm.shippingLine
                      });
                    }}
                    placeholder="Ketik nomor box (misal: MSKU-910283-1)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id="dl-gateout-containers">
                    {containers.map(c => (
                      <option key={c.id} value={c.containerNo}>{c.containerNo} ({c.shippingLine}) — Slot: {c.yardSlot.block}</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Status Bea Cukai</label>
                  <select
                    value={gateOutForm.customsStatus}
                    onChange={(e) => setGateOutForm({ ...gateOutForm, customsStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Clear">Clear (Jalur Hijau SPPB)</option>
                    <option value="Red Line Inspection">Red Line (Pemeriksaan Fisik)</option>
                    <option value="Yellow Line">Yellow Line (Cek Dokumen)</option>
                    <option value="Pending">Pending Clearance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nomor DO (Delivery Order) *</label>
                  <input
                    type="text"
                    required
                    value={gateOutForm.doNumber}
                    onChange={(e) => setGateOutForm({ ...gateOutForm, doNumber: e.target.value })}
                    placeholder="Ketik nomor DO (misal: DO-MSK-JKT-88910)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nomor SPPB Bea Cukai *</label>
                  <input
                    type="text"
                    required
                    value={gateOutForm.sppbNumber}
                    onChange={(e) => setGateOutForm({ ...gateOutForm, sppbNumber: e.target.value })}
                    placeholder="Ketik nomor SPPB (misal: SPPB-BC-0291820)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Pelayaran (Line)</label>
                  <input
                    type="text"
                    list="dl-gateout-lines"
                    value={gateOutForm.shippingLine}
                    onChange={(e) => setGateOutForm({ ...gateOutForm, shippingLine: e.target.value })}
                    placeholder="Ketik pelayaran atau pilih..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <datalist id="dl-gateout-lines">
                    {shippingLines.map(sl => (
                      <option key={sl.id} value={sl.name} />
                    ))}
                    <option value="Maersk Line" />
                    <option value="Evergreen Marine Corp" />
                    <option value="CMA CGM" />
                    <option value="ONE (Ocean Network Express)" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nomor Truk Penjemput *</label>
                  <input
                    type="text"
                    required
                    value={gateOutForm.truckPlate}
                    onChange={(e) => setGateOutForm({ ...gateOutForm, truckPlate: e.target.value.toUpperCase() })}
                    placeholder="Ketik no plat truk (misal: B 9233 ZQ)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nama Supir Ekspedisi *</label>
                  <input
                    type="text"
                    required
                    value={gateOutForm.driverName}
                    onChange={(e) => setGateOutForm({ ...gateOutForm, driverName: e.target.value })}
                    placeholder="Ketik nama supir ekspedisi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tujuan Pengiriman / Pabrik *</label>
                  <input
                    type="text"
                    required
                    list="dl-gateout-destinations"
                    value={gateOutForm.destination}
                    onChange={(e) => setGateOutForm({ ...gateOutForm, destination: e.target.value })}
                    placeholder="Ketik alamat tujuan pengiriman"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <datalist id="dl-gateout-destinations">
                    <option value="Kawasan Berikat Cikarang Dry Port" />
                    <option value="Kawasan Industri MM2100 Cibitung" />
                    <option value="Kawasan Industri GIIC Deltamas Cikarang" />
                    <option value="Kawasan Industri Jababeka 1-3" />
                    <option value="Kawasan Industri Karawang KIIC" />
                    <option value="Kawasan Industri Surya Cipta Karawang" />
                    <option value="Depo Peti Kemas Marunda Center" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Catatan Gate-Out</label>
                <input
                  type="text"
                  value={gateOutForm.notes}
                  onChange={(e) => setGateOutForm({ ...gateOutForm, notes: e.target.value })}
                  placeholder="Ketik catatan pengeluaran barang..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsGateOutModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-gate-out"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {editingGateOutId ? 'Simpan Perubahan' : 'Terbitkan Gate Pass & Keluar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT STEVEDORING */}
      {/* ======================================================== */}
      {isStevedoringModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ship className="w-5 h-5 text-indigo-600" />
                {editingStevedoringId ? 'Edit Tugas Bongkar Muat' : 'Catat Operasi Bongkar Muat (Stevedoring)'}
              </h3>
              <button onClick={() => setIsStevedoringModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center justify-between mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-600">
                Mode Input: <strong className="text-slate-900">Ketik Bebas Sesuai Keinginan</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearStevedoringForm}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Kosongkan Form
                </button>
                <button
                  type="button"
                  onClick={fillStevedoringExample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all"
                >
                  Isi Contoh Cepat
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveStevedoring} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nama Kapal Sandar *</label>
                  <input
                    type="text"
                    required
                    list="dl-stv-vessels"
                    value={stvForm.vesselName}
                    onChange={(e) => {
                      const typed = e.target.value;
                      const matched = vessels.find(v => v.name.toLowerCase() === typed.toLowerCase());
                      setStvForm({
                        ...stvForm,
                        vesselName: typed,
                        vesselId: matched ? matched.id : stvForm.vesselId
                      });
                    }}
                    placeholder="Ketik nama kapal sandar..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="dl-stv-vessels">
                    {vessels.map(v => (
                      <option key={v.id} value={v.name}>{v.name} ({v.berthId} - {v.status})</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Jenis Operasi</label>
                  <select
                    value={stvForm.type}
                    onChange={(e) => setStvForm({ ...stvForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Discharge">Bongkar (Discharge dari Kapal ke Yard)</option>
                    <option value="Loading">Muat (Loading dari Yard ke Kapal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nomor Peti Kemas *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    list="dl-stv-containers"
                    value={stvForm.containerNo}
                    onChange={(e) => setStvForm({ ...stvForm, containerNo: e.target.value.toUpperCase() })}
                    placeholder="Ketik nomor box kontainer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="dl-stv-containers">
                    {containers.map(c => (
                      <option key={c.id} value={c.containerNo}>{c.containerNo} ({c.size} {c.type})</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Ukuran Box</label>
                  <select
                    value={stvForm.size}
                    onChange={(e) => setStvForm({ ...stvForm, size: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="20ft">20ft</option>
                    <option value="40ft">40ft</option>
                    <option value="45ft">45ft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Quay Crane (QC)</label>
                  <input
                    type="text"
                    list="dl-stv-cranes"
                    value={stvForm.craneId}
                    onChange={(e) => setStvForm({ ...stvForm, craneId: e.target.value })}
                    placeholder="Ketik atau pilih crane..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="dl-stv-cranes">
                    <option value="QC-01 (Quay 1)" />
                    <option value="QC-02 (Quay 1)" />
                    <option value="QC-03 (Quay 2)" />
                    <option value="QC-04 (Quay 2)" />
                    <option value="QC-05 (Domestik)" />
                    <option value="MHC-01 (Mobile Harbour Crane)" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Posisi Hatch Bay Kapal *</label>
                  <input
                    type="text"
                    required
                    list="dl-stv-bays"
                    value={stvForm.hatchBay}
                    onChange={(e) => setStvForm({ ...stvForm, hatchBay: e.target.value })}
                    placeholder="Ketik bay kapal (misal: Bay 14 On-Deck)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono-code focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="dl-stv-bays">
                    <option value="Bay 02 On-Deck" />
                    <option value="Bay 06 Under-Deck" />
                    <option value="Bay 10 On-Deck" />
                    <option value="Bay 14 On-Deck" />
                    <option value="Bay 18 Under-Deck" />
                    <option value="Bay 22 On-Deck" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Operator RTG / Crane *</label>
                <input
                  type="text"
                  required
                  value={stvForm.rtgOperator}
                  onChange={(e) => setStvForm({ ...stvForm, rtgOperator: e.target.value })}
                  placeholder="Ketik nama operator crane/RTG"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStevedoringModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-stevedoring"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {editingStevedoringId ? 'Simpan Perubahan' : 'Catat Stevedoring'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Transaksi</h3>
            <p className="text-xs text-slate-600 mt-1">
              Yakin ingin menghapus <strong>{deleteConfirm.label}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
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
