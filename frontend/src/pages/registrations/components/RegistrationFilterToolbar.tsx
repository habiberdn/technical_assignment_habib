import React from "react";
import { Search } from "lucide-react";
import type { FiltersState } from "../types/registrationPage.types.js";
import type { Poli } from "@/types/poli.types.js";
import type { DokterItem } from "@/types/registrasi.types.js";
import { STATUS_FILTER_OPTIONS } from "@/constants/registrasi.js";

interface RegistrationFilterToolbarProps {
  filters: FiltersState;
  poliList: Poli[];
  doctorList: DokterItem[];
  onFilterChange: (field: keyof FiltersState, value: string) => void;
}

export const RegistrationFilterToolbar: React.FC<RegistrationFilterToolbarProps> = ({
  filters,
  poliList,
  doctorList,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-xs sm:grid-cols-2 lg:grid-cols-5">
      {/* Search */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">Cari Pasien / RM / No. Antrean</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Cari kata kunci..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
          />
        </div>
      </div>

      {/* Date Range */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">Tanggal Kunjungan</label>
        <input
          type="date"
          value={filters.dateRange}
          onChange={(e) => onFilterChange("dateRange", e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
        />
      </div>

      {/* Filter Poli */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">Poliklinik</label>
        <select
          value={filters.selectedPoli}
          onChange={(e) => onFilterChange("selectedPoli", e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
        >
          <option value="all">Semua Poliklinik</option>
          {poliList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Dokter */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">Dokter</label>
        <select
          value={filters.selectedDoctor}
          onChange={(e) => onFilterChange("selectedDoctor", e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
        >
          <option value="all">Semua Dokter</option>
          {doctorList.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Status */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700">Status Kunjungan</label>
        <select
          value={filters.selectedStatus}
          onChange={(e) => onFilterChange("selectedStatus", e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
