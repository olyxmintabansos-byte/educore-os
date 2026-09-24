"use client";

import React from "react";
import Link from "next/link";
import { useEduCore } from "@/context/EduCoreContext";
import { formatRupiah } from "@/lib/utils";
import {
  Users,
  Award,
  CalendarCheck2,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  BellRing,
  BookOpen,
  PlusCircle,
  FileCheck2,
  Building,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const { students, teachers, courses, announcements, invoices } = useEduCore();

  // Metrics Calculation
  const totalStudents = students.length;
  const avgGpa = (
    students.reduce((sum, s) => sum + s.gpa, 0) / (totalStudents || 1)
  ).toFixed(2);
  const avgAttendance = (
    students.reduce((sum, s) => sum + s.attendancePercent, 0) / (totalStudents || 1)
  ).toFixed(1);
  const totalPaidRevenue = invoices
    .filter((inv) => inv.status === "LUNAS")
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Distribution chart data
  const gpaData = [
    { grade: "A (3.75 - 4.00)", count: students.filter((s) => s.gpa >= 3.75).length, color: "#10b981" },
    { grade: "B+ (3.50 - 3.74)", count: students.filter((s) => s.gpa >= 3.5 && s.gpa < 3.75).length, color: "#06b6d4" },
    { grade: "B (3.00 - 3.49)", count: students.filter((s) => s.gpa >= 3.0 && s.gpa < 3.5).length, color: "#6366f1" },
    { grade: "C (2.00 - 2.99)", count: students.filter((s) => s.gpa >= 2.0 && s.gpa < 3.0).length, color: "#f59e0b" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1424] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Pusat Kendali Akademik Terpadu</span>
          </div>
          <h1 className="text-2xl font-black text-white">Ringkasan Eksekutif Kampus & Sekolah</h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Pantau performa nilai mutu siswa, kehadiran terintegrasi, kalender ujian, dan penerimaan SPP secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/students"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Kelola Siswa (SIS)</span>
          </Link>
          <Link
            href="/gradebook"
            className="px-4 py-2.5 rounded-xl bg-[#141e33] border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Buka Raport</span>
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0d1424] border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Siswa Terdaftar</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">{totalStudents} Siswa</div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% Status Aktif Akademik</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0d1424] border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Indeks Prestasi Rata-rata</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">{avgGpa} / 4.00</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Predikat Mutu: Sangat Memuaskan</div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0d1424] border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tingkat Kehadiran Presensi</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-2">{avgAttendance}%</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Presensi QR Scanner Valid</div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0d1424] border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Kas SPP Terbayar</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-2">
            {formatRupiah(totalPaidRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            {invoices.filter((i) => i.status === "LUNAS").length} dari {invoices.length} Tagihan Lunas
          </div>
        </div>
      </div>

      {/* Main Grid: Left Charts & SIS Preview, Right Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): GPA Chart & Top Ranking */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart Card */}
          <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Distribusi Nilai Prestasi Siswa (IPK)</span>
                </h2>
                <p className="text-xs text-slate-400">Komparasi jumlah siswa per jenjang predikat mutu</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#141e33] border border-slate-700 text-slate-300">
                Semester Ganjil
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gpaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="grade" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {gpaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Ranking Siswa Leaderboard */}
          <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Peringkat Teladan Akademik Terbaik</span>
              </h2>
              <Link href="/students" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                <span>Lihat Seluruh Siswa</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {[...students]
                .sort((a, b) => b.gpa - a.gpa)
                .slice(0, 4)
                .map((std, idx) => (
                  <div
                    key={std.id}
                    className="p-3 bg-[#11192e] border border-slate-800/80 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          idx === 0
                            ? "bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20"
                            : idx === 1
                            ? "bg-slate-300 text-slate-950"
                            : idx === 2
                            ? "bg-amber-700 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{std.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{std.nisn} • {std.className}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black font-mono text-emerald-400">IPK {std.gpa.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Presensi {std.attendancePercent}%</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): School Announcements & Faculty Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Announcements Card */}
          <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-purple-400" />
                <span>Papan Pengumuman Kampus</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">{announcements.length} Warta</span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    ann.isUrgent
                      ? "bg-red-950/20 border-red-500/40"
                      : "bg-[#11192e] border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        ann.isUrgent
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-slate-500">{ann.date}</span>
                  </div>
                  <h3 className="font-bold text-white text-xs mt-1">{ann.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono mt-2">
                    Penulis: {ann.author}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Faculty Overview */}
          <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Dewan Pengajar Terverifikasi</span>
              </h2>
              <span className="text-xs font-mono text-cyan-400 font-bold">{teachers.length} Dosen/Guru</span>
            </div>

            <div className="space-y-2">
              {teachers.slice(0, 3).map((tch) => (
                <div key={tch.id} className="p-2.5 bg-[#11192e] border border-slate-800 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg">
                    {tch.avatar}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{tch.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{tch.subject}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
