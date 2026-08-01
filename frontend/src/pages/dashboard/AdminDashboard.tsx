import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import StatCard from "./components/StatCard.js";
import QueueTable from "./components/QueueTable.js";
import { getDashboardStats, getTodayQueueList } from "@/services/dashboardService.js";
import { registrasiService } from "@/services/registrasiService.js";
import type { DashboardStats, StatCardData, QueueEntry, QueueStatus } from "@/types/dashboard.types.js";
import { DEFAULT_DASHBOARD_STATS, getStatCardsConfig } from "@/constants/dashboard.js";

interface ApiQueueItem {
  id: string;
  nomorAntrean?: string;
  status?: QueueStatus;
  pasien?: {
    nama?: string;
    nomorRM?: string;
  };
  poli?: {
    nama?: string;
  };
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_DASHBOARD_STATS);
  const [queues, setQueues] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const [statsData, queueData] = await Promise.all([
        getDashboardStats(),
        getTodayQueueList(),
      ]);
      setStats(statsData);

      // Transform raw registrasi data to QueueEntry format
      const formattedQueues: QueueEntry[] = ((queueData || []) as ApiQueueItem[]).map((item) => {
        const patientName = item.pasien?.nama || "Pasien Noname";
        const initials = patientName
          .split(/\s+/)
          .filter(Boolean)
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase() || "PN";

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
      setError("Tidak dapat memuat data dashboard. Sesi login Anda mungkin telah berakhir atau jaringan terputus. Silakan muat ulang halaman.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCallQueue = async (entry: QueueEntry) => {
    try {
      setError(null);
      await registrasiService.panggilAntrean(entry.id);
      await fetchDashboardData();
    } catch (err: any) {
      console.error("[Dashboard Call Queue Error]", err);
      const msg = err.response?.data?.message || "Tidak dapat memanggil antrean saat ini. Silakan coba beberapa saat lagi.";
      setError(msg);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        setIsRefreshing(true);
        setError(null);
        const [statsData, queueData] = await Promise.all([
          getDashboardStats(),
          getTodayQueueList(),
        ]);
        if (isMounted) {
          setStats(statsData);

          const formattedQueues: QueueEntry[] = ((queueData || []) as ApiQueueItem[]).map((item) => {
            const patientName = item.pasien?.nama || "Pasien Noname";
            const initials = patientName
              .split(/\s+/)
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase() || "PN";

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
        }
      } catch (err) {
        console.error("[Dashboard Fetch Error]", err);
        if (isMounted) setError("Tidak dapat memuat data dashboard. Sesi login Anda mungkin telah berakhir atau jaringan terputus. Silakan muat ulang halaman.");
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const statCardsData: StatCardData[] = getStatCardsConfig(stats);

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

      {/* Alert Error Notification Banner */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white transition hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Grid 5 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCardsData.map((card) => (
          <StatCard key={card.id} data={card} />
        ))}
      </div>

      {/* Table Realtime Queue */}
      <QueueTable entries={queues} loading={loading} onCallQueue={handleCallQueue} />
    </div>
  );
}

export default AdminDashboard;