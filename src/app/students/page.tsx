"use client";

import React, { useState } from "react";
import { useEduCore } from "@/context/EduCoreContext";
import { Student, StudentMajor } from "@/types/educore";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

export default function StudentsPage() {
  const { students, addStudent, deleteStudent } = useEduCore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form New Student State
  const [formData, setFormData] = useState({
    name: "",
    nisn: "",
    gender: "L" as "L" | "P",
    className: "XII RPL 1",
    major: "Rekayasa Perangkat Lunak" as StudentMajor,
    phone: "",
    parentName: "",
    email: "",
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery);
    const matchesMajor = selectedMajor === "ALL" || s.major === selectedMajor;
    return matchesSearch && matchesMajor;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nisn) return;

    addStudent({
      ...formData,
      gpa: 3.5,
      attendancePercent: 100,
      status: "AKTIF",
      avatar: formData.gender === "L" ? "👨‍🎓" : "👩‍🎓",
      joinedYear: 2026,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: "",
      nisn: "",
      gender: "L",
      className: "XII RPL 1",
      major: "Rekayasa Perangkat Lunak",
      phone: "",
      parentName: "",
      email: "",
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1424] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Student Information System (SIS)</span>
          </div>
          <h1 className="text-2xl font-black text-white">Direktori Induk Siswa & Akademik</h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Basis data komprehensif profil siswa, rekam presensi, capaian nilai kumulatif (IPK), dan kontak wali.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama siswa atau NISN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12192c] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">Jurusan:</span>
          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="bg-[#12192c] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
          >
            <option value="ALL">Semua Jurusan</option>
            <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
            <option value="Ilmu Alam & MIPA">Ilmu Alam & MIPA</option>
            <option value="Teknik Komputer & Jaringan">Teknik Komputer & Jaringan</option>
          </select>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#11192e] text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Siswa / NISN</th>
                <th className="py-4 px-6">Kelas & Jurusan</th>
                <th className="py-4 px-6 text-center">IPK / Rapor</th>
                <th className="py-4 px-6 text-center">Kehadiran</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                    Tidak ada data siswa yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-[#12192c]/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
                          {std.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{std.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">NISN: {std.nisn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-200">{std.className}</div>
                      <div className="text-[11px] text-slate-400">{std.major}</div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="font-mono font-black text-sm text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {std.gpa.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center font-mono">
                      <div className="font-bold text-white">{std.attendancePercent}%</div>
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded-full"
                          style={{ width: `${std.attendancePercent}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {std.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudent(std)}
                          className="p-2 rounded-lg bg-[#162035] hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer"
                          title="Lihat Detail Profil Siswa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStudent(std.id)}
                          className="p-2 rounded-lg bg-[#162035] hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                          title="Hapus Siswa dari Database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>Form Pendaftaran Siswa Baru</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Rayhan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">NISN (10 Digit)</label>
                  <input
                    type="text"
                    required
                    placeholder="0068192899"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "L" | "P" })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Rombel / Kelas</label>
                  <input
                    type="text"
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pilihan Jurusan</label>
                  <select
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value as StudentMajor })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                    <option value="Teknik Komputer & Jaringan">Teknik Komputer & Jaringan</option>
                    <option value="Ilmu Alam & MIPA">Ilmu Alam & MIPA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">No. WhatsApp Siswa</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Nama Wali"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Student Profile */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Biodata Profil Siswa</span>
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-[#1e293b] border border-slate-700 mx-auto flex items-center justify-center text-4xl shadow-inner mb-2">
                {selectedStudent.avatar}
              </div>
              <h3 className="font-black text-white text-base">{selectedStudent.name}</h3>
              <p className="text-xs text-indigo-400 font-mono mt-0.5">{selectedStudent.nisn} • {selectedStudent.className}</p>
              <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                {selectedStudent.status} SEJAK {selectedStudent.joinedYear}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#141e33] p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Indeks Prestasi Kumulatif</div>
                <div className="text-base font-black text-emerald-400 mt-0.5">
                  {selectedStudent.gpa.toFixed(2)} / 4.00
                </div>
              </div>
              <div className="bg-[#141e33] p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Tingkat Kehadiran</div>
                <div className="text-base font-black text-cyan-400 mt-0.5">
                  {selectedStudent.attendancePercent}%
                </div>
              </div>
            </div>

            <div className="bg-[#141e33] p-3 rounded-xl border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedStudent.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedStudent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Wali: {selectedStudent.parentName}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
