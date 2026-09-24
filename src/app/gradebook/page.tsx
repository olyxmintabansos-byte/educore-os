"use client";

import React, { useState } from "react";
import { useEduCore } from "@/context/EduCoreContext";
import { GradeRecord } from "@/types/educore";
import { getGradeLetter } from "@/lib/utils";
import {
  Award,
  Printer,
  PlusCircle,
  Trash2,
  Edit3,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";

export default function GradebookPage() {
  const { students, courses, grades, addGrade, deleteGrade } = useEduCore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || "std-1"
  );
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  // Form State
  const [formCourseId, setFormCourseId] = useState(courses[0]?.id || "");
  const [formTugas, setFormTugas] = useState<number>(85);
  const [formUts, setFormUts] = useState<number>(80);
  const [formUas, setFormUas] = useState<number>(85);

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];
  const studentGrades = grades.filter((g) => g.studentId === selectedStudentId);

  // Calculate Cumulative Metrics
  const totalSKS = studentGrades.reduce((sum, g) => {
    const c = courses.find((crs) => crs.id === g.courseId);
    return sum + (c ? c.sks : 3);
  }, 0);

  const totalGradePoints = studentGrades.reduce((sum, g) => {
    const c = courses.find((crs) => crs.id === g.courseId);
    const sks = c ? c.sks : 3;
    const { gpa } = getGradeLetter(g.finalScore);
    return sum + gpa * sks;
  }, 0);

  const calculatedIPS = totalSKS > 0 ? (totalGradePoints / totalSKS).toFixed(2) : "0.00";

  const handleAddGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const targetCourse = courses.find((c) => c.id === formCourseId);
    if (!targetCourse) return;

    addGrade({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      courseId: targetCourse.id,
      courseName: targetCourse.name,
      tugas: Number(formTugas),
      uts: Number(formUts),
      uas: Number(formUas),
    });

    setIsInputModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner (No Print) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1424] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Academic Transcripts & Gradebook Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white">Transkrip Nilai & Raport Digital</h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Evaluasi capaian belajar, rekapitulasi bobot SKS, konversi predikat huruf (A - D), dan cetak raport resmi format standar A4.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInputModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Input Nilai Mata Kuliah</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Raport Digital</span>
          </button>
        </div>
      </div>

      {/* Student Selector Bar (No Print) */}
      <div className="no-print bg-[#0d1424] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-400 font-mono">Pilih Siswa:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-[#12192c] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.nisn}) — {s.className}
              </option>
            ))}
          </select>
        </div>

        {/* Quick KPI for selected student */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-slate-400">
            Total SKS Ditempuh: <strong className="text-white font-black">{totalSKS} SKS</strong>
          </div>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="text-slate-400">
            Indeks Prestasi Semester (IPS):{" "}
            <strong className="text-emerald-400 font-black text-sm">
              {calculatedIPS} / 4.00
            </strong>
          </div>
        </div>
      </div>

      {/* Formal Report Card Area (Visible on Screen & Perfectly Formatted for Print) */}
      <div className="print-area bg-[#0d1424] print:bg-white print:text-black border border-slate-800 print:border-none rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Kop Surat Sekolah Formal (Print View) */}
        <div className="border-b-2 border-slate-700 print:border-black pb-4 text-center">
          <h2 className="text-lg font-black tracking-wider uppercase font-serif text-white print:text-black">
            SEKOLAH TINGGI TEKNOLOGI & VOKASI EDUCORE TITAN
          </h2>
          <p className="text-xs text-slate-400 print:text-slate-700 font-serif">
            Jl. Cyber Boulevard No. 101, Kawasan Sains & Edukasi Digital • Telepon: (021) 8899-7700
          </p>
          <div className="mt-2 inline-block px-4 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 print:text-black print:border-black font-mono text-xs font-bold uppercase">
            LEMBAR HASIL STUDI (RAPORT DIGITAL) — SEMESTER GANJIL 2026/2027
          </div>
        </div>

        {/* Student Biodata Sheet */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#11192e] print:bg-slate-50 border border-slate-800 print:border-slate-300 p-4 rounded-xl text-xs font-mono">
          <div>
            <span className="text-slate-400 print:text-slate-600 block text-[10px]">Nama Lengkap</span>
            <span className="font-bold text-white print:text-black text-sm">{selectedStudent?.name}</span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block text-[10px]">Nomor Induk (NISN)</span>
            <span className="font-bold text-white print:text-black">{selectedStudent?.nisn}</span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block text-[10px]">Rombel / Kelas</span>
            <span className="font-bold text-white print:text-black">{selectedStudent?.className}</span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block text-[10px]">Kompetensi Keahlian</span>
            <span className="font-bold text-white print:text-black truncate block">{selectedStudent?.major}</span>
          </div>
        </div>

        {/* Grade Table */}
        <div className="overflow-x-auto border border-slate-800 print:border-slate-400 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#11192e] print:bg-slate-200 text-slate-400 print:text-black font-mono uppercase text-[11px] border-b border-slate-800 print:border-slate-400">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Mata Kuliah / Pelajaran</th>
                <th className="py-3 px-4 text-center">SKS</th>
                <th className="py-3 px-4 text-center">Tugas (30%)</th>
                <th className="py-3 px-4 text-center">UTS (30%)</th>
                <th className="py-3 px-4 text-center">UAS (40%)</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Predikat</th>
                <th className="no-print py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-slate-300 font-mono">
              {studentGrades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500 font-mono">
                    Belum ada nilai mata kuliah yang diinput untuk siswa ini.
                  </td>
                </tr>
              ) : (
                studentGrades.map((grd, idx) => {
                  const courseInfo = courses.find((c) => c.id === grd.courseId);
                  const { letter, color } = getGradeLetter(grd.finalScore);

                  return (
                    <tr key={grd.id} className="hover:bg-[#12192c]/50 transition-colors">
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white print:text-black">
                        {grd.courseName}
                        <span className="block text-[10px] text-slate-400 print:text-slate-600 font-normal">
                          {courseInfo ? courseInfo.code : "CRS-101"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{courseInfo ? courseInfo.sks : 3}</td>
                      <td className="py-3 px-4 text-center">{grd.tugas}</td>
                      <td className="py-3 px-4 text-center">{grd.uts}</td>
                      <td className="py-3 px-4 text-center">{grd.uas}</td>
                      <td className="py-3 px-4 text-center font-bold text-white print:text-black">
                        {grd.finalScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-black text-xs border print:border-none print:text-black ${color}`}
                        >
                          {letter}
                        </span>
                      </td>
                      <td className="no-print py-3 px-4 text-right">
                        <button
                          onClick={() => deleteGrade(grd.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
                          title="Hapus Nilai"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Cumulative Standing Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#11192e] print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 gap-4 font-mono">
          <div>
            <span className="text-xs text-slate-400 print:text-slate-600">Status Yudisium Akademik:</span>
            <div className="text-sm font-black text-emerald-400 print:text-black flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {Number(calculatedIPS) >= 3.75
                  ? "LULUS DENGAN PUJIAN TERTINGGI (CUM LAUDE)"
                  : Number(calculatedIPS) >= 3.5
                  ? "SANGAT MEMUASKAN"
                  : "MEMUASKAN"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 print:text-slate-600">Indeks Prestasi Kumulatif (IPK):</span>
            <div className="text-2xl font-black text-white print:text-black">
              {calculatedIPS} <span className="text-xs text-slate-400 font-normal">/ 4.00</span>
            </div>
          </div>
        </div>

        {/* Signature Box (Print Only or Bottom of Card) */}
        <div className="grid grid-cols-3 gap-8 pt-8 text-center text-xs font-mono text-slate-300 print:text-black">
          <div>
            <p>Orang Tua / Wali Siswa</p>
            <div className="h-16" />
            <p className="border-t border-slate-600 print:border-black font-bold pt-1">
              ( {selectedStudent?.parentName || "........................"} )
            </p>
          </div>
          <div>
            <p>Wali Kelas</p>
            <div className="h-16" />
            <p className="border-t border-slate-600 print:border-black font-bold pt-1">
              ( Dra. Maya Kartika, M.Pd )
            </p>
          </div>
          <div>
            <p>Kepala Sekolah EduCore</p>
            <div className="h-16" />
            <p className="border-t border-slate-600 print:border-black font-bold pt-1">
              ( Dr. Ir. Hendra Wijaya, M.Kom )
            </p>
          </div>
        </div>
      </div>

      {/* Modal Input Nilai */}
      {isInputModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                <span>Input Nilai Mata Kuliah</span>
              </h2>
              <button
                onClick={() => setIsInputModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGradeSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Mata Kuliah</label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code} - {c.sks} SKS)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Tugas (30%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formTugas}
                    onChange={(e) => setFormTugas(Number(e.target.value))}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">UTS (30%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formUts}
                    onChange={(e) => setFormUts(Number(e.target.value))}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">UAS (40%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formUas}
                    onChange={(e) => setFormUas(Number(e.target.value))}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
              </div>

              <div className="bg-[#141e33] p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400">Estimasi Nilai Akhir:</span>
                <div className="text-lg font-black text-emerald-400 mt-0.5">
                  {(formTugas * 0.3 + formUts * 0.3 + formUas * 0.4).toFixed(1)} (Predikat {getGradeLetter(formTugas * 0.3 + formUts * 0.3 + formUas * 0.4).letter})
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsInputModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
