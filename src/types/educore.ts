export type StudentStatus = "AKTIF" | "CUTI" | "ALUMNI";
export type StudentMajor = "Rekayasa Perangkat Lunak" | "Teknik Komputer & Jaringan" | "Ilmu Alam & MIPA";

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: "L" | "P";
  className: string;
  major: StudentMajor;
  gpa: number; // 0.0 - 4.0
  attendancePercent: number; // 0 - 100
  status: StudentStatus;
  phone: string;
  parentName: string;
  email: string;
  avatar: string;
  joinedYear: number;
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  avatar: string;
  classesAssigned: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  sks: number;
  teacherId: string;
  teacherName: string;
  semester: string;
  scheduleDay: string;
  scheduleTime: string;
  room: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  tugas: number;
  uts: number;
  uas: number;
  finalScore: number;
  letterGrade: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: "AKADEMIK" | "KEUANGAN" | "UJIAN" | "KEGIATAN";
  author: string;
  content: string;
  isUrgent: boolean;
}

export interface TuitionInvoice {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  month: string;
  amount: number;
  status: "LUNAS" | "BELUM_LUNAS" | "TUNGGAKAN";
  dueDate: string;
  paidDate?: string;
}

// SPRINT 3 & 4: CBT Online Exam Engine Types
export interface ExamQuestion {
  id: string;
  questionText: string;
  options: string[]; // [A, B, C, D]
  correctAnswerIndex: number; // 0, 1, 2, 3
  explanation: string;
  points: number;
}

export interface CBTExam {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  author: string;
  targetClass: string;
  questions: ExamQuestion[];
  status: "TERJADWAL" | "SEDANG_BERLANGSUNG" | "SELESAI";
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number; // 0 - 100
  totalCorrect: number;
  totalQuestions: number;
  isPassed: boolean;
  completedAt: string;
  timeSpentSeconds: number;
}

// SPRINT 5 & 6: Attendance Record Type
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  className: string;
  date: string;
  time: string;
  status: "HADIR" | "TERLAMBAT" | "IZIN" | "SAKIT" | "ALPA";
  method: "QR_SCAN" | "MANUAL" | "RFID";
  notes?: string;
}
