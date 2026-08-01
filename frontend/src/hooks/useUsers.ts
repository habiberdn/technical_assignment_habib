import { useState, useEffect, useCallback, useMemo } from "react";
import { isAxiosError } from "axios";
import { userService } from "@/services/userService.js";
import { poliService } from "@/services/poliService.js";
import type { UserItem, UserPaginationMeta, UserQueryParams } from "@/types/user.types.js";
import type { Poli } from "@/types/poli.types.js";

export function useUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [poliList, setPoliList] = useState<Poli[]>([]);
  const [meta, setMeta] = useState<UserPaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [queryParams, setQueryParams] = useState<UserQueryParams>({
    search: "",
    role: "all",
    poliId: "all",
    isActive: "all",
    page: 1,
    limit: 10,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [resetTargetUser, setResetTargetUser] = useState<UserItem | null>(null);

  const [isConfirmStatusModalOpen, setIsConfirmStatusModalOpen] = useState<boolean>(false);
  const [confirmStatusTargetUser, setConfirmStatusTargetUser] = useState<UserItem | null>(null);

  // Fetch Poli reference list
  useEffect(() => {
    const fetchPolis = async () => {
      try {
        const polis = await poliService.getAllPoli();
        setPoliList(polis);
      } catch {
        // ignore
      }
    };
    fetchPolis();
  }, []);

  // Fetch Users List
  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await userService.getUsers(queryParams);
        if (isMounted) {
          setUsers(res.data);
          setMeta(res.meta);
        }
      } catch (err: unknown) {
        console.error("[useUsers fetch error]", err);
        if (isMounted) {
          const msg = isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Tidak dapat memuat daftar pengguna / staff. Silakan coba kembali.";
          setError(msg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [queryParams]);

  // Manual refresh callback
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await userService.getUsers(queryParams);
      setUsers(res.data);
      setMeta(res.meta);
    } catch (err: unknown) {
      console.error("[useUsers fetch error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Tidak dapat memuat daftar pengguna / staff. Silakan coba kembali.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  // Handler for Query Param Changes
  const handleQueryChange = (key: keyof UserQueryParams, value: string | number) => {
    setQueryParams((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? (value as number) : 1, // Reset page to 1 on filter changes
    }));
  };

  // Open Create Modal
  const openCreateModal = () => {
    setFormMode("create");
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: UserItem) => {
    setFormMode("edit");
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedUser(null);
  };

  // Open Reset Password Modal
  const openResetModal = (user: UserItem) => {
    setResetTargetUser(user);
    setIsResetModalOpen(true);
  };

  const closeResetModal = () => {
    setIsResetModalOpen(false);
    setResetTargetUser(null);
  };

  const openConfirmStatusModal = (user: UserItem) => {
    setConfirmStatusTargetUser(user);
    setIsConfirmStatusModalOpen(true);
  };

  const closeConfirmStatusModal = () => {
    setIsConfirmStatusModalOpen(false);
    setConfirmStatusTargetUser(null);
  };

  // Create or Update User Submit
  const handleFormSubmit = async (payload: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      setError(null);

      if (formMode === "create") {
        const created = await userService.createUser(payload);
        setSuccessMessage(`Akun staff '${created.nama}' (${created.username}) berhasil dibuat!`);
      } else if (formMode === "edit" && selectedUser) {
        const updated = await userService.updateUser(selectedUser.id, payload);
        setSuccessMessage(`Data staff '${updated.nama}' berhasil diperbarui.`);
      }

      closeFormModal();
      await fetchUsers();
    } catch (err: unknown) {
      console.error("[useUsers submit error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Gagal menyimpan data staff. Silakan periksa kembali isian formulir.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Active Status Executed After Confirmation
  const handleConfirmStatusToggle = async () => {
    if (!confirmStatusTargetUser) return;
    try {
      setSubmitting(true);
      setError(null);
      const updated = await userService.toggleUserStatus(confirmStatusTargetUser.id);
      const statusText = updated.isActive ? "diaktifkan" : "dinonaktifkan";
      setSuccessMessage(`Akun '${updated.nama}' (${updated.username}) berhasil ${statusText}.`);
      closeConfirmStatusModal();
      await fetchUsers();
    } catch (err: unknown) {
      console.error("[useUsers toggle status error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Gagal mengubah status akun staff.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset Password Submit
  const handleResetPasswordSubmit = async (newPassword: string) => {
    if (!resetTargetUser) return;
    try {
      setSubmitting(true);
      setError(null);
      await userService.resetPassword(resetTargetUser.id, newPassword);
      setSuccessMessage(`Kata sandi akun '${resetTargetUser.nama}' berhasil direset.`);
      closeResetModal();
    } catch (err: unknown) {
      console.error("[useUsers reset password error]", err);
      const msg = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Gagal memproses reset kata sandi.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Summary Metrics
  const stats = useMemo(() => {
    const total = meta.total;
    const dokterCount = users.filter((u) => u.role === "DOKTER").length;
    const petugasCount = users.filter((u) => u.role === "PETUGAS_PENDAFTARAN").length;
    const activeCount = users.filter((u) => u.isActive).length;
    return { total, dokterCount, petugasCount, activeCount };
  }, [users, meta.total]);

  return {
    users,
    poliList,
    meta,
    queryParams,
    loading,
    submitting,
    error,
    successMessage,
    stats,
    isFormModalOpen,
    formMode,
    selectedUser,
    isResetModalOpen,
    resetTargetUser,
    isConfirmStatusModalOpen,
    confirmStatusTargetUser,
    setSuccessMessage,
    setError,
    handleQueryChange,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openResetModal,
    closeResetModal,
    openConfirmStatusModal,
    closeConfirmStatusModal,
    handleFormSubmit,
    handleConfirmStatusToggle,
    handleResetPasswordSubmit,
    fetchUsers,
  };
}
