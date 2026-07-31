import { UserPlus, Search, RefreshCw, AlertCircle, CheckCircle2, X, FileSpreadsheet, Upload } from "lucide-react";
import { usePasien } from "../../hooks/usePasien.js";
import PasienTable from "./components/PasienTable.js";
import PasienPagination from "./components/PasienPagination.js";
import PasienModalForm from "./components/PasienModalForm.js";
import PasienDeleteModal from "./components/PasienDeleteModal.js";
import PasienImportModal from "./components/PasienImportModal.js";

export function PatientListPage() {
  const {
    pasienList,
    meta,
    loading,
    submitting,
    exporting,
    error,
    successMessage,
    search,
    isFormOpen,
    isDeleteOpen,
    isImportOpen,
    selectedPasien,
    formMode,

    setPage,
    handleSearchChange,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openImportModal,
    closeFormModal,
    closeDeleteModal,
    closeImportModal,
    handleFormSubmit,
    handleDeleteConfirm,
    handleExportExcel,
    handleImportSuccess,
    clearNotifications,
    refresh,
  } = usePasien();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Master Data Pasien</h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Database rekam medis & profil pasien terdaftar di klinik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-60">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari nama, NIK, atau RM..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-xs"
            />
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
            Refresh Data
          </button>

          <button
            onClick={openImportModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <Upload size={14} className="text-emerald-600" />
            Import Excel
          </button>

          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <FileSpreadsheet size={15} className={exporting ? "animate-spin text-emerald-600" : "text-emerald-600"} />
            {exporting ? "Mengeksport..." : "Eksport Excel"}
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          >
            <UserPlus size={15} />
            Tambah Pasien
          </button>
        </div>
      </div>

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

      <PasienTable
        pasienList={pasienList}
        loading={loading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <PasienPagination meta={meta} onPageChange={setPage} />

      <PasienModalForm
        isOpen={isFormOpen}
        mode={formMode}
        initialData={selectedPasien}
        submitting={submitting}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <PasienDeleteModal
        isOpen={isDeleteOpen}
        pasienName={selectedPasien?.nama}
        submitting={submitting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />

      <PasienImportModal
        isOpen={isImportOpen}
        onClose={closeImportModal}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}

export default PatientListPage;
