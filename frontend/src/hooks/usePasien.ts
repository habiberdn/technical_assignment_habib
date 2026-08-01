import { isAxiosError } from "axios";
import { useState, useEffect, useCallback } from "react";
import { pasienService } from "@/services/pasienService.js";
import { exportPasienToExcel } from "@/utils/exportExcel.js";
import type { Pasien, PaginationMeta } from "@/types/pasien.types.js";
import type { CreatePasienDTO, UpdatePasienDTO } from "@/dtos/pasien.dto.js";

export function usePasien() {
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimitState] = useState<number>(10);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
  const [selectedPasienDetail, setSelectedPasienDetail] = useState<Pasien | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const fetchPasienList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await pasienService.getPasienList({ search, page, limit });
      setPasienList(res.data);
      setMeta(res.meta);
    } catch (err: unknown) {
      console.error("[usePasien fetch error]", err);
      setError("Tidak dapat memuat data pasien. Sesi login Anda mungkin telah berakhir atau koneksi internet terganggu.");
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    let isMounted = true;
    const loadPasienData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await pasienService.getPasienList({ search, page, limit });
        if (isMounted) {
          setPasienList(res.data);
          setMeta(res.meta);
        }
      } catch (err: unknown) {
        console.error("[usePasien fetch error]", err);
        if (isMounted) setError("Tidak dapat memuat data pasien. Sesi login Anda mungkin telah berakhir atau koneksi internet terganggu.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPasienData();
    return () => {
      isMounted = false;
    };
  }, [search, page, limit]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const setLimit = (newLimit: number) => {
    setLimitState(newLimit);
    setPage(1);
  };

  const openCreateModal = () => {
    setSelectedPasien(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEditModal = (pasien: Pasien) => {
    setSelectedPasien(pasien);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const openDeleteModal = (pasien: Pasien) => {
    setSelectedPasien(pasien);
    setIsDeleteOpen(true);
  };

  const openImportModal = () => {
    setIsImportOpen(true);
  };

  const openDetailModal = async (pasien: Pasien) => {
    setSelectedPasienDetail(pasien);
    setIsDetailOpen(true);
    setDetailLoading(true);
    try {
      const detailData = await pasienService.getPasienById(pasien.id);
      setSelectedPasienDetail(detailData);
    } catch (err) {
      console.error("[usePasien detail fetch error]", err);
      // Keep basic patient data if detailed fetch fails
    } finally {
      setDetailLoading(false);
    }
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setSelectedPasien(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSelectedPasien(null);
  };

  const closeImportModal = () => {
    setIsImportOpen(false);
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setSelectedPasienDetail(null);
  };

  const handleFormSubmit = async (data: CreatePasienDTO | UpdatePasienDTO) => {
    try {
      setSubmitting(true);
      setError(null);
      if (formMode === "create") {
        await pasienService.createPasien(data as CreatePasienDTO);
        setSuccessMessage("Pasien baru berhasil ditambahkan!");
      } else if (formMode === "edit" && selectedPasien) {
        await pasienService.updatePasien(selectedPasien.id, data as UpdatePasienDTO);
        setSuccessMessage("Data pasien berhasil diperbarui!");
      }
      closeFormModal();
      await fetchPasienList();
    } catch (err: unknown) {
      console.error("[usePasien submit error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Tidak dapat menyimpan data pasien. Silakan periksa kembali isian data.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPasien) return;
    try {
      setSubmitting(true);
      setError(null);
      await pasienService.deletePasien(selectedPasien.id);
      setSuccessMessage("Data pasien berhasil dihapus.");
      closeDeleteModal();
      await fetchPasienList();
    } catch (err: unknown) {
      console.error("[usePasien delete error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Tidak dapat menghapus data pasien. Silakan coba beberapa saat lagi.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      setError(null);
      // Fetch all patients (or current search query results) up to 1000
      const res = await pasienService.getPasienList({ search, page: 1, limit: 1000 });
      if (res.data.length === 0) {
        setError("Tidak ada data pasien yang dapat dieksport.");
        return;
      }
      exportPasienToExcel(res.data);
      setSuccessMessage(`Berhasil mengeksport ${res.data.length} data pasien ke Excel!`);
    } catch (err) {
      console.error("[usePasien export error]", err);
      setError("Tidak dapat mengunduh berkas Excel. Silakan coba kembali nanti.");
    } finally {
      setExporting(false);
    }
  };

  const handleImportSuccess = () => {
    setSuccessMessage("Import data pasien berhasil!");
    fetchPasienList();
  };

  const clearNotifications = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    pasienList,
    meta,
    loading,
    submitting,
    exporting,
    error,
    successMessage,
    search,
    page,
    limit,
    isFormOpen,
    isDeleteOpen,
    isImportOpen,
    isDetailOpen,
    selectedPasien,
    selectedPasienDetail,
    detailLoading,
    formMode,

    // Actions
    setPage,
    setLimit,
    handleSearchChange,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openImportModal,
    openDetailModal,
    closeFormModal,
    closeDeleteModal,
    closeImportModal,
    closeDetailModal,
    handleFormSubmit,
    handleDeleteConfirm,
    handleExportExcel,
    handleImportSuccess,
    clearNotifications,
    refresh: fetchPasienList,
  };
}
