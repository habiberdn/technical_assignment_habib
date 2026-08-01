import React, { useState, type FormEvent } from "react";
import { X, KeyRound, Save, AlertCircle } from "lucide-react";
import { resetPasswordFormSchema } from "@/dtos/user.dto.js";
import type { UserItem } from "@/types/user.types.js";

interface ResetPasswordModalProps {
  isOpen: boolean;
  user: UserItem | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  user,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !user) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = resetPasswordFormSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(newPassword);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shadow-2xs">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Reset Kata Sandi Staff</h2>
              <p className="text-xs text-gray-500">Akun: <strong className="text-gray-900">{user.nama}</strong> (@{user.username})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Warning info */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>Kata sandi staff ini akan diperbarui dan staff dapat login menggunakan kata sandi baru.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Kata Sandi Baru <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
              placeholder="Minimal 6 karakter"
              className={`w-full rounded-xl border px-3 py-2 text-xs font-mono text-gray-900 transition focus:outline-none ${
                errors.newPassword ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-emerald-600"
              }`}
            />
            {errors.newPassword && <p className="mt-1 text-[11px] text-red-600">{errors.newPassword}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              placeholder="Ketik ulang kata sandi baru"
              className={`w-full rounded-xl border px-3 py-2 text-xs font-mono text-gray-900 transition focus:outline-none ${
                errors.confirmPassword ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-emerald-600"
              }`}
            />
            {errors.confirmPassword && <p className="mt-1 text-[11px] text-red-600">{errors.confirmPassword}</p>}
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
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 disabled:opacity-60 transition cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Reset Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
