import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getGradeLetter(score: number): { letter: string; gpa: number; color: string } {
  if (score >= 88) return { letter: "A", gpa: 4.0, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  if (score >= 80) return { letter: "B+", gpa: 3.5, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
  if (score >= 72) return { letter: "B", gpa: 3.0, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
  if (score >= 65) return { letter: "C+", gpa: 2.5, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
  if (score >= 55) return { letter: "C", gpa: 2.0, color: "text-orange-400 bg-orange-500/10 border-orange-500/30" };
  return { letter: "D", gpa: 1.0, color: "text-red-400 bg-red-500/10 border-red-500/30" };
}
