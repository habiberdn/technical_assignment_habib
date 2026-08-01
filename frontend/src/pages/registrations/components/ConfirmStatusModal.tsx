import React from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import type { RegistrasiItem, StatusKunjungan } from "@/types/registrasi.types.js";

interface ConfirmStatusModalProps {
  isOpen: boolean;
  reg: RegistrasiItem | null;
  targetStatus: StatusKunjungan | null;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmStatusModal: React.FC<ConfirmStatusModalProps> = ({
  isOpen,
  reg,
  targetStatus,
  submitting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !reg || !targetStatus) return null;

  const isSelesai = targetStatus === "SELESAI";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isSelesai ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              {isSelesai ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isSelesai ? "Konfirmasi Selesai Pelayanan" : "Konfirmasi Perubahan Status"}
              </h3>
              <p className="text-xs text-gray-500">Mencegah ketidaksengajaan tertekan pada antrean.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 space-y-1 text-xs">
          <p className="text-gray-600">
            Apakah Anda yakin ingin mengubah status kunjungan pasien berikut menjadi{" "}
            <span className="font-bold text-emerald-700">{targetStatus}</span>?
          </p>

          <div className="border-t border-gray-200/60 pt-2 text-gray-800 space-y-0.5 font-medium">
            <p>
              Pasien: <span className="font-bold text-gray-900">{reg.pasien?.nama}</span>
            </p>
            <p>
              No. Antrean: <span className="font-mono font-bold text-emerald-700">{reg.nomorAntrean}</span>
            </p>
            <p className="text-gray-500 text-[11px]">
              Poli: {reg.poli?.nama} | Dokter: {reg.dokter?.nama}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-xs disabled:opacity-50 transition-colors ${
              isSelesai ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Memproses..." : isSelesai ? "Ya, Selesaikan" : "Ya, Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  );
};
