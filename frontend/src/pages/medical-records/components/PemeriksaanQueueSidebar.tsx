import React from "react";
import { Stethoscope, RefreshCw, Clock } from "lucide-react";
import type { RegistrasiItem } from "@/types/registrasi.types.js";

interface PemeriksaanQueueSidebarProps {
  queues: RegistrasiItem[];
  selectedQueueId: string | null;
  loading: boolean;
  activeFilter: "SIAP" | "SELESAI" | "ALL";
  onSelectQueue: (queue: RegistrasiItem) => void;
  onFilterChange: (filter: "SIAP" | "SELESAI" | "ALL") => void;
  onRefresh: () => void;
}

export const PemeriksaanQueueSidebar: React.FC<PemeriksaanQueueSidebarProps> = ({
  queues,
  selectedQueueId,
  loading,
  activeFilter,
  onSelectQueue,
  onFilterChange,
  onRefresh,
}) => {
  const filteredQueues = queues.filter((item) => {
    if (activeFilter === "SIAP") {
      return item.status === "MENUNGGU" || item.status === "CHECK_IN" || item.status === "PEMERIKSAAN";
    }
    if (activeFilter === "SELESAI") {
      return item.status === "SELESAI";
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHECK_IN":
        return <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">Check In</span>;
      case "PEMERIKSAAN":
        return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200 animate-pulse">Sedang Periksa</span>;
      case "SELESAI":
        return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 border border-gray-200">Selesai</span>;
      default:
        return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">Menunggu</span>;
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
      {/* Sidebar Header */}
      <div className="border-b border-gray-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope size={18} className="text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-900">Antrean Pasien Hari Ini</h2>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Refresh Antrean"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1 text-[11px] font-semibold text-gray-600">
          <button
            type="button"
            onClick={() => onFilterChange("SIAP")}
            className={`rounded-lg py-1.5 transition-colors ${
              activeFilter === "SIAP"
                ? "bg-white text-emerald-700 shadow-xs"
                : "hover:text-gray-900"
            }`}
          >
            Siap Periksa
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("SELESAI")}
            className={`rounded-lg py-1.5 transition-colors ${
              activeFilter === "SELESAI"
                ? "bg-white text-emerald-700 shadow-xs"
                : "hover:text-gray-900"
            }`}
          >
            Selesai
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("ALL")}
            className={`rounded-lg py-1.5 transition-colors ${
              activeFilter === "ALL"
                ? "bg-white text-emerald-700 shadow-xs"
                : "hover:text-gray-900"
            }`}
          >
            Semua ({queues.length})
          </button>
        </div>
      </div>

      {/* Queue Item List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {loading && queues.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            <RefreshCw size={18} className="mx-auto mb-2 animate-spin text-emerald-600" />
            Memuat daftar antrean...
          </div>
        ) : filteredQueues.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 space-y-1">
            <Clock size={20} className="mx-auto text-gray-300" />
            <p className="font-semibold text-gray-600">Belum Ada Antrean Pasien</p>
            <p className="text-[11px] text-gray-400">Tidak ada pasien pada kategori ini.</p>
          </div>
        ) : (
          filteredQueues.map((item) => {
            const isSelected = item.id === selectedQueueId;
            const patientName = item.pasien?.nama || "Pasien Noname";

            return (
              <div
                key={item.id}
                onClick={() => onSelectQueue(item)}
                className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex min-h-[1.75rem] min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg bg-emerald-100 px-2 py-0.5 font-mono text-xs font-bold text-emerald-800">
                      {item.nomorAntrean}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 truncate max-w-[160px]">
                        {patientName}
                      </h3>
                      <p className="text-[10px] font-mono text-gray-500">
                        RM: {item.pasien?.noRekamMedis || "-"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2 text-[11px] text-gray-500">
                  <span className="truncate max-w-[140px] text-gray-600 font-medium">
                    {item.poli?.nama}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    {item.jenisPembayaran}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
