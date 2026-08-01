import React, { useEffect, useState } from "react";
import { X, History, Calendar } from "lucide-react";
import { pemeriksaanService } from "@/services/pemeriksaanService.js";
import type { RiwayatPemeriksaanResponse } from "@/types/pemeriksaan.types.js";

interface RiwayatMedisModalProps {
  isOpen: boolean;
  pasienId: string | null;
  onClose: () => void;
}

export const RiwayatMedisModal: React.FC<RiwayatMedisModalProps> = ({
  isOpen,
  pasienId,
  onClose,
}) => {
  const [data, setData] = useState<RiwayatPemeriksaanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pasienId) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await pemeriksaanService.getRiwayatPemeriksaanPasien(pasienId);
          setData(res);
        } catch (err) {
          console.error("[RiwayatMedisModal fetch error]", err);
          setError("Gagal memuat riwayat rekam medis pasien.");
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [isOpen, pasienId]);

  if (!isOpen || !pasienId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white p-6 shadow-2xl transition-all overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Histori Rekam Medis: {data?.pasien?.nama || "Memuat..."}
              </h2>
              <p className="text-xs text-gray-500 font-mono">
                No. RM: {data?.pasien?.noRekamMedis || "-"} • Total {data?.totalKunjungan || 0} Kunjungan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">
              Memuat histori rekam medis...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              {error}
            </div>
          ) : !data || data.riwayat.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">
              Belum ada histori rekam medis tercatat untuk pasien ini.
            </div>
          ) : (
            data.riwayat.map((exam) => (
              <div key={exam.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Calendar size={14} className="text-emerald-600" />
                    <span>
                      {new Date(exam.createdAt).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                    {exam.registrasi?.poli?.nama} • {exam.registrasi?.dokter?.nama}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-gray-500 block text-[10px] uppercase">Subjektif (Keluhan)</span>
                    <p className="text-gray-800 font-medium">{exam.keluhanSubjective}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-500 block text-[10px] uppercase">Diagnosa (Asesmen)</span>
                    <p className="text-emerald-700 font-bold">{exam.diagnosa}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 rounded-lg bg-white p-2 text-[11px] text-gray-700 border border-gray-100">
                  <div>Tensi: <span className="font-mono font-semibold">{exam.tekananSistolik}/{exam.tekananDiastolik}</span></div>
                  <div>Suhu: <span className="font-mono font-semibold">{exam.suhuTubuh}°C</span></div>
                  <div>BB: <span className="font-mono font-semibold">{exam.beratBadan} kg</span></div>
                  <div>TB: <span className="font-mono font-semibold">{exam.tinggiBadan} cm</span></div>
                </div>

                <div>
                  <span className="font-semibold text-gray-500 block text-[10px] uppercase">Rencana Terapi</span>
                  <p className="text-xs text-gray-700">{exam.rencanaTerapi}</p>
                </div>

                {exam.resep && exam.resep.length > 0 && (
                  <div className="border-t border-gray-200/50 pt-2">
                    <span className="font-semibold text-gray-500 block text-[10px] uppercase mb-1">Resep Obat</span>
                    <div className="flex flex-wrap gap-1.5">
                      {exam.resep.map((r, i) => (
                        <span key={i} className="rounded-md bg-white border border-gray-200 px-2 py-0.5 text-[11px] text-gray-800">
                          {r.namaObat} ({r.dosis} - {r.jumlah} {r.aturanPakai})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-gray-100 pt-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
