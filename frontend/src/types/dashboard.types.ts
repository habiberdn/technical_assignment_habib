export type QueueStatus = "MENUNGGU" | "CHECK_IN" | "PEMERIKSAAN" | "SELESAI";

export interface DashboardStats {
  totalPasien: number;
  totalPasienHariIni: number;
  totalAntreanHariIni: number;
  totalPasienMenunggu: number;
  totalPasienSelesai: number;
}

export interface StatCardData {
  id: string;
  label: string;
  value: number | string;
  icon: string;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
  badge?: string;
}

export interface QueueEntry {
  id: string;
  patientName: string;
  medicalRecordNo: string;
  initials: string;
  avatarColor: string;
  clinic: string;
  queueNo: string;
  status: QueueStatus;
}
