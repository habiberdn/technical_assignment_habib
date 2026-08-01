import React from "react";
import {
  Stethoscope,
  Printer,
  History,
  Activity,
  Thermometer,
  Scale,
  Ruler,
  Building2,
} from "lucide-react";
import type { RegistrasiItem } from "@/types/registrasi.types.js";

interface PemeriksaanAdminViewProps {
  queue: RegistrasiItem;
  onOpenHistory: (pasienId: string) => void;
}

export const PemeriksaanAdminView: React.FC<PemeriksaanAdminViewProps> = ({
  queue,
  onOpenHistory,
}) => {
  const patient = queue.pasien;
  const doctorName = queue.dokter?.nama || "Dokter Penanggung Jawab";
  const rawPoliName = queue.poli?.nama || "Poliklinik";
  const poliName = rawPoliName.replace(/\s*[\(\[][^\]\)]*[\)\]]/g, "").trim();

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHECK_IN":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
            Check In
          </span>
        );
      case "PEMERIKSAAN":
        return (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 animate-pulse">
            Sedang Periksa
          </span>
        );
      case "SELESAI":
        return (
          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700 border border-gray-300">
            Selesai
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
      {/* Header Banner - Emerald Theme */}
      <div className="border-b border-emerald-100 bg-linear-to-r from-emerald-600 to-teal-600 p-4 sm:p-5 text-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-tight">
                {patient?.nama || "Pasien"}
              </h2>
            </div>
            <div className="text-xs text-emerald-100 flex items-center gap-2.5 flex-wrap">
              <span>
                NIK:{" "}
                <strong className="font-mono text-white">{patient?.nik}</strong>
              </span>
              <span>•</span>
              <span>
                Penjamin:{" "}
                <strong className="text-white">{queue.jenisPembayaran}</strong>
              </span>
              <span>•</span>
              <span>
                DPJP: <strong className="text-white">{doctorName}</strong>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white border border-white/20 shadow-2xs">
                <Building2 size={13} className="text-emerald-200 shrink-0" />
                {poliName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => patient?.id && onOpenHistory(patient.id)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition-all cursor-pointer"
          >
            <History size={15} />
            Histori Medis
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-all shadow-sm cursor-pointer"
          >
            <Printer size={15} />
            Cetak Rekam Medis
          </button>
        </div>
      </div>

      {/* Main Executive Summary Document Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Status & DPJP Information Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-emerald-600" size={16} />
            <span>
              Dokter Penanggung Jawab (DPJP):{" "}
              <strong className="text-gray-900">{doctorName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">
              Poli: <strong className="text-gray-900">{poliName}</strong>
            </span>
            {getStatusBadge(queue.status)}
          </div>
        </div>

        {/* 1. S - SUBJEKTIF */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-700">
              S
            </span>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Subjektif (Keluhan Utama &amp; Anamnesa)
            </h3>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3.5 text-xs text-gray-800 leading-relaxed font-medium">
            {queue.keluhanAwal ? (
              <p>&ldquo;{queue.keluhanAwal}&rdquo;</p>
            ) : (
              <p className="text-gray-400 italic">
                Belum ada keluhan utama tercatat.
              </p>
            )}
          </div>
        </div>

        {/* 2. O - OBJEKTIF (Vital Signs Grid Cards) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-xs font-bold text-emerald-700">
              O
            </span>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Objektif (Tanda-tanda Vital / Vital Signs)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-gray-500">
                <Activity size={13} className="text-emerald-600" />
                Tekanan Darah
              </div>
              <p className="text-sm font-bold font-mono text-gray-900">
                120/80{" "}
                <span className="text-[10px] text-gray-500 font-normal">
                  mmHg
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-gray-500">
                <Thermometer size={13} className="text-amber-600" />
                Suhu Tubuh
              </div>
              <p className="text-sm font-bold font-mono text-gray-900">
                36.5{" "}
                <span className="text-[10px] text-gray-500 font-normal">
                  °C
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-gray-500">
                <Scale size={13} className="text-blue-600" />
                Berat Badan
              </div>
              <p className="text-sm font-bold font-mono text-gray-900">
                60{" "}
                <span className="text-[10px] text-gray-500 font-normal">
                  kg
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-gray-500">
                <Ruler size={13} className="text-purple-600" />
                Tinggi Badan
              </div>
              <p className="text-sm font-bold font-mono text-gray-900">
                165{" "}
                <span className="text-[10px] text-gray-500 font-normal">
                  cm
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 3. A - ASESMEN & 4. P - PLAN */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Asesmen */}
          <div className="space-y-2 rounded-xl border border-purple-100 bg-purple-50/30 p-4">
            <div className="flex items-center gap-2 border-b border-purple-200/60 pb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 text-xs font-bold text-purple-700">
                A
              </span>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Asesmen / Diagnosa Medis
              </h3>
            </div>
            <p className="text-xs text-gray-500 italic py-2">
              Belum ada diagnosa dimasukkan oleh dokter.
            </p>
          </div>

          {/* Plan */}
          <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/30 p-4">
            <div className="flex items-center gap-2 border-b border-amber-200/60 pb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-xs font-bold text-amber-700">
                P
              </span>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Plan / Rencana Terapi
              </h3>
            </div>
            <p className="text-xs text-gray-500 italic py-2">
              Belum ada rencana terapi dimasukkan oleh dokter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PemeriksaanAdminView;
