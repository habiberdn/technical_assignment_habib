import React from "react";
import { X, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { UserItem } from "@/types/user.types.js";

interface ConfirmStatusModalProps {
  isOpen: boolean;
  user: UserItem | null;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmStatusModal: React.FC<ConfirmStatusModalProps> = ({
  isOpen,
  user,
  submitting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !user) return null;

  const isDeactivating = user.isActive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-2xs ${
                isDeactivating
                  ? "bg-red-50 text-red-600 border-red-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
            >
              {isDeactivating ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isDeactivating ? "Konfirmasi Nonaktifkan Staff" : "Konfirmasi Aktifkan Staff"}
              </h2>
              <p className="text-xs text-gray-500">Perubahan status akses login pengguna SIMRS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Account Details Box */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 space-y-1">
          <p className="text-xs font-bold text-gray-900">{user.nama}</p>
          <p className="text-xs text-gray-500 font-mono">Username: @{user.username}</p>
          <div className="pt-1 flex items-center gap-2">
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-gray-700 border border-gray-200">
              Role: {user.role}
            </span>
            {user.poli?.nama && (
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-gray-600 border border-gray-200">
                {user.poli.nama.replace(/\s*\(.*?\)/g, "").trim()}
              </span>
            )}
          </div>
        </div>

        {/* Warning / Explanation Message */}
        <div
          className={`mt-4 rounded-xl border p-3.5 text-xs flex items-start gap-2.5 ${
            isDeactivating
              ? "border-red-200 bg-red-50/70 text-red-800"
              : "border-emerald-200 bg-emerald-50/70 text-emerald-800"
          }`}
        >
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            {isDeactivating ? (
              <p>
                Apakah Anda yakin ingin <strong>menonaktifkan akun staff ini</strong>? Akun ini tidak akan dapat login ke SIMRS MediKlinik lagi. Riwayat rekam medis & pendaftaran yang pernah ditangani tetap tersimpan aman.
              </p>
            ) : (
              <p>
                Apakah Anda yakin ingin <strong>mengaktifkan kembali akun staff ini</strong>? Akun ini akan dapat login kembali ke SIMRS MediKlinik menggunakan kata sandi yang terdaftar.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs disabled:opacity-60 transition cursor-pointer ${
              isDeactivating ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {submitting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Memproses...
              </>
            ) : isDeactivating ? (
              "Ya, Nonaktifkan Akun"
            ) : (
              "Ya, Aktifkan Akun"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
