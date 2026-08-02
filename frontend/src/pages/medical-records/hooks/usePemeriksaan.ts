import { useState, useEffect, useCallback, useMemo } from "react";
import { isAxiosError } from "axios";
import { useAuth } from "@/context/AuthContext.js";
import api from "@/services/api.js";
import { registrasiService } from "@/services/registrasiService.js";
import { pemeriksaanService } from "@/services/pemeriksaanService.js";
import type { CreatePemeriksaanDTO } from "@/dtos/pemeriksaan.dto.js";
import type { RegistrasiItem, DokterItem } from "@/types/registrasi.types.js";
import type { Poli } from "@/types/poli.types.js";

export const usePemeriksaan = () => {
  const { user } = useAuth();

  const [queues, setQueues] = useState<RegistrasiItem[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<RegistrasiItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<"SIAP" | "SELESAI" | "ALL">("SIAP");

  const getTodayStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());

  // Filters for Admin view
  const [selectedPoli, setSelectedPoli] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [poliList, setPoliList] = useState<Poli[]>([]);
  const [doctorList, setDoctorList] = useState<DokterItem[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Medical History Modal State
  const [historyPasienId, setHistoryPasienId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Fetch reference lists for Admin filter
  useEffect(() => {
    if (user?.role === "ADMIN") {
      const fetchRefData = async () => {
        try {
          const [poliRes, docRes] = await Promise.all([
            api.get<{ data: Poli[] }>("/poli"),
            registrasiService.getDoctors(),
          ]);
          setPoliList(poliRes.data.data || []);
          setDoctorList(docRes || []);
        } catch {
          // ignore silent
        }
      };
      fetchRefData();
    }
  }, [user?.role]);

  // Fetch queue
  const fetchTodayQueues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = { tanggalKunjungan: selectedDate };
      if (user?.role === "DOKTER" && user.id) {
        params.dokterId = user.id;
      } else if (user?.role === "ADMIN") {
        if (selectedPoli !== "all") params.poliId = selectedPoli;
        if (selectedDoctor !== "all") params.dokterId = selectedDoctor;
      }

      const list = await registrasiService.getRegistrasiList(params);
      setQueues(list);

      setSelectedQueue((prev) => {
        if (list.length === 0) return null;
        if (prev && list.some((item) => item.id === prev.id)) {
          return list.find((item) => item.id === prev.id) || prev;
        }
        const firstSiap = list.find(
          (item) => item.status === "CHECK_IN" || item.status === "PEMERIKSAAN" || item.status === "MENUNGGU"
        );
        return firstSiap || list[0];
      });
    } catch (err: unknown) {
      console.error("[PemeriksaanPage fetch error]", err);
      setError("Tidak dapat memuat daftar antrean pemeriksaan. Silakan muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }, [user, selectedPoli, selectedDoctor, selectedDate]);

  useEffect(() => {
    fetchTodayQueues();
  }, [fetchTodayQueues]);

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

  // Live Statistics for Admin Header
  const stats = useMemo(() => {
    const total = queues.length;
    const waiting = queues.filter((q) => q.status === "MENUNGGU" || q.status === "CHECK_IN").length;
    const inProgress = queues.filter((q) => q.status === "PEMERIKSAAN").length;
    const completed = queues.filter((q) => q.status === "SELESAI").length;
    return { total, waiting, inProgress, completed };
  }, [queues]);

  // Submit SOAP Form (Doctor Only)
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
      await fetchTodayQueues();
    } catch (err: unknown) {
      console.error("[Submit SOAP error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Tidak dapat menyimpan pemeriksaan SOAP. Silakan periksa kembali data isian.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Doctor Calling Queue
  const handleCallQueue = async (queue: RegistrasiItem) => {
    try {
      setError(null);
      await registrasiService.panggilAntrean(queue.id);
      setSuccessMessage(`Memanggil nomor antrean ${queue.nomorAntrean} (${queue.pasien?.nama})...`);
      await fetchTodayQueues();
    } catch (err: unknown) {
      console.error("[Call Queue error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Gagal memanggil antrean pasien.";
      setError(msg);
    }
  };

  // Handle Doctor Updating Status
  const handleUpdateStatus = async (queue: RegistrasiItem, status: "MENUNGGU" | "CHECK_IN" | "PEMERIKSAAN" | "SELESAI") => {
    try {
      setError(null);
      await registrasiService.updateStatus(queue.id, { status });
      setSuccessMessage(`Status antrean ${queue.nomorAntrean} berhasil diperbarui.`);
      await fetchTodayQueues();
    } catch (err: unknown) {
      console.error("[Update Status error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Gagal memperbarui status antrean.";
      setError(msg);
    }
  };

  return {
    user,
    queues,
    selectedQueue,
    activeFilter,
    setActiveFilter,
    selectedDate,
    setSelectedDate,
    selectedPoli,
    setSelectedPoli,
    selectedDoctor,
    setSelectedDoctor,
    poliList,
    doctorList,
    loading,
    submitting,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    historyPasienId,
    isHistoryOpen,
    fetchTodayQueues,
    handleSelectQueue,
    handleOpenHistory,
    handleCloseHistory,
    stats,
    handleSubmitSOAP,
    handleCallQueue,
    handleUpdateStatus,
  };
};
