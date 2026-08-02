import type { DashboardStats, StatCardData } from "@/types/dashboard.types.js";

export const DEFAULT_DASHBOARD_STATS: DashboardStats = {
  totalPasien: 0,
  totalPasienHariIni: 0,
  totalAntreanHariIni: 0,
  totalPasienMenunggu: 0,
  totalPasienSelesai: 0,
};

export const getStatCardsConfig = (stats: DashboardStats, role?: string): StatCardData[] => {
  const isDokter = role === "DOKTER";

  return [
    {
      id: "total-pasien",
      label: isDokter ? "Total Pasien Saya" : "Total Pasien Terdaftar",
      value: stats.totalPasien,
      icon: "users",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "total-pasien-hari-ini",
      label: isDokter ? "Pasien Baru Saya Hari Ini" : "Pasien Baru Hari Ini",
      value: stats.totalPasienHariIni,
      icon: "calendar",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700",
    },
    {
      id: "total-antrean-hari-ini",
      label: isDokter ? "Total Antrean Poli Saya" : "Total Antrean Hari Ini",
      value: stats.totalAntreanHariIni,
      icon: "queue",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      id: "total-pasien-menunggu",
      label: isDokter ? "Pasien Menunggu Saya" : "Pasien Menunggu",
      value: stats.totalPasienMenunggu,
      icon: "clock",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      id: "total-pasien-selesai",
      label: isDokter ? "Pasien Selesai Saya Periksa" : "Pasien Selesai Dilayani",
      value: stats.totalPasienSelesai,
      icon: "check",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];
};
