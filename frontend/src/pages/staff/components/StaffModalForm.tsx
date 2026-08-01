import React, { useState, type FormEvent } from "react";
import { X, UserPlus, Save, Lock, User, ShieldAlert, Building2, KeyRound } from "lucide-react";
import { createUserFormSchema, updateUserFormSchema } from "@/dtos/user.dto.js";
import type { UserItem, UserRole } from "@/types/user.types.js";
import type { Poli } from "@/types/poli.types.js";

interface StaffModalFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData: UserItem | null;
  poliList: Poli[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>) => void;
}

export const StaffModalForm: React.FC<StaffModalFormProps> = ({
  isOpen,
  mode,
  initialData,
  poliList,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(() => {
    if (initialData && mode === "edit") {
      return {
        username: initialData.username || "",
        password: "",
        nama: initialData.nama || "",
        role: initialData.role || ("PETUGAS_PENDAFTARAN" as UserRole),
        poliId: initialData.poliId || "",
        isActive: initialData.isActive ?? true,
      };
    }
    return {
      username: "",
      password: "",
      nama: "",
      role: "PETUGAS_PENDAFTARAN" as UserRole,
      poliId: "",
      isActive: true,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "role" && value !== "DOKTER") {
        next.poliId = ""; // Reset poli if not doctor
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const schema = mode === "create" ? createUserFormSchema : updateUserFormSchema;
    const result = schema.safeParse(formData);

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

    const payload: Record<string, unknown> = {
      username: formData.username.trim(),
      nama: formData.nama.trim(),
      role: formData.role,
      poliId: formData.role === "DOKTER" ? formData.poliId || null : null,
      isActive: formData.isActive,
    };

    if (formData.password.trim().length > 0) {
      payload.password = formData.password.trim();
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
              {mode === "create" ? <UserPlus size={20} /> : <Save size={20} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {mode === "create" ? "Tambah Akun Staff Baru" : "Edit Akun Staff"}
              </h2>
              <p className="text-xs text-gray-500">
                {mode === "create"
                  ? "Isi formulir pembuatan akun staff SIMRS baru."
                  : `Perbarui data akun staff '${initialData?.nama}'.`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <User size={13} className="text-gray-500" /> Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              placeholder="Contoh: dr. Ahmad Subagyo, Sp.PD"
              className={`w-full rounded-xl border px-3 py-2 text-xs text-gray-900 transition focus:outline-none ${
                errors.nama ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-emerald-600"
              }`}
            />
            {errors.nama && <p className="mt-1 text-[11px] text-red-600">{errors.nama}</p>}
          </div>

          {/* Username & Role Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Username */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <KeyRound size={13} className="text-gray-500" /> Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Contoh: dr_ahmad"
                className={`w-full rounded-xl border px-3 py-2 text-xs font-mono text-gray-900 transition focus:outline-none ${
                  errors.username ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-emerald-600"
                }`}
              />
              {errors.username && <p className="mt-1 text-[11px] text-red-600">{errors.username}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <ShieldAlert size={13} className="text-gray-500" /> Role Akses <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value as UserRole)}
                className={`w-full rounded-xl border px-3 py-2 text-xs text-gray-900 transition focus:outline-none ${
                  errors.role ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-emerald-600"
                }`}
              >
                <option value="PETUGAS_PENDAFTARAN">Petugas Pendaftaran</option>
                <option value="DOKTER">Dokter (DPJP)</option>
                {formData.role === "ADMIN" && (
                  <option value="ADMIN" disabled>
                    Administrator (Sistem Master)
                  </option>
                )}
              </select>
              {errors.role && <p className="mt-1 text-[11px] text-red-600">{errors.role}</p>}
            </div>
          </div>

          {/* Poliklinik (Visible only if Role === DOKTER) */}
          {formData.role === "DOKTER" && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 space-y-1">
              <label className="block text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                <Building2 size={13} className="text-blue-600" /> Penugasan Poliklinik <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.poliId}
                onChange={(e) => handleChange("poliId", e.target.value)}
                className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-gray-900 transition focus:outline-none ${
                  errors.poliId ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-emerald-600"
                }`}
              >
                <option value="">-- Pilih Poliklinik Tempat Bertugas --</option>
                {poliList.map((p) => {
                  const cleanName = p.nama.replace(/\s*\(.*?\)/g, "").replace(/\s*\[.*?\]/g, "").trim();
                  return (
                    <option key={p.id} value={p.id}>
                      {cleanName}
                    </option>
                  );
                })}
              </select>
              {errors.poliId && <p className="mt-1 text-[11px] text-red-600">{errors.poliId}</p>}
            </div>
          )}

          {/* Kata Sandi */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Lock size={13} className="text-gray-500" />{" "}
              {mode === "create" ? "Kata Sandi" : "Kata Sandi Baru (Kosongkan jika tidak diubah)"}{" "}
              {mode === "create" && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder={mode === "create" ? "Minimal 6 karakter" : "••••••••"}
              className={`w-full rounded-xl border px-3 py-2 text-xs font-mono text-gray-900 transition focus:outline-none ${
                errors.password ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-emerald-600"
              }`}
            />
            {errors.password && <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>}
          </div>

          {/* Status Keaktifan */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="h-4 w-4 rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-gray-700 cursor-pointer">
              Akun Aktif (Dapat Login ke SIMRS)
            </label>
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
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-60 transition cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={14} />
                  {mode === "create" ? "Buat Akun Staff" : "Simpan Perubahan"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
