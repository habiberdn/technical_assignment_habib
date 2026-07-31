import React from "react";
import { Edit2, Trash2, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import type { Pasien } from "../../../types/pasien.types.js";

interface PasienTableProps {
  pasienList: Pasien[];
  loading: boolean;
  onEdit: (pasien: Pasien) => void;
  onDelete: (pasien: Pasien) => void;
}

export const PasienTable: React.FC<PasienTableProps> = ({
  pasienList,
  loading,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-5 py-3.5">No. Rekam Medis</th>
              <th className="px-5 py-3.5">Pasien</th>
              <th className="px-5 py-3.5">NIK</th>
              <th className="px-5 py-3.5">Jenis Kelamin</th>
              <th className="px-5 py-3.5">Tgl Lahir</th>
              <th className="px-5 py-3.5">No. Telepon</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-xs text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                    Memuat data pasien...
                  </div>
                </td>
              </tr>
            ) : pasienList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-xs text-gray-400">
                  Belum ada data pasien terdaftar.
                </td>
              </tr>
            ) : (
              pasienList.map((pasien) => {
                const initials = pasien.nama
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "P";

                return (
                  <tr key={pasien.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-emerald-700 font-mono text-xs">
                      {pasien.noRekamMedis}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                          {initials}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800">{pasien.nama}</p>
                          <p className="flex items-center gap-1 text-[11px] text-gray-400">
                            <MapPin size={11} className="shrink-0" />
                            <span className="truncate max-w-[180px]">{pasien.alamat}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <CreditCard size={13} className="text-gray-400 shrink-0" />
                        {pasien.nik}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          pasien.jenisKelamin === "LAKI_LAKI"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-pink-50 text-pink-700 border border-pink-200"
                        }`}
                      >
                        {pasien.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400 shrink-0" />
                        {formatDate(pasien.tanggalLahir)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-gray-400 shrink-0" />
                        {pasien.noTelepon}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(pasien)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          title="Edit Pasien"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(pasien)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Hapus Pasien"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PasienTable;
