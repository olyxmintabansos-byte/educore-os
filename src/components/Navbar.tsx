"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Award,
  BookOpenCheck,
  CalendarDays,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { useEduCore } from "@/context/EduCoreContext";

export function Navbar() {
  const pathname = usePathname();
  const { resetAllData } = useEduCore();

  const navLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/students", label: "SIS Siswa", icon: Users },
    { href: "/gradebook", label: "Gradebook", icon: Award },
    { href: "/cbt", label: "CBT Ujian", icon: BookOpenCheck },
    { href: "/attendance", label: "Jadwal & Absen", icon: CalendarDays },
    { href: "/finance", label: "SPP & Kas", icon: Receipt },
  ];

  return (
    <nav className="h-16 border-b border-slate-800/80 bg-[#090d18] px-6 flex items-center justify-between select-none sticky top-0 z-50">
      {/* Brand Identity */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-sm text-white tracking-wider font-mono">
              EDUCORE <span className="text-indigo-400">TITAN</span>
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono font-bold">
              SCHOOL OS
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Enterprise Academic & Student Information System</p>
        </div>
      </Link>

      {/* Nav Navigation Links */}
      <div className="hidden lg:flex items-center gap-1 bg-[#101728] border border-slate-800 p-1 rounded-xl text-xs">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right Controls: Semester Badge & Reset */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-[#121a2f] border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold">Ganjil 2026/2027</span>
        </div>

        <button
          onClick={resetAllData}
          title="Reset Database EduCore ke Seed Awal"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
