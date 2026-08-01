import type { StatusKunjungan, JenisPembayaran } from "@/types/registrasi.types.js";

export interface StatusStyle {
  label: string;
  className: string;
}

export const STATUS_STYLES: Record<StatusKunjungan, StatusStyle> = {
  MENUNGGU: { label: "Menunggu", className: "bg-amber-100 text-amber-800 border-amber-200" },
  CHECK_IN: { label: "Check In", className: "bg-blue-100 text-blue-800 border-blue-200" },
  PEMERIKSAAN: { label: "Pemeriksaan", className: "bg-emerald-100 text-emerald-800 font-semibold border-emerald-200" },
  SELESAI: { label: "Selesai", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

export const JENIS_PEMBAYARAN_OPTIONS: { value: JenisPembayaran; label: string }[] = [
  { value: "UMUM", label: "UMUM / Mandiri" },
  { value: "BPJS", label: "BPJS Kesehatan" },
  { value: "ASURANSI", label: "Asuransi Swasta" },
];

export const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "MENUNGGU", label: "Menunggu" },
  { value: "CHECK_IN", label: "Check In" },
  { value: "PEMERIKSAAN", label: "Pemeriksaan" },
  { value: "SELESAI", label: "Selesai" },
];
