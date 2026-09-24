"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Student,
  Teacher,
  Course,
  GradeRecord,
  Announcement,
  TuitionInvoice,
  CBTExam,
  ExamResult,
  AttendanceRecord,
} from "@/types/educore";
import { getGradeLetter } from "@/lib/utils";

const SEED_STUDENTS: Student[] = [
  { id: "std-1", nisn: "0068192841", name: "Raditya Pratama", gender: "L", className: "XII RPL 1", major: "Rekayasa Perangkat Lunak", gpa: 3.88, attendancePercent: 98, status: "AKTIF", phone: "0812-9842-1101", parentName: "Bambang Pratama", email: "raditya.p@student.sch.id", avatar: "👨‍🎓", joinedYear: 2024 },
  { id: "std-2", nisn: "0068192842", name: "Siti Nurhaliza", gender: "P", className: "XII RPL 1", major: "Rekayasa Perangkat Lunak", gpa: 3.92, attendancePercent: 96, status: "AKTIF", phone: "0813-8821-3490", parentName: "Sulaiman", email: "siti.n@student.sch.id", avatar: "👩‍🎓", joinedYear: 2024 },
  { id: "std-3", nisn: "0068192843", name: "Bima Arya Wijaya", gender: "L", className: "XII RPL 2", major: "Rekayasa Perangkat Lunak", gpa: 3.45, attendancePercent: 92, status: "AKTIF", phone: "0815-7762-1920", parentName: "Arya Wijaya", email: "bima.a@student.sch.id", avatar: "🧑‍💻", joinedYear: 2024 },
  { id: "std-4", nisn: "0068192844", name: "Clarissa Aurelia", gender: "P", className: "XI MIPA 1", major: "Ilmu Alam & MIPA", gpa: 3.95, attendancePercent: 100, status: "AKTIF", phone: "0812-1190-4821", parentName: "Hendra Kusuma", email: "clarissa.a@student.sch.id", avatar: "👩‍🔬", joinedYear: 2025 },
  { id: "std-5", nisn: "0068192845", name: "Farhan Zaki Alamsyah", gender: "L", className: "XI MIPA 1", major: "Ilmu Alam & MIPA", gpa: 3.30, attendancePercent: 88, status: "AKTIF", phone: "0818-4491-0023", parentName: "Zaki Alamsyah", email: "farhan.z@student.sch.id", avatar: "🧑‍🔬", joinedYear: 2025 },
  { id: "std-6", nisn: "0068192846", name: "Nabila Putri Kirana", gender: "P", className: "XI TKJ 1", major: "Teknik Komputer & Jaringan", gpa: 3.65, attendancePercent: 94, status: "AKTIF", phone: "0813-9021-4455", parentName: "Agus Kirana", email: "nabila.p@student.sch.id", avatar: "👩‍💻", joinedYear: 2025 },
];

const SEED_TEACHERS: Teacher[] = [
  { id: "tch-1", nip: "197801122003121002", name: "Dr. Ir. Hendra Wijaya, M.Kom", subject: "Algoritma & Pemrograman Lanjut", phone: "0811-2233-4455", email: "hendra.w@school.sch.id", avatar: "👨‍🏫", classesAssigned: ["XII RPL 1", "XII RPL 2"] },
  { id: "tch-2", nip: "198205152008012009", name: "Dra. Maya Kartika, M.Pd", subject: "Fisika Modern & Instrumentasi", phone: "0812-4455-6677", email: "maya.k@school.sch.id", avatar: "👩‍🏫", classesAssigned: ["XI MIPA 1"] },
  { id: "tch-3", nip: "198509202010011014", name: "Ahmad Fauzi, S.Kom, M.T", subject: "Arsitektur Jaringan & Cyber Security", phone: "0813-7788-9900", email: "ahmad.f@school.sch.id", avatar: "👨‍🏫", classesAssigned: ["XI TKJ 1"] },
];

const SEED_COURSES: Course[] = [
  { id: "crs-1", code: "RPL-301", name: "Pemrograman Web Fullstack & Cloud", sks: 4, teacherId: "tch-1", teacherName: "Dr. Ir. Hendra Wijaya, M.Kom", semester: "Ganjil 2026/2027", scheduleDay: "Senin", scheduleTime: "08:00 - 11:30", room: "Lab Komputer 3" },
  { id: "crs-2", code: "MIPA-201", name: "Fisika Kuantum & Dinamika Fluida", sks: 3, teacherId: "tch-2", teacherName: "Dra. Maya Kartika, M.Pd", semester: "Ganjil 2026/2027", scheduleDay: "Selasa", scheduleTime: "09:30 - 12:00", room: "Ruang Teori 204" },
  { id: "crs-3", code: "TKJ-202", name: "Administrasi Infrastruktur Jaringan Cloud", sks: 4, teacherId: "tch-3", teacherName: "Ahmad Fauzi, S.Kom, M.T", semester: "Ganjil 2026/2027", scheduleDay: "Rabu", scheduleTime: "08:00 - 11:30", room: "Lab Jaringan Server" },
  { id: "crs-4", code: "ENG-301", name: "English for Technical Communication", sks: 2, teacherId: "tch-1", teacherName: "Dr. Ir. Hendra Wijaya, M.Kom", semester: "Ganjil 2026/2027", scheduleDay: "Kamis", scheduleTime: "13:00 - 14:40", room: "Ruang Teori 102" },
];

const SEED_GRADES: GradeRecord[] = [
  { id: "grd-1", studentId: "std-1", studentName: "Raditya Pratama", courseId: "crs-1", courseName: "Pemrograman Web Fullstack & Cloud", tugas: 90, uts: 88, uas: 92, finalScore: 90.2, letterGrade: "A" },
  { id: "grd-2", studentId: "std-1", studentName: "Raditya Pratama", courseId: "crs-4", courseName: "English for Technical Communication", tugas: 85, uts: 82, uas: 88, finalScore: 85.3, letterGrade: "B+" },
  { id: "grd-3", studentId: "std-2", studentName: "Siti Nurhaliza", courseId: "crs-1", courseName: "Pemrograman Web Fullstack & Cloud", tugas: 95, uts: 92, uas: 94, finalScore: 93.7, letterGrade: "A" },
  { id: "grd-4", studentId: "std-4", studentName: "Clarissa Aurelia", courseId: "crs-2", courseName: "Fisika Kuantum & Dinamika Fluida", tugas: 98, uts: 96, uas: 95, finalScore: 96.2, letterGrade: "A" },
  { id: "grd-5", studentId: "std-5", studentName: "Farhan Zaki Alamsyah", courseId: "crs-2", courseName: "Fisika Kuantum & Dinamika Fluida", tugas: 75, uts: 70, uas: 78, finalScore: 74.7, letterGrade: "B" },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann-1", title: "Jadwal Ujian Tengah Semester (UTS) Berbasis Komputer", date: "24 Sep 2026", category: "UJIAN", author: "Wakasek Kurikulum", content: "Pelaksanaan UTS semester ganjil akan dimulai serentak menggunakan platform CBT EduCore pada 5 Oktober 2026. Seluruh siswa wajib memastikan login aktif.", isUrgent: true },
  { id: "ann-2", title: "Batas Akhir Pelunasan Biaya SPP & Praktikum September", date: "20 Sep 2026", category: "KEUANGAN", author: "Bagian Keuangan & TU", content: "Kuitansi pelunasan SPP dapat diunduh otomatis pada portal keuangan. Siswa yang belum melunasi dimohon menyelesaikan sebelum 30 September.", isUrgent: false },
  { id: "ann-3", title: "Workshop AI & Cloud Architecture bersama Praktisi Industri", date: "18 Sep 2026", category: "KEGIATAN", author: "Humas & Industri", content: "Kuliah umum dan hands-on Next.js 16 serta deployment cloud untuk seluruh siswa tingkat akhir jurusan RPL dan TKJ.", isUrgent: false },
];

const SEED_INVOICES: TuitionInvoice[] = [
  { id: "inv-1", studentId: "std-1", studentName: "Raditya Pratama", className: "XII RPL 1", month: "September 2026", amount: 750000, status: "LUNAS", dueDate: "2026-09-10", paidDate: "2026-09-05" },
  { id: "inv-2", studentId: "std-2", studentName: "Siti Nurhaliza", className: "XII RPL 1", month: "September 2026", amount: 750000, status: "LUNAS", dueDate: "2026-09-10", paidDate: "2026-09-08" },
  { id: "inv-3", studentId: "std-3", studentName: "Bima Arya Wijaya", className: "XII RPL 2", month: "September 2026", amount: 750000, status: "BELUM_LUNAS", dueDate: "2026-09-30" },
  { id: "inv-4", studentId: "std-4", studentName: "Clarissa Aurelia", className: "XI MIPA 1", month: "September 2026", amount: 800000, status: "LUNAS", dueDate: "2026-09-10", paidDate: "2026-09-02" },
  { id: "inv-5", studentId: "std-5", studentName: "Farhan Zaki Alamsyah", className: "XI MIPA 1", month: "September 2026", amount: 800000, status: "TUNGGAKAN", dueDate: "2026-08-31" },
  { id: "inv-6", studentId: "std-6", studentName: "Nabila Putri Kirana", className: "XI TKJ 1", month: "September 2026", amount: 750000, status: "LUNAS", dueDate: "2026-09-10", paidDate: "2026-09-09" },
];

const SEED_EXAMS: CBTExam[] = [
  {
    id: "exm-1",
    title: "Ujian Sertifikasi Kejuruan: Fullstack Web & Cloud Engineering",
    subject: "Rekayasa Perangkat Lunak",
    durationMinutes: 15,
    totalQuestions: 5,
    passingScore: 75,
    author: "Dr. Ir. Hendra Wijaya, M.Kom",
    targetClass: "XII RPL 1",
    status: "SEDANG_BERLANGSUNG",
    questions: [
      { id: "q-1", questionText: "Pada Next.js App Router, file apakah yang wajib dibuat untuk mendefinisikan layout UI bersama antar rute?", options: ["page.tsx", "layout.tsx", "template.tsx", "route.ts"], correctAnswerIndex: 1, explanation: "File layout.tsx mendefinisikan UI bersama (shared UI) yang tidak me-remount state saat navigasi antar rute.", points: 20 },
      { id: "q-2", questionText: "Bagaimana cara melakukan import Tailwind CSS versi 4 yang tepat di dalam globals.css?", options: ["@tailwind base; @tailwind components;", "@import 'tailwindcss';", "import 'tailwindcss/v4';", "require('tailwindcss');"], correctAnswerIndex: 1, explanation: "Tailwind v4 menggantikan tiga baris @tailwind lama dengan satu baris CSS native: @import 'tailwindcss';", points: 20 },
      { id: "q-3", questionText: "Fitur TypeScript apakah yang memastikan sebuah variabel tidak boleh bernilai null atau undefined secara implisit?", options: ["strictNullChecks", "noImplicitAny", "target: esnext", "allowJs"], correctAnswerIndex: 0, explanation: "strictNullChecks memaksa developer menangani nilai null dan undefined secara eksplisit.", points: 20 },
      { id: "q-4", questionText: "Mengapa file '.nojekyll' wajib disertakan saat mendeploy static export Next.js ke GitHub Pages?", options: ["Untuk mempercepat loading gambar", "Untuk mencegah GitHub Pages memblokir direktori yang diawali garis bawah (_next)", "Untuk mengaktifkan SSL HTTPS gratis", "Untuk mengompresi file HTML menjadi format Gzip"], correctAnswerIndex: 1, explanation: "GitHub Pages secara default menjalankan Jekyll engine yang mengabaikan folder dengan awalan underscore (_next).", points: 20 },
      { id: "q-5", questionText: "Metode HTTP manakah yang paling tepat dan idempotent digunakan untuk memperbarui seluruh resource data secara utuh?", options: ["POST", "PUT", "PATCH", "DELETE"], correctAnswerIndex: 1, explanation: "PUT bersifat idempotent dan digunakan untuk me-replace seluruh entitas resource target.", points: 20 },
    ],
  },
  {
    id: "exm-2",
    title: "Ujian Tengah Semester: Fisika Kuantum & Dinamika Partikel",
    subject: "Ilmu Alam & MIPA",
    durationMinutes: 15,
    totalQuestions: 5,
    passingScore: 70,
    author: "Dra. Maya Kartika, M.Pd",
    targetClass: "XI MIPA 1",
    status: "SEDANG_BERLANGSUNG",
    questions: [
      { id: "q-201", questionText: "Siapakah ilmuwan yang pertama kali merumuskan konsep kuantisasi energi radiasi benda hitam E = h.f?", options: ["Albert Einstein", "Max Planck", "Niels Bohr", "Erwin Schrödinger"], correctAnswerIndex: 1, explanation: "Max Planck pada tahun 1900 mengemukakan bahwa energi radiasi dipancarkan dalam paket-paket diskrit (kuanta).", points: 20 },
      { id: "q-202", questionText: "Peristiwa lepasnya elektron dari permukaan logam ketika disinari cahaya dengan frekuensi tertentu dinamakan...", options: ["Efek Compton", "Efek Fotolistrik", "Hamburan Rutherford", "Bremsstrahlung"], correctAnswerIndex: 1, explanation: "Efek fotolistrik membuktikan sifat partikel dari cahaya di mana foton menumbuk elektron.", points: 20 },
      { id: "q-203", questionText: "Menurut Prinsip Ketidakpastian Heisenberg, pasangan besaran manakah yang tidak dapat diukur secara simultan dengan presisi tak hingga?", options: ["Massa dan Kecepatan", "Posisi dan Momentum", "Energi dan Muatan", "Suhu dan Tekanan"], correctAnswerIndex: 1, explanation: "Delta x dikali Delta p >= h-bar / 2. Posisi dan momentum tidak dapat ditentukan serentak secara eksak.", points: 20 },
      { id: "q-204", questionText: "Partikel yang memiliki dualisme gelombang-partikel memenuhi panjang gelombang de Broglie lambda =", options: ["h / p", "p / h", "h . c / E", "m . v^2"], correctAnswerIndex: 0, explanation: "Panjang gelombang materi de Broglie dirumuskan lambda = h / p = h / (m.v).", points: 20 },
      { id: "q-205", questionText: "Satuan energi yang lazim digunakan dalam fisika atomik dan partikel kuantum adalah...", options: ["Joule", "Electron Volt (eV)", "Watt", "Calorie"], correctAnswerIndex: 1, explanation: "1 eV = 1.602 x 10^-19 Joule, satuan standar dalam skala kuantum atomik.", points: 20 },
    ],
  },
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  { id: "att-1", studentId: "std-1", studentName: "Raditya Pratama", nisn: "0068192841", className: "XII RPL 1", date: "2026-09-24", time: "07:08 WIB", status: "HADIR", method: "QR_SCAN", notes: "Tepat Waktu" },
  { id: "att-2", studentId: "std-2", studentName: "Siti Nurhaliza", nisn: "0068192842", className: "XII RPL 1", date: "2026-09-24", time: "07:12 WIB", status: "HADIR", method: "QR_SCAN", notes: "Tepat Waktu" },
  { id: "att-3", studentId: "std-3", studentName: "Bima Arya Wijaya", nisn: "0068192843", className: "XII RPL 2", date: "2026-09-24", time: "07:22 WIB", status: "TERLAMBAT", method: "RFID", notes: "Terlambat 7 menit" },
  { id: "att-4", studentId: "std-4", studentName: "Clarissa Aurelia", nisn: "0068192844", className: "XI MIPA 1", date: "2026-09-24", time: "07:05 WIB", status: "HADIR", method: "QR_SCAN", notes: "Presensi Sempurna" },
  { id: "att-5", studentId: "std-5", studentName: "Farhan Zaki Alamsyah", nisn: "0068192845", className: "XI MIPA 1", date: "2026-09-24", time: "07:30 WIB", status: "SAKIT", method: "MANUAL", notes: "Surat Dokter Terlampir" },
  { id: "att-6", studentId: "std-6", studentName: "Nabila Putri Kirana", nisn: "0068192846", className: "XI TKJ 1", date: "2026-09-24", time: "07:14 WIB", status: "HADIR", method: "QR_SCAN", notes: "Tepat Waktu" },
];

interface EduCoreContextType {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  grades: GradeRecord[];
  announcements: Announcement[];
  invoices: TuitionInvoice[];
  exams: CBTExam[];
  examResults: ExamResult[];
  attendanceLogs: AttendanceRecord[];
  addStudent: (student: Omit<Student, "id">) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addGrade: (grade: Omit<GradeRecord, "id" | "finalScore" | "letterGrade">) => void;
  updateGrade: (id: string, grade: Partial<GradeRecord>) => void;
  deleteGrade: (id: string) => void;
  payInvoice: (invoiceId: string) => void;
  createInvoice: (invoice: Omit<TuitionInvoice, "id">) => void;
  deleteInvoice: (id: string) => void;
  submitExamResult: (result: Omit<ExamResult, "id">) => void;
  recordAttendance: (record: Omit<AttendanceRecord, "id">) => void;
  resetAllData: () => void;
}

const EduCoreContext = createContext<EduCoreContextType | undefined>(undefined);

export function EduCoreProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(SEED_TEACHERS);
  const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
  const [grades, setGrades] = useState<GradeRecord[]>(SEED_GRADES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(SEED_ANNOUNCEMENTS);
  const [invoices, setInvoices] = useState<TuitionInvoice[]>(SEED_INVOICES);
  const [exams, setExams] = useState<CBTExam[]>(SEED_EXAMS);
  const [examResults, setExamResults] = useState<ExamResult[]>([
    {
      id: "res-1",
      examId: "exm-1",
      examTitle: "Ujian Sertifikasi Kejuruan: Fullstack Web & Cloud Engineering",
      studentId: "std-1",
      studentName: "Raditya Pratama",
      score: 100,
      totalCorrect: 5,
      totalQuestions: 5,
      isPassed: true,
      completedAt: "24 Sep 2026, 10:15 WIB",
      timeSpentSeconds: 420,
    },
  ]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(SEED_ATTENDANCE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load LocalStorage
  useEffect(() => {
    try {
      const sStd = localStorage.getItem("educore_students");
      const sTch = localStorage.getItem("educore_teachers");
      const sCrs = localStorage.getItem("educore_courses");
      const sGrd = localStorage.getItem("educore_grades");
      const sAnn = localStorage.getItem("educore_announcements");
      const sInv = localStorage.getItem("educore_invoices");
      const sExm = localStorage.getItem("educore_exams");
      const sRes = localStorage.getItem("educore_results");
      const sAtt = localStorage.getItem("educore_attendance");

      if (sStd) setStudents(JSON.parse(sStd));
      if (sTch) setTeachers(JSON.parse(sTch));
      if (sCrs) setCourses(JSON.parse(sCrs));
      if (sGrd) setGrades(JSON.parse(sGrd));
      if (sAnn) setAnnouncements(JSON.parse(sAnn));
      if (sInv) setInvoices(JSON.parse(sInv));
      if (sExm) setExams(JSON.parse(sExm));
      if (sRes) setExamResults(JSON.parse(sRes));
      if (sAtt) setAttendanceLogs(JSON.parse(sAtt));
    } catch (e) {
      console.error("Failed to load EduCore storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("educore_students", JSON.stringify(students));
    localStorage.setItem("educore_teachers", JSON.stringify(teachers));
    localStorage.setItem("educore_courses", JSON.stringify(courses));
    localStorage.setItem("educore_grades", JSON.stringify(grades));
    localStorage.setItem("educore_announcements", JSON.stringify(announcements));
    localStorage.setItem("educore_invoices", JSON.stringify(invoices));
    localStorage.setItem("educore_exams", JSON.stringify(exams));
    localStorage.setItem("educore_results", JSON.stringify(examResults));
    localStorage.setItem("educore_attendance", JSON.stringify(attendanceLogs));
  }, [students, teachers, courses, grades, announcements, invoices, exams, examResults, attendanceLogs, isLoaded]);

  const addStudent = (data: Omit<Student, "id">) => {
    const newStudent: Student = { ...data, id: `std-${Date.now()}` };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const addGrade = (data: Omit<GradeRecord, "id" | "finalScore" | "letterGrade">) => {
    const finalScore = Number(((data.tugas * 0.3) + (data.uts * 0.3) + (data.uas * 0.4)).toFixed(1));
    const { letter } = getGradeLetter(finalScore);
    const newGrade: GradeRecord = {
      ...data,
      id: `grd-${Date.now()}`,
      finalScore,
      letterGrade: letter,
    };
    setGrades((prev) => [newGrade, ...prev]);
  };

  const updateGrade = (id: string, updates: Partial<GradeRecord>) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const merged = { ...g, ...updates };
        const finalScore = Number(((merged.tugas * 0.3) + (merged.uts * 0.3) + (merged.uas * 0.4)).toFixed(1));
        const { letter } = getGradeLetter(finalScore);
        return { ...merged, finalScore, letterGrade: letter };
      })
    );
  };

  const deleteGrade = (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const payInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: "LUNAS",
              paidDate: new Date().toISOString().split("T")[0],
            }
          : inv
      )
    );
  };

  const createInvoice = (data: Omit<TuitionInvoice, "id">) => {
    const newInv: TuitionInvoice = {
      ...data,
      id: `inv-${Date.now()}`,
    };
    setInvoices((prev) => [newInv, ...prev]);
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const submitExamResult = (data: Omit<ExamResult, "id">) => {
    const newResult: ExamResult = {
      ...data,
      id: `res-${Date.now()}`,
    };
    setExamResults((prev) => [newResult, ...prev]);
  };

  const recordAttendance = (data: Omit<AttendanceRecord, "id">) => {
    const newRecord: AttendanceRecord = {
      ...data,
      id: `att-${Date.now()}`,
    };
    setAttendanceLogs((prev) => [newRecord, ...prev]);

    // Automatically recalculate student attendance percent
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== data.studentId) return s;
        const studentLogs = [newRecord, ...attendanceLogs.filter((a) => a.studentId === s.id)];
        const attended = studentLogs.filter((a) => a.status === "HADIR" || a.status === "TERLAMBAT").length;
        const percent = Math.round((attended / studentLogs.length) * 100);
        return { ...s, attendancePercent: percent };
      })
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setStudents(SEED_STUDENTS);
    setTeachers(SEED_TEACHERS);
    setCourses(SEED_COURSES);
    setGrades(SEED_GRADES);
    setAnnouncements(SEED_ANNOUNCEMENTS);
    setInvoices(SEED_INVOICES);
    setExams(SEED_EXAMS);
    setAttendanceLogs(SEED_ATTENDANCE);
    window.location.reload();
  };

  return (
    <EduCoreContext.Provider
      value={{
        students,
        teachers,
        courses,
        grades,
        announcements,
        invoices,
        exams,
        examResults,
        attendanceLogs,
        addStudent,
        updateStudent,
        deleteStudent,
        addGrade,
        updateGrade,
        deleteGrade,
        payInvoice,
        createInvoice,
        deleteInvoice,
        submitExamResult,
        recordAttendance,
        resetAllData,
      }}
    >
      {children}
    </EduCoreContext.Provider>
  );
}

export function useEduCore() {
  const context = useContext(EduCoreContext);
  if (!context) throw new Error("useEduCore must be used within EduCoreProvider");
  return context;
}
