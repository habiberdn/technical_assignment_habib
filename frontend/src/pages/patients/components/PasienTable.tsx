import React from "react";
import { Edit2, Trash2, Phone, MapPin, Calendar, CreditCard, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext.js";
import type { Pasien } from "@/types/pasien.types.js";

interface PasienTableProps {
  pasienList: Pasien[];
  loading: boolean;
  onEdit: (pasien: Pasien) => void;
  onDelete: (pasien: Pasien) => void;
  onViewDetail?: (pasien: Pasien) => void;
}

export const PasienTable: React.FC<PasienTableProps> = ({
  pasienList,
  loading,
  onEdit,
  onDelete,
  onViewDetail,
}) => {
  const { user } = useAuth();
  const isManageable = user?.role === "ADMIN" || user?.role === "PETUGAS_PENDAFTARAN";
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

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-xs text-gray-400 shadow-xs">
        <div className="flex justify-center items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
          Memuat data pasien...
        </div>
      </div>
    );
  }

  if (pasienList.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-xs text-gray-400 shadow-xs">
        Belum ada data pasien terdaftar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card List View (Visible on screens < md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {pasienList.map((pasien) => {
          const initials =
            pasien.nama
              .split(/\s+/)
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase() || "P";

          return (
            <div
              key={pasien.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-md space-y-3"
            >
              {/* Top Row: Avatar, Name, RM, Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {initials}
                  </span>
                  <div>
                    {onViewDetail ? (
                      <button
                        onClick={() => onViewDetail(pasien)}
                        className="font-bold text-gray-900 hover:text-emerald-600 hover:underline text-left text-sm"
                      >
                        {pasien.nama}
                      </button>
                    ) : (
                      <p className="font-bold text-gray-900 text-sm">{pasien.nama}</p>
                    )}
                    <span className="inline-block font-mono text-xs font-bold text-emerald-700 mt-0.5">
                      RM: {pasien.noRekamMedis}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 bg-gray-50 p-1 rounded-lg border border-gray-100">
                  {onViewDetail && (
                    <button
                      onClick={() => onViewDetail(pasien)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Detail Pasien"
                    >
                      <Eye size={15} />
                    </button>
                  )}
                  {isManageable && (
                    <>
                      <button
                        onClick={() => onEdit(pasien)}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        title="Edit Pasien"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(pasien)}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Hapus Pasien"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Middle Row: Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-gray-50 py-2.5">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">NIK</span>
                  <span className="font-mono text-gray-800 flex items-center gap-1">
                    <CreditCard size={12} className="text-gray-400 shrink-0" />
                    {pasien.nik}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Jenis Kelamin</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold mt-0.5 ${
                      pasien.jenisKelamin === "LAKI_LAKI"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-pink-50 text-pink-700 border border-pink-200"
                    }`}
                  >
                    {pasien.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tgl Lahir</span>
                  <span className="text-gray-700 flex items-center gap-1">
                    <Calendar size={12} className="text-gray-400 shrink-0" />
                    {formatDate(pasien.tanggalLahir)}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">No. Telepon</span>
                  <a
                    href={`tel:${pasien.noTelepon}`}
                    className="text-gray-700 hover:text-emerald-600 flex items-center gap-1 font-mono"
                  >
                    <Phone size={12} className="text-gray-400 shrink-0" />
                    {pasien.noTelepon}
                  </a>
                </div>
              </div>

              {/* Bottom Row: Alamat */}
              <div className="text-xs text-gray-500 flex items-start gap-1.5">
                <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{pasien.alamat}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (Visible on screens >= md) */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
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
              {pasienList.map((pasien) => {
                const initials =
                  pasien.nama
                    .split(/\s+/)
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase() || "P";

                return (
                  <tr key={pasien.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-emerald-700 font-mono text-xs">
                      {onViewDetail ? (
                        <button
                          onClick={() => onViewDetail(pasien)}
                          className="hover:underline focus:outline-none"
                        >
                          {pasien.noRekamMedis}
                        </button>
                      ) : (
                        pasien.noRekamMedis
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                          {initials}
                        </span>
                        <div>
                          {onViewDetail ? (
                            <button
                              onClick={() => onViewDetail(pasien)}
                              className="font-semibold text-gray-800 hover:text-emerald-600 hover:underline text-left"
                            >
                              {pasien.nama}
                            </button>
                          ) : (
                            <p className="font-semibold text-gray-800">{pasien.nama}</p>
                          )}
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
                        {onViewDetail && (
                          <button
                            onClick={() => onViewDetail(pasien)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Lihat Detail Pasien"
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        {isManageable && (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PasienTable;
