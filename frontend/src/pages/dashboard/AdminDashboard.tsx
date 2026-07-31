import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import StatCard from "./components/StatCard.js";
import QueueTable from "./components/QueueTable.js";
import { getDashboardStats, getTodayQueueList } from "@/services/dashboardService.js";
import type { DashboardStats, StatCardData, QueueEntry } from "@/types/dashboard.types.js";

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPasien: 0,
    totalPasienHariIni: 0,
    totalAntreanHariIni: 0,
    totalPasienMenunggu: 0,
    totalPasienSelesai: 0,
  });
  const [queues, setQueues] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      const [statsData, queueData] = await Promise.all([
        getDashboardStats(),
        getTodayQueueList(),
      ]);
      setStats(statsData);

      // Transform raw registrasi data to QueueEntry format
      const formattedQueues: QueueEntry[] = (queueData || []).map((item: any) => {
        const patientName = item.pasien?.nama || "Pasien Noname";
        const initials = patientName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

        return {
          id: item.id,
          patientName,
          medicalRecordNo: `RM: ${item.pasien?.nomorRM || "-"}`,
          initials,
          avatarColor: "bg-emerald-100 text-emerald-700",
          clinic: item.poli?.nama || "Poli Umum",
          queueNo: item.nomorAntrean || "-",
          status: item.status || "MENUNGGU",
        };
      });

      setQueues(formattedQueues);
    } catch (err) {
      console.error("[Dashboard Fetch Error]", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCardsData: StatCardData[] = [
    {
      id: "total-pasien",
      label: "Total Pasien Terdaftar",
      value: stats.totalPasien,
      icon: "users",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "total-pasien-hari-ini",
      label: "Pasien Baru Hari Ini",
      value: stats.totalPasienHariIni,
      icon: "calendar",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700",
    },
    {
      id: "total-antrean-hari-ini",
      label: "Total Antrean Hari Ini",
      value: stats.totalAntreanHariIni,
      icon: "queue",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      id: "total-pasien-menunggu",
      label: "Pasien Menunggu",
      value: stats.totalPasienMenunggu,
      icon: "clock",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      id: "total-pasien-selesai",
      label: "Pasien Selesai Dilayani",
      value: stats.totalPasienSelesai,
      icon: "check",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Admin Dashboard Overview</h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Informasi realtime operasional & statistik pelayanan klinik.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Grid 5 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCardsData.map((card) => (
          <StatCard key={card.id} data={card} />
        ))}
      </div>

      {/* Table Realtime Queue */}
      <QueueTable entries={queues} loading={loading} />
    </div>
  );
}

export default AdminDashboard;