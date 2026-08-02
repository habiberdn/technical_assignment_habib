import React from "react";
import { usePemeriksaan } from "./hooks/usePemeriksaan.js";

import { PemeriksaanQueueSidebar } from "./components/PemeriksaanQueueSidebar.js";
import { PemeriksaanSOAPForm } from "./components/PemeriksaanSOAPForm.js";
import { PemeriksaanAdminView } from "./components/PemeriksaanAdminView.js";
import { RiwayatMedisModal } from "./components/RiwayatMedisModal.js";
import {
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Users,
  Clock,
  X,
  Filter,
  Calendar,
} from "lucide-react";

export const PemeriksaanPage: React.FC = () => {
  const {
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
  } = usePemeriksaan();

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl flex items-center gap-2">
            <Stethoscope className="text-emerald-600" />
            {user?.role === "ADMIN" ? "Dashboard Monitoring Pemeriksaan (Admin)" : "Ruang Periksa Dokter (SOAP)"}
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            {user?.role === "ADMIN"
              ? "Pantau status ruang periksa seluruh poliklinik & rekam medis pasien secara realtime."
              : "Alur terpadu panggil pasien, periksa rekam medis (SOAP), dan catat resep obat secara realtime."}
          </p>
        </div>

        {/* Filter Controls (Date & Admin Multi-Poli) */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-1.5 border-r border-gray-200 pr-2">
            <Calendar size={15} className="text-emerald-600 shrink-0" />
            <input
              type="date"
              value={selectedDate === "all" ? "" : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || "all")}
              className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, "0");
                const day = String(now.getDate()).padStart(2, "0");
                setSelectedDate(`${year}-${month}-${day}`);
              }}
              className={`rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                selectedDate !== "all" &&
                selectedDate ===
                  `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate("all")}
              className={`rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                selectedDate === "all"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua Tanggal
            </button>
          </div>

          {user?.role === "ADMIN" && (
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-emerald-600 shrink-0" />
              <select
                value={selectedPoli}
                onChange={(e) => {
                  setSelectedPoli(e.target.value);
                  setSelectedDoctor("all");
                }}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="all">Semua Poliklinik</option>
                {poliList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>

              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="all">Semua Dokter</option>
                {doctorList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Admin Realtime Monitoring Stats */}
      {user?.role === "ADMIN" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 shrink-0">
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-gray-400">Total Kunjungan</p>
              <p className="text-base font-bold text-gray-900">{stats.total} <span className="text-xs font-normal text-gray-500">pasien</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-gray-400">Menunggu / Siap</p>
              <p className="text-base font-bold text-amber-700">{stats.waiting} <span className="text-xs font-normal text-gray-500">pasien</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Stethoscope size={18} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-gray-400">Sedang Periksa</p>
              <p className="text-base font-bold text-emerald-700">{stats.inProgress} <span className="text-xs font-normal text-gray-500">pasien</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-gray-400">Selesai Periksa</p>
              <p className="text-base font-bold text-gray-800">{stats.completed} <span className="text-xs font-normal text-gray-500">pasien</span></p>
            </div>
          </div>
        </div>
      )}

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
        <div className="lg:col-span-4 h-full min-h-75 lg:min-h-0">
          <PemeriksaanQueueSidebar
            queues={queues}
            selectedQueueId={selectedQueue?.id || null}
            loading={loading}
            activeFilter={activeFilter}
            onSelectQueue={handleSelectQueue}
            onFilterChange={setActiveFilter}
            onRefresh={fetchTodayQueues}
            onCallQueue={handleCallQueue}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>

        {/* Right Column: SOAP Examination Workspace (Form for Doctor, Executive Summary Card for Admin) */}
        <div className="lg:col-span-8 h-full min-h-125 lg:min-h-0">
          {selectedQueue ? (
            user?.role === "ADMIN" ? (
              <PemeriksaanAdminView
                key={selectedQueue.id}
                queue={selectedQueue}
                onOpenHistory={handleOpenHistory}
              />
            ) : (
              <PemeriksaanSOAPForm
                key={selectedQueue.id}
                queue={selectedQueue}
                submitting={submitting}
                isReadOnly={false}
                onOpenHistory={handleOpenHistory}
                onCallQueue={handleCallQueue}
                onSubmit={handleSubmitSOAP}
              />
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xs">
              <Stethoscope size={36} className="text-gray-300 mb-3" />
              <h3 className="text-sm font-bold text-gray-800">Pilih Pasien Dari Antrean</h3>
              <p className="mt-1 text-xs text-gray-400 max-w-sm">
                Silakan pilih salah satu pasien dari daftar antrean sebelah kiri untuk melihat rekam medis dan status pemeriksaan.
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
};

export default PemeriksaanPage;
