import { Plus, Search, RefreshCw, AlertCircle, CheckCircle2, X } from "lucide-react";
import { usePoli } from "@/hooks/usePoli.js";
import PoliTable from "./components/PoliTable.js";
import PoliModalForm from "./components/PoliModalForm.js";
import PoliDeleteModal from "./components/PoliDeleteModal.js";

export function PoliListPage() {
  const {
    poliList,
    loading,
    submitting,
    error,
    successMessage,
    search,
    isFormOpen,
    isDeleteOpen,
    selectedPoli,
    formMode,

    setSearch,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeFormModal,
    closeDeleteModal,
    handleFormSubmit,
    handleDeleteConfirm,
    clearNotifications,
    refresh,
  } = usePoli();

  return (
    <div className="space-y-6">
      {/* Header Toolbar Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Master Data Poliklinik</h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Kelola unit layanan poliklinik dan spesialisasi medis klinik.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
          <div className="relative w-full sm:w-auto sm:min-w-60">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode atau nama poli..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
              Refresh
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            >
              <Plus size={15} />
              Tambah Poliklinik
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={clearNotifications}
            className="rounded-md p-1 text-red-600 hover:bg-red-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={clearNotifications}
            className="rounded-md p-1 text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Poli Data Table */}
      <PoliTable
        poliList={poliList}
        loading={loading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* Create / Edit Form Modal */}
      <PoliModalForm
        isOpen={isFormOpen}
        mode={formMode}
        initialData={selectedPoli}
        submitting={submitting}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <PoliDeleteModal
        isOpen={isDeleteOpen}
        poliName={selectedPoli?.nama}
        submitting={submitting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default PoliListPage;