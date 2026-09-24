"use client";

import React, { useState, useEffect } from "react";
import { useEduCore } from "@/context/EduCoreContext";
import { CBTExam } from "@/types/educore";
import confetti from "canvas-confetti";
import {
  BookOpenCheck,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  HelpCircle,
} from "lucide-react";

export default function CBTExamPage() {
  const { exams, examResults, submitExamResult, students } = useEduCore();

  // Mode: "LOBBY" | "EXAM" | "RESULT"
  const [examMode, setExamMode] = useState<"LOBBY" | "EXAM" | "RESULT">("LOBBY");
  const [activeExam, setActiveExam] = useState<CBTExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(900); // default 15 mins
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastExamResult, setLastExamResult] = useState<
    { score: number; correct: number; total: number; isPassed: boolean } | null
  >(null);

  // Anti-Cheat: detect tab change
  useEffect(() => {
    if (examMode !== "EXAM") return;
    const handleVisibilityChange = () => {
      if (document.hidden) setTabSwitchCount((c) => c + 1);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [examMode]);

  // Countdown timer
  useEffect(() => {
    if (examMode !== "EXAM") return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examMode]);

  const startExam = (exam: CBTExam) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setSecondsRemaining(exam.durationMinutes * 60);
    setTabSwitchCount(0);
    setExamMode("EXAM");
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const toggleFlagQuestion = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;
    let correct = 0;
    activeExam.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) correct++;
    });
    const score = Math.round((correct / activeExam.questions.length) * 100);
    const isPassed = score >= activeExam.passingScore;
    const timeSpent = activeExam.durationMinutes * 60 - secondsRemaining;
    submitExamResult({
      examId: activeExam.id,
      examTitle: activeExam.title,
      studentId: students[0]?.id || "std-1",
      studentName: students[0]?.name || "Raditya Pratama",
      score,
      totalCorrect: correct,
      totalQuestions: activeExam.questions.length,
      isPassed,
      completedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      timeSpentSeconds: timeSpent,
    });
    setLastExamResult({ score, correct, total: activeExam.questions.length, isPassed });
    setExamMode("RESULT");
    if (score >= 80) {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {
        console.error("Confetti failed", e);
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* LOBBY */}
      {examMode === "LOBBY" && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1424] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <BookOpenCheck className="w-4 h-4" />
                <span>Computer-Based Testing (CBT) Engine</span>
              </div>
              <h1 className="text-2xl font-black text-white">Platform Ujian Berbasis Komputer</h1>
              <p className="text-sm text-slate-400 max-w-2xl mt-1">
                Sistem ujian daring berintegritas tinggi dengan timer otomatis, pengacakan soal, sistem anti-curang, dan penilaian instan.
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs bg-[#11192d] p-3 rounded-xl border border-slate-800">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-white font-bold">Anti-Cheat Active</div>
                <div className="text-[10px] text-slate-400">Deteksi Pindah Tab Aktif</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-[#0d1424] border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold">
                      {exam.subject}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.durationMinutes} Menit
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{exam.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Penguji: {exam.author}</p>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono text-xs">
                    <div className="bg-[#12192c] p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Jumlah Soal</span>
                      <strong className="text-white font-bold">{exam.totalQuestions} Butir</strong>
                    </div>
                    <div className="bg-[#12192c] p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Batas KKM</span>
                      <strong className="text-amber-400 font-bold">{exam.passingScore} Poin</strong>
                    </div>
                    <div className="bg-[#12192c] p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Sasaran</span>
                      <strong className="text-cyan-400 font-bold">{exam.targetClass}</strong>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => startExam(exam)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  <span>Mulai Ujian Sekarang</span>
                </button>
              </div>
            ))}
          </div>

          {/* Exam History */}
          <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Riwayat Hasil Ujian CBT Siswa</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#11192e] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">Ujian</th>
                    <th className="py-3 px-4 text-center">Skor Akhir</th>
                    <th className="py-3 px-4 text-center">Ketuntasan</th>
                    <th className="py-3 px-4 text-right">Waktu Selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {examResults.map((res) => (
                    <tr key={res.id}>
                      <td className="py-3 px-4 font-bold text-white">{res.studentName}</td>
                      <td className="py-3 px-4 text-slate-300">{res.examTitle}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">{res.score} / 100</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            res.isPassed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/10 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {res.isPassed ? "LULUS" : "REMEDIAL"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">{res.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE EXAM */}
      {examMode === "EXAM" && activeExam && (
        <div className="space-y-6">
          <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                {activeExam.subject}
              </span>
              <h2 className="text-base font-black text-white">{activeExam.title}</h2>
            </div>
            <div className="flex items-center gap-4">
              {tabSwitchCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Pelanggaran Tab: {tabSwitchCount}x</span>
                </div>
              )}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-black border ${
                  secondsRemaining < 180
                    ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                    : "bg-[#141e33] text-white border-slate-700"
                }`}
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Question Area */}
            <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
                <span className="font-bold text-indigo-400">
                  Soal Nomor #{currentQuestionIndex + 1} dari {activeExam.questions.length}
                </span>
                <button
                  onClick={toggleFlagQuestion}
                  className={`px-3 py-1 rounded-lg border font-bold transition-all ${
                    flaggedQuestions[currentQuestionIndex]
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                      : "bg-[#141e33] border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {flaggedQuestions[currentQuestionIndex] ? "★ Ditandai Ragu-Ragu" : "Tandai Ragu-Ragu"}
                </button>
              </div>

              <div className="text-white text-base leading-relaxed font-medium">
                {activeExam.questions[currentQuestionIndex]?.questionText}
              </div>

              <div className="space-y-3 pt-2">
                {activeExam.questions[currentQuestionIndex]?.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  const letter = ["A", "B", "C", "D"][optIdx];
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                          : "bg-[#11192e] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#141e33]"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((p) => p - 1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-mono font-bold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>
                {currentQuestionIndex < activeExam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((p) => p + 1)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-mono font-bold text-white flex items-center gap-1.5"
                  >
                    <span>Selanjutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-black text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Kumpulkan & Selesai Ujian</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigator */}
            <div className="lg:col-span-4 bg-[#0d1424] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
                <BookOpenCheck className="w-4 h-4 text-indigo-400" />
                <span>Navigasi Nomor Soal</span>
              </h3>
              <div className="grid grid-cols-5 gap-2.5">
                {activeExam.questions.map((_, idx) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];
                  const isCurrent = currentQuestionIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-xl font-mono text-xs font-bold transition-all border ${
                        isCurrent ? "ring-2 ring-indigo-400 border-white" : ""
                      } ${
                        isFlagged
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                          : isAnswered
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-[#11192e] border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
                  <span>Sudah Dijawab ({Object.keys(userAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/40" />
                  <span>Ragu-ragu ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#11192e] border border-slate-800" />
                  <span>Belum Dijawab ({activeExam.questions.length - Object.keys(userAnswers).length})</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSubmitExam}
                  className="w-full py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Selesai Ujian Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULT */}
      {examMode === "RESULT" && lastExamResult && (
        <div className="max-w-xl mx-auto bg-[#0d1424] border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center text-4xl shadow-inner">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                lastExamResult.isPassed
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {lastExamResult.isPassed ? "SELAMAT! ANDA LULUS CBT" : "PERLU REMEDIAL"}
            </span>
            <h2 className="text-3xl font-black text-white font-mono mt-3">
              Skor: {lastExamResult.score} / 100
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Menjawab benar {lastExamResult.correct} dari {lastExamResult.total} butir pertanyaan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#12192c] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Akurasi Jawaban</span>
              <strong className="text-emerald-400 text-sm">
                {Math.round((lastExamResult.correct / lastExamResult.total) * 100)}%
              </strong>
            </div>
            <div className="bg-[#12192c] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Pelanggaran Tab</span>
              <strong className="text-white text-sm">{tabSwitchCount} Kali</strong>
            </div>
          </div>
          <button
            onClick={() => setExamMode("LOBBY")}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Kembali ke Beranda Ujian
          </button>
        </div>
      )}
    </div>
  );
}
