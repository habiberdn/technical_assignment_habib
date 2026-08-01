import React from "react";
import { Edit2, Trash2, Building2, Stethoscope, CalendarCheck2 } from "lucide-react";
import type { Poli } from "@/types/poli.types.js";

interface PoliTableProps {
  poliList: Poli[];
  loading: boolean;
  onEdit: (poli: Poli) => void;
  onDelete: (poli: Poli) => void;
}

export const PoliTable: React.FC<PoliTableProps> = ({
  poliList,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-xs text-gray-400 shadow-xs">
        <div className="flex justify-center items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
          Memuat data poliklinik...
        </div>
      </div>
    );
  }

  if (poliList.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-xs text-gray-400 shadow-xs">
        Belum ada data poliklinik terdaftar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card List View (Visible on screens < md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {poliList.map((poli) => (
          <div
            key={poli.id}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-md space-y-3"
          >
            {/* Header: Kode, Nama, Actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Building2 size={20} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-700 border border-emerald-200">
                      {poli.kode}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5">{poli.nama}</h3>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <button
                  onClick={() => onEdit(poli)}
                  className="rounded-md p-1.5 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  title="Edit Poliklinik"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => onDelete(poli)}
                  className="rounded-md p-1.5 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Hapus Poliklinik"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-50 pt-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Stethoscope size={13} />
                <span>{poli._count?.dokter ?? 0} Dokter</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                <CalendarCheck2 size={13} />
                <span>{poli._count?.registrasi ?? 0} Kunjungan</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (Visible on screens >= md) */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3.5">Kode Poli</th>
                <th className="px-5 py-3.5">Nama Poliklinik</th>
                <th className="px-5 py-3.5 text-center">Jumlah Dokter</th>
                <th className="px-5 py-3.5 text-center">Total Registrasi</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {poliList.map((poli) => (
                <tr key={poli.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700 border border-emerald-200">
                      {poli.kode}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Building2 size={18} />
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{poli.nama}</p>
                        <p className="text-xs text-gray-400">Unit Pelayanan Medis</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      <Stethoscope size={13} />
                      <span>{poli._count?.dokter ?? 0} Dokter</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                      <CalendarCheck2 size={13} />
                      <span>{poli._count?.registrasi ?? 0} Kunjungan</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(poli)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        title="Edit Poliklinik"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(poli)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Hapus Poliklinik"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PoliTable;
