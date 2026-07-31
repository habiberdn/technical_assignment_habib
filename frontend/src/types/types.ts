export interface PatientQueueItem {
  id: string;
  patientName: string;
  poli: string;
  noAntrean: string;
  status: 'Menunggu' | 'Diperiksa' | 'Selesai';
}

export interface QuickActionItem {
  icon: React.ReactNode;
  label: string;
}

export interface SystemAlertItem {
  type: 'warning' | 'info';
  message: string;
  details: string;
  timeAgo: string;
}