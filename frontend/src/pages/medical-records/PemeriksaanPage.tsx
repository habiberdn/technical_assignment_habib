import { useEffect, useState, useCallback } from "react";
import { Stethoscope, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext.js";
import { registrasiService } from "@/services/registrasiService.js";
import { pemeriksaanService } from "@/services/pemeriksaanService.js";
import type { RegistrasiItem } from "@/types/registrasi.types.js";
import type { CreatePemeriksaanDTO } from "@/dtos/pemeriksaan.dto.js";

import { PemeriksaanQueueSidebar } from "./components/PemeriksaanQueueSidebar.js";
import { PemeriksaanSOAPForm } from "./components/PemeriksaanSOAPForm.js";
import { RiwayatMedisModal } from "./components/RiwayatMedisModal.js";

export function PemeriksaanPage() {
  const { user } = useAuth();
  const [queues, setQueues] = useState<RegistrasiItem[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<RegistrasiItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<"SIAP" | "SELESAI" | "ALL">("SIAP");

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [historyPasienId, setHistoryPasienId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Fetch today's queue for this doctor
  const fetchTodayQueues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const todayStr = `${year}-${month}-${day}`;

      const params: any = { tanggalKunjungan: todayStr };
      if (user?.role === "DOKTER" && user.id) {
        params.dokterId = user.id;
      }

      const list = await registrasiService.getRegistrasiList(params);

      setQueues(list);

      // Auto-select first queue if none selected
      if (list.length > 0 && !selectedQueue) {
        const firstSiap = list.find(
          (item) => item.status === "CHECK_IN" || item.status === "PEMERIKSAAN" || item.status === "MENUNGGU"
        );
        setSelectedQueue(firstSiap || list[0]);
      }
    } catch (err: any) {
      console.error("[PemeriksaanPage fetch error]", err);
      setError("Tidak dapat memuat daftar antrean pemeriksaan hari ini. Silakan muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }, [selectedQueue, user?.id, user?.role]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const todayStr = `${year}-${month}-${day}`;

        const params: any = { tanggalKunjungan: todayStr };
        if (user?.role === "DOKTER" && user.id) {
          params.dokterId = user.id;
        }

        const list = await registrasiService.getRegistrasiList(params);

        if (isMounted) {
          setQueues(list);
          if (list.length > 0) {
            const firstSiap = list.find(
              (item) => item.status === "CHECK_IN" || item.status === "PEMERIKSAAN" || item.status === "MENUNGGU"
            );
            setSelectedQueue(firstSiap || list[0]);
          }
        }
      } catch (err: any) {
        console.error("[PemeriksaanPage fetch error]", err);
        if (isMounted)
          setError("Tidak dapat memuat daftar antrean pemeriksaan hari ini. Silakan muat ulang halaman.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.role]);

  const handleSelectQueue = (queue: RegistrasiItem) => {
    setSelectedQueue(queue);
  };

  const handleOpenHistory = (pasienId: string) => {
    setHistoryPasienId(pasienId);
    setIsHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
    setHistoryPasienId(null);
  };

  // Submit SOAP Form
  const handleSubmitSOAP = async (payload: CreatePemeriksaanDTO) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      setError(null);

      await pemeriksaanService.createPemeriksaan(payload);

      setSuccessMessage(
        `Pemeriksaan SOAP untuk pasien '${selectedQueue?.pasien?.nama}' (${selectedQueue?.nomorAntrean}) berhasil disimpan & diselesaikan!`
      );

      // Refresh list & select next waiting patient
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const todayStr = `${year}-${month}-${day}`;

      const params: any = { tanggalKunjungan: todayStr };
      if (user?.role === "DOKTER" && user.id) {
        params.dokterId = user.id;
      }

      const updatedList = await registrasiService.getRegistrasiList(params);

      setQueues(updatedList);

      const nextPatient = updatedList.find(
        (item) => item.status === "CHECK_IN" || item.status === "PEMERIKSAAN" || item.status === "MENUNGGU"
      );

      setSelectedQueue(nextPatient || null);
    } catch (err: any) {
      console.error("[Submit SOAP error]", err);
      const msg = err.response?.data?.message || "Tidak dapat menyimpan pemeriksaan SOAP. Silakan periksa kembali data isian.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl flex items-center gap-2">
            <Stethoscope className="text-emerald-600" />
            Ruang Periksa Dokter (SOAP)
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Alur terpadu panggil pasien, periksa rekam medis (SOAP), dan catat resep obat secara realtime.
          </p>
        </div>
      </div>

      {/* Alert Notifications */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="rounded-md p-1 text-red-600 hover:bg-red-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="rounded-md p-1 text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main 2-Column Integrated Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 flex-1 min-h-0">
        {/* Left Column: Queue Sidebar List */}
        <div className="lg:col-span-4 h-full min-h-[300px] lg:min-h-0">
          <PemeriksaanQueueSidebar
            queues={queues}
            selectedQueueId={selectedQueue?.id || null}
            loading={loading}
            activeFilter={activeFilter}
            onSelectQueue={handleSelectQueue}
            onFilterChange={setActiveFilter}
            onRefresh={fetchTodayQueues}
          />
        </div>

        {/* Right Column: SOAP Examination Workspace */}
        <div className="lg:col-span-8 h-full min-h-[500px] lg:min-h-0">
          {selectedQueue ? (
            <PemeriksaanSOAPForm
              key={selectedQueue.id}
              queue={selectedQueue}
              submitting={submitting}
              onOpenHistory={handleOpenHistory}
              onSubmit={handleSubmitSOAP}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xs">
              <Stethoscope size={36} className="text-gray-300 mb-3" />
              <h3 className="text-sm font-bold text-gray-800">Pilih Pasien Dari Antrean</h3>
              <p className="mt-1 text-xs text-gray-400 max-w-sm">
                Silakan pilih salah satu pasien dari daftar antrean sebelah kiri untuk mulai mengisi Rekam Medis (SOAP) dan resep obat.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Riwayat Medis Pasien */}
      <RiwayatMedisModal
        isOpen={isHistoryOpen}
        pasienId={historyPasienId}
        onClose={handleCloseHistory}
      />
    </div>
  );
}

export default PemeriksaanPage;
