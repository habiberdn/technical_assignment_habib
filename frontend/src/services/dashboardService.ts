import api from "@/services/api.js";
import type { DashboardStats } from "@/types/dashboard.types.js";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get("/dashboard/stats");
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (err) {
    console.error("[getDashboardStats error]", err);
  }
  return {
    totalPasien: 0,
    totalPasienHariIni: 0,
    totalAntreanHariIni: 0,
    totalPasienMenunggu: 0,
    totalPasienSelesai: 0,
  };
};

export const getTodayQueueList = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    const response = await api.get(`/registrasi?tanggalKunjungan=${todayStr}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (err) {
    console.error("[getTodayQueueList error]", err);
    return [];
  }
};
