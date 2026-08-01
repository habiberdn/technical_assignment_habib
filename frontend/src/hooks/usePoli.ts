import { isAxiosError } from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";
import { poliService } from "@/services/poliService.js";
import type { Poli } from "@/types/poli.types.js";
import type { CreatePoliDTO, UpdatePoliDTO } from "@/dtos/poli.dto.js";

export function usePoli() {
  const [poliList, setPoliList] = useState<Poli[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedPoli, setSelectedPoli] = useState<Poli | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Fetch list of Poli
  const fetchPoliList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await poliService.getAllPoli();
      setPoliList(data);
    } catch (err: unknown) {
      console.error("[usePoli fetch error]", err);
      setError("Tidak dapat memuat data poliklinik. Sesi login Anda mungkin telah berakhir atau koneksi internet terganggu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadPoliData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await poliService.getAllPoli();
        if (isMounted) {
          setPoliList(data);
        }
      } catch (err: unknown) {
        console.error("[usePoli fetch error]", err);
        if (isMounted) setError("Tidak dapat memuat data poliklinik. Sesi login Anda mungkin telah berakhir atau koneksi internet terganggu.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPoliData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Client-side search filtering
  const filteredPoliList = useMemo(() => {
    if (!search.trim()) return poliList;
    const query = search.toLowerCase().trim();
    return poliList.filter(
      (item) =>
        item.nama.toLowerCase().includes(query) ||
        item.kode.toLowerCase().includes(query)
    );
  }, [poliList, search]);

  const openCreateModal = () => {
    setSelectedPoli(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEditModal = (poli: Poli) => {
    setSelectedPoli(poli);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const openDeleteModal = (poli: Poli) => {
    setSelectedPoli(poli);
    setIsDeleteOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setSelectedPoli(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSelectedPoli(null);
  };

  // Submit Create or Update Poli
  const handleFormSubmit = async (data: CreatePoliDTO | UpdatePoliDTO) => {
    try {
      setSubmitting(true);
      setError(null);
      if (formMode === "create") {
        await poliService.createPoli(data as CreatePoliDTO);
        setSuccessMessage("Poliklinik baru berhasil ditambahkan!");
      } else if (formMode === "edit" && selectedPoli) {
        await poliService.updatePoli(selectedPoli.id, data as UpdatePoliDTO);
        setSuccessMessage("Data poliklinik berhasil diperbarui!");
      }
      closeFormModal();
      await fetchPoliList();
    } catch (err: unknown) {
      console.error("[usePoli submit error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Tidak dapat menyimpan data poliklinik. Silakan periksa isian data.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete Poli
  const handleDeleteConfirm = async () => {
    if (!selectedPoli) return;
    try {
      setSubmitting(true);
      setError(null);
      await poliService.deletePoli(selectedPoli.id);
      setSuccessMessage("Data poliklinik berhasil dihapus.");
      closeDeleteModal();
      await fetchPoliList();
    } catch (err: unknown) {
      console.error("[usePoli delete error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Tidak dapat menghapus data poliklinik. Silakan coba beberapa saat lagi.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const clearNotifications = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    poliList: filteredPoliList,
    totalCount: poliList.length,
    loading,
    submitting,
    error,
    successMessage,
    search,
    isFormOpen,
    isDeleteOpen,
    selectedPoli,
    formMode,

    // Actions
    setSearch,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeFormModal,
    closeDeleteModal,
    handleFormSubmit,
    handleDeleteConfirm,
    clearNotifications,
    refresh: fetchPoliList,
  };
}
