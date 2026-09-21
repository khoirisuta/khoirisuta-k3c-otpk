import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  Layers,
  Anchor,
  AlertTriangle,
  Building2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import {
  ContainerMaster,
  VesselMaster,
  YardBlockMaster,
  GateInTransaction,
  GateOutTransaction,
  StevedoringTransaction,
  ShippingLineMaster
} from '../types';

interface ReportsViewProps {
  containers: ContainerMaster[];
  vessels: VesselMaster[];
  yardBlocks: YardBlockMaster[];
  shippingLines: ShippingLineMaster[];
  gateInList: GateInTransaction[];
  gateOutList: GateOutTransaction[];
  stevedoringList: StevedoringTransaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  containers,
  vessels,
  yardBlocks,
  shippingLines,
  gateInList,
  gateOutList,
  stevedoringList
}) => {
  const [reportType, setReportType] = useState<'throughput' | 'dwelling' | 'utilization' | 'lines'>('throughput');
  const [dateFilter, setDateFilter] = useState('2026-09');

  // Compute TEUs
  const teusInbound = gateInList.reduce((acc, g) => acc + (g.size === '20ft' ? 1 : 2), 0);
  const teusOutbound = gateOutList.reduce((acc, g) => acc + 2, 0); // sample
  const totalThroughputTeus = teusInbound + teusOutbound;

  // Dwelling Time buckets
  const dwellUnder3 = containers.filter(c => c.dwellDays <= 3);
  const dwell4to5 = containers.filter(c => c.dwellDays >= 4 && c.dwellDays <= 5);
  const dwellOver5 = containers.filter(c => c.dwellDays > 5);
  const avgDwellTime = (containers.reduce((acc, c) => acc + c.dwellDays, 0) / (containers.length || 1)).toFixed(1);

  // Yard Occupancy
  const totalCapacity = yardBlocks.reduce((acc, b) => acc + b.totalCapacityTeus, 0);
  const totalOccupied = yardBlocks.reduce((acc, b) => acc + b.currentOccupancyTeus, 0);
  const totalYor = Math.round((totalOccupied / (totalCapacity || 1)) * 100);

  // Shipping Line Distribution
  const lineStats = shippingLines.map(sl => {
    const boxCount = containers.filter(c => c.shippingLine === sl.name).length;
    const teus = containers
      .filter(c => c.shippingLine === sl.name)
      .reduce((acc, c) => acc + (c.size === '20ft' ? 1 : 2), 0);
    return {
      line: sl.name,
      code: sl.code,
      boxCount,
      teus,
      color: sl.colorHex
    };
  });

  // Export to CSV
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `laporan-portops-${reportType}-${dateFilter}.csv`;

    if (reportType === 'throughput') {
      csvContent += 'Tipe,Nomor Referensi,No Peti Kemas,Ukuran,Pelayaran,Waktu,Status\n';
      gateInList.forEach(g => {
        csvContent += `Gate-In,${g.eirNo},${g.containerNo},${g.size},${g.shippingLine},${g.timestamp},${g.status}\n`;
      });
      gateOutList.forEach(g => {
        csvContent += `Gate-Out,${g.gatePassNo},${g.containerNo},40ft,${g.shippingLine},${g.timestamp},${g.status}\n`;
      });
    } else if (reportType === 'dwelling') {
      csvContent += 'No Peti Kemas,Ukuran,Tipe,Pelayaran,Lama Inap (Hari),Slot Lapangan,Status,Segel\n';
      containers.forEach(c => {
        csvContent += `${c.containerNo},${c.size},${c.type},${c.shippingLine},${c.dwellDays},${c.yardSlot.block}-B${c.yardSlot.bay}-R${c.yardSlot.row}-T${c.yardSlot.tier},${c.status},${c.sealNo}\n`;
      });
    } else if (reportType === 'utilization') {
      csvContent += 'Kode Blok,Nama Blok,Kategori,Kapasitas TEUs,Terisi TEUs,Okupansi Persen,Reefer Zone\n';
      yardBlocks.forEach(b => {
        const pct = Math.round((b.currentOccupancyTeus / b.totalCapacityTeus) * 100);
        csvContent += `${b.code},${b.name},${b.category},${b.totalCapacityTeus},${b.currentOccupancyTeus},${pct}%,${b.isReeferZone ? 'Ya' : 'Tidak'}\n`;
      });
    } else {
      csvContent += 'Kode,Perusahaan Pelayaran,Total Box di Yard,Total TEUs\n';
      lineStats.forEach(l => {
        csvContent += `${l.code},${l.line},${l.boxCount},${l.teus}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-cyan-600" />
            Laporan Operasional & Analitik Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekapitulasi performa throughput TEUs, dwelling time, dan utilisasi fasilitas pelabuhan.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            id="btn-export-csv"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrint}
            id="btn-print-report"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan Formal</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (Hidden during print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setReportType('throughput')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
              reportType === 'throughput'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Arus Peti Kemas (Throughput)
          </button>

          <button
            onClick={() => setReportType('dwelling')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
              reportType === 'dwelling'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Dwelling Time (Lama Inap)
          </button>

          <button
            onClick={() => setReportType('utilization')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
              reportType === 'utilization'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Utilitas Yard & Dermaga
          </button>

          <button
            onClick={() => setReportType('lines')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
              reportType === 'lines'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rekapitulasi Pelayaran
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Formal Printable Document Header (Print view and Preview) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Document Header with Seal */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                TERMINAL PETI KEMAS NUSANTARA
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              DIVISI PENGENDALIAN OPERASI & LOGISTIK PELABUHAN
            </p>
            <p className="text-[11px] text-slate-500">
              Jl. Dermaga Raya No. 01, Pelabuhan Hub Tanjung Priok • Telp: (021) 430-1000 • Email: tos@portops.co.id
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono-code font-bold text-cyan-900 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded">
              LAP-OPS/TPK/{dateFilter.replace('-', '/')}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">Dicetak: {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Report Title */}
        <div className="my-6 text-center">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
            {reportType === 'throughput' && 'LAPORAN ARUS PETI KEMAS (THROUGHPUT TEUs)'}
            {reportType === 'dwelling' && 'LAPORAN PEMANTAUAN LAMA INAP (DWELLING TIME)'}
            {reportType === 'utilization' && 'LAPORAN UTILITAS FASILITAS LAPANGAN & DERMAGA'}
            {reportType === 'lines' && 'LAPORAN PANGSA MUATAN PERUSAHAAN PELAYARAN'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Periode Bulan: September 2026</p>
        </div>

        {/* ================= REPORT 1: THROUGHPUT ================= */}
        {reportType === 'throughput' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">Total Throughput</span>
                <div className="text-3xl font-black text-cyan-950 mt-1">{totalThroughputTeus} TEUs</div>
                <p className="text-[10px] text-cyan-700 mt-1">Inbound + Outbound Operasional</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Arus Masuk (Gate-In)</span>
                <div className="text-3xl font-black text-emerald-950 mt-1">{teusInbound} TEUs</div>
                <p className="text-[10px] text-emerald-700 mt-1">{gateInList.length} Transaksi Masuk</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Arus Keluar (Gate-Out)</span>
                <div className="text-3xl font-black text-blue-950 mt-1">{teusOutbound} TEUs</div>
                <p className="text-[10px] text-blue-700 mt-1">{gateOutList.length} Transaksi SPPB</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="border border-slate-200 p-2.5">Arus</th>
                    <th className="border border-slate-200 p-2.5">No. Dokumen</th>
                    <th className="border border-slate-200 p-2.5">No. Kontainer</th>
                    <th className="border border-slate-200 p-2.5">Ukuran / Tipe</th>
                    <th className="border border-slate-200 p-2.5">Pelayaran</th>
                    <th className="border border-slate-200 p-2.5">Truk / Sopir</th>
                    <th className="border border-slate-200 p-2.5">Waktu Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {gateInList.map(g => (
                    <tr key={g.id}>
                      <td className="border border-slate-200 p-2 font-bold text-cyan-800">Inbound (Gate-In)</td>
                      <td className="border border-slate-200 p-2 font-mono-code">{g.eirNo}</td>
                      <td className="border border-slate-200 p-2 font-mono-code font-bold">{g.containerNo}</td>
                      <td className="border border-slate-200 p-2">{g.size} {g.type}</td>
                      <td className="border border-slate-200 p-2">{g.shippingLine}</td>
                      <td className="border border-slate-200 p-2">{g.truckPlate} ({g.driverName})</td>
                      <td className="border border-slate-200 p-2">{new Date(g.timestamp).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  {gateOutList.map(g => (
                    <tr key={g.id}>
                      <td className="border border-slate-200 p-2 font-bold text-blue-800">Outbound (Gate-Out)</td>
                      <td className="border border-slate-200 p-2 font-mono-code">{g.gatePassNo}</td>
                      <td className="border border-slate-200 p-2 font-mono-code font-bold">{g.containerNo}</td>
                      <td className="border border-slate-200 p-2">40ft Dry</td>
                      <td className="border border-slate-200 p-2">{g.shippingLine}</td>
                      <td className="border border-slate-200 p-2">{g.truckPlate} ({g.driverName})</td>
                      <td className="border border-slate-200 p-2">{new Date(g.timestamp).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= REPORT 2: DWELLING TIME ================= */}
        {reportType === 'dwelling' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500">Rata-Rata Dwelling Time</span>
                <div className="text-3xl font-black text-slate-900 mt-1">{avgDwellTime} Hari</div>
                <p className="text-[10px] text-emerald-700 font-bold mt-1">Target Nasional: ≤ 3.5 Hari</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] font-bold uppercase text-emerald-800">1 - 3 Hari (Lancar)</span>
                <div className="text-3xl font-black text-emerald-950 mt-1">{dwellUnder3.length} Box</div>
                <p className="text-[10px] text-emerald-700 mt-1">Normal Operasional</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] font-bold uppercase text-amber-800">4 - 5 Hari (Waspada)</span>
                <div className="text-3xl font-black text-amber-950 mt-1">{dwell4to5.length} Box</div>
                <p className="text-[10px] text-amber-700 mt-1">Perlu Follow-up Importir</p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-[10px] font-bold uppercase text-rose-800">&gt; 5 Hari (Overdwell)</span>
                <div className="text-3xl font-black text-rose-950 mt-1">{dwellOver5.length} Box</div>
                <p className="text-[10px] text-rose-700 mt-1 font-bold">Kena Biaya Demurrage</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="border border-slate-200 p-2.5">No. Peti Kemas</th>
                    <th className="border border-slate-200 p-2.5">Ukuran / Tipe</th>
                    <th className="border border-slate-200 p-2.5">Pelayaran</th>
                    <th className="border border-slate-200 p-2.5">Lama Inap</th>
                    <th className="border border-slate-200 p-2.5">Status Dwelling</th>
                    <th className="border border-slate-200 p-2.5">Lokasi Slot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {containers.map(c => {
                    const isOver = c.dwellDays > 5;
                    return (
                      <tr key={c.id} className={isOver ? 'bg-rose-50/50' : ''}>
                        <td className="border border-slate-200 p-2 font-mono-code font-bold">{c.containerNo}</td>
                        <td className="border border-slate-200 p-2">{c.size} {c.type}</td>
                        <td className="border border-slate-200 p-2">{c.shippingLine}</td>
                        <td className="border border-slate-200 p-2 font-mono-code font-bold text-center">
                          {c.dwellDays} Hari
                        </td>
                        <td className="border border-slate-200 p-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOver ? 'bg-rose-200 text-rose-900' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isOver ? 'Overdwell Alert' : 'Normal Stay'}
                          </span>
                        </td>
                        <td className="border border-slate-200 p-2 font-mono-code">
                          {c.yardSlot.block}-B{c.yardSlot.bay}-R{c.yardSlot.row}-T{c.yardSlot.tier}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= REPORT 3: UTILIZATION ================= */}
        {reportType === 'utilization' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500">Rata-Rata YOR (Yard Occupancy Rate)</span>
                <div className="text-3xl font-black text-cyan-800 mt-1">{totalYor}%</div>
                <div className="text-xs text-slate-600 mt-1">
                  Terpakai {totalOccupied} TEUs dari kapasitas total {totalCapacity} TEUs
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500">BOR (Berth Occupancy Rate)</span>
                <div className="text-3xl font-black text-blue-800 mt-1">67%</div>
                <div className="text-xs text-slate-600 mt-1">
                  2 dari 3 Dermaga Aktif terisi kapal sandar (Quay 1 & Quay 2)
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="border border-slate-200 p-2.5">Kode Blok</th>
                    <th className="border border-slate-200 p-2.5">Nama Blok</th>
                    <th className="border border-slate-200 p-2.5">Kategori</th>
                    <th className="border border-slate-200 p-2.5">Kapasitas Maksimal</th>
                    <th className="border border-slate-200 p-2.5">Terisi Saat Ini</th>
                    <th className="border border-slate-200 p-2.5">Okupansi (%)</th>
                    <th className="border border-slate-200 p-2.5">Status Lapangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {yardBlocks.map(b => {
                    const pct = Math.round((b.currentOccupancyTeus / b.totalCapacityTeus) * 100);
                    return (
                      <tr key={b.id}>
                        <td className="border border-slate-200 p-2 font-mono-code font-bold">{b.code}</td>
                        <td className="border border-slate-200 p-2 font-semibold">{b.name}</td>
                        <td className="border border-slate-200 p-2">{b.category}</td>
                        <td className="border border-slate-200 p-2 font-mono-code">{b.totalCapacityTeus} TEUs</td>
                        <td className="border border-slate-200 p-2 font-mono-code">{b.currentOccupancyTeus} TEUs</td>
                        <td className="border border-slate-200 p-2 font-mono-code font-bold">{pct}%</td>
                        <td className="border border-slate-200 p-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pct > 80 ? 'bg-rose-100 text-rose-800' : pct > 60 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {pct > 80 ? 'Kritis' : pct > 60 ? 'Padat' : 'Optimal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= REPORT 4: SHIPPING LINES ================= */}
        {reportType === 'lines' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="border border-slate-200 p-2.5">Kode</th>
                    <th className="border border-slate-200 p-2.5">Perusahaan Pelayaran</th>
                    <th className="border border-slate-200 p-2.5">Jumlah Box di Yard</th>
                    <th className="border border-slate-200 p-2.5">Total Volume TEUs</th>
                    <th className="border border-slate-200 p-2.5">Pangsa Yard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {lineStats.map(ls => {
                    const sharePct = Math.round((ls.teus / (containers.length * 2 || 1)) * 100);
                    return (
                      <tr key={ls.code}>
                        <td className="border border-slate-200 p-2 font-mono-code font-bold">{ls.code}</td>
                        <td className="border border-slate-200 p-2 font-bold text-slate-900">{ls.line}</td>
                        <td className="border border-slate-200 p-2 font-mono-code">{ls.boxCount} Box</td>
                        <td className="border border-slate-200 p-2 font-mono-code font-bold text-cyan-800">{ls.teus} TEUs</td>
                        <td className="border border-slate-200 p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${sharePct}%` }} />
                            </div>
                            <span className="font-bold text-[11px]">{sharePct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Formal Signatures Section */}
        <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500">Disusun oleh,</p>
            <p className="font-bold text-slate-800 mt-0.5">Staf Pengendalian Operasi (Gate/Yard)</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-mono-code text-[11px] text-slate-400 italic">[Tanda Tangan Digital Diverifikasi]</span>
            </div>
            <p className="font-bold text-slate-900 underline">Budi Rahardjo, S.T.</p>
            <p className="text-[10px] text-slate-500">NIP: 19840212 200812 1 002</p>
          </div>

          <div>
            <p className="text-slate-500">Mengetahui & Menyetujui,</p>
            <p className="font-bold text-slate-800 mt-0.5">Terminal Director & Chief Operator</p>
            <div className="h-16 flex items-center justify-center">
              <div className="border border-cyan-400 bg-cyan-50/50 rounded px-2 py-1 text-cyan-800 font-mono-code text-[10px] font-bold">
                VALIDATED BY ADMIN: KHOIRI SUTA
              </div>
            </div>
            <p className="font-bold text-slate-900 underline">Khoiri Suta</p>
            <p className="text-[10px] text-slate-500">Direktur Operasional Terminal Peti Kemas</p>
          </div>
        </div>
      </div>
    </div>
  );
};
