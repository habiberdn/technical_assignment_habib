import api from "./api.js";
import type { DashboardStats } from "../types/dashboard.types.js";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats");
  if (response.data && response.data.data) {
    return response.data.data;
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
    const todayStr = new Date().toISOString().split("T")[0];
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
