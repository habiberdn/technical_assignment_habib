import React from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext.js";
import type { RegistrasiItem, StatusKunjungan } from "@/types/registrasi.types.js";
import { STATUS_STYLES } from "../types/registrationPage.types.js";

interface RegistrationTableProps {
  registrations: RegistrasiItem[];
  paginatedRegistrations: RegistrasiItem[];
  callingId: string | null;
  page: number;
  totalPages: number;
  onCallQueue: (reg: RegistrasiItem) => void;
  onUpdateStatus: (reg: RegistrasiItem, status: StatusKunjungan) => void;
  onPageChange: (newPage: number) => void;
}

export const RegistrationTable: React.FC<RegistrationTableProps> = ({
  registrations,
  paginatedRegistrations,
  callingId,
  page,
  totalPages,
  onCallQueue,
  onUpdateStatus,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCheckIn = user?.role === "ADMIN" || user?.role === "PETUGAS_PENDAFTARAN";
  const canExamineOrFinish = user?.role === "ADMIN" || user?.role === "DOKTER";
  return (
    <div className="space-y-4">
      {/* Mobile Card List View (< md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {paginatedRegistrations.map((reg) => {
          const initials =
            reg.pasien?.nama
              ?.split(/\s+/)
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase() || "P";

          const badgeStyle = STATUS_STYLES[reg.status] || STATUS_STYLES.MENUNGGU;

          return (
            <div
              key={reg.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {initials}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{reg.pasien?.nama}</h3>
                    <p className="text-xs text-gray-400 font-mono">RM: {reg.pasien?.noRekamMedis}</p>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700 border border-emerald-200">
                  {reg.nomorAntrean}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-gray-50 py-2.5">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Poli &amp; Dokter</span>
                  <span className="font-semibold text-gray-800 block truncate">{reg.poli?.nama}</span>
                  <span className="text-gray-500 text-[11px] block truncate">{reg.dokter?.nama}</span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Pembayaran &amp; Status</span>
                  <span className="font-mono text-gray-700 block text-[11px]">{reg.jenisPembayaran}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold mt-1 border ${badgeStyle.className}`}
                  >
                    {badgeStyle.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-gray-500 italic truncate max-w-45">
                  &ldquo;{reg.keluhanAwal}&rdquo;
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onCallQueue(reg)}
                    disabled={callingId === reg.id || reg.statusAntrean === "SELESAI"}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40"
                    title="Panggil Pasien Ini"
                  >
                    <Volume2 size={13} />
                    Panggil
                  </button>

                  {reg.status === "MENUNGGU" && canCheckIn && (
                    <button
                      onClick={() => onUpdateStatus(reg, "CHECK_IN")}
                      className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                    >
                      Check In
                    </button>
                  )}

                  {reg.status === "CHECK_IN" && reg.statusAntrean === "DIPANGGIL" && canExamineOrFinish && (
                    <button
                      onClick={() => onUpdateStatus(reg, "PEMERIKSAAN")}
                      className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                    >
                      Periksa
                    </button>
                  )}

                  {reg.status === "PEMERIKSAAN" && (
                    user?.role === "DOKTER" ? (
                      <button
                        onClick={() => navigate("/pemeriksaan")}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                      >
                        Isi SOAP
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        Menunggu SOAP Dokter
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (≥ md) */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3.5 text-start">No. Antrean</th>
                <th className="px-5 py-3.5 text-start">Pasien</th>
                <th className="px-5 py-3.5 text-start">Poliklinik &amp; Dokter</th>
                <th className="px-5 py-3.5 text-start">Keluhan Awal</th>
                <th className="px-5 py-3.5 text-start">Penjamin</th>
                <th className="px-5 py-3.5 text-start">Status</th>
                <th className="px-5 py-3.5 text-start">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRegistrations.map((reg) => {
                const initials =
                  reg.pasien?.nama
                    ?.split(/\s+/)
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase() || "P";

                const badgeStyle = STATUS_STYLES[reg.status] || STATUS_STYLES.MENUNGGU;

                return (
                  <tr key={reg.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700 border border-emerald-200">
                        {reg.nomorAntrean}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                          {initials}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{reg.pasien?.nama}</p>
                          <p className="text-xs text-gray-400 font-mono">RM: {reg.pasien?.noRekamMedis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800">{reg.poli?.nama}</p>
                      <p className="text-xs text-gray-400">{reg.dokter?.nama}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 max-w-50 truncate">
                      {reg.keluhanAwal}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-700">
                      {reg.jenisPembayaran}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${badgeStyle.className}`}
                      >
                        {badgeStyle.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right flex justify-start">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onCallQueue(reg)}
                          disabled={callingId === reg.id || reg.statusAntrean === "SELESAI"}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 transition-colors cursor-pointer"
                          title="Panggil Antrean"
                        >
                          <Volume2 size={14} />
                          Panggil
                        </button>

                        {reg.status === "MENUNGGU" && canCheckIn && (
                          <button
                            onClick={() => onUpdateStatus(reg, "CHECK_IN")}
                            className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            Check In
                          </button>
                        )}

                        {reg.status === "CHECK_IN" && reg.statusAntrean === "DIPANGGIL" && canExamineOrFinish && (
                          <button
                            onClick={() => onUpdateStatus(reg, "PEMERIKSAAN")}
                            className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            Periksa
                          </button>
                        )}

                        {reg.status === "PEMERIKSAAN" && (
                          user?.role === "DOKTER" ? (
                            <button
                              onClick={() => navigate("/pemeriksaan")}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                              Isi SOAP
                            </button>
                          ) : (
                            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                              Menunggu SOAP Dokter
                            </span>
                          )
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

      {/* Pagination Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-3 text-xs text-gray-600 border-t border-gray-100">
        <div>
          Menampilkan <span className="font-semibold text-gray-900">{paginatedRegistrations.length}</span> dari{" "}
          <span className="font-semibold text-gray-900">{registrations.length}</span> pendaftaran
        </div>

        <div className="flex items-center gap-1 justify-center sm:justify-end">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Sebelumnya</span>
          </button>

          <span className="px-3 font-semibold text-gray-800">
            Halaman {page} dari {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span>Berikutnya</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
