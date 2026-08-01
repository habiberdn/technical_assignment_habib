import React from "react";
import { CheckCircle2 } from "lucide-react";
import type { RegistrasiItem } from "@/types/registrasi.types.js";

interface TicketModalProps {
  ticketModalData: RegistrasiItem | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticketModalData, onClose }) => {
  if (!ticketModalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={28} />
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900">Pendaftaran Berhasil!</h3>
          <p className="text-xs text-gray-500 mt-0.5">Tiket antrean pasien telah diterbitkan.</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
          <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
            Nomor Antrean
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono">
            {ticketModalData.nomorAntrean}
          </div>
          <div className="border-t border-emerald-200/60 pt-2 text-xs text-gray-700 space-y-0.5">
            <p className="font-bold text-gray-900">{ticketModalData.pasien?.nama}</p>
            <p className="text-gray-500">
              {ticketModalData.poli?.nama} — {ticketModalData.dokter?.nama}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
