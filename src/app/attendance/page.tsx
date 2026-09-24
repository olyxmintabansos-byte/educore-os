"use client";

import React, { useState } from "react";
import { useEduCore } from "@/context/EduCoreContext";
import {
  CalendarDays,
  QrCode,
  CheckCircle2,
  Clock,
  Scan,
  Users,
  Search,
  Sparkles,
} from "lucide-react";

export default function AttendancePage() {
  const { students, courses, attendanceLogs, recordAttendance } = useEduCore();

  const [activeTab, setActiveTab] = useState<"SCANNER" | "SCHEDULE" | "LOGS">("SCANNER");
  const [selectedStudentForScan, setSelectedStudentForScan] = useState<string>(
    students[0]?.id || "std-1"
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);

  // Filter logs state
  const [searchStudent, setSearchStudent] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const todayDate = "24 Sep 2026";

  const handleSimulateScan = () => {
    const student = students.find((s) => s.id === selectedStudentForScan);
    if (!student) return;

    setIsScanning(true);
    setScanSuccessMessage(null);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} WIB`;

      recordAttendance({
        studentId: student.id,
        studentName: student.name,
        nisn: student.nisn,
        className: student.className,
        date: "2026-09-24",
        time: timeStr,
        status: "HADIR",
        method: "QR_SCAN",
        notes: "Presensi QR Valid Terverifikasi",
      });

      setIsScanning(false);
      setScanSuccessMessage(`Presensi Terverifikasi! ${student.name} (${student.className}) Tercatat Hadir pada ${timeStr}`);
    }, 1200);
  };

  const filteredLogs = attendanceLogs.filter((log) => {
    const matchesSearch =
      log.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      log.nisn.includes(searchStudent);
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1424] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Matriks Akademik & Presensi Cerdas</span>
          </div>
          <h1 className="text-2xl font-black text-white">Jadwal Kuliah & Presensi QR Scanner</h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Pantau jadwal perkuliahan mingguan per rombel serta verifikasi kehadiran siswa otomatis via pemindai barcode / QR Code.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#101726] border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab("SCANNER")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "SCANNER"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Scanner QR
          </button>
          <button
            onClick={() => setActiveTab("SCHEDULE")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "SCHEDULE"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Jadwal Matriks
          </button>
          <button
            onClick={() => setActiveTab("LOGS")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "LOGS"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Log Harian ({attendanceLogs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: QR SCANNER SIMULATOR */}
      {activeTab === "SCANNER" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Scanner Viewport (7 cols) */}
          <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="font-bold text-white text-base flex items-center gap-2">
                  <Scan className="w-4 h-4 text-cyan-400" />
                  <span>Kamera Terminal Presensi Siswa</span>
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> KAMERA ONLINE
                </span>
              </div>

              {/* Viewport Frame */}
              <div className="mt-6 relative w-full h-80 rounded-2xl bg-[#070b14] border-2 border-dashed border-slate-700 flex flex-col items-center justify-center overflow-hidden">
                {/* Laser scan line animation */}
                <div
                  className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] transition-all duration-700 pointer-events-none ${
                    isScanning ? "animate-bounce top-1/2" : "top-1/4 opacity-40"
                  }`}
                />

                {/* Target Frame Targeter */}
                <div className="w-48 h-48 rounded-2xl border-2 border-cyan-400/80 p-2 flex flex-col items-center justify-center relative bg-cyan-950/10 backdrop-blur-[2px]">
                  <QrCode className="w-24 h-24 text-cyan-300 opacity-80" />
                  <span className="text-[10px] font-mono text-cyan-400 mt-2 font-bold tracking-wider">
                    {isScanning ? "MEMINDAI QR CODE..." : "ARAHKAN QR KARTU SISWA"}
                  </span>

                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                </div>

                <div className="absolute bottom-3 text-center text-[11px] font-mono text-slate-500">
                  Terminal Gerbang Utama • Sesi Masuk Pagi (06:30 - 07:30)
                </div>
              </div>
            </div>

            {/* Success alert message */}
            {scanSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{scanSuccessMessage}</span>
              </div>
            )}

            {/* Scan Simulation Controls */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono text-slate-400 block">
                Simulasi Kartu Siswa yang Melakukan Tap:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedStudentForScan}
                  onChange={(e) => setSelectedStudentForScan(e.target.value)}
                  className="w-full bg-[#12192c] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nisn}) — {s.className}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isScanning ? "Memindai..." : "Scan Kartu Siswa"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Today Summary & Live Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Statistik Presensi Hari Ini ({todayDate})</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#12192c] p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Siswa Terdaftar</span>
                  <div className="text-xl font-bold text-white mt-0.5">{students.length} Siswa</div>
                </div>
                <div className="bg-[#12192c] p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Sudah Presensi Masuk</span>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">
                    {attendanceLogs.filter((l) => l.status === "HADIR" || l.status === "TERLAMBAT").length} Siswa
                  </div>
                </div>
              </div>
            </div>

            {/* Live Feed List */}
            <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Aktivitas Tap Terakhir</span>
              </h3>

              <div className="space-y-2">
                {attendanceLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#11192e] border border-slate-800/80 rounded-xl flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{log.studentName}</div>
                      <div className="text-[10px] text-slate-400">{log.className} • {log.method}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {log.time}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{log.notes || "Hadir"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE MATRIX */}
      {activeTab === "SCHEDULE" && (
        <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <span>Matriks Jadwal Perkuliahan & Lab Praktikum</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Semester Ganjil 2026/2027</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#11192e] text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Hari & Waktu</th>
                  <th className="py-3 px-4">Kode & Mata Kuliah</th>
                  <th className="py-3 px-4">Bobot</th>
                  <th className="py-3 px-4">Dosen / Guru Pengampu</th>
                  <th className="py-3 px-4 text-right">Ruangan / Lab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {courses.map((crs) => (
                  <tr key={crs.id} className="hover:bg-[#12192c]/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-cyan-400">
                      <div>{crs.scheduleDay}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{crs.scheduleTime}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{crs.name}</div>
                      <div className="text-[10px] text-slate-400">{crs.code}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold">
                        {crs.sks} SKS
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{crs.teacherName}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {crs.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DAILY LOGS TABLE */}
      {activeTab === "LOGS" && (
        <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h2 className="font-bold text-white text-base">Arsip Rekapitulasi Presensi Harian</h2>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari siswa atau NISN..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full bg-[#12192c] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#12192c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="HADIR">Hadir</option>
                <option value="TERLAMBAT">Terlambat</option>
                <option value="SAKIT">Sakit</option>
                <option value="IZIN">Izin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#11192e] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Waktu Tap</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4 text-right">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#12192c]/50">
                    <td className="py-3 px-4 font-bold text-white">{log.studentName}</td>
                    <td className="py-3 px-4 text-slate-300">{log.className}</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">{log.time}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === "HADIR"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : log.status === "TERLAMBAT"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{log.method}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{log.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
