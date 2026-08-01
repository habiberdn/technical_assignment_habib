import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface PoliDeleteModalProps {
  isOpen: boolean;
  poliName?: string;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PoliDeleteModal: React.FC<PoliDeleteModalProps> = ({
  isOpen,
  poliName,
  submitting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
          <AlertTriangle size={24} />
        </div>

        <h3 className="text-base font-bold text-gray-900">Konfirmasi Hapus Poliklinik</h3>
        <p className="mt-1 text-xs text-gray-500">
          Apakah Anda yakin ingin menghapus{" "}
          <span className="font-semibold text-gray-800">"{poliName}"</span>? Tindakan ini tidak dapat dibatalkan dan mensyaratkan tidak ada dokter/registrasi terikat.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition-colors"
          >
            <Trash2 size={14} />
            {submitting ? "Menghapus..." : "Hapus Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoliDeleteModal;
