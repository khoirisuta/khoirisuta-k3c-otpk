import React from 'react';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GateInTransaction, GateOutTransaction } from '../types';

interface PrintSlipModalProps {
  type: 'gate-in' | 'gate-out';
  record: GateInTransaction | GateOutTransaction;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({ type, record, onClose }) => {
  const isGateIn = type === 'gate-in';
  const gateInRecord = isGateIn ? (record as GateInTransaction) : null;
  const gateOutRecord = !isGateIn ? (record as GateOutTransaction) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
        {/* Modal Controls (No print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pratinjau Dokumen Cetak Gerbang
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="btn-print-slip-action"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Slip Body */}
        <div className="p-6 bg-amber-50/20 border-2 border-dashed border-slate-300 rounded-xl my-4 text-slate-900 font-mono-code text-xs">
          {/* Slip Header */}
          <div className="text-center border-b pb-3 border-slate-300">
            <h4 className="font-black text-sm uppercase tracking-wide">
              PELABUHAN UTAMA TANJUNG PRIOK
            </h4>
            <p className="text-[11px] font-bold text-cyan-800 uppercase">
              TERMINAL PETI KEMAS NUSANTARA (TPK)
            </p>
            <p className="text-[10px] text-slate-500">
              {isGateIn
                ? 'EQUIPMENT INTERCHANGE RECEIPT (EIR) - INBOUND'
                : 'SURAT JALAN & GATE PASS PENGELUARAN (SPPB)'}
            </p>
          </div>

          {/* Reference No & Date */}
          <div className="flex justify-between py-2 border-b border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-500">NO. DOKUMEN:</span>{' '}
              <span className="font-black text-slate-900">
                {isGateIn ? gateInRecord?.eirNo : gateOutRecord?.gatePassNo}
              </span>
            </div>
            <div>
              <span className="text-slate-500">TGL:</span>{' '}
              <span>{new Date(record.timestamp).toLocaleDateString('id-ID')}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="py-3 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">NO. PETI KEMAS:</span>
              <span className="font-black text-slate-950 text-sm">
                {record.containerNo}
              </span>
            </div>

            {isGateIn && gateInRecord && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">UKURAN / TIPE:</span>
                  <span>{gateInRecord.size} {gateInRecord.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NO. SEGEL (SEAL):</span>
                  <span className="font-bold">{gateInRecord.sealNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">BERAT TIMBANGAN:</span>
                  <span>{gateInRecord.grossWeightKg.toLocaleString('id-ID')} KG</span>
                </div>
                <div className="flex justify-between bg-cyan-50 p-1.5 rounded border border-cyan-200 text-cyan-950 font-bold">
                  <span>ALOKASI YARD:</span>
                  <span className="text-sm">{gateInRecord.allocatedSlot}</span>
                </div>
              </>
            )}

            {!isGateIn && gateOutRecord && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">NOMOR DO:</span>
                  <span className="font-bold">{gateOutRecord.doNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NOMOR SPPB BC:</span>
                  <span className="font-bold">{gateOutRecord.sppbNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TUJUAN:</span>
                  <span className="font-bold">{gateOutRecord.destination}</span>
                </div>
                <div className="flex justify-between bg-emerald-50 p-1.5 rounded border border-emerald-200 text-emerald-950 font-bold">
                  <span>STATUS BEA CUKAI:</span>
                  <span>{gateOutRecord.customsStatus}</span>
                </div>
              </>
            )}

            <div className="flex justify-between pt-1">
              <span className="text-slate-500">NO. POLISI TRUK:</span>
              <span className="font-bold">{record.truckPlate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">NAMA SUPIR:</span>
              <span>{record.driverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PELAYARAN:</span>
              <span>{record.shippingLine}</span>
            </div>
          </div>

          {/* Barcode Mock */}
          <div className="py-2 text-center border-t border-b border-slate-200 my-2">
            <div className="h-8 flex items-center justify-center gap-1">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${i % 3 === 0 ? 'w-1 bg-black' : i % 2 === 0 ? 'w-0.5 bg-black' : 'w-1.5 bg-black'}`}
                />
              ))}
            </div>
            <p className="text-[9px] text-slate-400 mt-1">
              *{record.containerNo}-{record.id}*
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 pt-2 text-center text-[10px]">
            <div>
              <p className="text-slate-500">Driver / Ekspedisi</p>
              <div className="h-10"></div>
              <p className="font-bold">({record.driverName})</p>
            </div>
            <div>
              <p className="text-slate-500">Petugas Gate TPK</p>
              <div className="h-10 flex items-center justify-center text-[9px] text-cyan-800 font-bold">
                [GATE APPROVED]
              </div>
              <p className="font-bold">Khoiri Suta (Admin)</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center no-print">
          Harap bawa slip ini sebagai tanda bukti resmi di gate check-point dan lapangan penumpukan.
        </p>
      </div>
    </div>
  );
};
