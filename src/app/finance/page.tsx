"use client";

import React, { useState } from "react";
import { useEduCore } from "@/context/EduCoreContext";
import { formatRupiah } from "@/lib/utils";
import { TuitionInvoice } from "@/types/educore";
import {
  Receipt,
  DollarSign,
  Printer,
  CheckCircle,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  X,
  CreditCard,
  Building,
} from "lucide-react";

export default function FinancePage() {
  const { invoices, students, payInvoice, createInvoice, deleteInvoice } = useEduCore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<TuitionInvoice | null>(null);

  // New Invoice Form
  const [formStudentId, setFormStudentId] = useState(students[0]?.id || "std-1");
  const [formMonth, setFormMonth] = useState("Oktober 2026");
  const [formAmount, setFormAmount] = useState<number>(750000);
  const [formDueDate, setFormDueDate] = useState("2026-10-10");

  // Finance Metrics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCollected = invoices
    .filter((inv) => inv.status === "LUNAS")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices
    .filter((inv) => inv.status === "BELUM_LUNAS" || inv.status === "TUNGGAKAN")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const collectionRatio = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === formStudentId);
    if (!st) return;

    createInvoice({
      studentId: st.id,
      studentName: st.name,
      className: st.className,
      month: formMonth,
      amount: Number(formAmount),
      status: "BELUM_LUNAS",
      dueDate: formDueDate,
    });

    setIsCreateModalOpen(false);
  };

  const handlePrintReceipt = (inv: TuitionInvoice) => {
    setReceiptToPrint(inv);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner (No Print) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1424] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Manajemen Keuangan Kampus & Sekolah</span>
          </div>
          <h1 className="text-2xl font-black text-white">Kas & Penagihan Biaya SPP</h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Pengelolaan tagihan bulanan siswa, rekonsiliasi pembayaran kasir, pencetakan kuitansi resmi, dan monitoring tunggakan.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Terbitkan Tagihan Baru</span>
        </button>
      </div>

      {/* 4 Financial KPI Cards (No Print) */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0d1424] border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400">Kas Masuk (Lunas)</span>
          <div className="text-2xl font-black text-emerald-400 mt-2">{formatRupiah(totalCollected)}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Telah Disetor ke Kas Utama</span>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400">Total Piutang & Tunggakan</span>
          <div className="text-2xl font-black text-rose-400 mt-2">{formatRupiah(totalPending)}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Menunggu Pelunasan Siswa</span>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400">Total Tagihan Diterbitkan</span>
          <div className="text-2xl font-black text-white mt-2">{formatRupiah(totalInvoiced)}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">{invoices.length} Faktur SPP Terbit</span>
        </div>

        <div className="bg-[#0d1424] border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400">Kolektibilitas SPP</span>
          <div className="text-2xl font-black text-cyan-400 mt-2">{collectionRatio}%</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Tingkat Kepatuhan Pembayaran</span>
        </div>
      </div>

      {/* Filter and Search Bar (No Print) */}
      <div className="no-print bg-[#0d1424] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari siswa atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12192c] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#12192c] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="LUNAS">Lunas</option>
            <option value="BELUM_LUNAS">Belum Lunas</option>
            <option value="TUNGGAKAN">Tunggakan</option>
          </select>
        </div>
      </div>

      {/* Main Invoices Table (No Print) */}
      <div className="no-print bg-[#0d1424] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#11192e] text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Nama Siswa / Rombel</th>
                <th className="py-4 px-6">Bulan Tagihan</th>
                <th className="py-4 px-6 text-right">Nominal SPP</th>
                <th className="py-4 px-6 text-center">Batas Waktu</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#12192c]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm">{inv.studentName}</div>
                    <div className="text-[11px] text-slate-400">{inv.className}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-bold">{inv.month}</td>
                  <td className="py-4 px-6 text-right font-black text-white text-sm">
                    {formatRupiah(inv.amount)}
                  </td>
                  <td className="py-4 px-6 text-center text-slate-400">{inv.dueDate}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.status === "LUNAS"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : inv.status === "BELUM_LUNAS"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== "LUNAS" && (
                        <button
                          onClick={() => payInvoice(inv.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Bayar</span>
                        </button>
                      )}
                      <button
                        onClick={() => handlePrintReceipt(inv)}
                        className="p-1.5 rounded-lg bg-[#162035] hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                        title="Cetak Kuitansi Resmi"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
                        title="Hapus Tagihan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formal Printable Receipt Component */}
      {receiptToPrint && (
        <div className="print-area hidden print:block bg-white text-black p-8 font-serif border border-black space-y-4">
          <div className="text-center border-b-2 border-black pb-3">
            <h2 className="text-xl font-bold uppercase tracking-wider">
              KUITANSI RESMI PEMBAYARAN SPP & PENDIDIKAN
            </h2>
            <p className="text-xs text-slate-700">
              SEKOLAH TINGGI TEKNOLOGI & VOKASI EDUCORE TITAN • KAWASAN SAINS CYBER
            </p>
            <div className="mt-2 text-xs font-mono">
              NOMOR KUITANSI: KWT/EDU/2026/09/{receiptToPrint.id.toUpperCase().slice(-5)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
            <div>
              <span className="text-slate-600 block">Telah Diterima Dari:</span>
              <strong className="text-sm font-bold">{receiptToPrint.studentName}</strong>
              <div className="text-[11px] text-slate-600">Rombel: {receiptToPrint.className}</div>
            </div>
            <div className="text-right">
              <span className="text-slate-600 block">Tanggal Pembayaran:</span>
              <strong className="text-sm font-bold">
                {receiptToPrint.paidDate || "24 September 2026"}
              </strong>
            </div>
          </div>

          <div className="border border-black p-4 rounded text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span>Untuk Pembayaran:</span>
              <strong className="uppercase">Iuran SPP Bulan {receiptToPrint.month}</strong>
            </div>
            <div className="flex justify-between border-t border-black/40 pt-2 text-sm font-bold">
              <span>Jumlah Tagihan:</span>
              <span>{formatRupiah(receiptToPrint.amount)}</span>
            </div>
          </div>

          <div className="pt-6 grid grid-cols-2 gap-8 text-xs font-mono text-center">
            <div>
              <p>Penyetor / Siswa</p>
              <div className="h-16" />
              <p className="border-t border-black font-bold pt-1">{receiptToPrint.studentName}</p>
            </div>
            <div>
              <p>Bendahara Keuangan Sekolah</p>
              <div className="h-16 flex items-center justify-center">
                <span className="px-3 py-1 border-2 border-emerald-600 text-emerald-700 font-bold uppercase rounded transform -rotate-6">
                  ★ LUNAS ★
                </span>
              </div>
              <p className="border-t border-black font-bold pt-1">Dra. Maya Kartika, M.Pd</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Terbitkan Tagihan Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Terbitkan Faktur Tagihan SPP</span>
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Target Siswa</label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nisn}) — {s.className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Periode Bulan Tagihan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Oktober 2026"
                  value={formMonth}
                  onChange={(e) => setFormMonth(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Nominal Biaya (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Jatuh Tempo</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30"
                >
                  Terbitkan Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
