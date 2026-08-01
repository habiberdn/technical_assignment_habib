import React from "react";
import { UserPlus, Search, RefreshCw, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext.js";
import { useUsers } from "@/hooks/useUsers.js";
import { StaffStatCards } from "./components/StaffStatCards.js";
import { StaffTable } from "./components/StaffTable.js";
import { StaffModalForm } from "./components/StaffModalForm.js";
import { ResetPasswordModal } from "./components/ResetPasswordModal.js";
import { ConfirmStatusModal } from "./components/ConfirmStatusModal.js";

export const StaffListPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const {
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
  } = useUsers();

  return (
    <div className="space-y-5 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Kelola Staff & Pengguna</h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Manajemen akun pengguna SIMRS MediKlinik, penugasan Poliklinik, dan kontrol hak akses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchUsers()}
            title="Refresh Data"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-2xs hover:bg-gray-50 transition cursor-pointer"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
          >
            <UserPlus size={16} />
            + Tambah Staff Baru
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <StaffStatCards stats={stats} />

      {/* Success Alert */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={queryParams.search || ""}
            onChange={(e) => handleQueryChange("search", e.target.value)}
            placeholder="Cari berdasarkan nama atau username..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 py-2 text-xs text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Filter Role */}
          <select
            value={queryParams.role || "all"}
            onChange={(e) => handleQueryChange("role", e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none transition"
          >
            <option value="all">Semua Role</option>
            <option value="ADMIN">Administrator</option>
            <option value="DOKTER">Dokter (DPJP)</option>
            <option value="PETUGAS_PENDAFTARAN">Petugas Pendaftaran</option>
          </select>

          {/* Filter Poli */}
          <select
            value={queryParams.poliId || "all"}
            onChange={(e) => handleQueryChange("poliId", e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none transition"
          >
            <option value="all">Semua Poliklinik</option>
            {poliList.map((p) => {
              const cleanName = p.nama.replace(/\s*\(.*?\)/g, "").replace(/\s*\[.*?\]/g, "").trim();
              return (
                <option key={p.id} value={p.id}>
                  {cleanName}
                </option>
              );
            })}
          </select>

          {/* Filter Status Aktif */}
          <select
            value={queryParams.isActive || "all"}
            onChange={(e) => handleQueryChange("isActive", e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none transition"
          >
            <option value="all">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <StaffTable
        users={users}
        loading={loading}
        currentUserId={currentUser?.id || ""}
        onEdit={openEditModal}
        onToggleStatus={openConfirmStatusModal}
        onResetPassword={openResetModal}
      />

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs text-xs text-gray-500">
          <span>
            Menampilkan halaman <strong className="text-gray-900 font-mono">{meta.page}</strong> dari{" "}
            <strong className="text-gray-900 font-mono">{meta.totalPages}</strong> (Total {meta.total} staff)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleQueryChange("page", meta.page - 1)}
              disabled={meta.page <= 1}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => handleQueryChange("page", meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      <StaffModalForm
        key={selectedUser?.id || formMode}
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={selectedUser}
        poliList={poliList}
        submitting={submitting}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        user={resetTargetUser}
        submitting={submitting}
        onClose={closeResetModal}
        onSubmit={handleResetPasswordSubmit}
      />

      {/* Confirmation Modal for Toggle Status (Active / Nonactive) */}
      <ConfirmStatusModal
        isOpen={isConfirmStatusModalOpen}
        user={confirmStatusTargetUser}
        submitting={submitting}
        onClose={closeConfirmStatusModal}
        onConfirm={handleConfirmStatusToggle}
      />
    </div>
  );
};

export default StaffListPage;
